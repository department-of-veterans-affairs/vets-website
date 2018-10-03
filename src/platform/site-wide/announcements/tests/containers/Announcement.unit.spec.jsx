import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Announcement } from '../../containers/Announcement';

describe('<Announcement/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      isInitialized: true,
      announcement: null,
      isLoggedIn: true,
      profile: {},
      dismissed: [],
      initDismissedAnnouncements() {},
      dismissAnnouncement() {},
    };
  });

  it('calls the init action when isInitialized is false', () => {
    props.isInitialized = false;
    props.initDismissedAnnouncements = sinon.stub();
    enzyme.shallow(<Announcement {...props} />);
    expect(props.initDismissedAnnouncements.called).to.be.true;
  });

  it('renders an empty div when there is no announcement', () => {
    const wrapper = enzyme.shallow(<Announcement {...props} />);
    expect(wrapper.html()).to.be.equal('<div></div>');
  });

  it('renders a child announcement component when there is an announcement prop', () => {
    props.announcement = {
      name: 'dummy',
      component: ({ announcement }) => <span>{announcement.name}</span>,
    };
    const wrapper = enzyme.shallow(<Announcement {...props} />);
    expect(wrapper.html()).to.be.equal('<span>dummy</span>');
  });

  it('can dismiss announcements and any related announcements using a dismiss prop', () => {
    props.dismissAnnouncement = sinon.stub();
    props.announcement = {
      name: 'dummy',
      relatedAnnouncements: ['dummy2', 'dummy3'],
      component: ({ announcement, dismiss }) => (
        <button type="button" onClick={dismiss}>
          {announcement.name}
        </button>
      ),
    };

    const wrapper = enzyme.shallow(<Announcement {...props} />);
    const button = wrapper.find('component').dive();

    button.simulate('click');

    expect(button.text()).to.be.equal('dummy');
    expect(props.dismissAnnouncement.callCount).to.be.equal(3);
    expect(props.dismissAnnouncement.getCall(0).args[0]).to.be.equal('dummy');
    expect(props.dismissAnnouncement.getCall(1).args[0]).to.be.equal('dummy2');
    expect(props.dismissAnnouncement.getCall(2).args[0]).to.be.equal('dummy3');
  });
});
