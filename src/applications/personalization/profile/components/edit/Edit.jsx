import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui/focus';

import {
  FIELD_NAMES,
  FIELD_SECTION_HEADERS,
  FIELD_TITLES,
} from '@@vap-svc/constants';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import { openModal, updateFormFieldWithSchema } from '@@vap-svc/actions';
import { isFieldEmpty } from '@@vap-svc/util';
import { getInitialFormValues } from '@@vap-svc/util/contact-information/formValues';
import getProfileInfoFieldAttributes from '@@vap-svc/util/getProfileInfoFieldAttributes';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import InitializeVAPServiceIDContainer from '@@vap-svc/containers/InitializeVAPServiceID';

import { hasVAPServiceConnectionError } from '~/platform/user/selectors';

import { isSubtaskSchedulingPreference } from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { EditFallbackContent } from './EditFallbackContent';
import { EditContext } from './EditContext';
import { EditConfirmCancelModal } from './EditConfirmCancelModal';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';
import { getRouteInfoFromPath } from '../../../common/helpers';
import { getRoutesForNav } from '../../routesForNav';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const getFieldInfo = fieldName => {
  const fieldNameKey = Object.entries(FIELD_NAMES).find(
    ([_, value]) => value === fieldName,
  )?.[0];
  if (!fieldNameKey) {
    return null;
  }
  const fieldTitle = isSubtaskSchedulingPreference(fieldName)
    ? `Edit ${FIELD_SECTION_HEADERS?.[fieldName]}`
    : FIELD_TITLES?.[fieldName];

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

export const Edit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [hasBeforeUnloadListener, setHasBeforeUnloadListener] = useState(false);

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

  const fieldInfo = getFieldInfo(query.get('fieldName'));

  const returnRouteInfo = (() => {
    try {
      return getRouteInfoFromPath(query.get('returnPath'), routesForNav);
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
  const formattedReturnPathName = returnPathName.toUpperCase();

  const hasVAPServiceError = useSelector(state =>
    hasVAPServiceConnectionError(state),
  );

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );

  const fieldData = useSelector(state =>
    selectVAPContactInfoField(state, fieldInfo?.fieldName),
  );

  const isReturningToSchedulingPreferences = path => {
    return path === PROFILE_PATHS.SCHEDULING_PREFERENCES;
  };

  const editPageHeadingString = useMemo(
    () => {
      if (
        isSubtaskSchedulingPreference(fieldInfo?.fieldName) ||
        isReturningToSchedulingPreferences(returnPath)
      ) {
        return `Edit ${FIELD_SECTION_HEADERS?.[
          fieldInfo.fieldName
        ].toLowerCase()}`;
      }
      const addOrUpdate = isFieldEmpty(fieldData, fieldInfo?.fieldName)
        ? 'Add'
        : 'Update';

      return `${addOrUpdate} your ${fieldInfo?.title.toLowerCase()}`;
    },
    [fieldData, fieldInfo, returnPath],
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

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      // this is where we track the state of the beforeunload listener
      // and add/remove it as needed when the form has unsaved edits
      if (hasUnsavedEdits && !hasBeforeUnloadListener) {
        window.addEventListener('beforeunload', beforeUnloadHandler);
        setHasBeforeUnloadListener(true);
        return;
      }

      if (!hasUnsavedEdits && hasBeforeUnloadListener) {
        setHasBeforeUnloadListener(false);
        clearBeforeUnloadListener();
      }
    },
    [hasUnsavedEdits, hasBeforeUnloadListener],
  );

  const handlers = {
    cancel: () => {
      clearBeforeUnloadListener();

      // ensures any field editing state is cleared
      // and that hasUnsavedEdits is set to false
      dispatch(openModal(null));

      history.push(returnPath);
    },
    success: () => {
      clearBeforeUnloadListener();

      history.push(returnPath, {
        fieldInfo,
      });
    },
    breadCrumbClick: e => {
      e.preventDefault();

      if (hasUnsavedEdits) {
        setShowConfirmCancelModal(true);
        return;
      }

      handlers.cancel();
    },
  };

  const breadcrumbText = isReturningToSchedulingPreferences(returnPath)
    ? returnPathName
    : `Back to ${returnPathName}`;

  return (
    <EditContext.Provider value={{ onCancel: handlers.cancel }}>
      {fieldInfo && !hasVAPServiceError ? (
        <>
          {/* this modal is triggered by breadcrumb being clicked with unsaved edits */}
          <EditConfirmCancelModal
            isVisible={showConfirmCancelModal}
            activeSection={fieldInfo.fieldName.toLowerCase()}
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
                text={breadcrumbText}
              />
            </nav>

            {!isReturningToSchedulingPreferences(returnPath) && (
              <p className="vads-u-margin-bottom--0p5">
                {formattedReturnPathName}
              </p>
            )}

            <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
              {editPageHeadingString}
            </h1>

            {isReturningToSchedulingPreferences(returnPath) && (
              <p>
                Enter the {fieldInfo.title.toLowerCase()} you want to use for
                scheduling. We’ll also update this information in your profile.
              </p>
            )}

            <InitializeVAPServiceIDContainer>
              {/* the EditConfirmCancelModal is passed here as props to allow a custom modal to be used
                  for when the user clicks 'cancel' on the form with unsaved edits */}
              <ProfileInformationFieldController
                fieldName={fieldInfo.fieldName}
                forceEditView
                isDeleteDisabled
                saveButtonText="Save to profile"
                successCallback={handlers.success}
                cancelCallback={handlers.cancel}
                CustomConfirmCancelModal={EditConfirmCancelModal}
                allowInternationalPhones
              />
            </InitializeVAPServiceIDContainer>
          </div>
        </>
      ) : (
        <EditFallbackContent routesForNav={routesForNav} />
      )}
    </EditContext.Provider>
  );
};
