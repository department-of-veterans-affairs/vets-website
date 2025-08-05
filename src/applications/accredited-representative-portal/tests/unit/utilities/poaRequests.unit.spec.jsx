import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as dateUtils from 'platform/utilities/date';
import * as poa from '../../../utilities/poaRequests';

describe('poaRequests utilities', () => {
  describe('expiresSoon', () => {
    it('returns expiry string if within range', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      const result = poa.expiresSoon(future.toISOString());
      expect(result).to.match(/expires in/);
    });

    it('returns null if already expired', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const result = poa.expiresSoon(past.toISOString());
      expect(result).to.be.null;
    });
  });

  describe('expiresSoonIcon', () => {
    it('returns true if expires in < 7 days', () => {
      const soon = new Date();
      soon.setDate(soon.getDate() + 3);
      expect(poa.expiresSoonIcon(soon.toISOString())).to.be.true;
    });

    it('returns null if already expired', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(poa.expiresSoonIcon(past.toISOString())).to.be.null;
    });

    it('returns null if expiry is far in future', () => {
      const later = new Date();
      later.setDate(later.getDate() + 30);
      expect(poa.expiresSoonIcon(later.toISOString())).to.be.null;
    });
  });

  describe('requestsContainStatus', () => {
    const mockRequests = [
      { resolution: null },
      { resolution: { decisionType: 'declination' } },
      { resolution: { type: 'acceptance' } },
    ];

    it('returns first pending request', () => {
      const result = poa.requestsContainStatus('pending', mockRequests);
      expect(result.resolution).to.be.null;
    });

    it('returns match by decisionType', () => {
      const result = poa.requestsContainStatus('declination', mockRequests);
      expect(result.resolution.decisionType).to.equal('declination');
    });

    it('returns match by type', () => {
      const result = poa.requestsContainStatus('acceptance', mockRequests);
      expect(result.resolution.type).to.equal('acceptance');
    });
  });

  describe('formatStatus', () => {
    it('maps known statuses correctly', () => {
      expect(poa.formatStatus('declination')).to.equal('Declined');
      expect(poa.formatStatus('acceptance')).to.equal('Accepted');
      expect(poa.formatStatus('expiration')).to.equal('Expired');
      expect(poa.formatStatus(null)).to.equal('Pending');
    });
  });

  describe('formSubmissionStatus', () => {
    it('renders processing message', () => {
      const { getByText } = render(poa.formSubmissionStatus('PENDING'));
      expect(getByText(/processing/i)).to.exist;
    });

    it('renders failed message', () => {
      const { getByText } = render(poa.formSubmissionStatus('FAILED'));
      expect(getByText(/couldn’t process/i)).to.exist;
    });

    it('returns null for unknown status', () => {
      const result = poa.formSubmissionStatus('foo');
      expect(result).to.be.null;
    });
  });

  describe('hideStatus', () => {
    it('returns class for processing and failed', () => {
      expect(poa.hideStatus('PENDING')).to.equal('vads-u-display--none');
      expect(poa.hideStatus('FAILED')).to.equal('vads-u-display--none');
    });

    it('returns null for other values', () => {
      expect(poa.hideStatus('SUCCESS')).to.be.null;
    });
  });

  describe('resolutionDate', () => {
    it('renders formatted date in span', () => {
      const stub = sinon
        .stub(dateUtils, 'formatDateParsedZoneLong')
        .returns('July 4, 2025');
      const { getByText } = render(poa.resolutionDate('2025-07-04', 'abc123'));
      expect(getByText('July 4, 2025')).to.exist;
      stub.restore();
    });
  });

  describe('breadcrumb constants', () => {
    it('HelpBC contains correct structure', () => {
      expect(poa.HelpBC)
        .to.be.an('array')
        .with.length(2);
    });

    it('findClaimantBC includes current URL', () => {
      expect(poa.findClaimantBC[1].href).to.equal(window.location.href);
    });
  });
});
