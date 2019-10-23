# GraphQL response vs. Tome data by Model

[block_content](./block_content.md)

[consumer](./consumer.md)

[crop](./crop.md)

[entity_subqueue](./entity_subqueue.md)

[file](./file.md)

[media](./media.md)

[menu_link_content](./menu_link_content.md)

[node](./node.md)

[paragraph](./paragraph.md)

[redirect](./redirect.md)

[section_association](./section_association.md)

[taxonomy_term](./taxonomy_term.md)

[user](./user.md)

## Assumptions

- Each model included in the Tome response **always** has the same key-value pairs for that particular model.
  - This is `invalid`. Many of the `paragraph` instances do **not** have the same key-value pairs.
