(async () => {
  let frameRects;
  let { scrollLeft, scrollTop } = document.scrollingElement;
  let fullscreenElement = document.fullscreenElement;
  let video = fullscreenElement;
  if (!video instanceof HTMLVideoElement) {
    let target = video ?? document;
    let videos = target.getElementsByTagName("VIDEO");
    let { max, min } = Math;
    let maxVisibleSize = 0;
    let i = 0;
    while (i < videos.length) {
      let _video = videos[i];
      if (_video.readyState) {
        let rect = _video.getBoundingClientRect();
        let visibleSize = max(min(rect.right, innerWidth) - max(rect.x, 0), 0) * max(min(rect.bottom, innerHeight) - max(rect.y, 0), 0);
        maxVisibleSize < visibleSize && (
          maxVisibleSize = visibleSize,
          video = _video
        );
      }
      ++i;
    }
    if (self == top) {
      let iframes = target.getElementsByTagName("iframe");
      let i = 0;
      while (i < iframes.length) {
        let rect = iframes[i].getBoundingClientRect();
        (max(min(rect.right, innerWidth) - max(rect.x, 0), 0) * max(min(rect.bottom, innerHeight) - max(rect.y, 0), 0)) > 32767 &&
        (frameRects ??= []).push(rect.x += scrollLeft, rect.y += scrollTop, rect);
        ++i;
      }
    }
    video ?? ((video = fullscreenElement?.shadowRoot?.querySelector("VIDEO")) && !video.readyState || (video = 0));
  } else
    video.readyState || (video = 0);
  if (video) {
    video.pause();
    let currentTime = video.currentTime;
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;
    try {
      let cvs = new OffscreenCanvas(videoWidth, videoHeight);
      cvs.getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(video));
      let fr = new FileReader;
      fr.readAsDataURL(await cvs.convertToBlob());
      fr.onload = () => chrome.runtime.sendMessage([currentTime, fr.result]);
    } catch {
      let p = chrome.runtime.connect();
      let controls = video.controls;
      let style = video.getAttribute("style");
      video.controls = video.setAttribute("style", style + ";position:relative;z-index:2147483647");
      let rect = video.getBoundingClientRect();
      let m = [currentTime, videoWidth, videoHeight, rect.x, rect.y, rect.width, rect.height, devicePixelRatio];
      frameRects ? m.push(frameRects) : (m[3] += scrollLeft, m[4] += scrollTop);
      p.postMessage(m);
      p.onDisconnect.addListener(() => (video.controls = controls, video.setAttribute("style", style)));
    }
  } else
    frameRects && chrome.runtime.sendMessage(frameRects);
})();