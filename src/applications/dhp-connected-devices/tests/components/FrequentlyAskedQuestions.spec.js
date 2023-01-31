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
