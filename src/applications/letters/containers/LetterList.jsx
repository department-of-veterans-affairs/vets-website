import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DownloadLetterLink from '../components/DownloadLetterLink';
import DownloadLetterBlobLink from '../components/DownloadLetterBlobLink';
import { DownloadTsaLetter } from '../components/DownloadTsaLetter';
import VeteranBenefitSummaryOptions from './VeteranBenefitSummaryOptions';
import {
  apiRequest,
  //  eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getOptions,
  newLetterContent,
} from '../utils/helpers';
import {
  AVAILABILITY_STATUSES,
  GET_TSA_LETTER_ELIGIBILITY_ENDPOINT,
  LETTER_TYPES,
} from '../utils/constants';

export class LetterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tsaLetter: null,
      // eslint-disable-next-line -- LH_MIGRATION
      LH_MIGRATION__options: LH_MIGRATION__getOptions(false),
    };
    this.accordionRefs = {};
  }

  componentDidMount() {
    focusElement('#letters-title-id');
    this.setState({
      // eslint-disable-next-line -- LH_MIGRATION
      LH_MIGRATION__options: LH_MIGRATION__getOptions(),
    });
    this.getTsaLetter();
  }

  getTsaLetter() {
    return apiRequest(GET_TSA_LETTER_ELIGIBILITY_ENDPOINT)
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const tsaLetters = response.data.filter(
            letter => letter?.attributes?.received_at,
          );
          const latestLetter = tsaLetters.reduce((latest, current) => {
            return current.attributes.received_at >
              latest.attributes.received_at
              ? current
              : latest;
          });
          this.setState({ tsaLetter: latestLetter });
        }
        recordEvent({
          event: 'api_call',
          'api-name': 'GET /v0/tsa_letter',
          'api-status': 'successful',
        });
      })
      .catch(() => {
        recordEvent({
          event: 'api_call',
          'api-name': 'GET /v0/tsa_letter',
          'api-status': 'error',
        });
      });
  }

  render() {
    const downloadStatus = this.props.letterDownloadStatus;
    const hasTsaLetter = Boolean(this.state.tsaLetter?.attributes?.document_id);
    const letterItems = (this.props.letters || []).map((letter, index) => {
      if (!this.accordionRefs[index]) {
        this.accordionRefs[index] = React.createRef();
      }
      const accordionRef = this.accordionRefs[index];
      let content;
      let letterTitle;
      if (letter.letterType === LETTER_TYPES.benefitSummary) {
        letterTitle = 'Benefit Summary and Service Verification Letter';
        content = <VeteranBenefitSummaryOptions />;
      } else if (letter.letterType === LETTER_TYPES.proofOfService) {
        letterTitle = 'Proof of Service Card';
        content = newLetterContent[letter.letterType];
      } else if (letter.letterType === LETTER_TYPES.benefitSummaryDependent) {
        letterTitle = 'Benefit Summary Letter';
        content = newLetterContent[letter.letterType];
      } else {
        letterTitle = letter.name;
        content = newLetterContent[letter.letterType];
      }

      // NEW conditional download link (KEEP)
      let conditionalDownloadElem;
      if (letter.letterType === LETTER_TYPES.benefitSummary) {
        conditionalDownloadElem = (
          <DownloadLetterLink
            letterType={letter.letterType}
            letterTitle={`Download ${letterTitle}`}
            downloadStatus={downloadStatus[letter.letterType]}
            // eslint-disable-next-line -- LH_MIGRATION
            LH_MIGRATION__options={this.state.LH_MIGRATION__options}
            key={`download-link-${index}`}
          />
        );
      } else {
        conditionalDownloadElem = (
          <DownloadLetterBlobLink
            letterTitle={letterTitle}
            letterType={letter.letterType}
            // eslint-disable-next-line -- LH_MIGRATION
            LH_MIGRATION__options={this.state.LH_MIGRATION__options}
            accordionRef={accordionRef}
          />
        );
      }

      return (
        <va-accordion-item key={`panel-${index}`} ref={accordionRef}>
          <h3 slot="headline">{letterTitle}</h3>
          <div>{content}</div>
          <>{conditionalDownloadElem}</>
        </va-accordion-item>
      );
    });

    let eligibilityMessage;
    if (
      this.props.lettersAvailability ===
      AVAILABILITY_STATUSES.letterEligibilityError
    ) {
      eligibilityMessage = (
        <div className="vads-u-margin-top--2">
          <va-alert status="warning" visible>
            <h4 slot="headline">Some letters may not be available</h4>
            <p>
              One of our systems appears to be down. If you believe you’re
              missing a letter or document from the list above, please try again
              later.
            </p>
          </va-alert>
        </div>
      );
    }

    return (
      <div className="step-content">
        {(letterItems.length !== 0 || hasTsaLetter) && (
          <va-accordion data-test-id="letters-accordion" bordered>
            {letterItems}
            {hasTsaLetter && (
              <Toggler toggleName={Toggler.TOGGLE_NAMES.tsaSafeTravelLetter}>
                <Toggler.Enabled>
                  <DownloadTsaLetter letter={this.state.tsaLetter} />
                </Toggler.Enabled>
              </Toggler>
            )}
          </va-accordion>
        )}
        <Toggler toggleName={Toggler.TOGGLE_NAMES.emptyStateBenefitLetters}>
          <Toggler.Enabled>
            {letterItems.length === 0 &&
              !eligibilityMessage && (
                <div className="vads-u-margin-top--2">
                  <h3>
                    You don't have any benefit letters or documents available.
                  </h3>
                  <p>
                    Most Veterans find benefit letters and documents here such
                    as:
                  </p>
                  <ul>
                    <li>Benefit Summary and Service Verification Letter</li>
                    <li>Proof of Service Card</li>
                    <li>Civil Service Preference Letter</li>
                  </ul>
                  <p>
                    If you think you should have a benefit letter and document
                    that's not here, call the VA benefits hotline at{' '}
                    <va-telephone contact="8008271000" /> (
                    <va-telephone contact="711" tty />) for help.
                  </p>
                </div>
              )}
          </Toggler.Enabled>
        </Toggler>
        {eligibilityMessage}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;

  return {
    letters: letterState.letters,
    lettersAvailability: letterState.lettersAvailability,
    letterDownloadStatus: letterState.letterDownloadStatus,
    optionsAvailable: letterState.optionsAvailable,
  };
}

LetterList.propTypes = {
  letterDownloadStatus: PropTypes.shape({}),
  letters: PropTypes.arrayOf(
    PropTypes.shape({
      letterType: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  lettersAvailability: PropTypes.string,
  optionsAvailable: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  null,
)(LetterList);
