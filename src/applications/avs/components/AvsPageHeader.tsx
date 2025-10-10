import React from 'react';
import type { AvsPageHeaderProps } from '../types';

const stripAvsTitle = (lines: string[]): string[] => {
  return lines.filter(line => {
    return !line.match(/^\s*After[- ]Visit Summary\s*$/i);
  });
};

const AvsPageHeader: React.FC<AvsPageHeaderProps> = ({ text }) => {
  if (!text) return null;

  let lines = text.split('\n');
  lines = stripAvsTitle(lines);
  return (
    <>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 && <br role="presentation" />}
        </React.Fragment>
      ))}
    </>
  );
};

export default AvsPageHeader;
