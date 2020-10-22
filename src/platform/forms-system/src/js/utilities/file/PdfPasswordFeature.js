import React from 'react';
import { connect } from 'react-redux';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

// Feature toggle - made a class component because only a class can be used
// with the `withRef` connect option
// eslint-disable-next-line react/prefer-stateless-function
class PdfPasswordFeature extends React.Component {
  render() {
    return <div data-passwordfeature={this.props.requestLockedPdfPassword} />;
  }
}

const mapStateToProps = state => ({
  requestLockedPdfPassword: toggleValues(state).request_locked_pdf_password,
});

export { PdfPasswordFeature };

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }, // use forwardRef for react-redux v6+
)(PdfPasswordFeature);
