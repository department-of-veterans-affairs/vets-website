import React from 'react';
import PropTypes from 'prop-types';

export const RefillNotificationCard = ({
  config,
  children,
  additionalProps = {},
}) => {
  return (
    <va-alert
      id={config.id}
      data-testid={config.testId}
      status={config.status}
      setFocus
      uswds
      class={config.className}
      {...additionalProps}
    >
      <h2
        className="vads-u-margin-y--0 vads-u-font-size--h3"
        data-testid={`${config.testId}-title`}
      >
        {config.title}
      </h2>
      {children}
    </va-alert>
  );
};

RefillNotificationCard.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.object.isRequired,
  additionalProps: PropTypes.object,
};
