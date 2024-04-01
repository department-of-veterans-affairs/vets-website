import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import WhatsNext from '../../../components/appeals-v2/WhatsNext';

describe('<WhatsNext/>', () => {
  const defaultProps = {
    nextEvents: {
      header: '',
      events: [],
    },
  };

  const eventsList = [
    {
      title: 'Additional evidence',
      description: <p>Some description goes here</p>,
    },
    {
      title: 'Appeal certified to the Board',
      description: <p>Another description goes here</p>,
    },
  ];

  it('renders', () => {
    const wrapper = shallow(<WhatsNext {...defaultProps} />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('renders a header title', () => {
    const testHeaderText = 'Test Header';
    const props = {
      ...defaultProps,
      nextEvents: {
        ...defaultProps.nextEvents,
        header: testHeaderText,
      },
    };
    const wrapper = shallow(<WhatsNext {...props} />);
    const headerText = wrapper
      .find('h2 + p')
      .render()
      .text();
    expect(headerText).to.equal(testHeaderText);
    wrapper.unmount();
  });

  it('renders a list of all next events for a given currentStatus', () => {
    const props = {
      ...defaultProps,
      nextEvents: {
        ...defaultProps.nextEvents,
        events: eventsList,
      },
    };

    const wrapper = shallow(<WhatsNext {...props} />);
    const nextEventList = wrapper.find('NextEvent');
    expect(nextEventList.length).to.equal(eventsList.length);
    wrapper.unmount();
  });
});
