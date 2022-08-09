import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { UnderReview, Approved } from '../components/ConfirmationResponses';

function createConfirmationPage(form) {
  const { submission, data } = form;
  const { response } = submission;
  let name = data.veteranFullName;

  if (response) {
    name = {
      first: 'John',
      middle: 'J',
      last: 'Doe',
      suffix: 'Sr',
    };
    return UnderReview(response, name);
  }
  return Approved(name);
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

ConfirmationPage.protoType = {
  form: PropTypes.object,
};

export default connect(mapStateToProps)(ConfirmationPage);
