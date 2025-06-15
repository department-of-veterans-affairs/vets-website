import { expect } from 'chai';
import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { FrequentlyAskedQuestions } from '../../components/FrequentlyAskedQuestions';

describe('Frequently asked questions component', () => {
  let screen;
  beforeEach(() => {
    screen = renderInReduxProvider(<FrequentlyAskedQuestions />);
  });

  it('renders first section', () => {
    const faq = screen.getByTestId('faq-first-section');
    expect(faq).to.exist;
  });

  it('renders second section', () => {
    const faq = screen.getByTestId('faq-second-section');
    expect(faq).to.exist;
  });

  it('renders third section', () => {
    const faq = screen.getByTestId('faq-third-section');
    expect(faq).to.exist;
  });

  it('renders fourth section', () => {
    const faq = screen.getByTestId('faq-fourth-section');
    expect(faq).to.exist;
  });
});
