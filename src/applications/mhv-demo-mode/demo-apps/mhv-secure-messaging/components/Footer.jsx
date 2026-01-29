import React from 'react';
import { useSelector } from 'react-redux';
import { smFooter, DefaultFolders } from '../util/constants';

const {
  HAVE_QUESTIONS,
  LEARN_MORE,
  CONTACT_FACILITY,
  FIND_FACILITY,
} = smFooter;

const { INBOX } = DefaultFolders;

const Footer = () => {
  const folderId = useSelector(state => state.sm.folders.folder.folderId);
  return (
    folderId === INBOX.id && (
      <va-need-help data-testid="inbox-footer">
        <div slot="content">
          <p className="vads-u-margin--0">{HAVE_QUESTIONS}</p>
          <p className="vads-u-margin-top--2">
            <a
              href="/health-care/send-receive-messages/"
              data-dd-action-name="Learn more about messages"
            >
              {LEARN_MORE}
            </a>
          </p>
          <p className="vads-u-margin-top--1">{CONTACT_FACILITY}</p>
          <p className="vads-u-margin-top--1">
            <a href="/find-locations" data-dd-action-name={`${FIND_FACILITY}`}>
              {FIND_FACILITY}
            </a>
          </p>
        </div>
      </va-need-help>
    )
  );
};

export default Footer;
