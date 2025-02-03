import { MAP_MOVED } from '../actionTypes';

export const mapMoved = currentRadius => ({
  type: MAP_MOVED,
  currentRadius,
});
