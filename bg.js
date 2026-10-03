onunhandledrejection = e => e.preventDefault();

{
  let { action, commands, contextMenus, debugger: _debugger, downloads, management, runtime, scripting } = chrome;
  let f = (a, b) => scripting.executeScript({
    target: { tabId: (b || a).id, allFrames: !0 },
    files: ["main.js"]
  });
  let frameRects = 0;
  let onMessage = (msg, p) => {
    if (typeof msg[0] !== "number")
      return frameRects = msg;

    p.disConnect?.();

    let t = msg[0];
    let t60 = t % 60;
    let n = t % 3600 / 60 ^ 0;
    let { tab } = p.sender || p;
    let filename =
      tab.title.trim().replace(/^\.|[|?":/<>*\\]/g, "_") + "-" +
      (t >= 3600 ? (t / 3600 ^ 0) + "h-" : "") +
      (n ? n + "m-" : "") +
      ((n = t60 ^ 0) ? n + "s-" : "") +
      ((t60 - n) * 1000 ^ 0) +
      "ms.png";

    if (msg.length < 3)
      return downloads.download({ filename, url: msg[1] });

    let target = { tabId: tab.id };
    let dpr = msg[7];
    let x = msg[3];
    let y = msg[4];
    let width = msg[5];
    let height = msg[6];
    if (frameRects ||= msg[8]) {
      let rect = frameRects.find(v => v.width > width + 127 || v.height > height + 127);
      rect && (x += rect.x, y += rect.y);
    }
    _debugger.attach(target, "1.3")
    .then(() =>
      _debugger.sendCommand(target, "Page.captureScreenshot", {
        captureBeyondViewport: !0,
        clip: {
          x: dpr * x,
          y: dpr * y,
          width: dpr * width,
          height: dpr * height,
          scale: dpr * (msg[1] / width)
        }
      }).data
    )
    .then(r => (
      _debugger.detach(target),
      downloads.download({ filename, url: "data:image/png;base64," + r.data })),
    )
  }

  action.onClicked.addListener(f);
  contextMenus.onClicked.addListener(f);
  commands.onCommand.addListener(f);
  runtime.onMessage.addListener(onMessage);
  runtime.onConnect.addListener(p => p.onMessage.addListener(onMessage));
  runtime.onInstalled.addListener(() =>
    contextMenus.create({
      id: "",
      title: "Snap video frame",
      contexts: ["page", "video"],
      documentUrlPatterns: ["https://*/*", "file://*"]
    })
  );
}
