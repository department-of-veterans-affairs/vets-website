import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MdotErrorMessage from '../../components/MdotErrorMessage';

describe('MDOT error messages', () => {
  it('invalid veteran', () => {
    const { getByRole } = render(<MdotErrorMessage errorCode="MDOT_INVALID" />);
    expect(
      getByRole('heading', {
        name: /We can’t find your records in our system/,
      }),
    ).to.exist;
  });

  it('supplies not found', () => {
    const { getByRole } = render(
      <MdotErrorMessage errorCode="MDOT_SUPPLIES_NOT_FOUND" />,
    );
    expect(
      getByRole('heading', {
        name: /You can’t reorder your items at this time/,
      }),
    ).to.exist;
  });

  it('veteran deceased', () => {
    const { getByRole } = render(
      <MdotErrorMessage errorCode="MDOT_DECEASED" />,
    );
    expect(
      getByRole('heading', {
        name: /Our records show that this Veteran is deceased/,
      }),
    ).to.exist;
  });

  it('default error', () => {
    const { getByRole } = render(<MdotErrorMessage errorCode="SOME_ERROR" />);
    expect(
      getByRole('heading', {
        name: /We’re sorry. Something went wrong on our end/,
      }),
    ).to.exist;
  });
});
