import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { SAVE_STATUSES } from './save-load-actions';

class SaveStatus extends React.Component {
  render() {
    const { form } = this.props;
    let savedAt;
    let savedAtMessage;
    if (form.lastSavedDate) {
      savedAt = moment(form.lastSavedDate);
      savedAtMessage = ` Last saved at ${savedAt.format('M/D/YYYY [at] h:mm a')}`;
    } else {
      savedAtMessage = '';
    }
    const isSaving = form.savedStatus === SAVE_STATUSES.autoPending;
    return (
      <div>
        {savedAt && !isSaving && <div className="panel saved-success-container">
          <i className="fa fa-check-circle saved-success-icon"></i>Application has been saved.{savedAtMessage}
        </div>}
        {isSaving && <p className="saving">Saving...</p>}
      </div>
    );
  }
}


SaveStatus.propTypes = {
  form: PropTypes.object.isRequired
};

export default SaveStatus;
