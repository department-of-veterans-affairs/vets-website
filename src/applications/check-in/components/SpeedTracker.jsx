import React, { useEffect } from 'react';
import { apiSpeedLogger } from '../api/api-speed-tracker';

export default function SpeedTracker() {
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      const newLocal = `/img/testfile.png?nocache=`;
      apiSpeedLogger(fetch(`${newLocal}${Math.random()}`));
    }
  });
  return <></>;
}
