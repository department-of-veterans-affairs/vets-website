import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { clearDraft } from '../../actions/draftDetails';
import EmergencyNote from '../EmergencyNote';
import CannotReplyAlert from '../shared/CannotReplyAlert';
import ReplyDrafts from './ReplyDrafts';
import { updatePageTitle } from '../../util/helpers';
import { PageTitles } from '../../util/constants';

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

  useEffect(
    () => {
      setSubject(replyMessage.subject);
      setCategory(replyMessage.category);
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

  useEffect(() => {
    if (header.current) {
      focusElement(header.current);
    }
  }, []);

  useEffect(
    () => {
      updatePageTitle(
        `${replyMessage.category}: ${replyMessage.subject} ${
          PageTitles.PAGE_TITLE_TAG
        }`,
      );
    },
    [replyMessage],
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
