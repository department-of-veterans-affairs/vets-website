import React from 'react';
import { shallow, mount } from 'enzyme';
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
  // We get a warning to not attach the DOM directly to document.body, so create a wrapper element
  // Note: Be sure to .detach() the DOM from the wrapper when the test is finished!
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);

  // window.scrollTo isn't implemented, so just stub it out to avoid the warning
  const oldScrollTo = window.scrollTo;

  before(() => {
    window.scrollTo = () => {};
  });

  after(() => {
    window.scrollTo = oldScrollTo;
  });

  // Use this if you have to attach the DOM to an element
  let mountedWrapper;

  afterEach(() => {
    // If it's been used, cleanup the mess.
    // This is out here in case a test fails and the .detach() call at the end of the test
    //  doesn't get run.
    if (typeof mountedWrapper !== 'undefined' && mountedWrapper.unmount) {
      mountedWrapper.detach();
      mountedWrapper.unmount();
    }
  });

  it('should render', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    expect(component.type()).to.equal('div');
  });

  it('should expand and collapse past history events', () => {
    mountedWrapper = mount(<Timeline {...defaultProps}/>, { attachTo: wrapper });
    const expander = mountedWrapper.find('.section-unexpanded button');
    expect(expander.exists()).to.be.true;

    expander.simulate('click');

    const collapser = mountedWrapper.find('.section-expanded button');
    expect(collapser.exists()).to.be.true;

    collapser.simulate('click');

    expect(mountedWrapper.find('.section-unexpanded button').exists()).to.be.true;
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
