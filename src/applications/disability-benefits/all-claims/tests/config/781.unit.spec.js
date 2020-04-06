import { createFormConfig781, createFormConfig781a } from '../../config/781';

import { PTSD_INCIDENT_ITERATION } from '../../constants';

describe('781/781a incident form config iterators', () => {
  describe('781 incident form config', () => {
    test('should return a config object', () => {
      expect(createFormConfig781(PTSD_INCIDENT_ITERATION)).toBeInstanceOf(
        Object,
      );
    });

    test('should return three incident date page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`incidentDate${i}`);

        expect(config[`incidentDate${i}`]).toBeInstanceOf(Object);
      }
    });
    test('should return three incident description page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`incidentDescription${i}`);

        expect(config[`incidentDescription${i}`]).toBeInstanceOf(Object);
      }
    });
    test('should return three medals page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);
      const testMultipleIncidentMedalsProps = () => {
        for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
          expect(config).to.haveOwnProperty(`medals${i}`);

          expect(config[`medals${i}`]).toBeInstanceOf(Object);
        }
      };
      testMultipleIncidentMedalsProps();
    });
    test('should return three incident date page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(
          config[`incidentDate${i}`].schema.properties[`incident${i}`],
        ).toBeInstanceOf(Object);
        expect(
          config[`incidentDate${i}`].schema.properties[`incident${i}`],
        ).to.haveOwnProperty('type');
      }
    });
  });

  test('should return three incident location page config objects', () => {
    const config = createFormConfig781(PTSD_INCIDENT_ITERATION);

    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(config).to.haveOwnProperty(`incidentLocation${i}`);
      expect(config[`incidentLocation${i}`]).toBeInstanceOf(Object);
    }
  });

  describe('781a incident form config', () => {
    test('should return a config object', () => {
      expect(createFormConfig781a(PTSD_INCIDENT_ITERATION)).toBeInstanceOf(
        Object,
      );
    });

    test('should return three incident date page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`secondaryIncidentDate${i}`);

        expect(config[`secondaryIncidentDate${i}`]).toBeInstanceOf(Object);
      }
    });
    test('should return three incident description page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`secondaryIncidentDescription${i}`);

        expect(config[`secondaryIncidentDescription${i}`]).toBeInstanceOf(
          Object,
        );
      }
    });

    test('should contain three incident properties within incident date pages', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(
          config[`secondaryIncidentDate${i}`].schema.properties[
            `secondaryIncident${i}`
          ],
        ).toBeInstanceOf(Object);
        expect(
          config[`secondaryIncidentDate${i}`].schema.properties[
            `secondaryIncident${i}`
          ],
        ).to.haveOwnProperty('type');
      }
    });

    test('should return three incident location page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`secondaryIncidentLocation${i}`);
        expect(config[`secondaryIncidentLocation${i}`]).toBeInstanceOf(Object);
      }
    });

    test('should return three incident permission notice page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(
          `secondaryIncidentPermissionNotice${i}`,
        );
        expect(config[`secondaryIncidentPermissionNotice${i}`]).toBeInstanceOf(
          Object,
        );
      }
    });

    test('should return three incident authorities page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`secondaryIncidentAuthorities${i}`);
        expect(config[`secondaryIncidentAuthorities${i}`]).toBeInstanceOf(
          Object,
        );
      }
    });

    test('should return three additional events yes/no page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`ptsdSecondaryAdditionalEvents${i}`);

        expect(config[`ptsdSecondaryAdditionalEvents${i}`]).toBeInstanceOf(
          Object,
        );
      }
    });

    test('should contain three view additional event properties within additional events yes/no pages', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(
          config[`ptsdSecondaryAdditionalEvents${i}`].schema.properties[
            `view:enterAdditionalSecondaryEvents${i}`
          ],
        ).toBeInstanceOf(Object);

        expect(
          config[`ptsdSecondaryAdditionalEvents${i}`].schema.properties[
            `view:enterAdditionalSecondaryEvents${i}`
          ],
        ).to.haveOwnProperty('type');
      }
    });

    test('should return three secondary upload sources page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`secondaryUploadSources${i}`);

        expect(config[`secondaryUploadSources${i}`]).toBeInstanceOf(Object);
      }
    });

    test('should return three secondary upload sources choice page config objects', () => {
      const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`secondaryUploadSourcesChoice${i}`);

        expect(config[`secondaryUploadSourcesChoice${i}`]).toBeInstanceOf(
          Object,
        );
      }
    });
  });
});
