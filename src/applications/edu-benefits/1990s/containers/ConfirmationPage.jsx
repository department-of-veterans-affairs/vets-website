import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
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
    // Prod Flag bah-23496
    focusElement(
      environment.isProduction()
        ? '.schemaform-title > h1'
        : '.confirmation-page-title',
    );
    scrollToTop();
  }
  render() {
    const form = this.props.form;
    const { submission } = form;

    return (
      <ConfirmationPageContent
        formId="VRRAP"
        submission={submission}
        printHeader="Apply for the Veteran Rapid Retraining Assistance Program"
        formName="Veteran Rapid Retraining Assistance Program"
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
