import React, { useState } from 'react';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import { createId } from '../utils/helpers';

export default function AccordionItem({
  button,
  children,
  expanded = true,
  headerClass,
  onClick,
  section = false,
}) {
  const id = `${createId(button)}-accordion`;
  const [stateExpanded, setStateExpanded] = useState(expanded || section);
  const displayExpanded = onClick ? expanded : stateExpanded;

  const toggle = () => {
    if (onClick) {
      onClick(!displayExpanded);
    } else {
      setStateExpanded(!displayExpanded);
    }

    const event = !displayExpanded ? 'expand' : 'collapse';
    recordEvent({
      event: `int-accordion-${event}`,
      'accordion-header': button,
    });
  };

  return (
    <li className={section ? 'section-item' : 'accordion-item'} id={id}>
      {section && (
        <button
          id={`${id}-button`}
          aria-expanded={displayExpanded}
          aria-controls={id}
          onClick={toggle}
          className="usa-accordion-button vads-u-margin--0"
          type="button"
        >
          <span className="section-button-span">{button}</span>
        </button>
      )}
      {!section && (
        <h2
          className={classNames('accordion-button-wrapper', {
            [headerClass]: headerClass,
          })}
        >
          <button
            id={`${id}-button`}
            onClick={toggle}
            className="usa-accordion-button"
            aria-expanded={displayExpanded}
            aria-controls={id}
            type="button"
          >
            <span className="vads-u-font-family--sans vads-u-color--gray-dark">
              {button}
            </span>
          </button>
        </h2>
      )}
      <div
        id={`${id}-content`}
        className={section ? 'section-content' : 'usa-accordion-content'}
        aria-hidden={!displayExpanded}
        hidden={!displayExpanded}
      >
        {displayExpanded && children}
      </div>
    </li>
  );
}
