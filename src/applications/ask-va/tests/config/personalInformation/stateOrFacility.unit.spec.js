import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import { getData } from '../../fixtures/data/mock-form-data';

// const {
//   schema,
//   uiSchema,
// } = formConfig.chapters.personalInformation.pages.stateOrFacility_aboutmyselfrelationshipveteran;

describe('stateOrFacilityPage', () => {
  // Skipping since we are not currently using this in form yet
  it.skip('should render', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          // schema={schema}
          // uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    const radioLabels = $$('.form-radio-buttons > label', container);
    const radioLabelList = ['School state', 'School facility'];

    expect($('h2', container).textContent).to.eq('School information');
    expect($('p', container).textContent).to.eq(
      'Would you like to choose your school state or facility?',
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });
});
