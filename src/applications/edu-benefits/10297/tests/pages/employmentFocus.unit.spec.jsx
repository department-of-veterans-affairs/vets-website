import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import * as employmentFocus from '../../pages/employmentFocus';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={employmentFocus.schema}
      uiSchema={employmentFocus.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('Background Information Step 4 - Page 3, Employment Focus', () => {
  it('renders the technology area of focus question', () => {
    const { container } = renderPage();
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'What’s your main area of focus in the technology industry?',
    );
    const radios = container.querySelectorAll(
      'va-radio, va-radio-option, input[type="radio"]',
    );
    expect(radios.length).to.be.greaterThan(0);
  });

  it('accepts a valid area of focus', () => {
    let utils = renderPage({ technologyAreaOfFocus: 'computerProgramming' });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
    utils.unmount();
    utils = renderPage({ technologyAreaOfFocus: 'somethingElse' });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
  });
});
