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

    // Try case-insensitive regex for hex codes
    content = content.replace(/bg-\[#010409\]/ig, 'bg-[#000000]');
    content = content.replace(/bg-\[#161b22\]/ig, 'bg-[#0A0A0A]');
    content = content.replace(/bg-\[#0d1117\]/ig, 'bg-[#000000]');
    content = content.replace(/border-\[#30363d\]/ig, 'border-[#1A1A1A]');
    content = content.replace(/hover:bg-\[#21262d\]/ig, 'hover:bg-[#111111]');
    content = content.replace(/hover:bg-\[#161b22\]/ig, 'hover:bg-[#111111]');
    content = content.replace(/hover:border-\[#30363d\]/ig, 'hover:border-[#333333]');
    content = content.replace(/bg-\[#21262d\]/ig, 'bg-[#111111]');

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});
console.log('Fixed ' + changedFiles + ' files');
