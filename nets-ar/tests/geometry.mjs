import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
// Supply a local Three.js ES module path as the first argument.
const T=await import(process.argv[2]);
const sandbox={window:{}};vm.createContext(sandbox);
for(const file of ['models.js','ar-viewport.js'])vm.runInContext(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),sandbox);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const models=sandbox.window.NetModels;
for(const key of Object.keys(models.defs)){
 const m=models.create(T,key),def=m.def;
 const vertex=(f,id)=>new T.Vector3(...def.vertices[id]).applyMatrix4(m.matrices[f]);
 for(const t of [0,.25,.5,.75,1]){
  m.set(t);
  def.faces.forEach((f,i)=>{
   for(let a=0;a<f.ids.length;a++)for(let b=a+1;b<f.ids.length;b++){
    near(vertex(i,f.ids[a]).distanceTo(vertex(i,f.ids[b])),new T.Vector3(...def.vertices[f.ids[a]]).distanceTo(new T.Vector3(...def.vertices[f.ids[b]])));
   }
   if(f.parent!==undefined)for(const id of f.edge)near(vertex(i,id).distanceTo(vertex(f.parent,id)),0);
   if(t===1)for(const id of f.ids)near(vertex(i,id).y,0);
  });
 }
 if(key==='pyramid'){
  assert.equal(def.faces.length,5);assert.equal(def.vertices.length,5);
  // At full unfold, each triangle lies outside its own square edge.
  for(let i=1;i<5;i++){
   const apex=vertex(i,4);assert.ok(Math.max(Math.abs(apex.x),Math.abs(apex.z))>.65);
  }
 }
 m.dispose();console.log('PASS rigid faces, connected hinges and flat net:',key);
}
const layout=sandbox.window.NetARViewport.layout;
for(const [vw,vh] of [[640,480],[480,640],[1920,1080],[1080,1920]])for(const [sw,sh] of [[393,852],[852,393],[1024,768]]){
 const l=layout(vw,vh,640,480,sw,sh);
 near(l.width/l.height,vw/vh);
 // A point passing through the tracking frame + projection must land at the
 // same screen pixel as that point in the camera image (including crop).
 for(const [u,v] of [[0,0],[.2,.7],[.5,.5],[1,1]]){
  const nx=(l.x+u*l.width)/640*2-1,ny=1-(l.y+v*l.height)/480*2;
  near((nx*l.scaleX+1)*sw/2,(sw-l.videoWidth)/2+u*l.videoWidth);
  near((1-ny*l.scaleY)*sh/2,(sh-l.videoHeight)/2+v*l.videoHeight);
 }
}
console.log('PASS projection/video alignment: portrait, landscape and widescreen camera/viewport combinations');
// Exercise the actual A-Frame component lifecycle without camera permission.
let componentDefinition;const draws=[];
Object.assign(sandbox,{AFRAME:{THREE:T,components:{},registerComponent(_name,definition){componentDefinition=definition;}},
 innerWidth:393,innerHeight:852,document:{createElement(){return {width:0,height:0,getContext(){return {fillRect(){},drawImage(...args){draws.push(args);}};}};}}});
sandbox.window.NetARViewport.register();
const processed=[];const controller={canvas:{width:640,height:480},options:{},orientation:'portrait'};
const baseProjection=new T.PerspectiveCamera(48,4/3,.01,100).projectionMatrix.clone();
const context={arController:controller,update(frame){processed.push(frame);},getProjectionMatrix(){return baseProjection.clone();}};
const video={videoWidth:480,videoHeight:640,style:{}};
const camera=new T.PerspectiveCamera();let renderedSize;
const scene={systems:{arjs:{_arSession:{arContext:context,arSource:{domElement:video}}}},camera,renderer:{setSize(...args){renderedSize=args;}}};
const originalUpdate=context.update;
const component=Object.assign({el:{sceneEl:scene}},componentDefinition);
component.init();component.tick();context.update(video);
assert.equal(controller.orientation,'landscape');assert.equal(processed[0],component.frame);
near(draws[0][3]/draws[0][4],480/640);
assert.deepEqual(renderedSize.slice(0,2),[393,852]);
const first=camera.projectionMatrix.clone();component.tick();
first.elements.forEach((v,i)=>near(v,camera.projectionMatrix.elements[i]));
// Changing the viewport and the camera frame must recompute sizing, not accumulate scale.
sandbox.innerWidth=852;sandbox.innerHeight=393;video.videoWidth=1920;video.videoHeight=1080;
component.tick();context.update(video);near(draws[1][3]/draws[1][4],1920/1080);
assert.deepEqual(renderedSize.slice(0,2),[852,393]);
component.remove();assert.equal(context.update,originalUpdate);
console.log('PASS AR adapter lifecycle, non-stretched tracking frames, rotation and cleanup');
