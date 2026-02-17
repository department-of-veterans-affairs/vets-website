import { expect } from 'chai';
import sinon from 'sinon';
import {
  handleGetItemName,
  handleAlertMaxItems,
  handleCancelAddTitle,
  handleCancelAddNo,
  handleDeleteTitle,
  handleDeleteDescription,
  handleDeleteNeedAtLeastOneDescription,
  handleDeleteYes,
  handleDeleteNo,
  handleCancelEditTitle,
  handleCancelEditDescription,
  handleCancelEditYes,
  handleCancelEditNo,
  handleSummaryTitle,
  handleDepends,
  servicePeriodInformationPage,
  servicePeriodsPages,
} from '../../pages/servicePeriodsPages';
import * as helpers from '../../utils/helpers';

describe('servicePeriodsPages', () => {
  let isVeteranStub;
  let isAuthorizedAgentStub;
  let hasServiceRecordStub;

  beforeEach(() => {
    isVeteranStub = sinon.stub(helpers, 'isVeteran');
    isAuthorizedAgentStub = sinon.stub(helpers, 'isAuthorizedAgent');
    hasServiceRecordStub = sinon.stub(helpers, 'hasServiceRecord');
  });

  afterEach(() => {
    isVeteranStub.restore();
    isAuthorizedAgentStub.restore();
    hasServiceRecordStub.restore();
  });

  describe('handleGetItemName', () => {
    it('should return service branch label when serviceBranch exists', () => {
      const item = { serviceBranch: 'AR' };
      const result = handleGetItemName(item);
      expect(result).to.equal('U.S. Army');
    });

    it('should return null when serviceBranch does not exist', () => {
      const item = {};
      const result = handleGetItemName(item);
      expect(result).to.be.null;
    });

    it('should return null when item is null', () => {
      const result = handleGetItemName(null);
      expect(result).to.be.null;
    });
  });

  describe('handleAlertMaxItems', () => {
    it('should return max items alert message', () => {
      const result = handleAlertMaxItems();
      expect(result).to.contain('You have added the maximum number');
    });
  });

  describe('handleCancelAddTitle', () => {
    it('should return specific service period title when service name exists', () => {
      const props = {
        getItemName: () => 'Army',
        itemData: {},
      };
      const result = handleCancelAddTitle(props);
      expect(result).to.equal('Cancel adding Army service period');
    });

    it('should return generic title when service name is null', () => {
      const props = {
        getItemName: () => null,
        itemData: {},
      };
      const result = handleCancelAddTitle(props);
      expect(result).to.equal('Cancel adding this service period');
    });
  });

  describe('handleCancelAddNo', () => {
    it('should return cancel add no message', () => {
      const result = handleCancelAddNo();
      expect(result).to.equal('No, keep this');
    });
  });

  describe('handleDeleteTitle', () => {
    it('should return delete title with service name', () => {
      const props = {
        getItemName: () => 'Navy',
        itemData: {},
      };
      const result = handleDeleteTitle(props);
      expect(result).to.equal(
        'Are you sure you want to remove this Navy service period?',
      );
    });
  });

  describe('handleDeleteDescription', () => {
    it('should return delete description with service name', () => {
      const props = {
        getItemName: () => 'Air Force',
        itemData: {},
      };
      const result = handleDeleteDescription(props);
      expect(result).to.contain('This will remove Air Force');
    });
  });

  describe('handleDeleteNeedAtLeastOneDescription', () => {
    it('should return need at least one description', () => {
      const result = handleDeleteNeedAtLeastOneDescription();
      expect(result).to.contain('If you remove this service period');
    });
  });

  describe('handleDeleteYes', () => {
    it('should return delete yes message', () => {
      const result = handleDeleteYes();
      expect(result).to.equal('Yes, remove this');
    });
  });

  describe('handleDeleteNo', () => {
    it('should return delete no message', () => {
      const result = handleDeleteNo();
      expect(result).to.equal('No, keep this');
    });
  });

  describe('handleCancelEditTitle', () => {
    it('should return cancel edit title with service name', () => {
      const props = {
        getItemName: () => 'Marines',
        itemData: {},
      };
      const result = handleCancelEditTitle(props);
      expect(result).to.equal('Cancel editing Marines service period?');
    });
  });

  describe('handleCancelEditDescription', () => {
    it('should return cancel edit description', () => {
      const result = handleCancelEditDescription();
      expect(result).to.contain('If you cancel, you’ll lose any changes');
    });
  });

  describe('handleCancelEditYes', () => {
    it('should return cancel edit yes message', () => {
      const result = handleCancelEditYes();
      expect(result).to.equal('Yes, cancel');
    });
  });

  describe('handleCancelEditNo', () => {
    it('should return cancel edit no message', () => {
      const result = handleCancelEditNo();
      expect(result).to.equal('No, keep this');
    });
  });

  describe('handleSummaryTitle', () => {
    it('should return service periods title when service record exists', () => {
      hasServiceRecordStub.returns(true);
      const result = handleSummaryTitle({});
      expect(result).to.equal('Veteran service period(s)');
    });

    it('should return review title when service record does not exist', () => {
      hasServiceRecordStub.returns(false);
      const result = handleSummaryTitle({});
      expect(result).to.equal('Review service period records');
    });
  });

  describe('handleDepends', () => {
    it('should return true when user is not veteran and not authorized agent', () => {
      isVeteranStub.returns(false);
      isAuthorizedAgentStub.returns(false);
      const result = handleDepends({});
      expect(result).to.be.true;
    });

    it('should return false when user is veteran', () => {
      isVeteranStub.returns(true);
      isAuthorizedAgentStub.returns(false);
      const result = handleDepends({});
      expect(result).to.be.false;
    });

    it('should return false when user is authorized agent', () => {
      isVeteranStub.returns(false);
      isAuthorizedAgentStub.returns(true);
      const result = handleDepends({});
      expect(result).to.be.false;
    });
  });

  describe('servicePeriodInformationPage', () => {
    it('should return page configuration with uiSchema and schema', () => {
      const result = servicePeriodInformationPage();
      expect(result).to.have.property('uiSchema');
      expect(result).to.have.property('schema');
    });

    it('should include serviceBranch in required fields', () => {
      const result = servicePeriodInformationPage();
      expect(result.schema.required).to.include('serviceBranch');
    });

    it('should have proper field order', () => {
      const result = servicePeriodInformationPage();
      expect(result.uiSchema['ui:order']).to.deep.equal([
        'serviceBranch',
        'militaryServiceNumber',
        'dateRange',
        'nationalGuardState',
      ]);
    });

    it('should include validateMilitaryHistory in validations', () => {
      const result = servicePeriodInformationPage();
      expect(result.uiSchema['ui:validations']).to.include(
        helpers.validateMilitaryHistory,
      );
    });
  });

  describe('serviceBranch autosuggest options', () => {
    let servicePeriodPage;

    beforeEach(() => {
      servicePeriodPage = servicePeriodInformationPage();
    });

    it('should return empty array for empty input', () => {
      const { getOptions } =
        servicePeriodPage.uiSchema.serviceBranch['ui:options'];
      const result = getOptions('');
      expect(result).to.deep.equal([]);
    });

    it('should return exact key match for short uppercase input', () => {
      const { getOptions } =
        servicePeriodPage.uiSchema.serviceBranch['ui:options'];
      const result = getOptions('AR');
      expect(result).to.have.length(1);
      expect(result[0].value).to.equal('AR');
      expect(result[0].label).to.equal('U.S. Army');
    });

    it('should return empty array for input shorter than 2 characters when no exact match', () => {
      const { getOptions } =
        servicePeriodPage.uiSchema.serviceBranch['ui:options'];
      const result = getOptions('a');
      expect(result).to.deep.equal([]);
    });

    it('should return filtered results for longer input', () => {
      const { getOptions } =
        servicePeriodPage.uiSchema.serviceBranch['ui:options'];
      const result = getOptions('army');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0].label.toLowerCase()).to.include('army');
    });

    it('should limit results to 10 items', () => {
      const { getOptions } =
        servicePeriodPage.uiSchema.serviceBranch['ui:options'];
      const result = getOptions('service');
      expect(result.length).to.be.at.most(10);
    });
  });

  describe('nationalGuardState hideIf logic', () => {
    let servicePeriodPage;

    beforeEach(() => {
      servicePeriodPage = servicePeriodInformationPage();
    });

    it('should hide field when service branch is not AG or NG (with index)', () => {
      const { hideIf } =
        servicePeriodPage.uiSchema.nationalGuardState['ui:options'];
      const formData = { serviceRecords: [{ serviceBranch: 'AR' }] };
      const result = hideIf(formData, 0);
      expect(result).to.be.true;
    });

    it('should show field when service branch is AG (with index)', () => {
      const { hideIf } =
        servicePeriodPage.uiSchema.nationalGuardState['ui:options'];
      const formData = { serviceRecords: [{ serviceBranch: 'AG' }] };
      const result = hideIf(formData, 0);
      expect(result).to.be.false;
    });

    it('should show field when service branch is NG (with index)', () => {
      const { hideIf } =
        servicePeriodPage.uiSchema.nationalGuardState['ui:options'];
      const formData = { serviceRecords: [{ serviceBranch: 'NG' }] };
      const result = hideIf(formData, 0);
      expect(result).to.be.false;
    });

    it('should hide field when service branch is not AG or NG (without index)', () => {
      const { hideIf } =
        servicePeriodPage.uiSchema.nationalGuardState['ui:options'];
      const formData = { serviceBranch: 'AR' };
      const result = hideIf(formData, null);
      expect(result).to.be.true;
    });

    it('should show field when service branch is AG (without index)', () => {
      const { hideIf } =
        servicePeriodPage.uiSchema.nationalGuardState['ui:options'];
      const formData = { serviceBranch: 'AG' };
      const result = hideIf(formData, null);
      expect(result).to.be.false;
    });
  });

  describe('servicePeriodsPages', () => {
    it('should return array builder pages configuration', () => {
      const result = servicePeriodsPages;
      expect(result).to.have.property('servicePeriods');
      expect(result).to.have.property('servicePeriodsSummary');
      expect(result).to.have.property('servicePeriodInformationPage');
    });

    it('should have correct paths for each page', () => {
      expect(servicePeriodsPages.servicePeriods.path).to.equal(
        'service-periods',
      );
      expect(servicePeriodsPages.servicePeriodsSummary.path).to.equal(
        'service-periods-summary',
      );
      expect(servicePeriodsPages.servicePeriodInformationPage.path).to.equal(
        'service-periods/:index/service-period',
      );
    });

    it('should have depends function for all pages', () => {
      expect(servicePeriodsPages.servicePeriods.depends).to.be.a('function');
      expect(servicePeriodsPages.servicePeriodsSummary.depends).to.be.a(
        'function',
      );
      expect(servicePeriodsPages.servicePeriodInformationPage.depends).to.be.a(
        'function',
      );
    });

    it('should have proper page titles', () => {
      expect(servicePeriodsPages.servicePeriods.title).to.equal(
        'Service periods',
      );
      expect(servicePeriodsPages.servicePeriodsSummary.title).to.equal(
        'Veteran service period(s) summary',
      );
      expect(servicePeriodsPages.servicePeriodInformationPage.title).to.equal(
        'Service period information',
      );
    });
  });
});
