import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NeedHelp from '../components/NeedHelp';
import sendNextStepsEmail from '../api/sendNextStepsEmail';

export default function ConfirmationPage({ router }) {
  const [signedForm, setSignedForm] = useState(false);
  const [signedFormError, setSignedFormError] = useState(false);
  const { data: formData } = useSelector(state => state.form);

  // const formData = {
  //   'view:selectedRepresentative': {
  //     type: 'individual', // can be either 'organization', 'individual'
  //     fullName: 'Brian Daniel', // exists for 'individual'
  //     // name: 'Disabled American Veterans', // exists for 'organization'
  //     addressLine1: '400 South 18th Street',
  //     addressLine2: 'Room 119',
  //     addressLine3: '',
  //     city: 'Newark',
  //     stateCode: 'NJ',
  //     zipCode: '07102',
  //     phone: '7026842997',
  //     email: 'bdaniel@veterans.nj.gov',
  //     attributes: {
  //       individualType: 'representative', // can be 'representative', 'attorney' or 'claimsAgent'
  //       accreditedOrganizations: {
  //         data: [
  //           {
  //             id: '1',
  //             attributes: { name: 'Disabled American Veterans' },
  //           },
  //         ],
  //       },
  //     },
  //   },
  //   selectedAccreditedOrganizationId: '1',
  //   applicantName: {
  //     first: 'John',
  //     middle: 'Edmund',
  //     last: 'Doe',
  //     suffix: 'Sr.',
  //   },
  //   veteranFullName: {
  //     first: 'John',
  //     middle: 'Edmund',
  //     last: 'Doe',
  //     suffix: 'Sr.',
  //   },
  // };

  // formName
  // For 21-22 that'd be Appointment of Veterans Service Organization as Claimant's Representative
  // For 21-22a that'd be Appointment of Individual As Claimant's Representative

  const selectedEntity = formData['view:selectedRepresentative'];

  const getFormNumber = () => {
    const entity = formData['view:selectedRepresentative'];
    const entityType = entity?.type;

    if (entityType === 'organization') {
      return '21-22';
    }
    if (entityType === 'individual') {
      const { individualType } = entity.attributes;
      if (individualType === 'representative') {
        return '21-22';
      }
      return '21-22a';
    }
    return '21-22 or 21-22a';
  };

  const representativeType = selectedEntity.type;
  const representativeName = selectedEntity?.name || selectedEntity?.fullName;
  const representativeAddress = {
    address1: selectedEntity.addressLine1,
    address2: selectedEntity.addressLine2,
    address3: selectedEntity.addressLine3,
    city: selectedEntity.city,
    stateCode: selectedEntity.stateCode,
    zipCode: selectedEntity.zipCode,
  };
  const nextStepsEmailPayload = {
    emailAddress: formData,
    firstName: formData,
    formName:
      "APPOINTMENT OF VETERANS SERVICE ORGANIZATION AS CLAIMANT'S REPRESENTATIVE",
    formNumber: getFormNumber(),
    representativeType,
    representativeName,
    representativeAddress,
  };

  const handlers = {
    onClickDownloadForm: e => {
      e.preventDefault();
    },
    onChangeSignedFormCheckbox: () => {
      setSignedForm(prevState => !prevState);

      if (signedFormError) setSignedFormError(false);
    },
    onClickContinueButton: async () => {
      if (signedForm) {
        const response = await sendNextStepsEmail(nextStepsEmailPayload);

        if (response.status === 200) {
          router.push('/next-steps');
        } else {
          // How do we handle the non-200 response?
        }
      } else {
        setSignedFormError(true);
      }
    },
  };

  return (
    <>
      <h2 className="vads-u-font-size--h3">
        Download, print, and sign your form
      </h2>
      <p>First, you’ll need to download your form.</p>
      <va-link
        download
        href=""
        label="Download your form"
        onClick={handlers.onClickDownloadForm}
        text="Download your form"
      />
      <p className="vads-u-margin-top--4">
        Then, you’ll need to print and sign your form.
      </p>
      <VaCheckbox
        checked={signedForm}
        className="vads-u-margin-bottom--4"
        error={
          signedFormError
            ? "Please confirm that you've downloaded, printed, and signed your form."
            : null
        }
        label="I've downloaded, printed, and signed my form"
        name="signedForm"
        required
        onVaChange={handlers.onChangeSignedFormCheckbox}
      />
      <va-button continue onClick={handlers.onClickContinueButton} />
      <NeedHelp />
    </>
  );
}

ConfirmationPage.propTypes = {
  router: PropTypes.object,
};
