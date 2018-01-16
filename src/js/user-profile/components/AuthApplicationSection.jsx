import PropTypes from 'prop-types';
import React from 'react';

const contentConditions = [
  [
    <p key="hca"><a href="/health-care/apply/">Apply for health care</a></p>,
    ['hca']
  ],
  [
    (<p key="edu-benefits"><a href="/education/apply-for-education-benefits">
      Apply for Education Benefits
    </a></p>),
    ['edu-benefits']
  ],
  [
    <p key="rx"><a href="/health-care/prescriptions">Refill your prescription</a></p>,
    ['rx']
  ],
  [
    <p key="messaging"><a href="/health-care/messaging">Message your health care team</a></p>,
    ['messaging']
  ],
  [
    <p key="health-records"><a href="/health-care/health-records">Get your VA health records</a></p>,
    ['health-records']
  ],
  [
    <p key="claims"><a href="/track-claims">Check your claim and appeal status</a></p>,
    ['evss-claims', 'appeals-status']
  ],
  [
    (<p key="post-911"><a href="/education/gi-bill/post-9-11/ch-33-benefit">
      Get your Post-9/11 GI Bill statement of benefits
    </a></p>),
    ['evss-claims']
  ],
  [
    <p key="vic"><a href="/veteran-id-card">Apply for a Veteran ID Card</a></p>,
    ['id-card']
  ]
];

class AuthApplicationSection extends React.Component {
  render() {
    const { services } = this.props.userProfile;
    const availableServices = new Set(services);
    const availableContent = [];
    const unavailableContent = [];

    contentConditions.forEach(([content, requiredServices]) => {
      const isAccessible =
        !requiredServices ||
        requiredServices.every(service => availableServices.has(service));

      if (isAccessible) {
        availableContent.push(content);
      } else {
        unavailableContent.push(content);
      }
    });

    return (
      <div>
        <div className="profile-section medium-12 columns">
          <h4 className="section-header">Available services</h4>
          <div className="medium-12 columns">
            {
              !!availableContent.length && (
                <div>
                  <p><span className="label">Your account will allow you to:</span></p>
                  <div className="available-services">
                    {availableContent}
                  </div>
                </div>
              )
            }
            {
              !!unavailableContent.length && (
                <div>
                  <p><span className="label"><a href="/verify?next=/profile">Verify your identity</a> to access more services you may be eligible for, like:</span></p>
                  <div className="unavailable-services">
                    {unavailableContent}
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="profile-section">
          <p><strong>Have a less than honorable discharge?</strong><br/>
          You can apply for an upgrade. If your application goes through and your discharge is upgraded, you'll be eligible for the VA benefits you earned during your period of service. <a href="/discharge-upgrade-instructions/">Find out how to apply for a discharge upgrade</a>.</p>
        </div>
      </div>
    );
  }
}

AuthApplicationSection.propTypes = {
  userProfile: PropTypes.object.isRequired
};

export default AuthApplicationSection;
