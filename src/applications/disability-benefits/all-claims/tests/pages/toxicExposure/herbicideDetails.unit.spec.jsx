import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, subYears, addYears } from 'date-fns';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/herbicideDetails';
import { HERBICIDE_LOCATIONS } from '../../../constants';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  herbicidePageTitle,
  notSureDatesDetails,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { pageSubmitTest } from '../../unit.helpers.spec';

/**
 * Unit tests for the herbicide details pages. Verifies each page can render and submit with
 * valid dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the location was selected.
 */
describe('herbicideDetails', () => {
  const schemas = { ...makePages() };
  const formData = {
    toxicExposure: {
      herbicide: {
        cambodia: true,
        koreandemilitarizedzone: false,
        laos: true,
      },
    },
  };

  Object.keys(HERBICIDE_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .forEach(locationId => {
      const pageSchema = schemas[`herbicide-location-${locationId}`];
      it(`should render for ${locationId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
          />,
        );

        getByText(herbicidePageTitle);
        getByText(dateRangeDescriptionWithLocation);

        expect(
          $(`va-memorable-date[label="${startDateApproximate}"]`, container),
        ).to.exist;
        expect($(`va-memorable-date[label="${endDateApproximate}"]`, container))
          .to.exist;

        expect($(`va-checkbox[label="${notSureDatesDetails}"]`, container)).to
          .exist;

        const addlInfo = container.querySelector('va-additional-info');
        expect(addlInfo).to.have.attribute(
          'trigger',
          'What if I have more than one date range?',
        );

        // subtitle checks
        if (locationId === 'cambodia') {
          getByText(`Location 1 of 2: ${HERBICIDE_LOCATIONS.cambodia}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 1 of 2: ${HERBICIDE_LOCATIONS.cambodia}`,
          );
        } else if (locationId === 'laos') {
          getByText(`Location 2 of 2: ${HERBICIDE_LOCATIONS.laos}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 2 of 2: ${HERBICIDE_LOCATIONS.laos}`,
          );
        } else {
          getByText(HERBICIDE_LOCATIONS[locationId]);
          expect(pageSchema.title(formData)).to.equal(
            `${HERBICIDE_LOCATIONS[locationId]}`,
          );
        }
      });

      /*
       * TODO: We currently validate against partial dates on the frontend.
       * Future consideration: allow Veterans to submit with completely blank or partial dates.
       * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
       */
      it(`should not submit without dates for ${locationId}`, () => {
        pageSubmitTest(
          schemas[`herbicide-location-${locationId}`],
          formData,
          false,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.herbicideDetails = {};
        data.toxicExposure.herbicideDetails[locationId] = {
          startDate: '1975-04-02',
          endDate: '1978-08-05',
        };

        pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
      });
    });

  /*
   * Edge case validations for toxic exposure dates.
   * TODO: We currently validate against partial dates on the frontend.
   * Future consideration: allow Veterans to submit with completely blank or partial dates.
   * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
   */
  describe('date validations', () => {
    const locationId = 'cambodia';

    it('should not submit with incomplete start date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-XX-15',
          endDate: '1976-06-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete start date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04-XX',
          endDate: '1976-06-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: 'XXXX-04-15',
          endDate: '1976-06-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete end date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04-15',
          endDate: '1976-XX-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete end date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04-15',
          endDate: '1976-06-XX',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04-15',
          endDate: 'XXXX-06-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1976-04-15',
          endDate: '1975-06-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with only start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04-15',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with only end date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          endDate: '1976-06-30',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should submit with current date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should submit with past date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should not submit with future date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with date before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1899-12-31',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: 'invalid-date',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should submit with current date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should submit with past date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should not submit with future date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with date before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: '1899-12-31',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should submit with valid date range (to after from)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should not submit with equal start and end dates', () => {
      const data = JSON.parse(JSON.stringify(formData));
      const sameDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: sameDate,
          endDate: sameDate,
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with non-leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '2021-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should submit with leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '2020-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });
  });
});
