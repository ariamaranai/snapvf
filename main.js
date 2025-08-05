(async () => {
  let d = document;
  let videos = d.getElementsByTagName("video");
  let videoLen = videos.length;
  if (videoLen) {
    let video = videos[0];
    let p = chrome.runtime.connect();
    let { scrollLeft, scrollTop } = d.scrollingElement;
    if (videoLen < 2)
      video.pause();
    else {
      let cx = (innerWidth + scrollLeft) / 2;
      let cy = (innerHeight + scrollTop) / 2; 
      let minds = 2e9;
      let i = 0;
      while (i < videos.length) {
        let _video = videos[i];
        if (_video.readyState) {
          let rect = _video.getBoundingClientRect();
          let ds = Math.abs(cx - (rect.width / 2 + rect.x)) + Math.abs(cy - (rect.height / 2 + rect.y));
          ds < minds && (
            minds = ds,
            video = _video
          );
        }
        ++i;
      }
      video.pause();
      let cvs = new OffscreenCanvas(video.videoWidth, video.videoHeight);
      let ctx = cvs.getContext("bitmaprenderer");
      try {
        ctx.transferFromImageBitmap(await createImageBitmap(video));
        let url = URL.createObjectURL(await cvs.convertToBlob());
        p.onDisconnect.addListener(() => URL.revokeObjectURL(url));
        p.postMessage([video.currentTime, url]);
        return;
      } catch {}
    }
    scrollTo(0, 0);
    let isFullscreen = d.fullscreenElement;
    isFullscreen && d.exitFullscreen();
    let style = video.getAttribute("style");
    video.controls = video.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647");
    p.onDisconnect.addListener(async () => (
      video.controls = 1,
      video.style = style,
      scrollTo(scrollLeft, scrollTop),
      isFullscreen && await video.requestFullscreen()
    ));
    p.postMessage([video.currentTime, video.videoWidth, video.videoHeight, devicePixelRatio]);
  }
})();