import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {tree,api} from './install.mjs';
for(const name of [...api,'playwright-cli']){
 const dir=path.resolve('skills',name),s=fs.readFileSync(path.join(dir,'SKILL.md'),'utf8');assert.match(s,new RegExp(`^---\\nname: ${name}\\n`));assert.match(s,/\ndescription: .+/);assert.ok(fs.existsSync(path.join(dir,'LICENSE')));
 for(const rel of Object.keys(tree(dir)).filter(x=>x.endsWith('.md'))){const file=path.join(dir,rel),text=fs.readFileSync(file,'utf8').replace(/```[\s\S]*?```/g,'').replace(/`[^`]+`/g,'');for(const m of text.matchAll(/\]\(([^)]+)\)/g)){if(/^(https?:|#)/.test(m[1]))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(file),m[1].split('#')[0])),`${file}: broken ${m[1]}`);}}
 console.log(`Valid metadata, license, resources: ${name}`);
}

const browserHashes=JSON.parse(fs.readFileSync("third_party/browser-files.json","utf8"));
const installedHashes=tree(path.resolve("skills/playwright-cli"));
for(const [file,hash] of Object.entries(browserHashes))assert.equal(installedHashes[file],hash,`Upstream browser snapshot changed: ${file}`);
assert.deepEqual(Object.keys(installedHashes).filter(x=>x!=="LICENSE").sort(),Object.keys(browserHashes).sort());
console.log("Official browser snapshot matches upstream file inventory");
