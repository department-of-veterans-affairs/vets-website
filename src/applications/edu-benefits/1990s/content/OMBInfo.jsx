import PropTypes from 'prop-types';
import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

class OMBInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modalOpen: false };
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  modalContents = minutes => (
    <div>
      <h3>Privacy Act Statement</h3>
      {minutes && (
        <p>
          <strong>Privacy Act Notice:</strong> This form under §8006 of Public
          Law 117-2 (H.R. 1319) authorizes VA to implement the Veteran Rapid
          Retraining Assistance Program (VRRAP) which provides eligible Veterans
          impacted by the COVID-19 pandemic with the opportunity to pursue a
          covered program of education in a high technology - high demand
          occupation. The responses you submit are considered confidential (38
          U.S.C. 5701). VA may disclose the information that you provide,
          including Social Security numbers (SSN), outside VA if the disclosure
          is authorized under the Privacy Act, including the routine uses
          identified in the VA system of records, 58VA21/22/28, Compensation,
          Pension, Education, and Veteran Readiness and Employment Records - VA,
          published in the Federal Register. The requested information is
          considered relevant and necessary to determine maximum benefits under
          the law. Your obligation to respond is required in order to obtain or
          retain education benefits. Giving us your SSN account information is
          voluntary. Refusal to provide your SSN by itself will not result in
          the denial of benefits. The VA will not deny an individual benefits
          for refusing to provide his or her SSN unless the disclosure of the
          SSN is required by Federal Statute of law enacted before January 1,
          1975 and still in effect. Any information provided by applicants may
          be subject to verification through computer matching programs with
          other agencies.
        </p>
      )}

      <p>
        <strong>Respondent Burden:</strong> We need this information to
        determine your ability to participate in the Veteran Rapid Retraining
        Assistance Program, 38 U.S.C. 3702 (d) and 38 CFR 36.4344. Title 38,
        United States Code, allows us to ask for this information. We estimate
        that you will need an average of {minutes} minutes to review the
        instructions, find the information, and complete this form. VA cannot
        conduct or sponsor a collection of information unless a valid OMB
        control number is displayed. You are not required to respond to a
        collection of information if this number is not displayed. Valid OMB
        control numbers can be located on the OMB Internet Page at{' '}
        <a href="www.reginfo.gov/public/do/PRAMain">
          www.reginfo.gov/public/do/PRAMain
        </a>
        . If desired, you can call{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> to get information on
        where to send comments or suggestions about this form.
      </p>
    </div>
  );

  render() {
    const { resBurden, ombNumber, expDate } = this.props;

    return (
      <div className="omb-info">
        {resBurden && (
          <div>
            Respondent burden: <strong>{resBurden} minutes</strong>
          </div>
        )}

        {ombNumber && (
          <div>
            OMB Control #: <strong>{ombNumber}</strong>
          </div>
        )}

        <div>
          Expiration date: <strong>{expDate}</strong>
        </div>

        <div>
          <button className="va-button-link" onClick={this.openModal}>
            Privacy Act Statement
          </button>
        </div>

        <VaModal
          large
          id="omb-modal"
          visible={this.state.modalOpen}
          onCloseEvent={this.closeModal}
          uswds
        >
          {this.props.children
            ? this.props.children
            : this.modalContents(resBurden)}
        </VaModal>
      </div>
    );
  }
}

OMBInfo.propTypes = {
  /**
   * Form expiration date.
   */ expDate: PropTypes.string.isRequired,
  /**
   * OMB control number / form number
   */ ombNumber: PropTypes.string,
  /**
   * Respondent burden. How many minutes the form is expected to take.
   */ resBurden: PropTypes.number,
};

export default OMBInfo;
