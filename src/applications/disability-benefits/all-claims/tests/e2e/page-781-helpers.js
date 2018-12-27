export const selectWalkthrough781Choice = (client, data) => {
  const upload781Choice = data['view:upload781Choice'];
  client.selectRadio('root_view:upload781Choice', upload781Choice);
};

export const getPtsdIncident = (data, index) => data[`incident${index}`];

export const completePtsdMedals = (client, incident, index) => {
  client.fill(
    `input[name="root_incident${index}_medalsCitations"]`,
    incident.medalsCitations,
  );
};

export const completePtsdIncidentDate = (client, incident, index) => {
  client.fillDate(`root_incident${index}_incidentDate`, incident.incidentDate);
};

export const completePtsdIncidentUnitAssignment = (client, incident, index) => {
  client
    .fill(
      `input[name="root_incident${index}_unitAssigned"]`,
      incident.unitAssigned,
    )
    .fillDate(
      `root_incident${index}_unitAssignedDates_from`,
      incident.unitAssignedDates.from,
    )
    .fillDate(
      `root_incident${index}_unitAssignedDates_to`,
      incident.unitAssignedDates.to,
    );
};

export const completePtsdIncidentLocation = (client, incident, index) => {
  client
    .fillAddress(
      `root_incident${index}_incidentLocation`,
      incident.incidentLocation,
    )
    .fill(
      `textarea[id="root_incident${index}_incidentLocation_additionalDetails"]`,
      incident.incidentLocation.additionalDetails,
    );
};

export const completePtsdIndividualsInvolved = (client, data, index) => {
  client.selectRadio(
    `root_view:individualsInvolved${index}`,
    data[`view:individualsInvolved${index}`] ? 'Y' : 'N',
  );
};

export const completePtsdIndividualsInvolvedQuestions = (
  client,
  incident,
  index,
) => {
  incident.personsInvolved.forEach((person, i, list) => {
    client
      .fillName(`root_incident${index}_personInvolved_${i}_name`, person.name)
      .fill(
        `textarea[id="root_incident${index}_personInvolved_${i}_personDescription"]`,
        person.personDescription,
      )
      .selectRadio(
        `root_incident${index}_personInvolved_${i}_view:serviceMember`,
        person['view:serviceMember'] ? 'Y' : 'N',
      );

    if (i < list.length - 1) client.click('.va-growable-add-btn');
  });
};
// export const completePtsdAdditionalEvents = (client, incident, index) => {};
