import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

export default function AdditionalInfoRow({
  onClick,
  id,
  triggerText,
  open,
  children,
}) {
  return (
    <>
      <button
        className="va-button-link additional-info-button vads-u-margin-right--4"
        aria-expanded={open ? 'true' : 'false'}
        id={`${id}-vaos-info-expand`}
        aria-controls={`${id}-vaos-info-content`}
        onClick={onClick}
      >
        <span className="additional-info-title">{triggerText}</span>
        <i className={`fas fa-angle-down ${open ? 'open' : ''}`} />
      </button>
      <ReactCSSTransitionGroup
        id={`${id}-vaos-info-content`}
        className={`vads-u-flex--1 vads-u-order--last vads-u-margin-top--2`}
        transitionName="form-expanding-group-inner"
        transitionEnterTimeout={700}
        transitionLeave={false}
      >
        {open ? children : null}
      </ReactCSSTransitionGroup>
    </>
  );
}
