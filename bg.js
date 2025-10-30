
{
  let run = async (a, b) => {
    try {
      await chrome.userScripts.execute({
        target: { tabId: (b || a).id, allFrames: !0 },
        js: [{ file: "main.js" }]
      });
    } catch {}
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);

  let frameRects = 0;
  let onUserScriptMessage = (msg, p) => {
    let t = msg[0];
    if (typeof t == "number") {
      chrome.management.getAll(async crx => {
        let crxFFormat = crx.find(v => v.name == "fformat");
        if (crxFFormat) {
          let crxFFormatId = crxFFormat.id; 
          chrome.management.setEnabled(crxFFormatId, !1);
          let onDownloadsCreated = () => (
            chrome.management.setEnabled(crxFFormatId, !0),
            chrome.downloads.onCreated.removeListener(onDownloadsCreated)
          );
          chrome.downloads.onCreated.addListener(onDownloadsCreated);
        }
        let t60 = t % 60;
        let n = t % 3600 / 60 ^ 0;
        let tab = (p.sender || p).tab;
        let filename =
          tab.title.trim().replace(/^\.|[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? (t / 3600 ^ 0) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = t60 ^ 0) ? n + "s-" : "") +
          ((t60 - n) * 1000 ^ 0) +
          "ms.png";
        if (msg.length < 3)
          chrome.downloads.download({ filename, url: msg[1] });
        else {
          try {
            let x = msg[3];
            let y = msg[4];
            let width = msg[5];
            let height = msg[6];
            if (frameRects ||= msg[8]) {
              let rect = frameRects.find(v => v.width - 127 < width && v.height - 127 < height);
              rect && (x += rect.x, y += rect.y);
            }
            let target = { tabId: tab.id };
            await chrome.debugger.attach(target, "1.3");
            let dpr = msg[7];
            let data = (await chrome.debugger.sendCommand(target, "Page.captureScreenshot", {
              captureBeyondViewport: !0,
              clip: {
                x: dpr * x,
                y: dpr * y,
                width: dpr * width,
                height: dpr * height,
                scale: dpr * (msg[1] / width)
              }
            })).data;
            await chrome.debugger.detach(target);
            await chrome.downloads.download({ filename, url: "data:image/png;base64," + data });
          } catch {}
          p.disconnect();
        }
      });
    } else
      frameRects = msg;
  }
  chrome.runtime.onUserScriptMessage.addListener(onUserScriptMessage);
  chrome.runtime.onUserScriptConnect.addListener(p => p.onMessage.addListener(onUserScriptMessage));

  let onStartup = () => {
    let userScripts = chrome.userScripts;
    userScripts && (
      userScripts.configureWorld({ messaging: !0 }),
      chrome.runtime.onStartup.removeListener(onStartup)
    );
  }
  chrome.runtime.onStartup.addListener(onStartup);
  chrome.runtime.onInstalled.addListener(() => (
    chrome.contextMenus.create({
      id: "",
      title: "Snap video frame",
      contexts: ["page", "video"],
      documentUrlPatterns: ["https://*/*", "file://*"]
    }),
    onStartup()
  ));
}