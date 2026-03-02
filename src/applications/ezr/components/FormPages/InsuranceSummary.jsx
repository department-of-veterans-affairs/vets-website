import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  HealthInsuranceDescription,
  HealthInsuranceAddtlInfoDescription,
} from '../FormDescriptions/HealthInsuranceDescriptions';
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
  const mode = onReviewPage ? 'update' : 'edit';

  const { properties: providersSchema } = ezrSchema.properties.providers.items;
  const providerErrorIndexes = [];
  providers.forEach((provider, index) => {
    if (
      !provider.insuranceName ||
      provider.insuranceName.length > providersSchema.insuranceName.maxLength ||
      !provider.insurancePolicyHolderName ||
      provider.insurancePolicyHolderName.length >
        providersSchema.insurancePolicyHolderName.maxLength ||
      (!provider['view:policyOrGroup']?.insurancePolicyNumber &&
        !provider['view:policyOrGroup']?.insuranceGroupCode) ||
      provider['view:policyOrGroup']?.insurancePolicyNumber?.length >
        providersSchema.insurancePolicyNumber.maxLength ||
      provider['view:policyOrGroup']?.insuranceGroupCode?.length >
        providersSchema.insuranceGroupCode.maxLength
    ) {
      providerErrorIndexes.push(index);
    }
  });

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

      // block progression if any providers are missing required information
      if (providerErrorIndexes.length > 0) {
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
        <legend id="root__title" className="schemaform-block-title">
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--3">
            {content['insurance-summary-title']}
          </h3>
          <span className="vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
            <HealthInsuranceDescription />
          </span>
        </legend>

        <HealthInsuranceAddtlInfoDescription />

        {/** Policy tile list */}
        {providers.length > 0 ? (
          <div data-testid="ezr-policy-list-field">
            <fieldset className="vads-u-margin-y--2 rjsf-object-field">
              <legend
                className="schemaform-block-title schemaform-block-subtitle vads-u-margin-bottom--3"
                id="root_view:insurancePolicyList__title"
              >
                {content['insurance-summary-list-title']}
              </legend>

              <InsurancePolicyList
                labelledBy="root_view:insurancePolicyList__title"
                list={providers}
                mode={mode}
                providerErrors={providerErrorIndexes}
                onDelete={handlers.onDelete}
              />
            </fieldset>
          </div>
        ) : null}

        {!onReviewPage ? (
          <>
            {/** Field radio group */}
            <div data-testid="ezr-policy-declaration-field">
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
        <va-button
          onClick={updatePage}
          text={content['button-update-page']}
          label={content['insurance-update-button-aria-label']}
          data-testid="ezr-update-button"
          uswds
        />
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
