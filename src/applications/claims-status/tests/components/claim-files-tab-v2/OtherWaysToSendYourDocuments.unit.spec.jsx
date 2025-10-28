import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import OtherWaysToSendYourDocuments from '../../../components/claim-files-tab-v2/OtherWaysToSendYourDocuments';
import {
  MAILING_ADDRESS,
  CONTACT_INFO,
  LINKS,
  ANCHOR_LINKS,
} from '../../../constants';

describe('<OtherWaysToSendYourDocuments>', () => {
  let getByText;
  let container;

  beforeEach(() => {
    const result = render(<OtherWaysToSendYourDocuments />);
    getByText = result.getByText;
    container = result.container;
  });

  describe('Main Structure', () => {
    it('should render the main heading', () => {
      expect(getByText('Other ways to send your documents')).to.exist;
    });

    it('should render the main heading with correct id', () => {
      const heading = container.querySelector('h2#other-ways-to-send');
      expect(heading).to.exist;
      expect(heading.getAttribute('id')).to.equal(
        ANCHOR_LINKS.otherWaysToSendDocuments,
      );
    });

    it('should render the general instructions', () => {
      expect(
        getByText(
          'Print a copy of each document and write your Social Security number on the first page. Then resubmit by mail or in person.',
        ),
      ).to.exist;
    });

    it('should have the scroll-anchor class for accessibility', () => {
      const mainDiv = container.querySelector('#other-ways-to-send-documents');
      expect(mainDiv).to.exist;
      expect(mainDiv).to.have.class('scroll-anchor');
    });
  });

  describe('Mail Section', () => {
    it('should render the mail section heading', () => {
      expect(getByText('Option 1: By mail')).to.exist;
    });

    it('should render the Option 1 general instructions', () => {
      expect(getByText('Mail the document to this address:')).to.exist;
    });

    it('should render the Option 1 mailing address', () => {
      expect(container.textContent).to.include(MAILING_ADDRESS.organization);
    });
  });

  describe('In-Person Section', () => {
    it('should render the in-person section heading', () => {
      expect(getByText('Option 2: In person')).to.exist;
    });

    it('should render the Option 2 general instructions', () => {
      expect(getByText('Bring the document to a VA regional office.')).to.exist;
    });

    it('should render the Option 2 link to find a VA regional office', () => {
      const link = container.querySelector(
        `va-link[href="${LINKS.findVaLocations}"]`,
      );
      expect(link).to.exist;
      expect(link.getAttribute('text')).to.equal(
        'Find a VA regional office near you',
      );
    });
  });

  describe('Confirmation Section', () => {
    it('should render the confirmation section heading', () => {
      expect(getByText('How to confirm we\u2019ve received your documents')).to
        .exist;
    });

    it('should render the confirmation section instructions', () => {
      expect(
        getByText(
          `To confirm we\u2019ve received a document you submitted by mail or in person, call us at ${
            CONTACT_INFO.phone
          } (TTY: ${CONTACT_INFO.tty}). We\u2019re here ${CONTACT_INFO.hours}.`,
        ),
      ).to.exist;
    });
  });
});
