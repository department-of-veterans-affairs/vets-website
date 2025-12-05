import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Verify your marital status for DIC benefits',
  formSubTitle: 'Marital Status Questionnaire (VA Form 21P-0537)',
  authStartFormText: 'Verify your marital status',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-0495',
  expDate: '8/31/2025',
};

const childContent = (
  <>
    <p>
      Use this form to verify your marital status and maintain your eligibility
      for Dependency and Indemnity Compensation (DIC) benefits.
    </p>
    <h2>What to know before you fill out this form</h2>
    <ul>
      <li>
        It’s important to report any changes to your marital status if you
        receive DIC benefits.
      </li>
      <li>
        If we sent you a letter asking you to verify your marital status, you
        must complete and submit this form within 60 days from the date on the
        letter.
      </li>
      <li>
        Your state must recognize your marriage. This could be the state where
        you both lived when you got married. Or it could also be the state you
        lived when you filed your first claim or became eligible for benefits.
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
