import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0361';
const OMB_EXP_DATE = '07/31/2027';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <p>
          <strong>
            To fill out this application, you’ll need your or your sponsor’s:
          </strong>
        </p>
        <ul>
          <li>Social Security number or VA file number (c-file number)</li>
        </ul>
        <p>
          <strong>
            You’ll also need the name and address of the nursing home, and the
            date you were admitted.
          </strong>
        </p>
        <va-additional-info trigger="What if I need help filling out my application?">
          <p>
            An accredited representative, like a Veterans Service Officer (VSO),
            can help you fill out your application.{' '}
            <a href="/disability/get-help-filing-claim/">
              Get help filing your claim
            </a>
            .
          </p>
        </va-additional-info>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>Complete this nursing home information form.</p>
        <p>
          After submitting the form, you’ll get a confirmation message. You can
          print this for your records.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          We process applications in the order we receive them. The amount of
          time it takes us to review your application depends on:
        </p>
        <ul>
          <li>The type of benefit you’re applying for</li>
          <li>
            How many applications we have to review when we receive your
            application
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          Once we’ve reviewed your application, you’ll receive a notice in the
          mail about the decision.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = ({ route }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { formConfig, pageList } = route;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />

      <p className="vads-u-font-size--lg">
        Use this form to verify a Veteran or someone connected to a Veteran is a
        patient in a qualifying extended care facility.
      </p>

      <h2 className="vads-u-margin-top--3">
        What to know before you fill out this form
      </h2>
      <p>
        Only a nursing home official from a qualified extended care facility can
        fill out this form. As a responsible official of the nursing home,
        you’ll certify that the facility provides nursing care for the claimant
        who has a mental or physical disability.
      </p>

      <va-additional-info trigger="What is a qualified extended care facility?">
        <p>
          For the purposes of meeting the Aid and Attendance criteria, a nursing
          home is defined as:
        </p>
        <ul>
          <li>
            any extended care facility that is licensed by a state to provide
            skilled or intermediate-level nursing care
          </li>
          <li>
            a nursing home care unit in a State Veterans Home that is approved
            for payment, or
          </li>
          <li>a VA nursing home care unit.</li>
        </ul>
        <p>
          <a href="/pension/aid-attendance-housebound/">
            Learn more about how the VA defines a nursing home
          </a>
          .
        </p>
      </va-additional-info>

      <p className="vads-u-margin-top--2">
        <strong>
          You’ll need to provide the following information about the patient:
        </strong>
      </p>
      <ul>
        <li>Social Security number or VA file number</li>
        <li>Date of birth</li>
        <li>Level of care at the facility</li>
        <li>Medicaid status</li>
        <li>Monthly out of pocket cost</li>
      </ul>
      <p>
        In some cases, the patient may be the spouse or parent of a Veteran. In
        that case, you’ll also need to identify the Veteran they’re connected
        to.
      </p>

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--3">
        Follow the steps below to provide VA with your nursing home information
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <div className="vads-u-margin-top--4">
        <va-omb-info
          res-burden={OMB_RES_BURDEN}
          omb-number={OMB_NUMBER}
          exp-date={OMB_EXP_DATE}
        />
      </div>
    </article>
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
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
