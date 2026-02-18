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
  expDate: '12/31/2028',
};

const childContent = (
  <>
    <div className="va-introtext">
      <p>
        Use this form to verify your marital status and maintain your
        eligibility for Dependency and Indemnity Compensation (DIC) benefits.
      </p>
    </div>
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
        If you are certifying that you are married for the purpose of VA
        benefits, your marriage must be recognized by the place where you and/or
        your spouse resided at the time of marriage, or where you and/or your
        spouse resided when you filed your claim (or a later date when you
        became eligible for benefits) (38 U.S.C. § 103(c)). Additional guidance
        on when VA recognizes marriages is available at{' '}
        <va-link
          href="http://www.va.gov/opa/marriage/"
          text="http://www.va.gov/opa/marriage/"
        />
        .
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
