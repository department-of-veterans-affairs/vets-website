import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { SAVE_STATUSES } from './save-load-actions';

class SaveStatus extends React.Component {
  render() {
    const { form, profile } = this.props;

    let savedAt;
    let savedAtMessage;
    const savedForm = profile && profile.savedForms.length > 0 && profile.savedForms
      .filter(f => moment.unix(f.metadata.expires_at).isAfter())
      .find(f => f.form === form.formId);
    if (savedForm || form.lastSavedDate) {

      savedAt = form.lastSavedDate
        ? moment(this.props.lastSavedDate)
        : moment.unix(savedForm.last_updated);
      savedAtMessage = ` Last saved at ${savedAt.format('M/D/YYYY [at] h:mm a')}`;
    } else {
      savedAtMessage = '';
    }
    const isSaving = form.savedStatus === SAVE_STATUSES.autoPending;
    return (
      <div className="row">
        <div className="small-12 columns">
          {savedAt && !isSaving && <div className="panel saved-success-container">
            <i className="fa fa-check-circle saved-success-icon"></i>Application has been saved.{savedAtMessage}
          </div>}
          {isSaving && <p className="saving">Saving...</p>}
          {this.props.children}
        </div>
      </div>
    );
  }
}


SaveStatus.propTypes = {
  form: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequied
};

export default SaveStatus;
