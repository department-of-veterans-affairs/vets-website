import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import moment from 'moment';

import { updateLogInUrl } from '../../login/actions';
import { fetchInProgressForm } from './save-load-actions';
import SignInLink from '../components/SignInLink';
import FormIntroButtons from './FormIntroButtons';

export default class SaveInProgressIntro extends React.Component {
  getAlert(formSaved) {
    let alert;

    if (this.props.user.login.currentlyLoggedIn) {
      if (formSaved) {
        const savedAt = this.props.savedAt;
        alert = (
          <div>
            <div className="usa-alert usa-alert-info no-background-image">
              <div style={{ paddingBottom: '8px' }}>Application status: <strong>In progress</strong></div>
              <br/>
              <div>Last saved on {moment(savedAt).format('MM/DD/YYYY [at] hh:mma')}</div>
              <div>{this.props.children}</div>
            </div>
            <br/>
          </div>
        );
      }
    } else {
      alert = (
        <div>
          <div className="usa-alert usa-alert-info">
            <div className="usa-alert-body">
              <strong>Note:</strong> You are now able save a form in progress, and come back to finish it later. To be able to save your form in progress, please <SignInLink isLoggedIn={this.props.user.login.currentlyLoggedIn} loginUrl={this.props.user.login.loginUrl} onUpdateLoginUrl={this.props.updateLogInUrl}>sign in</SignInLink>.
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
    const formSaved = !!(profile && profile.savedForms.some(f => f.form === this.props.formId));
    const prefillAvailable = !!(profile && profile.prefillsAvailable.includes(this.props.formId));

    return (
      <div>
        {this.getAlert(formSaved)}
        <FormIntroButtons
            pageList={this.props.pageList}
            formId={this.props.formId}
            returnUrl={this.props.returnUrl}
            migrations={this.props.migrations}
            fetchInProgressForm={this.props.fetchInProgressForm}
            prefillAvailable={prefillAvailable}
            formSaved={formSaved}/>
        <br/>
      </div>
    );
  }
}

SaveInProgressIntro.propTypes = {
  formId: PropTypes.string.isRequired,
  migrations: PropTypes.array,
  returnUrl: PropTypes.string,
  savedAt: PropTypes.number,
  user: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  fetchInProgressForm: PropTypes.func.isRequired,
  updateLogInUrl: PropTypes.func.isRequired
};

export const introSelector = createSelector(
  state => state.form.formId,
  state => state.form.migrations,
  state => state.form.loadedData,
  state => state.user,
  (formId, migrations, loadedData, user) => {
    return {
      formId,
      migrations,
      returnUrl: loadedData.metadata.returnUrl,
      savedAt: loadedData.metadata.savedAt,
      user
    };
  }
);

export const introActions = {
  fetchInProgressForm,
  updateLogInUrl
};
