import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import RecordListHeader from '../RecordListHeader';

describe('RecordListHeader', () => {
  const defaultProps = {
    currentPage: 1,
    recordsLength: 30,
    totalEntries: 30,
    perPage: 10,
    domainOptions: {
      isAccelerating: false,
      displayTimeFrame: 'custom time frame',
    },
    hidePagination: false,
  };

  it('should render with default props', () => {
    const screen = render(<RecordListHeader {...defaultProps} />);

    expect(screen.getByText(/Showing 1 to 10 of 30 records from/)).to.exist;
    expect(screen.getByTestId('filter-display-message').textContent).to.equal(
      'newest to oldest',
    );
  });

  it('should render with custom time frame when isAccelerating is true', () => {
    const props = {
      ...defaultProps,
      domainOptions: {
        isAccelerating: true,
        displayTimeFrame: 'custom time frame',
      },
    };

    const screen = render(<RecordListHeader {...props} />);

    expect(screen.getByText(/Showing 1 to 10 of 30 records from/)).to.exist;
    expect(screen.getByTestId('filter-display-message').textContent).to.equal(
      'custom time frame',
    );
    expect(screen.getByTestId('filter-display-message').className).to.include(
      'vads-u-font-weight--bold',
    );
  });

  it('should hide pagination info when hidePagination is true', () => {
    const props = {
      ...defaultProps,
      hidePagination: true,
    };

    const screen = render(<RecordListHeader {...props} />);

    const paginationInfo = screen.getByTestId('showingRecords');
    expect(paginationInfo).to.have.attribute('hidden');
  });

  it('should calculate correct range when on second page', () => {
    const props = {
      ...defaultProps,
      currentPage: 2,
    };

    const screen = render(<RecordListHeader {...props} />);

    expect(screen.getByText(/Showing 11 to 20 of 30 records from/)).to.exist;
  });

  it('should handle last page correctly when it has fewer items than perPage', () => {
    const props = {
      ...defaultProps,
      currentPage: 3,
      totalEntries: 25,
      recordsLength: 25,
    };

    const screen = render(<RecordListHeader {...props} />);

    expect(screen.getByText(/Showing 21 to 25 of 25 records from/)).to.exist;
  });
});
