import PropTypes from 'prop-types';
import React from 'react';
import CautionFlagDetails from './CautionFlagDetails';
import SchoolClosingDetails from './SchoolClosingDetails';
import LearnMoreLabel from '../LearnMoreLabel';
import { ariaLabels, complaintData } from '../../constants';
import { isProductionOfTestProdEnv } from '../../utils/helpers';

export function CautionaryInformation({ institution, showModal }) {
  const {
    complaints,
    schoolClosing,
    schoolClosingOn,
    cautionFlags,
    website,
  } = institution;

  const renderTableRow = ({
    allCampuses,
    description,
    displayEmpty,
    key,
    thisCampus,
    definition,
  }) => {
    if (!displayEmpty && !thisCampus && !allCampuses) return null;
    const bold = description === 'Total Complaints';
    return (
      <va-table-row key={key}>
        <span>
          <strong>{description}</strong>
          <br />
          {definition}
        </span>
        <span>{bold ? <strong>{thisCampus}</strong> : thisCampus}</span>
        <span>{bold ? <strong>{allCampuses}</strong> : allCampuses}</span>
      </va-table-row>
    );
  };

  const renderListRow = ({ description, key, value, definition }) => {
    if (value < 1) return null;
    const bold = description === 'Total Complaints';
    return (
      <div className="row " key={key}>
        <div className="small-11 columns">
          <p className="vads-u-margin--0">
            {description !== 'Other' ? (
              <va-additional-info
                trigger={
                  bold ? <strong>{description}:</strong> : `${description}:`
                }
              >
                <div>{definition}</div>
              </va-additional-info>
            ) : (
              description
            )}
          </p>
        </div>
        <div className="small-1 columns">
          <p className="number vads-u-margin--0">
            {bold ? <strong>{value}</strong> : value}
          </p>
        </div>
      </div>
    );
  };

  const renderCautionFlags = () => {
    if (!schoolClosing && cautionFlags.length === 0) {
      return null;
    }

    return (
      <div>
        {!isProductionOfTestProdEnv() && (
          <div>
            <h3>Cautionary warnings and school closings</h3>
            <p>
              If any cautionary warnings have been issued, they will appear
              below. VA applies caution flags when we, or another federal
              agency, have increased regulatory or legal scrutiny of an
              educational program. We recommend students consider these warnings
              before enrolling in flagged programs.
            </p>
            <p>
              In addition, if the VA receives notice that a school or campus
              location will be closing, it will appear below. Once the closing
              date passes, we remove the institution from the Comparison Tool
              during the next system update.
            </p>
          </div>
        )}
        <h3 tabIndex="-1" id="viewWarnings">
          Alerts from VA and other federal agencies
        </h3>
        <SchoolClosingDetails
          schoolClosing={schoolClosing}
          schoolClosingOn={schoolClosingOn}
          schoolWebsite={website}
        />
        <CautionFlagDetails cautionFlags={cautionFlags} />
        <div className="vads-u-margin-bottom--5">
          <p>
            Before enrolling in a program at this institution, VA recommends
            that potential students consider these cautionary warnings. Caution
            flags indicate that VA or other federal agencies like the Department
            of Defense (DoD) or Department of Education (ED) have applied
            increased regulatory or legal scrutiny to this program.
          </p>
          <p>
            To learn more about Caution Flags,{' '}
            <a
              href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#CF"
              target="_blank"
              rel="noopener noreferrer"
            >
              visit the About this tool page
            </a>
            .
          </p>
        </div>
      </div>
    );
  };

  const allCampusesLink = (
    <div className="small-screen-font">
      <LearnMoreLabel
        id="typeAccredited-button"
        bold
        text="All campuses"
        onClick={() => {
          showModal('allCampuses');
        }}
        ariaLabel={ariaLabels.learnMore.allCampusComplaints}
        buttonClassName="small-screen-font"
        buttonId="all-campuses-learn-more"
      />
    </div>
  );

  const complaintRows = complaintData.reduce(
    (hydratedComplaints, complaint) => {
      const totals = complaint.totals || {};
      const { type, key, totalKey } = complaint;
      const hydratedComplaint = {
        description: type,
        thisCampus: complaint.totals
          ? complaints[totals[0]]
          : complaints[`${key}ByFacCode`],
        allCampuses: complaint.totals
          ? complaints[totals[1]]
          : complaints[`${totalKey || key}ByOpeIdDoNotSum`],
        definition: complaint?.definition || '',
      };
      return [...hydratedComplaints, hydratedComplaint];
    },
    [],
  );

  const allComplaints = complaintRows.pop();

  return (
    <div className="cautionary-information small-screen-font">
      {renderCautionFlags()}
      <hr />

      <div className="student-complaints">
        <h3 className="small-screen-font">Student feedback</h3>

        <div className="link-header">
          <h4 className="small-screen-font">
            {`${+complaints.mainCampusRollUp} student complaints in the last 24 months`}
          </h4>
          <span>
            &nbsp;
            <LearnMoreLabel
              onClick={() => {
                showModal('studentComplaints');
              }}
              buttonId="student-complaints"
              buttonClassName="small-screen-font"
            />
          </span>
        </div>
      </div>

      <div>
        <div className="table">
          <va-table class="vads-u-margin-bottom--2">
            <va-table-row slot="headers">
              <span />
              <span>This campus</span>
              <span>{allCampusesLink}</span>
            </va-table-row>
            {renderTableRow({
              description: 'All student complaints',
              displayEmpty: true,
              thisCampus: allComplaints.thisCampus || 0,
              allCampuses: allComplaints.allCampuses || 0,
            })}
          </va-table>

          {!!complaints.mainCampusRollUp && (
            <va-table class="vads-u-margin-bottom--2">
              <va-table-row slot="headers">
                <span>
                  Complaints by type{' '}
                  <span>(Each complaint can have multiple types)</span>
                </span>
                <span>This campus</span>
                <span>{allCampusesLink}</span>
              </va-table-row>
              {complaintRows.map(c => {
                return renderTableRow({
                  key: c.description,
                  description: c.description,
                  thisCampus: c.thisCampus || 0,
                  allCampuses: c.allCampuses || 0,
                  definition: c.definition,
                });
              })}
            </va-table>
          )}
        </div>

        <div className="list">
          <h4 className="vads-u-margin-bottom--0 small-screen-font">
            This campus
          </h4>
          {complaintRows.every(
            complaintType => complaintType.thisCampus === null,
          ) && (
            <div className="row">
              <div className="small-11 columns">
                <p className="vads-u-margin--0">All student complaints:</p>
              </div>
              <div className="small-1 columns">
                <p className="number vads-u-margin--0">0</p>
              </div>
            </div>
          )}
          {complaintRows.map(c => {
            return renderListRow({
              key: c.description,
              description: c.description,
              value: c.thisCampus,
              definition: c.definition,
            });
          })}
          <h4 className="vads-u-margin-bottom--0">{allCampusesLink}</h4>
          {complaintRows.every(
            complaintType => complaintType.allCampuses === null,
          ) && (
            <div className="row">
              <div className="small-11 columns">
                <p className="vads-u-margin--0">All student complaints:</p>
              </div>
              <div className="small-1 columns">
                <p className="number vads-u-margin--0">0</p>
              </div>
            </div>
          )}
          {complaintRows.map(c => {
            return renderListRow({
              key: c.description,
              description: c.description,
              value: c.allCampuses,
              definition: c.definition,
            });
          })}
        </div>
      </div>
      <div className="small-screen:vads-u-text-align--right">
        <a
          href="/education/submit-school-feedback/introduction"
          target="_blank"
          rel="noopener noreferrer"
          id="submit-a-complaint"
        >
          Submit a complaint through our Feedback Tool
        </a>
      </div>
    </div>
  );
}

CautionaryInformation.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default CautionaryInformation;
