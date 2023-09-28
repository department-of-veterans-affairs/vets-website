import React from 'react';

const MedicationTerms = () => {
  return (
    <va-additional-info trigger="What do these medication terms mean?">
      <h4>ACTIVE "Prescription Status: Active"</h4>
      <p>
        A prescription that can be filled at the local VA pharmacy. If you have
        refills, you may request a refill of this prescription from your VA
        pharmacy.
      </p>
      {/* TODO: add spacing between para and headers */}
      <h4>NON-VA</h4>
      <p>
        A medication that came from someplace other than a VA pharmacy. This may
        be a prescription from either the VA or other providers that was filled
        outside the VA. Or, it may be a over the counter (OTC), herbal, dietary
        supplement, or sample medication. If this medication information is
        incorrect or out of date, please tell your VA healthcare team.
      </p>
    </va-additional-info>
  );
};

export default MedicationTerms;
