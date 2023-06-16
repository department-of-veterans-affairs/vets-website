import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { setData } from 'platform/forms-system/src/js/actions';
import {
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
  signatureBoxNoteContent,
  representativeSignatureContent,
  veteranLabel,
  primaryLabel,
  representativeLabel,
  secondaryOneLabel,
  secondaryTwoLabel,
} from '../../definitions/content';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import SubmitLoadingIndicator from './SubmitLoadingIndicator';

const PreSubmitCheckboxGroup = ({
  onSectionComplete,
  formData,
  showError,
  submission,
  setFormData,
}) => {
  const hasPrimary = formData['view:hasPrimaryCaregiver'];
  const hasSecondaryOne = formData['view:hasSecondaryCaregiverOne'];
  const hasSecondaryTwo = formData['view:hasSecondaryCaregiverTwo'];
  const hasSubmittedForm = !!submission.status;
  const showRepresentativeSignatureBox =
    formData.signAsRepresentativeYesNo === 'yes';

  const [signatures, setSignatures] = useState({
    [showRepresentativeSignatureBox ? representativeLabel : veteranLabel]: '',
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
      switch (key) {
        case veteranLabel:
          return 'veteran';
        case representativeLabel:
          return 'veteran';
        case primaryLabel:
          return 'primary';
        case secondaryOneLabel:
          return 'secondaryOne';
        case secondaryTwoLabel:
          return 'secondaryTwo';
        default:
          return null;
      }
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

  // add signatures to formData before submission
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

  // when there is no unsigned signatures or unchecked signature checkboxes set AGREED (onSectionComplete) to true
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
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
      removePartyIfFalsy(hasPrimary, primaryLabel);
      removePartyIfFalsy(hasSecondaryOne, secondaryOneLabel);
      removePartyIfFalsy(hasSecondaryTwo, secondaryTwoLabel);
      removePartyIfFalsy(showRepresentativeSignatureBox, representativeLabel);
      removePartyIfFalsy(!showRepresentativeSignatureBox, veteranLabel);
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
          label={representativeLabel}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRepresentative
          isRequired
        >
          <StatementOfTruth
            content={{
              label: representativeLabel,
              text: representativeSignatureContent,
            }}
          />
        </SignatureCheckbox>
      ) : (
        <SignatureCheckbox
          fullName={formData.veteranFullName}
          label={veteranLabel}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: veteranLabel,
              text: veteranSignatureContent,
            }}
          />
        </SignatureCheckbox>
      )}

      {hasPrimary && (
        <SignatureCheckbox
          fullName={formData.primaryFullName}
          label={primaryLabel}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: primaryLabel,
              text: primaryCaregiverContent,
            }}
          />
        </SignatureCheckbox>
      )}

      {hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label={secondaryOneLabel}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: secondaryOneLabel,
              text: secondaryCaregiverContent,
            }}
          />
        </SignatureCheckbox>
      )}

      {hasSecondaryTwo && (
        <SignatureCheckbox
          fullName={formData.secondaryTwoFullName}
          label={secondaryTwoLabel}
          signatures={signatures}
          setSignatures={setSignatures}
          showError={showError}
          submission={submission}
          isRequired
        >
          <StatementOfTruth
            content={{
              label: secondaryTwoLabel,
              text: secondaryCaregiverContent,
            }}
          />
        </SignatureCheckbox>
      )}

      <p className="vads-u-margin-bottom--6">
        <strong>Note:</strong> {signatureBoxNoteContent}
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
