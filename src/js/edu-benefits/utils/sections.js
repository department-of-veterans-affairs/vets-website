import routes from '../routes';
import _ from 'lodash';

export function getSectionList() {
  return routes.map(route => route.props.path).filter(section => section !== '/submit-message');
}

export function groupSections() {
  const sectionList = routes
    .filter(route => route.props.panel)
    .map(section => {
      return {
        name: section.props.name,
        panel: section.props.panel,
        path: section.props.path
      };
    });
  const panels = _.groupBy(sectionList, section => section.panel);

  return Object.keys(panels).map(panel => {
    return {
      name: panel,
      sections: panels[panel]
    };
  });
}
