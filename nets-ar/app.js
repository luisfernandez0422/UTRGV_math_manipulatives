'use strict';
const $=id=>document.getElementById(id);let scene,mode,busy=false,angle=.65,topView=false,timer;const active=new Set();
function load(src){return new Promise((resolve,reject)=>{let s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>{s.remove();reject(Error('Could not load the 3D libraries. Check your connection and try again.'));};document.head.append(s);});}
function stopCamera(){document.querySelectorAll('video').forEach(v=>v.srcObject?.getTracks().forEach(t=>t.stop()));}
function error(message){$('message').textContent=message;$('message').className='error';$('start').disabled=$('preview').disabled=false;busy=false;}
function updateInfo(key){const def=NetModels.defs[key];$('model-name').textContent=def.name;$('facts').textContent=def.facts;}
function updateTracking(){if(active.size){const keys=[...active];$('model-name').textContent=keys.map(k=>NetModels.defs[k].name).join(' + ');$('facts').textContent=keys.length===1?NetModels.defs[keys[0]].facts:'The slider unfolds every visible model.';$('status').textContent='Marker found — move slowly to explore.';}else{$('model-name').textContent='Nets of Polyhedra';$('status').textContent='Point at a printed marker.';$('facts').textContent='Keep all four black corners in view.';}}
function setFold(value){$('unfold').value=value;let t=Number(value)/100;document.querySelectorAll('[folding-model]').forEach(el=>el.components['folding-model']?.model?.set(t));$('percent').value=value+'%';$('unfold').setAttribute('aria-valuetext',t===0?'Closed solid':t===1?'Flat net':value+' percent unfolded');$('question').textContent=t===1?'Which edges must meet when this net folds into the solid?':t===0?'Predict where each face will go before moving the slider.':'Follow one colored face. Which edges stay joined?';}
function framePreview(){if(mode!=='preview')return;const panels=document.querySelectorAll('#hud .panel');$('stage').style.top=(panels[0].getBoundingClientRect().bottom+8)+'px';const wide=matchMedia('(max-height:520px) and (min-width:600px)').matches;$('stage').style.bottom=wide?'12px':(innerHeight-panels[1].getBoundingClientRect().top+8)+'px';$('stage').style.right=wide?'344px':'0';scene?.resize();cameraView();}
function cameraView(){if(mode!=='preview'||!scene.camera)return;let c=scene.camera;const distance=Math.max(6.5,2.65/(Math.tan(24*Math.PI/180)*Math.min(c.aspect,1)));c.up.set(0,topView?0:1,topView?-1:0);c.position.set(topView?0:distance*.8*Math.sin(angle),topView?distance:distance*.6,topView?-.35:distance*.8*Math.cos(angle)-.35);c.lookAt(0,0,-.35);c.updateMatrixWorld();}
window.addEventListener('resize',()=>{if(mode==='preview')requestAnimationFrame(framePreview);});
function register(){if(AFRAME.components['folding-model'])return;AFRAME.registerComponent('folding-model',{schema:{type:'string'},init(){this.model=NetModels.create(AFRAME.THREE,this.data);this.el.setObject3D('net',this.model.group);this.model.set(Number($('unfold').value)/100);},remove(){this.model.dispose();this.el.removeObject3D('net');}});}
async function start(which){
 if(busy)return;if(which==='ar'&&(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)){error('Open the hosted HTTPS link in Safari or Chrome to use the camera. You can also explore without a camera.');return;}
 busy=true;$('start').disabled=$('preview').disabled=true;$('message').textContent='Loading the activity…';mode=which;
 try{
  if(!window.AFRAME)await load('https://aframe.io/releases/1.6.0/aframe.min.js');
  if(mode==='ar'){
   if(!AFRAME.systems.arjs)await load('https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/aframe/build/aframe-ar.js');
   await Promise.all(['camera_para.dat','cube.patt','rectangular.patt','triangular.patt'].map(async file=>{let r=await fetch('assets/'+file);if(!r.ok)throw Error('Missing assets/'+file+'. Upload the entire nets-ar folder.');}));
  }
  register();scene=document.createElement('a-scene');scene.setAttribute('embedded','');scene.setAttribute('vr-mode-ui','enabled: false');scene.setAttribute('device-orientation-permission-ui','enabled: false');scene.setAttribute('renderer','antialias: true; alpha: true; colorManagement: true');
  if(mode==='ar'){
   scene.setAttribute('arjs','sourceType: webcam; debugUIEnabled: false; detectionMode: mono; patternRatio: 0.5; cameraParametersUrl: assets/camera_para.dat;');
   for(const key of Object.keys(NetModels.defs)){
    const marker=document.createElement('a-marker');marker.id='marker-'+key;marker.setAttribute('type','pattern');marker.setAttribute('url','assets/'+key+'.patt');marker.setAttribute('size','1');marker.setAttribute('emitevents','true');marker.setAttribute('smooth','false');
    marker.innerHTML=`<a-entity position="0 0.015 0" scale="0.65 0.65 0.65" folding-model="${key}"></a-entity>`;
    marker.addEventListener('markerFound',()=>{active.add(key);updateTracking();});marker.addEventListener('markerLost',()=>{active.delete(key);updateTracking();});scene.append(marker);
   }
  }else{scene.setAttribute('background','color: #f4efe8');scene.innerHTML='<a-entity id="preview-model" folding-model="cube"></a-entity>';updateInfo('cube');$('status').textContent='Preview · use Rotate or Top view';$('preview-tools').hidden=false;}
  scene.insertAdjacentHTML('beforeend','<a-entity light="type: ambient; intensity: 1"></a-entity><a-entity light="type: directional; intensity: 1.2" position="2 5 3"></a-entity><a-entity camera="fov: 48" look-controls="enabled: false" wasd-controls="enabled: false"></a-entity>');
  scene.addEventListener('loaded',()=>{requestAnimationFrame(framePreview);});
  $('intro').hidden=true;$('hud').hidden=false;document.body.classList.add('active');if(mode==='preview')document.body.classList.add('preview');
  if(mode==='ar')timer=setTimeout(()=>{$('status').textContent='Still starting? Allow the camera, or exit and retry.';},20000);
  $('stage').append(scene);
 }catch(e){error(e.message);}
}
window.addEventListener('camera-init',()=>{clearTimeout(timer);updateTracking();});window.addEventListener('camera-error',()=>{clearTimeout(timer);stopCamera();$('status').textContent='Camera unavailable. Exit, allow camera access in browser settings, and retry.';});
$('start').onclick=()=>start('ar');$('preview').onclick=()=>start('preview');$('exit').onclick=()=>{stopCamera();location.reload();};window.addEventListener('pagehide',stopCamera);
$('unfold').oninput=e=>setFold(e.target.value);$('fold').onclick=()=>setFold(0);$('flatten').onclick=()=>setFold(100);
$('help').onclick=()=>{$('tips').hidden=!$('tips').hidden;$('help').setAttribute('aria-expanded',String(!$('tips').hidden));framePreview();};
$('model-select').onchange=e=>{const el=$('preview-model');el.removeAttribute('folding-model');el.setAttribute('folding-model',e.target.value);updateInfo(e.target.value);};
$('turn-left').onclick=()=>{angle-=Math.PI/6;cameraView();};$('turn-right').onclick=()=>{angle+=Math.PI/6;cameraView();};$('view').onclick=()=>{topView=!topView;$('view').textContent=topView?'Angled view':'Top view';cameraView();};
