import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import recordEvent from 'platform/monitoring/record-event';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const theme = {
  main: {
    colorBaseBlack: '#323a45',
    colorWhite: '#ffffff',
    colorPrimary: '#0071bb',
  },
};
const copyToUsersClipBoard = (dataEntityId, target) => {
  const input = document.createElement('input');

  const copyUrl = window.location.href.replace(window.location.hash, '');
  input.setAttribute('value', `${copyUrl}#${dataEntityId}`);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  target.focus();
  document.body.removeChild(input);
  recordEvent({
    event: 'int-copy-to-clipboard-click',
    'anchor-text': dataEntityId,
  });
};
const ShareIconClickFeedback = styled.span`
  position: ${props => (props.leftAligned ? 'absolute' : 'relative')};
  margin-top: ${props => (props.leftAligned ? '2px' : '')};
  left: ${props =>
    props.leftAligned && props.leftPx ? `${props.leftPx}px` : ''};
  background-color: ${props => props.theme.colorBaseBlack};
  color: ${props => props.theme.colorWhite};
  font-family: 'Source Sans Pro';
  font-weight: 400;
  font-size: 12px;
  height: 26px;
  padding: 4px;
  border: 1px solid;
  bottom: ${props => (props.leftAligned ? '' : '1px')};
`;

const ShareIcon = styled.i`
  border-radius: 5px;
  font-size: 16px;
  height: 26px;
  width: 26px;
  padding: 4px;
  border: 1px solid;

  color: ${props => props.theme.colorPrimary};

  &:hover {
    background-color: ${props => props.theme.colorBaseBlack};
    color: ${props => props.theme.colorWhite};
    cursor: pointer;
  }
`;

// need this to override this global css rule coming from somewhere:
// .usa-accordion > ul button, .usa-accordion-bordered > ul button

const UnStyledButtonInAccordion = styled.button`
  padding: 0px !important;
  background-color: transparent !important;
  background-image: none !important;
  width: auto !important;
`;

const SharableLink = ({ dataEntityId, idx }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [copiedText] = useState('Link copied');
  const [leftAligned, setLeftAligned] = useState(false);
  const [leftPx, setLeftPx] = useState(0);
  const offsetThreshold = 100;
  const widthOffset = 40;

  useEffect(
    () => {
      if (idx === 0 && window.location.hash) {
        recordEvent({
          event: 'anchor-page-load',
          'anchor-text': dataEntityId,
        });
      }
    },
    [idx, dataEntityId],
  );

  const extractId = idString => {
    if (!idString) return '';
    const arr = idString.split('-');
    arr.shift();
    return arr.join('-');
  };

  const hidePreviousFeedbacks = activeId => {
    const otherActiveFeedbacks = document.getElementsByClassName(
      'sharable-link-feedback',
    );

    for (const feedback of otherActiveFeedbacks) {
      const parentId = feedback.getAttribute('id');
      if (extractId(parentId) !== extractId(activeId)) {
        feedback.style.display = 'none';
        // TODO: refactor, this is brittle if the layout changes
        const icon = feedback.parentElement.previousElementSibling.children[0];
        icon.style = {};
      } else {
        feedback.style = {};
      }
    }
  };

  const hideFeedback = activeId => {
    hidePreviousFeedbacks(activeId);
    setTimeout(() => {
      setFeedbackActive(false);
      setLeftAligned(false);
      setLeftPx(0);
      document.activeElement.children[0].style = {};
    }, 10000);
  };

  const displayFeedback = element => {
    const iconParentId = extractId(element.getAttribute('id'));
    const parentElement = document.getElementById(iconParentId);

    if (
      parentElement?.offsetWidth - (element.offsetLeft + element.offsetWidth) <=
      offsetThreshold
    ) {
      setLeftAligned(true);
      setLeftPx(element.offsetLeft - element.offsetWidth - widthOffset);
    }
    setFeedbackActive(true);
    hideFeedback(element.getAttribute('id'));
  };
  if (true) {
    return (
      <ThemeProvider theme={theme.main}>
        <span aria-live="polite" aria-relevant="additions">
          <UnStyledButtonInAccordion
            className="usa-button-unstyled"
            aria-label={`Copy ${dataEntityId} sharable link`}
          >
            <ShareIcon
              aria-hidden="true"
              className={`fas fa-link sharable-link`}
              feedbackActive={feedbackActive}
              onClick={event => {
                event.persist();
                if (!event || !event.target) return;
                displayFeedback(event.target);
                copyToUsersClipBoard(dataEntityId, event.target.parentElement);
                // move this to a function
                //  we are having to do this b/c of the side effect of the copy to clipboard
                document.activeElement.children[0].style.color =
                  theme.main.colorWhite;
                document.activeElement.children[0].style.backgroundColor =
                  theme.main.colorBaseBlack;
              }}
              id={`icon-${dataEntityId}`}
            />
          </UnStyledButtonInAccordion>
          {feedbackActive && (
            <ShareIconClickFeedback
              className={`vads-u-margin-left--0.5 sharable-link-feedback`}
              leftAligned={leftAligned}
              feedbackActive={feedbackActive}
              leftPx={leftPx}
              id={`feedback-${dataEntityId}`}
            >
              {copiedText}
            </ShareIconClickFeedback>
          )}
        </span>
      </ThemeProvider>
    );
  }
  return null;
};

const mapStateToProps = store => ({
  showSharableLink: toggleValues(store)[FEATURE_FLAG_NAMES.sharableLinks],
});

export default connect(mapStateToProps)(SharableLink);
