import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import YesNoReviewField from '../../components/YesNoReviewField';

describe('YesNoReviewField component', () => {
  it('renders the YesNoReviewField footer', () => {
    const uiSchema = {
      'ui:title': 'test title',
    };
    const wrapper = mount(
      <YesNoReviewField uiSchema={uiSchema}>
        <div formData="yes" />
      </YesNoReviewField>,
    );
    expect(wrapper.text()).to.include('test title');

    wrapper.unmount();
  });
});
