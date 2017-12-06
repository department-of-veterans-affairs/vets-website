import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import Timeline from '../../../../src/js/claims-status/components/appeals-v2/Timeline';

import { getEventContent } from '../../../../src/js/claims-status/utils/appeals-v2-helpers';

describe('<Timeline/>', () => {
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

  it('should render', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    expect(component.type()).to.equal('div');
  });

  it('should render an expander', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    const expander = wrapper.find('Expander');
    expect(expander.type()).to.equal('li');
  });

  it('should not render past events by default', () => {

  });

  it('should render past events when state toggled', () => {

  });

  it('should hide past events when state is toggled', () => {

  });

  it('should always render the current event', () => {

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
    mountedWrapper = mount(<Timeline {...defaultProps}/>, { attachTo: wrapper });
    mountedWrapper.find('.section-unexpanded button').simulate('click');
    expect(mountedWrapper.find('.appeal-event-date').first().text()).to.equal('on May 1, 2016');
  });

  it('should render content for an event based on the type', () => {
    mountedWrapper = mount(<Timeline {...defaultProps}/>, { attachTo: wrapper });
    mountedWrapper.find('.section-unexpanded button').simulate('click');
    const firstEvent = mountedWrapper.find('li').first();
    const eventContent = getEventContent(defaultProps.events[0]);

    expect(firstEvent.find('h3').text()).to.equal(eventContent.title);
    expect(firstEvent.find('p').text()).to.equal(eventContent.description);
  });
});
