{let c=chrome,m=c.contextMenus,f=(a,b)=>c.scripting.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let d=document,v=d.getElementsByTagName("video"),i=v.length;if(i){let r=Array(i);while(r[--i]=v[i].offsetWidth,i);if((v=v[r.indexOf(Math.max(...r))]).readyState){v.pause();try{return [d.title,r=v.currentTime,((i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),URL.createObjectURL(await i.convertToBlob()))]}catch(e){e=v.getAttribute("style"),setTimeout(()=>(d.exitFullscreen(),v.setAttribute("style",e)),6000),v.requestFullscreen();return [d.title,r,v.videoWidth,v.videoHeight]}}}}},async e=>{if(e=e[0].result){b=(a=await c.management.getAll()).length;while((m=a[--b]).name!="fileformat."?b:(m=await c.runtime.connect(m.id),0));}let n=e[1];await c.downloads.download({filename:e[0].replace(/.[|?":/<>*\\]/g,"_")+"-"+(n>=3600?String(n%3600^0)+"h-":"")+((f=n%3600/60^0)?f+"m-":"")+((f=n%60^0)?f+"s-":"")+((f=(n%60-f)*1000)^0)+"ms.png",url:e.length<4?e[2]:(f=await c.tabs.captureVisibleTab((b?b:a).windowId,{format:"png"}),n=(await c.system.display.getInfo())[0].bounds,n.width*n.dpiX/96==(a=e[2])&&n.height*n.dpiY/96==(b=e[3])||n.width*(b=e[3])!=n.height*a?s:await new Promise(async r=>((n=new OffscreenCanvas(a,b)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(await(await fetch(f)).blob(),{resizeWidth:a,resizeHeight:b,resizeQuality:"high"})),(e=new FileReader).onload=()=>r(e.result),e.readAsDataURL(await n.convertToBlob()))))}),m?.disconnect()});m.removeAll(),m.create({id:"0",title:"Save video frame as...",contexts:["video"]}),c.action.onClicked.addListener(f),m.onClicked.addListener(f),c.commands.onCommand.addListener(f)}