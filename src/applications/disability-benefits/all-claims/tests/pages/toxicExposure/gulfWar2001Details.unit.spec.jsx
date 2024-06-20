import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/gulfWar2001Details';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  gulfWar2001PageTitle,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { GULF_WAR_2001_LOCATIONS } from '../../../constants';

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

        getByText('I’m not sure of the dates I served in this location');

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
        const onSubmit = sinon.spy();
        const { getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
            onSubmit={onSubmit}
          />,
        );

        userEvent.click(getByText('Submit'));
        expect(onSubmit.calledOnce).to.be.true;
      });
    });
});
