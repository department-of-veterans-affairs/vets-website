import React from 'react';

function Table() {
  return (
    <div className="custom-table">
      <table className="usa-table">
        <tbody>
          <tr>
            <th scope="row">Recruiting/Marketing Practices</th>
            <td>Post-Graduation Job Opportunities</td>
            <td>Release of transcripts</td>
          </tr>
          <tr>
            <th scope="row">Accreditation</th>
            <td>Change in Degree Plan/Requirements</td>
            <td>Transfer of Credits</td>
          </tr>
          <tr>
            <th scope="row">Financial Issues (e.g. Tuition/Fee charges)</th>
            <td>Quality of Education</td>
            <td>Refund Issues</td>
          </tr>
          <tr>
            <th scope="row">Student Loans</th>
            <td>Grade Policy</td>
            <td>Other</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
