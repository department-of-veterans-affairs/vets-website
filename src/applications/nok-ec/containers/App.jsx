import React from 'react';
import EmergencyContact from '../components/emergency-contact';
import NextOfKin from '../components/next-of-kin';
import ErrorBoundary from '../components/ErrorBoundary';

const App = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--4">
      <div className="vads-l-row">
        <div className="vads-l-col--3">
          <nav className="va-subnav">
            <div>
              <h2 id="subnav-header" className="vads-u-font-size--h4">
                Profile
              </h2>
              <ul>
                <li>
                  <a href="/profile/account/security">Account Security</a>
                </li>
                <li>
                  <a href="/nok-ec">Emergency Contact</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="vads-l-col--9">
          <h2 className="vads-u-margin-bottom--4">
            Emergency contact and next of kin information
          </h2>
          <ErrorBoundary>
            <EmergencyContact />
            <NextOfKin />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default App;
