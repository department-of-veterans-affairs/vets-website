import { MAP_MOVED } from '../../utils/actionTypes';

export const mapMoved = currentRadius => ({
  type: MAP_MOVED,
  currentRadius,
});
