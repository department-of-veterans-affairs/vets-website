import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import sinon from 'sinon';

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

  it('navigates back to the correct page based on technology industry status', () => {
    const {
      onNavBack,
    } = require('../../config/form').default.chapters.backgroundInformationChapter.pages.salaryDetails;
    const goPath = sinon.spy();
    const goPreviousPath = sinon.spy();
    onNavBack({
      formData: { isInTechnologyIndustry: false },
      goPath,
      goPreviousPath,
    });
    expect(goPath.calledWith('/employment-details')).to.be.true;
    expect(goPreviousPath.called).to.be.false;
    goPath.reset();
    goPreviousPath.reset();
    onNavBack({
      formData: { isInTechnologyIndustry: true },
      goPath,
      goPreviousPath,
    });
    expect(goPath.called).to.be.false;
    expect(goPreviousPath.called).to.be.true;
  });
});
