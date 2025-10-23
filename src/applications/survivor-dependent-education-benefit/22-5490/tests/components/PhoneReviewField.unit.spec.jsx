import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PhoneReviewField from '../../components/PhoneReviewField';

describe('PhoneReviewField component', () => {
  it('renders the PhoneReviewField footer', () => {
    const formData = {
      phone: '3333333333',
    };
    const uiSchema = {
      phone: {
        'ui:title': 'Review Phone',
      },
    };
    const wrapper = mount(
      <PhoneReviewField uiSchema={uiSchema} formData={formData} />,
    );
    expect(wrapper.text()).to.include('3333333333');
    expect(wrapper.text()).to.include('Review Phone');

    wrapper.unmount();
  });
});
