import React from 'react';
import { connect } from 'react-redux';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import environment from 'platform/utilities/environment';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import moment from 'moment';

const DebtLettersList = ({ debtLinks }) => (
  <>
    <Breadcrumbs className="vads-u-font-family--sans">
      <a href="/">Home</a>
      <a href="/debt-letters">Manage your VA debt</a>
      <a href="/debt-letters/debt-list">Your VA debt</a>
    </Breadcrumbs>
    <div className="vads-l-row vads-u-margin-x--neg2p5">
      <h1 className="vads-u-padding-x--2p5">View debt letters</h1>
      <div className="vads-u-display--flex vads-u-flex-direction--row">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          <p className="vads-u-font-size--h3 vads-u-margin-y--0">
            See your debt letters history and download individual letters, and
            find out how to resolve your debt.
          </p>
          {debtLinks.length > 0 && (
            <div className="vads-l-row">
              <table className="vads-u-font-family--sans vads-u-margin-y--5">
                <thead>
                  <tr>
                    <th className="vads-u-border--0">Date</th>
                    <th className="vads-u-border--0">Type</th>
                    <th className="vads-u-border--0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {debtLinks.map(debtLetter => (
                    <tr
                      key={debtLetter.documentId}
                      className="vads-u-border-top--1px vads-u-border-bottom--1px"
                    >
                      <td className="vads-u-border--0">
                        {moment(debtLetter.receivedAt).format('MMM D, YYYY')}
                      </td>
                      <td className="vads-u-border--0">
                        {debtLetter.typeDescription}
                      </td>
                      <td className="vads-u-border--0">
                        <a
                          href={encodeURI(
                            `${environment.API_URL}/v0/debt_letters/${
                              debtLetter.documentId
                            }`,
                          )}
                        >
                          Download Letter
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="vads-u-margin-top--0 vads-u-font-size--h4">
                What if I don't see the letter I'm looking for?
              </h2>
              <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
                if you have been notified of a debt and don't see the debt's
                letter on this page, or you would like to get information about
                your debts that have been resolved, call the Debt Management
                Center at{' '}
                <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
                  800-827-0648
                </a>
              </p>
              <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
                For medical copayment debts, visit{' '}
                <a href="/health-care/pay-copay-bill/">
                  Pay your VA copay bill
                </a>{' '}
                to learn about your payment options.
              </p>
            </div>
          )}
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
  debtLinks: state.debtLetters.debtLinks,
});

export default connect(mapStateToProps)(DebtLettersList);
