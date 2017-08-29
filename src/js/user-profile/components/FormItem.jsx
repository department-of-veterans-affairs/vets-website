import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { dateDiffDesc } from '../../common/utils/helpers';
import { formTitles, formLinks } from '../helpers';

class FormItem extends React.Component {
  render() {
    const savedFormData = this.props.savedFormData;
    const formId = savedFormData.form;
    const { last_updated: lastSaved, expires_at: expirationTime } = savedFormData.metadata;
    const lastSavedDateTime = moment.unix(lastSaved).format('M/D/YYYY [at] h:mm a');
    const expirationDate = moment.unix(expirationTime);
    const isExpired = moment(expirationDate).isBefore();
    const activeView = (
      <div className="card information">
        <div className="row small-collapse saved-form-information">
          <div className="small-12 large-8 columns saved-form-metadata-container">
            <h5 className="saved-form-title">Application for {formTitles[formId]}</h5>
            {!!lastSaved && !!expirationDate && <div>
              <span className="saved-form-item-metadata">Last saved on {lastSavedDateTime}</span>
              <span className="saved-form-item-metadata saved-form-item-expires">Your saved application will expire in {dateDiffDesc(expirationDate)}.</span>
            </div>}
          </div>
          <div className="small-12 large-4 columns resume-saved-application-container">
            <a className="usa-button-primary resume-saved-application" href={formLinks[formId]}>Continue Your Application</a>
          </div>
        </div>
        <div className="remove-saved-application-container">
          <button className="va-button-link" onClick={() => {this.props.toggleModal(formId);}}>
            <i className="fa fa-trash"></i><span className="remove-saved-application-label">Delete</span>
          </button>
        </div>
      </div>
    );
    const expiredView = (
      <div className="usa-alert usa-alert-warning">
        <button className="va-alert-close notification-close va-expired-item-close" onClick={() => {this.props.toggleModal(formId);}} aria-label="Close notification">
          <i className="fa fa-close" aria-label="Close icon"></i>
        </button>
        <div className="usa-alert-body">
          <h5>Your saved application has expired.</h5>
          <p>The application you started for {formTitles[formId]} has expired. If you still want to apply, please <a href={formLinks[formId]}>start a new application</a>.</p>
        </div>
      </div>
    );
    return isExpired ? expiredView : activeView;
  }
}

FormItem.propTypes = {
  savedFormData: PropTypes.object,
  toggleModal: PropTypes.func.isRequired
};

export default FormItem;
