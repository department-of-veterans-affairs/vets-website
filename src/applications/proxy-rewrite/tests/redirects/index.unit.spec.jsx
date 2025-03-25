import { expect } from 'chai';
import redirectIfNecessary from '../../redirects';
import redirects from '../../redirects/crossDomainRedirects.json';

<<<<<<< HEAD
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
=======
const mockAndRedirect = (host, pathname) => {
  const fakeWindow = {
    location: {
      host,
      pathname,
    },
  };

  redirectIfNecessary(fakeWindow);

  return fakeWindow;
};

const expectToRedirect = (host, pathname, newPath) => {
  const fakeWindow = mockAndRedirect(host, pathname);

  expect(fakeWindow.location.href.endsWith(newPath)).to.be.true;
};

const expectNotToRedirect = (host, pathname) => {
  const fakeWindow = mockAndRedirect(host, pathname);

  expect(fakeWindow.location.href).to.be.undefined;
  expect(fakeWindow.location.pathname).to.eq(pathname);
};

describe('Redirect replaced pages', () => {
  it('should redirect when page matches', () => {
    expectToRedirect(
      'www.benefits.va.gov',
      '/compensation/types-disability.asp',
      '.gov/disability/',
    );
  });

  it('should not redirect when there are no matches', () => {
    expectNotToRedirect('www.benefits.va.gov', '/nothing/');
  });

  it('should redirect absolute redirects over catch-all redirects', () => {
    expectToRedirect(
      'www.altoona.va.gov',
      '/locations/DuBois.asp',
      '.gov/altoona-health-care/locations/dubois-va-clinic/',
    );
  });

  it('should redirect catch-all redirects if no absolute redirect matches', () => {
    expectToRedirect(
      'www.altoona.va.gov',
      '/blahblahblah',
      '.gov/altoona-health-care/',
    );
  });
});

describe('Validate crossDomainRedirects.json except for `isToSubdomain` and `batch`', () => {
  const nonSubdomainRedirects = redirects.filter(
    redirect => !redirect.isToSubdomain && !redirect.batch,
>>>>>>> main
  );

  const redirectsBySource = nonSubdomainRedirects.reduce(
    (grouped, redirect) => {
      const fullPath = `https://${redirect.domain}${redirect.src}`;
      const items = grouped[fullPath] || [];
<<<<<<< HEAD
=======

>>>>>>> main
      return {
        ...grouped,
        [fullPath]: items.concat(redirect.dest),
      };
    },
    {},
  );
<<<<<<< HEAD
=======

>>>>>>> main
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
<<<<<<< HEAD
=======

describe('validate batch redirects', () => {
  describe('exact matches', () => {
    describe('compensationBenefits', () => {
      const numbers = [
        '0100',
        '0101',
        '0102',
        '0103',
        '0104',
        '0105',
        '0106',
        '0107',
        '0108',
        '0109',
        '0111',
        '0112',
        '0113',
        '0114',
        '0116',
        '0199',
        '0200',
        '0201',
        '0202',
        '0203',
        '0204',
        '0205',
        '0206',
        '0207',
        '0208',
        '0209',
        '0211',
        '0212',
        '0213',
        '0214',
        '0216',
        '0299',
      ];

      numbers.forEach(number => {
        it(`should redirect`, () => {
          expectToRedirect(
            'www.benefits.va.gov',
            `/Compensation/resources_comp${number}.asp`,
            '/disability/compensation-rates/',
          );
        });
      });

      describe('case-insensitive matches', () => {
        it('should redirect', () => {
          expectToRedirect(
            'www.benefits.va.gov',
            '/COMPENSATION/resourCES_comp0100.asp',
            '/disability/compensation-rates/',
          );
        });
      });
    });

    describe('compensationBirthDefects', () => {
      const numbers = [
        '1999',
        '2000',
        '2001',
        '2002',
        '2003',
        '2004',
        '2005',
        '2006',
        '2007',
        '2008',
        '2009',
        '2011',
        '2012',
        '2013',
        '2014',
        '2016',
      ];

      numbers.forEach(number => {
        it(`should redirect`, () => {
          expectToRedirect(
            'www.benefits.va.gov',
            `/Compensation/sb${number}.asp`,
            '/disability/compensation-rates/',
          );
        });
      });

      describe('case-insensitive matches', () => {
        it('should redirect', () => {
          expectToRedirect(
            'www.benefits.va.gov',
            '/COMPENSation/SB2014.asp',
            '/disability/compensation-rates/',
          );
        });
      });
    });

    describe('compensationSpecialBenefits', () => {
      const numbers = [
        '1999',
        '2000',
        '2001',
        '2002',
        '2003',
        '2004',
        '2005',
        '2006',
        '2007',
        '2008',
        '2009',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
      ];

      numbers.forEach(number => {
        it(`should redirect`, () => {
          expectToRedirect(
            'www.benefits.va.gov',
            `/Compensation/special_Benefit_Allowances_${number}.asp`,
            '/disability/compensation-rates/',
          );
        });
      });

      describe('case-insensitive matches', () => {
        it('should redirect', () => {
          expectToRedirect(
            'www.benefits.va.gov',
            '/CompENSation/SPECIAL_Benefit_Allowances_2015.asp',
            '/disability/compensation-rates/',
          );
        });
      });
    });
  });

  describe('similar URLs, but not matches', () => {
    it('should not redirect', () => {
      expectNotToRedirect('www.benefits.va.gov', '/Compensation');
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/resources_comp.asp',
      );
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/resources_comp0215.asp',
      );
    });

    it('should not redirect', () => {
      expectNotToRedirect('www.benefits.va.gov', '/Compensation/sb0215.asp');
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/special_Benefit_Allowances_2023.asp',
      );
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/resources_comp0115.asp',
      );
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/resources_comp000215.asp',
      );
    });

    it('should not redirect', () => {
      expectNotToRedirect('www.benefits.va.gov', '/Compensation/sb2015.asp');
    });

    it('should not redirect', () => {
      expectNotToRedirect('www.benefits.va.gov', '/Compensation/sb201300.asp');
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/special_Benefit_Allowances_2016.asp',
      );
    });

    it('should not redirect', () => {
      expectNotToRedirect(
        'www.benefits.va.gov',
        '/Compensation/special_Benefit_Allowances_200003.asp',
      );
    });
  });
});
>>>>>>> main
