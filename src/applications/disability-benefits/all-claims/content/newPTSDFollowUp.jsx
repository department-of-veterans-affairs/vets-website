import React from 'react';

export const disabilityNameTitle = (
  <legend className="schemaform-block-title schemaform-title-underline">
    PTSD
  </legend>
);

export const introExplanationText = (
  <div>
    <p>
      As you go through these questions, your responses will be saved. So, if
      you need to take a break and come back to your application, your
      information will be here for you.
    </p>
    <p>
      Keep in mind, if you are in crisis, we can support you. Our Veterans
      Crisis Line is confidential (private), free, and available 24/7. To
      connect with a Veterans Crisis Line responder any time day or night:
    </p>
    <ul>
      <li>
        Call the Veterans Crisis Line at{' '}
        <a href="tel:1-800-273-8255">1-800-273-8255</a> and press 1,{' '}
        <strong>**or**</strong>
      </li>
      <li>
        Visit the{' '}
        <a href="https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Veterans%20Chat/">
          Veterans Crisis Line
        </a>{' '}
        to start a confidential chat online, <strong>**or**</strong>
      </li>
      <li>
        Send a text message to <a href="sms:838255">838255</a>.
      </li>
    </ul>
    <p>Support for the deaf and hearing-impaired is also available.</p>
  </div>
);

export const newPTSDFollowUpDescription = (
  <div>
    <p>
      We‘ll now ask you questions about the stressful event or events related to
      your PTSD. We understand that some of the questions may be difficult to
      answer. The information you provide here will help us understand your
      situation and research your claim.
    </p>
    {introExplanationText}
  </div>
);
