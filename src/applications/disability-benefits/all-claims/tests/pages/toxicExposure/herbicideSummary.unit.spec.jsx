import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import {
  goBackLink,
  herbicidePageTitle,
  noDatesEntered,
} from '../../../content/toxicExposure';
import { HERBICIDE_LOCATIONS } from '../../../constants';

describe('Herbicide Summary', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.herbicideSummary;

  it('renders when multiple locations with various date range situations', () => {
    const formData = {
      toxicExposure: {
        herbicide: {
          guam: true,
          laos: true,
          c123: true,
        },
        herbicideDetails: {
          c123: {
            endDate: '1966-02-20',
          },
          laos: {
            startDate: '1965-01-01',
          },
          guam: {},
          cambodia: {},
          koreandemilitarizedzone: {},
          johnston: {},
          thailand: {},
          vietnam: {},
        },
        'view:herbicideAdditionalInfo': {},
        otherHerbicideLocations: {
          description: 'Test location 1',
          startDate: '1968-01-01',
          endDate: '1969-01-01',
        },
      },
    };

    const { getByText, getByLabelText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(herbicidePageTitle);
    getByText('Summary');

    getByText(HERBICIDE_LOCATIONS.guam);
    getByText(noDatesEntered);

    getByText(HERBICIDE_LOCATIONS.laos);
    getByText('January 1965 - No end date entered');

    getByText(HERBICIDE_LOCATIONS.c123);
    getByText('No start date entered - February 1966');

    getByText('Test location 1');
    getByText('January 1968 - January 1969');

    getByText(goBackLink);
    getByLabelText(
      'go back and edit locations and dates for Agent Orange locations',
    );
  });

  it('does not render a location if not checked', () => {
    const formData = {
      toxicExposure: {
        herbicide: {
          cambodia: false,
          guam: true,
          c123: false,
        },
        herbicideDetails: {
          c123: {
            startDate: '1967-07-01',
            endDate: '1967-12-01',
          },
          guam: {
            startDate: '1965-01-01',
            endDate: '1966-06-01',
          },
          cambodia: {},
          koreandemilitarizedzone: {},
          johnston: {},
          laos: {},
          thailand: {},
          vietnam: {},
        },
        otherHerbicideLocations: {
          startDate: '1968-01-01',
          endDate: '1969-01-01',
          description: 'Test location 1',
        },
        'view:herbicideAdditionalInfo': {},
      },
    };

    const { getByText, queryByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    expect(queryByText(HERBICIDE_LOCATIONS.cambodia)).to.not.exist;

    expect(queryByText(HERBICIDE_LOCATIONS.c123)).to.not.exist;
    expect(queryByText('July 1967 - December 1967')).to.not.exist;

    getByText(HERBICIDE_LOCATIONS.guam);
    getByText('January 1965 - June 1966');
  });
});
