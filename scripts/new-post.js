import fs from 'fs';
import path from 'path';

function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); //月份从0开始，所以要加1
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
    process.exit(1); // Terminate the script and return error code 1
}

let fileName = args[0];

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
    fileName += '.md';
}

const targetDir = './src/content/posts/';
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
    console.error(`Error：File ${fullPath} already exists `);
    process.exit(1);
}

const content =
`---
title: ${args[0]}
published: ${getDate()}
description: 
cover:
  url: 
  alt: 
tags: []
categories: []
---
`;

fs.writeFileSync(path.join(targetDir, fileName), content);

console.log(`Post ${fullPath} created`);
