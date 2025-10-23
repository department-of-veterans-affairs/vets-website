import React from 'react';
import { useSelector } from 'react-redux';
import { formatFullName } from '~/applications/personalization/common/helpers';
import { SingleFieldLoadFailAlert } from '../alerts/LoadFail';

export default function LegalName() {
  const { first, middle, last, suffix } = useSelector(
    state =>
      state.vaProfile?.hero?.userFullName || {
        first: null,
        middle: null,
        last: null,
        suffix: null,
      },
  );
  const fullName = formatFullName({ first, middle, last, suffix });
  return fullName ? (
    <p
      className="vads-u-margin--0 vads-u-width--full"
      data-testid="legalNameField"
    >
      {fullName}
    </p>
  ) : (
    <SingleFieldLoadFailAlert sectionName="legal name" />
  );
}
