import React from 'react';
import _ from 'lodash';
import lodashDeep from 'lodash-deep';
import { hashHistory } from 'react-router';

import ContinueButton from './ContinueButton';
import IntroductionSection from './IntroductionSection.jsx';
import Nav from './Nav.jsx';

import * as validationFunctions from '../utils/validations';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

class HealthCareApp extends React.Component {
  constructor() {
    super();
    this.publishStateChange = this.publishStateChange.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getNextUrl = this.getNextUrl.bind(this);
    this.resetNullValues = this.resetNullValues.bind(this);

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
            }
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
            spouseFirstName: null,
            spouseMiddleName: null,
            spouseLastName: null,
            spouseSuffix: null,
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
            childrenGrossIncome: null,
            childrenNetIncome: null,
            childrenOtherIncome: null
          },

          'deductible-expenses': {
            deductibleMedicalExpenses: null,
            deductibleFuneralExpenses: null,
            deductibleEducationExpenses: null
          },
        },

        'insurance-information': {
          'general': {
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

  getNextUrl() {
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
        nextPath = panels[i + 1];
        break;
      }
    }

    return nextPath;
  }

  publishStateChange(propertyPath, update) {
    const newApplicationData = Object.assign({}, this.state.applicationData);
    _.set(newApplicationData, propertyPath, update);

    this.setState({ applicationData: newApplicationData });
  }

  resetNullValues(objectData) {
    const context = this;
    _.forIn(objectData, (value, key) => {
      if (value === null) {
        _.set(objectData, key, '');
      } else if (typeof (value) === 'object') {
        context.resetNullValues(value);
      }
    });

    // _.mapValues(objectData, (value, key) => {
    //     if (value === null) {
    //       return value = '';
    //     } else if (typeof (value) === 'object') {
    //       context.resetNullValues(value);
    //     }
    // });

    return objectData;
  }

  handleContinue() {
    const sectionPath = this.props.location.pathname.split('/').filter((path) => { return !!path; });
    const sectionData = _.get(this.state.applicationData, sectionPath);

    this.resetNullValues(sectionData);

    this.setState({}, () => {
      if (validationFunctions.isValidSection(this.props.location.pathname, sectionData)) {
        hashHistory.push(this.getNextUrl());
      } else {
        document.getElementsByClassName('usa-input-error')[0].scrollIntoView();
      }
    });
  }

  render() {
    let children = this.props.children;

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
          }
        });
      });
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
              <ContinueButton onButtonClick={this.handleContinue}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HealthCareApp;
