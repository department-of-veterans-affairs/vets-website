import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { changeDropdown } from 'platform/testing/unit/helpers';
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
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          schema={schemas[`gulfWar1990Locations-${locationId}`]?.schema}
          uiSchema={schemas[`gulfWar1990Locations-${locationId}`]?.uiSchema}
          data={formData}
          onSubmit={onSubmit}
        />,
      );

      const startMonthId = `#root_gulfWar1990Locations_${locationId}_startDateMonth`;
      changeDropdown(form, startMonthId, 5);
      const startYear = form.find(
        `#root_gulfWar1990Locations_${locationId}_startDateYear`,
      );
      startYear.simulate('change', {
        target: { value: '2020' },
      });

      const endMonthId = `#root_gulfWar1990Locations_${locationId}_endDateMonth`;
      changeDropdown(form, endMonthId, 2);
      const year = form.find(
        `#root_gulfWar1990Locations_${locationId}_endDateYear`,
      );
      year.simulate('change', {
        target: { value: '2024' },
      });

      form.find('form').simulate('submit');
      expect(onSubmit.calledOnce).to.be.true;
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      form.unmount();
    });
  });
});
