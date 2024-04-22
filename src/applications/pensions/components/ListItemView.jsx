import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

const ListItemView = ({ title }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionMultiresponseStyles = useToggleValue(
    TOGGLE_NAMES.pensionMultiresponseStyles,
  );
  return pensionMultiresponseStyles ? (
    <div className="vads-u-padding--2">
      <strong>{title}</strong>
      <br />
    </div>
  ) : (
    <h3 className="vads-u-font-size--h5 vads-u-margin-y--1">{title}</h3>
  );
};

ListItemView.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListItemView;
