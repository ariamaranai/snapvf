{
  let title;
  let windowId;
  chrome.runtime.onMessage.addListener((m, s, r) =>
    !!chrome.management.getAll(async crxs => {
      let crx = crxs.find(v => v.name == "fformat");
      crx && crx.enabled
        ? await chrome.management.setEnabled(crx = crx.id, !1)
        : crx = 0;
      let url = m[1];
      let len = m.length;
      if (len > 2) {
        let displayInfo = (await chrome.system.display.getInfo())[0];
        let bounds = displayInfo.bounds;
        let videoWidth = m[1];
        let videoHeight = m[2];
        if (len < 4) {
          url = await chrome.tabs.captureVisibleTab(windowId, { format: "png" });
          if (!(
            bounds.width * displayInfo.dpiX / 96 == videoWidth &&
            bounds.height * displayInfo.dpiY / 96 == videoHeight
          ))  {
            let cvs = new OffscreenCanvas(videoWidth, videoHeight);
            cvs.getContext("bitmaprenderer").transferFromImageBitmap(
              await createImageBitmap(
                await (await fetch (url)).blob(),
                { 
                  resizeWidth: videoWidth,
                  resizeHeight: videoHeight,
                  resizeQuality: "high"
                }
              )
            );
            let reader = new FileReader;
            reader.onload = () => url = reader.result;
            reader.readAsDataURL(await cvs.convertToBlob());
          }
        } else {
          let target = { tabId: s.tab.id };
          chrome.debugger.attach(target, "1.3");
          url = "data:image/png;base64," +
            (await chrome.debugger.sendCommand(target, "Page.captureScreenshot", {
              captureBeyondViewport: !0,
              clip: {
                x: 0,
                y: 0,
                width: videoWidth,
                height: videoHeight,
                scale: displayInfo.dpiY / 96
              }
            })).data;
          chrome.debugger.detach(target);
        }
      }
      let t = m[0];
      let n = t % 3600 / 60 ^ 0;
      await chrome.downloads.download({
        filename:
          title.replace(/[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? Math.floor(t / 3600) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = Math.floor(t % 60)) ? n + "s-" : "") +
          Math.floor(((t % 60) - n) * 1000) +
          "ms.png",
        url
      });
      crx && chrome.management.setEnabled(crx, !0);
      r();
    })
  );
  let run = (a, b) => {
    let tabId = (b ??= a).id;
    title = b.title;
    windowId = b.windowId;
    chrome.scripting.executeScript({
      target: (a = a?.frameId) ? { tabId, frameIds: [a] } : { tabId, allFrames: !0 },
      func: () => new Promise(async resolve => {
        let d = document;
        let video = d.body.getElementsByTagName("video");
        let i = video.length;
        if (i) {
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
                await chrome.runtime.sendMessage([currentTime, url], URL.revokeObjectURL.bind(null, url));
              } catch (e) {
                let exitHandler = d.fullscreenElement || (() => d.exitFullscreen());
                await video.requestFullscreen({ navigationUI: "hide" });
                await chrome.runtime.sendMessage([currentTime, videoWidth, videoHeight], exitHandler);
              }
            }
          } else (
            (video = video[0]).pause(),
            video.setAttribute("style", "all:unset;position:fixed;inset:0"),
            await chrome.runtime.sendMessage([video.currentTime, video.videoWidth, video.videoHeight, video.controls = 0], () => (
              video.controls = video.style = ""
            ))
          )
        }
        resolve();
      })
    });
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
    documentUrlPatterns: ["https://*/*", "https://*/", "http://*/*", "http://*/", "file://*/*", "file://*/"]
  })
);