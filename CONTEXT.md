# p-cult.space Context

p-cult.space is a personal branded hub for Iv's streaming presence. This context records project-specific domain language so architecture work can use the site's own concepts.

## Language

**Streams Archive**:
The browsable set of past stream posts with dates, VOD links, metadata, descriptions, and timestamps.
_Avoid_: blog, posts, videos

**Stream Post**:
One archived stream represented by Markdown content and frontmatter.
_Avoid_: article, entry

**Timestamp**:
A named moment inside a stream VOD that can link directly to playback time.
_Avoid_: chapter, marker

**Friends/Community**:
Profiles for people and collaborators showcased by the site.
_Avoid_: users, members

**Support/Donation**:
Destinations where visitors can financially support Iv.
_Avoid_: payments, checkout

**Chaos Aesthetic**:
The site's controlled maximalist visual identity: dark-only, neon accents, rotations, glitch effects, and decorative motion.
_Avoid_: theme, component library

## Relationships

- A **Streams Archive** contains zero or more **Stream Posts**.
- A **Stream Post** can have zero or more **Timestamps**.
- **Friends/Community** profiles are separate from the **Streams Archive**.
- **Support/Donation** destinations are site-level links, not **Stream Post** content.
- The **Chaos Aesthetic** applies across the **Streams Archive**, **Friends/Community**, and **Support/Donation** pages.

## Example Dialogue

> **Dev:** "Should this YouTube URL live in the **Stream Post** or in the **Streams Archive** module?"
> **Domain expert:** "The URL belongs to the **Stream Post**, but timestamp URL generation belongs to the **Streams Archive**."

## Flagged Ambiguities

- "stream" can mean a live Twitch broadcast or an archived **Stream Post**. In this codebase, use **Stream Post** for saved Markdown content and **Streams Archive** for the collection view.
