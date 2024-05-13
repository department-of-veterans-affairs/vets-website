import React from 'react';

const AskAQuestion = () => {
  return (
    <va-accordion-item
      level="3"
      open="true"
      header="Ask questions"
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
              Ask questions
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
          <li className="vads-u-margin-bottom--0 vads-u-margin-top--0">
            <h4 className="va-nav-linkslist-list">
              <a
                href="https://ask.va.gov/"
                target="_blank"
                rel="noopener noreferrer"
                id="9e0d7d6cd563e1d6fa201aaabcb3c785"
              >
                <b>Ask a Question (AVA)</b>
              </a>
            </h4>
          </li>
          <li>Ask a question about GI Bill benefits.</li>
        </ul>
      </section>
    </va-accordion-item>
  );
};

export default AskAQuestion;
