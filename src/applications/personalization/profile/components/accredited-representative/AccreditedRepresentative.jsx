import React, { useEffect } from 'react';
import { useStore, connect } from 'react-redux';
import PropTypes from 'prop-types';

import repStatusLoader from 'platform/user/widgets/representative-status';

import NoRepresentative from './NoRepresentative';

const AccreditedRepresentative = ({ powerOfAttorney }) => {
  const hasRepresentative = !!powerOfAttorney?.data?.id;
  const store = useStore();

  useEffect(
    () => {
      if (hasRepresentative) {
        repStatusLoader(store, 'representative-status', 3);
      }
    },
    [hasRepresentative],
  );

  return (
    <>
      <h2>Accredited Representative or VSO</h2>

      {hasRepresentative ? (
        <div data-widget-type="representative-status" />
      ) : (
        <NoRepresentative />
      )}
    </>
  );
};

AccreditedRepresentative.propTypes = {
  dob: PropTypes.string.isRequired,
  gender: PropTypes.string,
};

const mapStateToProps = state => ({
  powerOfAttorney: state.vaProfile?.powerOfAttorney,
});

export default connect(mapStateToProps)(AccreditedRepresentative);
