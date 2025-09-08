import React from 'react';
import { render } from '@testing-library/react';
import SupplementaryStatementsIntro from '../../../../components/08-supplementary-statements-chapter/SupplementaryStatementsIntro';

describe('Supplementary Statements Intro Page', () => {
  it('renders the intro page paragraphs and list items', () => {
    const { getByText } = render(<SupplementaryStatementsIntro />);
    getByText(
      /On the next page you will be asked to provide any additional explanations for your answers in previous sections and additional information about why you are applying. These questions are optional./,
    );
  });
});
