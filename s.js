{let c=chrome,m=c.contextMenus,f=(a,b)=>c.scripting.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let d=document,v=d.getElementsByTagName("video"),i=v.length;if(i){let r=Array(i);while(r[--i]=(v[i].getClientRects()[0]?.width||0),i);(v=v[r.indexOf(Math.max(...r))]);if(v.readyState){v.pause(),r=d.title.replace(/.[|?":/<>*\\]/g,"_")+"-"+v.currentTime+".png";try{(i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v));return [r,URL.createObjectURL(await i.convertToBlob())]}catch(e){v.requestFullscreen();return [r,v.videoWidth,v.videoHeight]}}}}},async e=>(e=e[0].result)&&c.downloads.download({filename:e[0],url:e.length<3?e[1]:(b=await c.tabs.captureVisibleTab((b?b:a).windowId,{format:"png"}),a=(await chrome.system.display.getInfo())[0].bounds,a.width*a.dpiX/96==e[1]&&a.height*a.dpiY/96==e[2]?a:await new Promise(async r=>((a=new OffscreenCanvas(e[1],e[2])).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(await(await fetch(b)).blob(),{resizeWidth:e[1],resizeHeight:e[2],resizeQuality:"high"})),(e=new FileReader).onload=()=>r(e.result),e.readAsDataURL(await a.convertToBlob()))))}));m.removeAll(),m.create({id:"0",title:"Save video frame as...",contexts:["video"]}),c.action.onClicked.addListener(f),m.onClicked.addListener(f),c.commands.onCommand.addListener(f)}