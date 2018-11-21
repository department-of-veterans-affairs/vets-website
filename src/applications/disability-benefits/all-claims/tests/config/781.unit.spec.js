import { expect } from 'chai';

import { formConfig781, formConfig781a } from '../../config/781';

import { PTSD_INCIDENT_ITERATION } from '../../constants';

describe('781/781a incident form config iterators', () => {
  describe('781 incident form config', () => {
    it('should return a config object', () => {
      expect(formConfig781(PTSD_INCIDENT_ITERATION)).to.be.an('object');
    });

    it('should return three incident date page config objects', () => {
      const config = formConfig781(PTSD_INCIDENT_ITERATION);

      const testMultipleIncidentDateProps = () => {
        for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
          expect(config).to.haveOwnProperty(`incidentDate${i}`);

          expect(config[`incidentDate${i}`]).to.be.an('object');
        }
      };
      testMultipleIncidentDateProps();
    });
    it('should contain three incident properties', () => {
      const config = formConfig781(PTSD_INCIDENT_ITERATION);

      const testMultipleIncidentDateObjects = () => {
        for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
          expect(
            config[`incidentDate${i}`].schema.properties[`incident${i}`],
          ).to.be.an('object');
          expect(
            config[`incidentDate${i}`].schema.properties[`incident${i}`],
          ).to.haveOwnProperty('type');
        }
      };
      testMultipleIncidentDateObjects();
    });
  });
  describe('781a incident form config', () => {
    it('should return a config object', () => {
      expect(formConfig781a(PTSD_INCIDENT_ITERATION)).to.be.an('object');
    });

    it('should return three incident date page config objects', () => {
      const config = formConfig781a(PTSD_INCIDENT_ITERATION);

      const testMultipleIncidentDateProps = () => {
        for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
          expect(config).to.haveOwnProperty(`secondaryIncidentDate${i}`);

          expect(config[`secondaryIncidentDate${i}`]).to.be.an('object');
        }
      };
      testMultipleIncidentDateProps();
    });
    it('should contain three incident properties', () => {
      const config = formConfig781a(PTSD_INCIDENT_ITERATION);

      const testMultipleIncidentDateObjects = () => {
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
      };
      testMultipleIncidentDateObjects();
    });
  });
});
