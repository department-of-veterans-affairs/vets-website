import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import DebtCardsList from './DebtCardsList';
import DebtLettersList from './DebtLettersList';

const DebtLettersSummary = ({ debts, debtLinks }) => (
  <>
    <Breadcrumbs className="vads-u-font-family--sans">
      <a href="/">Home</a>
      <a href="/debt-letters">Manage your VA debt</a>
      <a href="/debt-letters/debt-list">Your VA debt</a>
    </Breadcrumbs>
    <div className="vads-l-row vads-u-margin-x--neg2p5">
      <h1 className="vads-u-padding-x--2p5">Your VA debt</h1>
      <h2 className="vads-u-padding-x--2p5 vads-u-font-size--h4">
        Download your debt letters, learn your payment options, or find out how
        to get help with your VA debts.
      </h2>
      <div className="vads-u-display--flex vads-u-flex-direction--row">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          <DebtCardsList />
          <DebtLettersList />
        </div>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
          <HowDoIPay />
          <NeedHelp />
        </div>
      </div>
    </div>
  </>
);

export default DebtLettersSummary;
