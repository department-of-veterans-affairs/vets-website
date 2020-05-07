import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';

import BankInfoForm, { schema, uiSchema } from '../../components/BankInfoForm';

describe('<BankInfoForm/>', () => {
  let wrapper;
  let schemaForm;

  const formSubmitSpy = sinon.spy();
  const formChangeSpy = sinon.spy();
  const onCloseSpy = sinon.spy();
  const defaultProps = {
    cancelButtonClasses: ['button-class-1', 'button-class-2'],
    formChange: formChangeSpy,
    formData: { name: 'Pat' },
    formSubmit: formSubmitSpy,
    isSaving: false,
    onClose: onCloseSpy,
  };

  beforeEach(() => {
    wrapper = mount(<BankInfoForm {...defaultProps} />);
    schemaForm = wrapper.find('SchemaForm');
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render a SchemaForm', () => {
    expect(schemaForm.exists()).to.be.true;
  });
  it("should set the SchemaForm's schema  and uiSchema correctly", () => {
    expect(schemaForm.props().schema).to.deep.equal(schema);
    expect(schemaForm.props().uiSchema).to.deep.equal(uiSchema);
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
  it("should pass the onClose prop to the SchemaForm's cancel button", () => {
    const cancelButton = schemaForm.find('button[data-qa="cancel-button"]');
    expect(cancelButton.props().onClick).to.equal(defaultProps.onClose);
  });
  it("should pass the cancelButtonClasses prop to the SchemaForm's cancel button", () => {
    const cancelButton = schemaForm.find('button[data-qa="cancel-button"]');
    expect(cancelButton.props().className).to.equal(
      defaultProps.cancelButtonClasses.join(' '),
    );
  });
  it("should pass the isSaving prop to the SchemaForm's save button", () => {
    const saveButton = schemaForm.find('LoadingButton');
    expect(saveButton.props().isLoading).to.equal(defaultProps.isSaving);
  });
});
