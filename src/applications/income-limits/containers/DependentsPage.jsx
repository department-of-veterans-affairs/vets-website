import React, { useEffect, useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
import { ROUTES } from '../constants';
import { updateDependents, updateEditMode } from '../actions';

const DependentsPage = ({
  dependents,
  editMode,
  router,
  toggleEditMode,
  updateDependentsField,
}) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dependentsValid = deps => {
    return deps?.match(/^[0-9]+$/);
  };

  const validDependents = dependents?.length > 0 && dependentsValid(dependents);

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  const onContinueClick = () => {
    setSubmitted(true);

    if (!validDependents) {
      setError(true);
    } else if (editMode) {
      setError(false);
      toggleEditMode(false);
      router.push(ROUTES.REVIEW);
    } else {
      setError(false);
      router.push(ROUTES.REVIEW);
    }
  };

  const onBlurInput = () => {
    if (validDependents) {
      setError(false);
    }
  };

  const onDependentsInput = event => {
    updateDependentsField(event.target.value);
  };

  const onBackClick = () => {
    if (editMode) {
      toggleEditMode(false);
    }

    router.push(ROUTES.ZIPCODE);
  };

  return (
    <>
      <h1>Donec nec venenatis neque etiam ac nisi orci?</h1>
      <form>
        <VaNumberInput
          data-testid="il-dependents"
          error={
            (submitted && error && 'Please enter a number for dependents') ||
            null
          }
          hint="Dependents hint text"
          id="numberOfDependents"
          inputmode="numeric"
          label="Number of dependents"
          max={99}
          min={0}
          name="numberOfDependents"
          onBlur={onBlurInput}
          onInput={onDependentsInput}
          required
          value={dependents || ''}
        />
        <VaButtonPair
          data-testid="il-buttonPair"
          onPrimaryClick={onContinueClick}
          onSecondaryClick={onBackClick}
          continue
        />
      </form>
    </>
  );
};

const mapStateToProps = state => ({
  dependents: state?.incomeLimits?.form?.dependents,
  editMode: state?.incomeLimits?.editMode,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  updateDependentsField: updateDependents,
};

DependentsPage.propTypes = {
  editMode: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  updateDependentsField: PropTypes.func.isRequired,
  dependents: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DependentsPage);
