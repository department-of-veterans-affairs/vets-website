import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  background-color: black;
  color: white;
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
  color: #0071bb;
  background-color: ${props => (props.feedbackActive ? 'black' : '')};
  color: ${props => (props.feedbackActive ? 'white' : '')};

  &:hover {
    background-color: black;
    color: white;
    cursor: pointer;
  }
`;

const SharableLink = ({ dataEntityId }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [copiedText] = useState('Link copied');
  const [leftAligned, setLeftAligned] = useState(false);
  const [leftPx, setLeftPx] = useState(0);
  //  a rough approximation of the px length of 'link copied'
  const offsetThreshold = 100;
  const widthOffset = 40;
  const hideFeedback = () => {
    setTimeout(() => {
      setFeedbackActive(false);
      setLeftAligned(false);
      setLeftPx(0);
    }, 10000);
  };
  const displayFeedback = target => {
    if (
      window.innerWidth - (target.offsetLeft + target.offsetWidth) <=
      offsetThreshold
    ) {
      // this isn't working on desktop b/c we can't use the windows width, we have to use the content containers width.
      setLeftAligned(true);
      setLeftPx(target.offsetLeft - target.offsetWidth - widthOffset);
    }
    setFeedbackActive(true);
    hideFeedback();
  };
  useEffect(
    () => {
      // hide all the other active feedback when you click on a new link
      // its not working on second click ...
      // TODO:
      // - [ ] Theming for styled components
      // - [ ] React transition group
      // - [ ] Focus
      // - [ ] Only show newest
      // - [ ] Analytics/accessibility

      if (feedbackActive) {
        const otherActiveFeedbacks = document.getElementsByClassName(
          'sharable-link-feedback',
        );
        for (const feedback of otherActiveFeedbacks) {
          if (feedback.getAttribute('id') !== dataEntityId) {
            feedback.style.display = 'none';
          } else {
            feedback.style.display = 'inline';
          }
        }
      }
    },
    [feedbackActive, dataEntityId],
  );
  return (
    <span aria-live="polite" aria-relevant="additions">
      <ShareIcon
        aria-label={`Copy ${dataEntityId} sharable link`}
        aria-hidden="true"
        className={`fas fa-link`}
        feedbackActive={feedbackActive}
        onClick={event => {
          event.persist();
          if (!event || !event.target) return;
          copyToUsersClipBoard(dataEntityId);
          displayFeedback(event.target);
        }}
      />
      {feedbackActive && (
        <ShareIconClickFeedback
          className={`vads-u-margin-left--0.5 sharable-link-feedback`}
          leftAligned={leftAligned}
          feedbackActive={feedbackActive}
          leftPx={leftPx}
          id={dataEntityId}
        >
          {copiedText}
        </ShareIconClickFeedback>
      )}
    </span>
  );
};

export default SharableLink;
