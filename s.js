{let c=chrome,m=c.contextMenus,f=(a,b)=>(b||a).url[0]!="c"&&c.scripting.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let v=document.getElementsByTagName("video"),i=v.length;if(i){let r=Array(i);while(r[--i]=v[i].offsetWidth,i);if((v=v[r.indexOf(Math.max(...r))]).readyState){v.pause();try{return[r=v.currentTime,((i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),URL.createObjectURL(await i.convertToBlob()))]}catch(e){return(e=document).fullscreenElement??(setTimeout(e.exitFullscreen.bind(e),4e3),await v.requestFullscreen({navigationUI:"hide"})),[r,v.videoWidth,v.videoHeight]}}}}},async e=>(e=e[0].result)&&((f=(await g.getAll()).find(v=>v.name=="file.format"))&&f.enabled?await g.setEnabled(f=f.id,!1):f=0,await c.downloads.download({filename:(b??=a).title.replace(/[|?":/<>*\\]/g,"_")+"-"+((a=e[0])>=3600?(a%3600^0)+"h-":"")+((m=a%3600/60^0)?m+"m-":"")+((m=a%60^0)?m+"s-":"")+((m=(a%60-m)*1e3)^0)+"ms.png",url:e.length<3?e[1]:(m=await c.tabs.captureVisibleTab(b.windowId,{format:"png"}),(a=(await c.system.display.getInfo())[0].bounds).width*a.dpiX==(b=e[1])*96&&a.height*a.dpiY==e[2]*96?m:await new Promise(async r=>((a=new OffscreenCanvas(b,e[2])).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(await(await fetch(m)).blob(),{resizeWidth:b,resizeHeight:e[2],resizeQuality:"high"})),(e=new FileReader).onload=()=>r(e.result),e.readAsDataURL(await a.convertToBlob()))))}),f&&g.setEnabled(f,!0))),g=c.management;c.runtime.onInstalled.addListener(()=>m.create({id:"",title:"Snap video frame",contexts:["page","video"]})),m.onClicked.addListener(f),c.action.onClicked.addListener(f),c.commands.onCommand.addListener(f)}