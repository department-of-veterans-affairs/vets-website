import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import AdditionalSupport from '../components/AdditionalSupport';
import GetFormHelp from '../../simple-forms/shared/components/GetFormHelp';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    return (
      <div>
        <p>
          Based on your goals and experiences, we recommend exploring the
          benefits listed below. You may be eligible for these benefits, but
          please double-check the eligibility requirements before applying.
        </p>
        <p>
          You can filter and sort the recommended benefits. If you want to copy
          the link to your personalized results or email the results to
          yourself, select the “Share results” button.
        </p>

        <div className="vads-u-margin-y--2">
          <va-alert-expandable
            status="info"
            trigger="Time-sensitive benefits"
          />
        </div>

        <va-button
          message-aria-describedby="Share your results"
          text="Share your results"
          onClick={() => {}}
        />

        <hr className="divider vads-u-margin-y--2" />

        <va-accordion>
          <va-accordion-item
            header="Recommended benefits and resources"
            id="recommended"
          />
          <va-accordion-item
            header="Show benefits that I may not qualify for"
            id="show"
          />
        </va-accordion>

        <AdditionalSupport />

        <div className="row vads-u-margin-bottom--2">
          <div className="usa-width-two-thirds medium-8 columns">
            <va-need-help>
              <div slot="content">
                <GetFormHelp formConfig={this.props.formConfig} />
              </div>
            </va-need-help>
          </div>
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
