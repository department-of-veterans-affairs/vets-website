import React from 'react';
import PropTypes from 'prop-types';

const HubCard = ({ title, body, icon }) => (
  <div className="hub-card vads-u-margin-bottom--2">
    <va-card icon-name={icon} style={{ minHeight: '280px' }}>
      <div>
        <h3 className="vads-u-margin-top--1">{title}</h3>
        <p>{body}</p>
        <va-link-action
          href="https://va.gov/vso/"
          text="Call to action"
          type="secondary"
        />
      </div>
    </va-card>
  </div>
);

HubCard.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default HubCard;
