import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

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

    return (
      <div>
        <ConfirmationPageTitle
          formId={formId}
          printHeader={'Apply to use transferred education benefits'}
        />
        <ConfirmationPageSummary
          formId={formId}
          response={response}
          submission={submission}
          name={name}
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
