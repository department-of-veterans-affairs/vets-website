import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, connect } from 'react-redux';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement } from 'platform/utilities/ui/focus';
import { Element } from 'platform/utilities/scroll';
import {
  hasVAPServiceConnectionError,
  selectVAPHomePhone,
  selectVAPMobilePhone,
  selectVAPWorkPhone,
  selectVAPEmailAddress,
  selectVAPMailingAddress,
} from 'platform/user/selectors';

import { FIELD_NAMES, FIELD_SECTION_HEADERS } from '@@vap-svc/constants';
import { openModal, updateFormFieldWithSchema } from '@@vap-svc/actions';
import { isFieldEmpty } from '@@vap-svc/util';
import { getInitialFormValues } from '@@vap-svc/util/contact-information/formValues';
import getProfileInfoFieldAttributes from '@@vap-svc/util/getProfileInfoFieldAttributes';
import {
  getSchedulingPreferencesContactMethodDisplay,
  isSubtaskSchedulingPreference,
  schedulingPreferenceOptions,
} from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { createSchedulingPreferencesUpdate } from '@@vap-svc/actions/schedulingPreferences';
import { FIELD_OPTION_IDS } from '@@vap-svc/constants/schedulingPreferencesConstants';
import { EditContext } from '../../../edit/EditContext';
import { EditConfirmCancelModal } from '../../../edit/EditConfirmCancelModal';
import { EditBreadcrumb } from '../../../edit/EditBreadcrumb';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../../../constants';
import { getRouteInfoFromPath } from '../../../../../common/helpers';
import { getRoutesForNav } from '../../../../routesForNav';
import ContactMethodConfirm from './pages/ContactMethodConfirm';
import { ContactMethodSelect } from './pages/ContactMethodSelect';

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

export const ContactMethodContainer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const defaultReturnPath = PROFILE_PATHS.SCHEDULING_PREFERENCES;

  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
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

  const fieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;
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

  const fieldData = useSelector(
    state => state.vaProfile.schedulingPreferences[fieldName] || '',
  );

  const homePhone = useSelector(selectVAPHomePhone);
  const mobilePhone = useSelector(selectVAPMobilePhone);
  const workPhone = useSelector(selectVAPWorkPhone);
  const email = useSelector(selectVAPEmailAddress);
  const mailingAddress = useSelector(selectVAPMailingAddress);

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

  const saveContactMethod = useCallback(
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

  useEffect(
    () => {
      // Check for existing data on the confirm step and push to profile edit if missing
      if (step === 'confirm') {
        let data;
        switch (pageData.data[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]) {
          case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .TELEPHONE_MOBILE:
          case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .TEXT_MESSAGE:
            data = mobilePhone;
            break;
          case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .TELEPHONE_HOME:
            data = homePhone;
            break;
          case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .TELEPHONE_WORK:
            data = workPhone;
            break;
          case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .EMAIL:
            data = email;
            break;
          case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .US_POST:
            data = mailingAddress;
            break;
          default:
            data = false;
        }
        if (!data) {
          // Save the contact method preference in the background as the user is redirected to edit the related contact info field
          saveContactMethod();

          const relatedField = getSchedulingPreferencesContactMethodDisplay(
            pageData.data[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
          );
          history.push(
            `${PROFILE_PATHS.EDIT}?returnPath=${encodeURIComponent(
              returnPath,
            )}&fieldName=${encodeURIComponent(relatedField.field)}`,
          );
        }
      }
    },
    [
      step,
      pageData,
      mobilePhone,
      homePhone,
      workPhone,
      email,
      mailingAddress,
      history,
      returnPath,
      saveContactMethod,
    ],
  );

  const optionsMap = schedulingPreferenceOptions(fieldName);
  const options = Object.entries(optionsMap).map(([value, label]) => ({
    value: String(value),
    label,
  }));
  const optionValues = options.map(option => option.value);

  const validate = data => optionValues.includes(data?.[fieldName]);

  const handlers = {
    cancel: () => {
      clearBeforeUnloadListener();

      // ensures any field editing state is cleared
      // and that hasUnsavedEdits is set to false
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

      saveContactMethod();

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

    updateContactInfo: () => {
      if (!validate(pageData.data)) {
        setError(true);
        return;
      }
      // First save the contact method preference
      saveContactMethod();

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
  };

  const content =
    step === 'select' ? (
      <ContactMethodSelect
        data={fieldData}
        error={error}
        options={options}
        setPageData={setPageData}
      />
    ) : (
      <ContactMethodConfirm pageData={pageData} />
    );

  let buttons = (
    <VaButtonPair
      onPrimaryClick={handlers.continue}
      onSecondaryClick={handlers.cancel}
      leftButtonText="Continue"
      rightButtonText="Cancel"
      data-testid="continue-cancel-buttons"
    />
  );
  if (pageData.quickExit) {
    buttons = (
      <VaButtonPair
        onPrimaryClick={handlers.save}
        onSecondaryClick={handlers.cancel}
        leftButtonText="Save to profile"
        rightButtonText="Cancel"
        data-testid="quick-exit-cancel-buttons"
      />
    );
  }
  if (step === 'confirm') {
    buttons = (
      <VaButtonPair
        onPrimaryClick={handlers.save}
        onSecondaryClick={handlers.updateContactInfo}
        leftButtonText="Confirm information"
        rightButtonText="Update information"
        data-testid="confirm-update-buttons"
      />
    );
  }

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
                  <form onSubmit={handlers.save} noValidate>
                    {content}
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

const mapDispatchToProps = {
  createSchedulingPreferencesUpdate,
};

export default connect(
  null,
  mapDispatchToProps,
)(ContactMethodContainer);
