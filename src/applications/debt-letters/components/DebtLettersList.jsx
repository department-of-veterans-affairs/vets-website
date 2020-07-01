import React from 'react';
import DebtLetterCard from './DebtLetterCard';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';

const DebtLettersList = ({ debts }) => (
  <>
    <Breadcrumbs>
      <a href="/">Home</a>
      <a href="/debt-letters">Manage your VA debt</a>
      <a href="/debt-letters/debt-list">Your VA debt</a>
    </Breadcrumbs>
    <div className="vads-l-row vads-u-margin-x--neg2p5">
      <h1 className="vads-u-padding-x--2p5">Your VA debt</h1>
      <div className="vads-u-display--flex vads-u-flex-direction--row">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          <p className="vads-u-font-size--h3 vads-u-margin-top--0">
            Check the details of your VA debts and find out the next stops to
            resolving your debt.
          </p>
          <p className="vads-u-font-size--h2 vads-u-font-weight--bold">
            Current debts
          </p>
          {debts.length > 0 &&
            debts.map((debt, index) => (
              <DebtLetterCard key={`${index}-${debt.fileNumber}`} debt={debt} />
            ))}
          <h2 className="vads-u-font-size--h3">What if I don't see a debt?</h2>
          <p className="vads-u-margin-bottom--0">
            If you have been notified of a debt that you do not see on this page
            or would like to get information about your debts that have been
            resolved, call the Debt Management Center at
          </p>
          <p className="vads-u-margin-top--0">
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648.
            </a>
          </p>
        </div>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
          <HowDoIPay />
          <NeedHelp />
        </div>
      </div>
    </div>
  </>
);

const mapStateToProps = state => ({
  debts: state.debtLetters.debts,
});

export default connect(mapStateToProps)(DebtLettersList);
