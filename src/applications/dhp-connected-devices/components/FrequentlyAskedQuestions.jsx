import React from 'react';

export const FrequentlyAskedQuestions = () => {
  return (
    <>
      <div className="schemaform-title">
        <h2>Frequently asked questions</h2>
      </div>
      <va-accordion
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <va-accordion-item id="first">
          <h3 slot="headline">Question 1</h3>
        </va-accordion-item>
        <va-accordion-item header="Question 2" id="second" />
        <va-accordion-item header="Question 3" id="third" />
      </va-accordion>
    </>
  );
};
