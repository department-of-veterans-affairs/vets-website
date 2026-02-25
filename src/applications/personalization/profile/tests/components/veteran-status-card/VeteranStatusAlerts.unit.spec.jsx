import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  NoServiceHistoryAlert,
  NotConfirmedAlert,
  PDFErrorAlert,
  SystemErrorAlert,
} from '../../../components/veteran-status-card/VeteranStatusAlerts';

describe('VeteranStatusAlerts', () => {
  describe('NoServiceHistoryAlert', () => {
    it('renders no service history alert with correct headline and content', () => {
      const { getByText } = render(<NoServiceHistoryAlert />);
      expect(
        getByText(
          'We can’t match your information to any military service records',
        ),
      ).to.exist;
      expect(getByText('We’re sorry for this issue.')).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '8005389552'
          );
        }),
      ).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '711'
          );
        }),
      ).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-link' &&
            element.getAttribute('href') ===
              'https://www.archives.gov/veterans/military-service-records/correct-service-records.html' &&
            element.getAttribute('text') ===
              'Learn how to correct your military service records on the National Archives website'
          );
        }),
      ).to.exist;
    });
  });

  describe('NotConfirmedAlert', () => {
    it('renders headline and messages', () => {
      const { getByText } = render(
        <NotConfirmedAlert
          headline="Test Headline"
          message={['Test message 1', 'Test message 2']}
        />,
      );
      expect(getByText('Test Headline')).to.exist;
      expect(getByText('Test message 1')).to.exist;
      expect(getByText('Test message 2')).to.exist;
    });

    it('renders contact numbers as va-telephone links', () => {
      const message = 'Call us at 800-538-9552 (TTY: 711) for help.';
      const { getByText } = render(<NotConfirmedAlert message={[message]} />);
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '800-538-9552'
          );
        }),
      ).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '711'
          );
        }),
      ).to.exist;
    });

    it('renders without any properties', () => {
      const { container } = render(<NotConfirmedAlert />);
      expect(container.querySelector('va-alert[status="warning"]')).to.exist;
    });
  });

  describe('PDFErrorAlert', () => {
    it('renders the PDF error alert', () => {
      const { getByText } = render(<PDFErrorAlert />);
      expect(getByText('Something went wrong')).to.exist;
      expect(
        getByText('We’re sorry. Try to print your Veteran Status Card later.'),
      ).to.exist;
    });
  });

  describe('SystemErrorAlert', () => {
    it('renders the system error alert', () => {
      const { getByText } = render(<SystemErrorAlert />);
      expect(getByText('Something went wrong')).to.exist;
      expect(
        getByText('We’re sorry. Try to view your Veteran Status Card later.'),
      ).to.exist;
    });
  });
});
