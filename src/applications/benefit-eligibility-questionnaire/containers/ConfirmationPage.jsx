import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import BenefitCard from '../components/BenefitCard';

import '../sass/benefit-eligibility-questionnaire.scss';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    return (
      <div>
        <p>
          Based on your answers, you may be eligible for these benefits and
          services. Learn more about each benefit. And check your eligibility
          before you apply.
        </p>

        <va-button
          message-aria-describedby="Share your results"
          text="Share your results"
          onClick={() => {}}
        />

        <div id="resultsContainer">
          <div id="filtersSection">
            <b>Filters</b>
          </div>

          <div id="resultsSection">
            <b>
              Showing 1 result, filtered to show all results, sorted by
              relevance
            </b>

            <div className="vads-u-margin-y--2">
              <va-alert-expandable
                status="info"
                trigger="Time-sensitive benefits"
              />
            </div>

            <div>
              <BenefitCard />
            </div>

            <va-accordion>
              <va-accordion-item
                header="Show benefits that I may not qualify for"
                id="show"
              />
            </va-accordion>
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
