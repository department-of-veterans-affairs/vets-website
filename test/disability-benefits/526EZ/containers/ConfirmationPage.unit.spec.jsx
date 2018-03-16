import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../../../src/js/disability-benefits/526EZ/containers/ConfirmationPage';

describe('Disability Benefits 526EZ <ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          attributes: {
            confirmationNumber: 'V-PEN-177',
            regionalOffice: [
              'Attention: Western Region',
              'VA Regional Office',
              'P.O. Box 8888',
              'Muskogee, OK 74402-8888'
            ]
          }
        }
      },
      data: {
        relativeFullName: {
          first: 'Jane',
          last: 'Doe'
        }
      }
    };

    const tree = shallow(
      <ConfirmationPage form={form}/>
    );

    expect(tree.find('.confirmation-page-title').text()).to.equal('Claim received');
    expect(tree.find('span').at(1).text().trim()).to.equal('for Jane  Doe');
    expect(tree.find('p').at(0).text()).to.contain('We usually process claims within 30 days.');
    expect(tree.find('p').at(1).text()).to.contain('We may contact you for more information or documents.Please print this page for your records');
    expect(tree.find('address').at(0).text()).to.contain('Western RegionVA Regional Office');
  });
});
