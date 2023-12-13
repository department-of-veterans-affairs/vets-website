import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import EmergencyNote from '../EmergencyNote';
import CannotReplyAlert from '../shared/CannotReplyAlert';
import ReplyDrafts from './ReplyDrafts';
import { updatePageTitle } from '../../util/helpers';
import { PageTitles } from '../../util/constants';
import { clearThread } from '../../actions/threadDetails';

const ReplyForm = props => {
  const { cannotReply, drafts, replyMessage } = props;
  const dispatch = useDispatch();
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const header = useRef();

  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const { replyToName, isSaving } = useSelector(
    state => state.sm.threadDetails,
  );
  const signature = useSelector(state => state.sm.preferences.signature);

  useEffect(
    () => {
      setSubject(replyMessage.subject);
      setCategory(replyMessage.category);
      updatePageTitle(
        `${replyMessage.category}: ${replyMessage.subject} ${
          PageTitles.PAGE_TITLE_TAG
        }`,
      );
    },
    [replyMessage],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearThread());
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

  useEffect(() => {
    if (header.current) {
      focusElement(header.current);
    }
  }, []);

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
          <form
            className="reply-form vads-u-padding-bottom--2"
            data-testid="reply-form"
          >
            {!cannotReply && <EmergencyNote dropDownFlag />}

            <ReplyDrafts
              drafts={drafts}
              cannotReply={cannotReply}
              isSaving={isSaving}
              replyToName={replyToName}
              replyMessage={replyMessage}
              setLastFocusableElement={setLastFocusableElement}
              signature={signature}
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
