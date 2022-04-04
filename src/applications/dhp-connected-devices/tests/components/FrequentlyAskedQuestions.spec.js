import { expect } from 'chai';
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { FrequentlyAskedQuestions } from '../../components/FrequentlyAskedQuestions';

describe('Frequently asked questions component', () => {
  it('renders with FAQ section', () => {
    const screen = renderInReduxProvider(<FrequentlyAskedQuestions />);
    expect(screen.getByText(/Frequently asked questions/)).to.exist;
    expect(screen.getByText(/Question 1/)).to.exist;
  });
});
