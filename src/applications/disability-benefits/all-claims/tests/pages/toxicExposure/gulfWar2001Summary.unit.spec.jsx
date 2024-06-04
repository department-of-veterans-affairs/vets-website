import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import {
  goBackLink,
  gulfWar2001PageTitle,
  noDatesEntered,
  notSureDatesSummary,
} from '../../../content/toxicExposure';
import { GULF_WAR_2001_LOCATIONS } from '../../../constants';

describe('Gulf War 2001 Summary', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.gulfWar2001Summary;

  it('renders when multiple locations with various date range situations', () => {
    const formData = {
      toxicExposure: {
        gulfWar2001: {
          djibouti: true,
          lebanon: true,
          yemen: true,
          airspace: true,
        },
        gulfWar2001Details: {
          djibouti: {},
          lebanon: {
            startDate: '2002-01-01',
            endDate: '2004-01-01',
          },
          yemen: {
            endDate: '2004-12-01',
          },
          airspace: {
            startDate: '2005-10-01',
          },
        },
      },
    };

    const { getByText, getByLabelText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(gulfWar2001PageTitle);
    getByText('Summary');
    getByText(GULF_WAR_2001_LOCATIONS.djibouti);
    getByText(noDatesEntered);

    getByText(GULF_WAR_2001_LOCATIONS.lebanon);
    getByText('January 2002 - January 2004');

    getByText(GULF_WAR_2001_LOCATIONS.yemen);
    getByText('No start date entered - December 2004');

    getByText(GULF_WAR_2001_LOCATIONS.airspace);
    getByText('October 2005 - No end date entered');

    getByText(goBackLink);
    getByLabelText(
      'go back and edit locations and dates for service post-9/11',
    );
  });

  it('does not render a location if not checked', () => {
    const formData = {
      toxicExposure: {
        gulfWar2001: {
          yemen: true,
          airspace: false,
        },
        gulfWar2001Details: {
          yemen: {
            startDate: '2002-01-01',
            endDate: '2003-01-01',
          },
          airspace: {
            startDate: '2004-10-01',
          },
        },
      },
    };

    const { queryByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    expect(queryByText(GULF_WAR_2001_LOCATIONS.yemen)).to.exist;
    expect(queryByText('January 2002 - January 2003')).to.exist;

    expect(queryByText(GULF_WAR_2001_LOCATIONS.airspace)).to.not.exist;
    expect(queryByText('October 2004 - No end date entered')).to.not.exist;
  });

  it('renders `notSureDatesSummary` when `view:notSure` was selected', () => {
    const formData = {
      toxicExposure: {
        gulfWar2001: {
          yemen: true,
          airspace: true,
        },
        gulfWar2001Details: {
          yemen: {},
          airspace: {
            'view:notSure': true,
          },
        },
      },
    };

    const { getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(gulfWar2001PageTitle);
    getByText('Summary');
    getByText(GULF_WAR_2001_LOCATIONS.yemen);
    getByText(noDatesEntered);
    getByText(GULF_WAR_2001_LOCATIONS.airspace);
    getByText(notSureDatesSummary);
  });
});
