import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { makePages } from '../../../pages/toxicExposure/herbicideDetails';
import { HERBICIDE_LOCATIONS } from '../../../constants';
import {
  dateRangeDescriptionWithLocation,
  endDateApproximate,
  herbicidePageTitle,
  notSureDatesDetails,
  startDateApproximate,
} from '../../../content/toxicExposure';
import { pageSubmitTest } from '../../unit.helpers.spec';

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

        expect($(`va-checkbox[label="${notSureDatesDetails}"]`, container)).to
          .exist;

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
        pageSubmitTest(
          schemas[`herbicide-location-${locationId}`],
          formData,
          true,
        );
      });

      it(`should submit with both dates for ${locationId}`, () => {
        const data = JSON.parse(JSON.stringify(formData));
        data.toxicExposure.herbicideDetails = {};
        data.toxicExposure.herbicideDetails[locationId] = {
          startDate: '1975-04-02',
          endDate: '1978-08-05',
        };

        pageSubmitTest(schemas[`herbicide-location-${locationId}`], data, true);
      });
    });
});
