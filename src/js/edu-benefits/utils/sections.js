import routes from '../routes';

export function getSectionList() {
  return routes.map(route => route.props.path).filter(section => section !== '/submit-message');
}
