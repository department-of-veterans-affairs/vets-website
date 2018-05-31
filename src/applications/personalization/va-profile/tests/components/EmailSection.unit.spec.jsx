import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import EmailSection from '../../components/EmailSection';

describe('<EmailSection/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      emailResponseData: { email: 'test@test.com' },
      field: {},
      error: null,
      isEditing: false,
      isLoading: false,
      clearErrors() {},
      onChange() {},
      onEdit() {},
      onAdd() {},
      onCancel() {},
      onSubmit() {}
    };
  });

  it('should render', () => {
    const wrapper = enzyme.shallow(<EmailSection {...props}/>);
    expect(wrapper.text()).to.contain(props.emailResponseData.email);
  });

  it('should render an error', () => {
    props.emailResponseData.error = { message: 'Some error' };
    const wrapper = enzyme.shallow(<EmailSection {...props}/>);
    expect(wrapper.text()).to.contain('We’re sorry');
  });

  it('should render a submittable form when the isEditing flag is set to true', () => {
    props.onSubmit = sinon.stub();
    props.isEditing = true;
    props.field.value = {
      email: 'new_email@test.com'
    };

    let wrapper = enzyme.shallow(<EmailSection {...props}/>);
    expect(wrapper.find('EditEmailModal')).to.have.lengthOf(1);

    wrapper = wrapper.find('EditEmailModal').dive();

    const event = { preventDefault: sinon.spy() };
    wrapper.find('form').simulate('submit', event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(props.onSubmit.calledOnce).to.be.true;
    expect(props.onSubmit.calledWith(props.field.value)).to.be.true;
  });
});
