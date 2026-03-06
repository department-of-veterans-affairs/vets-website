import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Confirm your marital status to keep your DIC benefits',
  formSubTitle: 'Marital Status Questionnaire (VA Form 21P-0537)',
  authStartFormText: 'Confirm your marital status',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-0495',
  expDate: '12/31/2028',
};

const childContent = (
  <>
    <div className="va-introtext">
      <p>
        Complete this form to confirm your current marital status so you can
        continue receiving Dependency and Indemnity Compensation (DIC) benefits.
      </p>
    </div>
    <h2>Before you start</h2>
    <ul>
      <li>
        You must tell us if your marital status changes. This helps us make sure
        you get the right benefits.
      </li>
      <li>
        <strong>If we sent you a letter:</strong> You need to complete this form
        within 60 days from the date on the letter.
      </li>
      <li>
        <strong>About marriage and VA benefits:</strong> VA recognizes your
        marriage if it was legal where you or your spouse lived when you got
        married. We also recognize your marriage if it was legal where you or
        your spouse lived when you applied for benefits.{' '}
        <va-link
          href="https://www.va.gov/opa/marriage/"
          text="Learn more about when VA recognizes marriages"
        />
      </li>
    </ul>
  </>
);

export const IntroductionPage = ({ route }) => {
  // Using implementation from src/applications/medallions/containers/IntroductionPage.jsx
  // to add user logged in status to formData so we can check it in `depends` funcs.
  const dispatch = useDispatch();
  const storeData = useSelector(reduxState => reduxState);
  const userLoggedIn = isLoggedIn(storeData);
  const formData = storeData.form.data;

  useEffect(
    () => {
      if (userLoggedIn !== formData?.isLoggedIn) {
        dispatch(
          setData({
            ...formData,
            isLoggedIn: userLoggedIn,
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, userLoggedIn],
  );
  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
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

export default IntroductionPage;
