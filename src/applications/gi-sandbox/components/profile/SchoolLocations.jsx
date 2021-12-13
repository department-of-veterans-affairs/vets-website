import React, { useEffect, useState } from 'react';
import { getCalculatedBenefits } from '../../selectors/calculator';
import { locationInfo, upperCaseFirstLetterOnly } from '../../utils/helpers';
import ResponsiveTable from '../ResponsiveTable';
import { Link } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';

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

  useEffect(
    () => {
      // Necessary so screen reader users are aware that the school locations table has changed.
      if (focusedElementIndex) {
        document
          .getElementsByClassName('school-name-cell')
          [focusedElementIndex].focus();
      }
    },
    [focusedElementIndex],
  );

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
    const month = (
      <React.Fragment key="months">
        <span className="sr-only">per month</span>
        <span aria-hidden="true">/mo</span>
      </React.Fragment>
    );
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
    } = inst;
    const nameLabel = institutionIsBeingViewed(facilityCode) ? (
      <p className="school-name">{name}</p>
    ) : (
      name
    );

    const schoolName =
      type === 'main'
        ? nameLabel
        : {
            value: nameLabel,
            mobileHeader: upperCaseFirstLetterOnly(type),
          };

    return {
      key: `${facilityCode}-${type}`,
      rowClassName: `${type}-row`,
      'School name': schoolName,
      Location: schoolLocationTableInfo(
        physicalCity,
        physicalState,
        physicalCountry,
        physicalZip,
      ),
      'Estimated housing': (
        <>
          {estimatedHousingValue(inst)}
          {month}
        </>
      ),
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
        <div className="extension-cell-label">{extension.institution}</div>
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
    const maxRows = viewableRowCount;

    const fields = ['School name', 'Location', 'Estimated housing'];

    const data = Array.of(createMainRow(mainMap.institution)).concat(
      createBranchesAndExtensionsRows(mainMap, maxRows),
    );

    return (
      <ResponsiveTable
        columns={fields}
        tableClass="school-locations"
        data={data}
      />
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
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={showMoreClicked}
            >
              Show next {showNextCount}
              <i
                className="fas fa-chevron-down fa-xs vads-u-padding-left--1"
                aria-hidden="true"
              />
            </button>
            <span className="vads-u-padding--2">|</span>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={handleViewAllClicked}
            >
              View all
            </button>
          </div>
        );
      }
      return (
        <div className="vads-u-padding-top--1">
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={handleViewLessClicked}
          >
            ...View less
          </button>
        </div>
      );
    }
    return null;
  };

  const renderViewCount = () => {
    return (
      <div className="vads-u-padding-top--2">
        <i>
          Showing {viewableRowCount} of {totalRowCount} locations
        </i>
      </div>
    );
  };

  return (
    <div className="school-locations row">
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
      {renderFacilityTable(main)}
      {renderViewCount()}
      {renderViewButtons()}
    </div>
  );
}
