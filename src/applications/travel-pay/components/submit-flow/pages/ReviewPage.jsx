import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
import { selectVAPResidentialAddress } from 'platform/user/selectors';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { formatDateTime } from '../../../util/dates';
import TravelAgreementContent from '../../TravelAgreementContent';
import { selectAppointment } from '../../../redux/selectors';
import {
  recordSmocButtonClick,
  recordSmocPageview,
} from '../../../util/events-helpers';

const title = 'Review your travel claim';

const ReviewPage = ({
  address,
  isError,
  onSubmit,
  setPageIndex,
  setYesNo,
  isAgreementChecked,
  setIsAgreementChecked,
}) => {
  useEffect(() => {
    recordSmocPageview('review');
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  useSetPageTitle(title);

  const { data } = useSelector(selectAppointment);

  const [formattedDate, formattedTime] = formatDateTime(data.localStartTime);

  const onBack = () => {
    recordSmocButtonClick('review', 'start-over');
    setYesNo({
      mileage: '',
      vehicle: '',
      address: '',
    });
    setPageIndex(1);
  };

  return (
    <div>
      <h1 tabIndex="-1">{title}</h1>
      <p>Confirm the information is correct before you submit your claim.</p>

      <h2 className="vads-u-margin-bottom--0">Claims</h2>
      <hr aria-hidden="true" className="vads-u-margin-y--1" />
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
        What you’re claiming
      </h3>
      <p className="vads-u-margin-y--0">
        Mileage-only reimbursement for your appointment
        {data.location?.attributes?.name
          ? ` at ${data.location.attributes.name}`
          : ''}{' '}
        {data.practitionerName ? `with ${data.practitionerName}` : ''} on{' '}
        {formattedDate} at {formattedTime}.
      </p>

      <h2 className="vads-u-margin-bottom--0">Travel method</h2>
      <hr aria-hidden="true" className="vads-u-margin-y--1" />
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
        How you traveled
      </h3>
      <p className="vads-u-margin-y--0">In your own vehicle</p>

      <h2 className="vads-u-margin-bottom--0">Starting address</h2>
      <hr aria-hidden="true" className="vads-u-margin-y--1" />
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
        Where you traveled from
      </h3>
      <p
        className="vads-u-margin-bottom--3 vads-u-margin-top--0"
        data-dd-privacy="mask"
      >
        {address.addressLine1}
        <br />
        {address.addressLine2 && (
          <>
            {address.addressLine2}
            <br />
          </>
        )}
        {address.addressLine3 && (
          <>
            {address.addressLine3}
            <br />
          </>
        )}
        {`${address.city}, ${address.stateCode} ${address.zipCode}`}
        <br />
      </p>

      <va-card background>
        <h3 className="vads-u-margin-bottom--2 vads-u-margin-top--0">
          Beneficiary travel agreement
        </h3>
        <h4 className="vads-u-font-family--sans vads-u-display--inline">
          Penalty statement:
        </h4>{' '}
        <p className="vads-u-display--inline">
          There are severe criminal and civil penalties, including a fine,
          imprisonment, or both, for knowingly submitting a false, fictitious,
          or fraudulent claim.
        </p>
        <p>
          By submitting this claim, you agree to the beneficiary travel
          agreement.
        </p>
        <TravelAgreementContent />
        <VaCheckbox
          className="vads-u-margin-x--1 vads-u-margin-y--2"
          checked={isAgreementChecked}
          name="accept-agreement"
          description={null}
          error={
            isError
              ? 'You must accept the beneficiary travel agreement before continuing.'
              : null
          }
          hint={null}
          label="I confirm that the information is true and correct to the best of my knowledge and belief. I’ve read and I accept the beneficiary travel agreement."
          onVaChange={() => setIsAgreementChecked(!isAgreementChecked)}
          required
        />
      </va-card>

      <VaButtonPair
        className="vads-u-margin-top--2"
        continue
        disable-analytics
        rightButtonText="Submit claim"
        leftButtonText="Start over"
        onPrimaryClick={onSubmit}
        onSecondaryClick={onBack}
      />
    </div>
  );
};

ReviewPage.propTypes = {
  address: PropTypes.object,
  isAgreementChecked: PropTypes.bool,
  isError: PropTypes.bool,
  setIsAgreementChecked: PropTypes.func,
  setPageIndex: PropTypes.func,
  setYesNo: PropTypes.func,
  onSubmit: PropTypes.func,
};

function mapStateToProps(state) {
  const homeAddress = selectVAPResidentialAddress(state);
  return {
    address: homeAddress,
  };
}

export default connect(mapStateToProps)(ReviewPage);
