export function pathToData(state, path) {
  switch (path) {
    case '/introduction':
      return {};

    case '/veteran-information/personal-information':
      return state.nameAndGeneralInformation;

    case '/veteran-information/va-information':
      return state.vaInformation;

    case '/insurance-information/additional-information':
      return state.additionalInformation;

    case '/veteran-information/demographic-information':
      return state.demographicInformation;

    case '/veteran-information/veteran-address':
      return state.veteranAddress;

    case '/insurance-information/general':
      return state.insuranceInformation;

    case '/insurance-information/medicare-medicaid':
      return state.medicareMedicaid;

    case '/military-service/service-information':
      return state.serviceInformation;

    case '/military-service/additional-information':
      return state.militaryAdditionalInfo;

    case '/household-information/financial-disclosure':
      return state.financialDisclosure;

    case '/household-information/spouse-information':
      return state.spouseInformation;

    case '/household-information/child-information':
      return state.childInformation;

    case '/household-information/annual-income':
      return state.annualIncome;

    case '/household-information/deductible-expenses':
      return state.deductibleExpenses;

    case '/review-and-submit':
      return {};

    default:
      throw new Error(`Unknown path ${path}`);
  }
}
