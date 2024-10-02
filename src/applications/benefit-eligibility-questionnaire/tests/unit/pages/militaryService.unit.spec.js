import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import militaryServiceConfig from '../../../pages/militaryService';

describe('Military Service Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={militaryServiceConfig.schema}
        uiSchema={militaryServiceConfig.uiSchema}
        data={data}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for militaryServiceCurrentlyServing', () => {
    const title = wrapper.getByText(
      'Are you currently serving in the military?',
    );
    expect(title).to.exist;
  });

  it('should render the correct radio options for militaryServiceCurrentlyServing', () => {
    const yesOption = wrapper.getByLabelText('Yes');
    const noOption = wrapper.getByLabelText('No');

    expect(yesOption).to.exist;
    expect(noOption).to.exist;
  });

  it('should render the correct title for expectedSeparation when currently serving', () => {
    const yesOption = wrapper.getByLabelText('Yes');
    fireEvent.click(yesOption);

    const separationTitle = wrapper.getByText(
      'When do you expect to separate or retire from the service?',
    );
    expect(separationTitle).to.exist;
  });

  it('should hide expectedSeparation when not currently serving', () => {
    const noOption = wrapper.getByLabelText('No');
    fireEvent.click(noOption);

    const separationTitle = wrapper.queryByText(
      'When do you expect to separate or retire from the service?',
    );
    expect(separationTitle).to.not.exist;
  });

  it('should render the correct radio options for expectedSeparation', () => {
    const yesOption = wrapper.getByLabelText('Yes');
    fireEvent.click(yesOption);

    const options = [
      'Within the next 3 months',
      'More than 3 months but less than 6 months',
      'More than 6 months but less than 1 year',
      'More than 1 year from now',
      'More than 3 years from now',
    ];

    options.forEach(option => {
      const radioOption = wrapper.getByLabelText(option);
      expect(radioOption).to.exist;
    });
  });
});
