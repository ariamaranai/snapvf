{
  let tabId;
  let title;
  let windowId;
  chrome.runtime.onConnect.addListener(port =>
    port.onMessage.addListener(m =>
      chrome.management.getAll(crx => {
        let download = url => {
          let t = m[0];
          let n = Math.floor(t % 3600 / 60);
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
          )
          port.disconnect();
        }
        let len = m.length;
        if (len > 2) {
          chrome.system.display.getInfo(infos => {
            let displayInfo = infos[0];
            let bounds = displayInfo.bounds;
            let videoWidth = m[1];
            let videoHeight = m[2];
            if (len < 4) {
              debugger;
              chrome.tabs.captureVisibleTab(windowId, { format: "png" }, url => {
                if (!(
                  bounds.width * displayInfo.dpiX / 96 == videoWidth &&
                  bounds.height * displayInfo.dpiY / 96 == videoHeight
                ))  {
                  let cvs = new OffscreenCanvas(videoWidth, videoHeight);
                  let reader = new FileReader;
                  reader.onload = () => download(reader.result);
                  fetch (url)
                    .then(r => r.blob())
                      .then(r => createImageBitmap(r, {
                        resizeWidth: videoWidth,
                        resizeHeight: videoHeight,
                        resizeQuality: "high"
                      }))
                        .then(r => (
                          cvs.getContext("bitmaprenderer").transferFromImageBitmap(r),
                          cvs.convertToBlob()
                        ))
                          .then(reader.readAsDataURL.bind(reader));
                } else
                  download(url);
              });
            } else {
              let target = { tabId };
              chrome.debugger.attach(target, "1.3");
              chrome.debugger.sendCommand(target, "Page.captureScreenshot", {
                  captureBeyondViewport: !0,
                  clip: {
                    x: 0,
                    y: 0,
                    width: videoWidth,
                    height: videoHeight,
                    scale: displayInfo.dpiY / 96
                  }
                }, e => (
                  chrome.debugger.detach(target),
                  download("data:image/png;base64," + e.data)
                )
              );
            }
          })
        } else
          download(m[1]);
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
              } catch (e) {
                port.onDisconnect.addListener(d.fullscreenElement || (() => d.exitFullscreen()));
                video.requestFullscreen({ navigationUI: "hide" });
                port.postMessage([currentTime, videoWidth, videoHeight]);
              }
            }
          } else (
            (video = video[0]).pause(),
            video.setAttribute("style", "all:unset;position:fixed;inset:0"),
            port.onDisconnect.addListener(() => (video.controls = video.style = "")),
            port.postMessage([video.currentTime, video.videoWidth, video.videoHeight, video.controls = 0])
          );
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