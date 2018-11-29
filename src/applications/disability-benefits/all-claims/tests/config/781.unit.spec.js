import { expect } from 'chai';

import { createFormConfig781, createFormConfig781a } from '../../config/781';

import { PTSD_INCIDENT_ITERATION } from '../../constants';

describe('781/781a incident form config iterators', () => {
  describe('781 incident form config', () => {
    it('should return a config object', () => {
      expect(createFormConfig781(PTSD_INCIDENT_ITERATION)).to.be.an('object');
    });

    it('should return three incident support page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);
      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`incidentSupport${i}`);
        expect(config[`incidentSupport${i}`]).to.be.an('object');
      }
    });

    it('should return three incident date page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);
      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`incidentDate${i}`);
        expect(config[`incidentDate${i}`]).to.be.an('object');
      }
    });

    it('should contain three incident properties', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);
      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(
          config[`incidentDate${i}`].schema.properties[`incident${i}`],
        ).to.be.an('object');
        expect(
          config[`incidentDate${i}`].schema.properties[`incident${i}`],
        ).to.haveOwnProperty('type');
      }
    });

    it('should return three additional events yes/no page config objects', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);
      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(config).to.haveOwnProperty(`ptsdAdditionalEvents${i}`);

        expect(config[`ptsdAdditionalEvents${i}`]).to.be.an('object');
      }
    });

    it('should contain three view additional event properties within additional events yes/no pages', () => {
      const config = createFormConfig781(PTSD_INCIDENT_ITERATION);
      for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
        expect(
          config[`ptsdAdditionalEvents${i}`].schema.properties[
            `view:enterAdditionalEvents${i}`
          ],
        ).to.be.an('object');

        expect(
          config[`ptsdAdditionalEvents${i}`].schema.properties[
            `view:enterAdditionalEvents${i}`
          ],
        ).to.haveOwnProperty('type');
      }
    });
  });
});

describe('781a incident form config', () => {
  it('should return a config object', () => {
    expect(createFormConfig781a(PTSD_INCIDENT_ITERATION)).to.be.an('object');
  });

  it('should return three incident support page config objects', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(config).to.haveOwnProperty(`secondaryIncidentSupport${i}`);
      expect(config[`secondaryIncidentSupport${i}`]).to.be.an('object');
    }
  });

  it('should return three incident date page config objects', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);
    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(config).to.haveOwnProperty(`secondaryIncidentDate${i}`);
      expect(config[`secondaryIncidentDate${i}`]).to.be.an('object');
    }
  });

  it('should return three incident permission notice page config objects', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);
    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(config).to.haveOwnProperty(
        `secondaryIncidentPermissionNotice${i}`,
      );
      expect(config[`secondaryIncidentPermissionNotice${i}`]).to.be.an(
        'object',
      );
    }
  });

  it('should return three incident authorities page config objects', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);
    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(config).to.haveOwnProperty(`secondaryIncidentAuthorities${i}`);
      expect(config[`secondaryIncidentAuthorities${i}`]).to.be.an('object');
    }
  });

  it('should contain three incident properties', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);
    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(
        config[`secondaryIncidentDate${i}`].schema.properties[
          `secondaryIncident${i}`
        ],
      ).to.be.an('object');
      expect(
        config[`secondaryIncidentDate${i}`].schema.properties[
          `secondaryIncident${i}`
        ],
      ).to.haveOwnProperty('type');
    }
  });

  it('should return three additional events yes/no page config objects', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);

    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(config).to.haveOwnProperty(`ptsdSecondaryAdditionalEvents${i}`);
      expect(config[`ptsdSecondaryAdditionalEvents${i}`]).to.be.an('object');
    }
  });

  it('should contain three view additional event properties within additional events yes/no pages', () => {
    const config = createFormConfig781a(PTSD_INCIDENT_ITERATION);
    for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
      expect(
        config[`ptsdSecondaryAdditionalEvents${i}`].schema.properties[
          `view:enterAdditionalSecondaryEvents${i}`
        ],
      ).to.be.an('object');

      expect(
        config[`ptsdSecondaryAdditionalEvents${i}`].schema.properties[
          `view:enterAdditionalSecondaryEvents${i}`
        ],
      ).to.haveOwnProperty('type');
    }
  });
});
