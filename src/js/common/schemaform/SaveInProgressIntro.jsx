import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import moment from 'moment';

import { toggleLoginModal } from '../../login/actions';
import { fetchInProgressForm, removeInProgressForm } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';
import FormStartControls from './FormStartControls';

export default class SaveInProgressIntro extends React.Component {
  getAlert(savedForm) {
    let alert;

    if (this.props.user.login.currentlyLoggedIn) {
      if (savedForm) {
        const savedAt = this.props.lastSavedDate
          ? moment(this.props.lastSavedDate)
          : moment.unix(savedForm.last_updated);
        const expirationDate = moment.unix(savedForm.metadata.expires_at).format('M/D/YYYY');

        alert = (
          <div>
            <div className="usa-alert usa-alert-info no-background-image schemaform-sip-alert">
              <div className="schemaform-sip-alert-title">Application status: <strong>In progress</strong></div>
              <div className="saved-form-metadata-container">
                <span className="saved-form-metadata">Last saved on {savedAt.format('M/D/YYYY [at] h:mm a')}</span>
                <div className="expires-container">Your saved application <span className="expires">will expire on {expirationDate}.</span></div>
              </div>
              <div>{this.props.children}</div>
            </div>
            <br/>
          </div>
        );
      } else {
        alert = (
          <div>
            <div className="usa-alert usa-alert-info schemaform-sip-alert">
              <div className="usa-alert-body">
                You can save this form in progress, and come back later to finish filling it out.
              </div>
            </div>
            <br/>
          </div>
        );
      }
    } else {
      alert = (
        <div>
          <div className="usa-alert usa-alert-info schemaform-sip-alert">
            <div className="usa-alert-body">
              You can save this form, and come back later to finish filling it out. To save your form in progress, please <button className="va-button-link" onClick={() => this.props.toggleLoginModal(true)}>Sign In</button>.
            </div>
          </div>
          <br/>
        </div>
      );
    }

    return alert;
  }

  render() {
    const { profile } = this.props.user;
    const savedForm = profile && profile.savedForms
      .filter(f => moment.unix(f.metadata.expires_at).isAfter())
      .find(f => f.form === this.props.formId);
    const prefillAvailable = !!(profile && profile.prefillsAvailable.includes(this.props.formId));

    if (profile.loading && !this.props.resumeOnly) {
      return (
        <div>
          <LoadingIndicator message="Checking to see if you have a saved version of this application..."/>
          <br/>
        </div>
      );
    }

    if (this.props.resumeOnly && !savedForm) {
      return null;
    }

    return (
      <div>
        {this.getAlert(savedForm)}
        <FormStartControls
          resumeOnly={this.props.resumeOnly}
          messages={this.props.messages}
          startPage={this.props.pageList[1].path}
          formId={this.props.formId}
          returnUrl={this.props.returnUrl}
          migrations={this.props.migrations}
          fetchInProgressForm={this.props.fetchInProgressForm}
          removeInProgressForm={this.props.removeInProgressForm}
          prefillAvailable={prefillAvailable}
          formSaved={!!savedForm}/>
        <br/>
      </div>
    );
  }
}

SaveInProgressIntro.propTypes = {
  formId: PropTypes.string.isRequired,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  returnUrl: PropTypes.string,
  lastSavedDate: PropTypes.number,
  user: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired
};

export const introSelector = createSelector(
  state => state.form.formId,
  state => state.form.migrations,
  state => state.form.loadedData,
  state => state.user,
  state => state.form.lastSavedDate,
  (formId, migrations, loadedData, user, lastSavedDate) => {
    return {
      formId,
      migrations,
      returnUrl: loadedData.metadata.returnUrl,
      lastSavedDate,
      user
    };
  }
);

export const introActions = {
  fetchInProgressForm,
  removeInProgressForm,
  toggleLoginModal,
};
