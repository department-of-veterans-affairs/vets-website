import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { mockData } from '../../../../src/js/claims-status/utils/helpers';
import AppealsV2StatusPage from '../../../../src/js/claims-status/containers/AppealsV2StatusPage';

// TODO: Test the conditional logic for showing the docket

describe('<AppealsV2StatusPage/>', () => {
  const defaultProps = { appeal: mockData.data[0] };

  it('should render', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should render an unexpanded <Timeline/>', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps}/>);
    const timeline = wrapper.find('Timeline').dive();
    const expander = timeline.find('Expander');
    const pastEvents = timeline.find('PastEvent');
    expect(expander.length).to.equal(1);
    expect(pastEvents.length).to.equal(0);
  });

  it('should pass down events as props to Timeline', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps}/>);
    const pastEvents = wrapper.find('Timeline').props().events;
    expect(pastEvents).to.equal(defaultProps.appeal.attributes.events);
  });

  it('should render a <CurrentStatus/> with title and description', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps}/>);
    const statusProps = wrapper.find('CurrentStatus').props();
    // Testing against a specific string would require duplicating component
    // and util code so here we're just testing that both props exist
    expect(statusProps.title).to.exist;
    expect(statusProps.description).to.exist;
  });

  it('should render an <AlertsList/> with alerts', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps}/>);
    const alertsList = wrapper.find('AlertsList');
    const alertsProps = alertsList.props();
    expect(alertsList.length).to.equal(1);
    expect(alertsProps.alerts.length).to.equal(defaultProps.appeal.attributes.alerts.length);
  });

  it('should render a <WhatsNext/> with nextEvents', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps}/>);
    const whatsNext = wrapper.find('WhatsNext');
    const whatsNextProps = whatsNext.props();
    expect(whatsNext.length).to.equal(1);
    // Testing against a specific string would require duplicating component
    // and util code so here we're just testing that the nextEvents prop exists
    expect(whatsNextProps.nextEvents).to.exist;
  });

  it('should render a <Docket/>', () => {
    // There's currently no docket, leave as placeholder
  });
});
