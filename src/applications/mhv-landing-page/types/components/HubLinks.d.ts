export default HubLinks;
declare function HubLinks({ hubs }: {
    hubs: any;
}): React.JSX.Element;
declare namespace HubLinks {
    namespace propTypes {
        let hubs: PropTypes.Requireable<PropTypes.InferProps<{
            title: PropTypes.Requireable<string>;
            links: PropTypes.Requireable<PropTypes.InferProps<{
                text: PropTypes.Requireable<string>;
                href: PropTypes.Requireable<string>;
            }>[]>;
        }>[]>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
