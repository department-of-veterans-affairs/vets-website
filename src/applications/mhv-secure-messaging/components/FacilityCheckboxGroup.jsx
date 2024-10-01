import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FacilityCheckboxGroup = props => {
  const {
    facilityName,
    multipleFacilities,
    triageTeams,
    updatePreferredTeam,
    errorMessage,
  } = props;

  const [selectAll, setSelectAll] = useState(false);

  useEffect(
    () => {
      setSelectAll(triageTeams.every(team => team.preferredTeam));
    },
    [triageTeams],
  );

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    triageTeams.map(team =>
      updatePreferredTeam(team.triageTeamId, newSelectAll),
    );
  };

  return (
    <div>
      <va-checkbox-group
        data-testid={`${facilityName?.replace(/ /g, '-')}-facility-group`}
        label={multipleFacilities ? facilityName : null}
        label-header-level={multipleFacilities ? '2' : null}
        class="contactListFacility vads-u-margin-bottom--4 vads-u-margin-top--0"
        error={errorMessage}
      >
        <VaCheckbox
          data-testid={`select-all-${facilityName?.replace(/ /g, '-')}-teams`}
          label={`Select all ${triageTeams.length} ${
            multipleFacilities ? facilityName : 'care'
          } teams`}
          checked={selectAll}
          onVaChange={handleSelectAllChange}
          class="vads-u-margin-bottom--2"
          message-aria-describedby={
            errorMessage ? `Error. ${errorMessage}` : ''
          }
        />
        <div
          className="vads-u-margin-left--2 mobile-lg:vads-u-margin-left--3"
          data-testid={`${facilityName?.replace(/ /g, '-')}-teams`}
        >
          {triageTeams.map(team => {
            return (
              <VaCheckbox
                data-testid={`contact-list-select-team-${team.triageTeamId}`}
                key={team.triageTeamId}
                label={team.name}
                checked={team.preferredTeam}
                onVaChange={() => {
                  updatePreferredTeam(team.triageTeamId, null);
                }}
              />
            );
          })}
        </div>
      </va-checkbox-group>
    </div>
  );
};

FacilityCheckboxGroup.propTypes = {
  errorMessage: PropTypes.string,
  facilityName: PropTypes.string,
  multipleFacilities: PropTypes.bool,
  triageTeams: PropTypes.array,
  updatePreferredTeam: PropTypes.func,
};

export default FacilityCheckboxGroup;
