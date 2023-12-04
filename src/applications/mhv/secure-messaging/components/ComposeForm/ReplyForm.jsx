import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearDraft } from '../../actions/draftDetails';
import EmergencyNote from '../EmergencyNote';
import CannotReplyAlert from '../shared/CannotReplyAlert';
import ReplyDrafts from './ReplyDrafts';

const ReplyForm = props => {
  const { cannotReply, drafts, header, replyMessage } = props;
  const dispatch = useDispatch();
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);

  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const { replyToName, isSaving } = useSelector(
    state => state.sm.threadDetails,
  );

  useEffect(
    () => {
      // if (replyMessage && !draftToEdit) {
      // setSelectedRecipient(replyMessage.senderId);
      setSubject(replyMessage.subject);
      // setMessageBody('');
      setCategory(replyMessage.category);
      // }
      // if (drafts?.length > 0) {
      //   setDraft(drafts);
      // }
    },
    [replyMessage],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearDraft());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (alertStatus) {
        focusElement(lastFocusableElement);
      }
    },
    [alertStatus],
  );

  const messageTitle = useMemo(
    () => {
      const casedCategory =
        category === 'COVID' ? category : capitalize(category);
      return `${casedCategory}: ${subject}`;
    },
    [category, subject],
  );

  return (
    replyMessage && (
      <>
        <h1 ref={header} className="page-title">
          {messageTitle}
        </h1>
        <CannotReplyAlert visible={cannotReply} />

        <section>
          <h2 className="sr-only">Reply draft edit mode.</h2>
          <form
            className="reply-form vads-u-padding-bottom--2"
            data-testid="reply-form"
            // onSubmit={sendMessageHandler}
          >
            {!cannotReply && <EmergencyNote dropDownFlag />}

            <ReplyDrafts
              drafts={drafts}
              cannotReply={cannotReply}
              isSaving={isSaving}
              replyToName={replyToName}
              replyMessage={replyMessage}
              setLastFocusableElement={setLastFocusableElement}
            />
          </form>
        </section>
      </>
    )
  );
};

ReplyForm.propTypes = {
  cannotReply: PropTypes.bool,
  drafts: PropTypes.array,
  header: PropTypes.object,
  replyMessage: PropTypes.object,
};

export default ReplyForm;
