import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';

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

    return (
      <ConfirmationPageContent
        formId="VRRAP"
        submission={submission}
        printHeader="Apply for the Veterans Rapid Retraining Assistance Program"
        formName="Veterans Rapid Retraining Assistance Program"
        name={form.data['view:applicantInformation'].veteranFullName}
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
