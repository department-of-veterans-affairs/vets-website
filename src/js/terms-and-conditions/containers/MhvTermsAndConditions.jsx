import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';
// import { mhvAccessError } from '../../../platform/static-data/error-messages';
import { acceptTerms, fetchLatestTerms } from '../actions';

const TERMS_NAME = 'mhvac';

export class MhvTermsAndConditions extends React.Component {
  constructor(props) {
    super(props);

    const nextParams = new URLSearchParams(window.location.search);
    this.redirectUrl = nextParams.get('next');

    this.state = {
      isAgreementChecked: false,
      isRecentlyAccepted: false
    };
  }

  componentDidMount() {
    this.props.fetchLatestTerms(TERMS_NAME);
  }

  redirect = () =>  {
    if (this.redirectUrl) { window.location = this.redirectUrl; }
  }

  handleAgreementCheck = () => {
    this.setState({ isAgreementChecked: !this.state.isAgreementChecked });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.acceptTerms(TERMS_NAME);
    this.setState({ isRecentlyAccepted: true }, this.redirect);
  }

  handleCancel = (e) => {
    e.preventDefault();
  }

  renderBanner = () => {
    let headline;
    let content;

    if (this.state.isRecentlyAccepted) {
      headline = 'You\'ve accepted the Terms and Conditions for using Vets.gov health tools';
      content = '';
    } else if (this.redirectUrl) {
      headline = 'Using Vets.gov Health Tools';
      content = 'Before you can use the health tools on Vets.gov, you\'ll need to read and agree to the Terms and Conditions below. This will give us your permission to show you your VA medical information on this site.';
    } else {
      return null;
    }

    return <AlertBox status="success" isVisible headline={headline} content={content}/>;
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
          id="agreement-checkbox"
          value="yes"
          checked={this.state.isAgreementChecked}
          onChange={this.handleAgreementCheck}/>
        <label className="agreement-label" htmlFor="agreement-checkbox">{yesContent}</label>
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
            {this.renderBanner()}
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
