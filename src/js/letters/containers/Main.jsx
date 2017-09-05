import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import { systemDownMessage, unableToFindRecordWarning } from '../../common/utils/error-messages';

import { getBenefitSummaryOptions, getLetterList } from '../actions/letters';

export class Main extends React.Component {
  componentDidMount() {
    this.props.getLetterList();
    this.props.getBenefitSummaryOptions();
  }

  render() {
    let appContent;

    switch (this.props.lettersAvailability) {
      case 'available':
        appContent = this.props.children;
        break;
      case 'awaitingResponse':
        appContent = <LoadingIndicator message="Loading your letters..."/>;
        break;
      case 'backendServiceError':
        appContent = systemDownMessage;
        break;
      case 'backendAuthenticationError':
        appContent = unableToFindRecordWarning;
        break;
      // Need a permanent UI for this
      case 'invalidAddressProperty':
        appContent = systemDownMessage;
        break;
      case 'letterEligibilityError':
        appContent = this.props.children;
        break;
      case 'unavailable':
        appContent = (
          <div id="lettersUnavailable">
            <div className="usa-alert usa-alert-error" role="alert">
              <div className="usa-alert-body">
                <h4 className="usa-alert-heading">Letters Unavailable</h4>
                <p className="usa-alert-text">
                  We weren't able to retrieve your VA letters. Please call
                  <a href="tel:855-574-7286">855-574-7286</a> between Monday-Friday
                  8:00 a.m. - 8:00 p.m. (ET).
                </p>
              </div>
            </div>
            <br/>
          </div>
        );
        break;
      default:
        appContent = systemDownMessage;
    }

    return (
      <div>
        {appContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    letters: letterState.letters,
    destination: letterState.destination,
    lettersAvailability: letterState.lettersAvailability,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    optionsAvailable: letterState.optionsAvailable
  };
}

const mapDispatchToProps = {
  getBenefitSummaryOptions,
  getLetterList
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
