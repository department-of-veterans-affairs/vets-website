import React, { useEffect } from 'react';

// export default {
//   required: true,
//   notice: (
//     <div>
//       <strong>Note:</strong> According to federal law, there are criminal
//       penalties, including a fine and/or imprisonment for up to 5 years, for
//       withholding information or for providing incorrect information. (See 18
//       U.S.C. 1001)
//     </div>
//   ),
//   field: 'privacyAgreementAccepted',
//   label: (
//     <span>
//       I have read and accept the{' '}
//       <a
//         aria-label="Privacy policy, will open in new tab"
//         target="_blank"
//         href="/privacy-policy/"
//       >
//         privacy policy
//       </a>
//     </span>
//   ),
//   error: 'You must accept the privacy policy before continuing.',
// };

const PreSubmitNotice = ({ onSectionComplete, formData, _showError }) => {
  const privacyAgreementAccepted = formData.privacyAgreementAccepted;
  const vrrapConfirmation = formData.vrrapConfirmation;

  // when there is no unsigned signatures set AGREED (onSectionComplete) to true
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(!privacyAgreementAccepted && !vrrapConfirmation);

      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [privacyAgreementAccepted, vrrapConfirmation],
  );

  const privacyAgreement = (
    <div>
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information. (See 18
      U.S.C. 1001)
    </div>
  );
  return (
    <section className="vads-u-display--flex vads-u-flex-direction--column">
      {privacyAgreement}
    </section>
  );
};

export default {
  required: true,
  CustomComponent: PreSubmitNotice,
};
