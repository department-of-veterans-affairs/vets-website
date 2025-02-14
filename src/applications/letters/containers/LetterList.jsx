import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import DownloadLetterLink from '../components/DownloadLetterLink';
import VeteranBenefitSummaryLetter from './VeteranBenefitSummaryLetter';

import {
  letterContent,
  bslHelpInstructions,
  //  eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getOptions,
} from '../utils/helpers';
import { AVAILABILITY_STATUSES, LETTER_TYPES } from '../utils/constants';
import { lettersUseLighthouse } from '../selectors';

export class LetterList extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line -- LH_MIGRATION
    this.state = { LH_MIGRATION__options: LH_MIGRATION__getOptions(false) };
  }

  componentDidMount() {
    const { shouldUseLighthouse } = this.props;
    focusElement('h2#nav-form-header');
    this.setState({
      // eslint-disable-next-line -- LH_MIGRATION
      LH_MIGRATION__options: LH_MIGRATION__getOptions(shouldUseLighthouse),
    });
  }

  render() {
    const downloadStatus = this.props.letterDownloadStatus;
    const letterItems = (this.props.letters || []).map((letter, index) => {
      let content;
      let letterTitle;
      let helpText;
      if (letter.letterType === LETTER_TYPES.benefitSummary) {
        letterTitle = 'Benefit Summary and Service Verification Letter';
        content = <VeteranBenefitSummaryLetter />;
        helpText = bslHelpInstructions;
      } else if (letter.letterType === LETTER_TYPES.proofOfService) {
        letterTitle = 'Proof of Service Card';
        content = letterContent[letter.letterType] || '';
      } else {
        letterTitle = letter.name;
        content = letterContent[letter.letterType] || '';
      }

      let conditionalDownloadButton;
      if (
        letter.letterType !== LETTER_TYPES.benefitSummary ||
        this.props.optionsAvailable
      ) {
        conditionalDownloadButton = (
          <DownloadLetterLink
            letterType={letter.letterType}
            letterTitle={letterTitle}
            downloadStatus={downloadStatus[letter.letterType]}
            // eslint-disable-next-line -- LH_MIGRATION
            LH_MIGRATION__options={this.state.LH_MIGRATION__options}
            key={`download-link-${index}`}
          />
        );
      }

      return (
        <va-accordion-item key={`panel-${index}`}>
          <h3 slot="headline">{letterTitle}</h3>
          <div>{content}</div>
          {conditionalDownloadButton}
          {helpText}
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
        <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
          {toggleValue =>
            toggleValue ? null : (
              <>
                <p>
                  To see an explanation about each letter, click on the (+) to
                  expand the box. After you expand the box, you’ll be given the
                  option to download the letter.
                </p>
                <p>
                  To download a letter, you’ll need to have Adobe Acrobat Reader
                  installed on your computer. You can then download or save the
                  letter to your device. Open Acrobat Reader, and from the File
                  menu, choose Open. Select the PDF.
                </p>
                <p>
                  If you’re still having trouble opening the letter, you may
                  have an older version of Adobe Acrobat Reader. You’ll need to{' '}
                  <a
                    href="https://get.adobe.com/reader/otherversions/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    download the latest version
                  </a>
                  . It’s free.
                </p>
                <p>
                  <Link to="/confirm-address">Go back to edit address</Link>
                </p>
              </>
            )
          }
        </Toggler.Hoc>

        {letterItems.length !== 0 && (
          <va-accordion bordered>{letterItems}</va-accordion>
        )}
        {eligibilityMessage}

        <h2 slot="headline">Other sources of VA benefit documentation</h2>
        <p>
          A lot of people come to this page looking for their Post-9/11 GI Bill
          statement of benefits, their Certificate of Eligibility (COE) for home
          loan benefits, and their DD214. We don’t have these documents
          available here yet, but if you’re eligible for them, you can get them
          through these links:
        </p>
        <ul className="vads-u-margin-bottom--9 bullet-disc">
          <li>
            <a
              href="/education/download-letters/"
              target="_blank"
              className="vads-u-text-decoration--none"
            >
              VA education letters
            </a>
          </li>
          <li>
            <a
              href="/education/gi-bill/post-9-11/ch-33-benefit"
              target="_blank"
              className="vads-u-text-decoration--none"
            >
              Post-9/11 GI Bill statement of benefits
            </a>
          </li>
          <li>
            <a
              href="/housing-assistance/home-loans/check-coe-status/"
              rel="noopener noreferrer"
              target="_blank"
              className="vads-u-text-decoration--none"
            >
              Certificate of home loan benefits
            </a>
          </li>
          <li>
            <a
              href="/records/get-military-service-records/"
              rel="noopener noreferrer"
              target="_blank"
              className="vads-u-text-decoration--none"
            >
              Discharge or separation papers (DD214)
            </a>
          </li>
        </ul>
        <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
          {toggleValue =>
            toggleValue ? (
              <va-need-help>
                <div slot="content">
                  <p>
                    Call us at <va-telephone contact="8008271000" />. We're here
                    Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
                    hearing loss, call <va-telephone contact="711" tty="true" />
                    .
                  </p>
                </div>
              </va-need-help>
            ) : (
              <>
                <h2 className="vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
                  Need help?
                </h2>
                <div className="vads-u-margin-bottom--4">
                  If you have any questions, please call the VA Benefits Help
                  Desk:
                  <br />
                  <va-telephone contact="8008271000" />, Monday &#8211; Friday,
                  8 a.m. &#8211; 9 p.m. ET
                </div>
              </>
            )
          }
        </Toggler.Hoc>
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
    shouldUseLighthouse: lettersUseLighthouse(state),
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
  shouldUseLighthouse: PropTypes.bool,
};

export default connect(mapStateToProps)(LetterList);
