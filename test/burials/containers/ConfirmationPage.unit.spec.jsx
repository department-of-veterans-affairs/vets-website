import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../src/js/burials/containers/ConfirmationPage';
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
    pages: {
      schema: {
        properties: {
          deathCertificate: {
            items: {
              length: 1
            }
          },
          transportationReceipts: {
            items: {
              length: 2
            }
          }
        }
      }
    }
  },
  submission: {
    submittedAt: Date.now(),
    response: {
      attributes: {
        confirmationNumber: 'V-EBC-177',
        regionalOffice: <div><p>Western Region</p><p>VA Regional Office</p><p>P.O. Box 8888</p><p>Muskogee, OK 74402-8888</p></div>
      }
    }
  }
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.burial-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Sally Jane Doe');
  });
});
