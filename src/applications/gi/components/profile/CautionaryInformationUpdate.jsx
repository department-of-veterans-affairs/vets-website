import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CautionFlagDetails from './CautionFlagDetails';
import SchoolClosingDetails from './SchoolClosingDetails';
import LearnMoreLabel from '../LearnMoreLabel';

export function CautionaryInformation({ institution, showModal }) {
  const {
    complaints,
    schoolClosing,
    schoolClosingOn,
    cautionFlags,
    website,
  } = institution;
  const history = useHistory();

  const renderCautionFlags = () => {
    if (!schoolClosing && cautionFlags.length === 0) {
      return null;
    }

    return (
      <div>
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

  return (
    <div className="cautionary-information small-screen-font">
      {renderCautionFlags()}
      <hr />
      <div className="student-complaints">
        <h3 className="small-screen-font">
          Filter student feedback and complaints data for all locations
        </h3>

        <div className="link-header">
          <h4 className="small-screen-font vads-u-font-weight--normal">
            {`${+complaints.mainCampusRollUp} student complaints in the last 6 years`}
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

        {complaints.mainCampusRollUp > 0 && (
          <>
            <p className="small-screen-font vads-u-margin-top--1">
              To filter student feedback and complaints data for additional
              locations associated with this institution, use the link below.{' '}
              <LearnMoreLabel
                onClick={() => {
                  showModal('aboutAllCampuses');
                }}
                capitalize
                buttonId="about-all-campuses"
                buttonClassName="small-screen-font"
              />{' '}
              about additional locations.
            </p>
            <VaLinkAction
              href={`/schools-and-employers/institution/${
                institution.facilityCode
              }/filter-student-feedback`}
              text="Search student feedback and complaints data"
              type="secondary"
              onClick={e => {
                e.preventDefault();
                history.push(
                  `/schools-and-employers/institution/${
                    institution.facilityCode
                  }/filter-student-feedback`,
                );
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

CautionaryInformation.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default CautionaryInformation;
