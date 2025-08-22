(async () => {
  let { Math, document, innerWidth, innerHeight } = self;
  let { max, min } = Math;
  let videos = document.getElementsByTagName("video");
  let video;
  let maxVisibleSize = 0;
  let i = 0;
  while (i < videos.length) {
    let _video = videos[i];
    if (_video.readyState) {
      let { x, right, y, bottom } = _video.getBoundingClientRect();
      let visibleSize = max(min(right, innerWidth) - max(x, 0), 0) * max(min(bottom, innerHeight) - max(y, 0), 0);
      maxVisibleSize < visibleSize && (
        maxVisibleSize = visibleSize,
        video = _video
      );
    }
    ++i;
  }
  if (video) {
    video.pause();
    let p = chrome.runtime.connect();
    let { currentTime, videoWidth, videoHeight } = video;
    try {
      let cvs = new OffscreenCanvas(videoWidth, videoHeight);
      let ctx = cvs.getContext("bitmaprenderer");
      ctx.transferFromImageBitmap(await createImageBitmap(video));
      let url = URL.createObjectURL(await cvs.convertToBlob());
      p.onDisconnect.addListener(() => URL.revokeObjectURL(url));
      p.postMessage([currentTime, url]);
    } catch {
      let dpr = devicePixelRatio;
      let { scrollLeft, scrollTop } = document.scrollingElement;
      let { x, y, width, height } = video.getBoundingClientRect();
      let { controls } = video;
      let style = video.getAttribute("style");
      video.controls = video.setAttribute("style", style + ";position:relative;z-index:2147483647");
      p.onDisconnect.addListener(() => (video.controls = controls, video.setAttribute("style", style)));
      p.postMessage([currentTime, videoWidth, videoHeight, (x + scrollLeft) * dpr, (y + scrollTop) * dpr, width * dpr, height * dpr]);
    }
  }
})();