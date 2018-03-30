import React from 'react';

function AccordionTab({ id: accordionId, activeAccordionId, onClick, title, children }) {
  return (
    <li>
      <div className="accordion-header">
        <button className="usa-accordion-button usa-button-unstyled"
          onClick={() => onClick(accordionId)}
          aria-expanded={activeAccordionId === accordionId}
          aria-controls={accordionId}>
          {title}
        </button>
      </div>
      <div className="usa-accordion-content"
        id={accordionId}
        aria-hidden={activeAccordionId !== accordionId}>
        {children}
      </div>
    </li>
  );
}

function Accordion({ children }) {
  return (
    <ul className="usa-accordion usa-accordion-bordered form-review-panel">{ children }</ul>
  );
}

export default Accordion;
export { AccordionTab };
