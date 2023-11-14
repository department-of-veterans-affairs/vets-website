import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { HealthInsuranceDescription } from '../FormDescriptions/HealthInsuranceDescriptions';
import InsuranceCoverageField from '../FormFields/InsuranceCoverageField';
import InsurancePolicyList from '../FormFields/InsurancePolicyList';
import { INSURANCE_VIEW_FIELDS, SHARED_PATHS } from '../../utils/constants';
import content from '../../locales/en/content.json';

// declare shared data & route attrs from the form
const { insurance: INSURANCE_PATHS } = SHARED_PATHS;

// declare default component
const InsuranceSummary = props => {
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
    providers = [],
    [INSURANCE_VIEW_FIELDS.add]: addProvider = null,
  } = data;
  const pageTitle = providers.length ? content['insurance-summary-title'] : '';
  const mode = onReviewPage ? 'update' : 'edit';

  /**
   * declare default state variables
   *  - error - message to render if user tries to continue with an empty value
   *  - fieldData - data value to use for radio group and continue path
   */
  const [error, hasError] = useState(false);
  const [fieldData, setFieldData] = useState(addProvider);

  /**
   * declare event handlers
   *  - onChange - fired when user chooses to add policy or not - sets radio group view field
   *  - onDelete - fired when user deletes a policy from their list - sets new list of providers
   *  - onGoForward - first on continue progress button click - go to next form page (if radio is 'No') or go into add policy flow (if radio is 'Yes')
   */
  const handlers = {
    onChange: value => {
      setFieldData(value);
      setFormData({
        ...data,
        [INSURANCE_VIEW_FIELDS.add]: value,
        [INSURANCE_VIEW_FIELDS.skip]: value === false,
      });
      hasError(false);
    },
    onDelete: list => {
      setFormData({
        ...data,
        providers: list,
      });
    },
    onGoForward: () => {
      if (error) return;

      // set error if user hasn't provided a value for the form field
      if (fieldData === null) {
        hasError(true);
        return;
      }

      // navigate to policy information or next form page based on form field value
      if (fieldData === true) {
        goToPath(`/${INSURANCE_PATHS.info}?index=${providers.length}`);
      } else {
        goForward(data);
      }
    },
  };

  return (
    <form className="rjsf">
      <fieldset className="vads-u-margin-bottom--2">
        <legend
          id="root__title"
          className={classNames({
            'schemaform-block-title': true,
            'sr-only': !pageTitle,
          })}
        >
          {pageTitle}
        </legend>

        {/** Policy tile list */}
        {providers.length > 0 ? (
          <div data-testid="ezr-policy-list-field">
            <InsurancePolicyList
              labelledBy="root__title"
              list={providers}
              mode={mode}
              onDelete={handlers.onDelete}
            />
          </div>
        ) : null}

        {!onReviewPage ? (
          <>
            {/** Field radio group */}
            <div data-testid="ezr-policy-declaration-field">
              <HealthInsuranceDescription />
              <InsuranceCoverageField
                defaultValue={fieldData}
                error={error}
                hasList={providers.length > 0}
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
        <button
          type="button"
          onClick={updatePage}
          className="usa-button-primary"
          aria-label={content['insurance-update-button-aria-label']}
          data-testid="ezr-update-button"
        >
          {content['button-update-page']}
        </button>
      )}
    </form>
  );
};

InsuranceSummary.propTypes = {
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

export default InsuranceSummary;
