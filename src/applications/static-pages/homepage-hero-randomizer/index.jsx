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
    currentIndex--;

    // And swap it with the current element.
    [tempArray[currentIndex], tempArray[randomIndex]] = [
      tempArray[randomIndex],
      tempArray[currentIndex],
    ];
  }

  // grab first 3 items
  return tempArray.slice(0, 3);
};

const HeroRandom = () => {
  const imagePaths = [
    { id: 1, name: 'babu' },
    { id: 2, name: 'britton' },
    { id: 3, name: 'clark' },
    { id: 4, name: 'cogswell' },
    { id: 5, name: 'dinh' },
    { id: 6, name: 'henline' },
    { id: 7, name: 'pickard-locke' },
    { id: 8, name: 'singleton' },
  ];

  const [randomized, setRandomized] = useState([]);

  // randomize order of images on pageload
  useEffect(() => {
    setRandomized(randomizeOrder(imagePaths));
  }, []);

  return randomized.map(image => {
    return (
      <div
        className="vads-u-background-color--primary vads-l-col"
        key={image.id}
      >
        <img
          className="homepage-hero__image"
          src={`/img/portraits/${image.name}.png`}
          alt={`Headshot of ${image.name}`}
        />
      </div>
    );
  });
};

export default HeroRandom;
