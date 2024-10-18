import totalNetWorth from './totalNetWorth';
import netWorthEstimation from './netWorthEstimation';
import transferredAssets from './transferredAssets';
import homeOwnership from './homeOwnership';
import homeAcreageMoreThanTwo from './homeAcreageMoreThanTwo';
import landMarketable from './landMarketable';
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
import hasOver25kAssets from './hasOver25kAssets';
import additionalDocuments from './additionalDocuments';

export default {
  title: 'Financial information',
  pages: {
    hasOver25kAssets,
    additionalDocuments,
    totalNetWorth,
    netWorthEstimation,
    transferredAssets,
    homeOwnership,
    homeAcreageMoreThanTwo,
    homeAcreageValue,
    landMarketable,
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
