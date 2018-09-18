import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import SupportingDocumentsDescription from '../../components/SupportingDocumentsDescription';

describe('<SupportingDocumentsDescription>', () => {
  test('should render', () => {
    const tree = shallow(
      <SupportingDocumentsDescription/>
    );

    expect(tree.find('AdditionalInfo').length).to.equal(2);
  });
  test('should render service member text', () => {
    const tree = mount(
      <SupportingDocumentsDescription
        formData={{
          application: {
            claimant: {
              relationshipToVet: '1'
            }
          }
        }}/>
    );

    tree.find('button').first().simulate('click');

    expect(tree.find('.additional-info-content').text()).to.contain('your DD214');
  });
  test('should render sponsor text', () => {
    const tree = mount(
      <SupportingDocumentsDescription
        formData={{
          application: {
            claimant: {
              relationshipToVet: '2'
            }
          }
        }}/>
    );

    tree.find('button').first().simulate('click');

    expect(tree.find('.additional-info-content').text()).to.contain('sponsor’s DD214');
  });
  test('should render child text', () => {
    const tree = mount(
      <SupportingDocumentsDescription
        formData={{
          application: {
            claimant: {
              relationshipToVet: '3'
            }
          }
        }}/>
    );

    tree.find('button').first().simulate('click');

    expect(tree.find('.additional-info-content').text()).to.contain('sponsor’s DD214');
    expect(tree.find('.additional-info-content').text()).to.contain('need to provide supporting documents');
  });
});
