import React from 'react';
import _ from 'lodash';
import lodashDeep from 'lodash-deep';
import { hashHistory } from 'react-router';

import ProgressButton from './ProgressButton';

import IntroductionSection from './IntroductionSection.jsx';
import Nav from './Nav.jsx';

import * as validations from '../utils/validations';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

class HealthCareApp extends React.Component {
  constructor() {
    super();
    this.publishStateChange = this.publishStateChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.getExternalData = this.getExternalData.bind(this);
    this.updateChildrenIncome = this.updateChildrenIncome.bind(this);

    this.state = {
      applicationData: {
        introduction: {},

        'personal-information': {
          'name-and-general-information': {
            fullName: {
              first: null,
              middle: null,
              last: null,
              suffix: null,
            },
            mothersMaidenName: null,
            socialSecurityNumber: null,
            dateOfBirth: {
              month: null,
              day: null,
              year: null,
            },
            maritalStatus: null
          },

          'va-information': {
            isVaServiceConnected: false,
            compensableVaServiceConnected: false,
            receivesVaPension: false
          },

          'additional-information': {
            isEssentialAcaCoverage: false,
            facilityState: '',
            vaMedicalFacility: '',
            wantsInitialVaContact: false
          },

          'demographic-information': {
            isSpanishHispanicLatino: false,
            isAmericanIndianOrAlaskanNative: false,
            isBlackOrAfricanAmerican: false,
            isNativeHawaiianOrOtherPacificIslander: false,
            isAsian: false,
            isWhite: false
          },

          'veteran-address': {
            address: {
              street: null,
              city: null,
              country: null,
              state: null,
              zipcode: null,
            },
            county: null,
            email: null,
            emailConfirmation: null,
            homePhone: null,
            mobilePhone: null
          }
        },

        'financial-assessment': {
          'financial-disclosure': {
            provideFinancialInfo: false,
            understandsFinancialDisclosure: false
          },
          'spouse-information': {
            spouseFullName: {
              first: null,
              middle: null,
              last: null,
              suffix: null,
            },
            spouseSocialSecurityNumber: null,
            spouseDateOfBirth: {
              month: null,
              day: null,
              year: null,
            },
            dateOfMarriage: {
              month: null,
              day: null,
              year: null
            },
            sameAddress: false,
            cohabitedLastYear: false,
            provideSupportLastYear: false,
            spouseAddress: {
              street: null,
              city: null,
              country: null,
              state: null,
              zipcode: null,
            },
            spousePhone: null
          },

          'child-information': {
            hasChildrenToReport: false,
            children: []
          },

          'annual-income': {
            veteranGrossIncome: null,
            veteranNetIncome: null,
            veteranOtherIncome: null,
            spouseGrossIncome: null,
            spouseNetIncome: null,
            spouseOtherIncome: null,
            children: []
          },

          'deductible-expenses': {
            deductibleMedicalExpenses: null,
            deductibleFuneralExpenses: null,
            deductibleEducationExpenses: null
          },
        },

        'insurance-information': {
          general: {
            isCoveredByHealthInsurance: false,
            providers: []
          },

          'medicare-medicaid': {
            isMedicaidEligible: false,
            isEnrolledMedicarePartA: false,
            medicarePartAEffectiveDate: {
              month: null,
              day: null,
              year: null
            }
          }
        },
        'military-service': {
          'service-information': {
            lastServiceBranch: null,
            lastEntryDate: {
              month: null,
              day: null,
              year: null
            },
            lastDischargeDate: {
              month: null,
              day: null,
              year: null
            },
            dischargeType: null
          },
          'additional-information': {
            purpleHeartRecipient: false,
            isFormerPow: false,
            postNov111998Combat: false,
            disabledInLineOfDuty: false,
            swAsiaCombat: false,
            vietnamService: false,
            exposedToRadiation: false,
            radiumTreatments: false,
            campLejeune: false
          }
        }
      }
    };
  }

  getUrl(direction) {
    const routes = this.props.route.childRoutes;
    const panels = [];
    let currentPath = this.props.location.pathname;
    let nextPath = '';

    // TODO(awong): remove the '/' alias for '/introduction' using history.replaceState()
    if (currentPath === '/') {
      currentPath = '/introduction';
    }

    panels.push.apply(panels, routes.map((obj) => { return obj.path; }));

    for (let i = 0; i < panels.length; i++) {
      if (currentPath === panels[i]) {
        if (direction === 'back') {
          nextPath = panels[i - 1];
        } else {
          nextPath = panels[i + 1];
        }
        break;
      }
    }

    return nextPath;
  }

  getExternalData(applicationData, statePath) {
    switch (statePath[0]) {
      case 'financial-assessment':
        if (statePath[1] === 'annual-income') {
          this.updateChildrenIncome();
        }
        return {
          receivesVaPension: this.state.applicationData['personal-information']['va-information'].receivesVaPension,
          neverMarried: this.state.applicationData['personal-information']['name-and-general-information'].maritalStatus === '' || this.state.applicationData['personal-information']['name-and-general-information'].maritalStatus === 'Never Married'
        };
      default:
        return undefined;
    }
  }

  // Make sure the number of children reported have corresponding rows in the annual-income section.
  updateChildrenIncome() {
    const childInformation = this.state.applicationData['financial-assessment']['child-information'];
    const childIncome = this.state.applicationData['financial-assessment']['annual-income'];
    if (childInformation.children.length > 0) {
      for (let i = 0; i < childInformation.children.length; i++) {
        const shortName = `${childInformation.children[i].childFullName.first} ${childInformation.children[i].childFullName.last}`;
        if (childIncome.children[i] === undefined) {
          childIncome.children[i] = {
            childShortName: shortName,
            childGrossIncome: null,
            childNetIncome: null,
            childOtherIncome: null
          };
        } else {
          childIncome.children[i].childShortName = shortName;
        }
      }
    }
  }

  publishStateChange(propertyPath, update) {
    const newApplicationData = Object.assign({}, this.state.applicationData);
    _.set(newApplicationData, propertyPath, update);

    this.setState({ applicationData: newApplicationData });
  }

  handleContinue() {
    const sectionPath = this.props.location.pathname.split('/').filter((path) => { return !!path; });
    const sectionData = validations.initializeNullValues(_.get(this.state.applicationData, sectionPath));
    this.publishStateChange(sectionPath, sectionData);

    this.setState({}, () => {
      if (validations.isValidSection(this.props.location.pathname, sectionData)) {
        hashHistory.push(this.getUrl('next'));
        if (document.getElementsByClassName('progress-box').length > 0) {
          document.getElementsByClassName('progress-box')[0].scrollIntoView();
        }
      } else {
        // TODO: improve this
        if (document.getElementsByClassName('usa-input-error').length > 0) {
          document.getElementsByClassName('usa-input-error')[0].scrollIntoView();
        }
      }
    });
  }

  handleBack() {
    hashHistory.push(this.getUrl('back'));
    if (document.getElementsByClassName('progress-box').length > 0) {
      document.getElementsByClassName('progress-box')[0].scrollIntoView();
    }
  }

  handleSubmit() {
    // Add functionality
  }

  render() {
    let children = this.props.children;
    let buttons;

    if (children === null) {
      // This occurs if the root route is hit. Default to IntroductionSection.
      children = (<IntroductionSection
          applicationData={this.state.applicationData}
          publishStateChange={this.publishStateChange}/>);
    } else {
      const statePath = this.props.location.pathname.split('/').filter((path) => { return !!path; });
      children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          data: _.get(this.state.applicationData, statePath),
          onStateChange: (subfield, update) => {
            this.publishStateChange(statePath.concat(subfield), update);
          },
          external: this.getExternalData(this.state.applicationData, statePath)
        });
      });
    }

    // Check which section the user is on and render the correct ProgressButtons.
    const lastSectionText = (this.getUrl('back')) ? this.getUrl('back').split('/').slice(-1)[0].replace(/-/g, ' ') : '';
    const nextSectionText = (this.getUrl('next')) ? this.getUrl('next').split('/').slice(-1)[0].replace(/-/g, ' ') : '';

    const backButton = (
      <ProgressButton
          onButtonClick={this.handleBack}
          buttonText={`Back to ${lastSectionText}`}
          buttonClass={'usa-button-outline'}
          beforeText={'«'}/>
    );

    const nextButton = (
      <ProgressButton
          onButtonClick={this.handleContinue}
          buttonText={`Continue to ${nextSectionText}`}
          buttonClass={'usa-button-primary'}
          afterText={'»'}/>
    );

    const submitButton = (
      <ProgressButton
          onButtonClick={this.handleSubmit}
          buttonText={'Submit'}
          buttonClass={'usa-button-primary'}/>
    );

    if (this.props.location.pathname === '/review-and-submit') {
      buttons = (
        <div>
          {submitButton}
          {backButton}
        </div>
      );
    } else if (this.props.location.pathname === '/introduction') {
      buttons = (
        <div>
          {nextButton}
        </div>
      );
    } else {
      buttons = (
        <div>
          {nextButton}
          {backButton}
        </div>
      );
    }

    return (
      <div className="row">
        <div className="medium-4 columns show-for-medium-up">
          <Nav currentUrl={this.props.location.pathname}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
            <div className="form-panel">
              {children}
              {buttons}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HealthCareApp;
