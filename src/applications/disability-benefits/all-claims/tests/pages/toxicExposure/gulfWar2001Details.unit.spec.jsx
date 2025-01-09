import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
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
 * and without dates. Additionally, verifies the subtitles are built appropriately whether or not
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

      it(`should submit without dates for ${locationId}`, () => {
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
});
