import BranchOfService from './BranchOfService';
import DischargeYear from './DischargeYear';
import DischargeMonth from './DischargeMonth';
import Reason from './Reason';
import DischargeType from './DischargeType';
import Intention from './Intention';
import CourtMartial from './CourtMartial';
import PrevApplication from './PrevApplication';
import PrevApplicationYear from './PrevApplicationYear';
import PrevApplicationType from './PrevApplicationType';
import FailureToExhaust from './FailureToExhaust';
import PriorService from './PriorService';

// NOTE: The order of the array is important. It mirrors how the node should be displayed in order on the dom.
export default [
  BranchOfService,
  DischargeYear,
  DischargeMonth,
  Reason,
  DischargeType,
  Intention,
  CourtMartial,
  PrevApplication,
  PrevApplicationYear,
  PrevApplicationType,
  FailureToExhaust,
  PriorService,
];
