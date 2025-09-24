import { render } from '@testing-library/react';
import { expect } from 'chai';
import { maskEmail } from '../helpers';

describe('maskEmail', () => {
  it('masks the email name after the second character with *', () => {
    const { getByTestId } = render(
      maskEmail('johndo@example.com', 'masked-email'),
    );
    const span = getByTestId('masked-email');
    expect(span.textContent).to.equal('joh***@example.com');
    expect(span.getAttribute('aria-label')).to.equal(
      'Email address starting with joh at example.com',
    );
  });

  it('does not mask the name if it has three characters', () => {
    const { getByTestId } = render(
      maskEmail('abc@example.com', 'masked-email-1'),
    );
    const span = getByTestId('masked-email-1');
    expect(span.textContent).to.equal('abc@example.com');
    expect(span.getAttribute('aria-label')).to.equal(
      'Email address starting with abc at example.com',
    );
  });

  it('does not mask the name if it has less than three characters', () => {
    const { getByTestId } = render(
      maskEmail('a@example.com', 'masked-email-3'),
    );
    const span = getByTestId('masked-email-3');
    expect(span.textContent).to.equal('a@example.com');
    expect(span.getAttribute('aria-label')).to.equal(
      'Email address starting with a at example.com',
    );
  });

  it('returns a span with an appropriate aria-label if email is an empty string', () => {
    const { getByTestId } = render(maskEmail('', 'masked-email-empty'));
    const span = getByTestId('masked-email-empty');
    expect(span.textContent).to.equal('No email provided');
  });
});
