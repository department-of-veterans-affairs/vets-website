import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Issues from '../../../components/appeals-v2/Issues';
import { addStatusToIssues } from '../../../utils/appeals-v2-helpers';
import { mockData } from '../../../utils/helpers';
import _ from 'lodash/fp';

describe('<Issues/>', () => {
  const emptyIssues = { issues: addStatusToIssues([]), isAppeal: true };
  const oneOpenIssue = {
    issues: addStatusToIssues(mockData.data[1].attributes.issues),
    isAppeal: true,
  };
  const oneClosedIssue = {
    issues: addStatusToIssues([mockData.data[2].attributes.issues[3]]),
    isAppeal: true,
  };
  const manyIssues = {
    issues: addStatusToIssues(mockData.data[2].attributes.issues),
    isAppeal: true,
  };

  it('should render', () => {
    const wrapper = shallow(<Issues {...emptyIssues} />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should render no panels when no issues passed in', () => {
    // Note: this probably isn't possible in real-world usage
    const wrapper = shallow(<Issues {...emptyIssues} />);
    expect(wrapper.find('CollapsiblePanel').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render one panel when only an open issue is passed in', () => {
    const wrapper = shallow(<Issues {...oneOpenIssue} />);
    const openPanelButton = wrapper
      .find('CollapsiblePanel')
      .dive()
      .find('button');
    const panelName = openPanelButton.render().text();
    expect(panelName).to.equal('Currently on appeal');
    wrapper.unmount();
  });

  it('should render one panel when only a closed issue is passed in', () => {
    const wrapper = shallow(<Issues {...oneClosedIssue} />);
    const closedPanelButton = wrapper
      .find('CollapsiblePanel')
      .dive()
      .find('button');
    const panelName = closedPanelButton.render().text();
    expect(panelName).to.equal('Closed');
    wrapper.unmount();
  });

  it('should render two panels when both open *AND* closed issues are passed in', () => {
    const wrapper = shallow(<Issues {...manyIssues} />);
    expect(wrapper.find('CollapsiblePanel').length).to.equal(2);
    wrapper.unmount();
  });

  it('should render a list of open items when open items exist', () => {
    const props = {
      issues: [{ status: 'open', description: 'test open issue' }],
      isAppeal: true,
    };
    const wrapper = mount(<Issues {...props} />);
    const panelButton = wrapper.find('.usa-accordion-button');
    expect(panelButton.html()).to.contain('Currently on appeal');
    // no need to click, panel should be auto-expanded
    // open items are in the first ul within the first accordion's content
    const openContentList = wrapper.find('.usa-accordion-content > ul');
    expect(openContentList.find('li').length).to.equal(props.issues.length);
    wrapper.unmount();
  });

  it('should render a list of closed items when items exist', () => {
    const props = {
      issues: [{ status: 'granted', description: 'test closed issue' }],
    };
    const wrapper = mount(<Issues {...props} />);
    const panelButton = wrapper.find('.usa-accordion-button');
    expect(panelButton.html()).to.contain('Closed');
    // no need to click, panel should be auto-expanded
    // closed items are in accordion > div > ul > li
    const remandDiv = wrapper.find('.usa-accordion-content > div');
    expect(remandDiv.find('ul > li').length).to.equal(props.issues.length);
    wrapper.unmount();
  });

  it('should pass auto-expand prop to active panel when both active and closed panels present', () => {
    const wrapper = shallow(<Issues {...manyIssues} />);
    const activePanelProps = wrapper
      .find('CollapsiblePanel')
      .first()
      .props();
    expect(activePanelProps.panelName).to.equal('Currently on appeal');
    expect(activePanelProps.startOpen).to.be.true;
    wrapper.unmount();
  });

  it('should pass auto-expand prop to active panel when only active panel present', () => {
    const wrapper = shallow(<Issues {...oneOpenIssue} />);
    const activePanelProps = wrapper.find('CollapsiblePanel').props();
    expect(activePanelProps.panelName).to.equal('Currently on appeal');
    expect(activePanelProps.startOpen).to.be.true;
    wrapper.unmount();
  });

  it('should pass auto-expand prop to closed panel when no active panel present', () => {
    const wrapper = shallow(<Issues {...oneClosedIssue} />);
    const closedPanelProps = wrapper
      .find('CollapsiblePanel')
      .first()
      .props();
    expect(closedPanelProps.panelName).to.equal('Closed');
    expect(closedPanelProps.startOpen).to.be.true;
    wrapper.unmount();
  });

  it('should not pass auto-expand prop to closed panel when active panel present', () => {
    const wrapper = shallow(<Issues {...manyIssues} />);
    const closedPanelProps = wrapper
      .find('CollapsiblePanel')
      .at(1)
      .props();
    expect(closedPanelProps.panelName).to.equal('Closed');
    expect(closedPanelProps.startOpen).to.be.false;
    wrapper.unmount();
  });

  it('should use the word "review" if a Supplemental Claim or Higher-Level Review', () => {
    const props = _.set('isAppeal', false, oneOpenIssue);
    const wrapper = shallow(<Issues {...props} />);
    const activePanelProps = wrapper.find('CollapsiblePanel').props();
    expect(activePanelProps.panelName).to.equal('Currently on review');
    wrapper.unmount();
  });
});
