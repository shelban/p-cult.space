# Nunjucks / Eleventy Style Guide — p-cult.space

## Template Structure

```
src/_includes/layouts/
  base.njk      ← base HTML (head, GA, header, footer)
  stream.njk    ← extends base, stream-specific layout
src/_includes/
  chaos-decorations.njk  ← reusable floating decoratives
```

## Layouts

Always specify in frontmatter:

```yaml
---
layout: layouts/base.njk
---
```

## Extending

```nunjucks
{% extends "layouts/base.njk" %}
{% block content %}
  ...
{% endblock %}
```

## Including Components

```nunjucks
{% include "chaos-decorations.njk" %}
```

## Conditionals (for optional fields)

```nunjucks
{% if thumbnail %}
  <img src="{{ thumbnail }}" alt="{{ title }}">
{% endif %}
```

Never render empty elements for missing optional data.

## Available Filters

| Filter | Usage | Output |
|--------|-------|--------|
| `dateDisplay` | `{{ date \| dateDisplay }}` | "15 квітня 2025 р." |
| `timestampToSeconds` | `{{ ts.time \| timestampToSeconds }}` | `5025` |
| `truncate` | `{{ content \| truncate(200) }}` | "text..." |

## Collections

- `collections.streams` — all stream posts, sorted by date desc
- `collections.friends` — all friend profiles, shuffled per build (Fisher-Yates)

## Anti-patterns

- Don't hardcode content that belongs in frontmatter
- Don't use `{{ content }}` without `| safe` filter for HTML content
- Don't create individual pages for friends (`permalink: false` in friends.json)
