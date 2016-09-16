import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import routes from '../routes';

import ReviewCollapsiblePanel from '../components/ReviewCollapsiblePanel';

import { ensureFieldsInitialized, updateIncompleteStatus, updateVerifiedStatus, updateCompletedStatus, veteranUpdateField } from '../actions';

class ReviewPage extends React.Component {
  render() {
    let content;
    const data = this.props.data;

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
        {routes
          .map(route => route.props)
          .filter(route => {
            return route.chapter &&
              route.path !== '/review-and-submit' &&
              route.reviewComponent &&
              (route.depends === undefined || _.matches(route.depends)(data));
          })
          .map(route => {
            const Component = route.fieldsComponent;
            const ReviewComponent = route.reviewComponent;
            return (<ReviewCollapsiblePanel
                key={route.path}
                uiData={this.props.uiData}
                data={this.props.data}
                onUpdateEditStatus={this.props.onUpdateEditStatus}
                onUpdateSaveStatus={this.props.onUpdateSaveStatus}
                onFieldsInitialized={this.props.onFieldsInitialized}
                onUpdateVerifiedStatus={this.props.onUpdateVerifiedStatus}
                pageLabel={route.name}
                updatePath={route.path}
                component={<Component
                    data={this.props.data}
                    onStateChange={this.props.onStateChange}
                    initializeFields={this.props.onFieldsInitialized}/>}
                reviewComponent={<ReviewComponent data={this.props.data}/>}/>
            );
          })}
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
    onFieldsInitialized(...args) {
      dispatch(ensureFieldsInitialized(...args));
    },
    onStateChange(...args) {
      dispatch(veteranUpdateField(...args));
    }
  };
}


// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);
export { ReviewPage };
