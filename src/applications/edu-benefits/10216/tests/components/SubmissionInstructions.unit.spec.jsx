import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SubmissionInstructions from '../../components/SubmissionInstructions';

describe('<SubmissionInstructions />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<SubmissionInstructions />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
