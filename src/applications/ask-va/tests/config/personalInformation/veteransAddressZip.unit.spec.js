import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../config/form';
import { getData } from '../../fixtures/data/mock-form-data';
import { removeReqFromLabel } from '../../fixtures/test-helpers/helpers';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformation.pages.veteransPostalCode_familysomeonesbenefits;

describe('veteransPostalCodePage', () => {
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
      'The Veteran lives on a United States military base outside of the country.';

    expect($('h4', container).textContent).to.eq("Veteran's postal code");
    expect($('.form-checkbox > label', container).textContent).to.eq(
      checkboxText,
    );
    expect(
      removeReqFromLabel(
        $('#root_veteranPostalCode-label', container).textContent,
      ),
    ).to.eq('Postal code');
  });
});
