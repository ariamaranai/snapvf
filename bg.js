{
let f =(a, b)=>
  (b ??= a).url[0] == "c" || chrome.scripting.executeScript({
    target: (a = a?.frameId) ? {tabId: b.id, frameIds: [a]} : {tabId: b.id},
    world: "MAIN",
    func: async ()=> {
      let v = document.getElementsByTagName("video"), i = v.length
      if (i) {
        let n = 0, w = 0, t = 0
        while (w < (t = v[--i].offsetWidth) && (w = t, n = i), i);
        if ((v = v[n]).readyState) {
          v.pause()
          try {
            (n = new OffscreenCanvas(v.videoWidth, v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),
            w = URL.createObjectURL(await n.convertToBlob()),
            setTimeout(()=> URL.revokeObjectURL(w), 127)
            return [v.currentTime, w]
          } catch (e) {
            document.fullscreenElement ?? setTimeout(()=> document.exitFullscreen(), 4000)
            await v.requestFullscreen({navigationUI: "hide"})
            return [v.currentTime, v.videoWidth, v.videoHeight]
          }
        }
      }
    }
  }, async e=> {
    if (e &&= e[0].result) {
      let n, k = await chrome.management.getAll(), m = k.find(v=> v.name == "file.format")
      m && m.enabled ? await chrome.management.setEnabled(m = m.id, !1) : m = 0
      await chrome.downloads.download({
        filename: b.title.replace(/[|?":/<>*\\]/g,"_") + "-" +
          ((k = e[0]) >= 3600 ? (k / 3600 ^ 0) + "h-": "") +
          ((n = k % 3600 / 60 ^ 0) ? n + "m-": "") +
          ((n = k % 60 ^ 0) ? n + "s-" : "") +
          ((n = (k % 60 - n) * 1000) ^ 0) + "ms.png",
        url: e.length < 3 ? e[1] : (
          n = await chrome.tabs.captureVisibleTab(b.windowId, {format: "png"}),
          (k = (await chrome.system.display.getInfo())[0].bounds).width * k.dpiX == (b = e[1]) * 96 && k.height * k.dpiY == e[2] * 96 ? n :
          await new Promise(async p=> (
            (k = new OffscreenCanvas(b, e[2])).getContext("bitmaprenderer").transferFromImageBitmap(
              await createImageBitmap(await(await fetch(n)).blob(), {resizeWidth: b, resizeHeight: e[2], resizeQuality:"high"})),
            (e = new FileReader).onload =()=> p(e.result),
            e.readAsDataURL(await k.convertToBlob())
          ))
        )
      })
      m && chrome.management.setEnabled(m, !0)
    }
  })
chrome.action.onClicked.addListener(f)
chrome.contextMenus.onClicked.addListener(f)
chrome.commands.onCommand.addListener(f)
}
chrome.runtime.onInstalled.addListener(()=> chrome.contextMenus.create({id: "", title: "Snap video frame", contexts: ["page","video"]}))