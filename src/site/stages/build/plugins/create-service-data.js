/* eslint-disable no-param-reassign */

function createServiceData(buildSettings) {
  return (files, metalsmith, done) => {
    const { drupalData } = buildSettings;

    if (!drupalData) {
      done();
      return;
    }
    const drupals = drupalData.data.nodeQuery.entities;
    const bufferData = [];
    for (const services of drupals) {
      if (services.fieldLocalHealthCareService) {
        for (const healthItem of services.fieldLocalHealthCareService) {
          if (healthItem.entity && healthItem.entity.fieldAbout) {
            let opStatus = {
              'apiId': services.fieldFacilityLocatorApiId,
              'healthServiceId': healthItem.entity.entityId,
              'service': healthItem.entity.fieldRegionalHealthService.entity.fieldServiceNameAndDescripti.entity.name,
              'status': healthItem.entity.fieldAbout.entity.fieldOperatingStatus,
              'notes': healthItem.entity.fieldAbout.entity.fieldOperatingStatusNotes ? healthItem.entity.fieldAbout.entity.fieldOperatingStatusNotes.value : '',
             }
            bufferData.push({
              [services.fieldFacilityLocatorApiId]: opStatus,
            });
          }
        }
      }
    }

    const drupalServicesPage = JSON.stringify(bufferData);
    files['drupal/facility-services.json'] = {
      contents: Buffer.from(drupalServicesPage),
    };

    done();
  };
}

module.exports = createServiceData;
