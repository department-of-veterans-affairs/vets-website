import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import ProgressButton from '../components/form-elements/ProgressButton';

class FormSaved extends React.Component {
  goBack = () => {
    this.props.router.goBack();
  }

  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[0].path);
  }

  render() {
    const lastSavedDate = this.props;

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
        <ProgressButton
            onButtonClick={this.goBack}
            buttonText="Resume previous application"
            buttonClass="usa-button-primary"/>
        <ProgressButton
            onButtonClick={this.goToBeginning}
            buttonText="Start over"
            buttonClass="usa-button-outline"
            afterText="»"/>
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
  lastSavedDate: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    lastSavedDate: state.form.lastSavedDate
  };
}

export default withRouter(connect(mapStateToProps)(FormSaved));

export { FormSaved };
