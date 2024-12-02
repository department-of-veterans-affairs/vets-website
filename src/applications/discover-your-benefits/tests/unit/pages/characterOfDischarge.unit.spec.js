import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import characterOfDischargeConfig from '../../../pages/characterOfDischarge';
import { getData } from '../mocks/mockFormData';

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
});
