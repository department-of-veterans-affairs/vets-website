import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';

import BankInfoForm from '~/applications/personalization/profile/components/direct-deposit/legacy/BankInfoForm';

describe('<BankInfoForm/>', () => {
  let wrapper;
  let schemaForm;

  const formSubmitSpy = sinon.spy();
  const formChangeSpy = sinon.spy();
  const defaultProps = {
    formChange: formChangeSpy,
    formData: { name: 'Pat' },
    formSubmit: formSubmitSpy,
  };

  beforeEach(() => {
    wrapper = mount(
      <BankInfoForm {...defaultProps}>
        <button>Save</button>
      </BankInfoForm>,
    );
    schemaForm = wrapper.find('SchemaForm');
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render a SchemaForm', () => {
    expect(schemaForm.exists()).to.be.true;
  });
  it('should pass the formData prop to the SchemaForm', () => {
    expect(schemaForm.props().data).to.equal(defaultProps.formData);
  });
  it('should pass the formSubmit prop to the SchemaForm', () => {
    expect(schemaForm.props().onSubmit).to.equal(defaultProps.formSubmit);
  });
  it('should pass the formChange prop to the SchemaForm', () => {
    expect(schemaForm.props().onChange).to.equal(defaultProps.formChange);
  });
  it('should render the passed in children', () => {
    const schemaFormChildren = schemaForm.find('button');
    expect(schemaFormChildren.exists()).to.be.true;
  });
});
