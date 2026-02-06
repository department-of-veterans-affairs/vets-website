import React, { useEffect } from 'react';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../utils/helpers';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';
import manifest from '../manifest.json';

export default function App({ location, children }) {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
  });
  useEffect(
    () => {
      if (!userLoggedIn && location.pathname !== '/introduction') {
        window.location.href = manifest.rootUrl;
      }
    },
    [userLoggedIn, location],
  );
  return (
    <div className="form-22-8794-container row">
      <div className="desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}
