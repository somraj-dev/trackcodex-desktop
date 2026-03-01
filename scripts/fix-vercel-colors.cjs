const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            file = path.resolve(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory() && !file.includes('node_modules')) {
                results = results.concat(walk(file));
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        });
    } catch (e) { }
    return results;
}

const files = [...walk('components'), ...walk('views'), 'App.tsx'];
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Note: We are transforming the #000000 changes we made earlier into #0A0A0A, 
    // and the #0A0A0A secondary backgrounds into #111111 to match Vercel perfectly.
    content = content.replace(/bg-\[#0A0A0A\]/ig, 'bg-[#111111]');
    content = content.replace(/bg-\[#000000\]/ig, 'bg-[#0A0A0A]');
    content = content.replace(/border-\[#1A1A1A\]/ig, 'border-[#222222]');

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});
console.log('Fixed ' + changedFiles + ' files');
