import React from 'react';
import { useSelector } from 'react-redux';
import { DEPENDENT_AGE_LABELS } from '../../constants/dependentLabels';

const isValidDependentsCount = hasDependents => {
  const count = parseInt(hasDependents, 10);
  return !Number.isNaN(count) && count > 0;
};

const DependentAgesReview = () => {
  const hasDependents = useSelector(
    state => state.form.data.questions?.hasDependents,
  );
  const dependents = useSelector(
    state => state.form.data.personalData?.dependents || [],
  );

  const showDependents = isValidDependentsCount(hasDependents);

  const dependentAgeItems = showDependents
    ? dependents.map(
        (dependent, i) =>
          DEPENDENT_AGE_LABELS[i + 1] && ( // Adjusted to correctly map labels to dependents
            <div
              key={`dependentAge-${i}`}
              className={`review-row ${i > 0 ? 'vads-u-border-top--1' : ''}`}
            >
              <dt>{DEPENDENT_AGE_LABELS[i + 1]}</dt>
              <dd>{dependent.dependentAge || ''}</dd>
            </div>
          ),
      )
    : null;

  return (
    showDependents && (
      <div>
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Dependents Ages
        </h4>
        <dl className="review vads-u-border-bottom--1">{dependentAgeItems}</dl>
      </div>
    )
  );
};

export default DependentAgesReview;
