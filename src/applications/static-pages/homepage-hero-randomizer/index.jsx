/*
  Hero component with veteran portraits that are in a random order on page load
*/

import React, { useEffect, useState } from 'react';

// shuffle array using Fisher-Yates shuffle
const randomizeOrder = imageArray => {
  const tempArray = imageArray;
  let currentIndex = tempArray.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [tempArray[currentIndex], tempArray[randomIndex]] = [
      tempArray[randomIndex],
      tempArray[currentIndex],
    ];
  }

  // grab first 3 items
  return tempArray.slice(0, 3);
};

// these files live in content-build
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
  // these hex values are not in the design system, using this implementation for usability testing only
  const gradientValues = ['#105f9f', '#144e84', '#143e6a'];

  const [randomized, setRandomized] = useState([]);

  // randomize order of images on first render only
  useEffect(() => {
    setRandomized(randomizeOrder(imagePaths));
  }, []);

  return randomized.map((image, index) => {
    return (
      <div className="vads-l-col" key={image}>
        <img
          className="homepage-hero__image"
          style={{ backgroundColor: gradientValues[index] }}
          src={`/img/portraits/${image}.png`}
          alt={`Headshot of ${image}`}
        />
      </div>
    );
  });
};

export default HeroRandom;
