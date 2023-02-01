import { expect } from 'chai';
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { FrequentlyAskedQuestions } from '../../components/FrequentlyAskedQuestions';

describe('Frequently asked questions component', () => {
  let screen;
  beforeEach(() => {
    screen = renderInReduxProvider(<FrequentlyAskedQuestions />);
  });

  describe('DHP Fitbit Pilot section', () => {
    it('renders with DHP Fitbit Pilot section', () => {
      expect(screen.getByText(/DHP Fitbit Pilot/)).to.exist;
    });

    it('renders the first item', () => {
      const faq = screen.getByTestId('pilot-first-faq');
      expect(faq.getAttribute('header')).to.eq(
        'Why are we doing this pilot with Fitbit?',
      );
    });

    it('renders the second item', () => {
      const faq = screen.getByTestId('pilot-second-faq');
      expect(faq.getAttribute('header')).to.eq(
        'Do I have to participate in this pilot?',
      );
    });

    it('renders the third item', () => {
      const faq = screen.getByTestId('pilot-third-faq');
      expect(faq.getAttribute('header')).to.eq(
        'What is a connected device and why might I use one?',
      );
    });
  });

  describe('Connecting Your Device & Data Sharing section', () => {
    it('renders with Connecting Your Device & Data Sharing section', () => {
      expect(screen.getByText(/Connecting Your Device & Data Sharing/)).to
        .exist;
    });

    it('renders the first item', () => {
      const faq = screen.getByTestId('faq-second-section-first-question');
      expect(faq.getAttribute('header')).to.eq('How can I connect my device?');
    });

    it('renders the second item', () => {
      const faq = screen.getByTestId('faq-second-section-second-question');
      expect(faq.getAttribute('header')).to.eq(
        'Can I stop sharing my connected device data with VA?',
      );
    });

    it('renders the third item', () => {
      const faq = screen.getByTestId('faq-second-section-third-question');
      expect(faq.getAttribute('header')).to.eq(
        'What information can VA access from the devices that I have connected on VA.gov?',
      );
    });

    it('renders the fourth item', () => {
      const faq = screen.getByTestId('faq-second-section-fourth-question');
      expect(faq.getAttribute('header')).to.eq(
        'Who can access data from the devices I have connected on VA.gov?',
      );
    });

    it('renders the fifth item', () => {
      const faq = screen.getByTestId('faq-second-section-fifth-question');
      expect(faq.getAttribute('header')).to.eq(
        'How will my private information be protected?',
      );
    });

    it('renders the sixth item', () => {
      const faq = screen.getByTestId('faq-second-section-sixth-question');
      expect(faq.getAttribute('header')).to.eq(
        'Does VA keep my data after I disconnect a device?',
      );
    });
  });

  describe('Troubleshooting section', () => {
    it('renders with Troubleshooting section', () => {
      expect(screen.getByText(/Troubleshooting/)).to.exist;
    });

    it('renders the first item', () => {
      const faq = screen.getByTestId('troubleshooting-first-faq');
      expect(faq.getAttribute('header')).to.eq(
        'I am having issues with my Fitbit or my Fitbit account',
      );
    });

    it('renders the second item', () => {
      const faq = screen.getByTestId('troubleshooting-second-faq');
      expect(faq.getAttribute('header')).to.eq(
        'I can’t login or need help with my VA account',
      );
    });
  });

  describe('Feedback section', () => {
    it('renders with Feedback section', () => {
      expect(screen.getByText(/Feedback/)).to.exist;
    });
    it('renders the first item', () => {
      const faq = screen.getByTestId('feedback-first-faq');
      expect(faq.getAttribute('header')).to.eq(
        'I have general questions or feedback about the pilot',
      );
    });
  });
});
