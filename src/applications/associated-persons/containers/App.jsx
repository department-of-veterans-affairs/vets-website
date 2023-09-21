import React from 'react';
// import PersonalDetails from '../components/PersonalDetails';
import EmergencyContact from '../components/emergency-contact';

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
                  <a href="/profile/accoutn/security">Account Security</a>
                </li>
                <li>
                  <a href="/associated-persons">Emergency Contact</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="vads-l-col--9">
          <EmergencyContact />
        </div>
      </div>
    </div>
  );
};

export default App;
