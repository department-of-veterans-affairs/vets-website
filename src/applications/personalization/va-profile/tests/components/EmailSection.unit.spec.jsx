import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

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
    expect(wrapper.text()).to.contain('Email Address');
  });
});
