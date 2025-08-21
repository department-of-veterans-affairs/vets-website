import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
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
 * and without dates. Additionally, verifies the subtitles are built appropriately whether or not
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

      it(`should submit without dates for ${locationId}`, () => {
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

  /* more things to test but would be heavy to test for every TE details page and 
  location/hazard. since all the TE pages are similarly setup, we'll test edge 
  cases here. all pages should test for submission with no dates and with both dates.
  */
  it(`should submit with start date only`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      bahrain: {
        startDate: '1990-01-01',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-bahrain'], data, true);
  });

  it(`should submit with end date only`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      egypt: {
        endDate: '1970-04-02',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-egypt'], data, true);
  });

  it(`should submit with both dates and not sure`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      saudiarabia: {
        startDate: '1991-06-03',
        endDate: '1992-07-04',
        'view:notSure': true,
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-saudiarabia'], data, true);
  });

  it(`should not submit when empty month`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      jordan: {
        startDate: '1990-XX-05',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-jordan'], data, false);
  });

  it(`should not submit when empty day`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      kuwait: {
        startDate: '1990-01-XX',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-kuwait'], data, false);
  });

  it(`should not submit when empty year`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      neutralzone: {
        startDate: 'XXXX-01-01',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-neutralzone'], data, false);
  });

  it(`should not submit when non numeric chars`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      oman: {
        startDate: 'abcd-xy-yz',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-oman'], data, false);
  });

  it(`should not submit when two digit year`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      qatar: {
        startDate: '77-05-20',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-qatar'], data, false);
  });

  it(`should not submit when future date`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      uae: {
        startDate: '2030-08-22',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-uae'], data, false);
  });

  it(`should not submit when very old date`, () => {
    const data = JSON.parse(JSON.stringify(formData));
    data.toxicExposure.gulfWar1990Details = {
      turkey: {
        startDate: '1800-09-25',
      },
    };

    pageSubmitTest(schemas['gulf-war-1990-location-turkey'], data, false);
  });
});
