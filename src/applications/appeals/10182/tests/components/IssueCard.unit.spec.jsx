import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { IssueCardContent, IssueCard } from '../../components/IssueCard';
import { SELECTED } from '../../constants';

const getContestableIssue = (id, selected) => ({
  ratingIssueSubjectText: `issue-${id}`,
  description: 'blah',
  ratingIssuePercentNumber: id,
  approxDecisionDate: `2021-01-${id}`,
  [SELECTED]: selected,
});
const getAdditionalIssue = (id, selected) => ({
  issue: `new-issue-${id}`,
  decisionDate: `2021-02-${id}`,
  [SELECTED]: selected,
});

describe('<IssueCard>', () => {
  const getProps = ({
    showCheckbox = true,
    onChange = () => {},
    onEdit = null,
  } = {}) => ({
    id: 'id',
    index: 0,
    options: { appendId: 'z' },
    showCheckbox,
    onChange,
    onEdit,
  });

  it('should render a Contestable issue', () => {
    const props = getProps();
    const issue = getContestableIssue('10');
    const wrapper = mount(<IssueCard {...props} item={issue} />);
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(1);
    expect(wrapper.find('.widget-title').text()).to.eq('issue-10');
    expect(wrapper.find('.widget-content').text()).to.contain('blah');
    expect(wrapper.find('.widget-content').text()).to.contain(
      'Current rating: 10%',
    );
    expect(wrapper.find('.widget-content').text()).to.contain(
      'Decision date: January 10, 2021',
    );
    expect(wrapper.find('.edit').length).to.equal(0);
    wrapper.unmount();
  });
  it('should render an Additional issue', () => {
    const props = getProps({ onEdit: () => {} });
    const issue = getAdditionalIssue('22');
    const wrapper = mount(<IssueCard {...props} item={issue} />);
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(1);
    expect(wrapper.find('.widget-title').text()).to.eq('new-issue-22');
    expect(wrapper.find('.widget-content').text()).to.contain(
      'Decision date: February 22, 2021',
    );
    expect(wrapper.find('.edit').length).to.equal(1);
    wrapper.unmount();
  });
  it('should render a selected issue with appendId included', () => {
    const props = getProps();
    const issue = getContestableIssue('01', true);
    const wrapper = mount(<IssueCard {...props} item={issue} />);
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.length).to.equal(1);
    expect(checkbox.props().id).to.equal('id_0_z'); // checks appendId
    expect(wrapper.find('.widget-outline.selected').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a selected additional issue without the checkbox or edit button', () => {
    const props = getProps({ showCheckbox: false });
    const issue = getAdditionalIssue('03', true);
    const wrapper = mount(<IssueCard {...props} item={issue} />);
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(0);
    expect(wrapper.find('.edit').length).to.equal(0);
    expect(wrapper.find('.widget-outline.selected').length).to.equal(1);
    wrapper.unmount();
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const issue = getContestableIssue('01', true);
    const wrapper = mount(<IssueCard {...props} item={issue} />);

    const element = wrapper.find('input');
    // "Click" the option
    // .simulate('click') wasn't calling the onChange handler for some reason
    element.props().onChange({ target: { checked: true } });
    // Check that it changed
    expect(onChange.callCount).to.equal(1);
    expect(onChange.firstCall.args[1]).to.be.true;

    // "Click" the option
    element.props().onChange({ target: { checked: false } });
    // Check that it changed back
    expect(onChange.callCount).to.equal(2);
    expect(onChange.secondCall.args[1]).to.be.false;
    wrapper.unmount();
  });
  it('should call onEdit when the edit button is used', () => {
    const onEdit = sinon.spy();
    const props = getProps({ onEdit });
    const issue = getAdditionalIssue('01', true);
    const wrapper = mount(<IssueCard {...props} item={issue} />);
    wrapper.find('.edit').simulate('click');

    expect(onEdit.callCount).to.equal(1);
    expect(onEdit.called).to.be.true;
    wrapper.unmount();
  });
});

describe('<IssueCardContent>', () => {
  it('should render an empty div', () => {
    const wrapper = shallow(<IssueCardContent />);
    expect(wrapper.find('.widget-content-wrap').text()).to.equal('');
    wrapper.unmount();
  });
  it('should render Contestable issue content', () => {
    const issue = getContestableIssue('20');
    const wrapper = shallow(<IssueCardContent {...issue} />);
    expect(wrapper.find('.widget-content-wrap').text()).to.contain('blah');
    expect(wrapper.find('.widget-content-wrap').text()).to.contain(
      'Current rating: 20%',
    );
    expect(wrapper.find('.widget-content-wrap').text()).to.contain(
      'Decision date: January 20, 2021',
    );
    expect(wrapper.find('.edit').length).to.equal(0);
    wrapper.unmount();
  });
  it('should render AdditionalIssue content', () => {
    const issue = getAdditionalIssue('21');
    const wrapper = shallow(<IssueCardContent {...issue} />);
    expect(wrapper.find('.widget-content-wrap').text()).to.contain(
      'Decision date: February 21, 2021',
    );
    wrapper.unmount();
  });
});
