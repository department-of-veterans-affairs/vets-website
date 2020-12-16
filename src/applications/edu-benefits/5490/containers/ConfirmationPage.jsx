import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { survivorBenefitsLabels } from '../../utils/labels';

import {
  ConfirmationPageTitle,
  ConfirmationPageSummary,
  ConfirmationGuidance,
  ConfirmationReturnHome,
} from '../../components/ConfirmationPage';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const form = this.props.form;
    const { formId, submission } = form;

    const response = submission.response ? submission.response.attributes : {};
    const name = form.data.relativeFullName;
    const benefit = form.data.benefit;

    const claimList = [
      <li key={'selected-benefit'}>
        <div className="vads-u-margin-bottom--neg1p5">
          <strong>Selected benefit</strong>
        </div>

        {survivorBenefitsLabels[benefit]}
      </li>,
      <li key={'confirmation-number'}>
        <strong>Confirmation number</strong>
        <br />
        <span>{response.confirmationNumber}</span>
      </li>,
      <li key={'date-received'}>
        <strong>Date received</strong>
        <br />
        <span>{moment(form.submission.submittedAt).format('MMM D, YYYY')}</span>
      </li>,
      <li key={'regional-office'}>
        <strong>Your claim was sent to</strong>
        <br />
        <address className="schemaform-address-view">
          {response.regionalOffice}
        </address>
      </li>,
    ];

    return (
      <div>
        <ConfirmationPageTitle
          formId={formId}
          printHeader={'Apply for education benefits as an eligible dependent'}
        />
        <ConfirmationPageSummary
          formId={formId}
          response={response}
          submission={submission}
          name={name}
          claimInfoList={claimList}
        />
        <ConfirmationGuidance />
        <ConfirmationReturnHome />
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
export { ConfirmationPage };
