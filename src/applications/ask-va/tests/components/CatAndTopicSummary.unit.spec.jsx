import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import CatAndTopicSummary from '../../components/CatAndTopicSummary';

describe('CatAndTopicSummary Component', () => {
  it('should render the category and topic when both are provided', () => {
    const category = 'Health';
    const topic = 'Benefits';
    const wrapper = mount(
      <CatAndTopicSummary category={category} topic={topic} />,
    );

    expect(wrapper.find('dt').text()).to.equal('Your category and topic');
    expect(
      wrapper
        .find('dd')
        .at(0)
        .text(),
    ).to.equal('Category: Health');
    expect(
      wrapper
        .find('dd')
        .at(1)
        .text(),
    ).to.equal('Topic: Benefits');

    wrapper.unmount();
  });

  it('should render only the category when topic is not provided', () => {
    const category = 'Education';
    const wrapper = mount(<CatAndTopicSummary category={category} />);

    expect(
      wrapper
        .find('dd')
        .at(0)
        .text(),
    ).to.equal('Category: Education');
    expect(wrapper.find('dd').length).to.equal(1);

    wrapper.unmount();
  });
});
