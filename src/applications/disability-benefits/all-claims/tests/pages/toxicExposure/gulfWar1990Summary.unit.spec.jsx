import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import {
  goBackLink,
  gulfWar1990PageTitle,
  noDatesEntered,
  notSureDatesSummary,
} from '../../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS } from '../../../constants';

describe('Gulf War 1990 Summary', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.gulfWar1990Summary;

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

    const { getByText, getByLabelText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(gulfWar1990PageTitle);
    getByText('Summary');
    getByText(GULF_WAR_1990_LOCATIONS.afghanistan);
    getByText(noDatesEntered);

    getByText(GULF_WAR_1990_LOCATIONS.qatar);
    getByText('No start date entered - September 2023');

    getByText(GULF_WAR_1990_LOCATIONS.waters);
    getByText('January 2000 - January 2004');

    getByText(GULF_WAR_1990_LOCATIONS.airspace);
    getByText('October 2023 - No end date entered');

    getByText(goBackLink);
    getByLabelText(
      'go back and edit locations and dates for service after August 2, 1990',
    );
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
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    expect(queryByText(GULF_WAR_1990_LOCATIONS.waters)).to.exist;
    expect(queryByText('January 2000 - January 2004')).to.exist;

    expect(queryByText(GULF_WAR_1990_LOCATIONS.airspace)).to.not.exist;
    expect(queryByText('October 2023 - No end date entered')).to.not.exist;
  });

  it('renders `notSureDatesSummary` when `view:notSure` was selected', () => {
    const formData = {
      toxicExposure: {
        gulfWar1990: {
          airspace: true,
          waters: true,
        },
        gulfWar1990Details: {
          airspace: {},
          waters: {
            'view:notSure': true,
          },
        },
      },
    };

    const { getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(gulfWar1990PageTitle);
    getByText('Summary');
    getByText(GULF_WAR_1990_LOCATIONS.airspace);
    getByText(noDatesEntered);
    getByText(GULF_WAR_1990_LOCATIONS.waters);
    getByText(notSureDatesSummary);
  });
});
