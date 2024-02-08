import React, { useState } from 'react';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import { createId } from '../utils/helpers';

export default function AccordionItem({
  button,
  children,
  expanded = true,
  headerClass,
  onClick,
  section = false,
  expandedWidth = false,
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

  const expandedSectionClass = section
    ? 'section-content'
    : 'usa-accordion-content';

  return (
    <li className={section ? 'section-item' : 'accordion-item'} id={id}>
      {section && (
        <button
          id={`${id}-button`}
          aria-expanded={displayExpanded}
          aria-controls={id}
          onClick={toggle}
          className="usa-accordion-button vads-u-margin--0"
        >
          {environment.isProduction() ? (
            <span className="section-button-span">{button}</span>
          ) : (
            <h2 className="section-button-span">{button}</h2>
          )}
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
          >
            <span className="vads-u-font-family--sans vads-u-color--gray-dark">
              {button}
            </span>
          </button>
        </h2>
      )}
      <div
        id={`${id}-content`}
        className={
          expandedWidth
            ? 'section-content-expanded-width'
            : expandedSectionClass
        }
        aria-hidden={!displayExpanded}
        hidden={!displayExpanded}
      >
        {displayExpanded && children}
      </div>
    </li>
  );
}
