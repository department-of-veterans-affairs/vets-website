import PropTypes from 'prop-types';
import React from 'react';
import LabelledButton from './LabelledButton';

const CallButton = ({ onClick }) => (
  <LabelledButton label="Call">
    <svg
      width="78"
      height="79"
      viewBox="0 0 78 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hover:cursor-pointer group"
      onClick={onClick}
    >
      <title>Call</title>
      <rect
        width="78"
        height="78"
        rx="39"
        fill="#34C759"
        className="group-hover:call-button-active-bg"
      />
      <path
        d="M32.2485 45.6655C27.5918 41.0249 24.063 35.4175 24.063 30.793C24.063 28.7466 24.7559 26.8936 26.3188 25.395C27.2695 24.4766 28.3652 23.9932 29.4287 23.9932C30.2988 23.9932 31.0884 24.3315 31.6523 25.105L35.1167 29.9873C35.6484 30.7446 35.9224 31.373 35.9224 31.9531C35.9224 32.6943 35.4873 33.3389 34.7783 34.0801L33.6343 35.2563C33.457 35.4336 33.3926 35.6431 33.3926 35.8525C33.3926 36.0942 33.4893 36.3198 33.5698 36.4971C34.0854 37.4961 35.5518 39.2041 37.1309 40.7832C38.7261 42.3623 40.4341 43.8286 41.4331 44.3604C41.5942 44.4409 41.8359 44.5376 42.0776 44.5376C42.2871 44.5376 42.5127 44.457 42.6899 44.2798L43.834 43.1519C44.5752 42.4268 45.2358 42.0078 45.9609 42.0078C46.541 42.0078 47.1694 42.2656 47.9268 42.7812L52.8735 46.2939C53.6309 46.8418 53.937 47.6152 53.937 48.4209C53.937 49.5166 53.4053 50.6284 52.5513 51.5791C51.085 53.1904 49.2642 53.9155 47.1855 53.9155C42.561 53.9155 36.9053 50.3223 32.2485 45.6655Z"
        fill="white"
      />
    </svg>
  </LabelledButton>
);

CallButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CallButton;
