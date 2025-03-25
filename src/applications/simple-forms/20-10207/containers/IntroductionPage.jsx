import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

import { TITLE, SUBTITLE } from '../config/constants';

const IntroductionPage = props => {
  const { route } = props;
  // WIP: need to keep unit-tests passing with these new selector-hooks
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  useEffect(() => {
    const { livingSituation, otherReasons, otherHousingRisks } = formData;

    const formNotStarted = ![
      livingSituation,
      otherReasons,
      otherHousingRisks,
    ].some(obj => obj && Object.values(obj).some(el => el != null));

    if (formNotStarted) {
      const dataTransfer = JSON.parse(
        sessionStorage.getItem(`dataTransfer-${VA_FORM_IDS.FORM_20_10207}`),
      );
      if (dataTransfer && Date.now() < dataTransfer.expiry) {
        dispatch(setData({ ...formData, ...dataTransfer.data }));
      }
    }
    sessionStorage.removeItem(`dataTransfer-${VA_FORM_IDS.FORM_20_10207}`);
  }, []);

  const childContent = (
    <>
      <p>
        Use this form to request that we process your claim faster due to
        certain situations.
      </p>
      <h2>What to know before you fill out this form</h2>
      <p>
        If any of these descriptions are true for you, you may qualify for
        priority processing. That means we’ll make a faster decision on your
        claim.
      </p>
      <p>One of these descriptions must be true:</p>
      <ul>
        <li>
          You’re homeless or at risk of becoming homeless, <strong>or</strong>
        </li>
        <li>
          You’re experiencing extreme financial hardship (such as loss of your
          job or a sudden decrease in income), <strong>or</strong>
        </li>
        <li>
          You have ALS (amyotrophic lateral sclerosis), also known as Lou
          Gehrig’s disease, <strong>or</strong>
        </li>
        <li>
          You have a terminal illness (a condition that can’t be treated),{' '}
          <b>or</b>
        </li>
        <li>
          You have a Very Seriously Injured or Ill (VSI) or Seriously Injured or
          Ill (SI) status from the Defense Department (DOD) (this status means
          you have a disability from a military operation that will likely
          result in your discharge from the military), <strong>or</strong>
        </li>
        <li>
          You’re age 85 or older, <b>or</b>
        </li>
        <li>
          You’re a former prisoner of war, <strong>or</strong>
        </li>
        <li>You received the Medal of Honor or the Purple Heart award</li>
      </ul>

      <va-additional-info
        trigger="What to know if you're filling out this form on behalf of someone else"
        uswds
      >
        <p>
          We’ll need one of these forms to show that you have permission to
          receive information about the person’s claim or to sign for the
          person:
        </p>
        <ul className="vads-u-padding-top--2">
          <li>
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-22/"
              text="VA Form 21-22 (for an accredited VSO representative)"
            />
          </li>
          <li>
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-22a/"
              text="VA Form 21-22a (for an accredited attorney or claims agent)"
            />
          </li>
        </ul>
        <p className="vads-u-padding-top--2">
          In this form, we’ll ask you about your relationship to the person with
          the claim. If you’ve submitted 21-22 or 21-22a, we’ll refer to you as
          an “accredited representative with power of attorney.”
        </p>
      </va-additional-info>

      <h2>Types of evidence to submit</h2>
      <p>
        You can submit your request with or without supporting evidence. But we
        encourage you to submit any evidence you have to help us process your
        request faster. The type of evidence you may need depends on your
        qualifying situation. Read the examples listed here to understand the
        types of evidence you may need for different situations.
      </p>

      <h3>Extreme financial hardship</h3>
      <ul>
        <li>Eviction or foreclosure notice</li>
        <li>Notices of past-due utility bills</li>
        <li>Collection notices from creditors</li>
        <li>
          Other supporting documents you think may show evidence of your
          financial hardship
        </li>
      </ul>

      <h3>ALS or other terminal illnesses</h3>
      <ul>
        <li>
          Medical evidence that show an ALS diagnosis or evidence of a terminal
          illness
        </li>
      </ul>
      <p>
        <strong>Note:</strong> If you want us to get your private treatment
        records, you’ll need to submit an authorization to release non-VA
        medical information to us (VA Forms 21-4142 and 21-4142a).
      </p>
      <p>
        <va-link
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/"
          text="Submit an authorization online to release non-VA medical information to us"
        />
      </p>

      <h3>
        Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI)
      </h3>
      <ul>
        <li>
          Military personnel records, such as a determination from the DOD{' '}
          <strong>and</strong>
        </li>
        <li>Medical evidence showing severe disability or injury</li>
      </ul>

      <h3>Former prisoners of war</h3>
      <ul>
        <li>
          Military personnel records such as DD214, Certificate of Release, or
          Discharge from Active Duty,
          <strong>or</strong>
        </li>
        <li>
          Information such as service number, branch and dates of service, dates
          and location of internment, detaining power, or any other information
          relevant to the detainment
        </li>
      </ul>

      <h3>Medal of Honor or Purple Heart award recipients</h3>
      <ul>
        <li>
          Military personnel records, such as DD214, <strong>or</strong>
        </li>
        <li>
          Information showing receipt of Medal of Honor or Purple Heart award
        </li>
      </ul>

      <h2>How to submit supporting evidence</h2>
      <ul>
        <li>
          You can upload your documents online as you complete this form. This
          will help us process your request faster.
        </li>
        <li>You can also send copies of your documents by mail.</li>
      </ul>
      <div className="vads-u-margin-bottom--4">
        <va-additional-info trigger="Where can I send documents by mail?" uswds>
          <p>
            Find the benefit type you’re requesting priority processing for.
            Then use the corresponding mailing address.
          </p>
          <p className="vads-u-padding-top--2">
            <strong>Note:</strong> Please don’t send original documents. Send
            copies instead.
          </p>
          <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
            Compensation claims
          </p>
          <p>
            Department of Veterans Affairs Compensation Intake Center
            <br />
            PO Box 4444
            <br />
            Janesville, WI 53547-4444
          </p>
          <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
            Pension and survivors benefit claims
          </p>
          <p>
            Department of Veterans Affairs Pension Intake Center
            <br />
            PO Box 5365
            <br />
            Janesville, WI 53547-5365
          </p>
          <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
            Board of Veterans’ Appeals
          </p>
          <p>
            Department of Veterans Affairs Board of Veterans' Appeals
            <br />
            PO Box 27063
            <br />
            Washington, DC 20038
          </p>
          <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
            Fiduciary
          </p>
          <p>
            Department of Veterans Affairs Fiduciary Intake Center
            <br />
            PO Box 5211
            <br />
            Janesville, WI 53547-5211
          </p>
        </va-additional-info>
      </div>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <div
            className="id-not-verified-content vads-u-margin-top--4"
            data-testid="verifyIdAlert"
          >
            <VerifyAlert headingLevel={3} />
            <p className="vads-u-margin-top--3">
              If you don’t want to verify your identity right now, you can still
              download and complete the PDF version of this request.
            </p>
            <p className="vads-u-margin-y--3">
              <va-link
                download
                href="https://www.vba.va.gov/pubs/forms/VBA-20-10207-ARE.pdf"
                text="Get VA Form 20-10207 to download"
              />
            </p>
          </div>
        )}
    </>
  );

  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your request for priority processing',
    unauthStartText: 'Sign in to start filling out your form',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };

  const ombInfo = {
    resBurden: '7',
    ombNumber: '2900-0877',
    expDate: '8/31/2026',
  };

  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      userIdVerified={userIdVerified}
      userLoggedIn={userLoggedIn}
      devOnly={{
        forceShowFormControls: true,
      }}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
