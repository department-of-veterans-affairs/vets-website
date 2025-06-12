export default VaHealthResources;
declare function VaHealthResources({ healthResourcesLinks }: {
    healthResourcesLinks: any;
}): React.JSX.Element;
declare namespace VaHealthResources {
    namespace propTypes {
        let healthResourcesLinks: PropTypes.Requireable<PropTypes.InferProps<{
            text: PropTypes.Requireable<string>;
            href: PropTypes.Requireable<string>;
        }>[]>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
