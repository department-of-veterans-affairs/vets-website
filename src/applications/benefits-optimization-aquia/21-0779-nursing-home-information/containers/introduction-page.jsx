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

      <h3>What is a qualified extended care facility?</h3>
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
          a nursing home care unit in a State Veterans Home that is approved for
          payment, or
        </li>
        <li>a VA nursing home care unit.</li>
      </ul>
      <va-link
        href="/pension/aid-attendance-housebound/"
        text="Learn more about how the VA defines a nursing home."
      />

      <p className="vads-u-margin-top--2">
        You’ll need to provide the following information about the patient:
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
