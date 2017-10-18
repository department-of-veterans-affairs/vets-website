import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../src/js/burials/containers/ConfirmationPage';

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      data: {
        claimantFullName: {
          first: 'Sally',
          middle: 'Jane',
          last: 'Doe'
        },
        veteranFullName: {
          first: 'Josie',
          middle: 'Henrietta',
          last: 'Smith'
        },
        'view:claimedBenefits': {
          burialAllowance: true,
          plotAllowance: true,
          transportation: true
        },
        deathCertificate: {
          length: 1
        },
        transportationReceipts: {
          length: 2
        }
      },
      submission: {
        submittedAt: Date.now(),
        response: {
          attributes: {
            confirmationNumber: 'V-EBC-177',
            regionalOffice: [
              'Western Region',
              'VA Regional Office',
              'P.O. Box 8888',
              'Muskogee, OK 74402-8888'
            ]
          }
        }
      }
    };

    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.confirmation-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Sally Jane Doe');
    expect(tree.subTree('.claim-list').text()).to.include('Burial allowance');
    expect(tree.subTree('.claim-list').text()).to.include('Plot allowance');
    expect(tree.subTree('.claim-list').text()).to.include('Transportation');
    expect(tree.subTree('.claim-list').text()).to.include('Death certificate: 1 file');
    expect(tree.subTree('.claim-list').text()).to.include('Transportation documentation: 2 files');
    expect(tree.everySubTree('p')[0].text()).to.contain('We process claims in the order we receive them');
    expect(tree.everySubTree('p')[1].text()).to.contain('We may contact you for more information or documents.Please print this page for your records');
    expect(tree.everySubTree('p')[8].text()).to.contain('VA Regional Office');
    expect(tree.subTree('.confirmation-guidance-message').text()).to.contain('If you have questions, call 1-800-827-1000, Monday - Friday, 8:00 a.m. - 9:00 p.m. (ET). Please have your Social Security number or VA file number ready. For Telecommunication Relay Services, dial 711.');
  });
  it('should render', () => {
    const form = {
      data: {
        claimantFullName: {
          first: 'Sally',
          middle: 'Jane',
          last: 'Doe'
        },
        veteranFullName: {
          first: 'Josie',
          middle: 'Henrietta',
          last: 'Smith'
        },
        'view:claimedBenefits': {
          burialAllowance: true,
          plotAllowance: true,
          transportation: true
        }
      },
      submission: {
        submittedAt: Date.now(),
        response: {
          attributes: {
            confirmationNumber: 'V-EBC-177',
            regionalOffice: [
              'Western Region',
              'VA Regional Office',
              'P.O. Box 8888',
              'Muskogee, OK 74402-8888'
            ]
          }
        }
      }
    };

    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.claim-list').text()).to.not.include('Documents Uploaded');
  });
});
