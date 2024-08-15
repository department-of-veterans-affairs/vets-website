import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import PropTypes from 'prop-types';

import { setSubmission } from 'platform/forms-system/src/js/actions';
import BenefitCard from '../components/BenefitCard';
import AdditionalSupport from '../components/AdditionalSupport';
import GetFormHelp from '../components/GetFormHelp';
import ShareResultsModal from '../components/ShareResultsModal';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    scrollToTop('topScrollElement');
  }

  handleClick = e => {
    e.preventDefault();
    const now = new Date().getTime();

    this.props.setSubmission('status', false);
    this.props.setSubmission('hasAttemptedSubmit', false);
    this.props.setSubmission('timestamp', now);
    this.props.router.goBack();
  };

  render() {
    return (
      <div>
        <p>
          Based on your answers, you may be eligible for these benefits and
          services. Learn more about each benefit. And check your eligibility
          before you apply.
        </p>

        <ShareResultsModal />

        <div id="resultsContainer">
          <div id="filtersSectionDesktop">
            <b>Filters</b>
          </div>

          <div id="filtersSectionMobile">
            <va-link-action
              href="#"
              message-aria-describedby="Filter and sort"
              text="Filter and sort"
              type="secondary"
            />
          </div>

          <div id="resultsSection">
            <b>
              Showing 1 result, filtered to show all results, sorted by
              relevance
            </b>

            <p>
              <va-link
                href="#"
                onClick={this.handleClick}
                text="Go back and review your entries"
              />
            </p>

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

        <AdditionalSupport />

        <div className="row vads-u-margin-bottom--2">
          <div className="usa-width-one-whole medium-8 columns">
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

const mapDispatchToProps = {
  setSubmission,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

ConfirmationPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
  }),
  router: PropTypes.object,
  setSubmission: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
