import React from 'react';

const imagePaths = [
  'babu',
  'britton',
  'clark',
  'cogswell',
  'dinh',
  'henline',
  'pickard-locke',
  'singleton',
];

const HeroRandom = () => {
  return (
    <>
      {imagePaths.map((path, index) => {
        return (
          <div
            className="vads-u-background-color--primary vads-l-col"
            key={index}
          >
            <img
              src={`/img/portraits/${path}.png`}
              alt={`Portrait of ${path}`}
            />
          </div>
        );
      })}
    </>
  );
};

export default HeroRandom;
