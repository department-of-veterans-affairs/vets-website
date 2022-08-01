import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { UnderReview } from '../components/ConfirmationResponses';

function createConfirmationPage(form) {
  const { submission, data } = form;
  const { response } = submission;
  let name = data.veteranFullName;
  name = {
    first: 'John',
    middle: 'J',
    last: 'Doe',
    suffix: 'Sr',
  };
  return UnderReview(response, name);
}

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop('topScrollElement');
  }

  render() {
    return createConfirmationPage(this.props.form);
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

// Comment this to work, need it for eslint for now.
ConfirmationPage.prototype = {
  form: PropTypes.object,
};

export default connect(mapStateToProps)(ConfirmationPage);
