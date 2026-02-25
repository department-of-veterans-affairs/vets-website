import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DocumentsNeeded from '../../components/DocumentsNeeded';
import { serviceStatuses } from '../../constants';

describe('DocumentsNeeded', () => {
  describe('VETERAN status', () => {
    it('should display single document message without one-time restoration', () => {
      const formData = {
        identity: serviceStatuses.VETERAN,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration={false} />,
      );

      const text = container.textContent;
      expect(text).to.include(
        'you’ll need to upload a copy of your discharge or separation papers (DD214) showing character of service.',
      );
      expect(text).to.not.include('Evidence of a VA loan was paid in full');
    });

    it('should display multiple documents message with one-time restoration', () => {
      const formData = {
        identity: serviceStatuses.VETERAN,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include(
        'A copy of your discharge or separation papers (DD214) showing character of service',
      );
      expect(text).to.include('Evidence of a VA loan was paid in full');
    });
  });

  describe('ADSM status', () => {
    it('should display single document message without Purple Heart or restoration', () => {
      const formData = {
        identity: serviceStatuses.ADSM,
        militaryHistory: {
          purpleHeartRecipient: false,
        },
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration={false} />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload a Statement of Service.');
      expect(text).to.not.include('Purple Heart certificate');
      expect(text).to.not.include('Evidence of a VA loan was paid in full');
    });

    it('should display multiple documents with Purple Heart', () => {
      const formData = {
        identity: serviceStatuses.ADSM,
        militaryHistory: {
          purpleHeartRecipient: true,
        },
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration={false} />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Statement of Service');
      expect(text).to.include('A copy of your Purple Heart certificate');
      expect(text).to.not.include('Evidence of a VA loan was paid in full');
    });

    it('should display multiple documents with one-time restoration', () => {
      const formData = {
        identity: serviceStatuses.ADSM,
        militaryHistory: {
          purpleHeartRecipient: false,
        },
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Statement of Service');
      expect(text).to.include('Evidence of a VA loan was paid in full');
    });

    it('should display all documents with Purple Heart and restoration', () => {
      const formData = {
        identity: serviceStatuses.ADSM,
        militaryHistory: {
          purpleHeartRecipient: true,
        },
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Statement of Service');
      expect(text).to.include('A copy of your Purple Heart certificate');
      expect(text).to.include('Evidence of a VA loan was paid in full');
    });
  });

  describe('NADNA status', () => {
    it('should display required documents without restoration', () => {
      const formData = {
        identity: serviceStatuses.NADNA,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration={false} />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Statement of Service');
      expect(text).to.include(
        'Creditable number of years served or Retirement Points Statement or equivalent',
      );
      expect(text).to.not.include('Evidence of a VA loan was paid in full');
    });

    it('should display required documents with restoration', () => {
      const formData = {
        identity: serviceStatuses.NADNA,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Statement of Service');
      expect(text).to.include(
        'Creditable number of years served or Retirement Points Statement or equivalent',
      );
      expect(text).to.include('Evidence of a VA loan was paid in full');
    });
  });

  describe('DNANA status', () => {
    it('should display required documents without restoration', () => {
      const formData = {
        identity: serviceStatuses.DNANA,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration={false} />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include(
        'Separation and Report of Service (NGB Form 22) for each period of National Guard service',
      );
      expect(text).to.include('Retirement Points Accounting (NGB Form 23)');
      expect(text).to.include(
        'Proof of character of service such as a DD214 or Department of Defense Discharge Certificate',
      );
      expect(text).to.not.include('Evidence of a VA loan was paid in full');
    });

    it('should display required documents with restoration', () => {
      const formData = {
        identity: serviceStatuses.DNANA,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include(
        'Separation and Report of Service (NGB Form 22) for each period of National Guard service',
      );
      expect(text).to.include('Retirement Points Accounting (NGB Form 23)');
      expect(text).to.include(
        'Proof of character of service such as a DD214 or Department of Defense Discharge Certificate',
      );
      expect(text).to.include('Evidence of a VA loan was paid in full');
    });
  });

  describe('DRNA status', () => {
    it('should display required documents without restoration', () => {
      const formData = {
        identity: serviceStatuses.DRNA,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration={false} />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Retirement Point Accounting');
      expect(text).to.include(
        'Proof of honorable service for at least six years such as a DD214 or Department of Defense Discharge Certificate',
      );
      expect(text).to.not.include('Evidence of a VA loan was paid in full');
    });

    it('should display required documents with restoration', () => {
      const formData = {
        identity: serviceStatuses.DRNA,
      };

      const { container } = render(
        <DocumentsNeeded formData={formData} hasOneTimeRestoration />,
      );

      const text = container.textContent;
      expect(text).to.include('you’ll need to upload these documents:');
      expect(text).to.include('Retirement Point Accounting');
      expect(text).to.include(
        'Proof of honorable service for at least six years such as a DD214 or Department of Defense Discharge Certificate',
      );
      expect(text).to.include('Evidence of a VA loan was paid in full');
    });
  });
});
