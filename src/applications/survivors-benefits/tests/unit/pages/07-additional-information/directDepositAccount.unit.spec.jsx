import { expect } from 'chai';
import directDepositAccount from '../../../../config/chapters/07-additional-information/directDepositAccount';

describe('Direct deposit account page', () => {
  it('renders the direct deposit account page', async () => {
    const noBankAccount = { hasBankAccount: false };
    const hasBankAccount = { hasBankAccount: true };
    expect(directDepositAccount.depends(hasBankAccount)).to.be.true;
    expect(directDepositAccount.depends(noBankAccount)).to.be.false;
  });
});
