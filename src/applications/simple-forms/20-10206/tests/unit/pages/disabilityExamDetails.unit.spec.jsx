import React from 'react';

import { expect } from 'chai';
import { render } from 'enzyme';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.disabilityExamDetailsChapter.pages.disabilityExamDetailsPage;

const pageTitle = 'Disability exam details';

const expectedNumberOfFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

describe('ui:reviewField', () => {
  it('renders the date correctly when formData is present', () => {
    const ReviewField =
      uiSchema.disabilityExams.items.disabilityExamDate['ui:reviewField'];
    const wrapper = render(
      <ReviewField>
        <div formData="2022-01-01" />
      </ReviewField>,
    );

    expect(wrapper.find('dt').text()).to.equal('When was your exam?');
    expect(wrapper.find('dd').text()).to.equal('January 1, 2022');
  });

  it('renders nothing when formData is not present', () => {
    const ReviewField =
      uiSchema.disabilityExams.items.disabilityExamDate['ui:reviewField'];
    const wrapper = render(
      <ReviewField>
        <div formData={null} />
      </ReviewField>,
    );

    expect(wrapper.find('dt').text()).to.equal('When was your exam?');
    expect(wrapper.find('dd').text()).to.be.empty;
  });
});
