import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../utils/helpers';
import { fetchInProgressForm, removeInProgressForm } from './save-load-actions';

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
    // if we don't have this then that means we're loading the page
    // without any data and should just go back to the intro
    if (!this.props.lastSavedDate) {
      this.props.router.replace(this.props.route.pageList[0].path);
    } else {
      scrollToTop();
      focusElement('.usa-alert');
    }
  }

  render() {
    const { profile } = this.props.user;
    const lastSavedDate = this.props.lastSavedDate;
    const prefillAvailable = !!(profile && profile.prefillsAvailable.includes(this.props.formId));
    const { success } = this.props.route.formConfig.savedFormMessages || {};

    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <strong>Your application has been saved!</strong><br/>
            {!!lastSavedDate && <p>Last saved on {moment(lastSavedDate).format('M/D/YYYY [at] h:mma')}.</p>}
            {success}
            If you're on a public computer, please sign out before you leave to ensure your data is secure.
          </div>
        </div>
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
