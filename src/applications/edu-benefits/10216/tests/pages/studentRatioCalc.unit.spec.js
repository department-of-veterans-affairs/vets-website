import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('Student Ratio Calculation', () => {
  const {
    studentRatioCalc,
  } = formConfig.chapters.studentRatioCalcChapter.pages;
  it('should have the correct uiSchema and schema for studentRatioCalc', () => {
    expect(studentRatioCalc.uiSchema).to.be.an('object');
    expect(studentRatioCalc.schema).to.be.an('object');
  });
  it('should render', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={studentRatioCalc.schema}
          uiSchema={studentRatioCalc.uiSchema}
          definitions={definitions}
          data={{}}
        />
      </Provider>,
    );
    expect(form.find('va-text-input').length).to.equal(2);
    form.unmount();
  });
  it('should render error message when required field is empty', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={studentRatioCalc.schema}
          uiSchema={studentRatioCalc.uiSchema}
          definitions={definitions}
          data={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('va-text-input[error]').length).to.equal(2);
    form.unmount();
  });
  it('should navigate to additional form if not accredited', async () => {
    const goPath = sinon.spy();
    const formData = {
      facilityCode: '45769814',
      institutionName: 'test',
      startDate: '2024-01-01',
    };
    await studentRatioCalc.onNavBack({ formData, goPath });
    expect(goPath.calledWith('/additional-form')).to.be.true;
  });
});
