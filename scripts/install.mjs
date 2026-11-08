#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const api=['qa-zephyr-case-review','qa-playwright-api-authoring','qa-playwright-api-review','qa-api-test-data','qa-api-failure-triage'];
export function tree(dir) {
  const out={};
  function walk(current,prefix='') {
    for(const e of fs.readdirSync(current,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      const key=prefix+e.name, f=path.join(current,e.name);
      if(e.isSymbolicLink()) throw Error(`Symlink refused: ${f}`);
      if(e.isDirectory()) walk(f,key+'/');
      else if(e.isFile()) out[key]=crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
      else throw Error(`Special file refused: ${f}`);
    }
  } walk(dir); return out;
}
function noLinks(p) {
  for(let q=path.resolve(p);;q=path.dirname(q)) {
    if(fs.existsSync(q) || (()=>{try{fs.lstatSync(q);return true;}catch{return false;}})()) {
      if(fs.lstatSync(q).isSymbolicLink()) throw Error(`Symlink refused: ${q}`);
    }
    if(path.dirname(q)===q) break;
  }
}
export function install(project,{profile='api',skills,dryRun=false}={}) {
  if(!['api','browser'].includes(profile)) throw Error('Profile must be api or browser');
  const names=skills??(profile==='api'?api:[...api,'playwright-cli']);
  if(!names.length || new Set(names).size!==names.length) throw Error('Choose unique skills');
  for(const name of names) if(![...api,'playwright-cli'].includes(name)) throw Error(`Unknown skill: ${name}`);
  const target=fs.realpathSync(project);
  if(!fs.statSync(target).isDirectory()) throw Error('Consumer project must exist');
  const dest=path.join(target,'.agents/skills'), manifestPath=path.join(dest,'.qa-skills-manifest.json');noLinks(manifestPath);
  const prior=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{version:1,skills:{}};
  if(prior.version!==1 || !prior.skills || typeof prior.skills!=='object') throw Error('Unsupported manifest');
  const plan=[];
  for(const name of names) {
    const src=path.join(root,'skills',name), dst=path.join(dest,name);noLinks(dst);
    const hashes=tree(src);
    if(fs.existsSync(dst)) {
      const previous=prior.skills[name];
      if(!previous) throw Error(`Unmanaged skill exists: ${name}; preserve it or move it aside explicitly`);
      if(JSON.stringify(tree(dst))!==JSON.stringify(previous.files)) throw Error(`Local modifications detected: ${name}; back up and reconcile before updating`);
    }
    plan.push({name,src,dst,hashes});
  }
  if(dryRun) return {dryRun:true,project:target,skills:names};
  fs.mkdirSync(dest,{recursive:true});
  // Serialize cooperating installers. All conflicts are checked before copying.
  const lock=path.join(dest,'.qa-skills-install.lock');const lockFd=fs.openSync(lock,'wx');
  let stage;const changed=[];
  try {
    // Recheck after locking; concurrent installers may have changed the manifest.
    const current=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{version:1,skills:{}};
    if(JSON.stringify(current)!==JSON.stringify(prior)) throw Error('Manifest changed during planning; retry');
    for(const p of plan) {
      noLinks(p.dst);
      if(fs.existsSync(p.dst) && JSON.stringify(tree(p.dst))!==JSON.stringify(prior.skills[p.name]?.files)) throw Error(`Local modifications detected: ${p.name}`);
    }
    stage=fs.mkdtempSync(path.join(dest,'.qa-stage-'));
    fs.mkdirSync(path.join(stage,'backup'));
    for(const p of plan) fs.cpSync(p.src,path.join(stage,p.name),{recursive:true});
    for(const p of plan) {
      const backup=path.join(stage,'backup',p.name),hadOld=fs.existsSync(p.dst);
      if(hadOld) fs.renameSync(p.dst,backup);
      changed.push({...p,backup,hadOld});
      fs.renameSync(path.join(stage,p.name),p.dst);
      prior.skills[p.name]={files:p.hashes,sourceVersion:JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version};
    }
    fs.writeFileSync(path.join(stage,'manifest'),JSON.stringify(prior,null,2)+'\n');
    fs.renameSync(path.join(stage,'manifest'),manifestPath);
  } catch(error) {
    for(const p of changed.reverse()) {
      fs.rmSync(p.dst,{recursive:true,force:true});
      if(p.hadOld) fs.renameSync(p.backup,p.dst);
    }
    throw error;
  } finally {
    if(stage) fs.rmSync(stage,{recursive:true,force:true});fs.closeSync(lockFd);fs.unlinkSync(lock);
  }
  return {dryRun:false,project:target,skills:names,manifest:manifestPath};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2);let project,profile='api',skills,dryRun=false;
    for(let i=0;i<args.length;i++) {
      if(args[i]==='--project') project=args[++i];
      else if(args[i]==='--profile') profile=args[++i];
      else if(args[i]==='--skills') skills=args[++i]?.split(',');
      else if(args[i]==='--dry-run') dryRun=true;
      else throw Error(`Unknown argument: ${args[i]}`);
    }
    if(!project) throw Error('Usage: node scripts/install.mjs --project /path/to/project [--profile api|browser] [--skills name,name] [--dry-run]');
    console.log(JSON.stringify(install(project,{profile,skills,dryRun}),null,2));
  } catch(e) {console.error(e.message);process.exitCode=1;}
}
