import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  VaCheckboxGroup,
  VaModal,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollToFirstError, scrollTo } from 'platform/utilities/ui';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsUISchema,
  validateTEConditions,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';

/**
 * List of all toxic exposure related keys that need to be deleted
 * when user opts out of toxic exposure claims.
 * @constant {string[]}
 */
const toxicExposureKeys = [
  'conditions',
  'gulfWar1990',
  'gulfWar1990Details',
  'gulfWar2001',
  'gulfWar2001Details',
  'herbicide',
  'herbicideDetails',
  'herbicideOtherLocations',
  'additionalExposures',
  'additionalExposuresDetails',
  'specifyOtherExposures',
];

/** @constant {string} Modal title for the destructive action confirmation */
const modalTitle = 'Delete toxic exposure information?';

/** @constant {JSX.Element} Modal description content explaining what data will be deleted */
const modalDescription = (
  <>
    <p>
      If you choose to not claim any conditions related to toxic exposure, we’ll
      delete this information from your claim:
    </p>
    <ul>
      <li>Toxic exposure conditions</li>
      <li>Gulf War service locations and dates (1990 and 2001)</li>
      <li>Agent Orange exposure locations and dates</li>
      <li>Other toxic exposure details and dates</li>
    </ul>
  </>
);

/** @constant {string} Success alert message shown after data deletion */
const alertDescription =
  'We deleted your toxic exposure information. You can still add this information anytime before you submit your claim.';

/** @constant {Object} Confirmation button labels */
const confirmationData = {
  yes: 'Yes, delete toxic exposure information',
  no: 'No, return to claim',
};

/**
 * Deletes all toxic exposure data from the form data.
 * This is a destructive action that removes all toxic exposure related fields.
 *
 * @param {Object} data - The complete form data
 * @param {Function} setFormData - Function to update the form data in parent state
 */
const deleteToxicExposureData = (data, setFormData) => {
  const updatedData = { ...data };

  if (updatedData.toxicExposure) {
    toxicExposureKeys.forEach(key => {
      delete updatedData.toxicExposure[key];
    });
  }

  setFormData(updatedData);
};

/**
 * Deep check utility to determine if a value contains meaningful data
 * @param {*} value - The value to check
 * @returns {boolean} True if the value contains data, false otherwise
 */
const deepCheck = value => {
  switch (typeof value) {
    case 'boolean':
      return value === true;
    case 'string':
      return value.trim() !== '';
    case 'number':
      return true;
    case 'object':
      if (value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      return Object.values(value).some(nestedValue => deepCheck(nestedValue));
    default:
      return false;
  }
};

/**
 * Checks if there's any meaningful toxic exposure data beyond conditions
 * @param {Object} formData - The form data to check
 * @returns {boolean} True if toxic exposure data exists, false otherwise
 */
const checkToxicExposureData = formData => {
  return toxicExposureKeys.filter(key => key !== 'conditions').some(key => {
    const value = formData?.toxicExposure?.[key];
    return value && deepCheck(value);
  });
};

/**
 * ToxicExposureChoicePage Component
 *
 * This is a custom page component that replaces the default JSON Schema rendering
 * to provide a destructive modal confirmation when users opt out of toxic exposure claims.
 *
 * Core functionality:
 * 1. Renders checkboxes for toxic exposure conditions
 * 2. Tracks changes between previous and current selections
 * 3. Shows a destructive modal when user selects "none" after having data
 * 4. Deletes all toxic exposure data upon confirmation
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Form data object containing all user inputs
 * @param {Function} props.goBack - Navigation function to go to previous page
 * @param {Function} props.goForward - Navigation function to proceed to next page
 * @param {Function} props.setFormData - Function to update form data
 * @param {React.Element} props.contentBeforeButtons - Content to render before nav buttons
 * @param {React.Element} props.contentAfterButtons - Content to render after nav buttons
 * @param {boolean} props.onReviewPage - Whether this is rendered on the review page
 * @param {Function} props.updatePage - Function to update the page (used on review page)
 */
const ToxicExposureChoicePage = props => {
  const {
    data,
    goBack,
    goForward,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
    onReviewPage,
    updatePage,
  } = props;

  // State management - following the mental health pattern
  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [shouldGoForward, setShouldGoForward] = useState(false);

  // Track previous conditions using view field pattern like mental health
  const [previousConditions, setPreviousConditions] = useState(
    data?.['view:previousToxicExposureConditions'] || {},
  );

  // Current conditions state - using view field for consistency
  const [conditions, setConditions] = useState(
    data?.['view:selectedToxicExposureConditions'] ||
      data?.toxicExposure?.conditions ||
      {},
  );

  // Get the UI schema for conditions based on formData
  const conditionsUI = makeTEConditionsUISchema(data);

  /**
   * Effect to scroll to success alert when it's shown
   */
  useEffect(
    () => {
      if (showAlert) {
        scrollTo('toxic-exposure-success-alert');
      }
    },
    [showAlert],
  );

  /**
   * Effect to handle navigation after form data is updated
   */
  useEffect(
    () => {
      if (shouldGoForward && data?.toxicExposure?.conditions) {
        setShouldGoForward(false);
        goForward(data);
      }
    },
    [data, data?.toxicExposure?.conditions, goForward, shouldGoForward],
  );

  /**
   * Validates the form data and sets error state
   * @returns {boolean} True if there are errors, false otherwise
   */
  const checkErrors = () => {
    const errors = { toxicExposure: { conditions: {} } };

    // Validate using the current conditions state
    const formDataToValidate = {
      toxicExposure: {
        conditions,
      },
    };

    validateTEConditions(errors, formDataToValidate);

    const hasErrors = errors.toxicExposure.conditions?.__errors?.length > 0;
    setHasError(hasErrors ? errors.toxicExposure.conditions.__errors[0] : null);

    return hasErrors;
  };

  /**
   * CORE FUNCTIONALITY: Determines if the destructive modal should be shown
   *
   * The modal appears when ALL of these conditions are met:
   * 1. User is selecting "none" (opting out) NOW
   * 2. User didn't have "none" selected BEFORE (it's a change)
   * 3. There's existing data that would be deleted:
   *    - Either other conditions were previously selected
   *    - OR there's other toxic exposure data (Gulf War, herbicide, etc.)
   *
   * @returns {boolean} True if modal should be shown, false otherwise
   */
  const isChangingToNone = () => {
    // Check if "none" is being selected NOW but wasn't selected BEFORE
    if (!conditions.none || previousConditions.none === true) return false;

    // Check if any other conditions were previously selected (excluding "none")
    const hadOtherConditions = Object.keys(previousConditions).some(
      key => key !== 'none' && previousConditions[key] === true,
    );

    // Also check if there's any existing toxic exposure data beyond just conditions
    const hasOtherToxicExposureData = checkToxicExposureData(data);

    return hadOtherConditions || hasOtherToxicExposureData;
  };

  /**
   * Saves the current conditions and updates form data with view fields
   */
  const setPreviousData = () => {
    const formData = {
      ...data,
      'view:previousToxicExposureConditions': conditions,
      'view:selectedToxicExposureConditions': conditions,
      toxicExposure: {
        ...data.toxicExposure,
        conditions,
      },
    };
    setPreviousConditions(conditions);
    setFormData(formData);
    // Small delay to ensure state is updated before navigation
    setTimeout(() => {
      setShouldGoForward(true);
    }, 50);
  };

  /**
   * Event handlers object containing all form interaction handlers
   */
  const handlers = {
    /**
     * Handles checkbox value changes
     * Updates both local state and form data
     */
    onValueChange: event => {
      const { value, checked } = event.detail;
      const updatedConditions = {
        ...conditions,
        [value]: checked,
      };

      setConditions(updatedConditions);

      // Immediately update form data to ensure it's persisted
      const updatedFormData = {
        ...data,
        'view:selectedToxicExposureConditions': updatedConditions,
        toxicExposure: {
          ...data.toxicExposure,
          conditions: updatedConditions,
        },
      };

      setFormData(updatedFormData);
    },

    /**
     * CORE FUNCTIONALITY: Form submission handler
     * 1. Validates the form
     * 2. Checks if destructive modal should be shown
     * 3. Either shows modal or proceeds with navigation
     */
    onSubmit: event => {
      event.preventDefault();

      // Ensure form data is up to date before validation
      const currentFormData = {
        ...data,
        toxicExposure: {
          ...data.toxicExposure,
          conditions,
        },
      };

      setFormData(currentFormData);

      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
      } else if (isChangingToNone()) {
        // If selecting "none" and there's existing toxic exposure data, show modal
        setShowModal(true);
      } else {
        setShowAlert(false);
        setPreviousData();
      }
    },

    /**
     * Handles page update on review page
     * Similar to onSubmit but for review page context
     */
    onUpdatePage: event => {
      event.preventDefault();

      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
      } else if (isChangingToNone()) {
        setShowModal(true);
      } else {
        setShowAlert(false);
        const formData = {
          ...data,
          'view:previousToxicExposureConditions': conditions,
          'view:selectedToxicExposureConditions': conditions,
          toxicExposure: {
            ...data.toxicExposure,
            conditions,
          },
        };
        setPreviousConditions(conditions);
        setFormData(formData);
        setTimeout(() => {
          updatePage(event);
        }, 100);
      }
    },

    /**
     * Closes the modal without taking action
     */
    onCloseModal: () => {
      setShowModal(false);
    },

    /**
     * CORE FUNCTIONALITY: Confirms deletion of toxic exposure data
     * 1. Updates conditions to only have "none" selected
     * 2. Calls deleteToxicExposureData to remove all related data
     * 3. Shows success alert
     * 4. Automatically navigates forward after a delay
     */
    onConfirmDelete: () => {
      // Delete toxic exposure data but keep the "none" selection
      const updatedConditions = { none: true };
      setConditions(updatedConditions);
      setPreviousConditions(updatedConditions);

      const updatedData = {
        ...data,
        'view:previousToxicExposureConditions': updatedConditions,
        'view:selectedToxicExposureConditions': updatedConditions,
        toxicExposure: {
          conditions: updatedConditions,
        },
      };

      deleteToxicExposureData(updatedData, setFormData);
      setShowModal(false);
      setShowAlert(true);

      // Automatically navigate forward after showing the alert
      setTimeout(() => {
        setShouldGoForward(true);
      }, 100);
    },

    /**
     * Navigates back to previous page
     */
    onGoBack: () => {
      goBack(data);
    },

    /**
     * Closes the success alert
     */
    onCloseAlert: () => {
      setShowAlert(false);
    },
  };

  /**
   * Component Render
   *
   * Structure:
   * 1. Success Alert - Shows after data deletion
   * 2. Form with checkboxes - Lists all conditions from newDisabilities
   * 3. Destructive Modal - Confirms data deletion
   * 4. Navigation buttons - Either form nav or review page update button
   */
  return (
    <form onSubmit={handlers.onSubmit}>
      {/* Success Alert - Shown after toxic exposure data is deleted */}
      <VaAlert
        id="toxic-exposure-success-alert"
        status="success"
        closeable
        visible={showAlert}
        onCloseEvent={handlers.onCloseAlert}
        class="vads-u-margin-bottom--4"
        uswds
      >
        {alertDescription}
        <p>
          {!onReviewPage ? (
            <va-link
              text="Continue with your claim"
              onClick={handlers.onSubmit}
            />
          ) : null}
        </p>
      </VaAlert>

      <fieldset className="vads-u-margin-bottom--2">
        <legend id="root__title" className="schemaform-block-title">
          {formTitle(conditionsPageTitle)}
        </legend>

        {/* Checkbox Group - Dynamically generated based on newDisabilities */}
        <VaCheckboxGroup
          label={conditionsQuestion}
          required
          error={hasError}
          onVaValueChange={handlers.onValueChange}
        >
          {conditionsDescription}

          {/* Render checkbox for each condition including "none" option */}
          {Object.keys(conditionsUI).map(key => (
            <va-checkbox
              key={key}
              name={key}
              value={key}
              label={conditionsUI[key]['ui:title']}
              checked={conditions[key] || false}
            />
          ))}
        </VaCheckboxGroup>

        {/* Destructive Modal - Confirms deletion of toxic exposure data */}
        <VaModal
          clickToClose
          status="warning"
          modalTitle={modalTitle}
          primaryButtonText={confirmationData.yes}
          secondaryButtonText={confirmationData.no}
          onPrimaryButtonClick={handlers.onConfirmDelete}
          onSecondaryButtonClick={handlers.onCloseModal}
          onCloseEvent={handlers.onCloseModal}
          visible={showModal}
          uswds
        >
          {modalDescription}
        </VaModal>
      </fieldset>

      {/* Navigation - Different rendering for review page vs regular form flow */}
      {onReviewPage ? (
        <button
          className="usa-button-primary"
          type="button"
          onClick={handlers.onUpdatePage}
        >
          Update page
        </button>
      ) : (
        <>
          {contentBeforeButtons}
          <FormNavButtons
            goBack={handlers.onGoBack}
            goForward={handlers.onSubmit}
            submitToContinue
          />
          {contentAfterButtons}
        </>
      )}
    </form>
  );
};

ToxicExposureChoicePage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default ToxicExposureChoicePage;
