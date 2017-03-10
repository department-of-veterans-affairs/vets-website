import React from 'react';
import { connect } from 'react-redux';
import { showModal } from '../../actions';
import AlertBox from '../../../common/components/AlertBox';

export class CautionaryInformation extends React.Component {
  render() {
    const it = this.props.profile.attributes;
    if (!it.complaints) { return null; }

    const flagContent = (
      <p>
        {it.cautionFlagReason}
        <br/>
        <a onClick={this.props.showModal.bind(this, 'cautionInfo')}>Learn more about these warnings</a>
      </p>
    );
    const complaintData = [
      { type: 'Financial Issues (e.g., Tuition/Fee charges)', key: 'financial' },
      { type: 'Quality of Education', key: 'quality' },
      { type: 'Refund Issues', key: 'refund' },
      { type: 'Recruiting/Marketing Practices', key: 'marketing' },
      { type: 'Accreditation', key: 'accreditation' },
      { type: 'Change in degree plan/requirements', key: 'degreeRequirements' },
      { type: 'Student Loans', key: 'studentLoans' },
      { type: 'Grade Policy', key: 'grades' },
      { type: 'Transfer of Credits', key: 'creditTransfer' },
      { type: 'Post-Graduation Job Opportunities', key: 'job', totalKey: 'jobs' },
      { type: 'Release of Transcripts', key: 'transcript' },
      { type: 'Other', key: 'other' },
      { type: 'Student Complaints', totals: ['facilityCode', 'mainCampusRollUp'] }
    ];
    const complaints = complaintData.reduce((hydratedComplaints, complaint) => {
      const totals = complaint.totals || {};
      const { type, key, totalKey } = complaint;
      const hydratedComplaint = {
        description: type,
        thisCampus: (complaint.totals ? it.complaints[totals[0]] : it.complaints[`${key}ByFacCode`]),
        allCampuses: (complaint.totals ? it.complaints[totals[1]] : it.complaints[`${totalKey || key}ByOpeIdDoNotSum`]),
      };
      return [...hydratedComplaints, hydratedComplaint];
    }, []);

    const TableRow = ({ description, thisCampus, allCampuses }) => {
      return (
        <tr>
          <th><strong>{description}</strong></th>
          <td className="number">{thisCampus}</td>
          <td className="number">{allCampuses}</td>
        </tr>
      );
    };

    const ListRow = ({ description, value }) => {
      if (value < 1) return null;
      return (
        <div className="row">
          <div className="small-11 columns">
            <p>{description}:</p>
          </div>
          <div className="small-1 columns">
            <p className="number">{value}</p>
          </div>
        </div>
      );
    };

    return (
      <div className="cautionary-information">
        <AlertBox content={flagContent} isVisible={!!it.cautionFlag} status="warning"/>

        <div className="table">
          <h3>{it.complaints.mainCampusRollUp} student complaints</h3>
          <p>(<a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#sourcedata" target="_blank">Source</a>)</p>
          <table className="usa-table-borderless">
            <thead>
              <tr>
                <th>Complaint type</th>
                <th>This campus</th>
                <th>All campuses</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) =>
                <TableRow key={c.description} description={c.description}
                    thisCampus={c.thisCampus} allCampuses={c.allCampuses}/>)}
            </tbody>
          </table>
        </div>

        <div className="list">
          <h4>This campus</h4>
          {complaints.map((c) =>
            <ListRow key={c.description} description={c.description} value={c.thisCampus}/>)}
          <div className="row">
            <div className="small-11 columns">
              <p><strong>Total complaints:</strong></p>
            </div>
            <div className="small-1 columns">
              <p className="number"><strong>{it.complaints.facilityCode}</strong></p>
            </div>
          </div>
          <h4>All campuses</h4>
          {complaints.map((c) =>
            <ListRow key={c.description} description={c.description} value={c.allCampuses}/>)}
          <div className="row">
            <div className="small-11 columns">
              <p><strong>Total complaints:</strong></p>
            </div>
            <div className="small-1 columns">
              <p className="number"><strong>{it.complaints.mainCampusRollUp}</strong></p>
            </div>
          </div>
        </div>

        <p>*Each complaint can have multiple types</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CautionaryInformation);
