import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import { openModal } from '@@vap-svc/actions';

import InitializeVAPServiceIDContainer from '~/platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '~/platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { hasVAPServiceConnectionError } from '~/platform/user/selectors';

import { routesForNav } from '../../routesForNav';
import { EditFallbackContent } from './EditFallbackContent';
import { EditContext } from './EditContext';
import { EditConfirmCancelModal } from './EditConfirmCancelModal';

const DivWithBackIcon = styled.div`
  &:before {
    content: ' ‹ ';
    display: inline-block;
    padding: 0px 0.35em;
  }
`;

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const getReturnRouteInfo = (path, routes) => {
  const returnRouteInfo = routes.find(({ path: routePath }) => {
    return routePath === path;
  });
  if (!returnRouteInfo) {
    return null;
  }
  return returnRouteInfo;
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

const beforeUnloadListener = e => {
  e.preventDefault();
  e.returnValue = '';
};

const clearBeforeUnloadListener = () => {
  window.removeEventListener('beforeunload', beforeUnloadListener, {
    capture: true,
  });
};

export const Edit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

  const fieldInfo = getFieldInfo(query.get('fieldName'));

  const returnRouteInfo = getReturnRouteInfo(
    query.get('returnPath'),
    routesForNav,
  );

  const returnPath = returnRouteInfo?.path;
  const returnPathName = returnRouteInfo?.name;

  const hasVAPServiceError = useSelector(state =>
    hasVAPServiceConnectionError(state),
  );

  const fieldData = useSelector(state =>
    selectVAPContactInfoField(state, fieldInfo?.fieldName),
  );

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );

  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);

  useEffect(() => {
    if (fieldInfo?.fieldName && !hasVAPServiceError) {
      dispatch(openModal(fieldInfo.fieldName, fieldData));
    }
  }, []);

  useEffect(
    () => {
      if (hasUnsavedEdits) {
        window.addEventListener('beforeunload', beforeUnloadListener, {
          capture: true,
        });
        return;
      }

      clearBeforeUnloadListener();
    },
    [hasUnsavedEdits],
  );

  const handlers = {
    cancel: () => {
      clearBeforeUnloadListener();
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
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseFieldEditingPage}>
        <Toggler.Enabled>
          {/* this modal is triggered by breadcrumb being clicked with unsaved edits */}
          <EditConfirmCancelModal
            isVisible={showConfirmCancelModal}
            activeSection={fieldInfo.fieldName.toLowerCase()}
            onHide={() => setShowConfirmCancelModal(false)}
          />

          {fieldInfo && !hasVAPServiceError ? (
            <div
              className="vads-u-display--block medium-screen:vads-u-display--block"
              id="profile-edit-field-page"
            >
              <DivWithBackIcon className="vads-u-margin-top--2 vads-u-margin-bottom--3">
                <a onClick={handlers.breadCrumbClick} href={returnPath}>
                  Back to {returnPathName}
                </a>
              </DivWithBackIcon>

              <p className="vads-u-margin-bottom--0p5">NOTIFICATION SETTINGS</p>

              <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
                {`Add or update your ${fieldInfo.title.toLowerCase()}`}
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
          ) : (
            <EditFallbackContent />
          )}
        </Toggler.Enabled>

        <Toggler.Disabled>
          <EditFallbackContent />
        </Toggler.Disabled>
      </Toggler>
    </EditContext.Provider>
  );
};
