import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import SearchBenefits from '../../components/SearchBenefits';

describe('SearchBenefits', () => {
  it('it should handle change correctly', () => {
    const setGiBillChapter = sinon.spy();
    const setMilitaryStatus = sinon.spy();
    const wrapper = shallow(
      <SearchBenefits
        giBillChapter=""
        militaryStatus=""
        setGiBillChapter={setGiBillChapter}
        setMilitaryStatus={setMilitaryStatus}
        setSpouseActiveDuty={() => {}}
      />,
    );
    const event = { target: { name: 'militaryStatus', value: 'spouse' } };
    const event2 = { target: { name: 'militaryStatus', value: 'child' } };
    wrapper.find('[name="militaryStatus"]').simulate('change', event);
    wrapper.find('[name="militaryStatus"]').simulate('change', event2);
    expect(setMilitaryStatus.calledWith('spouse')).to.be.true;
    expect(setMilitaryStatus.calledWith('child')).to.be.true;
    expect(setGiBillChapter.calledWith('33a')).to.be.true;
    wrapper.unmount();
  });

  it('should render warning Post when militaryStatus === active duty', () => {
    const props = {
      militaryStatus: 'active duty',
      giBillChapter: '33b',
      chapter33Check: '33b',
    };
    const wrapper = shallow(<SearchBenefits {...props} />);
    const div = wrapper.find('div.military-status-info.warning.form-group');
    expect(div.text()).to.equal(
      'Post 9/11 GI Bill recipients serving on Active Duty (or transferee spouses of a service member on active duty) are not eligible to receive a monthly housing allowance.',
    );
    wrapper.unmount();
  });

  it('should render  info Post Bill when  giBillChapter === 31', () => {
    const props = {
      militaryStatus: 'active duty',
      giBillChapter: '31',
    };
    const wrapper = shallow(<SearchBenefits {...props} />);
    const div = wrapper.find('div.military-status-info.info.form-group');
    expect(div.text()).to.equal(
      'To apply for VR&E benefits, please visit this site.',
    );
    wrapper.unmount();
  });
});
