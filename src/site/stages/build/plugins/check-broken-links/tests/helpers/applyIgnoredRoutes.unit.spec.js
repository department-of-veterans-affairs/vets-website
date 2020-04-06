const sinon = require('sinon');

const applyIgnoredRoutes = require('../../helpers/applyIgnoredRoutes');

describe('getBrokenLink/getReactLandingPages', () => {
  const { getReactLandingPages } = applyIgnoredRoutes;

  test('filter files down to React apps', () => {
    const files = [
      { path: '/health-care' },
      { path: '/disability' },
      { entryname: 'dashboard', path: 'dashboard' },
    ];

    const result = getReactLandingPages(files);

    expect(result).toEqual(['/dashboard']);
  });
});

describe('getBrokenLinks', () => {
  test(
    'removes links detected as errors that are child routes of React apps',
    () => {
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

      expect(result).toEqual([
        {
          path: '/example-page',
          linkErrors: [{ target: '' }, { target: '/non-react-path' }],
        },
      ]);
    }
  );

  test('removes links ending with .asp', () => {
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

    expect(result).toEqual([
      {
        path: '/example-page',
        linkErrors: [{ target: '' }, { target: '/non-asp-page' }],
      },
    ]);
  });

  test('removes page whose link-errors were filtered out entirely', () => {
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

    expect(result).toEqual([
      {
        path: '/example-page',
        linkErrors: [{ target: '/broken-page' }],
      },
    ]);
  });
});
