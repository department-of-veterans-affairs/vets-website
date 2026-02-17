import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { getData, mockFormData } from '../mocks/mockFormData';
import separationConfig from '../../../pages/separation';
import {
  separationTypes,
  separationTypeLabels,
} from '../../../constants/benefits';

describe('separation page', () => {
  let wrapper;

  const setupForm = (data = {}) => {
    return render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={separationConfig.schema}
          uiSchema={separationConfig.uiSchema}
          data={data}
          formData={{}}
        />
        ,
      </Provider>,
    );
  };

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for separation', () => {
    const title = document.querySelector(
      'va-radio[label="How long ago did you separate or retire from service?"]',
    );
    expect(title).to.exist;
  });

  it('should render the correct hint for separation', () => {
    const hint = document.querySelector(
      'va-radio[hint="If you served during multiple periods, please choose the answer that corresponds to your most recent separation."]',
    );
    expect(hint).to.exist;
  });

  it('should render the correct radio component', () => {
    const { container } = setupForm();
    expect($('va-radio', container)).to.exist;
  });

  it('should render the correct labels and values in radio select', () => {
    const types = Object.values(separationTypes);
    const labels = Object.values(separationTypeLabels);
    for (let i = 0; i < types.length; i++) {
      const queryString =
        `va-radio-option[label='${labels[i]}'][value=${types[i]}]`.replace(
          '+',
          '+\\',
        );
      const radioOption = document.querySelector(queryString);
      expect(radioOption).to.exist;
    }
  });

  it('should updateUiSchema', () => {
    const data = { ...mockFormData, militaryServiceCurrentlyServing: true };
    const result =
      separationConfig.uiSchema.separation['ui:options'].updateUiSchema(data);

    expect(result['ui:options'].hideOnReview).to.be.true;
  });
});
