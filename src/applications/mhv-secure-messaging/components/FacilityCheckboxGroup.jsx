import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';

const FacilityCheckboxGroup = props => {
  const {
    facilityName,
    multipleFacilities,
    triageTeams,
    updatePreferredTeam,
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
        label={multipleFacilities ? facilityName : null}
        label-header-level={multipleFacilities ? '3' : null}
        class="vads-u-margin-bottom--4 vads-u-margin-top--0"
      >
        <VaCheckbox
          description={null}
          error={null}
          hint={null}
          label={`Select all ${
            multipleFacilities ? facilityName : 'care'
          }  teams`}
          message-aria-describedby={`Select all ${
            multipleFacilities ? facilityName : 'care'
          } teams`}
          checked={selectAll}
          onVaChange={handleSelectAllChange}
          class="vads-u-margin-bottom--2"
        />
        <div className="vads-u-margin-left--2 small-screen:vads-u-margin-left--3">
          {triageTeams.map(team => {
            return (
              <VaCheckbox
                key={team.triageTeamId}
                label={team.name}
                message-aria-describedby={`Select ${team.name}`}
                checked={team.preferredTeam}
                onVaChange={() => updatePreferredTeam(team.triageTeamId)}
              />
            );
          })}
        </div>
      </va-checkbox-group>
    </div>
  );
};

export default FacilityCheckboxGroup;
