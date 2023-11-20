import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import CautionFlagAdditionalInfo from '../../components/CautionFlagAdditionalInfo';

describe('<CautionFlagAdditionalInfo>', () => {
  it('should render', () => {
    const tree = shallow(<CautionFlagAdditionalInfo />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should render flags', () => {
    const tree = shallow(
      <CautionFlagAdditionalInfo cautionFlags={[{ title: 'TEST' }]} expanded />,
    );
    expect(tree.find('.headingFlag').length).to.eq(1);
    tree.unmount();
  });

  it('should call toggleExpansionMock function on button click', () => {
    const toggleExpansionMock = sinon.spy();
    const recordEventMock = sinon.spy();

    const wrapper = shallow(
      <CautionFlagAdditionalInfo
        validFlags={['warning1']}
        cautionFlags={[{ title: 'TEST' }]}
        expanded
        toggleExpansion={toggleExpansionMock}
        recordEvent={recordEventMock}
      />,
    );
    const btn = wrapper.find('button');
    expect(btn.text()).to.equal('This school has 1 cautionary warning');
    btn.simulate('click');
    expect(toggleExpansionMock.calledWith(false)).to.be.true;

    expect(
      recordEventMock.calledWith({
        event: 'int-additional-info-collapse',
        'additionalInfo-click-label': 'TestHeadline',
      }),
    ).to.be.false;
    wrapper.unmount();
  });

  it('should sort by title', () => {
    const wrapper = shallow(
      <CautionFlagAdditionalInfo
        cautionFlags={[{ title: 'TEST' }, { title: 'some text' }]}
        expanded
      />,
    );
    expect(
      wrapper
        .find('.headingFlag')
        .first()
        .text(),
    ).to.equal('some text');
    expect(
      wrapper
        .find('.headingFlag')
        .last()
        .text(),
    ).to.equal('TEST');
    wrapper.unmount();
  });

  it('should record "collapse" event when expanded is true', () => {
    const recordEventMock = sinon.spy();
    const toggleExpansionMock = sinon.spy();
    const wrapper = shallow(
      <CautionFlagAdditionalInfo
        expanded={false}
        toggleExpansion={toggleExpansionMock}
        recordEvent={recordEventMock}
        cautionFlags={[{ title: 'TEST' }]}
        headline="Headline"
      />,
    );
    const btn = wrapper.find('button');
    btn.simulate('click');
    expect(
      recordEventMock.calledWith(
        sinon.match.has('event', 'int-additional-info-expand'),
      ),
    ).to.be.false;

    wrapper.unmount();
  });
});
