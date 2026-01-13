import React from 'react';

function WhatWeKeep() {
  return (
    <>
      <p className="vads-u-margin-bottom--1">
        <b>We keep only this information when you use our chatbot:</b>
      </p>
      <ul className="vads-u-margin-top--0">
        <li>A record of what you typed</li>
        <li>Your answers to our survey questions</li>
        <li>
          How long you used our chatbot, the links you clicked on, and other
          data
        </li>
      </ul>
    </>
  );
}

function Privacy() {
  return (
    <>
      <p className="vads-u-margin-bottom--1">
        <b>We protect your privacy in these ways:</b>
      </p>
      <ul className="vads-u-margin-top--0">
        <li>
          We don’t collect any information that can be used to identify you.
        </li>
        <li>We don’t use your information to contact you.</li>
        <li>
          We combine your information with others as a summary to study for
          ideas to improve our chatbot tool.
        </li>
        <li>We don’t share any of the information we collect outside of VA.</li>
      </ul>
    </>
  );
}

export default function WhatWeCollect() {
  return (
    <>
      <h4 slot="headline">
        What information we collect when you use the chatbot
      </h4>
      <p>
        We use certain information you’ve provided to build better tools for
        Veterans, service members, and their families.
      </p>
      <WhatWeKeep />
      <Privacy />
      <p>
        <b>Note:</b> You can help us protect your privacy and security by not
        typing any personal information into our chatbot. This includes your
        name, address, or anything else that someone could use to identify you.
      </p>
      <p>
        <a href="/privacy-policy/">
          Learn more about how we collect, store, and use your information
        </a>
      </p>
    </>
  );
}
