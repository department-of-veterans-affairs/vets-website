import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import sinon from 'sinon';

import * as employmentStatus from '../../pages/employmentStatus';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={employmentStatus.schema}
      uiSchema={employmentStatus.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('Background Information Step 4 - Page 1', () => {
  it('renders the employment question', () => {
    const { getByText, container } = renderPage();
    expect(getByText('Are you currently employed?')).to.exist;
    const radios = container.querySelectorAll(
      'va-radio, va-radio-option, input[type="radio"]',
    );
    expect(radios.length).to.be.greaterThan(2);
  });

  it('navigates to the correct page based on employment status', () => {
    const {
      onNavForward,
    } = require('../../config/form').default.chapters.backgroundInformationChapter.pages.employmentStatus;
    const goPath = sinon.spy();
    onNavForward({ formData: { isEmployed: false }, goPath });
    expect(goPath.calledWith('/education-details')).to.be.true;
    goPath.resetHistory();
    onNavForward({ formData: { isEmployed: true }, goPath });
    expect(goPath.calledWith('/employment-details')).to.be.true;
  });
});
