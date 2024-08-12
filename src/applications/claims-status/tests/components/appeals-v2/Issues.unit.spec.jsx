import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import set from 'platform/utilities/data/set';

import Issues from '../../../components/appeals-v2/Issues';
import { addStatusToIssues } from '../../../utils/appeals-v2-helpers';
import { mockData } from '../../../utils/helpers';

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
    expect(wrapper.find('va-accordion-item').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render one panel when only an open issue is passed in', () => {
    const wrapper = shallow(<Issues {...oneOpenIssue} />);
    const openPanel = wrapper.find('va-accordion-item').find('h3');
    const panelName = openPanel.text();
    expect(panelName).to.equal('Currently on appeal');
    wrapper.unmount();
  });

  it('should render one panel when only a closed issue is passed in', () => {
    const wrapper = shallow(<Issues {...oneClosedIssue} />);
    const closedPanel = wrapper.find('va-accordion-item').find('h3');
    const panelName = closedPanel.text();
    expect(panelName).to.equal('Closed');
    wrapper.unmount();
  });

  it('should render two panels when both open *AND* closed issues are passed in', () => {
    const wrapper = shallow(<Issues {...manyIssues} />);
    expect(wrapper.find('va-accordion-item').length).to.equal(2);
    wrapper.unmount();
  });

  it('should render a list of open items when open items exist', () => {
    const props = {
      issues: [{ status: 'open', description: 'test open issue' }],
      isAppeal: true,
    };
    const wrapper = mount(<Issues {...props} />);
    const panel = wrapper.find('va-accordion-item');
    expect(panel.find('h3').text()).to.contain('Currently on appeal');
    // no need to click, panel should be auto-expanded
    // open items are in the first ul within the first accordion's content
    const openContentList = panel.find('ul');
    expect(openContentList.find('li').length).to.equal(props.issues.length);
    wrapper.unmount();
  });

  it('should render a list of closed items when items exist', () => {
    const props = {
      issues: [{ status: 'granted', description: 'test closed issue' }],
    };
    const wrapper = mount(<Issues {...props} />);
    const panel = wrapper.find('va-accordion-item');
    expect(panel.find('h3').text()).to.contain('Closed');
    // no need to click, panel should be auto-expanded
    // closed items are in accordion > div > ul > li
    const remandDiv = wrapper.find('va-accordion-item > div');
    expect(remandDiv.find('ul > li').length).to.equal(props.issues.length);
    wrapper.unmount();
  });

  it('should pass auto-expand prop to active panel when both active and closed panels present', () => {
    const wrapper = shallow(<Issues {...manyIssues} />);
    const activePanel = wrapper.find('va-accordion-item').first();
    expect(activePanel.find('h3').text()).to.equal('Currently on appeal');
    expect(activePanel.props().open).to.be.true;
    wrapper.unmount();
  });

  it('should pass auto-expand prop to active panel when only active panel present', () => {
    const wrapper = shallow(<Issues {...oneOpenIssue} />);
    const activePanel = wrapper.find('va-accordion-item');
    expect(activePanel.find('h3').text()).to.equal('Currently on appeal');
    expect(activePanel.props().open).to.be.true;
    wrapper.unmount();
  });

  it('should pass auto-expand prop to closed panel when no active panel present', () => {
    const wrapper = shallow(<Issues {...oneClosedIssue} />);
    const closedPanel = wrapper.find('va-accordion-item').first();
    expect(closedPanel.find('h3').text()).to.equal('Closed');
    expect(closedPanel.props().open).to.be.true;
    wrapper.unmount();
  });

  it('should not pass auto-expand prop to closed panel when active panel present', () => {
    const wrapper = shallow(<Issues {...manyIssues} />);
    const closedPanel = wrapper.find('va-accordion-item').at(1);
    expect(closedPanel.find('h3').text()).to.equal('Closed');
    expect(closedPanel.props().open).to.be.false;
    wrapper.unmount();
  });

  it('should use the word "review" if a Supplemental Claim or Higher-Level Review', () => {
    const props = set('isAppeal', false, oneOpenIssue);
    const wrapper = shallow(<Issues {...props} />);
    const activePanel = wrapper.find('va-accordion-item');
    expect(activePanel.find('h3').text()).to.equal('Currently on review');
    wrapper.unmount();
  });

  it('should should mask Issue details in DataDog (no PII)', () => {
    const wrapper = shallow(<Issues {...oneOpenIssue} />);
    expect(wrapper.find('.issue-item').props()['data-dd-privacy']).to.equal(
      'mask',
    );
    wrapper.unmount();
  });
});
