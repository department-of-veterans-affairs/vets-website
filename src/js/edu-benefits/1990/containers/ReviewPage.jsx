import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import routes from '../routes';

import ReviewCollapsiblePanel from '../components/ReviewCollapsiblePanel';
import PrivacyAgreement from '../../../common/components/questions/PrivacyAgreement';

import { ensureFieldsInitialized, updateEditStatus, veteranUpdateField } from '../actions';
import { isActivePage, focusElement } from '../../../common/utils/helpers';

class ReviewPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
  }
  render() {
    let content;
    const { data, onStateChange } = this.props;

    if (this.props.uiData.isApplicationSubmitted) {
      content = (
        <div className="usa-alert usa-alert-success">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">You have submitted your application for education benefits!</h3>
            <p className="usa-alert-text">We are processing your application. You should receive a phone call from the VA in the next week.</p>
            <p className="usa-alert-text">If you do not receive a call from the VA within a week, or you have questions, call 1-877-222-VETS (8387) and press 2.</p>
          </div>
        </div>
      );
    } else {
      const chapters = _.groupBy(
        routes
          .filter(route => {
            return route.chapter &&
              route.path !== 'review-and-submit' &&
              isActivePage(route, data);
          }),
        route => route.chapter
      );
      content = (<div>
        <p>You can review your application information here. When you’re done, click submit.</p>
        <p>VA will usually process your claim within 30 days. VA will send you a letter by U.S. mail with your claim decision.</p>
        {Object.keys(chapters)
          .map(chapter => {
            return (<ReviewCollapsiblePanel
                key={chapter}
                chapter={chapter}
                uiData={this.props.uiData}
                data={this.props.data}
                onUpdateEditStatus={this.props.onUpdateEditStatus}
                onFieldsInitialized={this.props.onFieldsInitialized}
                onStateChange={this.props.onStateChange}
                urlPrefix="/1990/"
                pages={chapters[chapter]}/>
            );
          })}
      </div>);
    }
    return (
      <div>
        <h4 className="confirmation-page-title">Review application</h4>
        <div className="input-section">
          {content}
        </div>
        <p><strong>Note:</strong> According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information. (See 18 U.S.C. 1001)</p>
        <PrivacyAgreement required
            showError={this.props.hasAttemptedSubmit}
            onChange={(update) => onStateChange('privacyAgreementAccepted', update)}
            checked={this.props.data.privacyAgreementAccepted}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    uiData: state.uiState,
    hasAttemptedSubmit: state.uiState.submission.hasAttemptedSubmit
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateEditStatus: (...args) => {
      dispatch(updateEditStatus(...args));
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
