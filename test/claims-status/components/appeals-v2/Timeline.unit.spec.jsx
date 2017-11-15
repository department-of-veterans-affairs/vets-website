import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Timeline from '../../../../src/js/claims-status/components/appeals-v2/Timeline';

import { getEventContent } from '../../../../src/js/claims-status/utils/appeals-v2-helpers';

const defaultProps = {
  events: [
    {
      type: 'claim',
      date: '2016-05-30',
      details: {}
    },
    {
      type: 'nod',
      date: '2016-06-10',
      details: {}
    }
  ],
  currentStatus: {
    title: 'Current Status Title',
    description: 'Status description here'
  }
};

describe('<Timeline/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    expect(wrapper.type()).to.equal('ol');
  });

  it('should expand and collapse past history events', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    const expander = component.find('.section-unexpanded button');
    expect(expander.exists()).to.be.true;

    expander.simulate('click');

    const collapser = component.find('.section-expanded button');
    expect(collapser.exists()).to.be.true;

    collapser.simulate('click');

    expect(component.find('.section-unexpanded button').exists()).to.be.true;
  });

  it('should render CurrentStatus', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    expect(component.find('CurrentStatus').exists()).to.be.true;
  });

  it('should render the date range in the history expander', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    expect(component.find('.appeal-event-date').text()).to.equal('May 1, 2016 - June 5, 2016');
  });

  it('should render the date for a past event', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    component.find('.section-unexpanded button').simulate('click');
    expect(component.find('.appeal-event-date').first().text()).to.equal('on May 1, 2016');
  });

  it('should render content for an event based on the type', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    component.find('.section-unexpanded button').simulate('click');
    const firstEvent = component.find('li').first();
    const eventContent = getEventContent(defaultProps.events[0]);

    expect(firstEvent.find('h3').text()).to.equal(eventContent.title);
    expect(firstEvent.find('p').text()).to.equal(eventContent.description);
  });
});
