import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MobileFilterControls from '../../components/MobileFilterControls';

describe('<MobileFilterControls/>', () => {
  it('should render', () => {
    const wrapper = shallow(<MobileFilterControls />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should add class modal-open to body when filterClick button click', async () => {
    const wrapper = shallow(<MobileFilterControls />);
    const btn = wrapper.find('button.usa-button-secondary').last();
    expect(btn.text()).to.equal('Filter your results');
    btn.simulate('click');
    const hasClass = document.body.classList.contains('modal-open');
    expect(hasClass).to.be.true;
    // });

    wrapper.unmount();
  });

  it('should add class modal-open to body when tuitionAndHousingEstimatesClick button click', async () => {
    const wrapper = shallow(<MobileFilterControls />);
    const btn = wrapper.find('button.usa-button-secondary').first();
    expect(btn.text()).to.equal(
      'Update tuition, housing, and monthly benefit estimates',
    );
    btn.simulate('click');
    const hasClass = document.body.classList.contains('modal-open');
    expect(hasClass).to.be.true;
    wrapper.unmount();
  });
});
