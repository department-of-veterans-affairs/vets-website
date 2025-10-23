import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import FormFooter from '../../components/FormFooter';

describe('FormFooter component', () => {
  it('renders the FormFooter footer', () => {
    const wrapper = mount(<FormFooter />);

    expect(wrapper.text()).to.include(
      'If you need help with your application or have questions about',
    );
    wrapper.unmount();
  });
});
