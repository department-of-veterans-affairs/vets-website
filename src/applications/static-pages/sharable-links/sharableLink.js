import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import recordEvent from 'platform/monitoring/record-event';

const theme = {
  main: {
    colorBaseBlack: '#212121',
    colorWhite: '#ffffff',
    colorPrimary: '#0071bb',
  },
};
const copyToUsersClipBoard = dataEntityId => {
  const input = document.createElement('input');

  const copyUrl = window.location.href.replace(window.location.hash, '');
  input.setAttribute('value', `${copyUrl}#${dataEntityId}`);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
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
  background-color: ${props =>
    props.feedbackActive ? props.theme.colorBaseBlack : ''};
  color: ${props =>
    props.feedbackActive ? props.theme.colorWhite : props.theme.colorPrimary};

  &:hover {
    background-color: ${props => props.theme.colorBaseBlack};
    color: ${props => props.theme.colorWhite};
    cursor: pointer;
  }
`;

const SharableLink = ({ dataEntityId }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [copiedText] = useState('Link copied');
  const [leftAligned, setLeftAligned] = useState(false);
  const [leftPx, setLeftPx] = useState(0);

  const offsetThreshold = 100;
  const widthOffset = 40;

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

  return (
    <ThemeProvider theme={theme.main}>
      <span aria-live="polite" aria-relevant="additions">
        <button
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
              copyToUsersClipBoard(dataEntityId);
              displayFeedback(event.target);
              recordEvent({
                event: 'nav-jumplink-click',
              });
            }}
            id={`icon-${dataEntityId}`}
          />
        </button>

        <ReactCSSTransitionGroup
          transitionName="link-copied-feedback"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
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
        </ReactCSSTransitionGroup>
      </span>
    </ThemeProvider>
  );
};

export default SharableLink;
