{
  let run = (a, b) => {
    (b ??= a).url[0] != "c" && chrome.scripting.executeScript({
      target: (a = a?.frameId)
        ? { tabId: b.id, frameIds: [a] }
        : { tabId: b.id, allFrames: !0 },
      world: "MAIN",
      func: async () => {
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
                setTimeout(() => URL.revokeObjectURL(url), 127);
                return [currentTime, url];
              } catch (e) {
                d.fullscreenElement ??
                  setTimeout(() => d.exitFullscreen(), 4000);
                await video.requestFullscreen({ navigationUI: "hide" });
                return [currentTime, videoWidth, videoHeight];
              }
            }
          } else {
            (video = video[0]).controls = 0;
            video.setAttribute("style", "all:unset;position:fixed;inset:0");
            setTimeout(() => (video.controls = 1, video.style = ""), 4000);
            return [video.currentTime, video.videoWidth, video.videoHeight, 0];
          }
        }
      }
    }, async results => {
      if (results &&= results.findLast(v => v.result).result) {
        let t = results[0];
        let n = ((t % 3600) / 60) ^ 0;
        let filename =
          "snapvf/" +
          b.title.replace(/[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? ((t / 3600) ^ 0) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = t % 60 ^ 0) ? n + "s-" : "") +
          ((n = ((t % 60) - n) * 1000) ^ 0) +
          "ms.png";
        let url = results[1];
        let len = results.length;
        if (len > 2) {
          let displayInfo = (await chrome.system.display.getInfo())[0];
          let bounds = displayInfo.bounds;
          let videoWidth = results[1];
          let videoHeight = results[2];
          if (len < 4) {
            url = await chrome.tabs.captureVisibleTab(b.windowId, { format: "png" });
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
            let target = { tabId: b.id };
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
        let crxs = await chrome.management.getAll();
        let crx = crxs.find(v => v.name == "fformat");
        crx && crx.enabled
          ? await chrome.management.setEnabled(crx = crx.id, !1)
          : crx = 0;
        await chrome.downloads.download({ filename, url, saveAs: !1 });
          crx && chrome.management.setEnabled(crx, !0);
      }
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