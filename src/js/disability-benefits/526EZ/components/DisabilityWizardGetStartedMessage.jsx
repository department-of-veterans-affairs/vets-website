import React from 'react';
import PropTypes from 'prop-types';

export default function GetStartedMessage({ checkDisabilityStatus }) {
  const { isFirst, isAppeal, isAddOnly, isAddAndIncrease } = checkDisabilityStatus();
  const signInMessage = sessionStorage.userToken ? '' : ' Please sign in or create an account before starting the application.';
  let getStartedMessage = `Since you have a worsening condition to add to your claim, you’ll need to file a claim for increased disability.${signInMessage}`;
  if (isFirst) {
    getStartedMessage = 'We’re sorry. We’re unable to file original claims on Vets.gov at this time. Since you’re filing your first disability claim, you’ll need to file your claim on eBenefits.';
  }
  if (isAppeal) {
    getStartedMessage = (<span>If you disagree with our decision on your disability claim, you can appeal it. <br/>
      <a href="/disability-benefits/claims-appeal/">Learn how to file an appeal.</a>
    </span>);
  }
  if (isAddOnly) {
    getStartedMessage = 'Since you have a new condition to add to your rated disability claim, you’ll need to file your disability claim on eBenefits.';
  }
  if (isAddAndIncrease) {
    getStartedMessage = 'Since you have both new and worsening conditions, you’ll need to file your disability claim on eBenefits.';
  }
  return <p>{getStartedMessage}</p>;
}

GetStartedMessage.propTypes = {
  checkDisabilityStatus: PropTypes.func.isRequired
};
