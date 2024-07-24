import React from 'react';

const AverageProcessingTime = () => {
  return (
    <va-accordion-item
      level="3"
      open="true"
      header="Average processing times"
      className="hydrated"
    >
      <template shadowrootmode="open">
        <h3>
          <button
            aria-expanded="true"
            aria-controls="content"
            part="accordion-header"
          >
            <span className="header-text">
              <slot name="icon" />
              Average processing times
            </span>
          </button>
        </h3>
        <slot name="headline" />
        <div id="content">
          <slot />
        </div>
      </template>

      <section>
        <ul className="va-nav-linkslist-list social">
          <li className="vads-u-margin-top--0">
            <p className="vads-u-margin--0">First-time applications:</p>
            <h4 className="vads-u-margin--0">24 days</h4>
          </li>
          <li>
            <p className="vads-u-margin--0">Supplemental claims:</p>
            <h4 className="vads-u-margin--0">10 days</h4>
          </li>
          <li>
            Average times for education benefits applications. A supplemental
            claim is a re-enrollment or request for a change that impacts VA
            benefits.
          </li>
          <li>
            See our{' '}
            <a href="https://www.benefits.va.gov/gibill/navigatinggib.asp">
              FAQs
            </a>{' '}
            for more information.
          </li>
          <li>Last updated: October 30, 2019.</li>
        </ul>
      </section>
    </va-accordion-item>
  );
};

export default AverageProcessingTime;
