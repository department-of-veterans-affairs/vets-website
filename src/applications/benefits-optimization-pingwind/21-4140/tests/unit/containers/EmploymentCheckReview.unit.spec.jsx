import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EmploymentCheckReview from '../../../containers/EmploymentCheckReview';
import { employmentCheckFields } from '../../../definitions/constants';

describe('21-4140 container/EmploymentCheckReview', () => {
  it('renders message for employed in past 12 months', () => {
    const data = {
      [employmentCheckFields.parentObject]: {
        [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
      },
    };

    const { getByText } = render(<EmploymentCheckReview data={data} />);

    expect(
      getByText(
        'You told us you worked during the past 12 months. The employers you added are listed below.',
      ),
    ).to.exist;
  });

  it('renders message for not employed in past 12 months', () => {
    const data = {
      [employmentCheckFields.parentObject]: {
        [employmentCheckFields.hasEmploymentInLast12Months]: 'no',
      },
    };

    const { getByText } = render(<EmploymentCheckReview data={data} />);

    expect(
      getByText(
        "We skipped Section II because you told us you didn't work in the past 12 months.",
      ),
    ).to.exist;
  });

  it('renders the review row with correct structure', () => {
    const data = {
      [employmentCheckFields.parentObject]: {
        [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
      },
    };

    const { container } = render(<EmploymentCheckReview data={data} />);

    const reviewRow = container.querySelector('.review-row');
    expect(reviewRow).to.exist;

    const dt = reviewRow.querySelector('dt');
    expect(dt.textContent).to.equal('Employment in the past 12 months');

    const dd = reviewRow.querySelector('dd');
    expect(dd).to.exist;

    const paragraph = dd.querySelector('p.vads-u-margin--0');
    expect(paragraph).to.exist;
  });

  it('handles legacy employed-by-VA data format (employed)', () => {
    const data = {
      employedByVA: {
        isEmployedByVA: 'Y',
      },
    };

    const { getByText } = render(<EmploymentCheckReview data={data} />);

    expect(
      getByText(
        'You told us you worked during the past 12 months. The employers you added are listed below.',
      ),
    ).to.exist;
  });

  it('handles legacy employed-by-VA data format (not employed)', () => {
    const data = {
      employedByVA: {
        isEmployedByVA: 'N',
      },
    };

    const { getByText } = render(<EmploymentCheckReview data={data} />);

    expect(
      getByText(
        "We skipped Section II because you told us you didn't work in the past 12 months.",
      ),
    ).to.exist;
  });

  it('returns null when employment status is undefined', () => {
    const data = {};

    const { container } = render(<EmploymentCheckReview data={data} />);

    expect(container.firstChild).to.be.null;
  });

  it('returns null when data is not provided', () => {
    const { container } = render(<EmploymentCheckReview />);

    expect(container.firstChild).to.be.null;
  });

  it('returns null when employment check data has no selection', () => {
    const data = {
      [employmentCheckFields.parentObject]: {},
    };

    const { container } = render(<EmploymentCheckReview data={data} />);

    expect(container.firstChild).to.be.null;
  });
});
