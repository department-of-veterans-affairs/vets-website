import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import ProgressButton from '../components/form-elements/ProgressButton';
import { focusElement } from '../utils/helpers';

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

  // This seems simpler than trying to get the page sent
  // back from the server response
  goBack = () => {
    this.props.router.goBack();
  }

  // this is sort of naive, but the first page should
  // always be active (and it is almost certainly the intro page)
  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[0].path);
  }

  render() {
    const lastSavedDate = this.props.lastSavedDate;

    return (
      <div className="schemaform-intro">
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <strong>Your application has been saved!</strong><br/>
            {!!lastSavedDate && <p>Last saved on {moment(lastSavedDate).format('M/D/YYYY [at] h:mma')}.</p>}

            If you're on a public computer, please sign out before you leave to ensure your data is secure.
          </div>
        </div>
        <br/>
        <ProgressButton
            onButtonClick={this.goBack}
            buttonText="Resume previous application"
            buttonClass="usa-button-primary"/>
        <ProgressButton
            onButtonClick={this.goToBeginning}
            buttonText="Start over"
            buttonClass="usa-button-outline"/>
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
    lastSavedDate: state.form.lastSavedDate
  };
}

export default withRouter(connect(mapStateToProps)(FormSaved));

export { FormSaved };
