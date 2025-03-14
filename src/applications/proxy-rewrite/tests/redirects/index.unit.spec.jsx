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

describe('Validate crossDomainRedirects.json except for `isToSubdomain` and `batch`', () => {
  const nonSubdomainRedirects = redirects.filter(
    redirect => !redirect.isToSubdomain && !redirect.batch,
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

describe('validate batch redirects', () => {
  it('should correctly handle batch redirects that match exactly', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/resources_comp0100.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match regardless of capitalization', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/COMPENSATION/resourCES_comp0100.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match exactly', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/resources_comp0216.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match exactly', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/sb2014.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match regardless of capitalization', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/COMPENSation/SB2014.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match exactly', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/sb1999.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match exactly', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/special_Benefit_Allowances_2015.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match regardless of capitalization', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/CompENSation/SPECIAL_Benefit_Allowances_2015.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that match exactly', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/special_Benefit_Allowances_2003.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('/disability/compensation-rates/'))
      .to.be.true;
  });

  it('should correctly handle batch redirects that do not match because only part of the path is there', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq('/Compensation');
  });

  it('should correctly handle batch redirects that do not match because the number is not in the list', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/resources_comp.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq(
      '/Compensation/resources_comp.asp',
    );
  });

  it('should correctly handle batch redirects that do not match because the number is not in the list', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/resources_comp0215.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq(
      '/Compensation/resources_comp0215.asp',
    );
  });

  it('should correctly handle batch redirects that do not match because the number is not in the list', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/sb0215.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq('/Compensation/sb0215.asp');
  });

  it('should correctly handle batch redirects that do not match because the number is not in the list', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/special_Benefit_Allowances_2023.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq(
      '/Compensation/special_Benefit_Allowances_2023.asp',
    );
  });

  it('should correctly handle batch redirects that do not match because there are extra numbers', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/resources_comp000215.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq(
      '/Compensation/resources_comp000215.asp',
    );
  });

  it('should correctly handle batch redirects that do not match because there are extra numbers', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/sb201300.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq('/Compensation/sb201300.asp');
  });

  it('should correctly handle batch redirects that do not match because there are extra numbers', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/Compensation/special_Benefit_Allowances_200003.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
    expect(fakeWindow.location.pathname).to.eq(
      '/Compensation/special_Benefit_Allowances_200003.asp',
    );
  });
});
