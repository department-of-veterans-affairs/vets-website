import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';

import { COVID19Alert, getChatHours } from '../covid-19';

describe('COVID19Alert component', () => {
  let sandbox;
  let recordEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEventStub = sandbox.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders', () => {
    const wrapper = shallow(<COVID19Alert />);
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });
  it('renders an va-alert component', () => {
    const wrapper = shallow(<COVID19Alert />);
    expect(wrapper.find('va-alert').length).to.equal(1);
    wrapper.unmount();
  });
  it('renders the default chat hours if no props are set', () => {
    const wrapper = shallow(<COVID19Alert />);
    expect(wrapper.html()).to.contain(
      '9:00 a.m. to 5:00 p.m., Monday through Friday',
    );
    wrapper.unmount();
  });
  it('renders the VISN 8 chat hours if passed a VISN 8 facilityId', () => {
    const wrapper = shallow(<COVID19Alert facilityId="672" />);
    expect(wrapper.html()).to.contain(
      '8:00 a.m. to 4:00 p.m., Monday through Friday',
    );
    wrapper.unmount();
  });
  it('renders the VISN 23 chat hours if passed a VISN 23 facilityId', () => {
    const wrapper = shallow(<COVID19Alert facilityId="656" />);
    expect(wrapper.html()).to.contain(
      '7:30 a.m. to 4:30 p.m., Monday through Friday',
    );
    wrapper.unmount();
  });
  it('the anchor tag is configured correctly', () => {
    const wrapper = shallow(<COVID19Alert />);
    const anchor = wrapper.find('a');
    expect(anchor.props().href).to.equal(
      'https://mobile.va.gov/app/va-health-chat',
    );
    expect(anchor.props().className.includes('usa-button-primary')).to.be.true;
    wrapper.unmount();
  });

  it('records analytics when the link is clicked', () => {
    const wrapper = shallow(<COVID19Alert />);
    const anchor = wrapper.find('a');

    anchor.props().onClick();

    expect(
      recordEventStub.calledWith({
        event: 'dashboard-navigation',
        'dashboard-action': 'view-link',
        'dashboard-product': 'learn-more-chat',
      }),
    ).to.equal(true);
    wrapper.unmount();
  });

  describe('getChatHours', () => {
    describe('branch: visn8Systems.has(facilityId) returns true', () => {
      it('should return VISN 8 hours when facilityId is in VISN8 systems only (516)', () => {
        // 516 is only in VISN8, not in VISN23
        const result = getChatHours('516');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in VISN8 systems only (546)', () => {
        // 546 is only in VISN8, not in VISN23
        const result = getChatHours('546');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in VISN8 systems only (548)', () => {
        // 548 is only in VISN8, not in VISN23
        const result = getChatHours('548');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in VISN8 systems only (573)', () => {
        // 573 is only in VISN8, not in VISN23
        const result = getChatHours('573');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in VISN8 systems only (672)', () => {
        // 672 is only in VISN8, not in VISN23
        const result = getChatHours('672');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in VISN8 systems only (673)', () => {
        // 673 is only in VISN8, not in VISN23
        const result = getChatHours('673');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in VISN8 systems only (675)', () => {
        // 675 is only in VISN8, not in VISN23
        const result = getChatHours('675');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours when facilityId is in both VISN8 and VISN23 (618)', () => {
        // 618 is in both VISN8 and VISN23, but VISN8 is checked first
        // This tests that the first branch takes precedence
        const result = getChatHours('618');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });
    });

    describe('branch: visn23Systems.has(facilityId) returns true', () => {
      it('should return VISN 23 hours when facilityId is in VISN23 systems only (656)', () => {
        // 656 is only in VISN23, not in VISN8
        // This tests the second branch
        const result = getChatHours('656');
        expect(result).to.equal(
          '7:30 a.m. to 4:30 p.m., Monday through Friday',
        );
      });
    });

    describe('else branch: return testHours', () => {
      it('should return test hours for facilityId not in VISN8 or VISN23 (999)', () => {
        // 999 is not in either VISN system
        const result = getChatHours('999');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId not in VISN8 or VISN23 (100)', () => {
        // 100 is not in either VISN system
        const result = getChatHours('100');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId not in VISN8 or VISN23 (200)', () => {
        // 200 is not in either VISN system
        const result = getChatHours('200');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId not in VISN8 or VISN23 (300)', () => {
        // 300 is not in either VISN system
        const result = getChatHours('300');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId not in VISN8 or VISN23 (400)', () => {
        // 400 is not in either VISN system
        const result = getChatHours('400');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId not in VISN8 or VISN23 (500)', () => {
        // 500 is not in either VISN system
        const result = getChatHours('500');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId starting with 648 (testing facility)', () => {
        const result = getChatHours('648');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId starting with 983 (testing facility)', () => {
        const result = getChatHours('983');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for facilityId starting with 984 (testing facility)', () => {
        const result = getChatHours('984');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for undefined facilityId', () => {
        const result = getChatHours(undefined);
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for null facilityId', () => {
        const result = getChatHours(null);
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });

      it('should return test hours for empty string facilityId', () => {
        const result = getChatHours('');
        expect(result).to.equal(
          '9:00 a.m. to 5:00 p.m., Monday through Friday',
        );
      });
    });
  });
});
