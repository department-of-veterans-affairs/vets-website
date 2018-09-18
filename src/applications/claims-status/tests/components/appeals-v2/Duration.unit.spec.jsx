import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DurationCard from '../../../components/appeals-v2/DurationCard';

describe('<DurationCard/>', () => {
  const defaultProps = {
    durationText: '1-2 Months',
    cardDescription: 'Hey There, this is some text',
  };

  test('should render', () => {
    const wrapper = shallow(<DurationCard {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  test('should not render if no duration text passed in', () => {
    const wrapper = shallow(<DurationCard/>);
    expect(wrapper.type()).to.equal(null);
  });

  test('should render a passed in durationText string', () => {
    const wrapper = shallow(<DurationCard {...defaultProps}/>);
    const renderedDuration = wrapper.find('.number').render().text();
    expect(renderedDuration).to.equal(defaultProps.durationText);
  });

  test('should render a passed in cardDescription string', () => {
    const wrapper = shallow(<DurationCard {...defaultProps}/>);
    const renderedDescription = wrapper.find('.description').render().text();
    expect(renderedDescription).to.contain(defaultProps.cardDescription);
  });
});
