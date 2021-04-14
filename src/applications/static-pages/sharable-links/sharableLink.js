import React, { useState } from 'react';
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
  background-color: ${props => (props.feedbackActive ? 'black' : '')};
  color: ${props => (props.feedbackActive ? 'white' : '#0071bb')};

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

  const offsetThreshold = 100;
  const widthOffset = 40;
  const extractId = idString => {
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
    }, 1000000);
  };
  const displayFeedback = target => {
    const iconParentId = extractId(target.getAttribute('id'));
    const parentElement = document.getElementById(iconParentId);

    if (
      parentElement?.offsetWidth - (target.offsetLeft + target.offsetWidth) <=
      offsetThreshold
    ) {
      setLeftAligned(true);
      setLeftPx(target.offsetLeft - target.offsetWidth - widthOffset);
    }
    setFeedbackActive(true);
    hideFeedback(target.getAttribute('id'));
  };

  // TODO:
  // - [ ] Theming for styled components
  // - [ ] React transition group
  // - [ ] Analytics/accessibility

  return (
    <span aria-live="polite" aria-relevant="additions">
      <ShareIcon
        tabIndex={0}
        aria-label={`Copy ${dataEntityId} sharable link`}
        aria-hidden="true"
        className={`fas fa-link sharable-link`}
        feedbackActive={feedbackActive}
        onClick={event => {
          event.persist();
          if (!event || !event.target) return;
          copyToUsersClipBoard(dataEntityId);
          displayFeedback(event.target);
          event.target.focus();
        }}
        id={`icon-${dataEntityId}`}
      />

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
  );
};

export default SharableLink;
