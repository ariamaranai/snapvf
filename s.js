{let c=chrome,m=c.contextMenus,p,f=(a,b)=>(b??=a).url[0]!="c"&&c.scripting.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let v=document.getElementsByTagName("video"),i=v.length;if(i){let r=Array(i);while(r[--i]=v[i].offsetWidth,i);if((v=v[r.indexOf(Math.max(...r))]).readyState){v.pause();try{return[r=v.currentTime,((i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),URL.createObjectURL(await i.convertToBlob()))]}catch(e){return(e=(i=document).fullscreenElement)??(setTimeout(i.exitFullscreen.bind(i),4e3),await v.requestFullscreen({navigationUI:"hide"})),[r,v.videoWidth,v.videoHeight]}}}}},async e=>(e=e[0].result)&&(p=(p=(await c.management.getAll()).find(v=>v.name=="file.format"))&&await c.runtime.connect(p.id),await c.downloads.download({filename:b.title.replace(/[|?":/<>*\\]/g,"_")+"-"+((a=e[0])>=3600?(a%3600^0)+"h-":"")+((f=a%3600/60^0)?f+"m-":"")+((f=a%60^0)?f+"s-":"")+((f=(a%60-f)*1000)^0)+"ms.png",url:e.length<3?e[1]:(f=await c.tabs.captureVisibleTab(b.windowId,{format:"png"}),a=(await c.system.display.getInfo())[0].bounds,a.width*a.dpiX/96==(m=e[1])&&a.height*a.dpiY/96==(b=e[2])||a.width*(b=e[2])!=a.height*m?f:await new Promise(async r=>((a=new OffscreenCanvas(m,b)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(await(await fetch(f)).blob(),{resizeWidth:m,resizeHeight:b,resizeQuality:"high"})),(e=new FileReader).onload=()=>r(e.result),e.readAsDataURL(await a.convertToBlob()))))}),p&&p.disconnect()));c.runtime.onInstalled.addListener(()=>m.create({id:"",title:"Save video frame as...",contexts:["page","video"]})),m.onClicked.addListener(f),c.action.onClicked.addListener(f),c.commands.onCommand.addListener(f)}