import React from 'react';
import _ from 'lodash';
import lodashDeep from 'lodash-deep';
import { hashHistory } from 'react-router';

import ContinueButton from './ContinueButton';
import IntroductionSection from './IntroductionSection.jsx';
import Nav from './Nav.jsx';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

class HealthCareApp extends React.Component {
  constructor() {
    super();
    this.publishStateChange = this.publishStateChange.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getNextUrl = this.getNextUrl.bind(this);

    this.state = {
      applicationData: {
        introduction: {},

        'personal-information': {
          'name-and-general-information': {
            fullName: {
              first: 'William',
              middle: '',
              last: 'Shakespeare',
              suffix: '',
            },

            mothersMaidenName: 'Arden',

            socialSecurityNumber: '999-99-9999',

            dateOfBirth: {
              month: 1,
              day: 15,
              year: 1997,
            }
          },

          'va-information': {
            isVaServiceConnected: false,
            compensableVaServiceConnected: false,
            receivesVaPension: false
          },

          'additional-information': {
            isEssentialAcaCoverage: false,
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
            email: 'test@test.com',
            emailConfirmation: 'test@test.com',
            homePhone: '555-555-5555',
            mobilePhone: '111-111-1111'
          }
        },

        'financial-assessment': {
          'financial-disclosure': {
            provideFinancialInfo: false,
            understandsFinancialDisclosure: false
          },
          'spouse-information': {
            spouseFirstName: undefined,
            spouseMiddleName: undefined,
            spouseLastName: undefined,
            spouseSuffix: undefined,
            spouseSocialSecurityNumber: '',
            spouseDateOfBirth: {
              month: 4,
              day: 23,
              year: 1989,
            },
            dateOfMarriage: {
              month: 3,
              day: 8,
              year: 2016
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
            spousePhone: '222-222-2222'
          },

          'child-information': {
            hasChildrenToReport: false,
            childFullName: {
              first: '',
              middle: '',
              last: '',
              suffix: ''
            },
            childRelation: '',
            childSocialSecurityNumber: '',
            childBecameDependent: {
              month: 11,
              day: 4,
              year: 2000
            },
            childDateOfBirth: {
              month: 11,
              day: 4,
              year: 2000
            },
            childDisabledBefore18: false,
            childAttendedSchoolLastYear: false,
            childEducationExpenses: '',
            childCohabitedLastYear: false,
            childReceivedSupportLastYear: false
          },

          'annual-income': {
            veteranGrossIncome: '',
            veteranNetIncome: '',
            veteranOtherIncome: '',
            spouseGrossIncome: '',
            spouseNetIncome: '',
            spouseOtherIncome: '',
            childrenGrossIncome: '',
            childrenNetIncome: '',
            childrenOtherIncome: ''
          },

          'deductible-expenses': {
            deductibleMedicalExpenses: '',
            deductibleFuneralExpenses: '',
            deductibleEducationExpenses: ''
          },
        },

        // TODO: insuranceInformation should be an array where each row
        //       contains all the following fields:
        'insurance-information': {
          general: {
            isCoveredByHealthInsurance: false,
            insuranceName: '',
            insuranceAddress: '',
            insuranceCity: '',
            insuranceCountry: '',
            insuranceState: '',
            insuranceZipcode: '',
            insurancePhone: '404-123-1234',
            insurancePolicyHolderName: '',
            insurancePolicyNumber: '',
            insuranceGroupCode: '',
          },

          'medicare-medicaid': {
            isMedicaidEligible: false,
            isEnrolledMedicarePartA: false,
            medicarePartAEffectiveDate: {
              month: 10,
              day: 25,
              year: 2001
            }
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

  handleContinue() {
    hashHistory.push(this.getNextUrl());
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
        <div className="small-4 columns">
          <Nav currentUrl={this.props.location.pathname}/>
        </div>
        <div className="small-8 columns">
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
