/* Each face uses closed-solid coordinates. A tree of shared edges defines the net.
   At t=0 all hinge transforms are identity; at t=1 child normals align with
   parent normals. Rigid transforms preserve every face and shared hinge edge. */
(function(){
const defs={};
function box(w,d,h){
 const v=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2],[-w/2,h,-d/2],[w/2,h,-d/2],[w/2,h,d/2],[-w/2,h,d/2]];
 return {vertices:v,faces:[{ids:[0,1,2,3],normal:[0,-1,0]}, {ids:[0,4,5,1],normal:[0,0,-1],parent:0,edge:[0,1]}, {ids:[1,5,6,2],normal:[1,0,0],parent:0,edge:[1,2]}, {ids:[2,6,7,3],normal:[0,0,1],parent:0,edge:[2,3]}, {ids:[3,7,4,0],normal:[-1,0,0],parent:0,edge:[3,0]}, {ids:[4,7,6,5],normal:[0,1,0],parent:1,edge:[4,5]}]};
}
defs.cube={name:'Cube',facts:'6 square faces · 12 edges · 8 vertices',...box(1,1,1)};
defs.rectangular={name:'Rectangular prism',facts:'6 rectangular faces · 12 edges · 8 vertices',...box(1.5,.8,1)};
const a=Math.sqrt(3)/2;
const vertices=[[-.6,0,-a*.4],[.6,0,-a*.4],[0,0,a*.8],[-.6,.9,-a*.4],[.6,.9,-a*.4],[0,.9,a*.8]];
const faces=[{ids:[0,1,2],normal:[0,-1,0]}];
for(let i=0;i<3;i++){let j=(i+1)%3,dx=vertices[j][0]-vertices[i][0],dz=vertices[j][2]-vertices[i][2],l=Math.hypot(dx,dz);faces.push({ids:[i,i+3,j+3,j],normal:[dz/l,0,-dx/l],parent:0,edge:[i,j]});}
faces.push({ids:[3,5,4],normal:[0,1,0],parent:1,edge:[3,4]});
defs.triangular={name:'Triangular prism',facts:'2 triangles + 3 rectangles · 9 edges · 6 vertices',vertices,faces};
const colors=[0xe8ac47,0x53a9b2,0xe87c59,0x8695cf,0x84b28a,0xd989af];
window.NetModels={defs,create(T,key){
 const def=defs[key],group=new T.Group(),matrices=def.faces.map(()=>new T.Matrix4()),meshes=[];
 def.faces.forEach((f,i)=>{
  const geo=new T.BufferGeometry(),points=f.ids.map(id=>def.vertices[id]).flat();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));
  const idx=[];for(let j=1;j<f.ids.length-1;j++)idx.push(0,j,j+1);geo.setIndex(idx);geo.computeVertexNormals();
  const mesh=new T.Mesh(geo,new T.MeshStandardMaterial({color:colors[i],side:T.DoubleSide,roughness:.9}));mesh.matrixAutoUpdate=false;
  // Use polygon perimeter only: no triangulation diagonal is drawn.
  const outline=[];f.ids.forEach((id,j)=>outline.push(...def.vertices[id],...def.vertices[f.ids[(j+1)%f.ids.length]]));
  const lineGeo=new T.BufferGeometry();lineGeo.setAttribute('position',new T.Float32BufferAttribute(outline,3));
  mesh.add(new T.LineSegments(lineGeo,new T.LineBasicMaterial({color:0x26343e})));group.add(mesh);meshes.push(mesh);
 });
 const hinges=def.faces.map(f=>{
  if(f.parent===undefined)return null;
  const p=new T.Vector3(...def.vertices[f.edge[0]]),q=new T.Vector3(...def.vertices[f.edge[1]]),axis=q.sub(p).normalize();
  const n=new T.Vector3(...f.normal),target=new T.Vector3(...def.faces[f.parent].normal);
  const angle=Math.atan2(axis.dot(new T.Vector3().crossVectors(n,target)),n.dot(target));return {p,axis,angle};
 });
 const obj={group,def,meshes,matrices,hinges,set(t){
  def.faces.forEach((f,i)=>{
   const h=hinges[i];if(!h)matrices[i].identity();else{
    const rot=new T.Matrix4().makeTranslation(h.p.x,h.p.y,h.p.z).multiply(new T.Matrix4().makeRotationAxis(h.axis,h.angle*t)).multiply(new T.Matrix4().makeTranslation(-h.p.x,-h.p.y,-h.p.z));
    matrices[i].copy(matrices[f.parent]).multiply(rot);
   }meshes[i].matrix.copy(matrices[i]);meshes[i].matrixWorldNeedsUpdate=true;
  });
 },dispose(){meshes.forEach(m=>{m.geometry.dispose();m.material.dispose();m.children.forEach(l=>{l.geometry.dispose();l.material.dispose();});});}};
 obj.set(0);return obj;
}};
})();
