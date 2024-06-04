import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/herbicideDetails';
import { HERBICIDE_LOCATIONS } from '../../../constants';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  herbicidePageTitle,
  startDateApproximate,
} from '../../../content/toxicExposure';

/**
 * Unit tests for the herbicide details pages. Verifies each page can render and submit with
 * and without dates. Additionally, verifies the subtitles are built appropriately whether or not
 * the location was selected.
 */
describe('herbicideDetails', () => {
  const schemas = { ...makePages() };
  const formData = {
    toxicExposure: {
      herbicide: {
        cambodia: true,
        koreandemilitarizedzone: false,
        laos: true,
      },
    },
  };

  Object.keys(HERBICIDE_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .forEach(locationId => {
      const pageSchema = schemas[`herbicide-location-${locationId}`];
      it(`should render for ${locationId}`, () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={pageSchema.schema}
            uiSchema={pageSchema.uiSchema}
            data={formData}
          />,
        );

        getByText(herbicidePageTitle);
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

        // subtitle checks
        if (locationId === 'cambodia') {
          getByText(`Location 1 of 2: ${HERBICIDE_LOCATIONS.cambodia}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 1 of 2: ${HERBICIDE_LOCATIONS.cambodia}`,
          );
        } else if (locationId === 'laos') {
          getByText(`Location 2 of 2: ${HERBICIDE_LOCATIONS.laos}`, {
            exact: false,
          });
          expect(pageSchema.title(formData)).to.equal(
            `Location 2 of 2: ${HERBICIDE_LOCATIONS.laos}`,
          );
        } else {
          getByText(HERBICIDE_LOCATIONS[locationId]);
          expect(pageSchema.title(formData)).to.equal(
            `${HERBICIDE_LOCATIONS[locationId]}`,
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
