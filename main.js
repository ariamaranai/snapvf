(async () => {
  let d = document;
  let video = d.body.getElementsByTagName("video");
  let i = video.length;
  if (i) {
    let p = chrome.runtime.connect();
    if (d.head.childElementCount == 1)
      (video = video[0]).pause();
    else {
      let index = 0;
      let maxWidth = 0;
      let width = 0;
      while (
        video[--i].readyState &&
        maxWidth < (width = video[i].offsetWidth) &&
        (maxWidth = width, index = i),
        i
      );

      (video = video[index]).pause();
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
    let { scrollLeft, scrollTop } = d.scrollingElement;
    scrollTo(0, 0);
    (i = d.fullscreenElement) && d.exitFullscreen();
    d = video.getAttribute("style");
    video.controls = video.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647");
    p.onDisconnect.addListener(async () => (
      video.controls = 1,
      video.style = d,
      scrollTo(scrollLeft, scrollTop),
      i && await video.requestFullscreen()
    ));
    p.postMessage([video.currentTime, video.videoWidth, video.videoHeight, devicePixelRatio]);
  }
})();