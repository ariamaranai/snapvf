(({runtime:r,contextMenus:m,scripting:s,management:g,action:o,commands:c,downloads:d,tabs:t,system:y})=>(r.onInstalled.addListener(()=>m.create({id:"",title:"Snap video frame",contexts:["page","video"]})),r=(a,b)=>(b||a).url[0]!="c"&&s.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let v=document.getElementsByTagName("video"),i=v.length;if(i){let k=Array(i);while(k[--i]=v[i].offsetWidth,i);if((v=v[k.indexOf(Math.max(...k))]).readyState){v.pause();try{return[k=v.currentTime,((i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v)),URL.createObjectURL(await i.convertToBlob()))]}catch(e){return(e=document).fullscreenElement??(setTimeout(e.exitFullscreen.bind(e),4e3),await v.requestFullscreen({navigationUI:"hide"})),[k,v.videoWidth,v.videoHeight]}}}}},async e=>(e=e[0].result)&&((r=(await g.getAll()).find(v=>v.name=="file.format"))&&r.enabled?await g.setEnabled(r=r.id,!1):r=0,await d.download({filename:(b??=a).title.replace(/[|?":/<>*\\]/g,"_")+"-"+((a=e[0])>=3600?(a%3600^0)+"h-":"")+((m=a%3600/60^0)?m+"m-":"")+((m=a%60^0)?m+"s-":"")+((m=(a%60-m)*1e3)^0)+"ms.png",url:e.length<3?e[1]:(m=await t.captureVisibleTab(b.windowId,{format:"png"}),(a=(await y.display.getInfo())[0].bounds).width*a.dpiX==(b=e[1])*96&&a.height*a.dpiY==e[2]*96?m:await new Promise(async p=>((a=new OffscreenCanvas(b,e[2])).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(await(await fetch(m)).blob(),{resizeWidth:b,resizeHeight:e[2],resizeQuality:"high"})),(e=new FileReader).onload=()=>p(e.result),e.readAsDataURL(await a.convertToBlob()))))}),r&&g.setEnabled(r,!0))),m.onClicked.addListener(r),o.onClicked.addListener(r),c.onCommand.addListener(r)))(chrome)