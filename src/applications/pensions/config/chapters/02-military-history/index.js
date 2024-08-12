import servicePeriod from './servicePeriod';
import hasOtherNames from './hasOtherNames';
import otherNames from './otherNames';
import { otherNamesPages } from './otherNamesPages';
import pow from './pow';

export default {
  title: 'Military history',
  pages: {
    servicePeriod,
    hasOtherNames,
    otherNames,
    ...otherNamesPages,
    pow,
  },
};
