import redirectIfNecessary from '../../redirects';

describe('Redirect replaced pages', () => {
  test('should redirect when page matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/compensation/types-disability.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('.gov/disability/')).toBe(true);
  });

  test('should not redirect when there are no matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/nothing/',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).toBeUndefined();
  });
});
