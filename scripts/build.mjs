import {mkdirSync,rmSync,copyFileSync,cpSync} from 'node:fs';
rmSync('dist/client',{recursive:true,force:true});
mkdirSync('dist/client',{recursive:true});
mkdirSync('dist/server',{recursive:true});
for(const file of ['index.html','style.css','story.js','mobile.css','mobile-story-r5.js','mobile-preview.html','mobile-review.html'])copyFileSync(file,'dist/client/'+file);
cpSync('assets','dist/client/assets',{recursive:true});
copyFileSync('worker/index.js','dist/server/index.js');
