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

    expect($(`va-date[label="${startDateApproximate}"]`, container)).to.exist;
    expect($(`va-date[label="${endDateApproximate}"]`, container)).to.exist;

    expect($(`va-checkbox[label="${notSureDatesDetails}"]`, container)).to
      .exist;

    const addlInfo = container.querySelector('va-additional-info');
    expect(addlInfo).to.have.attribute(
      'trigger',
      'What if I have more than one date range?',
    );
  });

  describe('reviewTitle (confirmation accordion heading)', () => {
    it('returns only the user-entered description', () => {
      const {
        reviewTitle,
      } = formConfig.chapters.disabilities.pages.herbicideOtherLocations;
      expect(reviewTitle({ formData })).to.equal('Test Location 1');
    });
  });

  it('should submit without dates (dates are optional)', () => {
    pageSubmitTest(
      formConfig.chapters.disabilities.pages.herbicideOtherLocations,
      formData,
      true,
    );
  });

  it('should submit with both dates', () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.otherHerbicideLocations.startDate = '2021-12';
    data.toxicExposure.otherHerbicideLocations.endDate = '2023-01';

    pageSubmitTest(
      formConfig.chapters.disabilities.pages.herbicideOtherLocations,
      data,
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
      data.toxicExposure.otherHerbicideLocations.startDate = 'XXXX-05';
      data.toxicExposure.otherHerbicideLocations.endDate = '1976-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1975-04';
      data.toxicExposure.otherHerbicideLocations.endDate = 'XXXX-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1976-04';
      data.toxicExposure.otherHerbicideLocations.endDate = '1975-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should submit with only start date (dates are optional)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1975-04';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should submit with only end date (dates are optional)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.endDate = '1976-06';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should submit with current month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        new Date(),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should accept past month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should reject future month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        addYears(new Date(), 1),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should reject year before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1899-12';
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
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
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should accept current month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        new Date(),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should accept past month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 5),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should reject future month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        addYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should reject year before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = '1899-12';

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
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = 'invalid-date';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        false,
      );
    });

    it('should accept valid date range (end after start)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = format(
        subYears(new Date(), 2),
        'yyyy-MM',
      );
      data.toxicExposure.otherHerbicideLocations.endDate = format(
        subYears(new Date(), 1),
        'yyyy-MM',
      );

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should submit with both dates and not sure', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1975-04';
      data.toxicExposure.otherHerbicideLocations.endDate = '1976-06';
      data.toxicExposure.otherHerbicideLocations['view:notSure'] = true;

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should accept year-only format (YYYY-XX)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '1975-XX';
      data.toxicExposure.otherHerbicideLocations.endDate = '1976-XX';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });

    it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherHerbicideLocations.startDate = '2021-12-22';
      data.toxicExposure.otherHerbicideLocations.endDate = '2023-01-09';

      pageSubmitTest(
        formConfig.chapters.disabilities.pages.herbicideOtherLocations,
        data,
        true,
      );
    });
  });
});
