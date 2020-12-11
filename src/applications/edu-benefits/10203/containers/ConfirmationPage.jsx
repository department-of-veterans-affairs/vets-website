import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { ConfirmationPageContent } from '../../components/ConfirmationPageContent';
import formConfig from '../config/form';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    const form = this.props.form;
    const { submission } = form;

    return (
      <ConfirmationPageContent
        formConfig={formConfig}
        submission={submission}
        printHeader="Apply for the Rogers STEM Scholarship"
        formName="Rogers STEM Scholarship"
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
