import React from 'react';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';

const cdpUrl = getAppUrl('combined-debt-portal');
const fsrUrl = getAppUrl('request-debt-help-form-5655');
const breadcrumbs = [
  { href: '/', label: 'Home' },
  { href: '/manage-va-debt', label: 'Manage your VA debt' },
];

const bcString = JSON.stringify(breadcrumbs);

const handleGeneratePdf = async () => {
  try {
    const pdfData = {
      date: '03/20/2025', // Add the date to match template
    };
    const result = await generatePdf('oneDebtLetter', 'one_debt_letter.pdf', pdfData);
    console.log('generatePdf Result:', result); // Debug what generatePdf returns
    alert('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

const ManageVADebtCTA = () => (
  <>
    <va-breadcrumbs breadcrumb-list={bcString} />
    <h1>Manage your VA debt for benefit overpayments and copay bills</h1>

    {/* 🧪 PDF TEST BUTTON */}
    <button
      style={{
        marginTop: '2rem',
        padding: '1rem',
        fontSize: '1rem',
        background: '#005ea2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={handleGeneratePdf} // Trigger PDF generation on click
    >
      🧪 Generate One Debt Letter PDF
    </button>

    <p>
      Review your current VA benefit debt or copay bill balances online. And
      find out how to make payments or request help now.
    </p>

    <h2>Review your benefit debt and copay bills online</h2>
    <p>
      <a target="_self" href={cdpUrl} className="vads-c-action-link--green">
        Manage your VA debt
      </a>
    </p>

    <hr />

    <h2>Request help with VA debt (VA Form 5655)</h2>
    <p>
      <a target="_self" href={fsrUrl} className="vads-c-action-link--green">
        Request help with VA debt
      </a>
    </p>
  </>
);

export default ManageVADebtCTA;
