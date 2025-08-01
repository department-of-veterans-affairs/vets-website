import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, subYears, addYears } from 'date-fns';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../../config/form';
import {
  additionalExposuresPageTitle,
  dateRangeDescriptionWithHazard,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  notSureHazardDetails,
} from '../../../content/toxicExposure';
import { pageSubmitTest } from '../../unit.helpers.spec';

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

describe('Specify Other Exposures', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.specifyOtherExposures;

  it('should render', () => {
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

    expect($(`va-checkbox[label="${notSureHazardDetails}"]`, container)).to
      .exist;

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute(
      'trigger',
      'What if I have more than one date range?',
    );
  });

  it('should submit without dates', () => {
    const dataNoDates = JSON.parse(JSON.stringify(formData));
    dataNoDates.toxicExposure.specifyOtherExposures.startDate = undefined;
    dataNoDates.toxicExposure.specifyOtherExposures.endDate = undefined;

    pageSubmitTest(
      formConfig.chapters.disabilities.pages.specifyOtherExposures,
      dataNoDates,
      true,
    );
  });

  it('should submit with both dates', () => {
    pageSubmitTest(
      formConfig.chapters.disabilities.pages.specifyOtherExposures,
      formData,
      true,
    );
  });

  describe('date validation', () => {
    it('should accept current date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        new Date(),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should accept past date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should reject future date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        addYears(new Date(), 1),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should reject date before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1899-12-31';
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should reject invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = 'invalid-date';
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should accept current date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        new Date(),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should accept past date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should reject future date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        addYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should reject date before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = '1899-12-31';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should reject invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = 'invalid-date';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should accept valid date range (to after from)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM-dd',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should reject non-leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '2021-02-29';
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should accept leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '2020-02-29';
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM-dd',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });
  });
});
