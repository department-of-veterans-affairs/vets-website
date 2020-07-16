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
    const {
      newBenefit,
      serviceBenefitBasedOn,
      nationalCallToService,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits,
      vetTecBenefit,
      applyForScholarship,
      open,
      wizardCompletionStatus,
      educationBenefitSelected,
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
      <div className="schemaform-intro">
        {educationBenefitSelected !== '1990' && (
          <div className="wizard-container">
            <h3>Are you in the right place?</h3>
            <p>
              We'd like to ask you a few questions to confirm that this is the
              correct application for your claim.
            </p>
            <button
              aria-expanded={this.state.open ? 'true' : 'false'}
              aria-controls="wizardOptions"
              className={buttonClasses}
              onClick={() => this.setState({ open: !this.state.open })}
            >
              Find your education benefit form
            </button>
            {open && (
              <div className={contentClasses} id="wizardOptions">
                <div className="wizard-content-inner">
                  <ErrorableRadioButtons
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
                    <ErrorableRadioButtons
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
                    <ErrorableRadioButtons
                      additionalFieldsetClass="wizard-fieldset"
                      name="transferredEduBenefits"
                      id="transferredEduBenefits"
                      options={[
                        {
                          label: 'No, I’m using my own benefit.',
                          value: 'own',
                        },
                        {
                          label: 'Yes, I’m using a transferred benefit.',
                          value: 'transferred',
                        },
                        {
                          label: (
                            <span className="radioText">
                              No, I’m using the Fry Scholarship or DEA (Chapter
                              35)
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
                    <ErrorableRadioButtons
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
                          Are you claiming a{' '}
                          <strong>National Call to Service</strong> education
                          benefit? (This is uncommon)
                        </span>
                      }
                    />
                  )}
                  {serviceBenefitBasedOn === 'own' &&
                    nationalCallToService === 'no' && (
                      <ErrorableRadioButtons
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
                            Are you applying for Veteran Employment Through
                            Technology Education Courses (VET TEC)?
                          </span>
                        }
                      />
                    )}
                  {serviceBenefitBasedOn === 'other' && (
                    <ErrorableRadioButtons
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
                    <ErrorableRadioButtons
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
                            Your application can't be approved until your
                            sponsor transfers their benefits.
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
                              Are all of the following things true of your
                              service?
                            </p>
                            <ul>
                              <li>
                                Enlisted under the National Call to Service
                                program, <strong>and</strong>
                              </li>
                              <li>
                                Entered service between 10/01/03 and 12/31/07,{' '}
                                <strong>and</strong>
                              </li>
                              <li>Chose education benefits</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  {newBenefit === 'extend' && (
                    <div className="wizard-edith-nourse-content">
                      <br />
                      <strong>
                        To be eligible for the{' '}
                        <a
                          href="https://benefits.va.gov/gibill/fgib/stem.asp"
                          onClick={() =>
                            recordEvent({
                              event: 'edu-navigation',
                              'edu-action': 'stem-scholarship',
                            })
                          }
                        >
                          Edith Nourse Rogers STEM Scholarship
                        </a>
                        , you must meet all the requirements below. You:
                      </strong>
                      <ul className="wizard-edith-nourse-content">
                        <li>
                          Are using or recently used Post-9/11 GI Bill or Fry
                          Scholarship benefits
                        </li>
                        <li>
                          Have used all your education benefits or are within 6
                          months of doing so.{' '}
                          <a
                            className="checkBenefitsLink"
                            href="../gi-bill/post-9-11/ch-33-benefit/"
                            onClick={() =>
                              recordEvent({
                                event: 'edu-navigation',
                                'edu-action': 'check-remaining-benefits',
                              })
                            }
                          >
                            Check remaining benefits
                          </a>
                        </li>
                        <li>
                          Are enrolled in an undergraduate degree program for
                          science, technology, engineering or math (STEM),{' '}
                          <strong>or</strong> have already earned a STEM degree
                          and are pursuing a teaching certification.{' '}
                          <a
                            href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf"
                            onClick={() =>
                              recordEvent({
                                event: 'edu-navigation',
                                'edu-action': 'see-approved-stem-programs',
                              })
                            }
                          >
                            See approved STEM programs
                          </a>
                        </li>
                      </ul>

                      <ErrorableRadioButtons
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
                        {applyForScholarship === 'no' && (
                          <p>
                            Learn what other education benefits you may be
                            eligible for on the{' '}
                            <a href="../eligibility/">
                              GI Bill eligibility page
                            </a>
                            .
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {educationBenefitSelected !== 'none selected' &&
                    this.getButton(educationBenefitSelected)}
                </div>
              </div>
            )}
          </div>
        )}
        {educationBenefitSelected === '1990' &&
          wizardCompletionStatus === 'complete' && (
            <>
              <FormTitle title="Apply for education benefits" />
              <p>
                Equal to VA Form 22-1990 (Application for VA Education
                Benefits).
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
                      <li>Military history (required)</li>
                      <li>
                        Basic information about the school or training facility
                        you want to attend (required)
                      </li>
                      <li>Bank account direct deposit information</li>
                      <li>Education history</li>
                    </ul>
                    <p>
                      <strong>
                        What if I need help filling out my application?
                      </strong>{' '}
                      An accredited representative, like a Veterans Service
                      Officer (VSO), can help you fill out your claim.{' '}
                      <a href="/disability/get-help-filing-claim/">
                        Find an accredited representative
                      </a>
                      .
                    </p>
                    <h6>Learn about educational programs</h6>
                    <p>
                      See what benefits you’ll get at the school you want to
                      attend.{' '}
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
                      After submitting the form, you’ll get a confirmation
                      message. You can print this for your records.
                    </p>
                  </li>
                  <li className="process-step list-three">
                    <div>
                      <h5>VA review</h5>
                    </div>
                    <p>
                      We usually process claims within 30 days. We’ll let you
                      know by mail if we need more information.
                    </p>
                    <p>
                      We offer tools and counseling programs to help you make
                      the most of your educational options.{' '}
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
                      You’ll get a Certificate of Eligibility (COE), or award
                      letter, in the mail if we've approved your application.
                    </p>
                    <p>
                      If your application wasn’t approved, you’ll get a denial
                      letter in the mail.
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
              <div
                className="omb-info--container"
                style={{ paddingLeft: '0px' }}
              >
                <OMBInfo
                  resBurden={15}
                  ombNumber="2900-0154"
                  expDate="12/31/2019"
                />
              </div>
            </>
          )}
      </div>
    );
  }
}

export default IntroductionPage;
