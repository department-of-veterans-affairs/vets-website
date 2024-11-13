import React from 'react';
import { render } from '@testing-library/react';
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
    const title = document.querySelector(
      'va-radio[label="Are you currently serving in the military?"]',
    );
    expect(title).to.exist;
  });

  it('should render the correct radio options for militaryServiceCurrentlyServing', () => {
    const yesOption = document.querySelector('va-radio-option[label="Yes"]');
    const noOption = document.querySelector('va-radio-option[label="No"]');

    expect(yesOption).to.exist;
    expect(noOption).to.exist;
  });

  it('should not display expectedSeparation by default', () => {
    const separationTitle = wrapper.queryByText(
      'When do you expect to separate or retire from the service?',
    );
    expect(separationTitle).to.not.exist;
  });
});
