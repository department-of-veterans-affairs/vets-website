import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import DependentDeclarationField from '../FormFields/DependentDeclarationField';
import DependentDescription from '../FormDescriptions/DependentDescription';
import DependentList from '../FormFields/DependentList';
import { DEPENDENT_VIEW_FIELDS, SHARED_PATHS } from '../../utils/constants';
import content from '../../locales/en/content.json';

// declare shared data & route attrs from the form
const { dependents: DEPENDENT_PATHS } = SHARED_PATHS;

// declare default component
const DependentSummary = props => {
  const {
    data,
    goBack,
    goForward,
    goToPath,
    updatePage,
    setFormData,
    onReviewPage,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const {
    dependents = [],
    [DEPENDENT_VIEW_FIELDS.add]: addDependents = null,
  } = data;
  const pageTitle = dependents.length
    ? content['household-dependent-summary-list-title']
    : content['household-dependent-summary-title'];
  const mode = onReviewPage ? 'update' : 'edit';

  /**
   * declare default state variables
   *  - error - message to render if user tries to continue with an empty value
   *  - fieldData - data value to use for radio group and continue path
   */
  const [error, hasError] = useState(false);
  const [fieldData, setFieldData] = useState(addDependents);

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
        [DEPENDENT_VIEW_FIELDS.add]: value,
        [DEPENDENT_VIEW_FIELDS.skip]: value === false,
      });
      hasError(false);
    },
    onDelete: list => {
      setFormData({
        ...data,
        dependents: list,
      });
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
      <fieldset className="vads-u-margin-bottom--2">
        <legend id="root__title" className="schemaform-block-title">
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--3">
            {pageTitle}
          </h3>
        </legend>

        {/** Additional Info component for description */}
        <DependentDescription />

        {/** Dependent tile list */}
        {dependents.length > 0 ? (
          <div data-testid="ezr-dependent-list-field">
            <DependentList
              labelledBy="root__title"
              list={dependents}
              mode={mode}
              onDelete={handlers.onDelete}
            />
          </div>
        ) : null}

        {!onReviewPage ? (
          <>
            {/** Field radio group */}
            <div data-testid="ezr-dependent-declaration-field">
              <DependentDeclarationField
                defaultValue={fieldData}
                error={error}
                hasList={dependents.length > 0}
                onChange={handlers.onChange}
              />
            </div>
          </>
        ) : null}
      </fieldset>

      {!onReviewPage ? (
        <>
          {/** Form navigation buttons */}
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
          {contentAfterButtons}
        </>
      ) : (
        <va-button
          onClick={updatePage}
          text={content['button-update-page']}
          label={content['household-dependent-update-button-aria-label']}
          data-testid="ezr-update-button"
        />
      )}
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
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default DependentSummary;
