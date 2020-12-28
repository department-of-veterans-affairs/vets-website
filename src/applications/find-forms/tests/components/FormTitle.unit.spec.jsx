// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Relative imports.
import FormTitle from '../../components/FormTitle';

describe('Find VA Forms <FormTitle />', () => {
  const props = {
    id: 'VA10192',
    formDetailsUrl:
      'https://www.va.gov/health-care/about-information-for-pre-complaint-processing/',
    showFindFormsResultsLinkToFormDetailPages: true, //  TODO: 12/17/20 remove prop once feature is deployed to prod in Jan 12 2020 https://github.com/department-of-veterans-affairs/va.gov-team/issues/16930
    title: 'Information for Pre-Complaint Processing',
  };

  it('should expect props', () => {
    const tree = mount(
      <FormTitle
        id={props.id}
        formUrl={props.formDetailsUrl}
        showFindFormsResultsLinkToFormDetailPages={
          props.showFindFormsResultsLinkToFormDetailPages
        }
        title={props.title}
      />,
    );

    // Props testing
    expect(tree.props().id).to.equal(props.id);
    expect(tree.props().formUrl).to.equal(props.formDetailsUrl);
    expect(tree.props().title).to.equal(props.title);

    tree.unmount();
  });

  it('should render text', () => {
    const tree = mount(
      <FormTitle
        id={props.id}
        formUrl={props.formDetailsUrl}
        title={props.title}
      />,
    );
    const treeText = tree.text();

    // expecting result node tree text to include the following
    expect(treeText).to.include(props.title);
    expect(treeText).to.include(props.id);
    tree.unmount();
  });

  it('should render hyperlink', () => {
    const tree = mount(
      <FormTitle
        id={props.id}
        formUrl={props.formDetailsUrl}
        showFindFormsResultsLinkToFormDetailPages={
          props.showFindFormsResultsLinkToFormDetailPages
        }
        title={props.title}
      />,
    );

    // expect html title node to be the link
    expect(tree.html()).to.include(`href="${props.formDetailsUrl}"`);
    tree.unmount();
  });
});
