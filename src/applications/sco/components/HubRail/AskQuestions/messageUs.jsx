import React from 'react';
import LiVaLink from '../shared/liVaLink';

const MessageUs = () => {
  return (
    <section>
      <h4>Message us</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaLink
          href="https://ask.va.gov/"
          text="Contact us through Ask VA (AVA)"
        />
        <LiVaLink
          href="https://benefits.va.gov/gibill/docs/ava_external_dashboard_guide.pdf"
          text="Ask VA (AVA) Guide (PDF, 13 pages)"
        />
      </ul>
    </section>
  );
};

export default MessageUs;
