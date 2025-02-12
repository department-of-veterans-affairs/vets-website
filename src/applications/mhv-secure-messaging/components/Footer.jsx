import React from 'react';
import HorizontalRule from './shared/HorizontalRule';
import { smFooter } from '../util/constants';

const {
  NEED_HELP,
  HAVE_QUESTIONS,
  LEARN_MORE,
  CONTACT_FACILITY,
  FIND_FACILITY,
} = smFooter;

const Footer = () => {
  return (
    <footer
      className="vads-u-padding-top--3 vads-u-padding-bottom--3"
      data-testid="inbox-footer"
    >
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--12">
            <p className="vads-u-margin--0 vads-u-font-size--lg vads-u-font-family--serif vads-u-font-weight--bold">
              {NEED_HELP}
            </p>
            <HorizontalRule />
            <p className="vads-u-margin--0">{HAVE_QUESTIONS}</p>
            <p className="vads-u-margin-top--2">
              <a href="/health-care/secure-messaging">{LEARN_MORE}</a>
            </p>
            <p className="vads-u-margin-top--1">{CONTACT_FACILITY}</p>
            <p className="vads-u-margin-top--1">
              <a href="/find-locations">{FIND_FACILITY}</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
