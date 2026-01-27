import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui/focus';
import { Element } from 'platform/utilities/scroll';
import { hasVAPServiceConnectionError } from 'platform/user/selectors';

import { FIELD_NAMES, FIELD_SECTION_HEADERS } from '@@vap-svc/constants';
import { openModal, updateFormFieldWithSchema } from '@@vap-svc/actions';
import { getInitialFormValues } from '@@vap-svc/util/contact-information/formValues';
import getProfileInfoFieldAttributes from '@@vap-svc/util/getProfileInfoFieldAttributes';
import {
  schedulingPreferenceOptions,
  getSchedulingPreferencesContactMethodDisplay,
} from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { createSchedulingPreferencesUpdate } from '@@vap-svc/actions/schedulingPreferences';
import { EditContext } from '../../edit/EditContext';
import { EditConfirmCancelModal } from '../../edit/EditConfirmCancelModal';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../../constants';
import { getRouteInfoFromPath } from '../../../../common/helpers';
import { getRoutesForNav } from '../../../routesForNav';

const getFieldInfo = fieldName => {
  const fieldNameKey = Object.entries(FIELD_NAMES).find(
    ([_, value]) => value === fieldName,
  )?.[0];
  if (!fieldNameKey) {
    return null;
  }
  const fieldTitle = `Edit ${FIELD_SECTION_HEADERS?.[fieldName]}`;

  return {
    fieldName,
    fieldKey: fieldNameKey,
    title: fieldTitle,
  };
};

const beforeUnloadHandler = e => {
  e.preventDefault();
  e.returnValue = '';
};

const clearBeforeUnloadListener = () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler);
};

export const PreferenceSelectionContainer = ({
  fieldName,
  noPreferenceValue,
  getContentComponent,
  getButtons,
  emptyValue,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const historyUnblock = useRef(null);
  const defaultReturnPath = PROFILE_PATHS.SCHEDULING_PREFERENCES;

  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [hasLocalUnsavedEdits, setHasLocalUnsavedEdits] = useState(false);
  const [hasBeforeUnloadListener, setHasBeforeUnloadListener] = useState(false);
  const [pageData, setPageData] = useState({
    data: {},
    quickExit: false,
  });
  const [step, setStep] = useState('select');
  const [error, setError] = useState(false);

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profile2Toggle = useToggleValue(TOGGLE_NAMES.profile2Enabled);
  const profileHealthCareSettingsPageToggle = useToggleValue(
    TOGGLE_NAMES.profileHealthCareSettingsPage,
  );
  const profileSchedulingPreferencesToggle = useToggleValue(
    TOGGLE_NAMES.profileSchedulingPreferences,
  );

  const routesForNav = getRoutesForNav({
    profile2Enabled: profile2Toggle,
    profileHealthCareSettingsPage: profileHealthCareSettingsPageToggle,
    profileSchedulingPreferencesEnabled: profileSchedulingPreferencesToggle,
  });

  const fieldInfo = getFieldInfo(fieldName);

  const returnRouteInfo = (() => {
    try {
      return getRouteInfoFromPath(defaultReturnPath, routesForNav);
    } catch (e) {
      // default to using the root route if the returnPath is invalid
      return {
        path: PROFILE_PATHS.PROFILE_ROOT,
        name: PROFILE_PATH_NAMES.PROFILE_ROOT,
      };
    }
  })();

  const returnPath = returnRouteInfo?.path;
  const returnPathName = returnRouteInfo?.name;

  const hasVAPServiceError = useSelector(state =>
    hasVAPServiceConnectionError(state),
  );

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );

  const hasAnyUnsavedEdits = hasUnsavedEdits || hasLocalUnsavedEdits;

  const fieldData = useSelector(
    state => state.vaProfile.schedulingPreferences[fieldName] || emptyValue,
    isEqual,
  );

  useEffect(
    () => {
      // Initialize local pageData from redux fieldData only when redux has meaningful values
      // or when pageData has an empty value and redux later supplies values. This avoids
      // overwriting the field with an empty array when the component mounts before redux
      // finishes populating the scheduling preferences (which happens when visiting the
      // page directly).
      const hasPageValue =
        pageData &&
        pageData.data &&
        Object.prototype.hasOwnProperty.call(pageData.data, fieldName);

      const pageValues = hasPageValue ? pageData.data[fieldName] : undefined;
      const pageHasValues = Array.isArray(pageValues) && pageValues.length > 0;
      const reduxHasValues = Array.isArray(fieldData) && fieldData.length > 0;

      // Only initialize from redux when redux provides values and the page doesn't already have values.
      if (reduxHasValues && !pageHasValues) {
        const quickExit =
          fieldData.length === 1 && fieldData[0] === noPreferenceValue;
        setPageData({ data: { [fieldName]: fieldData }, quickExit });
      }
    },
    [fieldData, fieldName, noPreferenceValue, pageData],
  );

  const editPageHeadingString = useMemo(
    () => {
      return `Edit ${FIELD_SECTION_HEADERS?.[
        fieldInfo.fieldName
      ].toLowerCase()}`;
    },
    [fieldInfo],
  );

  const pageSection = useMemo(
    () => {
      return FIELD_SECTION_HEADERS?.[fieldInfo.fieldName];
    },
    [fieldInfo],
  );

  const internationalPhonesToggleValue = useToggleValue(
    TOGGLE_NAMES.profileInternationalPhoneNumbers,
  );

  useEffect(
    () => {
      document.title = `${editPageHeadingString} | Veterans Affairs`;
    },
    [editPageHeadingString],
  );

  useEffect(
    () => {
      const hasChanges =
        pageData.data[fieldName] &&
        !isEqual(pageData.data[fieldName], fieldData);
      setHasLocalUnsavedEdits(hasChanges);
    },
    [pageData, fieldData, fieldName],
  );

  useEffect(
    () => {
      // Set initial focus on the page heading for keyboard navigation
      if (fieldInfo && !hasVAPServiceError) {
        const headingElement = document.querySelector('h1');
        if (headingElement) {
          // Only call scrollIntoView if it exists (not in test environment)
          if (headingElement.scrollIntoView) {
            headingElement.scrollIntoView();
          }
          focusElement(headingElement);
        }
      }
    },
    [fieldInfo, hasVAPServiceError],
  );

  useEffect(
    () => {
      if (fieldInfo?.fieldName && !hasVAPServiceError) {
        const { uiSchema, formSchema } = getProfileInfoFieldAttributes(
          fieldInfo.fieldName,
          { allowInternationalPhones: internationalPhonesToggleValue },
        );

        const initialFormData = getInitialFormValues({
          fieldName: fieldInfo.fieldName,
          data: fieldData,
          modalData: null,
        });

        // update modal state with initial form data for the field being edited
        // this needs to be done before the form data is updated
        // so that initialFormFields are looked up correctly
        dispatch(openModal(fieldInfo.fieldName, initialFormData));

        // update form state with initial form data for the field being edited, so that
        // the form is pre-populated with the current value for the field
        // and changes to the form are tracked
        dispatch(
          updateFormFieldWithSchema(
            fieldInfo.fieldName,
            initialFormData,
            formSchema,
            uiSchema,
          ),
        );
      }
    },
    [
      fieldInfo?.fieldName,
      hasVAPServiceError,
      internationalPhonesToggleValue,
      dispatch,
      fieldData,
    ],
  );

  useEffect(
    () => {
      // Close out the modal on mount because clicking back
      // from a sub task causes weird on page behaviors
      dispatch(openModal(null));
    },
    [dispatch],
  );

  useEffect(
    () => {
      // this is where we track the state of the beforeunload listener
      // and add/remove it as needed when the form has unsaved edits
      if (hasAnyUnsavedEdits && !hasBeforeUnloadListener) {
        window.addEventListener('beforeunload', beforeUnloadHandler);
        historyUnblock.current = history.block(() => {
          if (hasAnyUnsavedEdits) {
            setShowConfirmCancelModal(true);
            return false;
          }
          return true;
        });
        setHasBeforeUnloadListener(true);
        return;
      }

      if (!hasAnyUnsavedEdits && hasBeforeUnloadListener) {
        setHasBeforeUnloadListener(false);
        clearBeforeUnloadListener();
        if (historyUnblock.current) {
          historyUnblock.current();
          historyUnblock.current = null;
        }
      }
    },
    [hasAnyUnsavedEdits, hasBeforeUnloadListener],
  );

  const savePreference = useCallback(
    () => {
      const {
        apiRoute,
        convertCleanDataToPayload,
      } = getProfileInfoFieldAttributes(fieldName);
      const payload = convertCleanDataToPayload(
        {
          [fieldName]: pageData.data[fieldName],
        },
        fieldName,
      );

      dispatch(openModal(null));
      dispatch(
        createSchedulingPreferencesUpdate({
          route: apiRoute,
          method: 'POST',
          fieldName,
          payload,
          analyticsSectionName: 'scheduling-preferences-contact-method',
          value: pageData.data,
        }),
      );
      clearBeforeUnloadListener();
    },
    [dispatch, fieldName, pageData.data],
  );

  const optionsMap = schedulingPreferenceOptions(fieldName);
  const options = Object.entries(optionsMap).map(([value, label]) => ({
    value: String(value),
    label,
  }));
  const optionValues = options.map(option => option.value);

  const validate = data => {
    const values = data?.[fieldName] || emptyValue;

    if (Array.isArray(values)) {
      if (!values || values.length === 0) {
        return false;
      }

      if (isEqual(values, [noPreferenceValue])) {
        return true;
      }

      if (values.includes('continue') && step === 'select') {
        return true;
      }

      return values.some(v => optionValues.includes(v));
    }

    if (isEqual(values, noPreferenceValue)) {
      return true;
    }

    return optionValues.includes(values);
  };

  const handlers = {
    cancel: () => {
      setShowConfirmCancelModal(false);
      clearBeforeUnloadListener();
      if (historyUnblock.current) {
        historyUnblock.current();
      }
      dispatch(openModal(null));
      history.push(returnPath);
    },
    continue: () => {
      if (!validate(pageData.data)) {
        setError(true);
        return;
      }
      setStep('confirm');
    },
    save: () => {
      if (!validate(pageData.data)) {
        setError(true);
        return;
      }

      savePreference();
      if (historyUnblock.current) {
        historyUnblock.current();
      }

      history.push(returnPath, {
        fieldInfo,
      });
    },
    updateContactInfo: () => {
      if (!validate(pageData.data)) {
        setError(true);
        return;
      }
      // First save the contact method preference
      savePreference();

      if (historyUnblock.current) {
        historyUnblock.current();
      }
      setShowConfirmCancelModal(false);
      clearBeforeUnloadListener();
      dispatch(openModal(null));

      // Then navigate to the profile sub task flow to edit the related contact info field
      const relatedField = getSchedulingPreferencesContactMethodDisplay(
        pageData.data[fieldName],
      );
      history.push(
        `${PROFILE_PATHS.EDIT}?returnPath=${encodeURIComponent(
          returnPath,
        )}&fieldName=${encodeURIComponent(relatedField.field)}`,
      );
    },
    breadCrumbClick: e => {
      e.preventDefault();

      if (hasAnyUnsavedEdits) {
        setShowConfirmCancelModal(true);
        return;
      }

      handlers.cancel();
    },
  };

  const ContentComponent = getContentComponent(step);
  const buttons = getButtons(step, pageData.quickExit, handlers);

  return (
    <EditContext.Provider value={{ onCancel: handlers.cancel }}>
      {fieldInfo && !hasVAPServiceError ? (
        <>
          {/* this modal is triggered by breadcrumb being clicked with unsaved edits */}
          <EditConfirmCancelModal
            isVisible={showConfirmCancelModal}
            activeSection={pageSection.toLowerCase()}
            onHide={() => setShowConfirmCancelModal(false)}
          />
          <div className="vads-u-display--block medium-screen:vads-u-display--block">
            <nav
              aria-label="Breadcrumb"
              className="vads-u-margin-top--3 vads-u-margin-bottom--3"
            >
              <va-link
                back
                href={returnPath}
                onClick={handlers.breadCrumbClick}
                text={returnPathName}
              />
            </nav>

            <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
              {editPageHeadingString}
            </h1>
            <Element name="topContentElement" />
            <div className="vads-l-grid-container vads-u-padding-x--0 large-screen:vads-u-padding-x--2">
              <div className="vads-l-row">
                <div className="vads-l-col--12 medium-screen:vads-l-col--8">
                  <form onSubmit={handlers.save} noValidate>
                    <ContentComponent
                      data={fieldData}
                      error={error}
                      fieldName={fieldName}
                      setPageData={setPageData}
                      pageData={pageData}
                      noPreferenceValue={noPreferenceValue}
                      options={options}
                      handlers={handlers}
                    />
                    <div className="vads-u-margin-top--2">{buttons}</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </EditContext.Provider>
  );
};

PreferenceSelectionContainer.propTypes = {
  emptyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    .isRequired,
  fieldName: PropTypes.string.isRequired,
  getButtons: PropTypes.func.isRequired,
  getContentComponent: PropTypes.func.isRequired,
  noPreferenceValue: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  createSchedulingPreferencesUpdate,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreferenceSelectionContainer);
