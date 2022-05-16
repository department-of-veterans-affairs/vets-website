import React from 'react';

const Header = () => (
  <header>
    <h1>Messages</h1>
    <h2 className="vads-u-font-size--h3 vads-u-font-weight--normal vads-u-margin-top--0">
      Send and receive messages with your care team at VA.
    </h2>
    <a className="vads-c-action-link--blue" href="/">
      Compose a new message
    </a>
    <a className="vads-u-margin-left--3 vads-c-action-link--blue" href="/">
      Search messages
    </a>
  </header>
);

export default Header;
