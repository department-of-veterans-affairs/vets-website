import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    return (
      <div>
        <h2 className="vads-u-font-size--h3">
          Your questionnaire has been submitted
        </h2>
        <p>We may contact you for more information or documents.</p>
        <va-button
          message-aria-describedby="Share your results"
          text="Share your results"
          onClick={() => {}}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
