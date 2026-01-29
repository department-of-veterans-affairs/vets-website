import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import AlertErrorBoundry from './alerts/AlertErrorBoundry.jsx';
import manifest from '../manifest.json';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error) {
    recordEvent({
      event: 'landing-page-rendering-error',
    });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <>
        <div className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--5">
          <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
            <VaBreadcrumbs
              homeVeteransAffairs
              breadcrumbList={[
                { label: 'VA.gov home', href: '/' },
                { label: 'My HealtheVet', href: manifest.rootUrl },
              ]}
            />
            <div className="vads-l-col medium-screen:vads-l-col--8">
              <div className="vads-l-col">
                <div className="vads-l-row">
                  <div className="vads-l-col-6 ">
                    <h1 className="vads-u-margin-y--0">My HealtheVet</h1>
                  </div>
                  <div className="vads-l-col-2 vads-u-margin-left--2 vads-u-margin-top--2">
                    <span className="usa-label vads-u-background-color--primary">
                      New
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
              <AlertErrorBoundry />
            </div>
          </div>
        </div>
      </>
    );

    return hasError || !children ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  isPreCheckIn: PropTypes.bool,
};

export default ErrorBoundary;
