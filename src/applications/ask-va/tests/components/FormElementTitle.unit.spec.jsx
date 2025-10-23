import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import FormElementTitle from '../../components/FormElementTitle';

describe('FormElementTitle Component', () => {
  it('should render the title', () => {
    const testTitle = 'Test Form Title';
    const wrapper = mount(<FormElementTitle title={testTitle} />);

    expect(wrapper.text()).to.equal(testTitle);

    wrapper.unmount();
  });

  it('should render an empty h3 tag when title is not provided', () => {
    const wrapper = mount(<FormElementTitle />);

    expect(wrapper.find('h3').text()).to.equal('');

    wrapper.unmount();
  });
});
