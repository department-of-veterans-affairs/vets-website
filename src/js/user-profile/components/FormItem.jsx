import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { dateDiffDesc } from '../../common/utils/helpers';
import { formTitles, formLinks } from '../helpers';

class FormItem extends React.Component {
  render() {
    const savedFormData = this.props.savedFormData;
    const formId = savedFormData.form;
    const { last_updated: lastSavedTime, expires_at: expirationTime } = savedFormData.metadata;
    const lastSavedDate = moment.unix(lastSavedTime);
    const expirationDate = moment.unix(expirationTime);
    return (
      <div className="card information">
        <div className="row small-collapse saved-form-information">
          <div className="small-12 large-8 columns">
            <h5>Application for {formTitles[formId]}</h5>
            {!!lastSavedDate && !!expirationDate && <div>
              <span className="saved-form-item-metadata">Last saved on {moment(lastSavedDate).format('MMMM D, YYYY')}.  </span>
              <span className="saved-form-item-metadata saved-form-item-expires">Expires in {dateDiffDesc(expirationDate)}.</span>
            </div>}
          </div>
          <div className="small-12 large-4 columns">
            <a className="usa-button-primary resume-saved-application float-right" href={formLinks[formId]}>Resume application</a>
          </div>
        </div>
        <div className="remove-saved-application-container">
          <a className="remove-saved-application-link" onClick={() => {this.props.handleClick(formId);}}>
            <i className="fa fa-trash"></i><span className="remove-saved-application-label">Delete</span>
          </a>
        </div>
      </div>
    );
  }
}

FormItem.propTypes = {
  savedFormData: PropTypes.object,
  handleClick: PropTypes.func.isRequired
};

export default FormItem;
