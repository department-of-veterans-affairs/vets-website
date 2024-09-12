import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import characterOfDischargeConfig from '../../../pages/characterOfDischarge';

describe('Character of Discharge Form', () => {
  let wrapper;

  const setupForm = () =>
    render(
      <DefinitionTester
        schema={characterOfDischargeConfig.schema}
        uiSchema={characterOfDischargeConfig.uiSchema}
        data={{}}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for characterOfDischarge', () => {
    const title = wrapper.getByText(
      /What is the highest character of discharge you have received or expect to receive\?/i,
    );
    expect(title).to.exist;
  });

  it('should render the correct description for characterOfDischarge', () => {
    const description = wrapper.getByText(
      /If you served multiple times with different characters of discharge, please select the "highest" of your discharge statuses\./i,
    );
    expect(description).to.exist;
  });

  it('should require characterOfDischarge and show an error message when not selected', async () => {
    const submitButton = wrapper.getByText(/Submit/i);
    fireEvent.click(submitButton);

    const errorMessage = await wrapper.findByText(
      'Character of discharge is required',
    );
    expect(errorMessage).to.exist;
  });

  it('should render the correct link in the description for characterOfDischargeTWO', () => {
    const link = wrapper.getByText(
      /Learn more about the discharge upgrade process/i,
    );
    expect(link).to.exist;
    expect(link.closest('a')).to.have.attribute(
      'href',
      'https://www.va.gov/discharge-upgrade-instructions',
    );
  });
});
