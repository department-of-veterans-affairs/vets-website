import spouseReasonToRemove from './spouseReasonToRemove';
import spouseMarriageEnded from './spouseMarriageEnded';
import spouseDeath from './spouseDeath';

import childIsStepChild from './childIsStepchild';

import parentReasonToRemove from './parentReasonToRemove';

// Routing to remove dependent followup pages based on relationship
export default {
  Spouse: [
    { path: 'marriage-reason-to-remove', page: spouseReasonToRemove },
    { path: 'marriage-ended', page: spouseMarriageEnded },
    { path: 'marriage-death', page: spouseDeath },
  ],

  Child: [{ path: 'is-stepchild', page: childIsStepChild }],

  Parent: [{ path: 'parent-reason-to-remove', page: parentReasonToRemove }],
};
