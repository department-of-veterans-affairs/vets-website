import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

class FormIntroButtons extends React.Component {
  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  render() {
    console.log('FormIntroButtons props:', this.props);
    return (
      <div>
        {/*
          TODO: Pull all of the following logic out into a component that can be easily reused in all forms
          if (signed in) {
            display the note in https://marvelapp.com/2hj59b1/screen/28358380
            if (form saved) {
              display the resume application button only if there's one to resume
              replace the Continue button text with "Start over" if the form has been started
              display the resume previous application button
            }
          } else {
            display the note in https://marvelapp.com/2hj59b1/screen/28358376
          }
        */}
        <ProgressButton
            onButtonClick={this.goForward}
            buttonText="Continue"
            buttonClass="usa-button-primary"
            afterText="»"/>
      </div>
    );
  }
}

FormIntroButtons.propTypes = {
  route: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

export default withRouter(connect(mapStateToProps)(FormIntroButtons));
