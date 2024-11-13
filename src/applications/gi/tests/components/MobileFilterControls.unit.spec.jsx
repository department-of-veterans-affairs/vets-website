import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import MobileFilterControls from '../../components/MobileFilterControls';

describe('<MobileFilterControls/>', () => {
  it('should render', () => {
    const wrapper = shallow(<MobileFilterControls />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should add class modal-open to body when filterClick button click', async () => {
    const wrapper = shallow(<MobileFilterControls />);
    const btn = wrapper.find('[data-testid="update-results-small-screen"]');
    await act(async () => {
      btn.simulate('click');
    });

    expect(document.body.classList.contains('modal-open')).to.be.true;
    wrapper.unmount();
  });

  it('should add class modal-open to body when tuitionAndHousingEstimatesClick button click', async () => {
    const wrapper = shallow(<MobileFilterControls />);
    const btn = wrapper.find('[data-testid="tuition-housing-ben"]');
    btn.simulate('click');
    const hasClass = document.body.classList.contains('modal-open');
    expect(hasClass).to.be.true;
    wrapper.unmount();
  });
});
