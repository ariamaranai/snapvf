{
  let tabId;
  let title;
  let windowId;
  chrome.runtime.onConnect.addListener(port =>
    port.onMessage.addListener(m =>
      chrome.management.getAll(crx => {
        let t = m[0];
        let n = Math.floor(t % 3600 / 60);
        let download = url => (
          chrome.downloads.download({
            filename:
              title.replace(/[|?":/<>*\\]/g, "_") +
              "-" +
              (t >= 3600 ? Math.floor(t / 3600) + "h-" : "") +
              (n ? n + "m-" : "") +
              ((n = Math.floor(t % 60)) ? n + "s-" : "") +
              Math.floor(((t % 60) - n) * 1000) +
              "ms.png",
            url
          }, (crx = crx.find(v => v.name == "fformat")) && (
              chrome.management.setEnabled(crx = crx.id, !1),
              () => (chrome.management.setEnabled(crx, !0))
            )
          ),
          port.disconnect()
        )
        m.length < 4
          ? download(m[1])
          : (
            chrome.debugger.attach(tabId = { tabId: tabId }, "1.3"),
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
              download("data:image/png;base64," + e.data)
            ))
          )
      })
    )
  );
  let run = (a, b) => {
    tabId = (b ??= a).id;
    title = b.title;
    windowId = b.windowId;
    chrome.scripting.executeScript({
      target: (a = a?.frameId) ? { tabId, frameIds: [a] } : { tabId, allFrames: !0 },
      func: async () => {
        let d = document;
        let video = d.body.getElementsByTagName("video");
        let i = video.length;
        if (i) {
          let port = await chrome.runtime.connect();
          if (d.head.childElementCount != 1) {
            let index = 0;
            if (i > 1) {
              let maxWidth = 0;
              let width = 0;
              while (
                maxWidth < (width = video[--i].offsetWidth) && (maxWidth = width, index = i),
                i
              );
            }
            if ((video = video[index]).readyState) {
              video.pause();
              let { currentTime, videoWidth, videoHeight } = video;
              let cvs = new OffscreenCanvas(videoWidth, videoHeight);
              let ctx = cvs.getContext("bitmaprenderer");
              try {
                ctx.transferFromImageBitmap(await createImageBitmap(video));
                let url = URL.createObjectURL(await cvs.convertToBlob());
                port.onDisconnect.addListener(() => URL.revokeObjectURL(url));
                port.postMessage([currentTime, url]);
                return;
              } catch (e) {}
            }
          } else
            (video = video[0]).pause();
          d = video.controls;
          i = video.getAttribute("style");
          video.controls = 0;
          video.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647");
          port.onDisconnect.addListener(() => (video.controls = d, video.style = i));
          port.postMessage([video.currentTime, video.videoWidth, video.videoHeight, devicePixelRatio]);
        }
      }
    }).catch(() => 0);
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Snap video frame",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*", "file://*"]
  })
);