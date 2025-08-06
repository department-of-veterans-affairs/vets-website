import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../utils/helpers';
import NeedHelp from '../components/NeedHelp';
import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      ['date-released-from-active-duty'],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
  });
  useEffect(
    () => {
      if (!userLoggedIn && location.pathname !== '/introduction') {
        window.location.href =
          '/education/other-va-education-benefits/high-technology-program/apply-for-high-technology-program-form-22-10297/introduction';
      }
    },
    [userLoggedIn, location],
  );
  return (
    <div className="form-22-10297-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
