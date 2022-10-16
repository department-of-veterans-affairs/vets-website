import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Grid({ children, handleClick, handleKeyDown }) {
  return (
    <>
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={classNames('vads-l-row')}
        onClick={handleClick()}
        onKeyDown={handleKeyDown()}
      >
        {children}
      </div>
    </>
  );
}

Grid.propTypes = {
  children: PropTypes.array,
  handleClick: PropTypes.func,
  handleKeyDown: PropTypes.func,
};
