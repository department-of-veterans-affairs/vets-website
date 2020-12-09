import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import {
  ConfirmationGuidance,
  ConfirmationPageSummary,
  ConfirmationPageTitle,
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
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  toggleExpanded = e => {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const form = this.props.form;
    const { formId, submission } = form;
    const response = submission.response ? submission.response.attributes : {};
    const name = form.data.veteranFullName;
    return (
      <div>
        <ConfirmationPageTitle
          formId={formId}
          printHeader={'Apply for the Rogers STEM Scholarship'}
        />
        <ConfirmationPageSummary
          formId={formId}
          formName={'Rogers STEM Scholarship'}
          response={response}
          submission={submission}
          name={name}
        />
        <ConfirmationGuidance />
        <div className="form-progress-buttons schemaform-back-buttons">
          <a href="/">
            <button className="usa-button-primary">Go back to VA.gov</button>
          </a>
        </div>
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
