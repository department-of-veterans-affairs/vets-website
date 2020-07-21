import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { educationWizard10203 } from '../../selectors/educationWizard';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import classNames from 'classnames';
import _ from 'lodash/fp';

const levels = [
  ['newBenefit'],
  ['serviceBenefitBasedOn', 'transferredEduBenefits'],
  ['nationalCallToService', 'sponsorDeceasedDisabledMIA'],
  ['vetTecBenefit'],
  ['sponsorTransferredBenefits'],
  ['applyForScholarship'],
];

export class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);
    // flattens all the fields in levels into object keys
    this.state = []
      .concat(...levels)
      .reduce((state, field) => Object.assign(state, { [field]: null }), {
        open: false,
        educationBenefitSelected:
          sessionStorage.getItem('educationBenefitSelected') || 'none selected',
        wizardCompletionStatus:
          sessionStorage.getItem('EduWizardStatus') || 'not complete',
      });
  }

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  componentDidUpdate() {
    const {
      newBenefit,
      serviceBenefitBasedOn,
      nationalCallToService,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits,
      vetTecBenefit,
      applyForScholarship,
      wizardCompletionStatus,
    } = this.state;
    const { showSTEMScholarship } = this.props;
    const form1995 = showSTEMScholarship ? '10203' : '1995';
    if (wizardCompletionStatus === 'pending') {
      if (
        newBenefit === 'yes' &&
        nationalCallToService === 'no' &&
        vetTecBenefit === 'no'
      ) {
        this.setEduBenefitFormSelected('1990');
        this.setWizardCompletionStatus('complete');
      } else if (
        newBenefit === 'yes' &&
        nationalCallToService === 'no' &&
        vetTecBenefit === 'yes'
      ) {
        this.setEduBenefitFormSelected('0994');
        this.setWizardCompletionStatus('complete');
      } else if (
        newBenefit === 'no' &&
        (transferredEduBenefits === 'transferred' ||
          transferredEduBenefits === 'own')
      ) {
        this.setEduBenefitFormSelected('1995');
        this.setWizardCompletionStatus('complete');
      } else if (newBenefit === 'no' && transferredEduBenefits === 'fry') {
        this.setEduBenefitFormSelected('5495');
        this.setWizardCompletionStatus('complete');
      } else if (
        newBenefit === 'yes' &&
        serviceBenefitBasedOn === 'other' &&
        sponsorDeceasedDisabledMIA === 'yes'
      ) {
        this.setEduBenefitFormSelected('5490');
        this.setWizardCompletionStatus('complete');
      } else if (
        newBenefit === 'yes' &&
        serviceBenefitBasedOn === 'other' &&
        sponsorDeceasedDisabledMIA === 'no' &&
        sponsorTransferredBenefits !== null
      ) {
        this.setEduBenefitFormSelected('1990E');
        this.setWizardCompletionStatus('complete');
      } else if (newBenefit === 'yes' && nationalCallToService === 'yes') {
        this.setEduBenefitFormSelected('1990N');
        this.setWizardCompletionStatus('complete');
      } else if (applyForScholarship === 'yes') {
        this.setEduBenefitFormSelected(form1995);
        this.setWizardCompletionStatus('complete');
      } else if (applyForScholarship === 'no' && newBenefit === 'extend') {
        this.setEduBenefitFormSelected('none selected');
        this.setWizardCompletionStatus('complete');
      } else {
        this.setWizardCompletionStatus('not complete');
        this.setEduBenefitFormSelected('none selected');
      }
    }
  }

  getButton(formId) {
    const url =
      formId === '0994'
        ? `/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994`
        : `/education/apply-for-education-benefits/application/${formId}`;

    return (
      <a
        id="apply-now-link"
        href={url}
        className="usa-button va-button-primary"
        onClick={() => {
          this.recordWizardValues();
        }}
      >
        Apply now
      </a>
    );
  }

  answerQuestion = (field, answer) => {
    const newState = Object.assign(
      {},
      { [field]: answer, wizardCompletionStatus: 'pending' },
    );
    if (field === 'newBenefit') {
      recordEvent({
        event: 'edu-howToApply-formChange',
        'edu-form-field': 'benefitUpdate',
        'edu-form-value': this.eduFormChange(answer),
      });
    }

    // drop all the levels until we see the current question, then reset
    // everything at that level and beyond, so we don't see questions from
    // different branches
    const fields = [].concat(
      ..._.dropWhile(level => !level.includes(field), levels),
    );
    fields.forEach(laterField => {
      if (laterField !== field) {
        newState[laterField] = null;
      }
    });

    this.setState(newState);
  };

  eduFormChange = input => {
    const formChangeMap = {
      yes: 'new',
      no: 'update',
      extend: 'stem-scholarship',
    };
    return formChangeMap[input] || null;
  };

  isReceivingSponsorBenefits = input => {
    const formChangeMap = {
      own: 'no',
      transferred: 'yes',
      fry: 'no with scholarship',
    };
    return formChangeMap[input] || null;
  };

  isBenefitClaimForSelf = input => {
    const formChangeMap = {
      own: 'yes',
      other: 'no',
    };
    return formChangeMap[input] || null;
  };

  recordWizardValues = () => {
    recordEvent({
      event: 'edu-howToApply-applyNow',
      'edu-benefitUpdate': this.eduFormChange(this.state.newBenefit),
      'edu-isBenefitClaimForSelf': this.isBenefitClaimForSelf(
        this.state.serviceBenefitBasedOn,
      ),
      'edu-isNationalCallToServiceBenefit': this.state.nationalCallToService,
      'edu-isVetTec': this.state.vetTecBenefit,
      'edu-hasSponsorTransferredBenefits': this.state
        .sponsorTransferredBenefits,
      'edu-isReceivingSponsorBenefits': this.isReceivingSponsorBenefits(
        this.state.transferredEduBenefits,
      ),
      'edu-isSponsorReachable': this.state.sponsorDeceasedDisabledMIA,
      'edu-stemApplicant': this.state.applyForScholarship,
    });
  };
  /**
   *
   * @param {string} value a string value to determine whether the wizard is in a complete status
   */

  setWizardCompletionStatus = value => {
    sessionStorage.setItem('EduWizardStatus', value);
    this.setState({
      wizardCompletionStatus: sessionStorage.getItem('EduWizardStatus'),
    });
  };

  /**
   *
   * @param {string} formId a string value of the form id of the selected education benefit
   */

  setEduBenefitFormSelected = formId => {
    sessionStorage.setItem('educationBenefitSelected', formId);
    this.setState({
      educationBenefitSelected: sessionStorage.getItem(
        'educationBenefitSelected',
      ),
    });
  };

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply to use transferred education benefits" />
        <p>
          Equal to VA Form 22-1990E (Application for Family Member to Use
          Transferred Benefits).
        </p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
        />
        <h4>Follow the steps below to apply for education benefits.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>To fill out this application, you’ll need your:</h6>
              </div>
              <ul>
                <li>Social Security number (required)</li>
                <li>Sponsor’s Social Security number (required)</li>
                <li>
                  Basic information about the school or training facility you
                  want to attend
                </li>
                <li>Bank account direct deposit information</li>
                <li>Education history</li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative with a Veterans Service
                Organization (VSO) can help you fill out your claim.{' '}
                <a href="/disability-benefits/apply/help/index.html">
                  Find an accredited representative
                </a>
                .
              </p>
              <h6>Learn about educational programs</h6>
              <p>
                See what benefits you’ll get at the school you want to attend.{' '}
                <a href="/gi-bill-comparison-tool/">
                  Use the GI Bill Comparison Tool
                </a>
                .
              </p>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Apply</h5>
              </div>
              <p>Complete this education benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA review</h5>
              </div>
              <p>
                We usually process claims within 30 days. We’ll let you know by
                mail if we need more information.
              </p>
              <p>
                We offer tools and counseling programs to help you make the most
                of your educational options.{' '}
                <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
                  Learn about career counseling options
                </a>
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>Decision</h5>
              </div>
              <p>
                You’ll get a Certificate of Eligibility (COE), or award letter,
                in the mail if we've approved your application.
              </p>
              <p>
                If your application wasn’t approved, you’ll get a denial letter
                in the mail.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="12/31/2019" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
