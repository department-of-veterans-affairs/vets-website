import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, subYears, addYears } from 'date-fns';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/gulfWar1990Details';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  gulfWar1990PageTitle,
  notSureDatesDetails,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS } from '../../../constants';
import { pageSubmitTest } from '../../unit.helpers.spec';

const schemas = { ...makePages() };

/**
 * Unit tests for the gulf war 1990 details pages. Verifies each page can render and submit with
 * valid dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the location was selected.
 */
describe('gulfWar1990Details', () => {
  const formData = {
    toxicExposure: {
      gulfWar1990: {
        afghanistan: true,
        iraq: false,
        airspace: true,
      },
    },
  };

  Object.keys(GULF_WAR_1990_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .forEach(locationId => {
      const pageSchema = schemas[`gulf-war-1990-location-${locationId}`];
      it(`should render for ${locationId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
          />,
        );

        getByText(gulfWar1990PageTitle);
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
        if (locationId === 'afghanistan') {
          getByText(`Location 1 of 2: ${GULF_WAR_1990_LOCATIONS.afghanistan}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 1 of 2: ${GULF_WAR_1990_LOCATIONS.afghanistan}`,
          );
        } else if (locationId === 'airspace') {
          getByText(`Location 2 of 2: ${GULF_WAR_1990_LOCATIONS.airspace}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 2 of 2: ${GULF_WAR_1990_LOCATIONS.airspace}`,
          );
        } else {
          getByText(GULF_WAR_1990_LOCATIONS[locationId]);
          expect(pageSchema.title(formData)).to.equal(
            `${GULF_WAR_1990_LOCATIONS[locationId]}`,
          );
        }
      });

      it(`should submit without dates for ${locationId} (dates are optional)`, () => {
        pageSubmitTest(
          schemas[`gulf-war-1990-location-${locationId}`],
          formData,
          true,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.gulfWar1990Details = {};
        data.toxicExposure.gulfWar1990Details[locationId] = {
          startDate: '1990-01',
          endDate: '1995-02',
        };

        pageSubmitTest(
          schemas[`gulf-war-1990-location-${locationId}`],
          data,
          true,
        );
      });
    });

  /*
   * Date validation tests for toxic exposure dates (month/year format).
   * Supports year-only (YYYY-XX) or month/year (YYYY-MM).
   * Full dates (YYYY-MM-DD) are accepted for backward compatibility.
   */
  describe('date validation', () => {
    const locationId = 'bahrain';

    it(`should submit with start date only (dates are optional)`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-01',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it(`should submit with end date only (dates are optional)`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          endDate: '1995-04',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it(`should submit with both dates and not sure`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1991-06',
          endDate: '1992-07',
          'view:notSure': true,
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with year before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1899-12',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: 'invalid-date',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with current month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: format(new Date(), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 1), 'yyyy-MM'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with year before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: '1899-12',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with valid date range (end after start)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1991-09',
          endDate: '1990-09',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date month/year is before start date month/year', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1991-09',
          endDate: '1991-08',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date is before August 1990', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1988-09',
          endDate: '1989-09',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit when end date is August 1990 (accepted due to month/year granularity)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1988-09',
          endDate: '1990-08',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: 'XXXX-08',
          endDate: '1991-03',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-10',
          endDate: 'XXXX-03',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should accept year-only format (YYYY-XX)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-XX',
          endDate: '1995-XX',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-01-01',
          endDate: '1995-02-28',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });
  });
});
