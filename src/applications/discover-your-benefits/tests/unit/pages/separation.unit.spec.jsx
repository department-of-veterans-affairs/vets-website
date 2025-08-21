import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { getData, mockFormData } from '../mocks/mockFormData';
import separationConfig from '../../../pages/separation';

describe('separation page', () => {
  it('should render the correct radio component', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={separationConfig.schema}
          uiSchema={separationConfig.uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );
    expect($('va-radio', container)).to.exist;
  });

  it('should updateUiSchema', () => {
    const data = { ...mockFormData, militaryServiceCurrentlyServing: true };
    const result = separationConfig.uiSchema.separation[
      'ui:options'
    ].updateUiSchema(data);

    expect(result['ui:options'].hideOnReview).to.be.true;
  });
});
