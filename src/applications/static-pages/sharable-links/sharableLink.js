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
  //  we are having to do this b/c .select(), to copy to users clipboard, removes focus from our button
  target.focus();
  document.body.removeChild(input);
  recordEvent({
    event: 'int-copy-to-clipboard-click',
    'anchor-text': dataEntityId,
  });
};
const ShareIconClickFeedback = styled.span`
  position: ${props => (props.leftAligned ? 'absolute' : 'relative')};
  margin-top: ${props => (props.leftAligned && !props.topPx ? '2px' : '')};
  left: ${props =>
    props.leftAligned && props.leftPx ? `${props.leftPx}px` : ''};
  top: ${props => (props.leftAligned && props.topPx ? `${props.topPx}px` : '')};
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
  color: ${theme.main.colorPrimary};
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

const SharableLink = ({ dataEntityId, idx, showSharableLink }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [copiedText] = useState('Link copied');
  const [leftAligned, setLeftAligned] = useState(false);
  const [leftPx, setLeftPx] = useState(0);
  const [topPx, setTopPx] = useState(0);

  const linkCopiedTextWidth = 70;
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

  const onBlur = id => {
    const icon = document.querySelector(`#icon-${id}`);
    icon.style.color = theme.main.colorPrimary;
    icon.style.backgroundColor = 'transparent';
  };

  const onFocus = id => {
    const icon = document.querySelector(`#icon-${id}`);
    icon.style.color = theme.main.colorWhite;
    icon.style.backgroundColor = theme.main.colorBaseBlack;
  };

  const hidePreviousFeedbacks = activeId => {
    const otherActiveFeedbacks = document.getElementsByClassName(
      'sharable-link-feedback',
    );

    for (const feedback of otherActiveFeedbacks) {
      const id = extractId(feedback.getAttribute('id'));
      if (id !== extractId(activeId)) {
        feedback.style.display = 'none';
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
      setTopPx(0);
      onBlur(extractId(activeId));
    }, 10000);
  };

  const displayFeedback = iconElement => {
    const headingId = extractId(iconElement.getAttribute('id'));
    const headingMainEntity = document.querySelector(`#${headingId}`);
    const availableSpaceForFeedbackText =
      headingMainEntity?.offsetWidth -
      (iconElement.offsetLeft + iconElement.offsetWidth);

    if (availableSpaceForFeedbackText <= linkCopiedTextWidth) {
      setLeftAligned(true);
      setLeftPx(iconElement.offsetLeft - iconElement.offsetWidth - widthOffset);
      // ensure vertical alignment when toggling css position (absolute vs relative)
      setTopPx(iconElement.offsetTop);
    }
    setFeedbackActive(true);
    hideFeedback(iconElement.getAttribute('id'));
  };

  if (showSharableLink) {
    return (
      <ThemeProvider theme={theme.main}>
        <span aria-live="polite" aria-relevant="additions">
          <UnStyledButtonInAccordion
            className="usa-button-unstyled"
            aria-label={`Copy ${dataEntityId} sharable link`}
            id={`button-${dataEntityId}`}
            onBlur={() => {
              onBlur(dataEntityId);
            }}
            onFocus={() => {
              onFocus(dataEntityId);
            }}
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
              topPx={topPx}
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
