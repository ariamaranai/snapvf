chrome.runtime.onUserScriptMessage.addListener((m, p) => {
  chrome.management.getAll(crx => {
    if (crx = crx.find(v => v.name == "fformat")) {
      let onDownloadsCreated = () => (
        chrome.management.setEnabled(crx, !0),
        chrome.downloads.onCreated.removeListener(onDownloadsCreated)
      );
      chrome.management.setEnabled(crx = crx.id, !1);
      chrome.downloads.onCreated.addListener(onDownloadsCreated);
    }
    let t = m[0];
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
    if (m.length < 4)
      chrome.downloads.download({ filename, url: m[1] });
    else {
      let target = { tabId };
      chrome.debugger.attach(target, "1.3")
      .then(() =>
        chrome.debugger.sendCommand(target, "Page.captureScreenshot", {
          captureBeyondViewport: !0,
          clip: {
            x: m[3],
            y: m[4],
            width: m[5],
            height: m[6],
            scale: m[1] / m[5]
          }
        }))
      .then(e => (
        chrome.debugger.detach(target),
        chrome.downloads.download({ filename, url: "data:image/png;base64," + e.data })
      ))
      .finally(() => p.disconnect());
    }
  });
});
chrome.runtime.onUserScriptConnect.addListener(p =>
  p.onMessage.addListener((m, p) => chrome.runtime.onUserScriptMessage.dispatch(m, p))
);
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
}
{
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
    f()
  ));
}
