// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import { calculateBoundingBox } from '../../../facility-locator/utils/facilityDistance';

export const generatePartialParams = (coordinates, RADIUS) => {
  const boundingBox = calculateBoundingBox(
    coordinates[1],
    coordinates[0],
    RADIUS,
  );
  return [
    'page=1',
    'per_page=2',
    `radius=${RADIUS}`,
    `latitude=${coordinates[1]}`,
    `longitude=${coordinates[0]}`,
    ...boundingBox.map(c => `bbox[]=${c}`),
  ];
};
