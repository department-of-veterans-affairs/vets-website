import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import moment from 'moment';

import MessageDetails from '../../../src/js/messaging/components/MessageDetails';

const props = {
  attrs: {
    messageId: 123,
    category: 'APPOINTMENTS',
    subject: 'Scheduling An Appointment',
    sentDate: '2016-12-21T05:54:26.000Z',
    senderName: 'Clinician',
    recipientName: 'Veteran'
  },
};

describe('MessageDetails', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<MessageDetails {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should display the correct data', () => {
    const tree = SkinDeep.shallowRender(<MessageDetails {...props}/>);

    const rows = tree.dive(['.messaging-message-details', 'table', 'tbody']).everySubTree('tr');

    expect(rows[0].dive(['td']).text()).to.equal(props.attrs.senderName);
    expect(rows[1].dive(['td']).text()).to.equal(props.attrs.recipientName);

    const expectedDate = `${moment(props.attrs.sentDate).format('ddd, MMM D, YYYY [at] HH:mm')} EST`;
    expect(rows[2].dive(['td']).text()).to.equal(expectedDate);

    expect(rows[3].dive(['td']).text()).to.equal(`${props.attrs.messageId}`);
    expect(rows[4].dive(['td']).text()).to.equal(props.attrs.category);
    expect(rows[5].dive(['td']).text()).to.equal(props.attrs.subject);
  });

  it('should not show anything with sent date when not available', () => {
    const tree = SkinDeep.shallowRender(
      <MessageDetails {...props} attrs={{ ...props.attrs, sentDate: null }}/>
    );

    const rows = tree.dive(['.messaging-message-details', 'table', 'tbody']).everySubTree('tr');

    expect(rows).to.have.length(5);

    expect(rows[0].dive(['th']).text()).to.equal('From:');
    expect(rows[1].dive(['th']).text()).to.equal('To:');
    expect(rows[2].dive(['th']).text()).to.equal('Message ID:');
    expect(rows[3].dive(['th']).text()).to.equal('Category:');
    expect(rows[4].dive(['th']).text()).to.equal('Subject Line:');
  });
});
