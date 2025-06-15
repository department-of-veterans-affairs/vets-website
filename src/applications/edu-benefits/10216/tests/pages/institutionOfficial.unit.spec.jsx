import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { certifyingOfficial } from '../../pages/institutionOfficial';

const { uiSchema, schema } = certifyingOfficial;

describe('Institution Official Page', () => {
  it('should have the correct uiSchema and schema', () => {
    expect(uiSchema).to.be.an('object');
    expect(schema).to.be.an('object');
  });

  it('should render the form', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
      </Provider>,
    );
    expect(form.find('va-text-input').length).to.equal(3);
    form.unmount();
  });

  it('should render error messages when required fields are empty', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('va-text-input[error]').length).to.equal(3);
    form.unmount();
  });

  it('should not render error messages when required fields are filled', () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={{
            certifyingOfficial: {
              first: 'John',
              last: 'Doe',
              title: 'Director',
            },
          }}
        />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('va-text-input[error]').length).to.equal(0);
    form.unmount();
  });
});
