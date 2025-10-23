import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { getData } from '../mocks/mockFormData';
import disabilityRatingConfig from '../../../pages/disabilityRating';
import {
  disabilityTypes,
  disabilityTypeLabels,
} from '../../../constants/benefits';
import 'css.escape';

describe('disabilityRating page', () => {
  let wrapper;
  let container;

  const setupForm = () => {
    return render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={disabilityRatingConfig.schema}
          uiSchema={disabilityRatingConfig.uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );
  };

  beforeEach(() => {
    wrapper = setupForm();
    container = wrapper.container;
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct radio component', () => {
    expect($('va-radio', container)).to.exist;
  });

  it('should render the correct title for disabilityRating', () => {
    const title = CSS.escape('Do you have a VA disability rating?');
    const radioButton = document.querySelector(`va-radio[label=${title}]`);
    expect(radioButton).to.exist;
  });

  it('should render the correct radio option labels', () => {
    Object.values(disabilityTypeLabels).forEach(label => {
      const radioButtonOption = document.querySelector(
        `va-radio-option[label=${CSS.escape(label)}]`,
      );
      expect(radioButtonOption).to.exist;
    });
  });

  it('should render the correct radio option labels', () => {
    Object.values(disabilityTypes).forEach(type => {
      const radioButtonOption = document.querySelector(
        `va-radio-option[value=${type}]`,
      );
      expect(radioButtonOption).to.exist;
    });
  });

  it('should allow radio options to be selected', () => {
    const options = Object.values(disabilityTypes);

    const option = document.querySelector(
      `va-radio-option[value="${options[0]}"]`,
    );

    option.checked = true;

    fireEvent(option, new CustomEvent('click'));
    expect(option.checked).to.be.true;
  });
});
