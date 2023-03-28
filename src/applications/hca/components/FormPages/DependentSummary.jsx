import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import DependentDeclarationField from '../FormFields/DependentDeclarationField';
import DependentList from '../FormFields/DependentList';
import { DEPENDENT_VIEW_FIELDS, SHARED_PATHS } from '../../utils/constants';

// declare shared data & route attrs from the form
const { dependents: DEPENDENT_PATHS } = SHARED_PATHS;

// declare default component
const DependentSummary = props => {
  const {
    data,
    goBack,
    goForward,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const {
    dependents = [],
    [DEPENDENT_VIEW_FIELDS.report]: reportDependents = null,
  } = data;
  const pageTitle = dependents.length ? 'Your Dependents' : 'Dependents';

  /**
   * declare default state variables
   *  - error - message to render if user tries to continue with an empty value
   *  - fieldData - data value to use for radio group and continue path
   */
  const [error, hasError] = useState(false);
  const [fieldData, setFieldData] = useState(reportDependents);

  /**
   * declare event handlers
   *  - onChange - fired when user chooses to report dependent or not - sets radio group view field
   *  - onDelete - fired when user deletes a dependent from their list - sets new list of dependents
   *  - onGoForward - first on continue progress button click - go to next form page (if radio is 'No') or go into add dependent flow (if radio is 'Yes')
   */
  const handlers = {
    onChange: value => {
      setFieldData(value);
      setFormData({
        ...data,
        [DEPENDENT_VIEW_FIELDS.report]: value,
        [DEPENDENT_VIEW_FIELDS.skip]: value === false,
      });
      hasError(false);
    },
    onDelete: list => {
      setFormData({ ...data, dependents: list });
      focusElement('#root__title');
    },
    onGoForward: () => {
      if (error) return;

      // set error if user hasn't provided a value for the form field
      if (fieldData === null) {
        hasError(true);
        return;
      }

      // navigate to dependent information or next form page based on form field value
      if (fieldData === true) {
        goToPath(`/${DEPENDENT_PATHS.info}?index=${dependents.length}`);
      } else {
        goForward(data);
      }
    },
  };

  return (
    <form className="rjsf">
      <fieldset className="vads-u-margin-y--2">
        <legend id="root__title" className="schemaform-block-title">
          {pageTitle}
        </legend>

        {/** Dependent tile list */}
        {dependents.length > 0 ? (
          <div>
            <DependentList
              labelledBy="root__title"
              list={dependents}
              onDelete={handlers.onDelete}
            />
          </div>
        ) : null}

        {/** Field radio group */}
        <div>
          <DependentDeclarationField
            defaultValue={fieldData}
            error={error}
            hasList={dependents.length > 0}
            onChange={handlers.onChange}
          />
        </div>
      </fieldset>

      {/** Form navigation buttons */}
      {contentBeforeButtons}
      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
        <div className="small-6 medium-5 columns">
          {goBack && (
            <ProgressButton
              ariaDescribedBy="nav-form-header"
              buttonClass="usa-button-secondary"
              onButtonClick={goBack}
              buttonText="Back"
              beforeText="«"
            />
          )}
        </div>
        <div className="small-6 medium-5 end columns">
          <ProgressButton
            ariaDescribedBy="nav-form-header"
            buttonClass="usa-button-primary"
            onButtonClick={handlers.onGoForward}
            buttonText="Continue"
            afterText="»"
          />
        </div>
      </div>
      {contentAfterButtons}
    </form>
  );
};

DependentSummary.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default DependentSummary;
