import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import characterOfDischargeConfig from '../../../pages/characterOfDischarge';
import { getData } from '../mocks/mockFormData';
import { characterOfDischargeTypes } from '../../../constants/benefits';
import 'css.escape';

describe('Character of Discharge Form', () => {
  let wrapper;
  let container;

  const setupForm = () =>
    render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={characterOfDischargeConfig.schema}
          uiSchema={characterOfDischargeConfig.uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

  beforeEach(() => {
    wrapper = setupForm();
    container = wrapper.container;
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for characterOfDischarge', () => {
    const title =
      'What is the highest character of discharge you have received or expect to receive?';
    const hint =
      'If you served multiple times with different characters of discharge';
    const select = $('va-select', container);

    expect(select.getAttribute('label')).to.equal(title);
    expect(select.getAttribute('hint')).to.contain(hint);
  });

  it('should render the correct hint', () => {
    const escapedHint = CSS.escape(
      'If you served multiple times with different characters of discharge, please select the "highest" of your discharge statuses. If you feel your character of discharge is unjust, you can apply for a discharge upgrade.',
    );
    const hint = document.querySelector(`va-select[hint=${escapedHint}]`);
    expect(hint).to.exist;
  });

  it('should render the correct radio options for character of discharge', () => {
    const types = Object.values(characterOfDischargeTypes);

    types.forEach(type => {
      const selectOption = document.querySelector(`option[value="${type}"]`);
      expect(selectOption).to.exist;
    });
  });

  it('should require characterOfDischarge and show an error message when not selected', async () => {
    const submitButton = $('button[type="submit"]', container);

    fireEvent.click(submitButton);

    await waitFor(() => {
      const select = $('va-select', container);
      expect(select.getAttribute('error')).to.equal(
        'Character of discharge is required',
      );
    });
  });

  it('should render the correct link in the description for characterOfDischargeTWO', () => {
    const link = $('va-link', container);
    const linkText = 'Learn more about the discharge upgrade process';
    const href = 'https://www.va.gov/discharge-upgrade-instructions';

    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(linkText);
    expect(link.getAttribute('href')).to.equal(href);
  });

  it('should allow radio options to be selected', () => {
    const options = Object.values(characterOfDischargeTypes);

    const option = document.querySelector(`option[value="${options[0]}"]`);

    option.checked = true;

    fireEvent(option, new CustomEvent('click'));
    expect(option.checked).to.be.true;
  });
});
