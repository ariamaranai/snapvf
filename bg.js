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
      js: [{ file: "main.js" }]
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