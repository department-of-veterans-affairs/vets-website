import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Checkbox from '../../components/Checkbox';

describe('<Checkbox>', () => {
  it('should render', () => {
    const tree = shallow(<Checkbox />);
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('input').length).to.eq(1);
    tree.unmount();
  });
  it('renders required span when required prop is true', () => {
    const tree = shallow(
      <Checkbox required label="Test" name="test" onChange={() => {}} />,
    );
    expect(tree.find('.form-required-span').length).to.equal(1);
    tree.unmount();
  });
  it('does not render required span when required prop is false', () => {
    const tree = shallow(
      <Checkbox
        required={false}
        label="Test"
        name="test"
        onChange={() => {}}
      />,
    );
    expect(tree.find('.form-required-span').length).to.equal(0);
    tree.unmount();
  });
  it('renders error message when there is an error', () => {
    const errorMessage = 'Error occurred';
    const tree = shallow(
      <Checkbox
        errorMessage={errorMessage}
        label="Test"
        name="test"
        onChange={() => {}}
      />,
    );
    expect(tree.find('.usa-input-error-message').length).to.equal(1);
    expect(tree.find('.usa-input-error-message').text()).to.include(
      errorMessage,
    );
    tree.unmount();
  });
  it('does not render error message when there is no error', () => {
    const tree = shallow(
      <Checkbox label="Test" name="test" onChange={() => {}} />,
    );
    expect(tree.find('.usa-input-error-message').length).to.equal(0);
    tree.unmount();
  });
  it('does not set aria-labelledby when inputAriaLabel is provided', () => {
    const tree = shallow(
      <Checkbox
        label="Test"
        name="test"
        onChange={() => {}}
        inputAriaLabel="Aria Label"
      />,
    );
    expect(tree.find('input').prop('aria-labelledby')).to.be.null;
    tree.unmount();
  });
  it('sets aria-labelledby correctly when showArialLabelledBy is true and inputAriaLabel is not provided', () => {
    const inputAriaLabelledBy = 'custom-label';
    const tree = mount(
      <Checkbox
        label="Test"
        name="test-checkbox"
        onChange={() => {}}
        showArialLabelledBy
        inputAriaLabelledBy={inputAriaLabelledBy}
      />,
    );
    const ariaLabelledByValue = tree.find('input').prop('aria-labelledby');
    expect(ariaLabelledByValue).to.include(inputAriaLabelledBy);
    expect(ariaLabelledByValue).to.include('test-checkbox-label');
    tree.unmount();
  });
});
