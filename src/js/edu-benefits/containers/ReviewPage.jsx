import React from 'react';
import { connect } from 'react-redux';

import ReviewCollapsiblePanel from '../components/ReviewCollapsiblePanel';

import PersonalInformationReview from '../components/veteran-information/PersonalInformationReview';
import PersonalInformationFields from '../components/veteran-information/PersonalInformationFields';

import { ensureFieldsInitialized, updateIncompleteStatus, updateVerifiedStatus, updateCompletedStatus, veteranUpdateField } from '../actions';

/*
    TODO(crew): Get components from store and create array to check if ReviewCollapsiblePanel is
    open or closed. Also, potentially generate ReviewCollapsiblePanel components with routes from
    json object.
*/

class ReviewPage extends React.Component {
  render() {
    let content;

    if (this.props.uiData.isApplicationSubmitted) {
      content = (
        // TODO(crew): We need to figure out why the css isn't working here.
        <div className="usa-alert usa-alert-success">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">You have submitted your application for health care!</h3>
            <p className="usa-alert-text">We are processing your application. You should receive a phone call from the VA in the next week.</p>
            <p className="usa-alert-text">If you do not receive a call from the VA within a week, or you have questions, call 1-877-222-VETS (8387) and press 2.</p>
          </div>
        </div>
      );
    } else {
      content = (<div>
        <p>Please make sure all your information is correct before submitting your application.</p>
        <ReviewCollapsiblePanel
            uiData={this.props.uiData}
            data={this.props.data}
            onUpdateEditStatus={this.props.onUpdateEditStatus}
            onUpdateSaveStatus={this.props.onUpdateSaveStatus}
            onFieldsInitialized={this.props.onFieldsInitialized}
            onUpdateVerifiedStatus={this.props.onUpdateVerifiedStatus}
            pageLabel="Personal Information"
            updatePath="/veteran-information/personal-information"
            component={<PersonalInformationFields data={this.props.data} onStateChange={this.props.onStateChange}/>}
            reviewComponent={<PersonalInformationReview data={this.props.data}/>}/>
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
