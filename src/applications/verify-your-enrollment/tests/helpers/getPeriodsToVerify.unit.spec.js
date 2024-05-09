import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { getPeriodsToVerify } from '../../helpers';

const pendingVerifications = [
  {
    awardId: '00001',
    awardBeginDate: '2024-03-01',
    awardEndDate: '2024-03-24',
    numberHours: 10,
    monthlyRate: 600.0,
    caseTrace: 'CASE 1b',
  },
  {
    awardId: '00002',
    awardBeginDate: '2024-03-25',
    awardEndDate: '2024-03-31',
    numberHours: 12,
    monthlyRate: 1400.0,
    caseTrace: 'CASE 7',
  },
  {
    awardId: '00003',
    awardBeginDate: '2024-02-05',
    awardEndDate: '2024-02-31',
    numberHours: 12,
    monthlyRate: 1400.0,
    caseTrace: 'CASE 7',
  },
];

describe('getPeriodsToVerify', () => {
  it('should return the correct JSX for each pending enrollment', () => {
    const wrapper = shallow(
      <div>{getPeriodsToVerify(pendingVerifications, true)}</div>,
    );
    const div = wrapper.find('div').at(1);
    expect(div.key()).to.include('Enrollment-to-be-verified');
    expect(div.prop('className')).to.include(
      'vads-u-margin-y--2 vye-left-border',
    );
    expect(
      wrapper
        .find('div')
        .at(2)
        .key(),
    ).to.include('Enrollment-to-be-verified');

    wrapper.unmount();
  });
  it('should return just vads-u-margin-y--2 class in no review', () => {
    const wrapper = shallow(
      <div>{getPeriodsToVerify(pendingVerifications)}</div>,
    );
    const div = wrapper.find('div').at(1);
    expect(div.prop('className')).to.include('vads-u-margin-y--2');
    wrapper.unmount();
  });
  it('should handle an empty array', () => {
    const wrapper = shallow(<div>{getPeriodsToVerify([])}</div>);

    expect(wrapper.children()).to.have.length(0);
    wrapper.unmount();
  });
});
