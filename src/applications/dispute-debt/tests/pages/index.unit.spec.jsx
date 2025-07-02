import { expect } from 'chai';
import {
  veteranInformation,
  debtSelection,
  disputeReason,
  supportStatement,
} from '../../pages/index';

describe('Pages Index', () => {
  it('exports veteranInformation', () => {
    expect(veteranInformation).to.exist;
    expect(veteranInformation).to.be.an('object');
  });

  it('exports debtSelection', () => {
    expect(debtSelection).to.exist;
    expect(debtSelection).to.be.an('object');
  });

  it('exports disputeReason', () => {
    expect(disputeReason).to.exist;
    expect(disputeReason).to.be.an('object');
  });

  it('exports supportStatement', () => {
    expect(supportStatement).to.exist;
    expect(supportStatement).to.be.an('object');
  });

  it('all exports have uiSchema and schema properties', () => {
    const pages = [
      veteranInformation,
      debtSelection,
      disputeReason,
      supportStatement,
    ];

    pages.forEach((page, index) => {
      const pageName = [
        'veteranInformation',
        'debtSelection',
        'disputeReason',
        'supportStatement',
      ][index];
      expect(page.uiSchema, `${pageName} should have uiSchema`).to.exist;
      expect(page.schema, `${pageName} should have schema`).to.exist;
    });
  });

  it('all schemas are valid objects', () => {
    const pages = [
      veteranInformation,
      debtSelection,
      disputeReason,
      supportStatement,
    ];

    pages.forEach((page, index) => {
      const pageName = [
        'veteranInformation',
        'debtSelection',
        'disputeReason',
        'supportStatement',
      ][index];
      expect(page.schema, `${pageName} schema should be an object`).to.be.an(
        'object',
      );
      expect(page.schema.type, `${pageName} schema should have type`).to.exist;
      expect(
        page.schema.properties,
        `${pageName} schema should have properties`,
      ).to.exist;
    });
  });

  it('all uiSchemas are valid objects', () => {
    const pages = [
      veteranInformation,
      debtSelection,
      disputeReason,
      supportStatement,
    ];

    pages.forEach((page, index) => {
      const pageName = [
        'veteranInformation',
        'debtSelection',
        'disputeReason',
        'supportStatement',
      ][index];
      expect(
        page.uiSchema,
        `${pageName} uiSchema should be an object`,
      ).to.be.an('object');
    });
  });
});
