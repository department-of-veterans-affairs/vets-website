import PropTypes from 'prop-types';
import React from 'react';
import LabelledButton from './LabelledButton';

const HangUpButton = ({ onClick }) => (
  <LabelledButton label="End">
    <svg
      width="78"
      height="79"
      viewBox="0 0 78 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hover:cursor-pointer group"
      onClick={onClick}
    >
      <title>Hang Up</title>
      <rect
        width="76"
        height="76"
        rx="39"
        fill="#FF3B30"
        className="group-hover:hang-up-button-active-bg"
      />
      <path
        d="M37.7577 34.5C34.1635 34.5 30.7851 35.2554 29.1 36.9404C28.3364 37.7041 27.9545 38.6255 28.0043 39.7378C28.0375 40.4102 28.245 41.0078 28.6352 41.3979C28.9257 41.6968 29.3324 41.8628 29.8056 41.7881L32.8852 41.2651C33.35 41.1904 33.6738 41.0493 33.8813 40.8335C34.1552 40.5679 34.2382 40.1694 34.2382 39.6465V38.8081C34.2382 38.6753 34.2963 38.5757 34.3793 38.4927C34.4623 38.3931 34.5868 38.3516 34.6781 38.3267C35.2426 38.1938 36.3881 38.0693 37.7577 38.0693C39.1274 38.0693 40.2646 38.1689 40.8373 38.335C40.9203 38.3599 41.0365 38.4097 41.1279 38.4927C41.2026 38.5757 41.2524 38.667 41.2607 38.7998L41.269 39.6465C41.2773 40.1694 41.3603 40.5679 41.6259 40.8335C41.8417 41.0493 42.1655 41.1904 42.6303 41.2651L45.6684 41.7798C46.1581 41.8628 46.5732 41.6885 46.8969 41.373C47.287 40.9912 47.5029 40.4019 47.5195 39.7295C47.5444 38.6089 47.1127 37.6875 46.3656 36.9404C44.6806 35.2554 41.352 34.5 37.7577 34.5Z"
        fill="white"
      />
    </svg>
  </LabelledButton>
);

HangUpButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default HangUpButton;
