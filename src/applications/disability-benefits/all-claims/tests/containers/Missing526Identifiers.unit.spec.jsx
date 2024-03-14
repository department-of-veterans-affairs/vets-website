import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Missing526Identifiers } from '../../containers/Missing526Identifiers';

describe('Form 526 Missing Identifiers Error Message', () => {
  describe('One identifier missing', () => {
    const props = {
      title: 'File for disability compensation',
      form526RequiredIdentifers: {
        participantId: true,
        birlsId: true,
        ssn: true,
        birthDate: true,
        edipi: false,
      },
    };

    it('should render a message noting the missing identifier', () => {
      const tree = render(<Missing526Identifiers {...props} />);
      const messageParagraph = tree.container.querySelector('p');

      expect(messageParagraph.textContent).match(/^We’re missing your EDIPI\./);
    });

    it('logs a Google Analytics event with the missing identifier as the key', () => {
      render(<Missing526Identifiers {...props} />);
      // Google Analytics events logging is stored in the dataLayer property of the window object
      const lastGoogleAnalyticsEvent = global.window.dataLayer.slice(-1)[0];

      expect(lastGoogleAnalyticsEvent.event).to.equal('visible-alert-box');
      expect(lastGoogleAnalyticsEvent['error-key']).to.equal(
        'missing_526_identifiers_edipi',
      );
    });
  });

  describe('Two identifiers missing', () => {
    const props = {
      title: 'File for disability compensation',
      form526RequiredIdentifers: {
        participantId: true,
        birlsId: true,
        ssn: false,
        birthDate: true,
        edipi: false,
      },
    };

    it("returns the missing identifiers separated with 'and'", () => {
      const tree = render(<Missing526Identifiers {...props} />);
      const messageParagraph = tree.container.querySelector('p');

      expect(messageParagraph.textContent).match(
        /^We’re missing your Social Security Number and EDIPI\./,
      );
    });

    it('logs a Google Analytics event with the missing identifiers as the key', () => {
      render(<Missing526Identifiers {...props} />);
      const lastGoogleAnalyticsEvent = global.window.dataLayer.slice(-1)[0];

      expect(lastGoogleAnalyticsEvent.event).to.equal('visible-alert-box');
      expect(lastGoogleAnalyticsEvent['error-key']).to.equal(
        'missing_526_identifiers_ssn_edipi',
      );
    });
  });

  describe('More than two identifiers missing', () => {
    const props = {
      title: 'File for disability compensation',
      form526RequiredIdentifers: {
        participantId: false,
        birlsId: true,
        ssn: false,
        birthDate: true,
        edipi: false,
      },
    };

    it('returns the missing identifiers in a comma separated list', () => {
      const tree = render(<Missing526Identifiers {...props} />);
      const messageParagraph = tree.container.querySelector('p');

      expect(messageParagraph.textContent).match(
        /^We’re missing your Participant ID, Social Security Number, and EDIPI\./,
      );
    });

    it('logs a Google Analytics event with the missing identifiers as the key', () => {
      render(<Missing526Identifiers {...props} />);
      const lastGoogleAnalyticsEvent = global.window.dataLayer.slice(-1)[0];

      expect(lastGoogleAnalyticsEvent.event).to.equal('visible-alert-box');
      expect(lastGoogleAnalyticsEvent['error-key']).to.equal(
        'missing_526_identifiers_participantId_ssn_edipi',
      );
    });
  });
});
