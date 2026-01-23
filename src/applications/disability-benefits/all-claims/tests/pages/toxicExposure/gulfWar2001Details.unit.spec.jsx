import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, subYears, addYears } from 'date-fns';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/gulfWar2001Details';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  gulfWar2001PageTitle,
  notSureDatesDetails,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { GULF_WAR_2001_LOCATIONS } from '../../../constants';
import { pageSubmitTest } from '../../unit.helpers.spec';

/**
 * Unit tests for the gulf war 2001 details pages. Verifies each page can render and submit with
 * valid dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the location was selected.
 */
describe('gulfWar2001Details', () => {
  const schemas = { ...makePages() };
  const formData = {
    toxicExposure: {
      gulfWar2001: {
        lebanon: false,
        yemen: true,
        airspace: true,
      },
    },
  };

  Object.keys(GULF_WAR_2001_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .forEach(locationId => {
      const pageSchema = schemas[`gulf-war-2001-location-${locationId}`];
      it(`should render for ${locationId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
          />,
        );

        getByText(gulfWar2001PageTitle);
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

        // Look for the text on the page and also the title used for review and submit
        if (locationId === 'yemen') {
          getByText(`Location 1 of 2: ${GULF_WAR_2001_LOCATIONS.yemen}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 1 of 2: ${GULF_WAR_2001_LOCATIONS.yemen}`,
          );
        } else if (locationId === 'airspace') {
          getByText(`Location 2 of 2: ${GULF_WAR_2001_LOCATIONS.airspace}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 2 of 2: ${GULF_WAR_2001_LOCATIONS.airspace}`,
          );
        } else {
          getByText(GULF_WAR_2001_LOCATIONS[locationId]);
          expect(pageSchema.title(formData)).to.equal(
            `${GULF_WAR_2001_LOCATIONS[locationId]}`,
          );
        }
      });

      it(`should submit without dates for ${locationId} (dates are optional)`, () => {
        pageSubmitTest(
          schemas[`gulf-war-2001-location-${locationId}`],
          formData,
          true,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.gulfWar2001Details = {};
        data.toxicExposure.gulfWar2001Details[locationId] = {
          startDate: '2002-10',
          endDate: '2004-03',
        };

        pageSubmitTest(
          schemas[`gulf-war-2001-location-${locationId}`],
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
    const locationId = 'yemen'; // Using yemen as the test case

    it(`should submit with start date only (dates are optional)`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it(`should submit with end date only (dates are optional)`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          endDate: '2003-06',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it(`should submit with both dates and not sure`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10',
          endDate: '2003-06',
          'view:notSure': true,
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future month/year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with year before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '1899-12',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with invalid date format for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: 'invalid-date',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with current month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: format(new Date(), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future month/year for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 1), 'yyyy-MM'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with year before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: '1899-12',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with invalid date format for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with valid date range (end after start)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2003-10',
          endDate: '2002-06',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date month/year is before start date month/year', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10',
          endDate: '2002-09',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date is before September 2001', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2000-10',
          endDate: '2001-08',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit when end date is September 2001 (accepted due to month/year granularity)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2000-10',
          endDate: '2001-09',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: 'XXXX-10',
          endDate: '2003-06',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10',
          endDate: 'XXXX-06',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should accept year-only format (YYYY-XX)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-XX',
          endDate: '2004-XX',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10-15',
          endDate: '2004-03-31',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });
  });
});
