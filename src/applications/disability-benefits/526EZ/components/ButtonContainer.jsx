import React from 'react';
import PropTypes from 'prop-types';

export default function ButtonContainer(props) {
  const { user, loginUrl, verifyUrl, checkGuidanceStatus, isChoosingStatus, atGuidance, goBack, goForward, authenticate } = props;
  const { atIncreaseGuidance, atEbenefitsGuidance } = checkGuidanceStatus();

  return  (<div>
    {!isChoosingStatus() &&
    <button type="button" className="usa-button-secondary" onClick={goBack}><span className="button-icon">« </span>Back</button>
    }
    {atIncreaseGuidance && !sessionStorage.userToken &&
    <a className="usa-button-primary" href="/disability-benefits/526/apply-for-increase/introduction/" onClick={authenticate}>Sign In or Create an Account<span className="button-icon"> »</span></a>
    }
    {atIncreaseGuidance && sessionStorage.userToken &&
      <a className="usa-button-primary" href={`/verify?next=${'/disability-benefits/526/apply-for-increase/introduction/'}`}>Apply for Claim for Increase<span className="button-icon"> »</span></a>}
    {atEbenefitsGuidance &&
    <a className="usa-button-primary" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation">Go to eBenefits<span className="button-icon"> »</span></a>
    }
    {!atGuidance() &&
    <a className="usa-button-primary" onClick={goForward}>Next<span className="button-icon"> »</span></a>
    }
  </div>);
}

ButtonContainer.propTypes = {
  user: PropTypes.object.isRequired,
  loginUrl: PropTypes.string.isRequired,
  verifyUrl: PropTypes.func.isRequired,
  checkGuidanceStatus: PropTypes.func.isRequired,
  isChoosingStatus: PropTypes.func.isRequired,
  atGuidance: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired,
};
