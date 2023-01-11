import React from 'react';
import { useSelector } from 'react-redux';
import { formatFullName } from '~/applications/personalization/common/helpers';

export default function LegalName() {
  const { first, middle, last, suffix } = useSelector(
    state => state.vaProfile?.hero?.userFullName,
  );
  const fullName = formatFullName({ first, middle, last, suffix });
  return <p className="vads-u-margin--0 vads-u-width--full">{fullName}</p>;
}
