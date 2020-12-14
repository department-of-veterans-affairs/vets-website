import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import {
  ConfirmationGuidance,
  ConfirmationNoDocumentsRequired,
  ConfirmationPageSummary,
  ConfirmationPageTitle,
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

    const docExplanation = this.state.isExpanded ? (
      <div className="usa-accordion-content" aria-hidden="false">
        <p>
          In the future, you might need a copy of your DD 2863 (National Call to
          Service (NCS) Election of Options).
        </p>
        <p>
          Documents can be uploaded using the{' '}
          <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">
            GI Bill site
          </a>
          .
        </p>
      </div>
    ) : null;

    return (
      <div>
        <ConfirmationPageTitle formId={formId} />
        <ConfirmationPageSummary
          formId={formId}
          response={response}
          submission={submission}
          name={name}
        />
        <ConfirmationNoDocumentsRequired
          expanded={this.state.isExpanded}
          toggleExpanded={this.toggleExpanded}
        >
          {docExplanation}
        </ConfirmationNoDocumentsRequired>
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
