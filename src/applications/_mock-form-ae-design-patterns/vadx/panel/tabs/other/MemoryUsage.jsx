import React, { useState, useEffect } from 'react';

export const MemoryUsage = () => {
  const [memoryUsage, setMemoryUsage] = useState(null);

  useEffect(() => {
    // Function to get browser tab's memory usage
    const updateMemoryUsage = () => {
      if (performance && performance.memory) {
        const used = Math.round(
          performance.memory.usedJSHeapSize / 1024 / 1024,
        );
        const total = Math.round(
          performance.memory.totalJSHeapSize / 1024 / 1024,
        );
        setMemoryUsage({ used, total });
      }
    };

    updateMemoryUsage();

    const interval = setInterval(updateMemoryUsage, 2000);

    return () => clearInterval(interval);
  }, []);

  return memoryUsage ? (
    <div className="vads-u-margin-bottom--0p5">
      <small>
        Memory Usage: {memoryUsage.used}
        MB / {memoryUsage.total}
        MB
      </small>
    </div>
  ) : null;
};
