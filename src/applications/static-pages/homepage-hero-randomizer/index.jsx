import React, { useEffect, useState } from 'react';
import './sass/homepage-hero.scss';

// shuffle array using Fisher-Yates shuffle
const randomizeOrder = imageArray => {
  const tempArray = imageArray;
  let currentIndex = Object.keys(tempArray).length;
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
  const gradientValues = ['#105f9f', '#144e84', '#143e6a'];

  const [randomized, setRandomized] = useState([]);

  // randomize order of images on pageload
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
