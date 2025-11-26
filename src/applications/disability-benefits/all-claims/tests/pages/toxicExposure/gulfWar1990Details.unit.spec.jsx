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

      // TODO: We currently validate against this on the frontend to prevent the 'XX' date issue,
      // however we want Veterans to be able to submit with a completely blank or partial date.
      // Note to revisit after we land on a solution for accommodating partial dates.
      // @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
      it(`should not submit without dates for ${locationId}`, () => {
        pageSubmitTest(
          schemas[`gulf-war-1990-location-${locationId}`],
          formData,
          false,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.gulfWar1990Details = {};
        data.toxicExposure.gulfWar1990Details[locationId] = {
          startDate: '1990-01-01',
          endDate: '1995-02-28',
        };

        pageSubmitTest(
          schemas[`gulf-war-1990-location-${locationId}`],
          data,
          true,
        );
      });
    });

  /*
   * Date validation tests for toxic exposure dates.
   * TODO: We currently validate against partial dates on the frontend to prevent the 'XX' date issue.
   * In the future, we may want Veterans to be able to submit with completely blank or partial dates.
   * Note to revisit after we land on a solution for accommodating partial dates.
   * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/112288
   */
  describe('date validation', () => {
    const locationId = 'bahrain';

    // TODO: We currently validate against this on the frontend to prevent the 'XX' date issue,
    // however we want Veterans to be able to submit with a completely blank date.
    // Note to revisit after we land on a solution for accommodating partial dates.
    it(`should not submit with start date only`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-01-01',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    // TODO: We currently validate against this on the frontend to prevent the 'XX' date issue,
    // however we want Veterans to be able to submit with a completely blank date.
    // Note to revisit after we land on a solution for accommodating partial dates.
    it(`should not submit with end date only`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          endDate: '1970-04-02',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it(`should submit with both dates and not sure`, () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1991-06-03',
          endDate: '1992-07-04',
          'view:notSure': true,
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future date for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 2), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with date before 1900 for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1899-12-31',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
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
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with two digit year for startDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '77-05-20',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with current date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should submit with past date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        true,
      );
    });

    it('should not submit with future date for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
          endDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with date before 1900 for endDate', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: '1899-12-31',
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
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: 'invalid-date',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with valid date range (to after from)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
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
          startDate: '1991-09-25',
          endDate: '1990-09-25',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with equal start and end dates', () => {
      const data = JSON.parse(JSON.stringify(formData));
      const sameDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: sameDate,
          endDate: sameDate,
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit when end date is before August 2, 1990', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1988-09-25',
          endDate: '1989-09-25',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-XX-05',
          endDate: '1991-06-15',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-08-XX',
          endDate: '1991-02-28',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete start date (missing year)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: 'XXXX-08-15',
          endDate: '1991-03-01',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing month)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-08-15',
          endDate: '1991-XX-20',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with incomplete end date (missing day)', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '1990-09-01',
          endDate: '1991-02-XX',
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
          startDate: '1990-10-10',
          endDate: 'XXXX-03-15',
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should not submit with non-leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '2021-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
        },
      };

      pageSubmitTest(
        schemas[`gulf-war-1990-location-${locationId}`],
        data,
        false,
      );
    });

    it('should submit with leap year February 29', () => {
      const data = JSON.parse(JSON.stringify(formData));
      data.toxicExposure.gulfWar1990Details = {
        [locationId]: {
          startDate: '2020-02-29',
          endDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
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
