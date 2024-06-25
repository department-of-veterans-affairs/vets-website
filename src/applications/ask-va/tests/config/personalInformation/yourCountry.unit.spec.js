import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

// import formConfig from '../../../config/form';
import { getData } from '../../fixtures/data/mock-form-data';
import { removeReqFromLabel } from '../../fixtures/test-helpers/helpers';

// const {
//   schema,
//   uiSchema,
// } = formConfig.chapters.personalInformation.pages.yourCountry_generalquestion;

describe('yourCountryPage', () => {
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

    const checkboxText =
      'I live on a United States military base outside of the country';

    expect($('h4', container).textContent).to.eq('Your country');
    expect($('.form-checkbox > label', container).textContent).to.eq(
      checkboxText,
    );
    expect(
      removeReqFromLabel($('#root_country-label', container).textContent),
    ).to.eq('Country');
  });
});
