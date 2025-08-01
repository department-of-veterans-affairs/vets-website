import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, subYears, addYears } from 'date-fns';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../../config/form';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  herbicidePageTitle,
  notSureDatesDetails,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { pageSubmitTest } from '../../unit.helpers.spec';

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

describe('Herbicide Other Locations', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.herbicideOtherLocations;

  it('should render', () => {
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

    expect($(`va-checkbox[label="${notSureDatesDetails}"]`, container)).to
      .exist;

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute(
      'trigger',
      'What if I have more than one date range?',
    );
  });

  it('should submit without dates', () => {
    pageSubmitTest(
      formConfig.chapters.disabilities.pages.herbicideOtherLocations,
      formData,
      true,
    );
  });

  it('should submit with both dates', () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.otherHerbicideLocations.startDate = '2021-12-22';
    data.toxicExposure.otherHerbicideLocations.endDate = '2023-01-09';

    pageSubmitTest(
      formConfig.chapters.disabilities.pages.herbicideOtherLocations,
      data,
      true,
    );
  });

  describe('date validation', () => {
    it('should accept past date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should reject future date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        addYears(new Date(), 1),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should reject date before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1899-12-31';
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should reject invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = 'invalid-date';
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should accept current date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        new Date(),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should accept past date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should reject future date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        addYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should reject date before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = '1899-12-31';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should reject invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = 'invalid-date';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should accept valid date range (to after from)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should reject non-leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '2021-02-29';
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should accept leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '2020-02-29';
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });
  });
});
