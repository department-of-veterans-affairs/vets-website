import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';

import SortableTable from '../../../common/components/SortableTable';
import { formattedDate } from '../../../messaging/utils/helpers';

import { fetchFolder } from '../../../messaging/actions';

class MessagingWidget extends React.Component {
  componentDidMount() {
    this.props.fetchFolder(0, { page: 1, sort: '-sent_date' });
  }

  render() {
    const fields = [
      { label: 'From', value: 'senderName' },
      { label: 'Subject line', value: 'subject' },
      { label: '', value: 'hasAttachment', nonSortable: true },
      { label: 'Date', value: 'sentDate' }
    ];

    const makeMessageLink = (content, id) => {
      return <Link to={`/${this.props.params.folderName}/${id}`}>{content}</Link>;
    };

    const { messages } = this.props;

    const data = messages.map(message => {
      const id = message.messageId;
      const rowClass = classNames({
        'messaging-message-row': true,
        'messaging-message-row--unread':
          message.readReceipt !== 'READ'
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

    return (
      <div>
        <h2>Secure messages</h2>

        <SortableTable
          className="usa-table-borderless va-table-list msg-table-list"
          currentSort={this.props.sort}
          data={data}
          fields={fields}
          onSort={this.handleSort}/>
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
    sort,
    pagination,
  };
};

const mapDispatchToProps = {
  fetchFolder,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingWidget);
export { MessagingWidget };
