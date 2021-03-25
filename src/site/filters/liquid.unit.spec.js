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

describe('deriveCLPTotalSections', () => {
  it('returns back max sections when everything is rendered', () => {
    expect(
      liquid.filters.deriveCLPTotalSections(
        11,
        true,
        true,
        true,
        true,
        true,
        true,
        ['category'],
      ),
    ).to.eq(11);
  });

  it('returns back the correct section count when sections are not rendered', () => {
    expect(
      liquid.filters.deriveCLPTotalSections(
        11,
        false,
        false,
        false,
        false,
        false,
        false,
        [],
      ),
    ).to.eq(4);
  });
});

describe('formatSeconds', () => {
  it('returns hours when needed', () => {
    expect(liquid.filters.formatSeconds(65245)).to.eq('18:7:25 hours');
  });

  it('returns minutes when needed', () => {
    expect(liquid.filters.formatSeconds(160)).to.eq('2:40 minutes');
  });

  it('returns seconds when needed', () => {
    expect(liquid.filters.formatSeconds(23)).to.eq('23 seconds');
  });
});

describe('createEmbedYouTubeVideoURL', () => {
  it('returns back the raw url if the youtube link should not be changed', () => {
    expect(liquid.filters.createEmbedYouTubeVideoURL('')).to.eq('');
    expect(liquid.filters.createEmbedYouTubeVideoURL('asdf')).to.eq('asdf');
    expect(
      liquid.filters.createEmbedYouTubeVideoURL('youtube.com/embed/asdf'),
    ).to.eq('youtube.com/embed/asdf');
  });

  it('returns the modified URL if it needs it', () => {
    expect(
      liquid.filters.createEmbedYouTubeVideoURL('https://youtu.be/asdf'),
    ).to.eq('https://youtube.com/embed/asdf');
    expect(
      liquid.filters.createEmbedYouTubeVideoURL('https://www.youtu.be/asdf'),
    ).to.eq('https://www.youtube.com/embed/asdf');
  });
});

describe('getTagsList', () => {
  const fieldTags = {
    entity: {
      fieldTopics: [
        {
          entity: {
            name: 'A. Example',
          },
        },
        {
          entity: {
            name: 'B. Example',
          },
        },
        {
          entity: {
            name: 'E. Example',
          },
        },
      ],
      fieldAudienceBeneficiares: {
        entity: {
          name: 'C. Example',
        },
      },
      fieldNonBeneficiares: {
        entity: {
          name: 'D. Example',
        },
      },
    },
  };

  it('forms a sorted list from properties "fieldTopics", "fieldAudienceBeneficiares", and "fieldNonBeneficiares"', () => {
    const result = liquid.filters.getTagsList(fieldTags);

    expect(result).to.be.deep.equal([
      {
        name: 'A. Example',
        categoryLabel: 'Topics',
      },
      {
        name: 'B. Example',
        categoryLabel: 'Topics',
      },
      {
        name: 'C. Example',
        categoryLabel: 'Audience',
      },
      {
        name: 'D. Example',
        categoryLabel: 'Audience',
      },
      {
        name: 'E. Example',
        categoryLabel: 'Topics',
      },
    ]);
  });

  it('omits null poperties', () => {
    const fieldTags2 = { entity: { ...fieldTags.entity } };
    fieldTags2.entity.fieldAudienceBeneficiares = null;

    const result = liquid.filters.getTagsList(fieldTags2);

    expect(result).to.be.deep.equal([
      {
        name: 'A. Example',
        categoryLabel: 'Topics',
      },
      {
        name: 'B. Example',
        categoryLabel: 'Topics',
      },
      {
        name: 'D. Example',
        categoryLabel: 'Audience',
      },
      {
        name: 'E. Example',
        categoryLabel: 'Topics',
      },
    ]);
  });
});

describe('replace', () => {
  it('replaces text with other text', () => {
    expect(liquid.filters.replace('<h3>some text</h3>', 'h3', 'h4')).to.equal(
      '<h4>some text</h4>',
    );
  });
});
