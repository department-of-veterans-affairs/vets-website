import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import {
  fetchDuplicateContactInfo,
  fetchPersonalInformation,
} from '../actions';
import createFormConfigFromFeatureFlag from '../config/form';
import { getAppData } from '../selectors';

function App({
  formData,
  getDuplicateContactInfo,
  getPersonalInformation,
  mebDpoAddressOptionEnabled,
  showMeb54901990eTextUpdate,
  setFormData,
  user,
  duplicateEmail,
  duplicatePhone,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [dynamicFormConfig, setDynamicFormConfig] = useState(null);
  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const match = useRouteMatch();
  const location = useLocation();

  useEffect(
    () => {
      setIsLoading(true);
      const config = createFormConfigFromFeatureFlag(
        showMeb54901990eTextUpdate,
      );
      setDynamicFormConfig(config);
      const generatedRoutes = createRoutesWithSaveInProgress(config);
      setDynamicRoutes(generatedRoutes);
      setIsLoading(false);
    },
    [showMeb54901990eTextUpdate],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }
    },
    [fetchedUserInfo, getPersonalInformation, user?.login?.currentlyLoggedIn],
  );

  useEffect(
    () => {
      if (
        dynamicFormConfig &&
        mebDpoAddressOptionEnabled !== formData.mebDpoAddressOptionEnabled
      ) {
        setFormData({
          ...formData,
          mebDpoAddressOptionEnabled,
        });
      }
    },
    [mebDpoAddressOptionEnabled, formData, setFormData, dynamicFormConfig],
  );

  useEffect(
    () => {
      if (!dynamicFormConfig) return;

      if (
        duplicateEmail?.length > 0 &&
        duplicateEmail !== formData?.duplicateEmail
      ) {
        setFormData({
          ...formData,
          duplicateEmail,
        });
      }

      if (
        duplicatePhone?.length > 0 &&
        duplicatePhone !== formData?.duplicatePhone
      ) {
        setFormData({
          ...formData,
          duplicatePhone,
        });
      }

      if (
        (formData?.mobilePhone?.phone || formData?.email) &&
        !formData?.duplicateEmail &&
        !formData?.duplicatePhone
      ) {
        getDuplicateContactInfo(
          [{ value: formData?.email?.email, dupe: '' }],
          [
            {
              value: formData?.mobilePhone?.phone,
              dupe: '',
            },
          ],
        );
      }
    },
    [
      getDuplicateContactInfo,
      formData,
      setFormData,
      dynamicFormConfig,
      duplicateEmail,
      duplicatePhone,
    ],
  );

  if (isLoading || !dynamicFormConfig) {
    return <div>Loading form application...</div>;
  }

  if (location.pathname === match.path && dynamicFormConfig.introduction) {
    const introPathObj = dynamicRoutes.find(
      r => r.path === 'introduction' || r.path === '/introduction',
    );
    if (introPathObj) {
      const relativeIntroPath = introPathObj.path.startsWith('/')
        ? introPathObj.path.substring(1)
        : introPathObj.path;
      const targetPath = `${
        match.path === '/' ? '' : match.path
      }/${relativeIntroPath}`.replace('//', '/');
      return <Redirect to={targetPath} />;
    }
  }

  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
            label="Breadcrumbs"
            wrapping
            breadcrumbList={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/family-and-caregiver-benefits',
                label: 'VA benefits for family and caregivers',
              },
              {
                href: '/family-and-caregiver-benefits/education-and-careers',
                label: 'Education and career benefits for family members',
              },
              {
                href:
                  '/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490',
                label: 'Apply for education benefits as an eligible dependent',
              },
            ]}
          />
        </div>
      </div>
      <RoutedSavableApp
        formConfig={dynamicFormConfig}
        currentLocation={location}
      >
        <Switch>
          {dynamicRoutes.map(route => {
            const relativePath = route.path.startsWith('/')
              ? route.path.substring(1)
              : route.path;
            let basePath = match.path;
            if (basePath !== '/' && !basePath.endsWith('/')) {
              basePath += '/';
            }
            if (basePath === '/') {
              basePath = '';
            }
            const fullPath = `${basePath}${relativePath}`.replace('//', '/');
            const PageComponent = route.component;
            return (
              <Route
                key={fullPath || 'index'}
                exact
                path={fullPath}
                render={routerProps => (
                  <PageComponent
                    {...routerProps}
                    {...route}
                    form={dynamicFormConfig}
                  />
                )}
              />
            );
          })}
        </Switch>
      </RoutedSavableApp>
    </>
  );
}

App.propTypes = {
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  formData: PropTypes.object,
  getDuplicateContactInfo: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  mebDpoAddressOptionEnabled: PropTypes.bool,
  showMeb54901990eTextUpdate: PropTypes.bool,
  setFormData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const appData = getAppData(state);
  return {
    ...appData,
    formData: state.form?.data || {},
    user: state.user,
    showMeb54901990eTextUpdate:
      state.featureToggles?.showMeb54901990eTextUpdate,
    mebDpoAddressOptionEnabled:
      state.featureToggles?.mebDpoAddressOptionEnabled,
    duplicateEmail: appData.duplicateEmail || state.data?.duplicateEmail,
    duplicatePhone: appData.duplicatePhone || state.data?.duplicatePhone,
  };
};

const mapDispatchToProps = {
  getPersonalInformation: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
