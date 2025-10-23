import { expect } from 'chai';
import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  FirstFAQSection,
  SecondFAQSection,
  ThirdFAQSection,
  FourthFAQSection,
} from '../../components/FAQSections';

describe('FAQSections component', () => {
  let screen;

  describe('DHP Fitbit Pilot section', () => {
    beforeEach(() => {
      screen = renderInReduxProvider(<FirstFAQSection />);
    });

    it('renders with DHP Fitbit Pilot section', () => {
      expect(screen.getByText(/DHP Fitbit Pilot/)).to.exist;
    });

    it('renders the first item', () => {
      const faq = screen.getByTestId('faq-first-section-first-question');
      expect(faq.getAttribute('header')).to.eq('Why are we doing this pilot?');
    });

    it('renders the second item', () => {
      const faq = screen.getByTestId('faq-first-section-second-question');
      expect(faq.getAttribute('header')).to.eq(
        'What can I expect if I participate in this pilot?',
      );
    });

    it('renders the third item', () => {
      const faq = screen.getByTestId('faq-first-section-third-question');
      expect(faq.getAttribute('header')).to.eq(
        'Do I have to participate in this pilot?',
      );
    });
    it('renders the fourth item', () => {
      const faq = screen.getByTestId('faq-first-section-fourth-question');
      expect(faq.getAttribute('header')).to.eq(
        'What is a connected device and why might I use one?',
      );
    });
  });

  describe('Connecting Your Device & Data Sharing section', () => {
    beforeEach(() => {
      screen = renderInReduxProvider(<SecondFAQSection />);
    });

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
        'What will happen if I decide to disconnect my device?',
      );
    });
  });

  describe('Troubleshooting section', () => {
    beforeEach(() => {
      screen = renderInReduxProvider(<ThirdFAQSection />);
    });

    it('renders with Troubleshooting section', () => {
      expect(screen.getByText(/Troubleshooting/)).to.exist;
    });

    it('renders the first item', () => {
      const faq = screen.getByTestId('faq-third-section-first-question');
      expect(faq.getAttribute('header')).to.eq(
        'I am having issues with my Fitbit or my Fitbit account',
      );
    });

    it('renders the second item', () => {
      const faq = screen.getByTestId('faq-third-section-second-question');
      expect(faq.getAttribute('header')).to.eq(
        'I can’t log in or need help with my VA account',
      );
    });
  });

  describe('Feedback section', () => {
    beforeEach(() => {
      screen = renderInReduxProvider(<FourthFAQSection />);
    });

    it('renders with Feedback section', () => {
      expect(screen.getByText(/Feedback/)).to.exist;
    });

    it('renders the first item', () => {
      const faq = screen.getByTestId('faq-fourth-section-first-question');
      expect(faq).to.exist;
      expect(faq.getAttribute('header')).to.eq(
        'I have general questions or feedback about the pilot',
      );
    });
  });
});
