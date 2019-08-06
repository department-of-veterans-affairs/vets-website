const { expect } = require('chai');
const sinon = require('sinon');

const applyIgnoredRoutes = require('../../helpers/applyIgnoredRoutes');

describe('getBrokenLink/getReactLandingPages', () => {
  const { getReactLandingPages } = applyIgnoredRoutes;

  it('filter files down to React apps', () => {
    const files = [
      { path: '/health-care' },
      { path: '/disability' },
      { entryname: 'dashboard', path: 'dashboard' },
    ];

    const result = getReactLandingPages(files);

    expect(result).to.be.deep.equal(['/dashboard']);
  });
});

describe('getBrokenLinks', () => {
  it('removes links detected as errors that are child routes of React apps', () => {
    const brokenPage = {
      path: '/example-page',
      linkErrors: [
        { target: '' },
        { target: '/non-react-path' },
        { target: '/react-path/child-page' },
      ],
    };

    const getReactLandingPages = sinon.stub().returns(['/react-path']);

    const result = applyIgnoredRoutes([brokenPage], null, getReactLandingPages);

    expect(result).to.be.deep.equal([
      {
        path: '/example-page',
        linkErrors: [{ target: '' }, { target: '/non-react-path' }],
      },
    ]);
  });

  it('removes links ending with .asp', () => {
    const brokenPage = {
      path: '/example-page',
      linkErrors: [
        { target: '' },
        { target: '/non-asp-page' },
        { target: '/healthcare.asp' },
      ],
    };

    const getReactLandingPages = sinon.stub().returns([]);

    const result = applyIgnoredRoutes([brokenPage], null, getReactLandingPages);

    expect(result).to.be.deep.equal([
      {
        path: '/example-page',
        linkErrors: [{ target: '' }, { target: '/non-asp-page' }],
      },
    ]);
  });

  it('removes page whose link-errors were filtered out entirely', () => {
    const brokenPages = [
      {
        path: '/example-page',
        linkErrors: [{ target: '/broken-page' }],
      },
      {
        path: '/example-page',
        linkErrors: [{ target: '/healthcare.asp' }],
      },
    ];

    const getReactLandingPages = sinon.stub().returns([]);
    const result = applyIgnoredRoutes(brokenPages, null, getReactLandingPages);

    expect(result).to.be.deep.equal([
      {
        path: '/example-page',
        linkErrors: [{ target: '/broken-page' }],
      },
    ]);
  });
});
