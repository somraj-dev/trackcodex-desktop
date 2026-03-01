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

    // Transitioning the generic #0A0A0A base backgrounds directly to the Vercel Screenshot's #0A0D14
    content = content.replace(/bg-\[#0A0A0A\]/ig, 'bg-[#0A0D14]');
    // Transitioning internal panels to the slightly lighter elevated hue
    content = content.replace(/bg-\[#111111\]/ig, 'bg-[#11141A]');
    content = content.replace(/border-\[#222222\]/ig, 'border-[#1E232E]');

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});
console.log('Fixed ' + changedFiles + ' files');
