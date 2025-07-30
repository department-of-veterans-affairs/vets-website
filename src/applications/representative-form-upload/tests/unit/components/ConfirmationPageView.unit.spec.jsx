import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ConfirmationPageView } from '../../../components/ConfirmationPageView';

describe('ConfirmationPageView', () => {
  it('shows status success and the correct confirmation number and submitted date', () => {
    const confirmationNumber = '123456';
    const submitDate = new Date(2025, 4, 21);
    const formNumber = '21-686c';

    const { getByText, container } = render(
      <ConfirmationPageView
        confirmationNumber={confirmationNumber}
        submitDate={submitDate}
        formNumber={formNumber}
        childContent={null}
      />,
    );

    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    expect(getByText('Your confirmation number is:')).to.exist;
    expect(getByText('123456')).to.exist;
    expect(getByText('You submitted the form and supporting evidence on')).to
      .exist;
    expect(getByText(/May 21, 2025/)).to.exist;
  });
});
