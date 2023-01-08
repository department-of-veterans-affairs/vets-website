import React from 'react';
import PropTypes from 'prop-types';
import AppointmentRow from './AppointmentRow';
import useHandleClick from '../../hooks/useHandleClick';
import useHandleKeyDown from '../../hooks/useHandleKeyDown';

export default function AppointmentFlexGrid({ children, idClickable, link }) {
  const handleClick = useHandleClick({ link, idClickable });
  const handleKeyDown = useHandleKeyDown({ link, idClickable });

  return (
    <>
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onClick={handleClick()} onKeyDown={handleKeyDown()}>
        <AppointmentRow className="xsmall-screen:vads-u-flex-direction--row">
          {children}
        </AppointmentRow>
      </div>
    </>
  );
}

AppointmentFlexGrid.propTypes = {
  idClickable: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  children: PropTypes.node,
};
