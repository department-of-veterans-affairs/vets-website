import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EMERGENCY_CONTACT_VIEW_FIELDS,
  SHARED_PATHS,
} from '../../utils/constants';
import content from '../../locales/en/content.json';
import EmergencyContactList from '../FormFields/EmergencyContactList';
import EmergencyContactDeclarationField from '../FormFields/EmergencyContactDeclarationField';

// declare shared data & route attrs from the form
const { emergencyContacts: EMERGENCY_CONTACT_PATHS } = SHARED_PATHS;

// declare default component
const EmergencyContactSummary = props => {
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
    veteranContacts = [],
    [EMERGENCY_CONTACT_VIEW_FIELDS.add]: addEmergencyContact = null,
  } = data;
  const mode = onReviewPage ? 'update' : 'edit';

  /**
   * declare default state variables
   *  - error - message to render if user tries to continue with an empty value
   *  - fieldData - data value to use for radio group and continue path
   */
  const [error, hasError] = useState(false);
  const [fieldData, setFieldData] = useState(addEmergencyContact);

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
        [EMERGENCY_CONTACT_VIEW_FIELDS.add]: value,
        [EMERGENCY_CONTACT_VIEW_FIELDS.skip]: value === false,
      });
      hasError(false);
    },
    onDelete: list => {
      setFormData({
        ...data,
        veteranContacts: list,
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
        goToPath(
          `/${EMERGENCY_CONTACT_PATHS.info}?index=${veteranContacts.length}`,
        );
      } else {
        goForward(data);
      }
    },
  };

  return (
    <form className="rjsf">
      <fieldset className="vads-u-margin-bottom--2">
        <legend id="root__title" className="schemaform-block-title">
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
            {content['emergency-contact-summary-title']}
          </h3>
        </legend>

        <p className="vads-u-margin-top--0">
          The person you want to represent you your wishes for care, medical
          documentation, and benefits if needed. You can add up to two medical
          emergency contact.
        </p>

        {/** Policy tile list */}
        {veteranContacts.length > 0 ? (
          <div data-testid="ezr-emergency-contact-list-field">
            <fieldset className="vads-u-margin-y--2 rjsf-object-field">
              <legend
                className="schemaform-block-title schemaform-block-subtitle vads-u-margin-bottom--3"
                id="root_view:emergencyContactList__title"
              >
                {content['insurance-summary-list-title']}
              </legend>

              <EmergencyContactList
                labelledBy="root_view:emergencyContactList__title"
                list={veteranContacts}
                mode={mode}
                onDelete={handlers.onDelete}
              />
            </fieldset>
          </div>
        ) : null}

        {!onReviewPage ? (
          <>
            {/** Field radio group */}
            <div data-testid="ezr-emergency-contact-declaration-field">
              <EmergencyContactDeclarationField
                defaultValue={fieldData}
                error={error}
                hasList={veteranContacts.length > 0}
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
        />
      )}
    </form>
  );
};

EmergencyContactSummary.propTypes = {
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

export default EmergencyContactSummary;
