import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';

import DocumentCard from '../../components/DocumentCard';

describe('<DocumentCard>', () => {
  const defaultProps = {
    index: 0,
    variant: 'received',
    requestTypeText: 'You submitted this file as additional evidence.',
  };

  describe('variant: received', () => {
    it('should render with correct testId', () => {
      const { getByTestId } = render(<DocumentCard {...defaultProps} />);
      expect(getByTestId('file-received-card-0')).to.exist;
    });

    it('should render date with "Received on" prefix', () => {
      const { getByText } = render(
        <DocumentCard {...defaultProps} date="2024-01-15" />,
      );
      expect(getByText('Received on January 15, 2024')).to.exist;
    });
  });

  describe('variant: in-progress', () => {
    const inProgressProps = {
      ...defaultProps,
      variant: 'in-progress',
    };

    it('should render with correct testId', () => {
      const { getByTestId } = render(<DocumentCard {...inProgressProps} />);
      expect(getByTestId('file-in-progress-card-0')).to.exist;
    });

    it('should render date with "Submission started on" prefix', () => {
      const { getByText } = render(
        <DocumentCard {...inProgressProps} date="2024-01-15" />,
      );
      expect(getByText('Submission started on January 15, 2024')).to.exist;
    });
  });

  describe('variant: failed', () => {
    const failedProps = {
      ...defaultProps,
      variant: 'failed',
      index: 123,
    };

    it('should render with correct testId using provided index', () => {
      const { getByTestId } = render(<DocumentCard {...failedProps} />);
      expect(getByTestId('failed-file-123')).to.exist;
    });

    it('should render date with "Date failed:" prefix', () => {
      const { getByText } = render(
        <DocumentCard {...failedProps} date="2024-01-15" />,
      );
      expect(getByText('Date failed: January 15, 2024')).to.exist;
    });
  });

  describe('fileName', () => {
    it('should display "File name unknown" when fileName is not provided', () => {
      const { getByText } = render(<DocumentCard {...defaultProps} />);
      expect(getByText('File name unknown')).to.exist;
    });

    it('should display the provided fileName', () => {
      const { getByText } = render(
        <DocumentCard {...defaultProps} fileName="test-document.pdf" />,
      );
      expect(getByText('test-document.pdf')).to.exist;
    });

    it('should have data-dd-privacy="mask" when fileName is provided', () => {
      const { container } = render(
        <DocumentCard {...defaultProps} fileName="test-document.pdf" />,
      );
      const heading = $('.filename-title', container);
      expect(heading.getAttribute('data-dd-privacy')).to.equal('mask');
      expect(heading.getAttribute('data-dd-action-name')).to.equal(
        'document filename',
      );
    });

    it('should not have data-dd-privacy when fileName is not provided', () => {
      const { container } = render(<DocumentCard {...defaultProps} />);
      const heading = $('.filename-title', container);
      expect(heading.getAttribute('data-dd-privacy')).to.be.null;
    });
  });

  describe('statusBadgeText', () => {
    it('should not render status badge when statusBadgeText is not provided', () => {
      const { container } = render(<DocumentCard {...defaultProps} />);
      expect($('.file-status-badge', container)).to.not.exist;
    });

    it('should render status badge when statusBadgeText is provided', () => {
      const { getByText, container } = render(
        <DocumentCard {...defaultProps} statusBadgeText="Pending review" />,
      );
      expect($('.file-status-badge', container)).to.exist;
      expect(getByText('Pending review')).to.exist;
    });

    it('should include screen reader text for status badge', () => {
      const { container } = render(
        <DocumentCard {...defaultProps} statusBadgeText="Pending review" />,
      );
      const srText = container.querySelector(
        '.vads-u-visibility--screen-reader',
      );
      expect(srText.textContent).to.equal('Status');
    });
  });

  describe('documentType', () => {
    it('should not render document type when not provided', () => {
      const { queryByText } = render(<DocumentCard {...defaultProps} />);
      expect(queryByText(/Document type:/)).to.be.null;
    });

    it('should render document type when provided', () => {
      const { getByText } = render(
        <DocumentCard {...defaultProps} documentType="Medical records" />,
      );
      expect(getByText('Document type: Medical records')).to.exist;
    });
  });

  describe('requestTypeText', () => {
    it('should render the request type text', () => {
      const { getByText } = render(
        <DocumentCard
          {...defaultProps}
          requestTypeText="Submitted in response to request: Request 1"
        />,
      );
      expect(getByText('Submitted in response to request: Request 1')).to.exist;
    });
  });

  describe('date', () => {
    it('should not render date when not provided', () => {
      const { container } = render(<DocumentCard {...defaultProps} />);
      expect($('.document-card-date', container)).to.not.exist;
    });

    it('should render date when provided', () => {
      const { container, getByText } = render(
        <DocumentCard {...defaultProps} date="2024-06-20" />,
      );
      expect($('.document-card-date', container)).to.exist;
      expect(getByText('Received on June 20, 2024')).to.exist;
    });
  });

  describe('link', () => {
    const linkProps = {
      href: '/track-claims/your-claims/123/status',
      text: 'Go to the claim associated with this file',
      label: 'Go to the claim associated with this file: test.pdf',
    };

    it('should not render link when not provided', () => {
      const { container } = render(<DocumentCard {...defaultProps} />);
      expect($('va-link', container)).to.not.exist;
    });

    it('should render link when provided', () => {
      const { container } = render(
        <DocumentCard {...defaultProps} link={linkProps} />,
      );
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(linkProps.href);
      expect(link.getAttribute('text')).to.equal(linkProps.text);
      expect(link.getAttribute('label')).to.equal(linkProps.label);
    });
  });

  describe('headingRef', () => {
    it('should call headingRef with the heading element', () => {
      const headingRef = sinon.spy();
      render(<DocumentCard {...defaultProps} headingRef={headingRef} />);
      expect(headingRef.called).to.be.true;
      expect(headingRef.firstCall.args[0].tagName).to.equal('H4');
    });
  });

  describe('heading', () => {
    it('should render h4 heading', () => {
      const { container } = render(<DocumentCard {...defaultProps} />);
      expect($('h4.filename-title', container)).to.exist;
    });

    it('should have tabIndex="-1" for focus management', () => {
      const { container } = render(<DocumentCard {...defaultProps} />);
      const heading = $('.filename-title', container);
      expect(heading.getAttribute('tabIndex')).to.equal('-1');
    });
  });
});
