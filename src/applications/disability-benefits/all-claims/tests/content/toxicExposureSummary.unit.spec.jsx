import { render } from '@testing-library/react';
import { expect } from 'chai';
import { toxicExposureSummary } from '../../content/toxicExposureSummary';
import { GULF_WAR_1990_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { goBackLink, noDatesEntered } from '../../content/toxicExposure';

describe('toxicExposureSummary', () => {
  it('renders when a location has no dates', () => {
    const formData = {
      toxicExposure: {
        gulfWar1990: {
          afghanistan: true,
        },
        gulfWar1990Details: {},
      },
    };

    const tree = render(
      toxicExposureSummary(
        { formData },
        'gulfWar1990',
        GULF_WAR_1990_LOCATIONS,
        'gulfWar1990Details',
        'go back and edit locations and dates for service after August 2, 1990',
        `${TE_URL_PREFIX}/gulf-war-hazard-1990`,
      ),
    );

    tree.getByText('Summary');

    tree.getByText(GULF_WAR_1990_LOCATIONS.afghanistan);
    tree.getByText(noDatesEntered);

    tree.getByText(goBackLink);
    tree.getByLabelText(
      'go back and edit locations and dates for service after August 2, 1990',
    );
  });

  it('renders when a location has both dates', () => {
    const formData = {
      toxicExposure: {
        gulfWar1990: {
          waters: true,
        },
        gulfWar1990Details: {
          waters: {
            startDate: '2000-01-01',
            endDate: '2004-01-01',
          },
        },
      },
    };

    const tree = render(
      toxicExposureSummary(
        { formData },
        'gulfWar1990',
        GULF_WAR_1990_LOCATIONS,
        'gulfWar1990Details',
        'go back and edit locations and dates for service after August 2, 1990',
        `${TE_URL_PREFIX}/gulf-war-hazard-1990`,
      ),
    );

    tree.getByText('Summary');
    tree.getByText(GULF_WAR_1990_LOCATIONS.waters);
    tree.getByText('January 2000 - January 2004');
  });

  it('renders when multiple locations with various date range situations', () => {
    const formData = {
      toxicExposure: {
        gulfWar1990: {
          afghanistan: true,
          airspace: true,
          qatar: true,
          waters: true,
        },
        gulfWar1990Details: {
          airspace: {
            startDate: '2023-10-01',
          },
          afghanistan: {},
          qatar: {
            endDate: '2023-09-05',
          },
          waters: {
            startDate: '2000-01-01',
            endDate: '2004-01-01',
          },
        },
      },
    };

    const tree = render(
      toxicExposureSummary(
        { formData },
        'gulfWar1990',
        GULF_WAR_1990_LOCATIONS,
        'gulfWar1990Details',
        'go back and edit locations and dates for service after August 2, 1990',
        `${TE_URL_PREFIX}/gulf-war-hazard-1990`,
      ),
    );

    tree.getByText('Summary');
    tree.getByText(GULF_WAR_1990_LOCATIONS.afghanistan);
    tree.getByText(noDatesEntered);

    tree.getByText(GULF_WAR_1990_LOCATIONS.qatar);
    tree.getByText('No start date entered - September 2023');

    tree.getByText(GULF_WAR_1990_LOCATIONS.waters);
    tree.getByText('January 2000 - January 2004');

    tree.getByText(GULF_WAR_1990_LOCATIONS.airspace);
    tree.getByText('October 2023 - No end date entered');
  });

  it('does not render a location if not checked', () => {
    const formData = {
      toxicExposure: {
        gulfWar1990: {
          airspace: false,
          waters: true,
        },
        gulfWar1990Details: {
          airspace: {
            startDate: '2023-10-01',
          },
          waters: {
            startDate: '2000-01-01',
            endDate: '2004-01-01',
          },
        },
      },
    };

    const { queryByText } = render(
      toxicExposureSummary(
        { formData },
        'gulfWar1990',
        GULF_WAR_1990_LOCATIONS,
        'gulfWar1990Details',
        'go back and edit locations and dates for service after August 2, 1990',
        `${TE_URL_PREFIX}/gulf-war-hazard-1990`,
      ),
    );

    expect(queryByText(GULF_WAR_1990_LOCATIONS.waters)).to.exist;
    expect(queryByText('January 2000 - January 2004')).to.exist;

    expect(queryByText(GULF_WAR_1990_LOCATIONS.airspace)).to.not.exist;
    expect(queryByText('October 2023 - No end date entered')).to.not.exist;
  });
});
