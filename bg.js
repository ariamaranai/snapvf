
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
  let onUserScriptMessage = (m, p) => {
    let t = m[0];
    if (typeof t == "number") {
      chrome.management.getAll(async crx => {
        if (crx = crx.find(v => v.name == "fformat")) {
          let onDownloadsCreated = () => (
            chrome.management.setEnabled(crx, !0),
            chrome.downloads.onCreated.removeListener(onDownloadsCreated)
          );
          chrome.management.setEnabled(crx = crx.id, !1);
          chrome.downloads.onCreated.addListener(onDownloadsCreated);
        }
        let n = t % 3600 / 60 ^ 0;
        let { title, id: tabId } = (p.sender || p).tab;
        let filename =
          title.trim().replace(/^\.|[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? (t / 3600 ^ 0) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = t % 60 ^ 0) ? n + "s-" : "") +
          (((t % 60) - n) * 1000 ^ 0) +
          "ms.png";
        if (m.length < 3)
          chrome.downloads.download({ filename, url: m[1] });
        else {
          try {
            let x = m[3];
            let y = m[4];
            let width = m[5];
            let height = m[6];
            if (frameRects ||= m[8]) {
              let rect = frameRects.find(v => v.width - width < 127 && v.height - height < 127);
              rect && (x += rect.x, y += rect.y);
            }
            let dpr = m[7];
            x *= dpr;
            y *= dpr;
            let target = { tabId };
            await chrome.debugger.attach(target, "1.3");
            let { data } = await chrome.debugger.sendCommand(target, "Page.captureScreenshot", {
              captureBeyondViewport: !0,
              clip: {
                x,
                y,
                width: width * dpr,
                height: height * dpr,
                scale: m[1] / width * dpr
              }
            });
            await chrome.debugger.detach(target);
            await chrome.downloads.download({ filename, url: "data:image/png;base64," + data })
          } catch {}
          p.disconnect();
        }
      });
    } else
      frameRects = m;
  }
  chrome.runtime.onUserScriptMessage.addListener(onUserScriptMessage);
  chrome.runtime.onUserScriptConnect.addListener(p => p.onMessage.addListener(onUserScriptMessage));

  let onStartup = () => {
    let { userScripts } = chrome;
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