import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import IdNotVerifiedAlert from '../../shared/components/IdNotVerified';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '10',
  ombNumber: '2900-0858',
  expDate: '08/31/2027',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle: 'Authorize the release of non-VA medical information to VA',
    formSubTitle:
      'Authorization to disclose information to the Department of Veterans Affairs (VA) (VA Forms 21-4142 and 21-4142a)',
    authStartFormText: 'Start the medical release authorization',
    saveInProgressText:
      'Please complete the 21-4142 form to authorize the release of non-VA medical records to VA.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
        Complete this form if you want to give us permission to request your
        records from a non-VA source to support your benefit claim. You can also
        use this form to authorize the release of records on behalf of a Veteran
        you support.
      </p>
      <h2 className="vads-u-font-size--h3">
        What to know before you submit this form
      </h2>
      <ul className="vads-u-margin-bottom--4">
        <li>
          If you already provided your private, non-VA medical records to us, or
          if you intended to get them yourself, you don’t need to submit this
          form. Submitting the form in this case will add time to your claim
          process.
        </li>
        <li>
          You don’t need to submit this form to request VA medical records.
        </li>
        <li>
          By law, we can’t pay any fees that may come from requesting your
          medical records.
        </li>
      </ul>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <IdNotVerifiedAlert formNumber="21-4142" formType="authorization" />
        )}
    </>
  );

  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      devOnly={{
        forceShowFormControls: true,
      }}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
