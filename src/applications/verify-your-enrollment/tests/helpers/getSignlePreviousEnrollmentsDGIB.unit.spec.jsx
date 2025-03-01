import { shallow } from 'enzyme';
import { expect } from 'chai';
import { getSignlePreviousEnrollmentsDGIB } from '../../helpers';
import { enrollmentVerifications } from './data';

describe('getSignlePreviousEnrollmentsDGIB', () => {
  it('should render correctly when enrollment has verificationMethod and valid verificationEndDate', () => {
    const enrollment = {
      verificationMethod: true,
      verificationEndDate: '2023-01-31',
      verificationBeginDate: '2023-01-01',
      totalCreditHours: 30,
      lastDepositAmount: 1000,
      facilityName: 'Test Facility',
    };

    const wrapper = shallow(
      getSignlePreviousEnrollmentsDGIB(enrollment, enrollmentVerifications),
    );
    expect(wrapper.find('h3').text()).to.include('Verified');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.include('01/01/2023 - 01/31/2023at TEST FACILITY');
    expect(
      wrapper
        .find('p')
        .at(2)
        .text(),
    ).to.include('Total credit hours: 30');
    expect(
      wrapper
        .find('span')
        .at(1)
        .text(),
    ).to.include('Verified');
    wrapper.unmount();
  });

  it('should not render anything if verificationEndDate is invalid', () => {
    const enrollment = {
      verificationMethod: true,
      verificationEndDate: null,
      verificationBeginDate: null,
    };

    const wrapper = shallow(
      getSignlePreviousEnrollmentsDGIB(enrollment, enrollmentVerifications),
    );
    expect(wrapper.isEmptyRender()).to.be.false;
    wrapper.unmount();
  });
});
