import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {install,api,tree} from '../scripts/install.mjs';
const repo=path.resolve('.');
function tmp(t){const p=fs.mkdtempSync(path.join(os.tmpdir(),'qa-consumer-'));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;}
test('dry run writes nothing; selected skills install and update; local additions block all selected writes',t=>{
 const p=tmp(t);install(p,{dryRun:true});assert.deepEqual(fs.readdirSync(p),[]);
 install(p,{skills:[api[0]]});const dest=path.join(p,'.agents/skills',api[0]);const before=tree(dest);
 install(p,{skills:[api[0]]});assert.deepEqual(tree(dest),before);
 fs.writeFileSync(path.join(dest,'local.md'),'owned');assert.throws(()=>install(p,{skills:[api[1],api[0]]}),/Local modifications/);assert.equal(fs.existsSync(path.join(p,'.agents/skills',api[1])),false);
});
test('unmanaged collision, edited/deleted files, traversal and symlink refused',t=>{
 const p=tmp(t);install(p);const dest=path.join(p,'.agents/skills');
 fs.appendFileSync(path.join(dest,api[0],'SKILL.md'),'local edit');assert.throws(()=>install(p),/Local modifications/);
 assert.throws(()=>install(p,{skills:['../bad']}),/Unknown skill/);
 fs.rmSync(path.join(dest,api[1],'LICENSE'));assert.throws(()=>install(p,{skills:[api[1]]}),/Local modifications/);
 const q=tmp(t);fs.symlinkSync(dest,path.join(q,'.agents'));assert.throws(()=>install(q),/Symlink/);
 const r=tmp(t);fs.mkdirSync(path.join(r,'.agents/skills',api[0]),{recursive:true});assert.throws(()=>install(r),/Unmanaged/);
});
test('browser profile bundles all references; isolated consumer works without checkout',t=>{
 const p=tmp(t);install(p,{profile:'browser'});const dest=path.join(p,'.agents/skills');
 const script=path.join(dest,api[0],'scripts/normalize.py');const source=path.join(p,'cases.csv');fs.copyFileSync(path.join(repo,'examples/cases/development.csv'),source);
 const result=spawnSync('python3',[script,source,path.join(p,'normalized.json')],{cwd:p,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 assert.equal(JSON.parse(fs.readFileSync(path.join(p,'normalized.json'))).cases.length,10);
 assert.ok(fs.existsSync(path.join(dest,'playwright-cli/references/tracing.md')));
 for(const n of [...api,'playwright-cli'])for(const rel of Object.keys(tree(path.join(dest,n))))if(rel.endsWith('.md')){
  const text=fs.readFileSync(path.join(dest,n,rel),'utf8');
  for(const match of text.matchAll(/\]\((references\/[^)#]+)\)/g))assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(dest,n,rel)),match[1])),match[1]);
 }
 assert.equal(fs.readFileSync(path.join(dest,api[0],'SKILL.md'),'utf8').includes('/private/tmp'),false);
});
