import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../utils/helpers';
import { fetchInProgressForm, removeInProgressForm } from './save-load-actions';

import FormStartControls from './FormStartControls';

function focusForm() {
  const legend = document.querySelector('.form-panel legend');
  if (legend && legend.getBoundingClientRect().height > 0) {
    focusElement(legend);
  } else {
    focusElement('.nav-header');
  }
}

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
    scrollToTop();
    focusForm();
  }

  render() {
    const { profile } = this.props.user;
    const lastSavedDate = this.props.lastSavedDate;
    const prefillAvailable = !!(profile && profile.prefillsAvailable.includes(this.props.formId));

    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <strong>Your application has been saved!</strong><br/>
            {!!lastSavedDate && <p>Last saved on {moment(lastSavedDate).format('M/D/YYYY [at] h:mma')}.</p>}

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
    }))
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
