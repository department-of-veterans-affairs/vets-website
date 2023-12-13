import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import FormTitle from '../../components/FormTitle';

describe('Find VA Forms <FormTitle />', () => {
  const recordSpy = sinon.spy();

  const props = {
    id: 'VA10192',
    formDetailsUrl:
      'https://www.va.gov/health-care/about-information-for-pre-complaint-processing/',
    title: 'Information for Pre-Complaint Processing',
    language: 'en',
    recordGAEvent: recordSpy,
    formName: 'VA10192',
  };

  it('should expect props', () => {
    const tree = mount(
      <FormTitle
        id={props.id}
        formUrl={props.formDetailsUrl}
        recordGAEvent={props.recordGAEvent}
        lang={props.language}
        title={props.title}
        formName={props.formName}
      />,
    );

    expect(tree.props().id).to.equal(props.id);
    expect(tree.props().formUrl).to.equal(props.formDetailsUrl);
    expect(tree.props().title).to.equal(props.title);
    expect(tree.props().lang).to.equal(props.language);
    expect(tree.props().recordGAEvent).to.equal(props.recordGAEvent);

    tree.unmount();
  });

  it('should render text', () => {
    const tree = mount(
      <FormTitle
        id={props.id}
        formName={props.formName}
        formUrl={props.formDetailsUrl}
        title={props.title}
      />,
    );
    const treeText = tree.text();

    // expecting result node tree text to include the following
    expect(treeText).to.include(props.title);
    expect(treeText).to.include(props.formName);
    tree.unmount();
  });

  it('should render hyperlink', () => {
    const tree = mount(
      <FormTitle
        id={props.id}
        formUrl={props.formDetailsUrl}
        title={props.title}
      />,
    );

    // expect html title node to be the link
    expect(tree.html()).to.include(`href="${props.formDetailsUrl}"`);
    tree.unmount();
  });

  describe('when clicking on the form url', () => {
    it('should record a GA event', () => {
      const tree = mount(
        <FormTitle
          id={props.id}
          formUrl={props.formDetailsUrl}
          title={props.title}
          recordGAEvent={recordSpy}
        />,
      );

      tree.find('a').simulate('click');
      expect(recordSpy.called).to.be.true;

      tree.unmount();
    });
  });
});
