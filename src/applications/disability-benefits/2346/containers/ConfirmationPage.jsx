import React from 'react';
import Scroll from 'react-scroll';
import { focusElement } from 'platform/utilities/ui';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    return (
      <>
        <h2>
          Your order is confirmed
          <i className="form2346 fas fa-check-circle fa-4x" />
        </h2>
        <section>
          <h2>What happens next</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            ex, repellendus est sed hic totam perspiciatis aut autem iusto earum
            obcaecati dolorum cumque exercitationem distinctio fugit voluptas
            commodi impedit voluptatibus.
          </p>
        </section>
        <section className="vads-u-margin-bottom--4">
          <h2>What to do in the meantime</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum cum
            provident laudantium quo qui id fuga minima vero aliquam,
            necessitatibus architecto asperiores nemo dolores non blanditiis
            rerum sequi dignissimos. Iste.
          </p>
        </section>
      </>
    );
  }
}

export default ConfirmationPage;
