{
  let tabId;
  let title;
  chrome.runtime.onUserScriptConnect.addListener(p =>
    p.onMessage.addListener(m =>
      chrome.management.getAll(crx => {
        if (crx = crx.find(v => v.name == "fformat")) {
          let f = () => (
            chrome.management.setEnabled(crx, !0),
            chrome.downloads.onCreated.removeListener(f),
            p.disconnect()
          );
          chrome.management.setEnabled(crx = crx.id, !1);
          chrome.downloads.onCreated.addListener(f);
        }
        let t = m[0];
        let n = Math.floor(t % 3600 / 60);
        let filename =
          title.replace(/[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? Math.floor(t / 3600) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = Math.floor(t % 60)) ? n + "s-" : "") +
          Math.floor(((t % 60) - n) * 1000) +
          "ms.png";
        m.length < 4
          ? chrome.downloads.download({
              filename,
              url: m[1]
            })
          : (
            chrome.debugger.attach(tabId = { tabId }, "1.3"),
            chrome.debugger.sendCommand(tabId, "Page.captureScreenshot", {
              captureBeyondViewport: !0,
              clip: {
                x: 0,
                y: 0,
                width: m[1],
                height: m[2],
                scale: m[3]
              }
            }, e => (
              chrome.debugger.detach(tabId),
              chrome.downloads.download({
                filename,
                url: "data:image/png;base64," + e.data
              })
            ))
          )
      })
    )
  );
  let run = (a, b) => {
    tabId = (b ??= a).id;
    title = b.title;
    let { frameId } = a;
    chrome.userScripts.execute({
      target: frameId ? { tabId, frameIds: [a] } : { tabId, allFrames: !0 },
      js: [{ code:
`(async () => {
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
      } catch (e) {}
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
})();`
      }]
    }).catch(() => 0);
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
}
chrome.runtime.onInstalled.addListener(() => (
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.contextMenus.create({
    id: "",
    title: "Snap video frame",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*", "file://*"]
  })
));