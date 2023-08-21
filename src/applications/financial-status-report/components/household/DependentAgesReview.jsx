import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DependentAges from './DependentAges';

const isValidDependentsCount = hasDependents => {
  const parsedDependents = parseInt(hasDependents, 10);
  return !Number.isNaN(parsedDependents) && parsedDependents > 0;
};

const DependentAgesReview = ({ isReviewMode = true, ...props }) => {
  const hasDependents = useSelector(
    state => state.form.data.questions?.hasDependents,
  );
  const [shouldRender, setShouldRender] = useState(
    isValidDependentsCount(hasDependents),
  );

  useEffect(
    () => {
      setShouldRender(isValidDependentsCount(hasDependents));
    },
    [hasDependents],
  );

  return (
    shouldRender && <DependentAges isReviewMode={isReviewMode} {...props} />
  );
};

DependentAgesReview.propTypes = {
  isReviewMode: PropTypes.bool,
};

export default DependentAgesReview;
