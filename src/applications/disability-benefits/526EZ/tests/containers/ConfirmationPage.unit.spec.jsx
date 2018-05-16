import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import initialData from '../schema/initialData.js';

describe('Disability Benefits 526EZ <ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          attributes: {
            confirmationNumber: 'V-DCCI-3986'
          }
        }
      },
      data: initialData
    };
    const tree = shallow(
      <ConfirmationPage form={form}/>
    );

    expect(tree.find('.confirmation-page-title').render().text()).to.equal('Claim submitted');
    expect(tree.find('span').at(1)
      .render()
      .text()
      .trim()
    ).to.equal('For Sally  Alphonse');
    expect(tree.find('p').at(0).render().text()).to.contain('We usually process claims within 103 days.');
    expect(tree.find('p').at(1).render().text()).to.contain('We may contact you if we have questions or need more information. You can print this page for your records.');
    expect(tree.find('.disability-list').render().text()).to.contain('Post traumatic stress disorder');
  });
});
