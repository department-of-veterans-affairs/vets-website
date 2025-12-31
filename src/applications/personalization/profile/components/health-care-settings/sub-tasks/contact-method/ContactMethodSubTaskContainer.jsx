import SubTask from 'platform/forms/sub-task';

import React, { useMemo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui/focus';
import { Element } from 'platform/utilities/scroll';

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
// import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
// import InitializeVAPServiceIDContainer from '@@vap-svc/containers/InitializeVAPServiceID';

import { hasVAPServiceConnectionError } from '~/platform/user/selectors';

import { isSubtaskSchedulingPreference } from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { FormFooter } from 'platform/forms/exportsFile';
import { getFormSchema } from '@@vap-svc/components/SchedulingPreferences/preferred-contact-method';
import pages from './pages';
// import { EditFallbackContent } from '../../../edit/EditFallbackContent';
import { EditContext } from '../../../edit/EditContext';
import { EditConfirmCancelModal } from '../../../edit/EditConfirmCancelModal';
import { EditBreadcrumb } from '../../../edit/EditBreadcrumb';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../../../constants';
import { getRouteInfoFromPath } from '../../../../../common/helpers';
import { getRoutesForNav } from '../../../../routesForNav';

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

const formConfig = getFormSchema();

export const ContactMethodSubTaskContainer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const fieldName = 'preferredContactMethod';
  const defaultReturnPath = PROFILE_PATHS.SCHEDULING_PREFERENCES;

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

  const fieldData = useSelector(state =>
    selectVAPContactInfoField(state, fieldInfo?.fieldName),
  );

  const editPageHeadingString = useMemo(
    () => {
      if (isSubtaskSchedulingPreference(fieldInfo?.fieldName)) {
        return `Edit ${FIELD_SECTION_HEADERS?.[
          fieldInfo.fieldName
        ].toLowerCase()}`;
      }
      const addOrUpdate = isFieldEmpty(fieldData, fieldInfo?.fieldName)
        ? 'Add'
        : 'Update';

      return `${addOrUpdate} your ${fieldInfo?.title.toLowerCase()}`;
    },
    [fieldData, fieldInfo],
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
            <EditBreadcrumb
              className="vads-u-margin-top--2 vads-u-margin-bottom--3"
              onClickHandler={handlers.breadCrumbClick}
              href={returnPath}
            >
              {returnPathName}
            </EditBreadcrumb>

            <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
              {editPageHeadingString}
            </h1>
            <Element name="topContentElement" />
            <div className="vads-l-grid-container vads-u-padding-x--0 large-screen:vads-u-padding-x--2">
              <div className="vads-l-row">
                <div className="vads-l-col--12 medium-screen:vads-l-col--8">
                  <SubTask pages={pages} />
                </div>
                <FormFooter formConfig={formConfig} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </EditContext.Provider>
  );
};

export default ContactMethodSubTaskContainer;
