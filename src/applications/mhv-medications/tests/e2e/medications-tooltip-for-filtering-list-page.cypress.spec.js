import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page ToolTip for Filtering', () => {
  const listPage = new MedicationsListPage();
  beforeEach(() => {
    const site = new MedicationsSite();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
  });
  it('visits Medications List ToolTip Counter Set To Zero', () => {
    listPage.verifyToolTipTextOnListPage(Data.TOOL_TIP_TEXT);
    listPage.verifyToolTipCounterSetToZero();
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('visits Medications List ToolTip Filter Collapsed', () => {
    listPage.verifyToolTipTextOnListPage(Data.TOOL_TIP_TEXT);
    listPage.verifyFilterCollapsedOnListPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('visits Medications List ToolTip Filter Expanded', () => {
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyToolTipTextOnListPage(Data.TOOL_TIP_TEXT);
    listPage.verifyFilterButtonWhenAccordionExpanded();
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('visits Medications List ToolTip Stop Hint Button', () => {
    listPage.verifyToolTipTextOnListPage(Data.TOOL_TIP_TEXT);
    listPage.clickStopShowingThisHintLinkOnListPage();
    listPage.verifyToolTipNotVisibleOnListPage();
    listPage.verifyFilterAccordionDropDownIsFocused();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
