import { expect } from 'chai';
import { shallow } from 'enzyme';
import { getWarningStatus } from '../enrollment-status-helpers';
import { HCA_ENROLLMENT_STATUSES } from '../constants';

describe('getWarningStatus', () => {
  describe('when `enrollmentStatus` is `deceased`', () => {
    it('should return null', () => {
      expect(getWarningStatus(HCA_ENROLLMENT_STATUSES.deceased)).to.be.null;
    });
  });

  describe('default behavior', () => {
    describe('if no `applicationDate` is passed', () => {
      it('should return null', () => {
        expect(getWarningStatus('enrollment_status')).to.be.null;
      });
    });

    describe('if `applicationDate` is a valid date', () => {
      it('should return the correct markup', () => {
        const wrapper = shallow(
          getWarningStatus(
            'enrollment_status',
            '2018-01-24T00:00:00.000-06:00',
          ),
        );
        expect(wrapper.find('p').length).equals(1);
        expect(wrapper.find('strong').length).equals(1);
        expect(wrapper.text().includes('You applied on:')).to.be.true;
        wrapper.unmount();
      });
    });
  });

  describe('when `enrollmentStatus` is `enrolled`', () => {
    describe('when all info is provided', () => {
      it('should return the correct markup', () => {
        const wrapper = shallow(
          getWarningStatus(
            HCA_ENROLLMENT_STATUSES.enrolled,
            '2018-01-24T00:00:00.000-06:00',
            '2018-01-24T00:00:00.000-06:00',
            'FACILITY NAME',
          ),
        );
        expect(wrapper.find('p').length).equals(1);
        expect(wrapper.find('strong').length).equals(3);
        expect(wrapper.find('br').length).equals(2);
        expect(wrapper.text().includes('You applied on:')).to.be.true;
        expect(wrapper.text().includes('We enrolled you on:')).to.be.true;
        expect(wrapper.text().includes('Your preferred VA medical center is:'))
          .to.be.true;
        wrapper.unmount();
      });
    });

    describe('when the `applicationDate` is not set', () => {
      it('should return the correct markup', () => {
        const wrapper = shallow(
          getWarningStatus(
            HCA_ENROLLMENT_STATUSES.enrolled,
            null,
            '2018-01-24T00:00:00.000-06:00',
            'FACILITY NAME',
          ),
        );
        expect(wrapper.find('p').length).equals(1);
        expect(wrapper.find('strong').length).equals(2);
        expect(wrapper.find('br').length).equals(1);
        expect(wrapper.text().includes('You applied on:')).to.be.false;
        expect(wrapper.text().includes('We enrolled you on:')).to.be.true;
        expect(wrapper.text().includes('Your preferred VA medical center is:'))
          .to.be.true;
        wrapper.unmount();
      });
    });

    describe('when the `enrollmentDate` is not set', () => {
      it('should return the correct markup', () => {
        const wrapper = shallow(
          getWarningStatus(
            HCA_ENROLLMENT_STATUSES.enrolled,
            '2018-01-24T00:00:00.000-06:00',
            null,
            'FACILITY NAME',
          ),
        );
        expect(wrapper.find('p').length).equals(1);
        expect(wrapper.find('strong').length).equals(2);
        expect(wrapper.find('br').length).equals(1);
        expect(wrapper.text().includes('You applied on:')).to.be.true;
        expect(wrapper.text().includes('We enrolled you on:')).to.be.false;
        expect(wrapper.text().includes('Your preferred VA medical center is:'))
          .to.be.true;
        wrapper.unmount();
      });
    });

    describe('when the `preferredFacility` is not set', () => {
      it('should return the correct markup', () => {
        const wrapper = shallow(
          getWarningStatus(
            HCA_ENROLLMENT_STATUSES.enrolled,
            '2018-01-24T00:00:00.000-06:00',
            '2018-01-24T00:00:00.000-06:00',
          ),
        );
        expect(wrapper.find('p').length).equals(1);
        expect(wrapper.find('strong').length).equals(2);
        expect(wrapper.find('br').length).equals(1);
        expect(wrapper.text().includes('You applied on:')).to.be.true;
        expect(wrapper.text().includes('We enrolled you on:')).to.be.true;
        expect(wrapper.text().includes('Your preferred VA medical center is:'))
          .to.be.false;
        wrapper.unmount();
      });
    });

    describe('when only `preferredFacility` is set', () => {
      it('should return the correct markup', () => {
        const wrapper = shallow(
          getWarningStatus(
            HCA_ENROLLMENT_STATUSES.enrolled,
            null,
            null,
            'FACILITY NAME',
          ),
        );
        expect(wrapper.find('p').length).equals(1);
        expect(wrapper.find('strong').length).equals(1);
        expect(wrapper.find('br').length).equals(0);
        expect(wrapper.text().includes('You applied on:')).to.be.false;
        expect(wrapper.text().includes('We enrolled you on:')).to.be.false;
        expect(wrapper.text().includes('Your preferred VA medical center is:'))
          .to.be.true;
        wrapper.unmount();
      });
    });

    describe('when nothing is set', () => {
      it('should return null', () => {
        expect(getWarningStatus(HCA_ENROLLMENT_STATUSES.enrolled)).to.be.null;
      });
    });
  });
});
