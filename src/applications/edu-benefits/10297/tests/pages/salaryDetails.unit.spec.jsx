import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import * as salaryDetails from '../../pages/salaryDetails';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={salaryDetails.schema}
      uiSchema={salaryDetails.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('Background Information Step 4 - Page 4, Salary Details', () => {
  it('renders the salary question', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      "What's your current annual salary?",
    );
    const radios = container.querySelectorAll(
      'va-radio, va-radio-option, input[type="radio"]',
    );
    expect(radios.length).to.be.greaterThan(0);
  });

  it('accepts a valid salary range', () => {
    let utils = renderPage({ currentSalary: 'lessThanTwenty' });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
    utils.unmount();
    utils = renderPage({ currentSalary: 'moreThanSeventyFive' });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
  });
});
