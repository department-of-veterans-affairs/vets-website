import randomizedPortraits from './randomizer';

const createHomepageHeroRandomizer = () => {
  const containers = document.querySelectorAll('.veteran-portraits img');

  if (containers?.length) {
    randomizedPortraits.forEach((portrait, index) => {
      containers[index].src = `/img/portraits/${portrait}.png`;
    });
  }
};

export default createHomepageHeroRandomizer;
