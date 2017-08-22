import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { dateDiffDesc, focusElement } from '../utils/helpers';
import { fetchInProgressForm, removeInProgressForm } from './save-load-actions';
import { handleVerify } from '../../common/helpers/login-helpers.js';

import FormStartControls from './FormStartControls';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class FormSaved extends React.Component {
  componentDidMount() {
    // if we don’t have this then that means we’re loading the page
    // without any data and should just go back to the intro
    if (!this.props.lastSavedDate) {
      this.props.router.replace(this.props.route.pageList[0].path);
    } else {
      scrollToTop();
      focusElement('.usa-alert');
    }
  }

  verifyUser = () => {
    handleVerify(this.props.user.login.verifyUrl);
  }

  render() {
    const { profile } = this.props.user;
    const lastSavedDate = this.props.lastSavedDate;
    const prefillAvailable = !!(profile && profile.prefillsAvailable.includes(this.props.formId));
    const verifiedAccountType = 3;// verified ID.me accounts are type 3
    const notVerified = profile.accountType !== verifiedAccountType;
    const { success } = this.props.route.formConfig.savedFormMessages || {};
    const expirationDate = moment.unix(this.props.expirationDate);

    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <strong>Your application has been saved.</strong><br/>
            {!!lastSavedDate && !!expirationDate && <p>Last saved on {moment(lastSavedDate).format('M/D/YYYY [at] h:mm a')} <span className="schemaform-sip-expires">Your saved application will expire in {dateDiffDesc(expirationDate)}</span>.</p>}
            {success}
            If you’re logged in through a public computer, please sign out of your account before you log off to keep your information secure.
          </div>
        </div>
        {notVerified && <div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            We want to keep your information safe with the highest level of security. Please <button className="va-button-link" onClick={this.verifyUser}>verify your identity</button>.
          </div>
        </div>}
        <br/>
        <FormStartControls
            startPage={this.props.route.pageList[1].path}
            router={this.props.router}
            formId={this.props.formId}
            returnUrl={this.props.returnUrl}
            migrations={this.props.migrations}
            fetchInProgressForm={this.props.fetchInProgressForm}
            removeInProgressForm={this.props.removeInProgressForm}
            prefillAvailable={prefillAvailable}
            formSaved/>
      </div>
    );
  }
}

FormSaved.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string
    })),
    formConfig: PropTypes.object.isRequired
  }),
  lastSavedDate: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    formId: state.form.formId,
    returnUrl: state.form.loadedData.metadata.returnUrl,
    lastSavedDate: state.form.lastSavedDate,
    expirationDate: state.form.expirationDate,
    migrations: state.form.migrations,
    user: state.user
  };
}

const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormSaved));

export { FormSaved };
