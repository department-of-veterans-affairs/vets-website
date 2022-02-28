import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { ContestableIssuesWidget } from '../../components/ContestableIssuesWidget';
import { SELECTED } from '../../constants';

describe('<ContestableIssuesWidget>', () => {
  const getProps = ({
    review = false,
    submitted = false,
    onChange = () => {},
    setFormData = () => {},
  } = {}) => ({
    id: 'id',
    value: [
      { attributes: { ratingIssueSubjectText: 'issue-1' } },
      { attributes: { ratingIssueSubjectText: 'issue-2' } },
    ],
    additionalIssues: [{ issue: 'issue-3' }],
    onChange,
    formContext: {
      onReviewPage: review,
      reviewMode: review,
      submitted,
    },
    setFormData,
  });

  it('should render a list of check boxes (IssueCard component)', () => {
    const props = getProps();
    const wrapper = mount(<ContestableIssuesWidget {...props} />);
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(
      props.value.length + props.additionalIssues.length,
    );
    expect(
      wrapper
        .find('.widget-title')
        .first()
        .text(),
    ).to.equal('issue-1');
    wrapper.unmount();
  });
  it('should render change link & remove button', () => {
    const props = getProps();
    const wrapper = mount(<ContestableIssuesWidget {...props} />);
    const addLength = props.additionalIssues.length;
    const link = wrapper.find('a.change-issue-link');
    expect(link.length).to.equal(addLength);
    expect(wrapper.find('button.remove-issue').length).to.equal(
      props.additionalIssues.length,
    );
    wrapper.unmount();
  });

  it('should not wrap the checkboxes in a fieldset', () => {
    const props = getProps();
    const wrapper = mount(<ContestableIssuesWidget {...props} />);
    expect(wrapper.find('fieldset').length).to.equal(0);
    wrapper.unmount();
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const wrapper = mount(<ContestableIssuesWidget {...props} />);
    wrapper.find('.form-checkbox').forEach((element, index) => {
      onChange.reset();

      // "Click" the option
      // .simulate('click') wasn't calling the onChange handler for some reason
      element
        .find('input')
        .first()
        .props()
        .onChange({ target: { checked: true } });

      // Check that it changed
      expect(onChange.callCount).to.equal(1);
      expect(onChange.firstCall.args[0][index]).to.eql({
        ...props.value[index],
        [SELECTED]: true,
      });

      // "Click" the option
      element
        .find('input')
        .first()
        .props()
        .onChange({ target: { checked: false } });

      // Check that it changed back
      expect(onChange.callCount).to.equal(2);
      expect(onChange.secondCall.args[0][index]).to.eql({
        ...props.value[index],
        [SELECTED]: false,
      });
    });
    wrapper.unmount();
  });
  it('should not show an error on submission with one selection', () => {
    const props = getProps({ submitted: true });
    const issues = [{ [SELECTED]: true }];
    const wrapper = mount(
      <ContestableIssuesWidget {...props} additionalIssues={issues} />,
    );
    expect(wrapper.find('.usa-input-error').length).to.equal(0);
    wrapper.unmount();
  });

  it('should show an error when submitted with no selections', () => {
    const props = getProps({ submitted: true });
    const wrapper = mount(<ContestableIssuesWidget {...props} />);
    expect(wrapper.find('va-alert h3').length).to.equal(1);
    wrapper.unmount();
  });
  it('should show a message when no issues selected on review page', () => {
    const props = getProps({ review: true });
    const wrapper = mount(<ContestableIssuesWidget {...props} />);
    expect(wrapper.find('dt').text()).to.contain(
      'at least one issue, so we can process your request',
    );
    wrapper.unmount();
  });
  it('should remove additional item', () => {
    const setFormData = sinon.spy();
    const props = getProps({ setFormData });
    const wrapper = mount(<ContestableIssuesWidget {...props} />);

    expect(props.additionalIssues.length).to.equal(1);

    wrapper
      .find('button.remove-issue')
      .props()
      .onClick({ preventDefault: () => {} });

    expect(setFormData.called).to.be.true;
    expect(setFormData.args[0][0].additionalIssues.length).to.equal(0);
    wrapper.unmount();
  });
});
