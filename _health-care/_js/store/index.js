export function pathToData(state, path) {
  switch (path) {
    case '/introduction':
      return {};

    case '/personal-information/name-and-general-information':
      return state.nameAndGeneralInformation;

    case '/personal-information/va-information':
      return state.vaInformation;

    case '/personal-information/additional-information':
      return state.additionalInformation;

    case '/personal-information/demographic-information':
      return state.demographicInformation;

    case '/personal-information/veteran-address':
      return state.veteranAddress;

    case '/insurance-information/general':
      return state.insuranceInformation;

    case '/insurance-information/medicare-medicaid':
      return state.medicareMedicaid;

    case '/military-service/service-information':
      return state.serviceInformation;

    case '/military-service/additional-information':
      return state.militaryAdditionalInfo;

    case '/financial-assessment/financial-disclosure':
      return state.financialDisclosure;

    case '/financial-assessment/spouse-information':
      return state.spouseInformation;

    case '/financial-assessment/child-information':
      return state.childInformation;

    case '/financial-assessment/annual-income':
      return state.annualIncome;

    case '/financial-assessment/deductible-expenses':
      return state.deductibleExpenses;

    case '/review-and-submit':
      return {};

    default:
      throw new Error(`Unknown path ${path}`);
  }
}
