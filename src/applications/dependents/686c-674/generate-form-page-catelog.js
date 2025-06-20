// // Script to generate a markdown catalog of the form's chapters and pages
// const fs = require('fs');
// const path = require('path');

// // Try to require the form config
// const formConfigPath = path.join(__dirname, 'config', 'form.js');
// let formConfig;
// try {
//     // Support both CommonJS and ES module exports
//     const configModule = require(formConfigPath);
//     formConfig = configModule.default || configModule.formConfig || configModule;
// } catch (e) {
//     console.error('Could not load form config:', e);
//     process.exit(1);
// }

// function getTitle(obj, fallback) {
//     if (!obj) return fallback;
//     if (typeof obj.title === 'function') return obj.title();
//     if (typeof obj.title === 'string') return obj.title;
//     return fallback;
// }

// function generateCatalog(config) {
//     let md = '';
//     // Form title
//     if (config.title) {
//         md += `# ${typeof config.title === 'function' ? config.title() : config.title}\n\n`;
//     }
//     if (config.subTitle) {
//         md += `## ${typeof config.subTitle === 'function' ? config.subTitle() : config.subTitle}\n\n`;
//     }
//     if (config.formId) {
//         md += `- **Form ID:** \
// \`${config.formId}\`\n`;
//     }
//     if (config.rootUrl) {
//         md += `- **Root URL:** \`${config.rootUrl}\`\n`;
//     }
//     md += '\n';

//     if (!config.chapters) {
//         md += '_No chapters defined in form config._\n';
//         return md;
//     }

//     md += '## Chapters\n\n';
//     Object.entries(config.chapters).forEach(([chapterKey, chapter]) => {
//         const chapterTitle = getTitle(chapter, chapterKey);
//         md += `### ${chapterTitle}\n`;
//         if (!chapter.pages || Object.keys(chapter.pages).length === 0) {
//             md += '_No pages defined._\n\n';
//             return;
//         }
//         md += '| Page Key | Page Title |\n';
//         md += '|----------|------------|\n';
//         Object.entries(chapter.pages).forEach(([pageKey, page]) => {
//             const pageTitle = getTitle(page, pageKey);
//             md += `| \`${pageKey}\` | ${pageTitle} |\n`;
//         });
//         md += '\n';
//     });
//     return md;
// }

// const output = generateCatalog(formConfig);
// const outPath = path.join(__dirname, 'FORM_PAGE_CATALOG.md');
// fs.writeFileSync(outPath, output, 'utf8');
// console.log(`Catalog written to ${outPath}`);
