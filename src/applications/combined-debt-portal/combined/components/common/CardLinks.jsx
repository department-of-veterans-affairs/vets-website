import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import RouterVaLink from './RouterVaLink';
import { LINK_REGISTRY } from '../../../debt-letters/const/linkRegistry';
import { tCdp } from '../../utils/helpers';
import {
  linkItemPropTypes,
  cardLinksPropTypes,
} from './prop-types/CommonPropTypes';

const LinkItem = ({ id, index, type, view, data }) => {
  const linkDef = LINK_REGISTRY[id];
  const href =
    typeof linkDef.href === 'function'
      ? linkDef.href({ refId: data.id })
      : linkDef.href;
  const text = tCdp(linkDef.textKey);
  const linkType = view === 'details' ? 'secondary' : undefined;

  return (
    <p
      className={
        index === 0
          ? 'vads-u-margin-top--0 vads-u-margin-bottom--0'
          : 'vads-u-margin-top--1 vads-u-margin-bottom--0'
      }
    >
      <RouterVaLink
        active
        data-testid={`link-${id}`}
        onClick={() => {
          recordEvent({ event: `cta-link-click-${type}-${view}-card` });
        }}
        href={href}
        text={text}
        label={`${text} for ${data.header}`}
        view={view}
        type={linkType}
      />
    </p>
  );
};

LinkItem.propTypes = linkItemPropTypes;

const CardLinks = ({ links, type, transformed, view }) => {
  if (links?.length === 0) return null;
  const validLinks = links.filter(linkId => LINK_REGISTRY[linkId]);
  if (!validLinks.length) return null;
  return (
    <div className="vads-u-margin-top--2">
      {validLinks.map((linkId, index) => (
        <LinkItem
          key={`${view}-link-${index}`}
          id={linkId}
          index={index}
          type={type}
          view={view}
          data={transformed}
        />
      ))}
    </div>
  );
};

CardLinks.propTypes = cardLinksPropTypes;

export default CardLinks;
