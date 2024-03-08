import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { makePages } from '../../../pages/toxicExposure/gulfWar1990LocationDates';
import {
  dateHelp,
  endDateApproximate,
  gulfWar1990PageTitle,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS } from '../../../constants';

/**
 * Unit tests for the gulf war 1990 location dates pages. Verifies each page can render and submit with
 * and without dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the location was selected.
 */
describe('gulfWar1990LocationDates', () => {
  const schemas = { ...makePages() };
  const formData = {
    gulfWar1990: {
      afghanistan: true,
      iraq: false,
      airspace: true,
    },
  };

  Object.keys(GULF_WAR_1990_LOCATIONS).forEach(locationId => {
    it(`should render for ${locationId}`, () => {
      const { getByText } = render(
        <DefinitionTester
          schema={schemas[`gulfWar1990Locations-${locationId}`]?.schema}
          uiSchema={schemas[`gulfWar1990Locations-${locationId}`]?.uiSchema}
          data={formData}
        />,
      );

      getByText(gulfWar1990PageTitle);
      getByText(dateHelp);
      getByText(startDateApproximate);
      getByText(endDateApproximate);

      if (locationId === 'afghanistan') {
        getByText(`1 of 2: ${GULF_WAR_1990_LOCATIONS.afghanistan}`, {
          exact: false,
        });
      } else if (locationId === 'airspace') {
        getByText(`2 of 2: ${GULF_WAR_1990_LOCATIONS.airspace}`, {
          exact: false,
        });
      } else {
        getByText(GULF_WAR_1990_LOCATIONS[locationId]);
      }
    });

    it(`should submit without dates for ${locationId}`, () => {
      const onSubmit = sinon.spy();
      const { getByText } = render(
        <DefinitionTester
          schema={schemas[`gulfWar1990Locations-${locationId}`]?.schema}
          uiSchema={schemas[`gulfWar1990Locations-${locationId}`]?.uiSchema}
          data={formData}
          onSubmit={onSubmit}
        />,
      );

      userEvent.click(getByText('Submit'));
      expect(onSubmit.calledOnce).to.be.true;
    });

    it(`should submit with dates for ${locationId}`, () => {
      // TODO
    });
  });
});
