const { expect } = require('chai');

const getHtmlFileList = require('../../helpers/getHtmlFileList');

describe('getHtmlFileList', () => {
  it('returns only html files', () => {
    const files = {
      'something.pdf': {
        path: 'something.pdf',
      },
      'something.png': {
        path: 'something.png',
      },
      'page.html': {
        path: 'page.html',
      },
      'disability.html': {
        path: 'disability.html',
      },
      'index.html': {
        path: 'index.html',
      },
    };

    const result = getHtmlFileList(files);

    expect(result).to.be.deep.equal([
      { path: 'page.html' },
      { path: 'disability.html' },
      { path: 'index.html' },
    ]);
  });

  it('skips sitemap-excluded files', () => {
    const files = {
      'page.html': {
        path: 'page.html',
        private: true,
      },
      'disability.html': {
        path: 'disability.html',
      },
    };

    const result = getHtmlFileList(files);

    expect(result).to.be.deep.equal([{ path: 'disability.html' }]);
  });
});
