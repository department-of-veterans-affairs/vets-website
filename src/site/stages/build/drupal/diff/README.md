# GraphQL response vs. Tome data by Model

[block_content](./block_content.md)

[~~consumer~~ (not used)](./consumer.md)

[crop](./crop.md)

[~~entity_subqueue~~ (not used)](./entity_subqueue.md)

[file](./file.md)

[media](./media.md)

[menu_link_content](./menu_link_content.md)

[node](./node.md)

[paragraph](./paragraph.md)

[~~redirect~~ (not used)](./redirect.md)

[~~section_association~~ (not used)](./section_association.md)

[~~taxonomy_term~~ (not used)](./taxonomy_term.md)

[user](./user.md)

## Assumptions

- Each model included in the Tome response **always** has the same key-value pairs for that particular model.
  - This is `invalid`. Many of the `paragraph` instances do **not** have the same key-value pairs.
