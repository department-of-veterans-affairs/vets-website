import React from 'react';
import PropTypes from 'prop-types';

const HubCard = ({ title, body }) => (
  <div className=" vads-u-margin-bottom--2">
    <va-card>
      <div>
        <h3 className="vads-u-margin-top--1">{title}</h3>
        <va-link-action
          href="https://va.gov/vso/"
          text="Call to action"
          type="secondary"
        />
        <p>{body}</p>
      </div>
    </va-card>
  </div>
);

HubCard.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default HubCard;
