import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import OtherWaysToSendYourDocuments from '../../../components/claim-files-tab-v2/OtherWaysToSendYourDocuments';

describe('<OtherWaysToSendYourDocuments>', () => {
  describe('Main Structure', () => {
    it('should render the main heading', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(getByText('Other ways to send your documents')).to.exist;
    });

    it('should render the general instructions', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(
        getByText(
          'Print a copy of each document and write your Social Security number on the first page. Then resubmit by mail or in person.',
        ),
      ).to.exist;
    });
  });

  describe('Mail Section', () => {
    it('should render the mail section heading', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(getByText('Option 1: By mail')).to.exist;
    });

    it('should render the Option 1 general instructions', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(getByText('Mail the document to this address:')).to.exist;
    });

    it('should render the Option 1 mailing address', () => {
      const { container } = render(<OtherWaysToSendYourDocuments />);
      expect(container.textContent).to.include(
        'Department of Veterans Affairs',
      );
    });
  });

  describe('In-Person Section', () => {
    it('should render the in-person section heading', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(getByText('Option 2: In person')).to.exist;
    });

    it('should render the Option 2 general instructions', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(getByText('Bring the document to a VA regional office.')).to.exist;
    });

    it('should render the Option 2 link to find a VA regional office', () => {
      const { container } = render(<OtherWaysToSendYourDocuments />);
      const link = container.querySelector('va-link[href="/find-locations"]');
      expect(link).to.exist;
      expect(link.getAttribute('text')).to.equal(
        'Find a VA regional office near you',
      );
    });
  });

  describe('Confirmation Section', () => {
    it('should render the confirmation section heading', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(getByText('How to confirm we’ve received your documents')).to
        .exist;
    });

    it('should render the confirmation section instructions', () => {
      const { getByText } = render(<OtherWaysToSendYourDocuments />);
      expect(
        getByText(
          'To confirm we’ve received a document you submitted by mail or in person, call us at 800-827-1000 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
        ),
      ).to.exist;
    });
  });
});
