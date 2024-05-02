import React, { useState } from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { uiSchema, schema } from '../config/pages/applicantDemographics2'; // Import your schema and uiSchema

function RaceCommentBox() {
  const [showRaceComment, setShowRaceComment] = useState(false);

  const handleRaceOptionChange = event => {
    const isOtherSelected = event.target.value === 'isOther';
    setShowRaceComment(isOtherSelected);
  };

  return (
    <div>
      {/* Your form rendering code here */}
      <select onChange={handleRaceOptionChange}>
        {/* Your race options here */}
      </select>
      {showRaceComment && (
        <VaTextInputField
          schema={
            schema.properties.application.properties.veteran.properties
              .raceComment
          }
          uiSchema={uiSchema().application.veteran.raceComment}
        />
      )}
    </div>
  );
}

export default RaceCommentBox;
