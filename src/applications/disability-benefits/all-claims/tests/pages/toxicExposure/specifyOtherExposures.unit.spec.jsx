import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../../config/form';
import {
  additionalExposuresPageTitle,
  dateRangeDescriptionWithHazard,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
} from '../../../content/toxicExposure';

describe('Specify Other Exposures', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.specifyOtherExposures;

  it('should render', () => {
    const formData = {
      toxicExposure: {
        otherExposures: {
          asbestos: true,
          mos: true,
          notsure: true,
        },
        otherExposuresDetails: {
          asbestos: {
            startDate: '1995-02-01',
            endDate: '1997-03-05',
          },
          chemical: {},
          water: {},
          mos: {},
          mustardgas: {},
          radiation: {},
        },
        specifyOtherExposures: {
          description: 'Test Substance',
          startDate: '2000-05-20',
          endDate: '2001-03-01',
        },
      },
    };

    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(additionalExposuresPageTitle);
    getByText(dateRangeDescriptionWithHazard);
    getByText(`Hazard 3 of 3: Test Substance`, {
      exact: false,
    });
    expect(
      formConfig.chapters.disabilities.pages.specifyOtherExposures.title(
        formData,
      ),
    ).to.equal(`Hazard 3 of 3: Test Substance`);

    expect(
      $(
        `va-memorable-date[label="${exposureStartDateApproximate}"]`,
        container,
      ),
    ).to.exist;
    expect(
      $(`va-memorable-date[label="${exposureEndDateApproximate}"]`, container),
    ).to.exist;

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute(
      'trigger',
      'What if I have more than one date range?',
    );
  });
});
