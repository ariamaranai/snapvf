{let c=chrome,m=c.contextMenus,f=(a,b)=>c.scripting.executeScript({target:b?typeof a=="string"?{tabId:b.id,allFrames:!0}:{tabId:b.id,frameIds:[a.frameId]}:{tabId:a.id,allFrames:!0},world:"MAIN",func:async()=>{let d=document,v=d.getElementsByTagName("video"),i=v.length;if(i){let r=Array(i);while(r[--i]=(v[i].getClientRects()[0]?.width||0),i);(v=v[r.indexOf(Math.max(...r))]);if(v.readyState){v.pause(),r=d.title.replace(/.[\\/:*?"<>|]/g,"_")+"-"+v.currentTime+".png";try{(i=new OffscreenCanvas(v.videoWidth,v.videoHeight)).getContext("bitmaprenderer").transferFromImageBitmap(await createImageBitmap(v));return [r,URL.createObjectURL(await i.convertToBlob())]}catch(e){v.requestFullscreen();return r}}}}},async e=>(e=e[0].result)&&c.downloads.download({filename:typeof e=="string"?e:e[0],url:typeof e=="string"?await c.tabs.captureVisibleTab((b?b:a).windowId,{format:"png"}):e[1]}));m.removeAll(),m.create({id:"0",title:"Save video frame as...",contexts:["video"]}),c.action.onClicked.addListener(f),m.onClicked.addListener(f),c.commands.onCommand.addListener(f)}