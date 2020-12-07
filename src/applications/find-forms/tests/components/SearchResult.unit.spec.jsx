// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Relative imports.
import SearchResult from '../../components/SearchResult';
import FormTitle from '../../components/FormTitle';

describe('Find VA Forms <SearchResult />', () => {
  it('should render', () => {
    const form = {
      id: 'VA10192',
      attributes: {
        formName: 'VA10192',
        formToolUrl:
          'https://www.va.gov/health-care/about-information-for-pre-complaint-processing/',
        lastRevisionOn: '2020-12-22',
        relatedForms: ['10-10d', '10-7959C'],
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
      },
    };

    // full mount since <FormTitle /> is a child to SearchResult
    const tree = mount(<SearchResult form={form} />);

    const treeText = tree.text();

    // does parent contain child?
    expect(
      tree.contains([
        <FormTitle
          key={form.id}
          id={form.id}
          formUrl={form.attributes.form}
          title={form.attributes.title}
        />,
      ]),
    ).to.equal(true);

    // expecting result node tree text to include the following
    [
      'Information for Pre-Complaint Processing',
      'VA10192',
      '12-22-2020',
      'Form last updated',
      '10-10d, 10-7959C',
      'Download VA form VA10192 (PDF)',
      'Related to',
      'Go to online tool',
    ].forEach(text => {
      expect(treeText).to.include(text);
    });

    // expecting html nodes to have the following links
    [
      'href="https://www.va.gov/vaforms/va/pdf/VA10192.pdf"',
      'href="https://www.va.gov/health-care/about-information-for-pre-complaint-processing/"',
    ].forEach(text => expect(tree.html()).to.include(text));

    tree.unmount();
  });
});
