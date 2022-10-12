import React from 'react';

const FrequentlyAskedQuestions = () => {
  return (
    <div className="vads-u-padding-bottom--9">
      <h2 className="vads-u-margin-top--1">Frequently-asked questions</h2>
      <va-accordion open-single>
        <va-accordion-item id="first">
          <h6 slot="headline">
            How can VA secure messaging help me manage my health care?
          </h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="second">
          <h6 slot="headline">Am I set up to use secure messaging?</h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="third">
          <h6 slot="headline">How does secure messaging work?</h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="fourth">
          <h6 slot="headline">
            Can I use secure messaging for medical emergencies or urgent needs?
          </h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="fifth">
          <h6 slot="headline">
            Can I send messaging to providers outside of the VA (community
            care)?
          </h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="sixth">
          <h6 slot="headline">
            Will my personal health information be protected?
          </h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="seventh">
          <h6 slot="headline">
            Are secure messages included in my medical record?
          </h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="eighth">
          <h6 slot="headline">
            Why is the website telling me I'm blocked from sending messages?
          </h6>
          ya-da-ya-da
        </va-accordion-item>
        <va-accordion-item id="ninth">
          <h6 slot="headline">How can I get help?</h6>
          ya-da-ya-da
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export default FrequentlyAskedQuestions;
