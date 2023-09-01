import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { format, parseISO } from 'date-fns';

import ClaimComplete from '../../components/ClaimComplete';

const formatString = 'MMMM d, yyyy';

describe('<ClaimComplete>', () => {
  it('should render message with formatted date', () => {
    const date = '2010-09-01';
    const screen = render(<ClaimComplete completedDate={date} />);

    const closeDateText = format(parseISO(date), formatString);
    expect(screen.getByText(`We decided your claim on ${closeDateText}`)).to
      .exist;
  });

  it('should render message with invalid date', () => {
    const date = 'asdfasdf';
    const screen = render(<ClaimComplete completedDate={date} />);

    expect(screen.getByText('We decided your claim on Invalid date')).to.exist;
  });

  it('should render message without date', () => {
    const date = null;
    const screen = render(<ClaimComplete completedDate={date} />);

    expect(screen.getByText('We decided your claim')).to.exist;
    expect(screen.queryByText('We decided your claim on')).to.not.exist;
  });
});
