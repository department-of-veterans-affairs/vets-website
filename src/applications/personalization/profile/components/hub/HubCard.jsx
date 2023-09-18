import classNames from 'classnames';
import React from 'react';

export const HubCard = ({ heading, content, Links, className }) => {
  const classes = classNames('vads-l-col--6', className);
  return (
    <div className={classes}>
      <va-card>
        <div>
          <h3 className="vads-u-margin--0">{heading}</h3>
          <p>{content}</p>
          {Links && Links()}
        </div>
      </va-card>
    </div>
  );
};
