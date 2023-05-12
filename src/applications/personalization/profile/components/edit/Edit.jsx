import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import PropTypes from 'prop-types';
import InitializeVAPServiceIDContainer from '~/platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '~/platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { PROFILE_PATHS } from '../../constants';
import { hasVAPServiceConnectionError } from '~/platform/user/selectors';
import { EditFallbackContent } from './EditFallbackContent';
import getRoutes from '../../routes';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const getReturnPath = (path, routes) => {
  const returnRouteInfo = routes.find(({ path: routePath }) => {
    return routePath === path;
  });
  if (!returnRouteInfo) {
    return null;
  }
  return returnRouteInfo.path;
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

export const Edit = ({ children }) => {
  const routes = getRoutes();
  const history = useHistory();
  const query = useQuery();

  const fieldInfo = getFieldInfo(query.get('fieldName'));
  const validReturnPath = getReturnPath(query.get('returnPath'), routes);

  const hasVAPServiceError = useSelector(state =>
    hasVAPServiceConnectionError(state),
  );

  const handlers = {
    cancel: () => {
      history.push(validReturnPath || PROFILE_PATHS.PROFILE_ROOT);
    },
    success: () => {
      history.push(validReturnPath || PROFILE_PATHS.PROFILE_ROOT, {
        fieldInfo,
      });
    },
  };

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseFieldEditingPage}>
      <Toggler.Enabled>
        {fieldInfo && !hasVAPServiceError ? (
          <div
            className="vads-u-display--block medium-screen:vads-u-display--block"
            id="profile-edit-field-page"
          >
            <h1 className="vads-u-font-size--h2 vads-u-margin-top--2p5">
              {`Add or update your ${fieldInfo.title.toLowerCase()}`}
            </h1>
            {children || (
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
            )}
          </div>
        ) : (
          <EditFallbackContent routes={routes} />
        )}
      </Toggler.Enabled>

      <Toggler.Disabled>
        <EditFallbackContent routes={routes} />
      </Toggler.Disabled>
    </Toggler>
  );
};

Edit.propTypes = {
  children: PropTypes.node,
};
