import json,base64,struct,sys,numpy as np
d=json.load(open(sys.argv[1])); d=d.get('result',d); print(d.get('info',''))
bin_=b''; views=[]; accs=[]; meshes=[]; nodes=[]; mats=[]
def add(arr,target,comp,typ,mm=False):
    global bin_
    while len(bin_)%4: bin_+=b'\0'
    off=len(bin_); b=arr.tobytes(); bin_+=b
    views.append({'buffer':0,'byteOffset':off,'byteLength':len(b),'target':target})
    a={'bufferView':len(views)-1,'componentType':comp,'count':len(arr),'type':typ}
    if mm: a['min']=arr.min(0).tolist(); a['max']=arr.max(0).tolist()
    accs.append(a); return len(accs)-1
COL={'PAINT':[.01,.04,.3,1],'GLASS':[.01,.01,.01,1],'TAIL':[1,.05,.05,1],'HEAD':[.9,.95,1,1],'CHROME':[.85,.86,.88,1]}
stats={}
for k,v in sorted(d['mats'].items()):
    P=np.frombuffer(base64.b64decode(v['p']),np.float32).reshape(-1,3); N=np.frombuffer(base64.b64decode(v['n']),np.float32).reshape(-1,3)
    I=np.frombuffer(base64.b64decode(v['i']),np.uint32)
    stats[k]=(len(P),len(I)//3)
    mats.append({'name':k,'pbrMetallicRoughness':{'baseColorFactor':COL.get(k,[.05,.05,.05,1]),'metallicFactor':.5,'roughnessFactor':.4}})
    pa=add(P,34962,5126,'VEC3',True); na=add(N,34962,5126,'VEC3'); ia=add(I,34963,5125,'SCALAR')
    meshes.append({'name':k,'primitives':[{'attributes':{'POSITION':pa,'NORMAL':na},'indices':ia,'material':len(mats)-1}]})
    nodes.append({'name':k,'mesh':len(meshes)-1})
while len(bin_)%4: bin_+=b'\0'
g={'asset':{'version':'2.0','generator':'AFTERHOURS autobahn_63.py (Blender 5.2 mesh data)'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],
   'nodes':nodes,'meshes':meshes,'materials':mats,'accessors':accs,'bufferViews':views,'buffers':[{'byteLength':len(bin_)}]}
js=json.dumps(g,separators=(',',':')).encode()
while len(js)%4: js+=b' '
out=struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(bin_))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(bin_),0x004E4942)+bin_
open(sys.argv[2],'wb').write(out); print(len(out),stats)
