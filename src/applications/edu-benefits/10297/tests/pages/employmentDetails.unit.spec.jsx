import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import sinon from 'sinon';

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

describe('Background Information Step 4 - Page 2', () => {
  it('renders the technology industry question', () => {
    const { getByText, container } = renderPage();
    expect(getByText('Do you currently work in the technology industry?')).to
      .exist;
    const radios = container.querySelectorAll(
      'va-radio, va-radio-option, input[type="radio"]',
    );
    expect(radios.length).to.be.greaterThan(0);
  });

  it('shows a validation error when not answered', () => {
    const { getByRole, container } = renderPage();
    fireEvent.click(getByRole('button', { name: /submit|continue/i }));
    const errNode = container.querySelector('[error]');
    expect(errNode).to.exist;
  });

  it('accepts Yes or No as valid answers', () => {
    let utils = renderPage({ isInTechnologyIndustry: true });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
    utils.unmount();
    utils = renderPage({ isInTechnologyIndustry: false });
    expect(utils.container.querySelectorAll('[error]')).to.have.length(0);
  });

  it('navigates to the correct page based on technology industry involvement', () => {
    const {
      onNavForward,
    } = require('../../config/form').default.chapters.backgroundInformationChapter.pages.employmentDetails;
    const goPath = sinon.spy();
    onNavForward({ formData: { isInTechnologyIndustry: false }, goPath });
    expect(goPath.calledWith('/salary-details')).to.be.true;
    goPath.resetHistory();
    onNavForward({ formData: { isInTechnologyIndustry: true }, goPath });
    expect(goPath.calledWith('/employment-focus')).to.be.true;
  });
});
