{let c=chrome,m=c.contextMenus,p,f=(a,b)=>(b||a).url[0]!="c"&&c.scripting.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let v=document.getElementsByTagName("video"),i=v.length;if(i){let r=Array(i);while(r[--i]=v[i].offsetWidth,i);if((v=v[r.indexOf(Math.max(...r))]).readyState){v.pause();try{return[r=v.currentTime,((i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),URL.createObjectURL(await i.convertToBlob()))]}catch(e){return(e=(i=document).fullscreenElement)??(setTimeout(i.exitFullscreen.bind(i),4e3),await v.requestFullscreen({navigationUI:"hide"})),[r,v.videoWidth,v.videoHeight]}}}}},async e=>(e=e[0].result)&&(p=(p=(await c.management.getAll()).find(v=>v.name=="file.format"))&&await c.runtime.connect(p.id),await c.downloads.download({filename:(b??=a).title.replace(/[|?":/<>*\\]/g,"_")+"-"+((m=e[0])>=3600?(m%3600^0)+"h-":"")+((f=m%3600/60^0)?f+"m-":"")+((f=m%60^0)?f+"s-":"")+((f=(m%60-f)*1000)^0)+"ms.png",url:e.length<3?e[1]:(f=await c.tabs.captureVisibleTab(b.windowId,{format:"png"}),m=(await c.system.display.getInfo())[0].bounds,m.width*m.dpiX/96==(a=e[1])&&m.height*m.dpiY/96==(b=e[2])||m.width*(b=e[2])!=m.height*a?f:await new Promise(async r=>((m=new OffscreenCanvas(a,b)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(await(await fetch(f)).blob(),{resizeWidth:a,resizeHeight:b,resizeQuality:"high"})),(e=new FileReader).onload=()=>r(e.result),e.readAsDataURL(await m.convertToBlob()))))}),p&&p.disconnect()));c.runtime.onInstalled.addListener(()=>m.create({id:"",title:"Save video frame as...",contexts:["page","video"]})),m.onClicked.addListener(f),c.action.onClicked.addListener(f),c.commands.onCommand.addListener(f)}