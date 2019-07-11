import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { mockData } from '../../../utils/helpers';
import { APPEAL_ACTIONS } from '../../../utils/appeals-v2-helpers';
import AppealsV2StatusPage from '../../../containers/AppealsV2StatusPage';

describe('<AppealsV2StatusPage/>', () => {
  const defaultProps = { appeal: mockData.data[0] };
  const onDocketProps = { appeal: mockData.data[1] };
  const supplementalClaimProps = { appeal: mockData.data[3] };
  const higherLevelReviewProps = { appeal: mockData.data[4] };
  const amaAppealProps = { appeal: mockData.data[5] };
  const closedAmaAppealProps = { appeal: mockData.data[6] };

  it('should render', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps} />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should render an unexpanded <Timeline/>', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps} />);
    const timeline = wrapper.find('Timeline').dive();
    const expander = timeline.find('Expander');
    const pastEvents = timeline.find('PastEvent');
    expect(expander.length).to.equal(1);
    expect(pastEvents.length).to.equal(0);
    wrapper.unmount();
  });

  it('should pass down events as props to Timeline', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps} />);
    const pastEvents = wrapper.find('Timeline').props().events;
    expect(pastEvents).to.equal(defaultProps.appeal.attributes.events);
    wrapper.unmount();
  });

  it('should render a <CurrentStatus/> with title and description', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps} />);
    const statusProps = wrapper.find('CurrentStatus').props();
    // Testing against a specific string would require duplicating component
    // and util code so here we're just testing that both props exist
    expect(statusProps.title).to.exist;
    expect(statusProps.description).to.exist;
    wrapper.unmount();
  });

  it('should render an <AlertsList/> with alerts', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps} />);
    const alertsList = wrapper.find('AlertsList');
    const alertsProps = alertsList.props();
    expect(alertsList.length).to.equal(1);
    expect(alertsProps.alerts.length).to.equal(
      defaultProps.appeal.attributes.alerts.length,
    );
    wrapper.unmount();
  });

  it('should render a <WhatsNext/> with nextEvents', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...onDocketProps} />);
    const whatsNext = wrapper.find('WhatsNext');
    const whatsNextProps = whatsNext.props();
    expect(whatsNext.length).to.equal(1);
    // Testing against a specific string would require duplicating component
    // and util code so here we're just testing that the nextEvents prop exists
    expect(whatsNextProps.nextEvents).to.exist;
    wrapper.unmount();
  });

  it('should render a <Docket/> when applicable', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...onDocketProps} />);
    expect(wrapper.find('Docket').length).to.equal(1);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when appeal status is a forbidden type', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const wrapper = shallow(<AppealsV2StatusPage {...defaultProps} />);
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when appeal type is a forbidden type', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const props = {
      ...defaultProps,
      attributes: {
        ...defaultProps.attributes,
        type: APPEAL_ACTIONS.cue,
      },
    };
    const wrapper = shallow(<AppealsV2StatusPage {...props} />);
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when appeal is closed', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const props = {
      ...defaultProps,
      attributes: { ...defaultProps, active: false },
    };
    const wrapper = shallow(<AppealsV2StatusPage {...props} />);
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when appeal is a Supplemental Claim', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const wrapper = shallow(
      <AppealsV2StatusPage {...supplementalClaimProps} />,
    );
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when appeal is a Higher-Level Review', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const wrapper = shallow(
      <AppealsV2StatusPage {...higherLevelReviewProps} />,
    );
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render a <Docket/> when appeal is a Board Appeal', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...amaAppealProps} />);
    expect(wrapper.find('Docket').length).to.equal(1);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when a Board Appeal has left the Board', () => {
    const props = {
      ...closedAmaAppealProps,
      attributes: { ...closedAmaAppealProps, active: true, location: 'aoj' },
    };
    const wrapper = shallow(<AppealsV2StatusPage {...props} />);
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render a <Docket/> when appeal is a closed Board Appeal', () => {
    const wrapper = shallow(<AppealsV2StatusPage {...closedAmaAppealProps} />);
    expect(wrapper.find('Docket').length).to.equal(0);
    wrapper.unmount();
  });
});
