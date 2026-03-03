import totalNetWorth from './totalNetWorth';
import netWorthEstimation from './netWorthEstimation';
import netWorthEstimationFormNeeded from './netWorthEstimationFormNeeded';
import transferredAssets from './transferredAssets';
import transferredAssetsFormNeeded from './transferredAssetsFormNeeded';
import homeOwnership from './homeOwnership';
import homeAcreageMoreThanTwo from './homeAcreageMoreThanTwo';
import landMarketable from './landMarketable';
import landMarketableFormNeeded from './landMarketableFormNeeded';
import receivesIncome from './receivesIncome';
import incomeSources from './incomeSources';
import { incomeSourcesPages } from './incomeSourcesPages';
import hasCareExpenses from './hasCareExpenses';
import careExpenses from './careExpenses';
import { careExpensesPages } from './careExpensesPages';
import hasMedicalExpenses from './hasMedicalExpenses';
import { medicalExpensesPages } from './medicalExpensesPages';
import medicalExpenses from './medicalExpenses';
import homeAcreageValue from './homeAcreageValue';

export default {
  title: 'Financial information',
  pages: {
    totalNetWorth,
    netWorthEstimation,
    netWorthEstimationFormNeeded,
    transferredAssets,
    transferredAssetsFormNeeded,
    homeOwnership,
    homeAcreageMoreThanTwo,
    homeAcreageValue,
    landMarketable,
    landMarketableFormNeeded,
    receivesIncome,
    incomeSources,
    ...incomeSourcesPages,
    hasCareExpenses,
    careExpenses,
    ...careExpensesPages,
    hasMedicalExpenses,
    medicalExpenses,
    ...medicalExpensesPages,
  },
};
