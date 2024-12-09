{
let f =(a, b)=>
  (b ??= a).url[0]=="c" || chrome.scripting.executeScript({
    target: (a = a?.frameId) ? {tabId: b.id, frameIds: [a]} : {tabId: b.id},
    world: "MAIN",
    func: async ()=> {
      let v = document.getElementsByTagName("video"),
          i = v.length
      if (i) {
        let n = 0, w = 0, t = 0
        while (w < (t = v[--i].offsetWidth) && (w = t, n = i), i);
        if ((v = v[n]).readyState) {
          v.pause()
          try {
            return [
              v.currentTime,
              ((n = new OffscreenCanvas(v.videoWidth, v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),
              URL.createObjectURL(await n.convertToBlob()))
            ]
          } catch (e) {
            document.fullscreenElement ?? setTimeout(()=> document.exitFullscreen(), 4000)
            await v.requestFullscreen({navigationUI: "hide"})
            return [v.currentTime,v.videoWidth,v.videoHeight]
          }
        }
      }
    }
  }, async e=> {
    if (e &&= e[0].result) {
      let n, x = await chrome.management.getAll()
      (x = x.find(v=> v.name == "file.format")) && x.enabled ?
        await chrome.management.setEnabled(x = x.id, !1) : x = 0
      await chrome.downloads.download({
        filename: b.title.replace(/[|?":/<>*\\]/g,"_") + "-" +
          ((a = e[0]) >= 3600 ? (a / 3600 ^0) + "h-": "") +
          ((n = a % 3600 / 60 ^0) ? n + "m-": "") +
          ((n = a % 60 ^ 0) ? n + "s-" : "") +
          ((n = (a % 60 - n)* 1000) ^0) + "ms.png",
        url: e.length < 3 ? e[1] : (
          n = await chrome.tabs.captureVisibleTab(b.windowId, {format: "png"}),
          (a = (await chrome.system.display.getInfo())[0].bounds).width * a.dpiX == (b = e[1]) * 96 &&
          a.height * a.dpiY == e[2] * 96 ? n:
          await new Promise(async p=> (
            (a = new OffscreenCanvas(b, e[2]))
              .getContext("bitmaprenderer")
                .transferFromImageBitmap(await createImageBitmap(
                  await(await fetch(n)).blob(),
                  {resizeWidth: b, resizeHeight: e[2], resizeQuality:"high"}
                )),
            (e = new FileReader).onload =()=> p(e.result),
            e.readAsDataURL(await a.convertToBlob())
          ))
        )
      })
      x && chrome.management.setEnabled(x, !0)
    }
  })
chrome.action.onClicked.addListener(f)
chrome.contextMenus.onClicked.addListener(f),
chrome.commands.onCommand.addListener(f)
}
chrome.runtime.onInstalled.addListener(()=>
  chrome.contextMenus.create({
    id: "",
    title: "Snap video frame",
    contexts: ["page","video"]
  })
)