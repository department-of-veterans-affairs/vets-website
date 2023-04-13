import React, { useMemo } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import InitializeVAPServiceIDContainer from '~/platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '~/platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { PROFILE_PATHS } from '../../constants';
import { hasVAPServiceConnectionError } from '~/platform/user/selectors';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const getReturnPath = path => {
  const pathKey = Object.entries(PROFILE_PATHS).find(
    ([_, value]) => value === path,
  )?.[0];
  if (!pathKey) {
    return null;
  }
  return PROFILE_PATHS[pathKey];
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
    title: FIELD_TITLES[fieldName],
  };
};

export const Edit = () => {
  const history = useHistory();
  const query = useQuery();

  const fieldInfo = getFieldInfo(query.get('fieldName'));
  const validReturnPath = getReturnPath(query.get('returnPath'));

  const hasVAPServiceError = useSelector(state =>
    hasVAPServiceConnectionError(state),
  );

  const handlers = {
    cancel: () => {
      history.goBack();
    },
    success: () => {
      const appendedPath = validReturnPath
        ? `${validReturnPath}?success=true`
        : PROFILE_PATHS.PROFILE_ROOT;
      history.push(appendedPath, { success: true, fieldInfo });
    },
  };

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseFieldEditingPage}>
      <Toggler.Enabled>
        <div className="vads-u-display--block medium-screen:vads-u-display--block">
          {fieldInfo &&
            !hasVAPServiceError && (
              <>
                <h1 className="vads-u-font-size--h2 vads-u-margin-top--2p5">
                  {`Add or update your ${fieldInfo.title.toLowerCase()}`}
                </h1>
                <InitializeVAPServiceIDContainer>
                  <ProfileInformationFieldController
                    fieldName={fieldInfo.fieldName}
                    forceEditView
                    isDeleteDisabled
                    cancelCallback={handlers.cancel}
                    cancelButtonText="Cancel and go back to last page"
                    successCallback={handlers.success}
                  />
                </InitializeVAPServiceIDContainer>
              </>
            )}
        </div>
      </Toggler.Enabled>

      <Toggler.Disabled>
        <>
          <h2>Sorry, this page is unavailable</h2>

          <Link to={PROFILE_PATHS.PROFILE_ROOT}>Return to your profile</Link>
        </>
      </Toggler.Disabled>
    </Toggler>
  );
};
