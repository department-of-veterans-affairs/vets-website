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

      // TODO: We currently validate against this on the frontend to prevent the 'XX' date issue,
      // however we want Veterans to be able to submit with a completely blank or partial date.
      // Note to revisit after we land on a solution for accommodating partial dates.
      // @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
      it(`should not submit without dates for ${locationId}`, () => {
        pageSubmitTest(
          schemas[`gulf-war-2001-location-${locationId}`],
          formData,
          false,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.gulfWar2001Details = {};
        data.toxicExposure.gulfWar2001Details[locationId] = {
          startDate: '2002-10-15',
          endDate: '2004-03-31',
        };

        pageSubmitTest(
          schemas[`gulf-war-2001-location-${locationId}`],
          data,
          true,
        );
      });
    });

  /*
   * Edge case validations for toxic exposure dates.
   * TODO: We currently validate against partial dates on the frontend.
   * Future consideration: allow Veterans to submit with completely blank or partial dates.
   * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
   */
  describe('date validations', () => {
    const locationId = 'yemen'; // Using yemen as the test case

    it('should not submit with incomplete start date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-XX-15',
          endDate: '2003-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10-XX',
          endDate: '2003-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: 'XXXX-10-15',
          endDate: '2003-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10-15',
          endDate: '2003-XX-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10-15',
          endDate: '2003-06-XX',
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
          startDate: '2002-10-15',
          endDate: 'XXXX-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date is before start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2003-10-15',
          endDate: '2002-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date is before September 11, 2001', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2000-10-15',
          endDate: '2001-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with only start date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2002-10-15',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with only end date', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          endDate: '2003-06-30',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with past date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with date before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '1899-12-31',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
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
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with current date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with date before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: '1899-12-31',
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
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with valid date range (to after from)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with equal start and end dates', () => {
      const data = JSON.parse(JSON.stringify(formData));
      const sameDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: sameDate,
          endDate: sameDate,
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with non-leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2021-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-2001-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar2001Details = {
        [locationId]: {
          startDate: '2020-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
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
