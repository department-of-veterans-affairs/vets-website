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
    const event = { target: { name: 'militaryStatus', value: 'active duty' } };
    const event2 = {
      target: { name: 'militaryStatus', value: 'national guard / reserves' },
    };
    wrapper.find('[name="militaryStatus"]').simulate('change', event);
    wrapper.find('[name="militaryStatus"]').simulate('change', event2);
    expect(setMilitaryStatus.calledWith('active duty')).to.be.true;
    expect(setMilitaryStatus.calledWith('national guard / reserves')).to.be
      .true;
    const event3 = { target: { name: 'giBillChapter', value: '33b' } };
    const event4 = { target: { name: 'giBillChapter', value: '30' } };
    const event5 = { target: { name: 'giBillChapter', value: '1606' } };
    const event6 = { target: { name: 'giBillChapter', value: '31' } };
    const event7 = { target: { name: 'giBillChapter', value: '35' } };
    const event8 = { target: { name: 'giBillChapter', value: '33a' } };
    wrapper.find('[name="giBillChapter"]').simulate('change', event3);
    wrapper.find('[name="giBillChapter"]').simulate('change', event4);
    wrapper.find('[name="giBillChapter"]').simulate('change', event5);
    wrapper.find('[name="giBillChapter"]').simulate('change', event6);
    wrapper.find('[name="giBillChapter"]').simulate('change', event7);
    wrapper.find('[name="giBillChapter"]').simulate('change', event8);
    expect(setGiBillChapter.calledWith('33b')).to.be.true;
    expect(setGiBillChapter.calledWith('30')).to.be.true;
    expect(setGiBillChapter.calledWith('1606')).to.be.true;
    expect(setGiBillChapter.calledWith('31')).to.be.true;
    expect(setGiBillChapter.calledWith('35')).to.be.true;
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
  it('should update spouseActiveDuty when Dropdown onChange is triggered', () => {
    const setSpouseActiveDuty = sinon.spy();
    const wrapper = shallow(
      <SearchBenefits setSpouseActiveDuty={setSpouseActiveDuty} />,
    );

    const dropdown = wrapper.find('Dropdown[name="spouseActiveDuty"]');

    dropdown.simulate('change', { target: { value: 'yes' } });

    expect(setSpouseActiveDuty.calledOnce).to.equal(true);
    expect(setSpouseActiveDuty.calledWith('yes')).to.equal(true);
    wrapper.unmount();
  });
  it('should update cumulativeService when Dropdown onChange is triggered', () => {
    const setCumulativeService = sinon.spy();
    const wrapper = shallow(
      <SearchBenefits setCumulativeService={setCumulativeService} />,
    );

    const dropdown = wrapper.find('Dropdown[name="cumulativeService"]');

    dropdown.simulate('change', { target: { value: '0.9' } });

    expect(setCumulativeService.calledOnce).to.equal(true);
    expect(setCumulativeService.calledWith('0.9')).to.equal(true);
    wrapper.unmount();
  });
  it('should update giBillChapter when Dropdown onChange is triggered', () => {
    const setGiBillChapter = sinon.spy();
    const setMilitaryStatus = sinon.spy();
    const wrapper = shallow(
      <SearchBenefits
        setGiBillChapter={setGiBillChapter}
        setMilitaryStatus={setMilitaryStatus}
      />,
    );

    const dropdown = wrapper.find('Dropdown[name="giBillChapter"]');
    dropdown.simulate('change', { target: { value: '33b' } });

    expect(setGiBillChapter.calledOnce).to.equal(true);
    expect(setGiBillChapter.calledWith('33b')).to.equal(true);
    wrapper.unmount();
  });
  it('should update enlistmentService when Dropdown onChange is triggered', () => {
    const setEnlistmentService = sinon.spy();
    const wrapper = shallow(
      <SearchBenefits setEnlistmentService={setEnlistmentService} />,
    );

    const dropdown = wrapper.find('Dropdown[name="enlistmentService"]');
    dropdown.simulate('change', { target: { value: '3' } });

    expect(setEnlistmentService.calledOnce).to.equal(true);
    expect(setEnlistmentService.calledWith('3')).to.equal(true);
    wrapper.unmount();
  });
  it('should update eligForPostGiBill when Dropdown onChange is triggered', () => {
    const setEligForPostGiBill = sinon.spy();
    const giBillChapter = '31';
    const wrapper = shallow(
      <SearchBenefits
        giBillChapter={giBillChapter}
        setEligForPostGiBill={setEligForPostGiBill}
      />,
    );

    const dropdown = wrapper.find('Dropdown[name="eligForPostGiBill"]');
    dropdown.simulate('change', { target: { value: 'yes' } });

    expect(setEligForPostGiBill.calledOnce).to.equal(true);
    expect(setEligForPostGiBill.calledWith('yes')).to.equal(true);
    wrapper.unmount();
  });

  it('should update numberOfDependents when Dropdown onChange is triggered', () => {
    const setNumberOfDependents = sinon.spy();
    const giBillChapter = '31';
    const eligForPostGiBill = 'no';
    const wrapper = shallow(
      <SearchBenefits
        giBillChapter={giBillChapter}
        eligForPostGiBill={eligForPostGiBill}
        setNumberOfDependents={setNumberOfDependents}
      />,
    );

    const dropdown = wrapper.find('Dropdown[name="numberOfDependents"]');

    dropdown.simulate('change', { target: { value: '2' } });

    expect(setNumberOfDependents.calledOnce).to.equal(true);
    expect(setNumberOfDependents.calledWith('2')).to.equal(true);
    wrapper.unmount();
  });
});
