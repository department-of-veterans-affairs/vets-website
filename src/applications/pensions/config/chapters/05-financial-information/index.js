import totalNetWorth from './totalNetWorth';
import netWorthEstimation from './netWorthEstimation';
import transferredAssets from './transferredAssets';
import homeOwnership from './homeOwnership';
import homeAcreageMoreThanTwo from './homeAcreageMoreThanTwo';
import landMarketable from './landMarketable';
import receivesIncome from './receivesIncome';
import incomeSources from './incomeSources';
import hasCareExpenses from './hasCareExpenses';
import careExpenses from './careExpenses';
import hasMedicalExpenses from './hasMedicalExpenses';
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
    hasCareExpenses,
    careExpenses,
    hasMedicalExpenses,
    medicalExpenses,
  },
};
