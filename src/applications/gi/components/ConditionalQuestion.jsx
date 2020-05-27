import React from 'react';
import classNames from 'classnames';

export const ConditionalQuestion = ({ visible = true, children }) =>
  visible && (
    <div
      className={classNames(
        'vads-u-margin-left--neg2p5',
        'vads-u-padding-left--1p5',
        'vads-u-border-left--7px',
        'vads-u-border-color--primary-alt-light',
      )}
    >
      {children}
    </div>
  );

export default ConditionalQuestion;
