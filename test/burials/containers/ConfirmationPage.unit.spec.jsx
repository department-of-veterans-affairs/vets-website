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

    expect(tree.subTree('.burial-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Sally Jane Doe');
    expect(tree.subTree('.claim-list').text()).to.include('Burial allowance');
    expect(tree.subTree('.claim-list').text()).to.include('Plot allowance');
    expect(tree.subTree('.claim-list').text()).to.include('Transportation');
    expect(tree.subTree('.claim-list').text()).to.include('Death certificate: 1 file');
    expect(tree.subTree('.claim-list').text()).to.include('Transportation documentation: 2 files');
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
