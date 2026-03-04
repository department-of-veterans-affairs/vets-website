import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '15',
  ombNumber: '2900-0093',
  expDate: '08/31/2027',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle:
      'APPLICATION FOR AUTOMOBILE OR OTHER CONVEYANCE AND ADAPTIVE EQUIPMENT (VA 21-4502)',
    formSubTitle: '',
    authStartFormText: 'Start the application',
    saveInProgressText:
      'Please complete the 21-4502 form to apply for automobile or adaptive equipment compensation.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
        Use this form if you are a Veteran with a disability and want to apply
        for compensation for a vehicle that meets your needs. This may include a
        specially equipped vehicle for you to drive or adaptive equipment to
        help you get in and out of your vehicle.
      </p>

      <div>
        <h2>Please read this before you start:</h2>
        <ul>
          <li>You must answer all questions fully and accurately.</li>
          <li>You can save your progress and return to this form later.</li>
          <li>
            This form is for applying for automobile or adaptive equipment
            benefits under 38 U.S.C. 3901-3904.
          </li>
        </ul>
      </div>

      <div className="vads-u-margin-bottom--5">
        <h2>What you need</h2>
        <ul>
          <li>
            <strong>Personal information:</strong> Name, date of birth, Social
            Security Number, and VA file number or service number if you have
            one.
          </li>
          <li>
            <strong>Contact information:</strong> Mailing address, phone number,
            and email address.
          </li>
          <li>
            <strong>Service information:</strong> Branch of service, active duty
            status, and dates of entry and release if applicable.
          </li>
          <li>
            <strong>Application details:</strong> Type of conveyance
            (automobile, van, truck, etc.) and whether you have applied before.
          </li>
        </ul>
      </div>
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
  userIdVerified: PropTypes.bool,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
