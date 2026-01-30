import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '45',
  ombNumber: '2900-0404',
  expDate: '07/31/2027',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle:
      "VETERAN'S APPLICATION FOR INCREASED COMPENSATION BASED ON UNEMPLOYABILITY (VA 21-8940) ",
    formSubTitle: '',
    authStartFormText: "Start the veteran's application",
    saveInProgressText:
      'Please complete the 21-8940 form to provide information about your employment.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
        Use this form if you want to apply for Individual Unemployability
        disability benefits for a service-connected condition that prevents you
        from keeping a steady job.
      </p>

      <div>
        <h2>Please read this important information before you start:</h2>
        <ul>
          <li>You must answer all questions fully and accurately.</li>
          <li>You can save your progress and come back to this form later.</li>
          <li>
            This form is for claiming total disability if service-connected
            disabilities have prevented you from getting or keeping a job.
          </li>
        </ul>
      </div>

      <div className="vads-u-margin-bottom--5">
        <h2>What You Need to Get Started Section</h2>

        <ul>
          <li>
            <strong>Basic Information:</strong> We’ll need you to confirm your
            name, birthday, and Social Security or service number, as well as
            the best way for us to reach you via mail, email, or phone.
          </li>
          <li>
            <strong>Disability Information:</strong> Please have ready a list of
            your service-connected disabilities and the contact details for any
            doctors or hospitals that have treated you over the last year.
          </li>
          <li>
            <strong>Employment History:</strong> We’ll ask about when your
            disability started affecting your work, when you last worked full
            time, and your job duties and income for any employers you’ve had in
            the last year.
          </li>
          <li>
            <strong>Education and Training:</strong> You’ll need to share the
            highest level of education you’ve finished, along with any specific
            details and dates for other training or schooling you’ve completed.
          </li>
          <li>
            <strong>Job Search Information:</strong> To help us understand your
            recent efforts, please provide the names and addresses of places
            you’ve applied for work, the types of jobs you were looking for, and
            when you applied.
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
