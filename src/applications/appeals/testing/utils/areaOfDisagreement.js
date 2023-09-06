import { DISAGREEMENT_TYPES } from '../../shared/constants';
import { readableList } from '../../shared/utils/ui';

const cleanup = text => text.toLowerCase().replace(':', '');

export const disagreeWith = data => {
  const list = Object.keys(DISAGREEMENT_TYPES).map(type => {
    const value =
      type === 'otherEntry' ? data?.[type] : data?.disagreementOptions?.[type];
    return value ? cleanup(DISAGREEMENT_TYPES[type]) : '';
  });
  return `Disagree with ${readableList(list)}`;
};
