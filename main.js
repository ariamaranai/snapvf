(async () => {
  let frameRects;
  let d = document;
  let { scrollLeft, scrollTop } = d.scrollingElement;
  let fullscreenElement = d.fullscreenElement;
  let video = fullscreenElement;
  if (!(video instanceof HTMLVideoElement)) {
    let wndW = innerWidth;
    let wndH = innerHeight;
    let target = video ?? d;
    let videos = target.getElementsByTagName("video");
    let maxVisibleSize = 0;
    let i = videos.length;
    while (i) {
      let _video = videos[--i];
      if (_video.readyState) {
        let { right, x, bottom, y } = _video.getBoundingClientRect();        
        let visibleW = (right < wndW ? right : wndW) - (x < 0 ? 0 : x);
        let visibleH = (bottom < wndH ? bottom : wndH) - (y < 0 ? 0 : y);
        let visibleSize = visibleW * visibleH;
        maxVisibleSize < visibleSize && (
          maxVisibleSize = visibleSize,
          video = _video
        );
      }
    }
    if (self == top) {
      let iframes = target.getElementsByTagName("iframe");
      let i = iframes.length;
      while (i) {
        let rect = iframes[--i].getBoundingClientRect();
        let { right, x, bottom, y } = rect;
        ((right < wndW ? right : wndW) - (x < 0 ? 0 : x) * (bottom < wndH ? bottom : wndH) - (y < 0 ? 0 : y)) > 32767 &&
        (frameRects ??= []).push((rect.x += scrollLeft, rect.y += scrollTop, rect));
      }
    }
    video ??= fullscreenElement?.shadowRoot?.querySelector("video");
  }
  if (video?.readyState) {
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