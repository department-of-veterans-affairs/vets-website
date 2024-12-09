import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PercentageCalc from '../../components/PercentageCalc';
import formConfig from '../../config/form';

const middleware = [thunk];
const mockStore = configureStore(middleware);
const getData = () => ({
  form: {
    data: {
      studentRatioCalcChapter: {
        numOfStudent: '50',
        beneficiaryStudent: '50',
      },
    },
  },
});
describe('<PercentageCalc />', () => {
  it('should display the correct percentage when valid data is provided', () => {
    const {
      studentRatioCalc,
    } = formConfig.chapters.studentRatioCalcChapter.pages;
    const definitions = formConfig.defaultDefinitions;
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <DefinitionTester
          schema={studentRatioCalc.schema}
          uiSchema={studentRatioCalc.uiSchema}
          definitions={definitions}
          data={{}}
        />
      </Provider>,
    );
    expect(wrapper.find('form')).to.exist;
    expect(
      wrapper
        .find('span')
        .first()
        .text(),
    ).to.equal('100.0%');
    wrapper.unmount();
  });

  it('should display "---" when data is invalid', () => {
    const formData = {
      studentRatioCalcChapter: {
        numOfStudent: '-1',
        beneficiaryStudent: '-1',
      },
    };
    const wrapper = mount(
      <Provider store={uploadStore}>
        <PercentageCalc formData={formData} />
      </Provider>,
    );
    expect(
      wrapper
        .find('span')
        .first()
        .text(),
    ).to.equal('---');
    wrapper.unmount();
  });
});
