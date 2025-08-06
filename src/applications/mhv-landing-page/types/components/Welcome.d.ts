export default Welcome;
declare function Welcome({ name }: {
    name: any;
}): React.JSX.Element;
declare namespace Welcome {
    namespace propTypes {
        let name: PropTypes.Requireable<string>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
