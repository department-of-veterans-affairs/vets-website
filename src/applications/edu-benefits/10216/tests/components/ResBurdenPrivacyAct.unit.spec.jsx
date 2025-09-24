import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import ResBurdenPrivacyAct from '../../components/ResBurdenPrivacyAct';

describe('Respondent Burden & Privacy Act Notice content', () => {
  it('Renders two paragraphs', () => {
    const { container } = render(<ResBurdenPrivacyAct />);
    expect(container.querySelectorAll('p')).length.to.be(2);
  });
});
