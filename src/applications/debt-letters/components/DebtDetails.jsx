import React from 'react';
import PropTypes from 'prop-types';
import reverse from 'lodash/reverse';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { deductionCodes } from '../const';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import moment from 'moment';
import last from 'lodash/last';
import first from 'lodash/first';

const DebtDetails = ({ selectedDebt }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/debt-letters">Manage your VA debt</a>
        <a href="/debt-letters/debt-list">Your VA debt</a>
      </Breadcrumbs>
      <h1 className="vads-u-font-family--serif">
        Your {deductionCodes[selectedDebt.deductionCode]} debt
      </h1>
      <div className="vads-l-row">
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-right--2p5 vads-l-col--12 medium-screen:vads-l-col--8 vads-u-font-family--sans">
          <p className="vads-u-font-size--h3 vads-u-font-family--serif">
            Updated on{' '}
            {moment(last(selectedDebt.debtHistory).date).format('MMMM D, YYYY')}
          </p>

          <p className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Date of first notice:
          </p>
          <p className="vads-u-margin-top--0">
            {moment(first(selectedDebt.debtHistory).date).format(
              'MMMM D, YYYY',
            )}
          </p>
          <p className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Original debt amount:
          </p>
          <p className="vads-u-margin-top--0">
            {' '}
            {formatter.format(parseFloat(selectedDebt.originalAR))}
          </p>
          <p className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Current balance:
          </p>
          <p className="vads-u-margin-top--0">
            {' '}
            {formatter.format(parseFloat(selectedDebt.currentAR))}
          </p>
          <AdditionalInfo triggerText="Why might I have this debt?">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
            excepturi fugit non sunt. Asperiores autem error ipsam magnam minus
            modi nam obcaecati quasi, ratione rem repellendus reprehenderit ut
            veritatis vitae.
          </AdditionalInfo>

          <AlertBox
            className="vads-u-margin-y--2"
            headline="Informational backgroundOnly alert"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id felis pulvinar ligula ultricies sollicitudin eget nec dui. Cras augue velit, pellentesque sit amet nisl ut, tristique suscipit sem. Cras sollicitudin auctor mattis."
            status="info"
            backgroundOnly
          />

          <h2 className="vads-u-font-size--h3">Debt history</h2>
          <p>You can view the status or download the letters for this debt.</p>
          <p>
            <strong>Note:</strong> The content of the debt letters below may not
            include recent updates to your debt reflected above. If you have any
            questions about your debt history, please contact the Debt
            Management Center at{' '}
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648
            </a>
            {'.'}
          </p>
          {reverse(selectedDebt.debtHistory).map((debtEntry, index) => (
            <div
              className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-y--1p5 vads-u-border-bottom--3px vads-u-border-color--gray-lightest"
              key={`${debtEntry.letterCode}-${index}`}
            >
              <h3>{moment(debtEntry.date).format('MMMM D, YYYY')}</h3>
              <p className="vads-u-font-weight--bold vads-u-margin-y--0">
                {debtEntry.status}
              </p>
              <p>{debtEntry.description}</p>
              {/* ToDo: Add link to actual debt letter download in VBMS */}
              <a className="vads-u-margin-bottom--1" href="#">
                Download and print the letter
              </a>
            </div>
          ))}
        </div>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
          <HowDoIPay />
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters?.selectedDebt,
});

DebtDetails.propTypes = {
  selectedDebt: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DebtDetails);
