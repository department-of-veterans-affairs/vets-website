import { expect } from 'chai';
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { FrequentlyAskedQuestions } from '../../components/FrequentlyAskedQuestions';

describe('Frequently asked questions component', () => {
  let screen;
  beforeEach(() => {
    screen = renderInReduxProvider(<FrequentlyAskedQuestions />);
  });
  it('renders with FAQ section', () => {
    expect(screen.getByText(/Frequently asked questions/)).to.exist;
  });
  it('renders the first question', () => {
    expect(
      screen.getByText(/What are connected devices and why might I use them?/),
    ).to.exist;
  });
  it('renders the first question in the Connecting Your Device & Data Sharing section', () => {
    const firstFaq = screen.getByTestId('connecting-sharing-one-faq');
    expect(firstFaq.getAttribute('header')).to.eq(
      'How can I connect my devices?',
    );
  });
  it('renders the second question in the Connecting Your Device & Data Sharing section', () => {
    const secondFaq = screen.getByTestId('connecting-sharing-two-faq');
    expect(secondFaq.getAttribute('header')).to.eq(
      'Can I stop sharing my connected device data with VA?',
    );
  });
  it('renders the fourth question', () => {
    const fourthFaq = screen.getByTestId('connecting-sharing-three-faq');
    expect(fourthFaq.getAttribute('header')).to.eq(
      'What information can VA access from my devices?',
    );
  });
  it('renders the fifth question', () => {
    const fifthFaq = screen.getByTestId('connecting-sharing-four-faq');
    expect(fifthFaq.getAttribute('header')).to.eq(
      'Who can access data from my connected devices?',
    );
  });
  it('renders the fifth question', () => {
    const fifthFaq = screen.getByTestId('connecting-sharing-four-faq');
    expect(fifthFaq.getAttribute('header')).to.eq(
      'Who can access data from my connected devices?',
    );
  });

  it('renders the sixth question', () => {
    const sixthFaq = screen.getByTestId('connecting-sharing-six-faq');
    expect(sixthFaq.getAttribute('header')).to.eq(
      'Does VA keep my data after I disconnect a device?',
    );
  });
});
