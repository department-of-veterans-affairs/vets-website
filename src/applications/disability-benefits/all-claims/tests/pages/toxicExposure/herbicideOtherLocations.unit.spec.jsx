import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../../config/form';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  herbicidePageTitle,
  startDateApproximate,
} from '../../../content/toxicExposure';

describe('Herbicide Other Locations', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.herbicideOtherLocations;

  it('should render', () => {
    const formData = {
      toxicExposure: {
        herbicide: {
          cambodia: true,
          koreandemilitarizedzone: false,
          laos: true,
        },
        otherHerbicideLocations: {
          description: 'Test Location 1',
        },
      },
    };

    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(herbicidePageTitle);
    getByText(`Location 3 of 3: Test location 1`, {
      exact: false,
    });
    expect(
      formConfig.chapters.disabilities.pages.herbicideOtherLocations.title(
        formData,
      ),
    ).to.equal(`Location 3 of 3: Test Location 1`);
    getByText(dateRangeDescriptionWithLocation);

    expect($(`va-memorable-date[label="${startDateApproximate}"]`, container))
      .to.exist;
    expect($(`va-memorable-date[label="${endDateApproximate}"]`, container)).to
      .exist;

    getByText('I’m not sure of the dates I served in this location');

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute(
      'trigger',
      'What if I have more than one date range?',
    );
  });
});
