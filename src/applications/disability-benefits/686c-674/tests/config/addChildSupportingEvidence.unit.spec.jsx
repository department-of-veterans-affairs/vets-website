import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 upload additional evidence for child', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.childAdditionalEvidence;

  const formData = {
    'view:selectable686Options': {
      addChild: true,
    },
    childrenToAdd: [
      {
        childStatus: {
          stepChild: true,
        },
      },
    ],
  };
  it('should render', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ formData }}
        />
      </Provider>,
    );
    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ formData }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit a valid form', () => {
    const onSubmit = sinon.spy();
    const fileData = {
      ...formData,
      ...{
        files: [
          { confirmationCode: 'testing' },
          { confirmationCode: 'testing2' },
        ],
      },
    };
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ fileData }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
