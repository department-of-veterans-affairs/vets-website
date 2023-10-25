import { expect } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {
  ENTER_PREVIEW_MODE,
  EXIT_PREVIEW_MODE,
  SET_PAGE_TITLE,
  DISPLAY_MODAL,
  ELIGIBILITY_CHANGED,
  FILTERS_CHANGED,
  BENEFICIARY_ZIP_CODE_CHANGED,
  CALCULATOR_INPUTS_CHANGED,
  UPDATE_ESTIMATED_BENEFITS,
  UPDATE_AUTOCOMPLETE_NAME,
  UPDATE_AUTOCOMPLETE_LOCATION,
  UPDATE_CURRENT_SEARCH_TAB,
  enterPreviewMode,
  exitPreviewMode,
  setPageTitle,
  showModal,
  hideModal,
  clearGeocodeError,
  eligibilityChange,
  filterChange,
  updateEligibilityAndFilters,
  beneficiaryZIPCodeChanged,
  calculatorInputChange,
  updateEstimatedBenefits,
  updateAutocompleteName,
  updateAutocompleteLocation,
  changeSearchTab,
} from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('gi/actions', () => {
  it('should enterPreviewMode', () => {
    const version = {};
    const action = enterPreviewMode(version);
    expect(action.type).to.eq(ENTER_PREVIEW_MODE);
  });
  it('should exitPreviewMode', () => {
    const action = exitPreviewMode();
    expect(action.type).to.eq(EXIT_PREVIEW_MODE);
  });
  it('should setPageTitle', () => {
    const title = 'Sample Title';
    const action = setPageTitle(title);
    expect(action.type).to.eq(SET_PAGE_TITLE);
  });
  it('should showModal', () => {
    const action = showModal(null);
    expect(action.type).to.eq(DISPLAY_MODAL);
  });
  it('should hideModal', () => {
    const action = hideModal();
    expect(action.type).to.eq(DISPLAY_MODAL);
    expect(action.modal).to.eq(null);
  });
  it('should eligibilityChange', () => {
    const fields = {};
    const action = eligibilityChange(fields);
    expect(action.type).to.eq(ELIGIBILITY_CHANGED);
  });
  it('should filterChange', () => {
    const filters = {};
    const action = filterChange(filters);
    expect(action.type).to.eq(FILTERS_CHANGED);
  });
  it('should updateEligibilityAndFilters', () => {
    const eligibility = {};
    const filters = {};
    const store = mockStore({});
    const actionTwo = store.dispatch(
      updateEligibilityAndFilters(eligibility, filters),
    );
    expect(actionTwo?.type).to.eq(undefined);
  });
  it('should catch error beneficiaryZIPCodeChanged', () => {
    const beneficiaryZIP = 'abc';
    const action = beneficiaryZIPCodeChanged(beneficiaryZIP);
    expect(action.type).to.eq(BENEFICIARY_ZIP_CODE_CHANGED);
  });
  it('should beneficiaryZIPCodeChanged', () => {
    const store = mockStore({});
    const beneficiaryZIP = 12345;
    const action = store.dispatch(beneficiaryZIPCodeChanged(beneficiaryZIP));
    expect(action?.type).to.eq(undefined);
  });
  it('should calculatorInputChange', () => {
    const field = {};
    const value = '';
    const action = calculatorInputChange(field, value);
    expect(action.type).to.eq(CALCULATOR_INPUTS_CHANGED);
  });
  it('should updateEstimatedBenefits', () => {
    const estimatedBenefits = {};
    const action = updateEstimatedBenefits(estimatedBenefits);
    expect(action.type).to.eq(UPDATE_ESTIMATED_BENEFITS);
  });
  it('should updateAutocompleteName', () => {
    const name = 'n/a';
    const action = updateAutocompleteName(name);
    expect(action.type).to.eq(UPDATE_AUTOCOMPLETE_NAME);
  });
  it('should updateAutocompleteLocation', () => {
    const name = 'n/a';
    const action = updateAutocompleteLocation(name);
    expect(action.type).to.eq(UPDATE_AUTOCOMPLETE_LOCATION);
  });
  it('should changeSearchTab', () => {
    const name = 'n/a';
    const action = changeSearchTab(name);
    expect(action.type).to.eq(UPDATE_CURRENT_SEARCH_TAB);
  });

  it('should clearGeocodeError', async () => {
    const store = mockStore({});
    const action = store.dispatch(clearGeocodeError());
    // console.log(`>>----------action=${JSON.stringify(action)}`);
    // const actionTwo = clearGeocodeError();
    // console.log(`>>----------actionTwo=${JSON.stringify(actionTwo)}`);
    expect(action?.type).to.eq(undefined);
  });
});
