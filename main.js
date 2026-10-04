(d => {
  let frameRects;
  let { scrollLeft, scrollTop } = d.scrollingElement;
  let fullscreenElement = d.fullscreenElement;
  let video = fullscreenElement;
  if (video?.localName !== "video") {
    let wndW = innerWidth;
    let wndH = innerHeight;
    let target = video ?? d;
    let maxVisibleSize = 0;
    let videos = target.getElementsByTagName("video");
    let i = videos.length;
    while (i) {
      let _video = videos[--i];
      if (_video.readyState) {
        let { right: $0, x, bottom, y } = _video.getBoundingClientRect();
        maxVisibleSize < ($0 = (($0 < wndW ? $0 : wndW) - (x < 0 ? 0 : x)) * ((bottom < wndH ? bottom : wndH) - (y < 0 ? 0 : y))) && (
          maxVisibleSize = $0,
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
    createImageBitmap(video)
    .then(r => chrome.runtime.sendMessage([video.currentTime, r]))
    .catch(() => {
      let p = chrome.runtime.connect();
      let controls = video.controls;
      let style = video.getAttribute("style");
      video.controls = video.setAttribute("style", style + ";position:relative;z-index:2147483647");
      let rect = video.getBoundingClientRect();
      let m = [video.currentTime, video.videoWidth, video.videoHeight, rect.x, rect.y, rect.width, rect.height, devicePixelRatio];
      frameRects ? m.push(frameRects) : (m[3] += scrollLeft, m[4] += scrollTop);
      p.postMessage(m);
      p.onDisconnect.addListener(() => (video.controls = controls, video.setAttribute("style", style)));
    });
    video.pause();
  } else
    frameRects && chrome.runtime.sendMessage(frameRects);
})(document);
