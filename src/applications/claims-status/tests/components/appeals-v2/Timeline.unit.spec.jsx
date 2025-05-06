import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Timeline from '../../../components/appeals-v2/Timeline';
import { getEventContent, formatDate } from '../../../utils/appeals-v2-helpers';

describe('<Timeline/>', () => {
  const defaultProps = {
    events: [
      { type: 'claim_decision', date: '2016-05-30', details: {} },
      { type: 'nod', date: '2016-06-10', details: {} },
    ],
    missingEvents: false,
  };

  const formattedDateRange = 'May 30, 2016 – June 10, 2016';

  /** Helper to expand the list inside a shallow wrapper */
  const expand = wrapper => {
    const clickEvent = { stopPropagation() {} };
    wrapper.find('Expander').prop('onToggle')(clickEvent);
    wrapper.update(); // tell Enzyme to re-render
  };

  it('should render', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render one Expander when events present', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    expect(wrapper.find('Expander')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should not render any PastEvent items by default', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    expect(wrapper.find('PastEvent').exists()).to.be.false;
    wrapper.unmount();
  });

  it('should toggle “expanded” via onToggle callback', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    const expander = () => wrapper.find('Expander');

    // collapsed first
    expect(expander().prop('expanded')).to.be.false;

    // expand
    expand(wrapper);
    expect(expander().prop('expanded')).to.be.true;

    // collapse
    expand(wrapper);
    expect(expander().prop('expanded')).to.be.false;
    wrapper.unmount();
  });

  it('should render PastEvent items when expanded', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    expect(wrapper.find('PastEvent')).to.have.lengthOf(0);

    expand(wrapper);
    expect(wrapper.find('PastEvent')).to.have.lengthOf(
      defaultProps.events.length,
    );
    wrapper.unmount();
  });

  it('should render nothing for past events if event list is empty', () => {
    const wrapper = shallow(<Timeline {...defaultProps} events={[]} />);
    expand(wrapper);
    expect(wrapper.find('PastEvent')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should pass formatted dateRange to Expander', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    expect(wrapper.find('Expander').prop('dateRange')).to.equal(
      formattedDateRange,
    );
    wrapper.unmount();
  });

  it('should pass empty dateRange when no events', () => {
    const wrapper = shallow(<Timeline {...defaultProps} events={[]} />);
    expect(wrapper.find('Expander').prop('dateRange')).to.equal('');
    wrapper.unmount();
  });

  it('should pass all required props to first PastEvent', () => {
    const { title, description, liClass } = getEventContent(
      defaultProps.events[0],
    );
    const date = formatDate(defaultProps.events[0].date);

    const wrapper = shallow(<Timeline {...defaultProps} />);
    expand(wrapper);

    const first = wrapper
      .find('PastEvent')
      .first()
      .props();
    expect(first.title).to.equal(title);
    expect(first.description).to.equal(description);
    expect(first.liClass).to.equal(liClass);
    expect(first.date).to.equal(date);
    wrapper.unmount();
  });

  it('should pass required props to Expander', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    const expanderProps = wrapper.find('Expander').props();

    expect(expanderProps.expanded).to.be.false;
    expect(expanderProps.missingEvents).to.be.false;
    expect(expanderProps.dateRange).to.equal(formattedDateRange);
    expect(expanderProps.onToggle).to.be.a('function');
    wrapper.unmount();
  });

  it('should update Expander.expanded after toggle', () => {
    const wrapper = shallow(<Timeline {...defaultProps} />);
    expand(wrapper);
    expect(wrapper.find('Expander').prop('expanded')).to.be.true;
    wrapper.unmount();
  });

  it('should filter out unknown events', () => {
    const props = {
      events: [
        { type: 'unknown_type', date: '2016-05-30', details: {} },
        { type: 'nod', date: '2016-06-10', details: {} },
      ],
      missingEvents: false,
    };
    const wrapper = shallow(<Timeline {...props} />);
    expand(wrapper);
    expect(wrapper.find('PastEvent')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
