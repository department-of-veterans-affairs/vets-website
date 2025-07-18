import React from 'react';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { Toggler } from 'platform/utilities/feature-toggles';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../constants';
import {
  howLongForDecision,
  dependentsAdditionalBenefits,
} from '../content/confirmation-page';
import { alertBody } from '../content/confirmation-poll';
import { ClaimConfirmationInfo } from '../components/ClaimConfirmationInfo';
import { BddConfirmationAlert } from '../content/bddConfirmationAlert';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/fixtures/data/maximal-modern-0781-test.json');
  // mockData = require('../tests/fixtures/data/maximal-toxic-exposure-test.json');
  mockData = mockData?.data;
}
export default class ConfirmationPage extends React.Component {
  componentDidMount() {
    setTimeout(() => focusElement('va-alert h2'), 100);
  }

  ConfirmationPageContent = props => (
    <ConfirmationView
      submitDate={props.submittedAt}
      formConfig={props.route?.formConfig}
      devOnly={{
        showButtons: true,
        mockData,
      }}
    >
      <ConfirmationView.SubmissionAlert actions={<></>} content={alertBody} />
      {props.isSubmittingBDD && <BddConfirmationAlert />}
      <ClaimConfirmationInfo
        claimId={props.claimId}
        conditions={props.disabilities}
        dateSubmitted={props.submittedAt}
        fullName={props.fullName}
        isSubmittingBDD={props.isSubmittingBDD}
      />
      <Toggler
        toggleName={Toggler.TOGGLE_NAMES.disability526ShowConfirmationReview}
      >
        <Toggler.Enabled>
          <h2
            id="confirmation-review-header"
            data-testid="confirmation-review-header"
          >
            Review the information you provided
          </h2>
          {/* <ConfirmationView.ReviewTable formConfig={props.route?.formConfig} /> */}
          <ConfirmationView.ReviewAccordion
            formConfig={props.route?.formConfig}
          />
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
      <ConfirmationView.HowToContact />
      {howLongForDecision}
      {dependentsAdditionalBenefits}
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
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
