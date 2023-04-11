import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseFieldEditingPage}>
      <Toggler.Enabled>
        <div className="vads-u-display--block medium-screen:vads-u-display--block">
          <h2>Welcome to the new field editing page!</h2>

          <p>
            Field name: <span>{fieldName}</span>
          </p>
          <p>Return Path: {returnPath}</p>

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
