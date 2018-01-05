import PropTypes from 'prop-types';
import React from 'react';

const contentConditions = [
  [
    <p><a href="/health-care/apply/">Apply for health care</a></p>,
    ['hca']
  ],
  [
    (<p><a href="/education/apply-for-education-benefits">
      Apply for Education Benefits
    </a></p>),
    ['edu-benefits']
  ],
  [
    <p><a href="/health-care/prescriptions">Refill your prescription</a></p>,
    ['rx']
  ],
  [
    <p><a href="/health-care/messaging">Message your health care team</a></p>,
    ['messaging']
  ],
  [
    <p><a href="/health-care/health-records">Get your VA health records</a></p>,
    ['health-records']
  ],
  [
    <p><a href="/track-claims">Check your claim and appeal status</a></p>,
    ['evss-claims', 'appeals-status']
  ],
  [
    (<p><a href="/education/gi-bill/post-9-11/ch-33-benefit">
      Get your Post-9/11 GI Bill statement of benefits
    </a></p>),
    ['evss-claims']
  ],
  [
    <p><a href="/veteran-id-card">Apply for a Veteran ID Card</a></p>,
    ['id-card']
  ]
];

class AuthApplicationSection extends React.Component {
  render() {
    const { services } = this.props.userProfile;
    const availableServices = [];
    const unavailableServices = [];
    const isAvailable = services.reduce((acc, service) => {
      acc[service] = true;
      return acc;
    }, {});

    contentConditions.forEach(([content, requiredServices]) => {
      // VIC should not prompt for identity proofing when unavailable.
      const idCard = 'id-card';
      const vic = requiredServices.length === 1 && requiredServices[0] === idCard;
      if (vic) {
        if (isAvailable[idCard]) { availableServices.push(content); }
        return;
      }

      const accessible =
        requiredServices.reduce((acc, service) => acc && isAvailable[service], true);
      if (accessible) {
        availableServices.push(content);
      } else {
        unavailableServices.push(content);
      }
    });

    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Available services</h4>
        <div className="medium-12 columns">
          {
            !!availableServices.length && (
              <p><span className="label">Your account will allow you to:</span></p>
            )
          }
          {availableServices}
          {
            !!unavailableServices.length && (
              <p><span className="label">You need to <a href="/verify?next=/profile">verify your identity</a> in order to:</span></p>
            )
          }
          {unavailableServices}
        </div>
      </div>
    );
  }
}

AuthApplicationSection.propTypes = {
  userProfile: PropTypes.object.isRequired
};

export default AuthApplicationSection;
