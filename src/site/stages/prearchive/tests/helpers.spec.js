const { expect } = require('chai');
const updateAssetLinkElements = require('../helpers');

const mockHTML = `
<img id="img-update" src="/img/updateme.jpg" />
<script id="script-update" src="/js/updateme.js"></script>
<link id="link-update" href="/styles/updateme.css">
<picture><source id="picture-source-srcset-update" srcset="/img/updateme.jpg, /img/updateme2.jpg"></picture>
<img id="img-data-src-update" data-src="/img/updateme" />
<div id="div-no-update" src="/img/donotupdate.jpg"></div>
<img id="img-teamsite-no-update" src="/img/va_files-donotupdate.jpg" />
<img id="img-http-no-update" src="http://donotupdate.com" />
<img id="img-https-no-update" src="https://donotupdate.com" />
<img id="img-data-no-update" src="data:image/gif;base64,donotupdate" />
`;

describe('prearchive/helpers', () => {
  let result;
  before(() => {
    const assetLinkTags = 'script, img, link, picture > source';
    const teamsiteAssets = 'va_files';
    const bucketPath = 'https://updatedPath';
    result = updateAssetLinkElements(
      mockHTML,
      assetLinkTags,
      teamsiteAssets,
      bucketPath,
    );
  });

  after(() => {
    result = null;
  });

  it('updates src link for <img> element', () => {
    const imgSrc = result('#img-update').attr('src');
    expect(imgSrc).to.equal('https://updatedPath/img/updateme.jpg');
  });

  it('updates src link for <script> element', () => {
    const scriptSrc = result('#script-update').attr('src');
    expect(scriptSrc).to.equal('https://updatedPath/js/updateme.js');
  });

  it('updates href link for <link> element', () => {
    const linkHref = result('#link-update').attr('href');
    expect(linkHref).to.equal('https://updatedPath/styles/updateme.css');
  });

  it('updates both links in srcset for <picture><source> element', () => {
    const pictureSrcset = result('#picture-source-srcset-update').attr(
      'srcset',
    );
    expect(pictureSrcset).to.equal(
      'https://updatedPath/img/updateme.jpg, https://updatedPath/img/updateme2.jpg',
    );
  });

  it('updates data-source link', () => {
    const dataSrcLink = result('#img-data-src-update').attr('data-src');
    expect(dataSrcLink).to.equal('https://updatedPath/img/updateme');
  });

  it('does not update src link in <div> element', () => {
    const divSrc = result('#div-no-update').attr('src');
    expect(divSrc).to.equal('/img/donotupdate.jpg');
  });

  it('does not update src link that contains "va_files"', () => {
    const teamsiteSrc = result('#img-teamsite-no-update').attr('src');
    expect(teamsiteSrc).to.equal('/img/va_files-donotupdate.jpg');
  });

  it('does not update src link that begins with "http" or "https"', () => {
    const httpSrc = result('#img-http-no-update').attr('src');
    const httpsSrc = result('#img-https-no-update').attr('src');
    expect(httpSrc).to.equal('http://donotupdate.com');
    expect(httpsSrc).to.equal('https://donotupdate.com');
  });

  it('does not update src link that begins with "data:"', () => {
    const dataSrc = result('#img-data-no-update').attr('src');
    expect(dataSrc).to.equal('data:image/gif;base64,donotupdate');
  });
});
