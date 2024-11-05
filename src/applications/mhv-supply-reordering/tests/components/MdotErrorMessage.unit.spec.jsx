import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MdotErrorMessage from '../../components/MdotErrorMessage';

describe('MDOT error message component', () => {
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
    getByRole('heading', {
      name: /You can’t reorder your items at this time/,
    });
  });

  it('veteran deceased', () => {
    const { getByRole } = render(
      <MdotErrorMessage errorCode="MDOT_DECEASED" />,
    );
    getByRole('heading', {
      name: /Our records show that this Veteran is deceased/,
    });
  });

  it('default error', () => {
    const { getByRole } = render(<MdotErrorMessage errorCode="SOME_ERROR" />);
    getByRole('heading', {
      name: /We’re sorry. Something went wrong on our end/,
    });
  });
});
