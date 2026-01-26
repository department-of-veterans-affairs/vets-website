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

        expect($(`va-date[label="${startDateApproximate}"]`, container)).to
          .exist;
        expect($(`va-date[label="${endDateApproximate}"]`, container)).to.exist;

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
       */
      it(`should submit without dates for ${locationId} (dates are optional)`, () => {
        pageSubmitTest(
          schemas[`herbicide-location-${locationId}`],
          formData,
          true,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.herbicideDetails = {};
        data.toxicExposure.herbicideDetails[locationId] = {
          startDate: '1975-04',
          endDate: '1978-08',
        };

        pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
      });
    });

  /*
   * Date validation tests for toxic exposure dates (month/year format).
   * Supports year-only (YYYY-XX) or month/year (YYYY-MM).
   * Full dates (YYYY-MM-DD) are accepted for backward compatibility.
   */
  describe('date validation', () => {
    const locationId = 'cambodia';

    it(`should submit with start date only (dates are optional)`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it(`should submit with end date only (dates are optional)`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          endDate: '1976-06',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it(`should submit with both dates and not sure`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04',
          endDate: '1976-06',
          'view:notSure': true,
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should submit with past month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should not submit with future month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with year before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1899-12',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: 'invalid-date',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should submit with current month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: format(new Date(), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should submit with past month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should not submit with future month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 1), 'yyyy-MM'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with year before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: '1899-12',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should submit with valid date range (end after start)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1976-04',
          endDate: '1975-06',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit when end date month/year is before start date month/year', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1976-04',
          endDate: '1976-03',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: 'XXXX-04',
          endDate: '1976-06',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04',
          endDate: 'XXXX-06',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, false);
    });

    it('should accept year-only format (YYYY-XX)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-XX',
          endDate: '1976-XX',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });

    it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.herbicideDetails = {
        [locationId]: {
          startDate: '1975-04-02',
          endDate: '1978-08-05',
        },
      };

      pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
    });
  });
});
