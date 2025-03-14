import React from 'react';

function LicesnseCertificationServiceError() {
  return (
    <div className="row">
      <va-alert
        style={{ marginTop: '8px', marginBottom: '32px' }}
        status="error"
      >
        <h2 slot="headline">
          We can't load the licenses and certifications details right now
        </h2>
        <p>We’re sorry. There’s a problem with our system. Try again later.</p>
      </va-alert>
    </div>
  );
}

export default LicesnseCertificationServiceError;
