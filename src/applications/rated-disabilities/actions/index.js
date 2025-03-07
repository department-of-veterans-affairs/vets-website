import { getData } from '../util';

export function getRatedDisabilities() {
  return getData('/rated_disabilities');
}
