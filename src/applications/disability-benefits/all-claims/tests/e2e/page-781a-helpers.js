import { clickAddAnother } from './disability-benefits-helpers';

export const selectWalkthrough781aChoice = (client, data) => {
  const upload781Choice = data['view:upload781aChoice'];
  client.selectRadio('root_view:upload781aChoice', upload781Choice);
};

export const getPtsdSecondaryIncident = (data, index) =>
  data[`secondaryIncident${index}`];

export const completePtsdSecondaryIncidentDate = (client, incident, index) => {
  client.fillDate(
    `root_secondaryIncident${index}_incidentDate`,
    incident.incidentDate,
  );
};

export const completePtsdSecondaryIncidentUnitAssignment = (
  client,
  incident,
  index,
) => {
  client
    .fill(
      `input[name="root_secondaryIncident${index}_unitAssigned"]`,
      incident.unitAssigned,
    )
    .fillDate(
      `root_secondaryIncident${index}_unitAssignedDates_from`,
      incident.unitAssignedDates.from,
    )
    .fillDate(
      `root_secondaryIncident${index}_unitAssignedDates_to`,
      incident.unitAssignedDates.to,
    );
};

export const completePtsdSecondaryIncidentLocation = (
  client,
  incident,
  index,
) => {
  client
    .fillAddress(
      `root_secondaryIncident${index}_incidentLocation`,
      incident.incidentLocation,
    )
    .fill(
      `textarea[id="root_secondaryIncident${index}_incidentLocation_additionalDetails"]`,
      incident.incidentLocation.additionalDetails,
    );
};

export const completePtsdSecondaryIncidentDescription = (
  client,
  incident,
  index,
) => {
  client.fill(
    `input[name="root_secondaryIncident${index}_incidentDescription"]`,
    incident.incidentDescription,
  );
};

export const completePtsdSecondaryOtherSources = (
  client,
  otherSources,
  index,
) => {
  client.selectRadio(
    `root_secondaryIncident${index}_otherSources`,
    otherSources ? 'Y' : 'N',
  );
};

export const getHelpPrivateMedicalTreatment = incident => {
  if (incident.otherSourcesHelp) {
    return incident.otherSourcesHelp['view:helpPrivateMedicalTreatment'];
  }

  return false;
};

export const getHelpRequestingStatements = incident => {
  if (incident.otherSourcesHelp) {
    return incident.otherSourcesHelp['view:helpRequestingStatements'];
  }

  return false;
};

export const completePtsdSecondaryOtherSourcesHelp = (
  client,
  incident,
  index,
) => {
  client
    .fillCheckbox(
      `input[name="root_incident${index}_otherSourcesHelp_view:helpPrivateMedicalTreatment"]`,
      getHelpPrivateMedicalTreatment(incident),
    )
    .fillCheckbox(
      `input[name="root_incident${index}_otherSourcesHelp_view:helpRequestingStatements"]`,
      getHelpRequestingStatements(incident),
    );
};

export const completePtsdSecondaryAuthorities = (client, incident, index) => {
  incident.authorities.forEach((authority, i, list) => {
    client
      .fill(
        `input[name="root_secondaryIncident${index}_authorities_${i}_name"]`,
        authority.name,
      )
      .fillAddress(
        `root_secondaryIncident${index}_authorities_${i}_address`,
        authority.address,
      );

    clickAddAnother(client, i, list);
  });
};

export const getUploadChoice = (data, index) =>
  data[`view:uploadChoice${index}`];

export const completePtsdSecondaryUploadSupportingSourcesChoice = (
  client,
  uploadChoice,
  index,
) => {
  client.selectRadio(
    `root_view:uploadChoice${index}`,
    uploadChoice ? 'Y' : 'N',
  );
};

export const completePtsd781aAdditionalEvents = (client, data, index) => {
  client.selectRadio(
    `root_view:enterAdditionalSecondaryEvents${index}`,
    data[`view:enterAdditionalSecondaryEvents${index}`] ? 'Y' : 'N',
  );
};

export const completePtsd781aTypeOfChanges = (client, data, type) => {
  const changes = data[`${type}Changes`];
  Object.keys(changes).forEach(change => {
    const selector = `root_${type}Changes_${change}`;
    const value = changes[change];
    if (change === 'otherExplanation' && changes.other) {
      client.fill(`textarea[id="${selector}"]`, value);
    } else {
      client.fillCheckbox(`input[name="${selector}"]`, value);
    }
  });
};
export const completePtsd781aAdditionalIncident = (client, data) => {
  client.fill(
    'textarea[id="root_additionalSecondaryIncidentText"]',
    data.additionalSecondaryIncidentText,
  );
};

export const completePtsd781aAdditionalChanges = (client, data) => {
  client.fill('textarea[id="root_additionalChanges"]', data.additionalChanges);
};
