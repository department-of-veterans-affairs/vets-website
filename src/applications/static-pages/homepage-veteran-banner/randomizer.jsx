// shuffle array using Fisher-Yates shuffle
export const randomizeOrder = imageArray => {
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

const portraits = randomizeOrder(imagePaths);

export default portraits;
