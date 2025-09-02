import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0232';
const OMB_EXP_DATE = '08/31/2026';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>When you apply, be sure to have these on hand:</h4>
        <ul>
          <li>
            Personal information about the deceased (including Social Security
            number and date of birth).
          </li>
          <li>
            Military history of deceased or of the Veteran or service member
            they’re connected to.
          </li>
          <li>
            The name of the VA national cemetery preferred for burial.{' '}
            <a
              href="https://www.va.gov/burials-memorials/find-a-cemetery/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find a VA national cemetery (opens in a new tab)
            </a>
          </li>
        </ul>
        <h4>To help us process your application faster, you can upload:</h4>
        <ul>
          <li>
            A copy of the deceased’s or their sponsor’s DD214 or other
            separation files
          </li>
          <li>
            Supporting files or an affidavit showing you can complete the
            application on the deceased’s behalf
          </li>
        </ul>
        <h4>Other information for certain applicants you can provide:</h4>
        <ul>
          <li>
            <strong>
              If the deceased is the legally married spouse or the surviving
              spouse of a Veteran or service member
            </strong>
            , you’ll need their personal details (including Social Security
            number and date of birth).
          </li>
          <li>
            <strong>
              If you’re preparing the application for a deceased unmarried adult
              child of a Veteran or service member
            </strong>
            , you can also upload supporting files with details about the adult
            child’s disability.
          </li>
        </ul>
        <h4>What if I need help filling out my application?</h4>
        <p>
          An accredited representative, like a Veterans Service Officer (VSO),
          can help you fill out your claim.{' '}
          <a
            href="https://www.va.gov/disability-benefits/apply/help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get help filing your claim (opens in a new tab)
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>
          Complete the application for burial in a VA national cemetery. After
          submitting this form, you’ll get a confirmation message. You can print
          this for your records.
        </p>
        <a
          href="/burials-and-memorials/application/530/"
          className="vads-c-action-link--green"
        >
          Start the application
        </a>
      </va-process-list-item>
      <va-process-list-item header="VA review">
        <p>We’ll let you know by phone or mail if we need more information.</p>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          You’ll be notified by the National Cemetery Scheduling Office about
          the decision once we process your claim.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { route } = props;
  const { formConfig, pageList } = route;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for burial benefits.
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
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
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
