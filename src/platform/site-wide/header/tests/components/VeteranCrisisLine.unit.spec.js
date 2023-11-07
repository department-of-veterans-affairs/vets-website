import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { VeteranCrisisLine } from '../../components/VeteranCrisisLine';

describe('Header <VeteranCrisisLine>', () => {
  it('renders content', () => {
    const wrapper = shallow(<VeteranCrisisLine />);

    expect(wrapper.find('.va-button-link')).to.have.length(1);
    expect(wrapper.text()).includes('Talk to the Veterans Crisis Line now');

    wrapper.unmount();
  });
});
