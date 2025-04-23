import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  React.useEffect(() => {
    document.title = 'Apply for the IBM SkillsBuild program | Veterans Affairs';
  }, []);
  return (
    <div className="form-22-10282-container row">
      <Breadcrumbs />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  location: PropTypes.object,
};
