import React, { useState } from 'react';

const copyToUsersClipBoard = dataEntityId => {
  const input = document.createElement('input');

  const copyUrl = window.location.href.replace(window.location.hash, '');
  input.setAttribute('value', `${copyUrl}#${dataEntityId}`);
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand('copy');
  document.body.removeChild(input);
  // eslint-disable-next-line no-console
  console.log(
    'COPIED THIS TO CLIPBOARD: ',
    result,
    copyUrl,
    dataEntityId,
    input,
  );
};

const SharableLink = ({ dataEntityId }) => {
  const [feedbackActive, setFeedbackActive] = useState(false);
  return (
    <span>
      <i
        aria-hidden="true"
        className={`fas fa-link vads-u-margin-left--1 share-link ${
          feedbackActive
            ? `vads-u-background-color--base vads-u-color--white`
            : ''
        }`}
        onClick={event => {
          event.persist();
          if (!event || !event.target) return;
          copyToUsersClipBoard(dataEntityId);
          event.target.nextSibling.classList.remove('vads-u-display--none');
          setFeedbackActive(true);
          setTimeout(() => {
            event.target.nextSibling.classList.add('vads-u-display--none');
            setFeedbackActive(false);
          }, 500000);
        }}
      />
      <span
        className={`link-copy-feedback vads-u-display--none vads-u-margin-left--0.5`}
      >
        Link Copied
      </span>
    </span>
  );
};

export default SharableLink;
