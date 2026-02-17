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
      startDate: '2000-05',
      endDate: '2001-03',
    },
  },
};

describe('Specify Other Exposures', () => {
  const { schema, uiSchema } =
    formConfig.chapters.disabilities.pages.specifyOtherExposures;

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

    expect($(`va-date[label="${exposureStartDateApproximate}"]`, container)).to
      .exist;
    expect($(`va-date[label="${exposureEndDateApproximate}"]`, container)).to
      .exist;

    expect($(`va-checkbox[label="${notSureHazardDetails}"]`, container)).to
      .exist;

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute(
      'trigger',
      'What if I have more than one date range?',
    );
  });

  describe('reviewTitle', () => {
    it('returns only the user-entered description when on confirmation', () => {
      const { reviewTitle } =
        formConfig.chapters.disabilities.pages.specifyOtherExposures;
      expect(reviewTitle({ formData, onReviewPage: false })).to.equal(
        'Test Substance',
      );
    });

    it('returns full "Hazard # of #: description" when on review page', () => {
      const { reviewTitle } =
        formConfig.chapters.disabilities.pages.specifyOtherExposures;
      expect(reviewTitle({ formData })).to.equal(
        'Hazard 3 of 3: Test Substance',
      );
    });
  });

  it('should submit without dates (dates are optional)', () => {
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

  /*
   * Edge case validations for toxic exposure dates (month/year format).
   * Supports year-only (YYYY-XX) or month/year (YYYY-MM).
   * Full dates (YYYY-MM-DD) are accepted for backward compatibility.
   */
  describe('date validation', () => {
    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = 'XXXX-05';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with month-only start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      // Component should format this as XXXX-05, but test the validation
      data.toxicExposure.specifyOtherExposures.startDate = 'XXXX-05';
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04';
      data.toxicExposure.specifyOtherExposures.endDate = 'XXXX-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1976-04';
      data.toxicExposure.specifyOtherExposures.endDate = '1975-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should submit with only start date (dates are optional)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1975-04';
      data.toxicExposure.specifyOtherExposures.endDate = undefined;

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should submit with only end date (dates are optional)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = undefined;
      data.toxicExposure.specifyOtherExposures.endDate = '1976-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should submit with current month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        new Date(),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should accept past month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should reject future month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        addYears(new Date(), 1),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should reject year before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '1899-12';
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
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
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should accept current month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        new Date(),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should accept past month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should reject future month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        addYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should reject year before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = '1899-12';

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
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = 'invalid-date';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        false,
      );
    });

    it('should accept valid date range (end after start)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.specifyOtherExposures.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should accept year-only format (YYYY-XX)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '2000-XX';
      data.toxicExposure.specifyOtherExposures.endDate = '2001-XX';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });

    it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.specifyOtherExposures.startDate = '2000-05-15';
      data.toxicExposure.specifyOtherExposures.endDate = '2001-03-01';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.specifyOtherExposures,
        data,
        true,
      );
    });
  });
});
