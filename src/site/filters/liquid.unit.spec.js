import liquid from 'tinyliquid';
import { expect } from 'chai';

import registerFilters from './liquid';

registerFilters();

describe('isLaterThan', () => {
  it('returns true when the left arg is a timestamp later than the right arg', () => {
    expect(liquid.filters.isLaterThan('2020-01-11', '2016-07-10')).to.be.true;
  });

  it('returns false when the left arg is a timestamp before the right arg', () => {
    expect(liquid.filters.isLaterThan('2016-12-11', '2017-01-12')).to.be.false;
  });
});

describe('timezoneAbbrev', () => {
  it('returns PDT for Los Angeles', () => {
    expect(
      liquid.filters.timezoneAbbrev('America/Los_Angeles', 1604091600000),
    ).to.eq('PDT');
  });

  it('returns ET for null', () => {
    expect(liquid.filters.timezoneAbbrev()).to.eq('ET');
  });
});

describe('dateFromUnix', () => {
  context('with default time zone', () => {
    it('returns null for null', () => {
      expect(liquid.filters.dateFromUnix()).to.be.null;
    });

    it('returns date with specified format', () => {
      expect(liquid.filters.dateFromUnix(1604091600, 'dddd, MMM D YYYY')).to.eq(
        'Friday, Oct. 30 2020',
      );
    });

    it('returns time with specified format', () => {
      expect(liquid.filters.dateFromUnix(1607958000, 'h:mm A')).to.eq(
        '10:00 a.m.',
      );
    });
  });

  context('with specific time zone', () => {
    it('returns time with specified format', () => {
      expect(
        liquid.filters.dateFromUnix(1607958000, 'h:mm A', 'America/Phoenix'),
      ).to.eq('8:00 a.m.');
    });

    it('uses default if invalid timezone datatype passed', () => {
      expect(liquid.filters.dateFromUnix(1607958000, 'h:mm A', {})).to.eq(
        '10:00 a.m.',
      );
    });

    it('uses default if invalid timezone passed', () => {
      expect(
        liquid.filters.dateFromUnix(1607958000, 'h:mm A', 'Not/A_Zone'),
      ).to.eq('10:00 a.m.');
    });
  });

  describe('currentTimeInSeconds', () => {
    it('returns time in seconds', () => {
      expect(String(liquid.filters.currentTimeInSeconds()).length < 13).to.be
        .true;
    });
  });
});

describe('deriveLastBreadcrumbFromPath', () => {
  it('returns a modified list of breadcrumbs with title at last', () => {
    const origBreadCrumbsList1 = [
      { url: 'http://va.gov', text: 'Home' },
      { url: 'http://va.gov', text: 'Outreach and-events' },
      { url: 'http://va.gov', text: 'Events' },
      {
        url: 'http://va.gov',
        text: 'Pave connect-employer-session-windstream-communications',
      },
    ];
    const origBreadCrumbsList2 = [
      { url: 'http://va.gov', text: 'Events' },
      {
        url: 'http://va.gov',
        text: 'Pave connect-employer-session-windstream-communications',
      },
    ];
    const origBreadCrumbsList3 = [
      { url: 'http://va.gov', text: 'Home' },
      { url: 'http://va.gov', text: 'Outreach and-events' },
      { url: 'http://va.gov', text: 'Events' },
      { url: 'http://va.gov', text: 'Test' },
      { url: 'http://va.gov', text: 'Testing page' },
      { url: 'http://va.gov', text: 'Page testing' },
      { url: 'http://va.gov', text: 'Page testing2' },
      {
        url: 'http://va.gov',
        text: 'Pave connect-employer-session-windstream-communications',
      },
    ];
    const title = 'PAVE Connect Employer Session: Windstream Communications';
    const last1 = liquid.filters
      .deriveLastBreadcrumbFromPath(
        origBreadCrumbsList1,
        title,
        'http://va.gov',
        true,
      )
      .pop();
    const last2 = liquid.filters
      .deriveLastBreadcrumbFromPath(
        origBreadCrumbsList2,
        title,
        'http://va.gov',
        true,
      )
      .pop();
    const last3 = liquid.filters
      .deriveLastBreadcrumbFromPath(
        origBreadCrumbsList3,
        title,
        'http://va.gov',
        true,
      )
      .pop();

    expect(last1.text).to.eq(title);
    expect(last2.text).to.eq(title);
    expect(last3.text).to.eq(title);
  });

  it('returns breadcrumbs list with title as the last', () => {
    const origBreadCrumbsList = [
      { url: 'http://va.gov', text: 'Home' },
      { url: 'http://va.gov', text: 'VA Pittsburgh health care' },
      { url: 'http://va.gov', text: 'Stories' },
    ];
    const title = 'New Program Empowers Community Providers';
    const last = liquid.filters
      .deriveLastBreadcrumbFromPath(
        origBreadCrumbsList,
        title,
        'http://va.gov',
        false,
      )
      .pop();

    expect(last.text).to.eq(title);
  });
});
