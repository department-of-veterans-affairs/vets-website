import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/gulfWar1990Details';
import {
  dateRangeDescription,
  endDateApproximate,
  gulfWar1990PageTitle,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS } from '../../../constants';

/**
 * Unit tests for the gulf war 1990 details pages. Verifies each page can render and submit with
 * and without dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the location was selected.
 */
describe('gulfWar1990Details', () => {
  const schemas = { ...makePages() };
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
    .filter(locationId => locationId !== 'none')
    .forEach(locationId => {
      it(`should render for ${locationId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={schemas[`gulf-war-1990-location-${locationId}`]?.schema}
            uiSchema={schemas[`gulf-war-1990-location-${locationId}`]?.uiSchema}
            data={formData}
          />,
        );

        getByText(gulfWar1990PageTitle);
        getByText(dateRangeDescription);

        const addlInfo = container.querySelector('va-additional-info');
        expect(addlInfo).to.have.attribute(
          'trigger',
          'What if I have more than one date range?',
        );

        expect(
          $(`va-memorable-date[label="${startDateApproximate}"]`, container),
        ).to.exist;
        expect($(`va-memorable-date[label="${endDateApproximate}"]`, container))
          .to.exist;

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
            schema={schemas[`gulf-war-1990-location-${locationId}`]?.schema}
            uiSchema={schemas[`gulf-war-1990-location-${locationId}`]?.uiSchema}
            data={formData}
            onSubmit={onSubmit}
          />,
        );

        userEvent.click(getByText('Submit'));
        expect(onSubmit.calledOnce).to.be.true;
      });
    });
});
