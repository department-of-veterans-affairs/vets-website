import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import sinon from 'sinon';

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

  it('should hide other text input when highest level of education is not something else', () => {
    const formData = {
      highestLevelOfEducation: 'HS',
    };
    const result = educationDetails.uiSchema.otherLevel['ui:options'].hideIf(
      formData,
    );
    expect(result).to.be.true;
  });

  it('should not hide other text input when highest level of education is something else', () => {
    const formData = {
      highestLevelOfEducation: 'NA',
    };
    const result = educationDetails.uiSchema.otherLevel['ui:options'].hideIf(
      formData,
    );
    expect(result).to.be.false;
  });

  it('navigates back to the correct page based on employment status', () => {
    const {
      onNavBack,
    } = require('../../config/form').default.chapters.backgroundInformationChapter.pages.educationDetails;
    const goPath = sinon.spy();
    const goPreviousPath = sinon.spy();
    onNavBack({ formData: { isEmployed: false }, goPath, goPreviousPath });
    expect(goPath.calledWith('/employment-status')).to.be.true;
    goPath.reset();
    goPreviousPath.reset();
    onNavBack({ formData: { isEmployed: true }, goPath, goPreviousPath });
    expect(goPath.called).to.be.false;
    expect(goPreviousPath.called).to.be.true;
  });
});
