import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, subYears, addYears } from 'date-fns';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/additionalExposuresDetails';
import { ADDITIONAL_EXPOSURES } from '../../../constants';
import {
  additionalExposuresPageTitle,
  dateRangeDescriptionWithHazard,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  notSureHazardDetails,
} from '../../../content/toxicExposure';
import { pageSubmitTest } from '../../unit.helpers.spec';

/**
 * Unit tests for the additional exposures details pages. Verifies each page can render and submit with
 * valid dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the exposure was selected.
 */
describe('additional exposures details', () => {
  const schemas = { ...makePages() };
  const formData = {
    toxicExposure: {
      otherExposures: {
        asbestos: true,
        mos: true,
      },
    },
  };

  Object.keys(ADDITIONAL_EXPOSURES)
    .filter(itemId => itemId !== 'none' && itemId !== 'notsure')
    .forEach(itemId => {
      const pageSchema = schemas[`additional-exposure-${itemId}`];
      it(`should render for ${itemId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
          />,
        );

        getByText(additionalExposuresPageTitle);
        getByText(dateRangeDescriptionWithHazard);

        expect(
          $(
            `va-memorable-date[label="${exposureStartDateApproximate}"]`,
            container,
          ),
        ).to.exist;
        expect(
          $(
            `va-memorable-date[label="${exposureEndDateApproximate}"]`,
            container,
          ),
        ).to.exist;

        expect($(`va-checkbox[label="${notSureHazardDetails}"]`, container)).to
          .exist;

        const addlInfo = container.querySelector('va-additional-info');
        expect(addlInfo).to.have.attribute(
          'trigger',
          'What if I have more than one date range?',
        );

        // subtitle checks
        if (itemId === 'asbestos') {
          getByText(`Hazard 1 of 2: ${ADDITIONAL_EXPOSURES.asbestos}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Hazard 1 of 2: ${ADDITIONAL_EXPOSURES.asbestos}`,
          );
        } else if (itemId === 'mos') {
          getByText(`Hazard 2 of 2: ${ADDITIONAL_EXPOSURES.mos}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Hazard 2 of 2: ${ADDITIONAL_EXPOSURES.mos}`,
          );
        } else {
          getByText(ADDITIONAL_EXPOSURES[itemId]);
          expect(pageSchema.title(formData)).to.equal(
            `${ADDITIONAL_EXPOSURES[itemId]}`,
          );
        }
      });

      /*
       * TODO: We currently validate against partial dates on the frontend.
       * Future consideration: allow Veterans to submit with completely blank or partial dates.
       * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
       */
      it(`should not submit without dates for ${itemId}`, () => {
        pageSubmitTest(
          schemas[`additional-exposure-${itemId}`],
          formData,
          false,
        );
      });

      it(`should submit with both dates for ${itemId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.otherExposuresDetails = {};
        data.toxicExposure.otherExposuresDetails[itemId] = {
          startDate: '2020-05-19',
          endDate: '2021-11-30',
        };

        pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
      });
    });

  /*
   * Edge case validations for toxic exposure dates.
   * TODO: We currently validate against partial dates on the frontend.
   * Future consideration: allow Veterans to submit with completely blank or partial dates.
   * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
   */
  describe('date validations', () => {
    const itemId = 'asbestos'; // Using asbestos as the test case

    it('should not submit with incomplete start date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-XX-15',
          endDate: '2021-06-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with incomplete start date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-05-XX',
          endDate: '2021-06-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: 'XXXX-05-15',
          endDate: '2021-06-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with incomplete end date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-05-15',
          endDate: '2021-XX-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with incomplete end date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-05-15',
          endDate: '2021-06-XX',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-05-15',
          endDate: 'XXXX-06-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should accept valid date range (to after from)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2021-05-15',
          endDate: '2020-06-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with only start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-05-15',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit with only end date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          endDate: '2021-06-30',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should accept past date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
    });

    it('should not submit when future date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit when date before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '1899-12-31',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit when invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: 'invalid-date',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should accept current date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
    });

    it('should accept past date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
    });

    it('should not submit when future date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit when date before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: '1899-12-31',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit when invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit when start and end dates are equal', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-05-19',
          endDate: '2020-05-19',
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should not submit when non-leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2021-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, false);
    });

    it('should accept leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.otherExposuresDetails = {
        [itemId]: {
          startDate: '2020-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`additional-exposure-${itemId}`], data, true);
    });
  });
});
