import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import RatingsAccordion from '../../../../components/profile/schoolRatings/RatingsAccordion';

describe('<RatingsAccordion />', () => {
  let wrapper;
  let mockRecordEvent;

  beforeEach(() => {
    mockRecordEvent = sinon.spy();
    global.recordEvent = mockRecordEvent;
  });
  afterEach(() => {
    global.innerWidth = window.innerWidth;
  });

  it('should record collapse event when open is true', () => {
    wrapper = shallow(
      <RatingsAccordion
        open
        title="Test Title"
        questionObj={{}}
        openHandler={() => {}}
      />,
    );
    wrapper.find('va-accordion').simulate('click');
    expect(mockRecordEvent.calledWithMatch({ event: 'int-accordion-collapse' }))
      .to.be.false;
    wrapper.unmount();
  });

  it('should record expand event when open is false', () => {
    wrapper = shallow(
      <RatingsAccordion
        open={false}
        title="Test Title"
        questionObj={{}}
        openHandler={() => {}}
      />,
    );
    wrapper.find('va-accordion').simulate('click');
    expect(mockRecordEvent.calledWithMatch({ event: 'int-accordion-expand' }))
      .to.be.false;
    wrapper.unmount();
  });

  it('should render va-accordion-item with subheader when window width is less than or equal to breakPoint', () => {
    global.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    wrapper = shallow(<RatingsAccordion title="Test Title" questionObj={{}} />);
    const accordionItem = wrapper.find('va-accordion-item');
    expect(accordionItem.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render va-accordion-item without subheader when window width is greater than breakPoint', () => {
    global.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
    wrapper = shallow(<RatingsAccordion title="Test Title" questionObj={{}} />);
    const accordionItem = wrapper.find('va-accordion-item');
    expect(accordionItem.exists()).to.be.true;
    expect(accordionItem.prop('subheader')).to.be.undefined;
    wrapper.unmount();
  });
});
