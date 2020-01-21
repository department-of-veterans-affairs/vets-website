// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
// Relative imports.
import PromoBannerWithAnalytics from '../../components/PromoBanner';

describe('Find VA Forms <PromoBannerWithAnalytics>', () => {
  it('should render', () => {
    const recordEvent = sinon.stub();
    const onClose = sinon.stub();

    const props = {
      type: 'announcement',
      href: 'https://www.va.gov',
      text: 'Some announcement',
    };

    const tree = shallow(
      <PromoBannerWithAnalytics
        {...props}
        onClose={onClose}
        recordEvent={recordEvent}
      />,
    );

    tree
      .find('PromoBanner')
      .props()
      .onClose();

    expect(recordEvent.called).to.be.true;
    expect(onClose.called).to.be.true;

    tree.unmount();
  });
});
