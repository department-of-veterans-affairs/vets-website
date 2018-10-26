const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Json2csvParser = require('json2csv').Parser;

const rootPath = 'build/localhost';
const fields = [
  'PAGE TITLE',
  'LINK TEXT',
  'TARGET TITLE',
  'PAGE URL',
  'TARGET URL',
];

function getFilesFromDir(dir, fileTypes) {
  const filesToReturn = [];

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    Object.keys(files).forEach(key => {
      const curFile = path.join(currentPath, files[key]);
      if (
        fs.statSync(curFile).isFile() &&
        fileTypes.indexOf(path.extname(curFile)) !== -1
      ) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    });
  }

  walkDir(dir);

  return filesToReturn;
}

const fileList = getFilesFromDir(rootPath, ['.md', '.html']);

const fileLinks = fileList.reduce((acc, file) => {
  const fileContent = fs.readFileSync(`${rootPath}${file}`);
  const data = fileContent.toString();

  const $ = cheerio.load(data);
  const $linkTags = $('a');
  const pageTitle = $('title')
    .text()
    .trim();

  const linkObjects = $linkTags.map(function updateItem() {
    return {
      'PAGE TITLE': pageTitle,
      'LINK TEXT': $(this)
        .text()
        .trim(),
      'TARGET TITLE': $(this)
        .text()
        .trim(),
      'PAGE URL': file,
      'TARGET URL': this.attribs.href,
    };
  });

  return [...acc, ...linkObjects.toArray()];
}, []);

const json2csvParser = new Json2csvParser({ fields });
const csv = json2csvParser.parse(fileLinks);

fs.writeFileSync('./all-links.csv', csv);

// console.log('Done generating your csv file');
