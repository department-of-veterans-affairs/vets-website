import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { dateDiffDesc } from '../../common/utils/helpers';
import { formTitles, formLinks } from '../helpers';

// TODO: (ceh) style properly
class FormItem extends React.Component {
  render() {
    const savedFormData = this.props.savedFormData;
    const formId = savedFormData.form;
    const { last_updated: lastSavedDate, expires_at } = savedFormData.metadata;
    const expirationDate = moment.unix(expires_at);
    return (
      <div className="card information">
        <strong>Application for {formTitles[formId]}</strong><br/>
        {!!lastSavedDate && !!expirationDate && <p>Last saved on {moment(lastSavedDate).format('M/D/YYYY [at] h:mm a')}<span className="schemaform-sip-expires">Your saved application will expire in {dateDiffDesc(expirationDate)}.</span></p>}
        <a className=" usa-button-primary" href={formLinks[formId]}>Resume application</a>
        <div onClick={() => {this.props.handleClick(formId);}}>
          <i className="fa fa-trash"></i><span>Delete</span>
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
