import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import createCommonStore from 'platform/startup/store';
import VeteranInformationComponent from '../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent.js';
import formConfig from '../../config/form.js';

const defaultStore = createCommonStore();

describe('<VeteranInformationComponent />', () => {
  it('Should Render', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <VeteranInformationComponent />
      </Provider>,
    );

    expect(wrapper.find('div.usa-alert-info')).to.exist;
    wrapper.unmount();
  });
});

describe('686 veteran information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranInformation;

  const formData = {
    'view:selectable686Options': {
      addSpouse: false,
    },
  };

  it('should render', () => {
    const form = mount(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={formData}
        />
      </Provider>,
    );
    expect(form.find('.usa-alert-info').length).to.equal(1);
    form.unmount();
  });

  it('should submit', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
