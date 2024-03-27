import { expect } from 'chai';
import redirectIfNecessary from '../../redirects';
import redirects from '../../redirects/crossDomainRedirects.json';

describe('Redirect replaced pages', () => {
  it('should redirect when page matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/compensation/types-disability.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('.gov/disability/')).to.be.true;
  });

  it('should not redirect when there are no matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/nothing/',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
  });

  it('should redirect absolute redirects over catch-all redirects', () => {
    const fakeWindow = {
      location: {
        host: 'www.altoona.va.gov',
        pathname: '/locations/DuBois.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(
      fakeWindow.location.href.endsWith(
        '.gov/altoona-health-care/locations/dubois-va-clinic/',
      ),
    ).to.be.true;
  });

  it('should redirect catch-all redirects if no absolute redirect matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.altoona.va.gov',
        pathname: '/blahblahblah',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('.gov/altoona-health-care/')).to.be
      .true;
  });
});

describe('Validate crossDomainRedirects.json', () => {
  const nonSubdomainRedirects = redirects.filter(
    redirect => !redirect.isToSubdomain,
  );

  const redirectsBySource = nonSubdomainRedirects.reduce(
    (grouped, redirect) => {
      const fullPath = `https://${redirect.domain}${redirect.src}`;
      const items = grouped[fullPath] || [];
      return {
        ...grouped,
        [fullPath]: items.concat(redirect.dest),
      };
    },
    {},
  );
  Object.entries(redirectsBySource).forEach(([fullSource, destinations]) => {
    it(`${fullSource} is a valid URL`, () => {
      const url = new URL(fullSource);
      expect(fullSource).to.be.equal(url.href);
    });

    it(`${fullSource} has a unique valid destination`, () => {
      expect(destinations.length).to.be.equal(1);
      const destUrl = new URL(destinations[0], 'https://www.va.gov');
      expect(destinations[0]).to.be.equal(destUrl.pathname);
    });
  });
});
