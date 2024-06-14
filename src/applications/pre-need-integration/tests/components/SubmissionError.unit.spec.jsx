import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SubmissionError from '../../components/SubmissionError';

describe('SubmissionError component', () => {
  const user = {
    login: {
      currentlyLoggedIn: true,
    },
  };

  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  const saveLink = <a href="#">Save Link</a>;

  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<SubmissionError user={user} saveLink={saveLink} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });
});
