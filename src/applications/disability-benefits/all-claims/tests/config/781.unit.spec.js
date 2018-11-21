import { expect } from 'chai';

import { formConfig781, formConfig781a } from '../../config/781';

describe('781/781a incident form config iterators', () => {
  describe('781 incident form config', () => {
    it('should return a config object', () => {
      expect(formConfig781(1)).to.be.an('object');
    });

    it('should return three incident date page config objects', () => {
      const config = formConfig781(3);

      expect(config).to.haveOwnProperty('incidentDate0');
      expect(config).to.haveOwnProperty('incidentDate1');
      expect(config).to.haveOwnProperty('incidentDate2');

      expect(config.incidentDate0).to.be.an('object');
      expect(config.incidentDate1).to.be.an('object');
      expect(config.incidentDate2).to.be.an('object');
    });

    it('should return three medals page config objects', () => {
      const config = formConfig781(3);

      expect(config).to.haveOwnProperty('medals0');
      expect(config).to.haveOwnProperty('medals1');
      expect(config).to.haveOwnProperty('medals2');

      expect(config.medals0).to.be.an('object');
      expect(config.medals1).to.be.an('object');
      expect(config.medals2).to.be.an('object');
    });

    it('should contain three incident properties', () => {
      const config = formConfig781(3);
      expect(config.incidentDate0.schema.properties.incident0).to.be.an(
        'object',
      );
      expect(config.incidentDate1.schema.properties.incident1).to.be.an(
        'object',
      );
      expect(config.incidentDate2.schema.properties.incident2).to.be.an(
        'object',
      );

      expect(
        config.incidentDate0.schema.properties.incident0,
      ).to.haveOwnProperty('type');
      expect(
        config.incidentDate1.schema.properties.incident1,
      ).to.haveOwnProperty('type');
      expect(
        config.incidentDate2.schema.properties.incident2,
      ).to.haveOwnProperty('type');
    });
  });
  describe('781a incident form config', () => {
    it('should return a config object', () => {
      expect(formConfig781a(1)).to.be.an('object');
    });

    it('should return three incident date page config objects', () => {
      const config = formConfig781a(3);

      expect(config).to.haveOwnProperty('secondaryIncidentDate0');
      expect(config).to.haveOwnProperty('secondaryIncidentDate1');
      expect(config).to.haveOwnProperty('secondaryIncidentDate2');

      expect(config.secondaryIncidentDate0).to.be.an('object');
      expect(config.secondaryIncidentDate1).to.be.an('object');
      expect(config.secondaryIncidentDate2).to.be.an('object');
    });
    it('should contain three incident properties', () => {
      const config = formConfig781a(3);
      expect(
        config.secondaryIncidentDate0.schema.properties.secondaryIncident0,
      ).to.be.an('object');
      expect(
        config.secondaryIncidentDate1.schema.properties.secondaryIncident1,
      ).to.be.an('object');
      expect(
        config.secondaryIncidentDate2.schema.properties.secondaryIncident2,
      ).to.be.an('object');

      expect(
        config.secondaryIncidentDate0.schema.properties.secondaryIncident0,
      ).to.haveOwnProperty('type');
      expect(
        config.secondaryIncidentDate1.schema.properties.secondaryIncident1,
      ).to.haveOwnProperty('type');
      expect(
        config.secondaryIncidentDate2.schema.properties.secondaryIncident2,
      ).to.haveOwnProperty('type');
    });
  });
});
