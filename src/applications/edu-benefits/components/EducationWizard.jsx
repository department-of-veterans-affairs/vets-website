// disabled for unit testing to work
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import React from 'react';
import dropWhile from 'lodash/dropWhile';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';
import { connect } from 'react-redux';
import VARadioButton from '../utils/VaRadioButton';
import { showMebDgi40Feature } from '../selectors/educationWizard';

const levels = [
  ['newBenefit'],
  ['serviceBenefitBasedOn', 'transferredEduBenefits'],
  ['sponsorTransferredBenefits'],
  ['sponsorDeceasedDisabledMIA'],
  ['vetTecBenefit'],
  ['applyForScholarship'],
];

class EducationWizard extends React.Component {
  constructor(props) {
    super(props);

    // props passed for unit testing
    const { test, testLevels } = this.props;
    if (test) {
      let mockSate = {};
      for (const key in testLevels) {
        mockSate = { ...mockSate, [key]: testLevels[key] };
      }
      this.state = mockSate;
    }
    if (!test) {
      // flattens all the fields in levels into object keys
      this.state =
        this.props.levels ||
        []
          .concat(...levels)
          .reduce((state, field) => Object.assign(state, { [field]: null }), {
            open: false,
          });
    }
  }

  getButton(form) {
    let url = '';
    switch (form) {
      case '0994':
        url = `/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994`;
        break;
      case '10203':
        url = `/education/other-va-education-benefits/stem-scholarship/apply-for-scholarship-form-22-10203`;
        break;
      case '22-1990':
        url = `/education/apply-for-benefits-form-22-1990`;
        break;
      case '1990E':
        if (this?.props.showMebDgi40Feature) {
          url = `/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e`;
          break;
        }
        url = `/education/apply-for-education-benefits/application/${form}`;
        break;
      default:
        url = `/education/apply-for-education-benefits/application/${form}`;
        break;
    }

    return (
      <a
        id="apply-now-link"
        className="vads-c-action-link--green"
        href={url}
        onClick={() => this.recordWizardValues()}
      >
        Apply now
      </a>
    );
  }

  answerQuestion = (field, answer) => {
    const newState = { [field]: answer };
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
      ...dropWhile(levels, level => !level.includes(field)),
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
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    recordEvent({
      event: 'edu-howToApply-applyNow',
      'edu-benefitUpdate': this.eduFormChange(this.state.newBenefit),
      'edu-isBenefitClaimForSelf': this.isBenefitClaimForSelf(
        this.state.serviceBenefitBasedOn,
      ),
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

  render() {
    const {
      newBenefit,
      serviceBenefitBasedOn,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits,
      vetTecBenefit,
      applyForScholarship,
      post911GIBill,
    } = this.state;
    const buttonClasses = classNames('usa-button-primary', 'wizard-button');
    const contentClasses = classNames(
      'form-expanding-group-open',
      'wizard-content',
      {
        'wizard-content-closed': !this.state.open,
      },
    );

    const newBenefitOptions = [
      { label: 'Applying for a new benefit', value: 'yes' },
      {
        label: 'Updating my program of study or place of training',
        value: 'no',
      },
      {
        label: `Applying for the Edith Nourse Rogers STEM Scholarship after using
            Post-9/11 GI Bill or Fry Scholarship benefits`,
        value: 'extend',
      },
    ];

    const serviceBenefitBasedOnOptions = [
      { label: 'Yes', value: 'own' },
      { label: 'No', value: 'other' },
    ];

    const transferredEduBenefitsOptions = [
      { label: 'No, I’m using my own benefit.', value: 'own' },
      {
        label: 'Yes, I’m using a transferred benefit.',
        value: 'transferred',
      },
      {
        label: 'No, I’m using the Fry Scholarship or DEA (Chapter 35)',
        value: 'fry',
      },
    ];

    const sharedOptions = [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ];

    const handlers = {
      onSelection: (event, onChangeLabel) => {
        const { value } = event.detail;
        this.answerQuestion(onChangeLabel, value);
      },
    };

    return (
      <div className="wizard-container">
        <button
          id="findFormButton"
          aria-expanded={this.state.open ? 'true' : 'false'}
          aria-controls="wizardOptions"
          className={buttonClasses}
          onClick={() => this.setState({ open: !this.state.open })}
        >
          Find your education benefits form
        </button>
        <div className={contentClasses} id="wizardOptions">
          <div className="wizard-content-inner">
            <VARadioButton
              radioLabel="Are you applying for a benefit or updating your program or place of training?"
              name="newBenefit"
              initialValue={newBenefit}
              options={newBenefitOptions}
              onVaValueChange={event =>
                handlers.onSelection(event, 'newBenefit')
              }
            />
            {newBenefit === 'yes' && (
              <VARadioButton
                radioLabel="Are you a Veteran or service member claiming a benefit based on your own service?"
                name="serviceBenefitBasedOn"
                initialValue={serviceBenefitBasedOn}
                options={serviceBenefitBasedOnOptions}
                onVaValueChange={event =>
                  handlers.onSelection(event, 'serviceBenefitBasedOn')
                }
              />
            )}
            {newBenefit === 'no' && (
              <VARadioButton
                radioLabel="Are you receiving education benefits transferred to you by a sponsor Veteran?"
                name="transferredEduBenefits"
                initialValue={transferredEduBenefits}
                options={transferredEduBenefitsOptions}
                onVaValueChange={event =>
                  handlers.onSelection(event, 'transferredEduBenefits')
                }
              />
            )}
            {serviceBenefitBasedOn === 'own' && (
              <VARadioButton
                radioLabel={`Are you applying for Veteran Employment Through Technology
                Education Courses (VET TEC)?`}
                name="vetTecBenefit"
                initialValue={vetTecBenefit}
                options={sharedOptions}
                onVaValueChange={event =>
                  handlers.onSelection(event, 'vetTecBenefit')
                }
              />
            )}
            {serviceBenefitBasedOn === 'other' && (
              <VARadioButton
                radioLabel="Has your sponsor transferred their benefits to you?"
                name="sponsorTransferredBenefits"
                initialValue={sponsorTransferredBenefits}
                options={sharedOptions}
                onVaValueChange={event =>
                  handlers.onSelection(event, 'sponsorTransferredBenefits')
                }
              />
            )}
            {sponsorTransferredBenefits === 'no' && (
              <VARadioButton
                radioLabel="Is your sponsor deceased, 100% permanently disabled, MIA, or a POW?"
                name="sponsorDeceasedDisabledMIA"
                initialValue={sponsorDeceasedDisabledMIA}
                options={sharedOptions}
                onVaValueChange={event =>
                  handlers.onSelection(event, 'sponsorDeceasedDisabledMIA')
                }
              />
            )}
            {newBenefit === 'yes' &&
              serviceBenefitBasedOn === 'other' &&
              sponsorDeceasedDisabledMIA === 'no' &&
              sponsorTransferredBenefits === 'no' && (
                <div className="usa-alert usa-alert-warning">
                  <div className="usa-alert-body">
                    <h4>
                      Your application can't be approved until your sponsor
                      transfers their benefits.
                    </h4>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://milconnect.dmdc.osd.mil/milconnect/public/faq/Education_Benefits-How_to_Transfer_Benefits"
                    >
                      Instructions for your sponsor to transfer education
                      benefits.
                    </a>
                  </div>
                </div>
              )}
            {newBenefit === 'yes' &&
              serviceBenefitBasedOn === 'own' &&
              vetTecBenefit === 'no' && (
                <VARadioButton
                  radioLabel="Are you applying for the Post-9/11 GI Bill?"
                  name="post911GIBill"
                  initialValue={post911GIBill}
                  options={sharedOptions}
                  onVaValueChange={event =>
                    handlers.onSelection(event, 'post911GIBill')
                  }
                />
              )}
            {newBenefit === 'extend' && (
              <div className="wizard-edith-nourse-content">
                <br />
                <div>
                  <strong>
                    To be eligible for the{' '}
                    <a
                      href="/education/other-va-education-benefits/stem-scholarship/"
                      rel="noopener noreferrer"
                      onClick={() =>
                        recordEvent({
                          event: 'edu-navigation',
                          'edu-action': 'stem-scholarship',
                        })
                      }
                    >
                      Edith Nourse Rogers STEM Scholarship
                    </a>
                    , you must meet all the requirements below.
                  </strong>
                  <ul>
                    <li className="vads-u-margin-x--neg0p25 vads-u-margin-y--neg0p25">
                      <b>Education benefit:</b> You're using or recently used
                      Post-9/11 GI Bill or Fry Scholarship benefits.
                    </li>
                    <li>
                      <b>STEM degree:</b>
                      <ul className="circle-bullet vads-u-margin-x--neg0p25 vads-u-margin-y--neg0p25 vads-u-margin-bottom--neg1">
                        <li className="li-styling">
                          You're enrolled in a bachelor’s degree program for
                          science, technology, engineering, or math (STEM),{' '}
                          <b>or</b>
                        </li>{' '}
                        <li className="li-styling">
                          You've already earned a STEM bachelor’s degree and are
                          working toward a teaching certification, <b>or</b>
                        </li>{' '}
                        <li className="li-styling">
                          {' '}
                          You've already earned a STEM bachelor's or graduate
                          degree and are pursuing a covered clinical training
                          program for health care professionals. <br />
                          <a
                            aria-label="See eligible degree and clinical training programs, opening in new tab"
                            href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf"
                            rel="noopener noreferrer"
                            target="_blank"
                            onClick={() =>
                              recordEvent({
                                event: 'edu-navigation',
                                'edu-action': 'see-approved-stem-programs',
                              })
                            }
                          >
                            See eligible degree and clinical training programs
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="vads-u-margin-x--neg0p25 vads-u-margin-y--neg0p25">
                      <b>Remaining entitlement:</b> You've used all of your
                      education benefits or are within 6 months of using all
                      your benefits when you submit your application.{' '}
                      <a
                        className="checkBenefitsLink"
                        href="/education/gi-bill/post-9-11/ch-33-benefit/"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={() =>
                          recordEvent({
                            event: 'edu-navigation',
                            'edu-action': 'check-remaining-benefits',
                          })
                        }
                      >
                        Check your remaining benefits
                      </a>
                    </li>
                  </ul>
                </div>

                <VARadioButton
                  radioLabel="Based on the eligibility requirements above, do you want to apply for this scholarship?"
                  name="applyForScholarship"
                  initialValue={applyForScholarship}
                  options={sharedOptions}
                  onVaValueChange={event =>
                    handlers.onSelection(event, 'applyForScholarship')
                  }
                />

                <div className="vads-u-padding-top--2">
                  {(applyForScholarship === 'yes' && this.getButton('10203')) ||
                    (applyForScholarship === 'no' && (
                      <p>
                        Learn what other education benefits you may be eligible
                        for on the{' '}
                        <a href="../eligibility/">GI Bill eligibility page</a>.
                      </p>
                    ))}
                </div>
              </div>
            )}
            {newBenefit === 'yes' &&
              serviceBenefitBasedOn === 'own' &&
              vetTecBenefit === 'no' &&
              post911GIBill === 'yes' &&
              this.getButton('22-1990')}
            {newBenefit === 'yes' &&
              vetTecBenefit === 'no' &&
              post911GIBill === 'no' &&
              this.getButton('1990')}
            {newBenefit === 'yes' &&
              vetTecBenefit === 'yes' &&
              this.getButton('0994')}
            {newBenefit === 'no' &&
              (transferredEduBenefits === 'transferred' ||
                transferredEduBenefits === 'own') &&
              this.getButton('1995')}
            {newBenefit === 'no' &&
              transferredEduBenefits === 'fry' &&
              this.getButton('5495')}
            {newBenefit === 'yes' &&
              serviceBenefitBasedOn === 'other' &&
              sponsorTransferredBenefits === 'yes' &&
              this.getButton('1990E')}
            {newBenefit === 'yes' &&
              serviceBenefitBasedOn === 'other' &&
              sponsorTransferredBenefits === 'no' &&
              sponsorDeceasedDisabledMIA === 'yes' &&
              this.getButton('5490')}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showMebDgi40Feature: showMebDgi40Feature(state),
});

export default connect(mapStateToProps)(EducationWizard);
