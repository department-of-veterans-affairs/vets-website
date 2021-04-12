import React, { useState } from 'react';
import styled from 'styled-components';

const copyToUsersClipBoard = dataEntityId => {
  const input = document.createElement('input');

  const copyUrl = window.location.href.replace(window.location.hash, '');
  input.setAttribute('value', `${copyUrl}#${dataEntityId}`);
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand('copy');
  document.body.removeChild(input);
  // eslint-disable-next-line no-console
  console.log('COPIED THIS TO CLIPBOARD: ', result);
};
const LinkClickFeedBack = styled.span`
  position: ${props => (props.leftAligned ? 'absolute' : '')};
  margin-top: ${props => (props.leftAligned ? '2px' : '')};
  left: ${props => (props.leftAligned ? props.leftPx : '')};
`;
const SharableLink = ({ dataEntityId }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [copiedText] = useState('Link copied');
  const [leftAligned, setLeftAligned] = useState(false);
  const [leftPx, setLeftPx] = useState(0);
  const offsetThreshold = 100;

  const displayFeedback = target => {
    const shareLink = target;

    if (
      window.innerWidth - (shareLink.offsetLeft + shareLink.offsetWidth) <=
      offsetThreshold
    ) {
      setLeftAligned(true);
      setLeftPx(target.offsetLeft - target.offsetWidth - 1); // for the 1px border
    }
    target.nextSibling.classList.remove('vads-u-display--none');
    setFeedbackActive(true);
    setTimeout(() => {
      target.nextSibling.classList.add('vads-u-display--none');
      setFeedbackActive(false);
      setLeftAligned(false);
    }, 1000000);
  };

  return (
    <span aria-live="polite" aria-relevant="additions">
      <i
        aria-label={`Copy ${dataEntityId} sharable link`}
        aria-hidden="true"
        className={`fas fa-link share-link ${
          feedbackActive
            ? `vads-u-background-color--base vads-u-color--white`
            : ''
        }`}
        onClick={event => {
          event.persist();
          setLeftAligned(false);
          if (!event || !event.target) return;
          copyToUsersClipBoard(dataEntityId);
          displayFeedback(event.target);
        }}
      />
      <LinkClickFeedBack
        className={`link-copy-feedback vads-u-display--none vads-u-margin-left--0.5`}
        leftAligned={leftAligned}
        feedbackActive={feedbackActive}
        leftPx={leftPx}
      >
        {copiedText}
      </LinkClickFeedBack>
    </span>
  );
};

export default SharableLink;
