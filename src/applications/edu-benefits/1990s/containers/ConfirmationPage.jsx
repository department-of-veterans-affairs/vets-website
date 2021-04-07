import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';
import moment from 'moment';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }
  render() {
    const form = this.props.form;
    const { submission } = form;
    const response = submission.response ? submission.response.attributes : {};

    const claimInfoListItems = [
      <li key={'confirmation-number'}>
        <strong>Confirmation number</strong>
        <br />
        <span>{response.confirmationNumber}</span>
      </li>,
      <li key={'date-received'}>
        <strong>Date received</strong>
        <br />
        <span>{moment(submission.submittedAt).format('MMM D, YYYY')}</span>
      </li>,
    ];

    return (
      <ConfirmationPageContent
        formId="VRRAP"
        submission={submission}
        printHeader="Apply for the Veteran Rapid Retraining Assistance Program"
        formName="Veteran Rapid Retraining Assistance Program"
        name={form.data['view:applicantInformation'].veteranFullName}
        displayDefaultClaimList={false}
        claimInfoListItems={claimInfoListItems}
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
