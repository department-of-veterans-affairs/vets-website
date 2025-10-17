import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import DownloadLetterLink from '../components/DownloadLetterLink';
import DownloadLetterBlobLink from '../components/DownloadLetterBlobLink';
import VeteranBenefitSummaryOptions from './VeteranBenefitSummaryOptions';

import {
  //  eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getOptions,
  newLetterContent,
} from '../utils/helpers';
import { AVAILABILITY_STATUSES, LETTER_TYPES } from '../utils/constants';

export class LetterList extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line -- LH_MIGRATION
    this.state = { LH_MIGRATION__options: LH_MIGRATION__getOptions(false) };
    this.accordionRefs = {};
  }

  componentDidMount() {
    focusElement('#letters-title-id');
    this.setState({
      // eslint-disable-next-line -- LH_MIGRATION
      LH_MIGRATION__options: LH_MIGRATION__getOptions(),
    });
  }

  render() {
    const downloadStatus = this.props.letterDownloadStatus;
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
        {letterItems.length !== 0 && (
          <va-accordion data-test-id="letters-accordion" bordered>
            {letterItems}
          </va-accordion>
        )}
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
