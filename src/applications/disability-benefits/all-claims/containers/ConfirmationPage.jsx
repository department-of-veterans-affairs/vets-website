import React from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';

import {
  focusElement,
  scrollToTop,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../constants';
import {
  retryableErrorContent,
  successfulSubmitContent,
  submitErrorContent,
  howLongForDecision,
  dependentsAdditionalBenefits,
} from '../content/confirmation-page';
import { alertBody } from '../content/confirmation-poll';
import { ClaimConfirmationInfo } from '../components/ClaimConfirmationInfo';
import { BddConfirmationAlert } from '../content/bddConfirmationAlert';

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    scrollToTop();
    setTimeout(() => focusElement('va-alert h2'), 100);
  }

  // the legacy 526 confirmation page that has 3 states
  LegacyConfirmationPage = props => {
    switch (props.submissionStatus) {
      case submissionStatuses.succeeded:
        return successfulSubmitContent(props);
      case submissionStatuses.retry:
      case submissionStatuses.exhausted:
      case submissionStatuses.apiFailure:
        return retryableErrorContent(props);
      default:
        return submitErrorContent(props);
    }
  };

  // the new 526 submission confirmation that has one state
  ConfirmationPageContent = props => (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.disability526NewConfirmationPage}>
      <Toggler.Enabled>
        <ConfirmationView
          submitDate={props.submittedAt}
          formConfig={props.route?.formConfig}
        >
          <ConfirmationView.SubmissionAlert
            actions={<></>}
            content={alertBody}
          />
          {props.isSubmittingBDD && <BddConfirmationAlert />}
          <ClaimConfirmationInfo
            claimId={props.claimId}
            conditions={props.disabilities}
            dateSubmitted={props.submittedAt}
            fullName={props.fullName}
            isSubmittingBDD={props.isSubmittingBDD}
          />
          <ConfirmationView.PrintThisPage />
          <ConfirmationView.WhatsNextProcessList
            item1Header="We’ll send you an email to confirm your submission"
            item1Content={<></>}
            item1Actions={<></>}
            item2Header="Next we’ll send you a letter to let you know we have your claim"
            item2Content="You should get this letter in about 1 week, plus mailing time, after we receive your claim."
          />
          <ConfirmationView.HowToContact />
          {howLongForDecision}
          {dependentsAdditionalBenefits}
          <ConfirmationView.GoBackLink />
          <ConfirmationView.NeedHelp />
        </ConfirmationView>
      </Toggler.Enabled>
      <Toggler.Disabled>{this.LegacyConfirmationPage(props)}</Toggler.Disabled>
    </Toggler>
  );

  render() {
    // Reset everything
    sessionStorage.removeItem(WIZARD_STATUS);
    sessionStorage.removeItem(FORM_STATUS_BDD);
    sessionStorage.removeItem(SAVED_SEPARATION_DATE);
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
