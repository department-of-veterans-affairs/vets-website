import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { getPeriodsToVerify } from '../../helpers';

const pendingVerifications = [
  {
    awardId: '00001',
    actBegin: '2024-03-01',
    actEnd: '2024-03-24',
    numberHours: 10,
    monthlyRate: 600.0,
    caseTrace: 'CASE 1b',
  },
  {
    awardId: '00002',
    actBegin: '2024-03-25',
    actEnd: '2024-03-31',
    numberHours: 12,
    monthlyRate: 1400.0,
    caseTrace: 'CASE 7',
  },
  {
    awardId: '00003',
    actBegin: '2024-02-05',
    actEnd: '2024-02-31',
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
    expect(div.prop('className')).to.include('vads-u-margin-y--2');
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
  it('should returns "Hours unavailable" for Total credit hours if numberHours is null', () => {
    const wrapper = shallow(
      <div>
        {getPeriodsToVerify([
          {
            awardId: '00001',
            actBegin: '2024-03-01',
            actEnd: '2024-03-24',
            numberHours: null,
            monthlyRate: 600.0,
            caseTrace: 'CASE 1b',
          },
        ])}
      </div>,
    );
    const unavailable = wrapper
      .find('p.vads-u-margin--0.vads-u-font-size--base')
      .at(1);
    expect(unavailable.text()).to.equal(
      'Total credit hours: Hours unavailable',
    );
    wrapper.unmount();
  });
  it('should returns "Rate unavailable" for Monthly rate if monthlyRate is null', () => {
    const wrapper = shallow(
      <div>
        {getPeriodsToVerify([
          {
            awardId: '00001',
            actBegin: '2024-03-01',
            actEnd: '2024-03-24',
            numberHours: 6,
            monthlyRate: null,
            caseTrace: 'CASE 1b',
          },
        ])}
      </div>,
    );
    const unavailable = wrapper
      .find('p.vads-u-margin--0.vads-u-font-size--base')
      .at(2);
    expect(unavailable.text()).to.equal('Monthly rate: Rate unavailable');
    wrapper.unmount();
  });
});
