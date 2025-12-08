import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectPatientProviderRelationships } from '../../../../redux/selectors';

export default function OHProviderSection({ data }) {
  // Fetches patient relationships
  const { patientProviderRelationships } = useSelector(
    state => selectPatientProviderRelationships(state),
    shallowEqual,
  );

  const selectedProvider = patientProviderRelationships.find(
    provider => provider.providerId === data.selectedProvider,
  );

  if (!selectedProvider) {
    return null;
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">Provider</h2>
      {selectedProvider.providerName}
    </>
  );
}
OHProviderSection.propTypes = {
  data: PropTypes.object.isRequired,
};
