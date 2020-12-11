import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { benefitsLabels } from '../../utils/labels';
import {
  claimList,
  ConfirmationGuidance,
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
    const benefit = form.data.benefit;

    const docExplanation = this.state.isExpanded ? (
      <div className="usa-accordion-content" aria-hidden="false">
        <p>In the future, you might need:</p>
        <ul>
          <li>Your reserve kicker</li>
          <li>
            Documentation of additional contributions that would increase your
            monthly benefits
          </li>
        </ul>
        <p>
          Documents can be uploaded using the{' '}
          <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">
            GI Bill site
          </a>
          .
        </p>
      </div>
    ) : null;

    const claimInfoList = claimList(response, submission);
    claimInfoList.unshift(
      <li key={'benefit'}>
        <strong>Benefit to be transferred</strong>
        <br />
        {benefitsLabels[benefit]}
      </li>,
    );
    return (
      <div>
        <ConfirmationPageTitle formId={formId} />
        <ConfirmationPageSummary
          formId={formId}
          response={response}
          submission={submission}
          name={name}
          claimInfoList={claimInfoList}
        />
        <div
          id="collapsiblePanel"
          className="usa-accordion-bordered screen-only"
        >
          <ul className="usa-unstyled-list">
            <li>
              <div className="accordion-header clearfix">
                <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.isExpanded ? 'true' : 'false'}
                  aria-controls="collapsible-document-explanation"
                  onClick={this.toggleExpanded}
                >
                  No documents required at this time
                </button>
              </div>
              <div id="collapsible-document-explanation">{docExplanation}</div>
            </li>
          </ul>
        </div>
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
