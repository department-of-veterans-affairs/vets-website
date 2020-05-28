import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersWrapper from '../components/DebtLettersWrapper';

describe('DebtLettersWrapper', () => {
  it('mounts wrapper component', () => {
    const wrapper = shallow(<DebtLettersWrapper />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
});
