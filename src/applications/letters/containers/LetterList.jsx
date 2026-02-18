import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import DownloadLetterLink from '../components/DownloadLetterLink';
import DownloadLetterBlobLink from '../components/DownloadLetterBlobLink';
import { DownloadTsaLetter } from '../components/DownloadTsaLetter';
import VeteranBenefitSummaryOptions from './VeteranBenefitSummaryOptions';
import {
  //  eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getOptions,
  newLetterContent,
} from '../utils/helpers';
import { AVAILABILITY_STATUSES, LETTER_TYPES } from '../utils/constants';
import { getTsaLetterEligibility } from '../actions/letters';

export class LetterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (
      this.props.tsaSafeTravelLetter &&
      this.props.profile?.loa?.current === 3
    ) {
      this.props.getTsaLetterEligibility();
    }
  }

  render() {
    const downloadStatus = this.props.letterDownloadStatus;
    const hasTsaLetter = Boolean(
      this.props.tsaLetterEligibility?.documentId &&
        this.props.tsaLetterEligibility?.documentVersion,
    );
    const isDeterminingTsaEligibility =
      this.props.tsaSafeTravelLetter &&
      this.props.tsaLetterEligibility?.loading;

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
        AVAILABILITY_STATUSES.letterEligibilityError ||
      this.props.tsaLetterEligibility?.error
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
              <DownloadTsaLetter
                documentId={this.props.tsaLetterEligibility?.documentId}
                documentVersion={
                  this.props.tsaLetterEligibility?.documentVersion
                }
              />
            )}
          </va-accordion>
        )}
        {isDeterminingTsaEligibility && (
          <va-loading-indicator
            aria-live="polite"
            message="Determining TSA PreCheck Application Fee Waiver Letter eligibility..."
            set-focus
          />
        )}
        <Toggler toggleName={Toggler.TOGGLE_NAMES.emptyStateBenefitLetters}>
          <Toggler.Enabled>
            {letterItems.length === 0 &&
              !eligibilityMessage &&
              !hasTsaLetter && (
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

const mapDispatchToProps = {
  getTsaLetterEligibility,
};

function mapStateToProps(state) {
  const { profile } = state.user;

  const letterState = state.letters;

  return {
    letters: letterState.letters,
    lettersAvailability: letterState.lettersAvailability,
    letterDownloadStatus: letterState.letterDownloadStatus,
    optionsAvailable: letterState.optionsAvailable,
    profile,
    tsaLetterEligibility: letterState.tsaLetterEligibility,
    tsaSafeTravelLetter:
      state.featureToggles[FEATURE_FLAG_NAMES.tsaSafeTravelLetter],
  };
}

LetterList.propTypes = {
  getTsaLetterEligibility: PropTypes.func,
  letterDownloadStatus: PropTypes.shape({}),
  letters: PropTypes.arrayOf(
    PropTypes.shape({
      letterType: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  lettersAvailability: PropTypes.string,
  optionsAvailable: PropTypes.bool,
  profile: PropTypes.shape({
    loa: PropTypes.shape({
      current: PropTypes.number,
    }),
  }),
  tsaLetterEligibility: PropTypes.shape({
    documentId: PropTypes.string,
    documentVersion: PropTypes.string,
    error: PropTypes.bool,
    loading: PropTypes.bool,
  }),
  tsaSafeTravelLetter: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LetterList);
