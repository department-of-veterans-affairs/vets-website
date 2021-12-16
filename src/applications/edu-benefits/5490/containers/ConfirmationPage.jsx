import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { survivorBenefitsLabels } from '../../utils/labels';

import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const form = this.props.form;
    const { submission, formId } = form;
    const benefit = form.data.benefit;

    return (
      <ConfirmationPageContent
        claimInfoListItems={[
          <li key={'selected-benefit'}>
            <div className="vads-u-margin-bottom--neg1p5">
              <strong>Selected benefit</strong>
            </div>
            {survivorBenefitsLabels[benefit]}
          </li>,
        ]}
        printHeader={'Apply for education benefits as an eligible dependent'}
        formId={formId}
        name={form.data.relativeFullName}
        submission={submission}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
