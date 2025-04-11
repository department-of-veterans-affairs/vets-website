import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import EmailReviewField from '../../components/EmailReviewField';

describe('EmailReviewField component', () => {
  it('renders the EmailReviewField footer', () => {
    const wrapper = mount(
      <EmailReviewField>
        <div />
      </EmailReviewField>,
    );
    expect(wrapper.text()).to.include('test');

    wrapper.unmount();
  });
});
