import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { getPeriodsToVerify } from '../../helpers';

describe('getPeriodsToVerify', () => {
  it('should return the correct JSX for each pending enrollment', () => {
    const pendingEnrollments = [
      {
        id: 1,
        awardBeginDate: '2022-01-01',
        awardEndDate: '2022-01-31',
        numberHours: 10,
        monthlyRate: 100,
      },
      {
        id: 2,
        awardBeginDate: '2022-02-01',
        awardEndDate: '2022-02-28',
        numberHours: 20,
        monthlyRate: 200,
      },
    ];

    const wrapper = shallow(
      <div>{getPeriodsToVerify(pendingEnrollments, true)}</div>,
    );
    const div = wrapper.find('div').at(1);
    expect(div.key()).to.equal('Enrollment-to-be-verified-2');
    expect(div.prop('className')).to.include(
      'vads-u-margin-y--2 vye-left-border',
    );
    expect(
      wrapper
        .find('div')
        .at(2)
        .key(),
    ).to.equal('Enrollment-to-be-verified-1');

    wrapper.unmount();
  });
  it('should return just vads-u-margin-y--2 class in no review', () => {
    const pendingEnrollments = [
      {
        id: 1,
        awardBeginDate: '2022-01-01',
        awardEndDate: '2022-01-31',
        numberHours: 10,
        monthlyRate: 100,
      },
      {
        id: 2,
        awardBeginDate: '2022-02-01',
        awardEndDate: '2022-02-28',
        numberHours: 20,
        monthlyRate: 200,
      },
    ];

    const wrapper = shallow(
      <div>{getPeriodsToVerify(pendingEnrollments)}</div>,
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
