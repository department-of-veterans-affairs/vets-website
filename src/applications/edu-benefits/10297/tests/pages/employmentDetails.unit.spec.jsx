import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import * as employmentDetails from '../../pages/employmentDetails';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={employmentDetails.schema}
      uiSchema={employmentDetails.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('Background Information Step 4 - Page 2, Employment Details', () => {
  it('renders the technology industry question', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Do you currently work in the technology industry?',
    );
    const radios = container.querySelectorAll(
      'va-radio, va-radio-option, input[type="radio"]',
    );
    expect(radios.length).to.be.greaterThan(0);
  });

  it('accepts Yes or No as valid answers', () => {
    let utils = renderPage({ isInTechnologyIndustry: true });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
    utils.unmount();
    utils = renderPage({ isInTechnologyIndustry: false });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
  });
});
