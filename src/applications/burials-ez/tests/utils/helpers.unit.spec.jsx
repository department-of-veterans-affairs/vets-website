import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DateReviewField } from '../../utils/helpers';

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
