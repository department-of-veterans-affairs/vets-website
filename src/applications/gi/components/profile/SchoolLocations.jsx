import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getCalculatedBenefits } from '../../selectors/calculator';
import { locationInfo } from '../../utils/helpers';

export default function SchoolLocations({
  calculator,
  constants,
  eligibility,
  facilityMap,
  institution,
  onViewLess,
  version,
}) {
  const { main } = facilityMap;
  const DEFAULT_ROWS_VIEWABLE = window.innerWidth > 781 ? 10 : 5;
  const NEXT_ROWS_VIEWABLE = 10;

  const totalRows = ({ branches, extensions }) => {
    let rows = 1 + branches.length + extensions.length; // always has a main row
    branches.forEach(branch => {
      rows += branch.extensions.length;
    });
    return rows;
  };

  const numberOfRowsToDisplay = map => {
    const rows = totalRows(map);

    return rows > DEFAULT_ROWS_VIEWABLE ? DEFAULT_ROWS_VIEWABLE : rows;
  };

  const initialViewableRows = numberOfRowsToDisplay(main);
  const initialRowCount = initialViewableRows;
  const totalRowCount = totalRows(main);
  const [focusedElementIndex, setFocusedElementIndex] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [viewableRowCount, setViewableRowCount] = useState(initialViewableRows);

  useEffect(() => {
    // Necessary so screen reader users are aware that the school locations table has changed.
    if (focusedElementIndex) {
      const newRowElements = [
        ...document.querySelectorAll(
          'table.sl-table > tbody > tr > td:first-child',
        ),
      ]
        .slice(focusedElementIndex + 1, totalRowCount + 1)
        .filter(span => span.firstChild.nodeName === 'VA-LINK');

      if (newRowElements.length > 0) {
        const firstElement = newRowElements[0];
        const firstLink = firstElement.firstChild;
        waitForRenderThenFocus('a', firstLink.shadowRoot);
      }
    }
  }, [focusedElementIndex]);

  const institutionIsBeingViewed = facilityCode =>
    facilityCode === institution.facilityCode;

  const createLinkTo = (facilityCode, name) => {
    if (institutionIsBeingViewed(facilityCode)) {
      return name;
    }
    const query = version ? `?version=${version}` : '';

    return (
      <div className="school-name">
        <Link to={`${facilityCode}${query}`}>{name}</Link>
      </div>
    );
  };

  const handleViewAllClicked = () => {
    const previousRowCount = viewableRowCount;
    setViewableRowCount(totalRowCount);
    setViewAll(true);
    setFocusedElementIndex(previousRowCount);
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'View All',
      'button-type': 'link',
    });
  };

  const handleViewLessClicked = () => {
    if (onViewLess) {
      onViewLess();
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'View Less',
        'button-type': 'link',
      });
    }

    setViewableRowCount(initialRowCount);
    setViewAll(false);
    setFocusedElementIndex(0);
  };

  const showMoreClicked = () => {
    const previousRowCount = viewableRowCount;
    const remainingRowCount = totalRowCount - viewableRowCount;
    const newViewableRowCount =
      remainingRowCount >= NEXT_ROWS_VIEWABLE
        ? viewableRowCount + NEXT_ROWS_VIEWABLE
        : viewableRowCount + remainingRowCount;

    setViewableRowCount(newViewableRowCount);
    setFocusedElementIndex(previousRowCount);
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'Show Next n',
      'button-type': 'link',
    });
  };

  const schoolLocationTableInfo = (
    physicalCity,
    physicalState,
    physicalCountry,
    physicalZip,
  ) => {
    let address = locationInfo(physicalCity, physicalState, physicalCountry);
    if (physicalCountry === 'USA' && physicalZip) {
      address = `${address} ${physicalZip}`;
    }
    return address;
  };

  const estimatedHousingValue = inst => {
    const rowState = {
      constants: { constants },
      eligibility,
      profile: { attributes: inst },
      calculator,
    };
    const calculated = getCalculatedBenefits(rowState);
    return calculated.outputs.housingAllowance.value;
  };

  const createRow = (inst, type, name = inst.institution) => {
    const estimatedHousing = (
      <div key="months">
        {estimatedHousingValue(inst)}
        <span className="sr-only">per month</span>
        <span aria-hidden="true">/mo</span>
      </div>
    );
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
    } = inst;
    const schoolName = institutionIsBeingViewed(facilityCode) ? (
      <p className="school-name">{name}</p>
    ) : (
      name
    );

    const location = schoolLocationTableInfo(
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
    );

    return {
      key: `${facilityCode}-${type}`,
      rowClassName: `${type}-row`,
      schoolName,
      location,
      estimatedHousing,
    };
  };

  const createMainRow = inst =>
    createRow(
      inst,
      'main',
      createLinkTo(inst.facilityCode, `${inst.institution} (Main Campus)`),
    );

  const createExtensionRows = (rows, extensions, maxRows) => {
    for (const extension of extensions) {
      // check if should add more rows
      if (!viewAll && rows.length >= maxRows - 1) {
        break;
      }
      const nameLabel = (
        <div className="extension-cell-label school-name">
          {extension.institution}
        </div>
      );
      rows.push(createRow(extension, 'extension', nameLabel));
    }
  };

  const createBranchRows = (rows, branches, maxRows) => {
    for (const branch of branches) {
      // check if should add more rows
      if (!viewAll && rows.length >= maxRows - 1) {
        break;
      }

      const { institution: inst } = branch;
      const { facilityCode, institution: name } = inst;

      rows.push(createRow(inst, 'branch', createLinkTo(facilityCode, name)));

      createExtensionRows(rows, branch.extensions, maxRows);
    }
  };

  const createBranchesAndExtensionsRows = (
    { branches, extensions },
    maxRows,
  ) => {
    const rows = [];
    createExtensionRows(rows, extensions, maxRows);
    createBranchRows(rows, branches, maxRows);
    return rows;
  };

  const renderFacilityTable = mainMap => {
    const data = Array.of(createMainRow(mainMap.institution)).concat(
      createBranchesAndExtensionsRows(mainMap, viewableRowCount),
    );

    const renderSchoolName = name => {
      if (name && name.props?.children?.props) {
        const { props } = name.props.children;
        const href = `/education/gi-bill-comparison-tool/institution/${props.to}`;
        const text = props.children;
        return (
          <va-link
            href={href}
            text={text}
            data-testid="comparison-tool-institution"
          />
        );
      }
      return name;
    };

    return (
      // NOTE: This table purposely not converted to a va-table - DST
      // eslint-disable-next-line @department-of-veterans-affairs/prefer-table-component
      <table className="usa-table sl-table">
        <thead>
          <tr>
            <th scope="col">School name</th>
            <th scope="col">Location</th>
            <th scope="col">Estimated housing</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            return (
              <tr key={idx}>
                <td>{renderSchoolName(row.schoolName)}</td>
                <td>{row.location}</td>
                <td>{row.estimatedHousing}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderViewButtons = () => {
    if (totalRowCount > DEFAULT_ROWS_VIEWABLE) {
      if (viewableRowCount !== totalRowCount) {
        const remainingRowCount = totalRowCount - viewableRowCount;
        const showNextCount =
          remainingRowCount < NEXT_ROWS_VIEWABLE
            ? remainingRowCount
            : NEXT_ROWS_VIEWABLE;
        return (
          <div className="vads-u-padding-top--1">
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={showMoreClicked}
            >
              Show next {showNextCount}
              <va-icon
                icon="expand_more"
                size={3}
                className="vads-u-padding-left--1"
              />
            </button>
            <span className="vads-u-padding--2">|</span>
            <VaButton
              text="View all"
              data-testid="view-all"
              className="learn-more-btn"
              onClick={handleViewAllClicked}
            />
          </div>
        );
      }
      return (
        <div className="vads-u-padding-top--1">
          <VaButton
            text="...View less"
            className="learn-more-btn"
            onClick={handleViewLessClicked}
            data-testid="view-less"
          />
        </div>
      );
    }
    return null;
  };

  const renderViewCount = () => {
    return (
      <div className="vads-u-padding-top--2">
        <em>
          Showing {viewableRowCount} of {totalRowCount} locations
        </em>
      </div>
    );
  };

  return (
    <div>
      <span className="small-screen-font">
        Below are locations for {main.institution.institution}. The housing
        estimates shown here are based on a full-time student taking in-person
        classes.&nbsp;
        {main.branches.length > 0 && ( // only displayed when branches exist
          <span>
            Select a link to view a location and calculate the benefits you’d
            receive there.
          </span>
        )}
      </span>
      <Router>{renderFacilityTable(main)}</Router>
      {renderViewCount()}
      {renderViewButtons()}
    </div>
  );
}
SchoolLocations.propTypes = {
  calculator: PropTypes.object.isRequired,
  constants: PropTypes.object.isRequired,
  eligibility: PropTypes.object.isRequired,
  facilityMap: PropTypes.object.isRequired,
  institution: PropTypes.object.isRequired,
  version: PropTypes.string,
  onViewLess: PropTypes.func,
};
