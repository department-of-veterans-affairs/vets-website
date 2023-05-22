import React, { useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from '../constants';
import { updateDependents } from '../actions';

const DependentsPage = ({ dependents, router, updateDependentsField }) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dependentsValid = deps => {
    return deps?.match(/^[0-9]+$/);
  };

  const validDependents = dependents?.length > 0 && dependentsValid(dependents);

  const onContinueClick = () => {
    setSubmitted(true);

    if (!validDependents) {
      setError(true);
    } else {
      setError(false);
      updateDependentsField(dependents);
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
});

const mapDispatchToProps = {
  updateDependentsField: updateDependents,
};

DependentsPage.propTypes = {
  updateDependentsField: PropTypes.func.isRequired,
  dependents: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DependentsPage);
