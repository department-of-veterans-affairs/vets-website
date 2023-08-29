import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App(props) {
  const { location, children } = props;

  const isIntroPage = location.pathname === '/introduction';

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {isIntroPage ? (
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            {children}
          </div>
        </div>
      ) : (
        <>
          <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--4">
            {formConfig.title} (VA Form 10182)
          </div>
          {/* <div className="vads-u-background-color--primary-alt-lightest vads-u-display--flex">
            <div>
              <a href="#">Back</a>
              <span role="presentation">|</span>
              <a href="#">Task List</a>
              <span role="presentation">|</span>
              <a href="#">Exit form</a>
            </div>
          </div> */}
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns">
              {children}
            </div>
          </div>
        </>
      )}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.any,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
