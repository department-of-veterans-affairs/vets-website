import React from 'react';
import PropTypes from 'prop-types';

import { Toggler } from 'platform/utilities/feature-toggles';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
  TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_FORM_START,
  TRACKING_526EZ_SIDENAV_TOGGLE,
} from '../constants';
import {
  howLongForDecision,
  dependentsAdditionalBenefits,
} from '../content/confirmation-page';
import { alertBody } from '../content/confirmation-poll';
import { ClaimConfirmationInfo } from '../components/ClaimConfirmationInfo';
import { BddConfirmationAlert } from '../content/bddConfirmationAlert';
import ConfirmationPageErrorBoundary from '../components/ConfirmationPageErrorBoundary';
import { capitalizeEachWord } from '../utils';

export const getNewConditionsNames = (names = []) => {
  const cleaned = names
    .filter(name => typeof name === 'string' && name.trim() !== '')
    .map(name => capitalizeEachWord(name.trim().toLowerCase()));

  return [...new Set(cleaned)];
};

export default class ConfirmationPage extends React.Component {
  componentDidMount() {
    setTimeout(() => focusElement('va-alert h2'), 100);
  }

  ConfirmationPageContent = props => {
    const newConditionsNames = getNewConditionsNames(props.disabilities);

    return (
      <ConfirmationView
        submitDate={props.submittedAt}
        formConfig={props.route?.formConfig}
      >
        <ConfirmationView.SubmissionAlert actions={<></>} content={alertBody} />
        {props.isSubmittingBDD && <BddConfirmationAlert />}
        <ClaimConfirmationInfo
          claimId={props.claimId}
          conditions={newConditionsNames}
          dateSubmitted={props.submittedAt}
          fullName={props.fullName}
          isSubmittingBDD={props.isSubmittingBDD}
        />
        <Toggler
          toggleName={Toggler.TOGGLE_NAMES.disability526ShowConfirmationReview}
        >
          <Toggler.Enabled>
            <ConfirmationPageErrorBoundary>
              <ConfirmationView.ChapterSectionCollection showPageTitles />
            </ConfirmationPageErrorBoundary>
          </Toggler.Enabled>
        </Toggler>
        <ConfirmationView.PrintThisPage />
        <ConfirmationView.WhatsNextProcessList
          item1Header="We’ll send you an email to confirm your submission"
          item1Content={<></>}
          item1Actions={<></>}
          item2Header="Next we’ll send you a letter to let you know we have your claim"
          item2Content="You should get this letter in about 1 week, plus mailing time, after we receive your claim."
        />
        <p className="vads-u-margin-top--2">
          <va-link
            href="https://www.va.gov/disability/after-you-file-claim/"
            text="Learn more about the VA process after you file your claim"
          />
        </p>
        <ConfirmationView.HowToContact />
        {howLongForDecision}
        {dependentsAdditionalBenefits}
        <ConfirmationView.GoBackLink />
        <ConfirmationView.NeedHelp />
      </ConfirmationView>
    );
  };

  render() {
    // Reset wizard and form status
    sessionStorage.removeItem(WIZARD_STATUS);
    sessionStorage.removeItem(FORM_STATUS_BDD);
    sessionStorage.removeItem(SAVED_SEPARATION_DATE);

    // Clear tracking session storage
    sessionStorage.removeItem(TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS);
    sessionStorage.removeItem(TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS);
    sessionStorage.removeItem(TRACKING_526EZ_SIDENAV_FORM_START);
    sessionStorage.removeItem(TRACKING_526EZ_SIDENAV_TOGGLE);

    return this.ConfirmationPageContent(this.props);
  }
}

ConfirmationPage.propTypes = {
  disabilities: PropTypes.array.isRequired,
  fullName: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  submittedAt: PropTypes.object.isRequired,
  claimId: PropTypes.number,
  isSubmittingBDD: PropTypes.bool,
  jobId: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  submissionId: PropTypes.string,
  submissionStatus: PropTypes.oneOf(Object.values(submissionStatuses)),
};
