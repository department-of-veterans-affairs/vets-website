import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, connect, useDispatch } from 'react-redux';
import {
  VaAlert,
  VaLink,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import { datadogLogs } from '@datadog/browser-logs';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { DATA_DOG_LOGGING_TOGGLE, DOWNLOAD_STATUSES } from '../utils/constants';
import { getSingleLetterPDFLinkAction } from '../actions/letters';

const DownloadLetterBlobLink = ({
  letterTitle,
  letterType,
  accordionRef,
  // eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__options,
}) => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isLoggingEnabled = useToggleValue(
    TOGGLE_NAMES[DATA_DOG_LOGGING_TOGGLE],
  );

  const [hasFetched, setHasFetched] = useState(false);
  const dispatch = useDispatch();

  useEffect(
    () => {
      const node = accordionRef?.current;

      if (!node || hasFetched) return undefined;

      const checkOpenState = () => {
        const isOpen = node.hasAttribute('open');
        if (isOpen && !hasFetched) {
          dispatch(
            getSingleLetterPDFLinkAction(letterType, LH_MIGRATION__options),
          );
          setHasFetched(true);
        }
      };

      checkOpenState();

      const observer = new MutationObserver(checkOpenState);
      observer.observe(node, {
        attributes: true,
        attributeFilter: ['open'],
      });

      return () => observer.disconnect();
    },
    // eslint-disable-next-line camelcase
    [accordionRef, hasFetched, letterType, LH_MIGRATION__options, dispatch],
  );

  const lettersArr = useSelector(state => state.letters.enhancedLetters);
  const letterStatus = useSelector(
    state => state.letters.enhancedLetterStatus[letterType],
  );

  switch (letterStatus) {
    case DOWNLOAD_STATUSES.downloading:
      return <VaLoadingIndicator message="Loading your letter..." />;
    case DOWNLOAD_STATUSES.success: {
      const enhancedLetter = lettersArr.find(
        letter => letter.letterType === letterType,
      );

      return (
        <div className="vads-u-margin-top--1">
          <VaLink
            href={enhancedLetter.downloadUrl}
            filetype="PDF"
            filename={`${letterTitle}.pdf`}
            text={`Download ${letterTitle}`}
            download
            onClick={() => {
              if (isLoggingEnabled && !isLoadingFeatureFlags) {
                datadogLogs.logger.info('Letter downloaded.', {
                  'letter-type': letterType,
                });
              }
            }}
          />
        </div>
      );
    }
    case DOWNLOAD_STATUSES.failure:
      return (
        <VaAlert class="vads-u-margin-top--2" status="error" role="alert">
          <h4 slot="headline">{`Your ${letterTitle} is currently unavailable`}</h4>
          <p>
            If you need help accessing your letter, please <CallVBACenter />
          </p>
        </VaAlert>
      );
    default:
      return <div>Refresh the browser to download your letter.</div>;
  }
};

DownloadLetterBlobLink.propTypes = {
  accordionRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  letterTitle: PropTypes.string,
  letterType: PropTypes.string,
  // eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__options: PropTypes.object.isRequired,
  getSingleLetterPDFLinkAction: PropTypes.func.isRequired,
};
const mapDispatchToProps = {
  getSingleLetterPDFLinkAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(DownloadLetterBlobLink);
