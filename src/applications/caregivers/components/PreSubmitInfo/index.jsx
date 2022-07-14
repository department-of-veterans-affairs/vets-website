import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { setData } from 'platform/forms-system/src/js/actions';
import {
  PrivacyPolicy,
  veteranSignatureContent,
  primaryCaregiverContent,
  signatureBoxNoteContent,
  representativeSignatureContent,
  SecondaryCaregiverCopy,
  veteranLabel,
  primaryLabel,
  representativeLabel,
  secondaryOneLabel,
  secondaryTwoLabel,
} from 'applications/caregivers/definitions/content';
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
  // we are separating the first paragraph due to each paragraph having unique styling
  const veteranFirstParagraph = veteranSignatureContent[0];
  const veteranWithoutFirstParagraph = veteranSignatureContent.slice(1);
  const primaryFirstParagraph = primaryCaregiverContent[0];
  const primaryWithoutFirstParagraph = primaryCaregiverContent.slice(1);
  const representativeFirstParagraph = representativeSignatureContent[0];
  const representativeWithoutFirstParagraph = representativeSignatureContent.slice(
    1,
  );

  const [signatures, setSignatures] = useState({
    [showRepresentativeSignatureBox ? representativeLabel : veteranLabel]: '',
  });

  const unSignedLength = Object.values(signatures).filter(
    signature => Boolean(signature) === false,
  ).length;

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

  useEffect(
    () => {
      // do not clear signatures once form has been submitted
      if (hasSubmittedForm) return;

      // Add signatures to formData before submission
      setFormData({
        ...formData,
        ...transformSignatures(signatures),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFormData, signatures],
  );

  // when there is no unsigned signatures set AGREED (onSectionComplete) to true
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(!unSignedLength);

      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unSignedLength],
  );

  const removePartyIfFalsy = (predicate, label) => {
    if (!predicate) {
      setSignatures(prevState => {
        const newState = cloneDeep(prevState);
        delete newState[label];
        return newState;
      });
    }
  };

  /* Remove party signature box if yes/no question is answered falsy */
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
    <section className="vads-u-display--flex vads-u-flex-direction--column">
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
          <h3>Veteran’s statement of truth</h3>

          <h4 className="vads-u-font-size--sm" style={{ fontWeight: 600 }}>
            {representativeFirstParagraph}
          </h4>

          {/* currently this array is empty due to it only having one string
            checking for empty array then mapping it for future compatibility and consistency */}
          {representativeWithoutFirstParagraph &&
            representativeWithoutFirstParagraph.map((veteranContent, idx) => (
              <p key={`representative-signature-${idx}`}>{veteranContent}</p>
            ))}

          <PrivacyPolicy />
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
          <h3>Veteran’s statement of truth</h3>

          <p>{veteranFirstParagraph}</p>

          {/* currently this array is empty due to it only having one string
            checking for empty array then mapping it for future compatibility and consistency */}
          {veteranWithoutFirstParagraph &&
            veteranWithoutFirstParagraph.map((veteranContent, idx) => (
              <p key={`veteran-signature-${idx}`}>{veteranContent}</p>
            ))}

          <PrivacyPolicy />
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
          <h3 className="vads-u-margin-top--4">
            Primary Family Caregiver applicant’s statement of truth
          </h3>

          <p className="vads-u-margin-y--2">{primaryFirstParagraph}</p>

          {primaryWithoutFirstParagraph.map((primaryContent, idx) => (
            <p key={`primary-signature-${idx}`}>{primaryContent}</p>
          ))}

          <PrivacyPolicy />
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
          <SecondaryCaregiverCopy label={secondaryOneLabel} />
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
          <SecondaryCaregiverCopy label={secondaryTwoLabel} />
        </SignatureCheckbox>
      )}

      <p className="vads-u-margin-bottom--6">
        <strong>Note:</strong> {signatureBoxNoteContent}
      </p>

      <div aria-live="polite">
        <SubmitLoadingIndicator submission={submission} />
      </div>
    </section>
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
