import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CurrentBenefitsStatus from '../../components/CurrentBenefitsStatus';

describe('when <CurrentBenefitsStatus/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<CurrentBenefitsStatus />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('Should render the link', () => {
    const wrapper = shallow(
      <CurrentBenefitsStatus
        link={() => <a href="http://some-link">some Link</a>}
      />,
    );
    const link = wrapper.find('a.vads-c-action-link--blue');
    expect(link).to.exist;
    wrapper.unmount();
  });
});
