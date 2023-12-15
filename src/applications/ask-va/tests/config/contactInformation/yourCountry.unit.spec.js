import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../../config/form';
import { removeReqFromLabel } from '../../fixtures/test-helpers/helpers';
import { getData } from '../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformation.pages.yourCountry;

describe('yourCountryPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
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
