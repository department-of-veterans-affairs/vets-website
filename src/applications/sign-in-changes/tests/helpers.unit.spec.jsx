import { render } from '@testing-library/react';
import { expect } from 'chai';
import { maskEmail } from '../helpers';

describe('maskEmail', () => {
  it('masks the email name after the second character with *', () => {
    const screen = render(maskEmail('johndo@example.com', 'masked-email'));
    const span = screen.getByTestId('masked-email');
    expect(span).to.have.text('joh***@example.com');
    expect(span).to.have.attribute(
      'aria-label',
      'Email address starting with joh at example.com',
    );
  });

  it('does not mask the name if it three characters', () => {
    const screen = render(maskEmail('abc@example.com', 'masked-email-1'));
    const span = screen.getByTestId('masked-email-1');
    expect(span).to.have.text('abc@example.com');
    expect(span).to.have.attribute(
      'aria-label',
      'Email address starting with abc at example.com',
    );
  });

  it('does not mask the name if it has less than three characters', () => {
    const screen = render(maskEmail('a@example.com', 'masked-email-3'));
    const span = screen.getByTestId('masked-email-3');
    expect(span).to.have.text('a@example.com');
    expect(span).to.have.attribute(
      'aria-label',
      'Email address starting with a at example.com',
    );
  });

  it('returns a span with an appropriate aria-label if email is an empty string', () => {
    const screen = render(maskEmail('', 'masked-email-empty'));
    const span = screen.getByTestId('masked-email-empty');
    expect(span).to.have.text('No email provided');
  });
});
