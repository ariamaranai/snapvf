(chrome => {
  let run = (a, b) =>
    (b ??= a).url[0] == "c" || chrome.scripting.executeScript({
      target: (a = a?.frameId)
        ? { tabId: b.id, frameIds: [a] }
        : { tabId: b.id },
      world: "MAIN",
      func: async () => {
        let video = document.getElementsByTagName("video");
        let i = video.length;
        if (i) {
          let maxWidth = 0;
          let width = 0;
          let index = 0;
          while (
            width < (width = video[--i].offsetWidth) && (maxWidth = width, index = i),
            i
          );
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
              document.fullscreenElement ??
                setTimeout(() => document.exitFullscreen(), 4000);
              await video.requestFullscreen({ navigationUI: "hide" });
              return [currentTime, videoWidth, videoHeight];
            }
          }
        }
      },
    }, async results => {
      if ((results &&= results[0].result)) {
        let crxs = await chrome.management.getAll();
        let crx = crxs.find(info => info.name == "file.format");
        crx && crx.enabled
          ? await chrome.management.setEnabled((crx = crx.id), !1)
          : (crx = 0);
        let t = results[0];
        let n = ((t % 3600) / 60) ^ 0;
        let filename =
          b.title.replace(/[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? ((t / 3600) ^ 0) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = t % 60 ^ 0) ? n + "s-" : "") +
          ((n = ((t % 60) - n) * 1000) ^ 0) +
          "ms.png";
        let url = results[1];
        if (results.length == 3) {
          let displayInfo = (await chrome.system.display.getInfo())[0].bounds;
          let videoWidth = results[1];
          let videoHeight = results[2];
          url = await chrome.tabs.captureVisibleTab(b.windowId, { format: "png" });
          if (!(
            displayInfo.width * displayInfo.dpiX / 96 == videoWidth &&
            displayInfo.height * displayInfo.dpiY / 96 == videoHeight
          )) {
            await new Promise(async resolve => {
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
              )
              let reader = new FileReader;
              reader.onload =()=> resolve(url = reader.result);
              reader.readAsDataURL(await cvs.convertToBlob())
            })
          }
        }
        await chrome.downloads.download({filename, url});
          crx && chrome.management.setEnabled(crx, !0);
      }
    });
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
  chrome.runtime.onInstalled.addListener(() =>
    chrome.contextMenus.create({
      id: "",
      title: "Snap video frame",
      contexts: ["page", "video"],
    })
  );
})(chrome)