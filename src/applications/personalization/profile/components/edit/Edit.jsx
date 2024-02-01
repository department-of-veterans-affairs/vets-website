import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import { openModal, updateFormFieldWithSchema } from '@@vap-svc/actions';
import { isFieldEmpty } from '@@vap-svc/util';
import { getInitialFormValues } from '@@vap-svc/util/contact-information/formValues';
import getProfileInfoFieldAttributes from '@@vap-svc/util/getProfileInfoFieldAttributes';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import InitializeVAPServiceIDContainer from '@@vap-svc/containers/InitializeVAPServiceID';

import { hasVAPServiceConnectionError } from '~/platform/user/selectors';

import { EditFallbackContent } from './EditFallbackContent';
import { EditContext } from './EditContext';
import { EditConfirmCancelModal } from './EditConfirmCancelModal';
import { EditBreadcrumb } from './EditBreadcrumb';

import { routesForNav } from '../../routesForNav';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';
import { getRouteInfoFromPath } from '../../../common/helpers';

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

  return {
    fieldName,
    fieldKey: fieldNameKey,
    title: FIELD_TITLES?.[fieldName] || '',
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
      const addOrUpdate = isFieldEmpty(fieldData, fieldInfo?.fieldName)
        ? 'Add'
        : 'Update';

      return `${addOrUpdate} your ${fieldInfo?.title.toLowerCase()}`;
    },
    [fieldData, fieldInfo],
  );

  useEffect(() => {
    if (fieldInfo?.fieldName && !hasVAPServiceError) {
      const { uiSchema, formSchema } = getProfileInfoFieldAttributes(
        fieldInfo.fieldName,
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
          <div
            className="vads-u-display--block medium-screen:vads-u-display--block"
            id="profile-edit-field-page"
          >
            <EditBreadcrumb
              className="vads-u-margin-top--2 vads-u-margin-bottom--3"
              onClickHandler={handlers.breadCrumbClick}
              href={returnPath}
            >
              {`Back to ${returnPathName}`}
            </EditBreadcrumb>

            <p className="vads-u-margin-bottom--0p5">NOTIFICATION SETTINGS</p>

            <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
              {editPageHeadingString}
            </h1>

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
