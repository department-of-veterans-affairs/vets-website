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
  const selectedEntity = formData['view:selectedRepresentative'];
  const emailAddress = formData.email;
  const firstName =
    formData.applicantName?.first || formData.veteranFullName.first;
  const representativeName = selectedEntity?.name || selectedEntity?.fullName;
  const representativeAddress =
    [
      (selectedEntity.addressLine1 || '').trim(),
      (selectedEntity.addressLine2 || '').trim(),
      (selectedEntity.addressLine3 || '').trim(),
    ]
      .filter(Boolean)
      .join(' ') +
    (selectedEntity.city ? ` ${selectedEntity.city},` : '') +
    (selectedEntity.stateCode ? ` ${selectedEntity.stateCode}` : '') +
    (selectedEntity.zipCode ? ` ${selectedEntity.zipCode}` : '');

  const getRepType = () => {
    if (selectedEntity?.type === 'organization') {
      return 'Organization';
    }

    const repType = selectedEntity.attributes?.individualType;

    if (repType === 'attorney') {
      return 'Attorney';
    }

    if (repType === 'claimsAgent') {
      return 'Claims Agent';
    }

    return 'VSO Representative';
  };

  const getFormNumber = () => {
    const entityType = selectedEntity?.type;

    if (
      entityType === 'organization' ||
      (entityType === 'individual' &&
        selectedEntity.attributes.individualType === 'representative')
    ) {
      return '21-22';
    }

    return '21-22a';
  };

  const getFormName = () => {
    if (getFormNumber() === '21-22') {
      return "Appointment of Veterans Service Organization as Claimant's Representative";
    }

    return "Appointment of Individual As Claimant's Representative";
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
        try {
          await sendNextStepsEmail({
            emailAddress,
            firstName,
            representativeType: getRepType(),
            representativeName,
            representativeAddress,
            formNumber: getFormNumber(),
            formName: getFormName(),
          });
        } catch (error) {
          // Should we set an error state to display a message in the UI?
        }

        router.push('/next-steps');
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
