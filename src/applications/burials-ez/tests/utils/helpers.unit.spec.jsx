import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DateReviewField, maskBankInformation } from '../../utils/helpers';

describe('DateReviewField', () => {
  it('displays date of burial date if it exists', () => {
    const children = {
      props: {
        formData: '2020-01-01',
      },
    };
    const { queryByText, container } = render(
      <DateReviewField title="Date of burial">{children}</DateReviewField>,
    );
    expect(queryByText('Date of burial')).to.exist;
    expect(queryByText('January 1, 2020')).to.exist;
    expect(container.querySelector('.dd-privacy-hidden')).to.have.attribute(
      'data-dd-action-name',
      'Date of burial',
    );
  });
  it('does not display start date if missing', () => {
    const children = { props: {} };
    const { queryByText, container } = render(
      <DateReviewField title="Start date">{children}</DateReviewField>,
    );
    expect(queryByText('Start date')).to.exist;
    expect(queryByText('January 1 2020')).to.be.null;
    expect(container.querySelector('dd')).to.be.empty;
  });
});

describe('maskBankInformation', () => {
  it('returns empty string when input is undefined', () => {
    const { container } = render(
      <span>{maskBankInformation(undefined, 4)}</span>,
    );
    expect(container.textContent).to.equal('');
  });

  it('returns empty string when input is null', () => {
    const { container } = render(<span>{maskBankInformation(null, 4)}</span>);
    expect(container.textContent).to.equal('');
  });

  it('returns empty string when input is empty string', () => {
    const { container } = render(<span>{maskBankInformation('', 4)}</span>);
    expect(container.textContent).to.equal('');
  });

  it('masks all but the last 4 characters when string is longer than unmaskedLength', () => {
    const { container } = render(
      <span>{maskBankInformation('123456789', 4)}</span>,
    );

    // 9 total, keep 4 => mask 5
    expect(container.textContent).to.equal('●●●●●6789');
  });

  it('masks all but the last 1 character when unmaskedLength is 1', () => {
    const { container } = render(<span>{maskBankInformation('1234', 1)}</span>);

    expect(container.textContent).to.equal('●●●4');
  });

  it('does not mask when string length equals unmaskedLength', () => {
    const { container } = render(<span>{maskBankInformation('1234', 4)}</span>);

    expect(container.textContent).to.equal('1234');
  });

  it('does not mask when string length is less than unmaskedLength', () => {
    const { container } = render(<span>{maskBankInformation('123', 4)}</span>);

    expect(container.textContent).to.equal('123');
  });

  it('handles strings with non-digit characters', () => {
    const { container } = render(
      <span>{maskBankInformation('12-34 56', 2)}</span>,
    );

    // length 8, keep 2 => mask 6, last two are "56"
    expect(container.textContent).to.equal('●●●●●●56');
  });
});
