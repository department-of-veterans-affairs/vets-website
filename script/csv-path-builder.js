const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Json2csvParser = require('json2csv').Parser;

const rootPath = 'build/localhost';

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

const getTargetTitle = href => {
  if (href) {
    if (href.startsWith('/')) {
      let filePath = `${rootPath}${href}/index.html`;

      if (href === '/') {
        filePath = `${rootPath}/index.html`;
      }

      if (href.includes('.pdf')) {
        if (fs.existsSync(`${rootPath}${href}`)) {
          return `This is a ${path.extname(href)} file`;
        }

        return 'Page does not exist';
      }

      if (href.includes('/introduction')) {
        filePath = `${rootPath}${href.replace('/introduction', '')}/index.html`;
        const fileContent = fs.readFileSync(filePath);
        const data = fileContent.toString();

        const $ = cheerio.load(data);

        return $('title')
          .text()
          .trim();
      }

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        const data = fileContent.toString();

        const $ = cheerio.load(data);

        return $('title')
          .text()
          .trim();
      }

      if (filePath.includes('#')) {
        filePath = `${rootPath}${href.split('/#')[0]}/index.html`;

        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath);
          const data = fileContent.toString();
          const $ = cheerio.load(data);

          return $('title')
            .text()
            .trim();
        }
      }

      return `Page does not exist`;
    }

    if (href.includes('localhost')) {
      if (href.includes('.asp')) {
        return 'External Link';
      }

      return href;
    }

    if (href.includes('http')) {
      return 'External Link';
    }
  }

  return false;
};

const fileLinks = fileList.reduce((acc, file) => {
  const fileContent = fs.readFileSync(`${rootPath}${file}`);
  const data = fileContent.toString();

  // eslint-disable-next-line
  console.log(`processing ${file}`);

  const $ = cheerio.load(data);
  const $linkTags = $('a');
  const pageTitle = $('title')
    .text()
    .trim();

  const linkObjects = $linkTags.map(function updateItem() {
    let linkText = $(this)
      .text()
      .trim();

    if (
      !$(this)
        .text()
        .trim() &&
      $(this).children('img').length === 1
    ) {
      const src = $(this)
        .children('img')
        .attr('src');

      if (src.includes('data:image')) {
        linkText = 'image/png:base64';
      } else {
        linkText = src;
      }
    }

    return {
      'PAGE TITLE': pageTitle,
      'PAGE URL': file.replace('/index.html', '').replace('.html', ''),
      'LINK TEXT': linkText,
      'LINK URL': this.attribs.href ? this.attribs.href : '',
      'TARGET TITLE':
        getTargetTitle(this.attribs.href) ||
        $(this)
          .text()
          .trim(),
    };
  });

  return [...acc, ...linkObjects.toArray()];
}, []);

const json2csvParser = new Json2csvParser();
const csv = json2csvParser.parse(fileLinks);

fs.writeFileSync(`./all-links.csv`, csv);
// eslint-disable-next-line
console.log('Done generating your all-links.csv file');
