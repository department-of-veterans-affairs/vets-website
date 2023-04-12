import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InitializeVAPServiceID } from '~/platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import { ProfileInformationFieldController } from '~/platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const getPathName = path => {
  const pathKey = Object.entries(PROFILE_PATHS).find(
    ([_, value]) => value === path,
  )?.[0];
  return pathKey
    ? PROFILE_PATH_NAMES[pathKey]
    : PROFILE_PATH_NAMES.PERSONAL_INFORMATION;
};

export const Edit = () => {
  const query = useQuery();
  const returnPath = query.get('returnPath');
  const fieldName = query.get('fieldName');
  const returnPathName = getPathName(returnPath);

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    cancel: () => {
      // console.log('you cancelled');
      return true;
    },
    success: () => {
      // console.log('you succeeded');
      return true;
    },
  };

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseFieldEditingPage}>
      <Toggler.Enabled>
        <div className="vads-u-display--block medium-screen:vads-u-display--block">
          {fieldName && (
            <InitializeVAPServiceID>
              <ProfileInformationFieldController
                fieldName={fieldName}
                isDeleteDisabled
                cancelCallback={handlers.cancel}
                successCallback={handlers.success}
              />
            </InitializeVAPServiceID>
          )}
          <Link to={returnPath}>{`Return to ${returnPathName}`}</Link>
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
