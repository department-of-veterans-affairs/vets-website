import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import EligibleIssuesWidget from '../../components/EligibleIssuesWidget';
import { SELECTED } from '../../constants';

describe('<EligibleIssuesWidget>', () => {
  const getProps = ({
    review = false,
    submitted = false,
    onChange = () => {},
  } = {}) => ({
    id: 'id',
    value: [
      { ratingIssueSubjectText: 'issue-1' },
      { ratingIssueSubjectText: 'issue-2' },
      { ratingIssueSubjectText: 'issue-3' },
    ],
    additionalIssues: [],
    onChange,
    formContext: {
      onReviewPage: review,
      reviewMode: review,
      submitted,
    },
  });

  it('should render a list of check boxes (IssueCard component)', () => {
    const props = getProps();
    const wrapper = mount(<EligibleIssuesWidget {...props} />);
    expect(wrapper.find('IssueCard').length).to.equal(props.value.length);
    wrapper.unmount();
  });

  it('should not wrap the checkboxes in a fieldset', () => {
    const props = getProps();
    const wrapper = mount(<EligibleIssuesWidget {...props} />);
    expect(wrapper.find('fieldset').length).to.equal(0);
    wrapper.unmount();
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const wrapper = mount(<EligibleIssuesWidget {...props} />);
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
  it('should not show an error when submitted with no selections in eligible issues', () => {
    const props = getProps({ submitted: true });
    const issues = [{ [SELECTED]: true }];
    const wrapper = mount(
      <EligibleIssuesWidget {...props} additionalIssues={issues} />,
    );
    expect(wrapper.find('.usa-input-error').length).to.equal(0);
    wrapper.unmount();
  });

  it('should show a message when no issues found', () => {
    const props = getProps({ review: true });
    const wrapper = mount(<EligibleIssuesWidget {...props} value={[]} />);
    expect(wrapper.find('dt').text()).to.contain('No eligible issues found');
    wrapper.unmount();
  });
  it('should show a message when no issues selected on review page', () => {
    const props = getProps({ review: true });
    const wrapper = mount(<EligibleIssuesWidget {...props} value={[{}]} />);
    expect(wrapper.find('dt').text()).to.contain('No issues selected');
    wrapper.unmount();
  });
});
