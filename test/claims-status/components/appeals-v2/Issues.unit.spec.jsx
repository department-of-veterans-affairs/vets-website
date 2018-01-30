import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Issues from '../../../../src/js/claims-status/components/appeals-v2/Issues';
import { categorizeIssues } from '../../../../src/js/claims-status/utils/appeals-v2-helpers';
import { mockData } from '../../../../src/js/claims-status/utils/helpers';

describe.only('<Issues/>', () => {
  const emptyIssues = { issues: categorizeIssues(mockData.data[0].attributes.issues) };
  const oneIssues = { issues: categorizeIssues(mockData.data[1].attributes.issues) };
  const manyIssues = { issues: categorizeIssues(mockData.data[2].attributes.issues) };

  it('should render', () => {
    const wrapper = shallow(<Issues {...emptyIssues}/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should render no panels when no issues passed in', () => {
    // Note: this probably isn't possible in real-world usage
    const wrapper = shallow(<Issues {...emptyIssues}/>);
    expect(wrapper.find('CollapsiblePanel').length).to.equal(0);
  });

  it('should render one panel when only an open *OR* a closed issue is passed in', () => {
    const wrapper = shallow(<Issues {...oneIssues}/>);
    expect(wrapper.find('CollapsiblePanel').length).to.equal(1);
  });

  it('should render two panels when both open *AND* closed issues are passed in', () => {
    const wrapper = shallow(<Issues {...manyIssues}/>);
    expect(wrapper.find('CollapsiblePanel').length).to.equal(2);
  });

  it('should render a list of open items when open items exist', () => {
    const props = { issues: [{ status: 'open', description: 'test open issue' }] };
    const wrapper = mount(<Issues {...props }/>);
    const panelButton = wrapper.find('.usa-accordion-button');
    expect(panelButton.html()).to.contain('Currently On Appeal');
    // expand the collapsed accordion to reveal child HTML
    panelButton.simulate('click');
    const expandedPanel = wrapper.find('.usa-accordion-bordered');
    // open items are in the first ul within the first accordion's content
    const openContentList = expandedPanel.find('.usa-accordion-content > ul');
    expect(openContentList.find('li').length).to.equal(props.issues.length);
  });

  it('should render a list of closed items when items exist', () => {
    const props = { issues: [{ status: 'granted', description: 'test closed issue' }] };
    const wrapper = mount(<Issues {...props }/>);
    const panelButton = wrapper.find('.usa-accordion-button');
    expect(panelButton.html()).to.contain('Closed');
    // expand the collapsed accordion to reveal child HTML
    panelButton.simulate('click');
    const expandedPanel = wrapper.find('.usa-accordion-bordered');
    // closed items are in accordion > div > ul > li
    const remandDiv = expandedPanel.find('.usa-accordion-content > div');
    expect(remandDiv.find('ul > li').length).to.equal(props.issues.length);
  });
});
