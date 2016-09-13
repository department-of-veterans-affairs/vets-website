import React from 'react';
import { connect } from 'react-redux';

import ReviewCollapsiblePanel from '../components/ReviewCollapsiblePanel';

import PersonalInformationReview from '../components/veteran-information/PersonalInformationReview';
import PersonalInformationFields from '../components/veteran-information/PersonalInformationFields';

import ContactInformationReview from '../components/veteran-information/ContactInformationReview';
import ContactInformationFields from '../components/veteran-information/ContactInformationFields';

import SecondaryContactReview from '../components/veteran-information/SecondaryContactReview';
import SecondaryContactFields from '../components/veteran-information/SecondaryContactFields';

import DirectDepositReview from '../components/veteran-information/DirectDepositReview';
import DirectDepositFields from '../components/veteran-information/DirectDepositFields';

import BenefitsSelectionReview from '../components/BenefitsSelectionReview';
import BenefitsSelectionFields from '../components/BenefitsSelectionFields';

import MilitaryServiceReview from '../components/MilitaryServiceReview';
import MilitaryServiceFields from '../components/MilitaryServiceFields';

import BenefitsHistoryReview from '../components/BenefitsHistoryReview';
import BenefitsHistoryFields from '../components/BenefitsHistoryFields';

import DependentInformationReview from '../components/DependentInformationReview';
import DependentInformationFields from '../components/DependentInformationFields';

import EmploymentHistoryReview from '../components/EmploymentHistoryReview';
import EmploymentHistoryFields from '../components/EmploymentHistoryFields';

import SchoolSelectionReview from '../components/SchoolSelectionReview';
import SchoolSelectionFields from '../components/SchoolSelectionFields';

import RotcHistoryReview from '../components/RotcHistoryReview';
import RotcHistoryFields from '../components/RotcHistoryFields';

import { ensureFieldsInitialized, updateIncompleteStatus, updateVerifiedStatus, updateCompletedStatus, veteranUpdateField } from '../actions';

function ReviewPanel({ pageProps, label, path, component: Component, reviewComponent: ReviewComponent }) {
  return (<ReviewCollapsiblePanel
      uiData={pageProps.uiData}
      data={pageProps.data}
      onUpdateEditStatus={pageProps.onUpdateEditStatus}
      onUpdateSaveStatus={pageProps.onUpdateSaveStatus}
      onFieldsInitialized={pageProps.onFieldsInitialized}
      onUpdateVerifiedStatus={pageProps.onUpdateVerifiedStatus}
      pageLabel={label}
      updatePath={path}
      component={<Component
          data={pageProps.data}
          onStateChange={pageProps.onStateChange}
          initializeFields={pageProps.onFieldsInitialized}/>}
      reviewComponent={<ReviewComponent data={pageProps.data}/>}/>);
}

class ReviewPage extends React.Component {
  render() {
    let content;

    if (this.props.uiData.isApplicationSubmitted) {
      content = (
        // TODO(crew): We need to figure out why the css isn't working here.
        <div className="usa-alert usa-alert-success">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">You have submitted your application for education benefits!</h3>
            <p className="usa-alert-text">We are processing your application. You should receive a phone call from the VA in the next week.</p>
            <p className="usa-alert-text">If you do not receive a call from the VA within a week, or you have questions, call 1-877-222-VETS (8387) and press 2.</p>
          </div>
        </div>
      );
    } else {
      content = (<div>
        <p>Please make sure all your information is correct before submitting your application.</p>
        <ReviewPanel
            pageProps={this.props}
            label="Personal Information"
            path="/veteran-information/personal-information"
            component={PersonalInformationFields}
            reviewComponent={PersonalInformationReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Contact Information"
            path="/veteran-information/contact-information"
            component={ContactInformationFields}
            reviewComponent={ContactInformationReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Secondary Contact"
            path="/veteran-information/secondary-contact"
            component={SecondaryContactFields}
            reviewComponent={SecondaryContactReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Direct Deposit"
            path="/veteran-information/direct-deposit"
            component={DirectDepositFields}
            reviewComponent={DirectDepositReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Benefits Selection"
            path="/benefits-eligibility/benefits-selection"
            component={BenefitsSelectionFields}
            reviewComponent={BenefitsSelectionReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Military Service"
            path="/military-history/military-service"
            component={MilitaryServiceFields}
            reviewComponent={MilitaryServiceReview}/>
        {this.props.data.seniorRotcCommissioned.value === 'Y'
          ? <ReviewPanel
              pageProps={this.props}
              label="ROTC History"
              path="/military-history/rotc-history"
              component={RotcHistoryFields}
              reviewComponent={RotcHistoryReview}/>
          : null}
        <ReviewPanel
            pageProps={this.props}
            label="Benefits History"
            path="/military-history/benefits-history"
            component={BenefitsHistoryFields}
            reviewComponent={BenefitsHistoryReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Dependent Information"
            path="/military-history/dependents"
            component={DependentInformationFields}
            reviewComponent={DependentInformationReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Education History"
            path="/education-history/education-information"
            component={EmploymentHistoryFields}
            reviewComponent={EmploymentHistoryReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="Employment History"
            path="/employment-history/employment-information"
            component={EmploymentHistoryFields}
            reviewComponent={EmploymentHistoryReview}/>
        <ReviewPanel
            pageProps={this.props}
            label="School Selection"
            path="/school-selection/school-information"
            component={SchoolSelectionFields}
            reviewComponent={SchoolSelectionReview}/>
      </div>);
    }
    return (
      <div>
        <h4>Review Application</h4>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    uiData: state.uiState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateEditStatus: (path) => {
      dispatch(updateIncompleteStatus(path));
    },
    onUpdateSaveStatus: (path) => {
      dispatch(updateCompletedStatus(path));
    },
    onUpdateVerifiedStatus: (path, update) => {
      dispatch(updateVerifiedStatus(path, update));
    },
    onFieldsInitialized: (field) => {
      dispatch(ensureFieldsInitialized(field));
    },
    onStateChange(...args) {
      dispatch(veteranUpdateField(...args));
    }
  };
}


// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);
export { ReviewPage };
