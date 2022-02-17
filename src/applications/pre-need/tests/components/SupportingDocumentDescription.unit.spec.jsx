import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import SupportingDocumentsDescription from '../../components/SupportingDocumentsDescription';

describe('<SupportingDocumentsDescription>', () => {
  it('should render', () => {
    const tree = shallow(<SupportingDocumentsDescription />);

    expect(tree.find('va-additional-info').length).to.equal(2);
    tree.unmount();
  });
  it('should render service member text', () => {
    const tree = mount(
      <SupportingDocumentsDescription
        formData={{
          application: {
            claimant: {
              relationshipToVet: '1',
            },
          },
        }}
      />,
    );

    const info = tree
      .find('va-additional-info')
      .first()
      .html();
    expect(info).to.contain('your DD214');
    tree.unmount();
  });
  it('should render sponsor text', () => {
    const tree = mount(
      <SupportingDocumentsDescription
        formData={{
          application: {
            claimant: {
              relationshipToVet: '2',
            },
          },
        }}
      />,
    );

    const info = tree
      .find('va-additional-info')
      .first()
      .html();
    expect(info).to.contain('sponsor’s DD214');
    tree.unmount();
  });
  it('should render child text', () => {
    const tree = mount(
      <SupportingDocumentsDescription
        formData={{
          application: {
            claimant: {
              relationshipToVet: '3',
            },
          },
        }}
      />,
    );

    const info = tree
      .find('va-additional-info')
      .first()
      .html();
    expect(info).to.contain('sponsor’s DD214');
    expect(info).to.contain('need to provide supporting documents');
    tree.unmount();
  });
});
