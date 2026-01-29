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
      updatePreferredTeam(team.triageTeamId, newSelectAll, team.stationNumber),
    );
  };

  return (
    <div>
      <va-checkbox-group
        data-testid={`${facilityName?.replace(/ /g, '-')}-facility-group`}
        class="contactListFacility vads-u-margin--0"
        error={errorMessage}
      >
        <VaCheckbox
          data-testid={`select-all-${facilityName?.replace(/ /g, '-')}-teams`}
          label={`Select all ${triageTeams.length} teams`}
          checked={selectAll}
          onVaChange={handleSelectAllChange}
          class="vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--2"
          data-dd-action-name="Select all # teams - checkbox"
          message-aria-describedby={
            errorMessage
              ? `Error. ${errorMessage}`
              : `You must select at least one team${
                  multipleFacilities ? ' from one of your facilities.' : '.'
                }`
          }
        />
        <div
          className="vads-u-margin-left--2 tablet:vads-u-margin-left--3"
          data-testid={`${facilityName?.replace(/ /g, '-')}-teams`}
        >
          {triageTeams.map((team, index) => {
            return (
              <VaCheckbox
                data-testid={`contact-list-select-team-${team.triageTeamId}`}
                class={`${
                  index === triageTeams.length - 1
                    ? ' vads-u-margin-bottom--0'
                    : 'vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--2'
                }`}
                key={team.triageTeamId}
                label={team.suggestedNameDisplay || team.name}
                checked={team.preferredTeam}
                onVaChange={() => {
                  updatePreferredTeam(
                    team.triageTeamId,
                    null,
                    team.stationNumber,
                  );
                }}
                data-dd-action-name="Individual team - checkbox"
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
