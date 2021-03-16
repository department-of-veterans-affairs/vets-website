import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

const levels = [
  ['newBenefit'],
  ['serviceBenefitBasedOn', 'transferredEduBenefits'],
  ['nationalCallToService', 'sponsorDeceasedDisabledMIA'],
  ['vetTecBenefit'],
  ['sponsorTransferredBenefits'],
  ['applyForScholarship'],
];

export default class EducationWizard extends React.Component {
  constructor(props) {
    super(props);

    // flattens all the fields in levels into object keys
    this.state = []
      .concat(...levels)
      .reduce((state, field) => Object.assign(state, { [field]: null }), {
        open: false,
      });
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
      default:
        url = `/education/apply-for-education-benefits/application/${form}`;
        break;
    }

    return (
      <a
        id="apply-now-link"
        href={url}
        className="usa-button va-button-primary"
        onClick={() => this.recordWizardValues()}
      >
        Apply now
      </a>
    );
  }

  answerQuestion = (field, answer) => {
    const newState = Object.assign({}, { [field]: answer });

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
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
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

  render() {
    const {
      newBenefit,
      serviceBenefitBasedOn,
      nationalCallToService,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits,
      vetTecBenefit,
      applyForScholarship,
    } = this.state;
    const buttonClasses = classNames('usa-button-primary', 'wizard-button', {
      'va-button-primary': !this.state.open,
    });
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
        label: (
          <span className="radioText">
            Updating my program of study or place of training
          </span>
        ),
        value: 'no',
      },
      {
        label: (
          <span className="radioText">
            Applying to extend my Post-9/11 or Fry Scholarship benefits using
            the Edith Nourse Rogers STEM Scholarship
          </span>
        ),
        value: 'extend',
      },
    ];

    return (
      <div className="wizard-container">
        <button
          aria-expanded={this.state.open ? 'true' : 'false'}
          aria-controls="wizardOptions"
          className={buttonClasses}
          onClick={() => this.setState({ open: !this.state.open })}
        >
          Find your education benefits form
        </button>
        <div className={contentClasses} id="wizardOptions">
          <div className="wizard-content-inner">
            <RadioButtons
              additionalFieldsetClass="wizard-fieldset"
              name="newBenefit"
              id="newBenefit"
              options={newBenefitOptions}
              onValueChange={({ value }) =>
                this.answerQuestion('newBenefit', value)
              }
              value={{ value: newBenefit }}
              label="Are you applying for a benefit or updating your program or place of training?"
            />
            {newBenefit === 'yes' && (
              <RadioButtons
                additionalFieldsetClass="wizard-fieldset"
                name="serviceBenefitBasedOn"
                id="serviceBenefitBasedOn"
                options={[
                  { label: 'Yes', value: 'own' },
                  { label: 'No', value: 'other' },
                ]}
                onValueChange={({ value }) =>
                  this.answerQuestion('serviceBenefitBasedOn', value)
                }
                value={{ value: serviceBenefitBasedOn }}
                label="Are you a Veteran or service member claiming a benefit based on your own service?"
              />
            )}
            {newBenefit === 'no' && (
              <RadioButtons
                additionalFieldsetClass="wizard-fieldset"
                name="transferredEduBenefits"
                id="transferredEduBenefits"
                options={[
                  { label: 'No, I’m using my own benefit.', value: 'own' },
                  {
                    label: 'Yes, I’m using a transferred benefit.',
                    value: 'transferred',
                  },
                  {
                    label: (
                      <span className="radioText">
                        No, I’m using the Fry Scholarship or DEA (Chapter 35)
                      </span>
                    ),
                    value: 'fry',
                  },
                ]}
                onValueChange={({ value }) =>
                  this.answerQuestion('transferredEduBenefits', value)
                }
                value={{ value: transferredEduBenefits }}
                label="Are you receiving education benefits transferred to you by a sponsor Veteran?"
              />
            )}
            {serviceBenefitBasedOn === 'own' && (
              <RadioButtons
                additionalFieldsetClass="wizard-fieldset"
                name="nationalCallToService"
                id="nationalCallToService"
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
                onValueChange={({ value }) =>
                  this.answerQuestion('nationalCallToService', value)
                }
                value={{ value: nationalCallToService }}
                label={
                  <span>
                    Are you claiming a <strong>National Call to Service</strong>{' '}
                    education benefit? (This is uncommon)
                  </span>
                }
              />
            )}
            {serviceBenefitBasedOn === 'own' &&
              nationalCallToService === 'no' && (
                <RadioButtons
                  additionalFieldsetClass="wizard-fieldset"
                  name="vetTecBenefit"
                  id="vetTecBenefit"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  onValueChange={({ value }) =>
                    this.answerQuestion('vetTecBenefit', value)
                  }
                  value={{ value: vetTecBenefit }}
                  label={
                    <span>
                      Are you applying for Veteran Employment Through Technology
                      Education Courses (VET TEC)?
                    </span>
                  }
                />
              )}
            {serviceBenefitBasedOn === 'other' && (
              <RadioButtons
                additionalFieldsetClass="wizard-fieldset"
                name="sponsorDeceasedDisabledMIA"
                id="sponsorDeceasedDisabledMIA"
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
                onValueChange={({ value }) =>
                  this.answerQuestion('sponsorDeceasedDisabledMIA', value)
                }
                value={{ value: sponsorDeceasedDisabledMIA }}
                label="Is your sponsor deceased, 100% permanently disabled, MIA, or a POW?"
              />
            )}
            {sponsorDeceasedDisabledMIA === 'no' && (
              <RadioButtons
                name="sponsorTransferredBenefits"
                id="sponsorTransferredBenefits"
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
                onValueChange={({ value }) =>
                  this.answerQuestion('sponsorTransferredBenefits', value)
                }
                value={{ value: sponsorTransferredBenefits }}
                label="Has your sponsor transferred their benefits to you?"
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
              nationalCallToService === 'yes' && (
                <div>
                  <div className="usa-alert usa-alert-warning">
                    <div className="usa-alert-body">
                      <h4 className="usa-alert-heading wizard-alert-heading">
                        Are you sure?
                      </h4>
                      <p>
                        Are all of the following things true of your service?
                      </p>
                      <ul>
                        <li>
                          Enlisted under the National Call to Service program,{' '}
                          <strong>and</strong>
                        </li>
                        <li>
                          Entered service between 10/01/03 and 12/31/07,{' '}
                          <strong>and</strong>
                        </li>
                        <li>Chose education benefits</li>
                      </ul>
                    </div>
                  </div>
                  {this.getButton('1990N')}
                </div>
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
                    <li className="ul-styling">
                      <b>Education benefit:</b> You're using or recently used
                      Post-9/11 GI Bill or Fry Scholarship benefits.
                    </li>
                    <li>
                      <b>STEM degree:</b>
                      <ul className="circle-bullet ul-styling vads-u-margin-bottom--neg1">
                        <li className="li-styling">
                          You're enrolled in a bachelor’s degree program for
                          science, technology, engineering, or math (STEM),{' '}
                          <b>or</b>
                        </li>{' '}
                        <li>
                          {' '}
                          You've already earned a STEM bachelor’s degree and are
                          pursuing a teaching certification.{' '}
                          <a
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
                            See eligible degree programs
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="ul-styling">
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

                <RadioButtons
                  additionalFieldsetClass="wizard-fieldset"
                  name="applyForScholarship"
                  id="applyForScholarship"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  onValueChange={({ value }) =>
                    this.answerQuestion('applyForScholarship', value)
                  }
                  value={{ value: applyForScholarship }}
                  label="Based on the eligibility requirements above, do you want to apply for this scholarship?"
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
              nationalCallToService === 'no' &&
              vetTecBenefit === 'no' &&
              this.getButton('1990')}
            {newBenefit === 'yes' &&
              nationalCallToService === 'no' &&
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
              sponsorDeceasedDisabledMIA === 'yes' &&
              this.getButton('5490')}
            {newBenefit === 'yes' &&
              serviceBenefitBasedOn === 'other' &&
              sponsorDeceasedDisabledMIA === 'no' &&
              sponsorTransferredBenefits !== null &&
              this.getButton('1990E')}
          </div>
        </div>
      </div>
    );
  }
}
