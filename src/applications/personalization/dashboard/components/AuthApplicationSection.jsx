import PropTypes from 'prop-types';
import React from 'react';
import ClaimsManifest from '../../../claims-status/manifest.json';
import DischargeWizardManifest from '../../../discharge-wizard/manifest.json';
import HealthRecordsManifest from '../../../health-records/manifest.json';

class AuthApplicationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="profile-section medium-12 columns">
          <h4 className="section-header">Services</h4>
          <div className="medium-12 columns">
            <p key="hca"><a href="/health-care/how-to-apply/">Apply for health care</a></p>
            <p key="edu-benefits"><a href="/education/apply-for-education-benefits">Apply for Education Benefits</a></p>
            <p key="rx"><a href="/health-care/refill-track-prescriptions">Refill your prescription</a></p>
            <p key="messaging"><a href="/health-care/secure-messaging">Message your health care team</a></p>
            <p key="health-records"><a href={HealthRecordsManifest.rootUrl}>Get your VA health records</a></p>
            <p key="claims"><a href={ClaimsManifest.rootUrl}>Check your claim and appeal status</a></p>
            <p key="post-911"><a href="/education/gi-bill/post-9-11/ch-33-benefit">Get your Post-9/11 GI Bill statement of benefits</a></p>
            <p key="vic"><a href="/veteran-id-card">Apply for a Veteran ID Card</a></p>
            <p>
              <strong>Have a less than honorable discharge?</strong><br/>
              You can apply for an upgrade. If your application goes through and your discharge is upgraded, you'll be eligible for the VA benefits you earned during your period of service. <a href={`${DischargeWizardManifest.rootUrl}/`}>Find out how to apply for a discharge upgrade</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

AuthApplicationSection.propTypes = {
  userProfile: PropTypes.object.isRequired
};

export default AuthApplicationSection;
