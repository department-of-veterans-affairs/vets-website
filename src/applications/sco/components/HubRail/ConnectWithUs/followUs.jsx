import React from 'react';
import LiVaIconAndVaLink from '../shared/liVaIconAndVaLink';

const FollowUs = () => {
  return (
    <section>
      <h4>Follow us</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaIconAndVaLink
          href="https://www.facebook.com/VeteransAffairs"
          text="Facebook"
          iconName="facebook"
        />
        <LiVaIconAndVaLink
          href="https://www.instagram.com/deptvetaffairs"
          text="Instagram"
          iconName="instagram"
        />
        <LiVaIconAndVaLink
          href="https://www.threads.net/@vabenefits"
          text="Threads"
          iconName="threads"
        />
        <LiVaIconAndVaLink
          href="https://x.com/DeptVetAffairs"
          text="X"
          iconName="x"
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
