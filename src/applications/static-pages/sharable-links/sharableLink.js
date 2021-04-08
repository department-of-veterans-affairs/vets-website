import React from 'react';

const SharableLink = ({ dataEntityId }) => {
  return (
    <div>
      <i
        aria-hidden="true"
        className="fas fa-link vads-u-color--primary vads-u-margin-left--1 share-link "
        onClick={event => {
          // copy link to users clipboard
          const input = document.createElement('input');

          const copyUrl = window.location.href.replace(
            window.location.hash,
            '',
          );
          input.setAttribute('value', `${copyUrl}#${dataEntityId}`);
          document.body.appendChild(input);
          input.select();
          const result = document.execCommand('copy');
          document.body.removeChild(input);
          // eslint-disable-next-line no-console
          console.log('COPIED THIS TO CLIPBOARD: ', result);
          event.target.nextSibling.classList.remove('vads-u-display--none');
          setTimeout(() => {
            event.target.nextSibling.classList.add('vads-u-display--none');
          }, 5000);
        }}
      />
      <span
        className={`link-copy-feedback vads-u-display--none vads-u-margin-left--1 vads-u-color--primary`}
      >
        {' '}
        Link Copied{' '}
      </span>
    </div>
  );
};

export default SharableLink;
