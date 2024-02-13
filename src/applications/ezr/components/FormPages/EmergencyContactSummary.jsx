import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import EmergencyContactDeclarationField from '../FormFields/EmergencyContactDeclarationField';
import EmergencyContactDescription from '../FormDescriptions/EmergencyContactDescription';
import EmergencyContactList from '../FormFields/EmergencyContactList';
import {
  EMERGENCY_CONTACT_VIEW_FIELDS,
  SHARED_PATHS,
} from '../../utils/constants';
import content from '../../locales/en/content.json';

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
    [EMERGENCY_CONTACT_VIEW_FIELDS.add]: addVeteranContacts = null,
  } = data;
  const pageTitle = veteranContacts.length
    ? content['emergency-contact-list-title']
    : content['emergency-contact-title'];
  const mode = onReviewPage ? 'update' : 'edit';

  /**
   * declare default state variables
   *  - error - message to render if user tries to continue with an empty value
   *  - fieldData - data value to use for radio group and continue path
   */
  const [error, hasError] = useState(false);
  const [fieldData, setFieldData] = useState(addVeteranContacts);

  /**
   * declare event handlers
   *  - onChange - fired when user chooses to report emergency contacts or not - sets radio group view field
   *  - onDelete - fired when user deletes an emergency contact from their list - sets new list of contacts
   *  - onGoForward - first on continue progress button click - go to next form page (if radio is 'No') or go
   *    into add contact flow (if radio is 'Yes')
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

      // navigate to emergency contact name and relationship or next form page based on form field value
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
        <legend
          id="root__title"
          className="schemaform-block-title vads-u-padding-bottom--0"
        >
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--3">
            {pageTitle}
          </h3>
        </legend>

        <EmergencyContactDescription />

        {/** Emergency contact tile list */}
        {veteranContacts.length > 0 ? (
          <div data-testid="ezr-emergency-contact-list-field">
            <EmergencyContactList
              labelledBy="root__title"
              list={veteranContacts}
              mode={mode}
              onDelete={handlers.onDelete}
            />
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
          label={content['emergency-contact-update-button-aria-label']}
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
