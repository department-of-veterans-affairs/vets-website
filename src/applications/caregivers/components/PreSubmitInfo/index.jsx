import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { setData } from 'platform/forms-system/src/js/actions';
import { SIGNATURE_CERTIFICATION_STATEMENTS } from '../../utils/constants';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import SubmitLoadingIndicator from './SubmitLoadingIndicator';
import content from '../../locales/en/content.json';

const PreSubmitCheckboxGroup = props => {
  const {
    onSectionComplete,
    formData,
    showError,
    submission,
    setFormData,
  } = props;
  const hasPrimary = formData['view:hasPrimaryCaregiver'];
  const hasSecondaryOne = formData['view:hasSecondaryCaregiverOne'];
  const hasSecondaryTwo = formData['view:hasSecondaryCaregiverTwo'];
  const hasSubmittedForm = !!submission.status;
  const showRepresentativeSignatureBox =
    formData.signAsRepresentativeYesNo === 'yes';
  const defaultSignatureKey = [
    showRepresentativeSignatureBox
      ? content['representative-signature-label']
      : content['vet-input-label'],
  ];

  const [signatures, setSignatures] = useState({
    [defaultSignatureKey]: '',
  });

  const unSignedLength = Object.values(signatures).filter(
    signature => Boolean(signature) === false,
  ).length;
  // Get the count of unchecked signature checkboxes
  const signatureCheckboxes = document.querySelectorAll('.signature-checkbox');
  const uncheckedSignatureCheckboxesLength = [...signatureCheckboxes].filter(
    checkbox =>
      !checkbox.shadowRoot?.querySelector('#checkbox-element')?.checked,
  )?.length;

  const transformSignatures = signature => {
    const keys = Object.keys(signature);

    // takes in labels and renames to what schema expects
    const getKeyName = key => {
      const keyMap = {
        [content['vet-input-label']]: 'veteran',
        [content['representative-signature-label']]: 'veteran',
        [content['primary-signature-label']]: 'primary',
        [content['secondary-one-signature-label']]: 'secondaryOne',
        [content['secondary-two-signature-label']]: 'secondaryTwo',
      };
      return keyMap[key];
    };

    // iterates through all keys and normalizes them using getKeyName
    const renameObjectKeys = (keysMap, obj) =>
      Object.keys(obj).reduce((acc, key) => {
        const cleanKey = `${getKeyName(key)}Signature`;
        return {
          ...acc,
          ...{ [keysMap[cleanKey] || cleanKey]: obj[key] },
        };
      }, {});

    return renameObjectKeys(keys, signatures);
  };

  const removePartyIfFalsy = (predicate, label) => {
    if (!predicate) {
      setSignatures(prevState => {
        const newState = cloneDeep(prevState);
        delete newState[label];
        return newState;
      });
    }
  };

  useEffect(
    () => {
      // do not clear signatures once form has been submitted
      if (hasSubmittedForm) return;

      setFormData({
        ...formData,
        ...transformSignatures(signatures),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFormData, signatures],
  );

  // when no empty signature inputs or unchecked signature checkboxes exist set AGREED (onSectionComplete) to true
  // if user goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(!unSignedLength && !uncheckedSignatureCheckboxesLength);
      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unSignedLength, uncheckedSignatureCheckboxesLength],
  );

  // remove party signature box if yes/no question is answered falsy
  useEffect(
    () => {
      removePartyIfFalsy(hasPrimary, content['primary-signature-label']);
      removePartyIfFalsy(
        hasSecondaryOne,
        content['secondary-one-signature-label'],
      );
      removePartyIfFalsy(
        hasSecondaryTwo,
        content['secondary-two-signature-label'],
      );
      removePartyIfFalsy(
        showRepresentativeSignatureBox,
        content['representative-signature-label'],
      );
      removePartyIfFalsy(
        !showRepresentativeSignatureBox,
        content['vet-input-label'],
      );
    },
    [
      hasPrimary,
      hasSecondaryOne,
      hasSecondaryTwo,
      showRepresentativeSignatureBox,
    ],
  );

  /*
    - Vet first && last name must match, and be checked
    - if hasPrimaryCaregiver first && last name must match, and be checked
    - if hasSecondary one || two, first & last name must match, and be checked to submit
   */

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p className="vads-u-margin-bottom--5">
        Please review information entered into this application. The{' '}
        {showRepresentativeSignatureBox ? 'Representative' : 'Veteran'} and each
        family caregiver applicant must sign the appropriate section.
      </p>

      {showRepresentativeSignatureBox ? (
        <SignatureCheckbox
          fullName={formData.veteranFullName}
          label={content['representative-signature-label']}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRepresentative
          isRequired
        >
          <StatementOfTruth
            content={{
              label: content['representative-signature-label'],
              text: SIGNATURE_CERTIFICATION_STATEMENTS.representative,
            }}
          />
        </SignatureCheckbox>
      ) : (
        <SignatureCheckbox
          fullName={formData.veteranFullName}
          label={content['vet-input-label']}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: content['vet-input-label'],
              text: SIGNATURE_CERTIFICATION_STATEMENTS.veteran,
            }}
          />
        </SignatureCheckbox>
      )}

      {hasPrimary && (
        <SignatureCheckbox
          fullName={formData.primaryFullName}
          label={content['primary-signature-label']}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: content['primary-signature-label'],
              text: SIGNATURE_CERTIFICATION_STATEMENTS.primary,
            }}
          />
        </SignatureCheckbox>
      )}

      {hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label={content['secondary-one-signature-label']}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: content['secondary-one-signature-label'],
              text: SIGNATURE_CERTIFICATION_STATEMENTS.secondary,
            }}
          />
        </SignatureCheckbox>
      )}

      {hasSecondaryTwo && (
        <SignatureCheckbox
          fullName={formData.secondaryTwoFullName}
          label={content['secondary-two-signature-label']}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: content['secondary-two-signature-label'],
              text: SIGNATURE_CERTIFICATION_STATEMENTS.secondary,
            }}
          />
        </SignatureCheckbox>
      )}

      <p className="vads-u-margin-bottom--6">
        <strong>Note:</strong> {content['certification-signature-note']}
      </p>

      <div aria-live="polite">
        <SubmitLoadingIndicator submission={submission} />
      </div>
    </div>
  );
};

PreSubmitCheckboxGroup.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
  submission: PropTypes.shape({
    hasAttemptedSubmit: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),
};

const mapStateToProps = state => {
  return {
    submission: state.form.submission,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default {
  required: true,
  CustomComponent: connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PreSubmitCheckboxGroup),
};
