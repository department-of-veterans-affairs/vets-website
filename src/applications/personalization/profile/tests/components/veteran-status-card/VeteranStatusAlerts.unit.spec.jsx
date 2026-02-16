import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  NoServiceHistoryAlert,
  NotConfirmedAlert,
  PDFErrorAlert,
  SystemErrorAlert,
  DynamicVeteranStatusAlert,
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

  describe('DynamicVeteranStatusAlert', () => {
    it('renders alert with header and text body items', () => {
      const attributes = {
        header: 'Test Alert Header',
        body: [
          { type: 'text', value: 'First text message' },
          { type: 'text', value: 'Second text message' },
        ],
        alert_type: 'warning', // eslint-disable-line camelcase -- API response uses snake_case
      };
      const { getByText } = render(
        <DynamicVeteranStatusAlert attributes={attributes} />,
      );
      expect(getByText('Test Alert Header')).to.exist;
      expect(getByText('First text message')).to.exist;
      expect(getByText('Second text message')).to.exist;
    });

    it('renders alert with phone body items', () => {
      const attributes = {
        header: 'Contact Us',
        body: [{ type: 'phone', value: '800-698-2411', tty: true }],
        alert_type: 'warning', // eslint-disable-line camelcase -- API response uses snake_case
      };
      const { getByText } = render(
        <DynamicVeteranStatusAlert attributes={attributes} />,
      );
      expect(getByText('Contact Us')).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '800-698-2411'
          );
        }),
      ).to.exist;
      // Check for TTY telephone
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '711' &&
            element.hasAttribute('tty')
          );
        }),
      ).to.exist;
    });

    it('renders alert with link body items', () => {
      const attributes = {
        header: 'Learn More',
        body: [
          {
            type: 'link',
            value: 'Learn how to correct your records',
            url: 'https://example.com/correct-records',
          },
        ],
        alert_type: 'info', // eslint-disable-line camelcase -- API response uses snake_case
      };
      const { getByText } = render(
        <DynamicVeteranStatusAlert attributes={attributes} />,
      );
      expect(getByText('Learn More')).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-link' &&
            element.getAttribute('href') ===
              'https://example.com/correct-records' &&
            element.getAttribute('text') === 'Learn how to correct your records'
          );
        }),
      ).to.exist;
    });

    it('renders alert with mixed body item types', () => {
      const attributes = {
        header: 'Mixed Content Alert',
        body: [
          { type: 'text', value: 'You are not eligible.' },
          { type: 'phone', value: '866-279-3677', tty: false },
          { type: 'link', value: 'Get help', url: 'https://va.gov/help' },
        ],
        alert_type: 'error', // eslint-disable-line camelcase -- API response uses snake_case
      };
      const { getByText, container } = render(
        <DynamicVeteranStatusAlert attributes={attributes} />,
      );
      expect(getByText('Mixed Content Alert')).to.exist;
      expect(getByText('You are not eligible.')).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-telephone' &&
            element.getAttribute('contact') === '866-279-3677'
          );
        }),
      ).to.exist;
      expect(
        getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'va-link' &&
            element.getAttribute('text') === 'Get help'
          );
        }),
      ).to.exist;
      // Check alert status
      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('status')).to.equal('error');
    });

    it('defaults to warning status when alert_type is not provided', () => {
      const attributes = {
        header: 'Default Status Alert',
        body: [{ type: 'text', value: 'Some message' }],
      };
      const { container } = render(
        <DynamicVeteranStatusAlert attributes={attributes} />,
      );
      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('status')).to.equal('warning');
    });

    it('renders without header when header is not provided', () => {
      const attributes = {
        body: [{ type: 'text', value: 'Message without header' }],
        alert_type: 'info', // eslint-disable-line camelcase -- API response uses snake_case
      };
      const { getByText, container } = render(
        <DynamicVeteranStatusAlert attributes={attributes} />,
      );
      expect(getByText('Message without header')).to.exist;
      expect(container.querySelector('h2[slot="headline"]')).to.be.null;
    });
  });
});
