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

  /*
  * TODO: We currently validate against partial dates on the frontend.
  * Future consideration: allow Veterans to submit with completely blank or partial dates.
  * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/120119#issuecomment-3482733324
  */
  it('should not submit without dates', () => {
    const dataNoDates = JSON.parse(JSON.stringify(formData));
    dataNoDates.toxicExposure.specifyOtherExposures.startDate = undefined;
    dataNoDates.toxicExposure.specifyOtherExposures.endDate = undefined;

    pageSubmitTest(
      formConfig.chapters.disabilities.pages.specifyOtherExposures,
      dataNoDates,
      false,
    );
  });

  it('should submit with both dates', () => {
    pageSubmitTest(
      formConfig.chapters.disabilities.pages.specifyOtherExposures,
      formData,
      true,
    );
  });

  /*
   * Edge case validations for toxic exposure dates.
   * TODO: We currently validate against partial dates on the frontend.
   * Future consideration: allow Veterans to submit with completely blank or partial dates.
   * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/120119#issuecomment-3482733324
   */
  describe('date validation', () => {
    it('should not submit with incomplete start date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-XX-15';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04-XX';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = 'XXXX-04-15';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04-15';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-XX-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04-15';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06-XX';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04-15';
      data.toxicExposure.specifyOtherExposures.endDate = 'XXXX-06-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1976-04-15';
      data.toxicExposure.specifyOtherExposures.endDate = '1975-06-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with only start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04-15';
      data.toxicExposure.specifyOtherExposures.endDate = undefined;

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with only end date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = undefined;
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06-30';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should submit with current date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 1),
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

    it('should not submit with equal start and end dates', () => {
      const data = JSON.parse(JSON.stringify(formData));
      const sameDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      data.toxicExposure.specifyOtherExposures.startDate = sameDate;
      data.toxicExposure.specifyOtherExposures.endDate = sameDate;

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
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
