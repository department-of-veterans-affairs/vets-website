// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import SearchResult from '../../components/SearchResult';

describe('Find VA Forms <FindVaForms>', () => {
  it('should render', () => {
    const form = {
      id: 'VA10192',
      attributes: {
        formName: 'VA10192',
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2020-12-22',
      },
    };

    const tree = shallow(<SearchResult form={form} />);

    const treeText = tree.text();

    [
      'Information for Pre-Complaint Processing',
      'VA10192',
      '12-22-2020',
    ].forEach(text => {
      expect(treeText).to.include(text);
    });

    expect(tree.html()).to.include(
      'href="https://www.va.gov/vaforms/va/pdf/VA10192.pdf"',
    );

    tree.unmount();
  });
});
