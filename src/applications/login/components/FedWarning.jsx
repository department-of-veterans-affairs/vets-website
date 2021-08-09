import React from 'react';

export default function FedWarning() {
  return (
    <div className="fed-warning">
      <p>
        When you sign in to VA.gov, you’re using a United States federal
        government information system.
      </p>
      <p>
        By signing in, you agree to only use information you have legal
        authority to view and use. You also agree to let us monitor and record
        your activity on the system and share this information with auditors or
        law enforcement officials.
      </p>
      <p>By signing in, you confirm that you understand the following:</p>
      <p>
        Unauthorized use of this system is prohibited and may result in
        criminal, civil, or administrative penalties. Unauthorized use includes
        gaining unauthorized data access, changing data, harming the system or
        its data, or misusing the system. We can suspend or block your access to
        this system if we suspect any unauthorized use.
      </p>
    </div>
  );
}
