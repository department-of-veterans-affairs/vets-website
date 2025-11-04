import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { COVID19Alert, getChatHours } from '../covid-19';

describe('COVID19Alert component', () => {
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

  describe('getChatHours', () => {
    describe('when facilityId is in VISN8 systems', () => {
      it('should return VISN 8 hours for facilityId starting with 516', () => {
        const result = getChatHours('516');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 672', () => {
        const result = getChatHours('672');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 673', () => {
        const result = getChatHours('673');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 546', () => {
        const result = getChatHours('546');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 548', () => {
        const result = getChatHours('548');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 573', () => {
        const result = getChatHours('573');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 618', () => {
        const result = getChatHours('618');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });

      it('should return VISN 8 hours for facilityId starting with 675', () => {
        const result = getChatHours('675');
        expect(result).to.equal(
          '8:00 a.m. to 4:00 p.m., Monday through Friday',
        );
      });
    });

    describe('when facilityId is in VISN23 systems', () => {
      it('should return VISN 23 hours for facilityId starting with 656', () => {
        // Note: 656 is only in VISN23, not in VISN8
        const result = getChatHours('656');
        expect(result).to.equal(
          '7:30 a.m. to 4:30 p.m., Monday through Friday',
        );
      });
    });

    describe('when facilityId is not in VISN8 or VISN23 systems (default case)', () => {
      it('should return test hours for facilityId not in any system', () => {
        const result = getChatHours('999');
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
