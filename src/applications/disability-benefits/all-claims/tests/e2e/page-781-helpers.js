import { clickAddAnother } from './disability-benefits-helpers';

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

export const getIndividualsInvolved = (data, index) =>
  data[`view:individualsInvolved${index}`];

export const completePtsdIndividualsInvolved = (
  client,
  individualsInvolved,
  index,
) => {
  client.selectRadio(
    `root_view:individualsInvolved${index}`,
    individualsInvolved ? 'Y' : 'N',
  );
};

export const completePtsdIndividualsInvolvedQuestions = (
  client,
  incident,
  index,
) => {
  incident.personsInvolved.forEach((person, i, list) => {
    client
      .fillName(`root_incident${index}_personsInvolved_${i}_name`, person.name)
      .fill(
        `textarea[id="root_incident${index}_personsInvolved_${i}_description"]`,
        person.personDescription,
      )
      .selectRadio(
        `root_incident${index}_personsInvolved_${i}_view:serviceMember`,
        person['view:serviceMember'] ? 'Y' : 'N',
      );

    if (person['view:serviceMember']) {
      client
        .fill(
          `input[name="root_incident${index}_personsInvolved_${i}_rank"]`,
          person.rank,
        )
        .fill(
          `input[name="root_incident${index}_personsInvolved_${i}_unitAssigned"]`,
          person.unitAssigned,
        );
    }

    if (person.injuryDeathDate) {
      client.fillDate(
        `root_incident${index}_personsInvolved_${i}_injuryDeathDate`,
        person.injuryDeathDate,
      );
    }

    if (person.injuryDeath) {
      client.selectRadio(
        `root_incident${index}_personsInvolved_${i}_injuryDeath`,
        person.injuryDeath,
      );

      if (person.injuryDeath === 'Other') {
        client.fill(
          `input[name="root_incident${index}_personsInvolved_${i}_injuryDeathOther"]`,
          person.injuryDeathOther,
        );
      }
    }
    clickAddAnother(client, i, list);
  });
};

export const completePtsdIncidentDescription = (client, incident, index) => {
  client.fill(
    `input[name="root_incident${index}_incidentDescription"]`,
    incident.incidentDescription,
  );
};

export const completePtsdAdditionalEvents = (client, data, index) => {
  client.selectRadio(
    `root_view:enterAdditionalEvents${index}`,
    data[`view:enterAdditionalEvents${index}`] ? 'Y' : 'N',
  );
};

export const complete781AdditionalRemarks = (client, data) => {
  client.fill(
    `textarea[id="root_additionalRemarks781"]`,
    data.additionalRemarks781,
  );
};
