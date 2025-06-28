(async () => {
  let d = document;
  let video = d.body.getElementsByTagName("video");
  let i = video.length;
  if (i) {
    let p = await chrome.runtime.connect();
    if (d.head.childElementCount != 1) {
      let index = 0;
      let maxWidth = 0;
      let width = 0;
      while (
        maxWidth < (width = video[--i].offsetWidth) && (maxWidth = width, index = i),
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
    } else
      (video = video[0]).pause();

    let { scrollLeft, scrollTop } = d.scrollingElement;
    scrollTo(0, 0);
    let { fullscreenElement } = d;
    d.exitFullscreen(i = video.getAttribute("style"));
    video.controls = video.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647");
    p.onDisconnect.addListener(async () => (
      video.controls = d,
      video.style = i,
      scrollTo(scrollLeft, scrollTop),
      fullscreenElement &&
      await video.requestFullscreen()
    ));
    p.postMessage([video.currentTime, video.videoWidth, video.videoHeight, devicePixelRatio]);
  }
})();