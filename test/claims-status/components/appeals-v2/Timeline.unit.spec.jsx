import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Timeline from '../../../../src/js/claims-status/components/appeals-v2/Timeline';

import { getEventContent, formatDate } from '../../../../src/js/claims-status/utils/appeals-v2-helpers';

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
  };

  const formattedDateRange = 'May 30, 2016 - June 10, 2016';

  it('should render', () => {
    const component = shallow(<Timeline {...defaultProps}/>);
    expect(component.exists()).to.be.true;
  });

  it('should render one expander item if events present', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    const expander = wrapper.find('Expander');
    expect(expander.length).to.equal(1);
  });

  it('should not render any past events by default', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    const pastEvents = wrapper.find('PastEvent');
    expect(pastEvents.exists()).to.be.false;
  });

  it('should toggle expanded state when toggleExpanded called', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    expect(wrapper.state('expanded')).to.equal(false);
    wrapper.instance().toggleExpanded();
    expect(wrapper.state('expanded')).to.equal(true);
    wrapper.instance().toggleExpanded();
    expect(wrapper.state('expanded')).to.equal(false);
  });

  it('should render past events when expanded state is true', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    expect(wrapper.find('PastEvent').length).to.equal(0);
    // wrapper's instance.toggleExpanded() method doesn't cause a re-render
    // in enzyme, so need to setState directly (which explicitly does re-render)
    wrapper.setState({ expanded: true });
    expect(wrapper.find('PastEvent').length).to.equal(defaultProps.events.length);
  });

  it('should render nothing for past events if no events in list', () => {
    const props = { ...defaultProps, events: [] };
    const wrapper = shallow(<Timeline {...props}/>);
    expect(wrapper.find('PastEvent').length).to.equal(0);
    wrapper.setState({ expanded: true });
    expect(wrapper.find('PastEvent').length).to.equal(0);
  });

  it('should pass formatted date range to the Expander', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    const expander = wrapper.find('Expander');
    const { dateRange } = expander.props();
    expect(dateRange).to.equal(formattedDateRange);
  });

  it('should pass empty string as dateRange to Expander when no events', () => {
    const props = { ...defaultProps, events: [] };
    const wrapper = shallow(<Timeline {...props}/>);
    const expander = wrapper.find('Expander');
    const { dateRange } = expander.props();
    expect(dateRange).to.equal('');
  });

  it('should pass all required props to PastEvents', () => {
    const { title, description, liClass } = getEventContent(defaultProps.events[0]);
    const date = formatDate(defaultProps.events[0].date);
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    wrapper.setState({ expanded: true });
    const firstProps = wrapper.find('PastEvent').first().props();
    expect(firstProps.title).to.equal(title);
    expect(firstProps.description).to.equal(description);
    expect(firstProps.liClass).to.equal(liClass);
    expect(firstProps.date).to.equal(date);
  });

  it('should pass all required props to Expander', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    const expanderProps = wrapper.find('Expander').props();
    expect(expanderProps.title).to.equal('See past events');
    expect(expanderProps.dateRange).to.equal(formattedDateRange);
    expect(expanderProps.onToggle).to.equal(wrapper.instance().toggleExpanded);
    expect(expanderProps.cssClass).to.equal('section-unexpanded');
  });

  it('should pass updated props to Expander when state toggled', () => {
    const wrapper = shallow(<Timeline {...defaultProps}/>);
    wrapper.setState({ expanded: true });
    const expanderProps = wrapper.find('Expander').props();
    expect(expanderProps.title).to.equal('Hide past events');
    expect(expanderProps.cssClass).to.equal('section-expanded');
  });
});
