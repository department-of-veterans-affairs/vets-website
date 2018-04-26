import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

// import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';
// import { mhvAccessError } from '../../../platform/static-data/error-messages';
import { acceptTerms, fetchLatestTerms } from '../actions';

const TERMS_NAME = 'mhvac';

export class MhvTermsAndConditions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAgreementChecked: false };
  }

  componentDidMount() {
    this.props.fetchLatestTerms(TERMS_NAME);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.accepted && this.props.accepted) {
      this.redirect();
    }
  }

  redirect = () => {
    const nextParams = new URLSearchParams(window.location.search);
    const nextPath = nextParams.get('next');
    if (nextPath) { window.location = nextPath; }
  }

  handleAgreementCheck = () => {
    this.setState({ isAgreementChecked: !this.state.isAgreementChecked });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.acceptTerms(TERMS_NAME);
  }

  handleCancel = (e) => {
    e.preventDefault();
  }

  renderTermsAndConditions = () => {
    if (this.props.loading) {
      return <LoadingIndicator setFocus message="Loading terms and conditions..."/>;
    }

    const {
      // title,
      headerContent,
      termsContent,
      yesContent
    } = this.props.attributes;

    const yesCheckbox = (
      <div>
        <input
          type="checkbox"
          id="form-yes"
          value="yes"
          checked={this.state.isAgreementChecked}
          onChange={this.handleAgreementCheck}/>
        <label className="agreement-label" htmlFor="form-yes">{yesContent}</label>
      </div>
    );

    const submitButton = (
      <button
        className="usa-button submit-button"
        disabled={!this.state.isAgreementChecked}>
        Submit
      </button>
    );

    const cancelButton = (
      <button
        className="usa-button usa-button-secondary"
        type="button"
        onClick={this.handleCancel}>
        Cancel
      </button>
    );

    /* eslint-disable react/no-danger */
    const unacceptedContent = !this.props.accepted && (
      <div>
        <div className="va-introtext" dangerouslySetInnerHTML={{ __html: headerContent }}/>
        <h3>Terms and Conditions</h3>
        <hr/>
      </div>
    );

    return (
      <form onSubmit={this.handleSubmit}>
        {unacceptedContent}
        <div dangerouslySetInnerHTML={{ __html: termsContent }}/>
        <hr/>
        {yesCheckbox}
        <div className="tc-buttons">
          {submitButton}
          {cancelButton}
        </div>
      </form>
    );
    /* eslint-enable react/no-danger */
  }

  render() {
    return (
      <main className="terms-and-conditions">
        <div className="container">
          <div className="row primary">
            <div className="columns small-12" role="region" aria-label="Terms and Conditions">
              {this.renderTermsAndConditions()}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.termsAndConditions });

const mapDispatchToProps = { acceptTerms, fetchLatestTerms };

export default connect(mapStateToProps, mapDispatchToProps)(MhvTermsAndConditions);
