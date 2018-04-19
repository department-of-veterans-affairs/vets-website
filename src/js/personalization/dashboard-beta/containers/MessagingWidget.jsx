import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';

import '../../../messaging/sass/messaging.scss';

import SortableTable from '../../../common/components/SortableTable';
import { formattedDate } from '../../../messaging/utils/helpers';


import {
  fetchFolder,
  fetchRecipients,
} from '../../../messaging/actions';

class MessagingWidget extends React.Component {
  componentDidMount() {
    this.props.fetchRecipients();
    this.props.fetchFolder(0, { page: 1, sort: '-sent_date' });
  }

  render() {
    const fields = [
      { label: 'From', value: 'senderName', nonSortable: true },
      { label: 'Subject line', value: 'subject', nonSortable: true },
      { label: '', value: 'hasAttachment', nonSortable: true },
      { label: 'Date', value: 'sentDate', nonSortable: true }
    ];

    const makeMessageLink = (content, id) => {
      return <Link href={`/health-care/messaging/inbox/${id}`}>{content}</Link>;
    };

    let { messages } = this.props;
    const { recipients } = this.props;

    if (recipients && recipients.length === 0) {
      // do not show widget if user is not a VA patient
      return null;
    }

    let content;

    messages = messages.filter(message => {
      return message.readReceipt !== 'READ';
    });

    const data = messages.map(message => {
      const id = message.messageId;
      const rowClass = classNames({
        'messaging-message-row': true
      });

      const attachmentIcon = message.attachment ? (<i className="fa fa-paperclip" aria-label="Message has an attachment"></i>) : null;

      return {
        id,
        rowClass,
        hasAttachment: attachmentIcon,
        recipientName: makeMessageLink(message.recipientName, id),
        senderName: makeMessageLink(message.senderName, id),
        subject: makeMessageLink(message.subject, id),
        sentDate: makeMessageLink(formattedDate(message.sentDate), id)
      };
    });

    if (messages && messages.length > 0) {
      content = (
        <SortableTable
          className="usa-table-borderless va-table-list msg-table-list"
          data={data}
          currentSort={this.props.sort}
          fields={fields}/>
      );
    } else {
      content = <p>You don't have any unread messages from your health care team.</p>;
    }

    return (
      <div>
        <h2>Secure messages</h2>
        {content}
        <p><Link href="/health-care/messaging">View all messages</Link></p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const msgState = state.health.msg;
  const folder = msgState.folders.data.currentItem;

  const { attributes, messages, pagination, sort } = folder;

  return {
    attributes,
    loading: msgState.loading,
    messages,
    recipients: msgState.recipients.data,
    sort,
    pagination,
  };
};

const mapDispatchToProps = {
  fetchFolder,
  fetchRecipients,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingWidget);
export { MessagingWidget };
