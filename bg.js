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
        let n = t % 3600 / 60 ^ 0;
        let filename =
          title.trim().replace(/^\.|[|?":/<>*\\]/g, "_") +
          "-" +
          (t >= 3600 ? (t / 3600 ^ 0) + "h-" : "") +
          (n ? n + "m-" : "") +
          ((n = t % 60 ^ 0) ? n + "s-" : "") +
          (((t % 60) - n) * 1000 ^ 0) +
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
  let run = async (a, b) => {
    title = (b ??= a).title;
    try {
      await chrome.userScripts.execute({
        target: { tabId: tabId = b.id, allFrames: !0 },
        js: [{ file: "main.js" }]
      });
    } catch {}
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
}
{
  let f = () => {
    let { userScripts } = chrome;
    userScripts && (
      userScripts.configureWorld({ messaging: !0 }),
      chrome.runtime.onStartup.removeListener(f)
    );
  }
  chrome.runtime.onStartup.addListener(f);
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