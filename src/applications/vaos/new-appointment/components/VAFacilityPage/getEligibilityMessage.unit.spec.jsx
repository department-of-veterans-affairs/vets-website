import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';
import getEligibilityMessage from './getEligibilityMessage';

describe('VAOS Component: getEligibilityMessage', () => {
  const facilityDetails = {
    id: '983',
    name: 'Cheyenne VA Medical Center',
    telecom: [{ system: 'phone', value: '307-778-7550' }],
  };

  describe('noRecentVisit scenarios', () => {
    it('should return correct message when requestReason is noRecentVisit', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.noRecentVisit],
        directReasons: [],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(/You can.t schedule an appointment online/);
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(/You haven.t had a recent appointment at this facility/i),
      ).to.exist;
      expect(getByText(/Or you can choose a different facility/i)).to.exist;
    });

    it('should return correct message when requestReason is notSupported and directReason is noRecentVisit', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.notSupported],
        directReasons: [ELIGIBILITY_REASONS.noRecentVisit],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(/You can.t schedule an appointment online/);
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(/You haven.t had a recent appointment at this facility/i),
      ).to.exist;
    });
  });

  describe('noClinics and noMatchingClinics scenarios', () => {
    it('should return correct message when requestReason is notSupported and directReason is noClinics', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.notSupported],
        directReasons: [ELIGIBILITY_REASONS.noClinics],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule this appointment online/,
      );
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(
          /We couldn.t find any open appointment times for online scheduling/i,
        ),
      ).to.exist;
      expect(getByText(/You.ll need to call the facility to schedule/i)).to
        .exist;
      expect(getByText(/Or you can go back and choose a different facility/i))
        .to.exist;
    });

    it('should return correct message when requestReason is notSupported and directReason is noMatchingClinics', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.notSupported],
        directReasons: [ELIGIBILITY_REASONS.noMatchingClinics],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule this appointment online/,
      );
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(
          /We couldn.t find any open appointment times for online scheduling/i,
        ),
      ).to.exist;
    });

    it('should return correct message when request is disabled and directReason is noClinics', () => {
      const eligibility = {
        request: false,
        requestReasons: [],
        directReasons: [ELIGIBILITY_REASONS.noClinics],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule this appointment online/,
      );
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(
          /We couldn.t find any open appointment times for online scheduling/i,
        ),
      ).to.exist;
    });

    it('should return correct message when request is disabled and directReason is noMatchingClinics', () => {
      const eligibility = {
        request: false,
        requestReasons: [],
        directReasons: [ELIGIBILITY_REASONS.noMatchingClinics],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule this appointment online/,
      );
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(
          /We couldn.t find any open appointment times for online scheduling/i,
        ),
      ).to.exist;
    });
  });

  describe('error scenarios', () => {
    it('should return error message when directReason is error', () => {
      const eligibility = {
        request: true,
        requestReasons: [],
        directReasons: [ELIGIBILITY_REASONS.error],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule an appointment online right now/,
      );
      expect(result.content).to.match(
        /We.re sorry\. There.s a problem with our system\. Try again later\./,
      );
      expect(result.status).to.equal('error');
    });

    it('should return error message when requestReason is error', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.error],
        directReasons: [],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule an appointment online right now/,
      );
      expect(result.content).to.match(
        /We.re sorry\. There.s a problem with our system\. Try again later\./,
      );
      expect(result.status).to.equal('error');
    });
  });

  describe('notSupported scenarios', () => {
    it('should return correct message when requestReason is notSupported (without noRecentVisit or noClinics)', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.notSupported],
        directReasons: [ELIGIBILITY_REASONS.notEnabled],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /This facility doesn.t accept online scheduling for this care/,
      );
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(
        getByText(
          /You.ll need to call your VA health facility to schedule this appointment/i,
        ),
      ).to.exist;
    });
  });

  describe('overRequestLimit scenarios', () => {
    it('should return correct message when requestReason is overRequestLimit', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.overRequestLimit],
        directReasons: [],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });

      expect(result.title).to.match(
        /You can.t schedule this appointment online/,
      );
      expect(result.status).to.not.equal('error');

      const { getByText } = render(<>{result.content}</>);
      expect(getByText(/You.ll need to call to schedule at this facility/i)).to
        .exist;
      expect(getByText(/Or you can choose a different facility/i)).to.exist;
    });
  });

  describe('FacilityDetails rendering', () => {
    it('should render facility details in noRecentVisit message', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.noRecentVisit],
        directReasons: [],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });
      const { getByText } = render(<>{result.content}</>);

      expect(getByText('Cheyenne VA Medical Center')).to.exist;
    });

    it('should render facility details in noClinics message', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.notSupported],
        directReasons: [ELIGIBILITY_REASONS.noClinics],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });
      const { getByText } = render(<>{result.content}</>);

      expect(getByText('Cheyenne VA Medical Center')).to.exist;
    });

    it('should render facility details in overRequestLimit message', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.overRequestLimit],
        directReasons: [],
      };

      const result = getEligibilityMessage({ eligibility, facilityDetails });
      const { getByText } = render(<>{result.content}</>);

      expect(getByText('Cheyenne VA Medical Center')).to.exist;
    });
  });

  describe('error handling', () => {
    it('should throw error when no matching eligibility reason is found', () => {
      const eligibility = {
        request: true,
        requestReasons: [ELIGIBILITY_REASONS.notEnabled],
        directReasons: [ELIGIBILITY_REASONS.notEnabled],
      };

      expect(() =>
        getEligibilityMessage({ eligibility, facilityDetails }),
      ).to.throw('Missing eligibility display reason');
    });
  });
});
