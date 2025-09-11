import React from 'react';
import { COURT_OF_APPEALS } from '../../constants/results-content/common';

const OutsideDROption = () => {
  return (
    <>
      <h2 className="vads-u-margin-top--3" data-testid="outside-dr-option">
        Options outside of decision reviews
      </h2>
      <p>
        These options are outside VA’s decision review process and may be a good
        fit in certain situations.
      </p>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="onramp-list-none" role="list">
        <li>{COURT_OF_APPEALS}</li>
      </ul>
    </>
  );
};

export default OutsideDROption;
