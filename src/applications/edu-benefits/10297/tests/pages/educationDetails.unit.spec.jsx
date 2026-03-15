import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import * as educationDetails from '../../pages/educationDetails';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={educationDetails.schema}
      uiSchema={educationDetails.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('Background Information Step 4 - Page 5, Education Details', () => {
  it('renders the education level question', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'What’s the highest level of education you’ve completed?',
    );
    const radios = container.querySelectorAll(
      'va-radio, va-radio-option, input[type="radio"]',
    );
    expect(radios.length).to.be.greaterThan(0);
  });

  it('accepts a valid education level', () => {
    let utils = renderPage({ highestLevelOfEducation: 'HS' });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
    utils.unmount();
    utils = renderPage({ highestLevelOfEducation: 'MD' });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
  });
});
