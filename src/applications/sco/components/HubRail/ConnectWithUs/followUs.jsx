import React from 'react';
import LiVaIconAndVaLink from '../shared/liVaIconAndVaLink';

const FollowUs = () => {
  return (
    <section>
      <h4>Follow us</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaIconAndVaLink
          href="https://www.facebook.com/gibillEducation/"
          text="Education Service on Facebook"
          iconName="facebook"
        />
        <LiVaIconAndVaLink
          href="https://www.facebook.com/VeteransBenefits"
          text="VBA on Facebook"
          iconName="facebook"
        />
        <LiVaIconAndVaLink
          href="https://www.instagram.com/vabenefits"
          text="VBA on Instagram"
          iconName="instagram"
        />
        <LiVaIconAndVaLink
          href="https://www.youtube.com/@VAVetBenefits"
          text="VBA on YouTube"
          iconName="youtube"
        />
      </ul>
    </section>
  );
};

export default FollowUs;
