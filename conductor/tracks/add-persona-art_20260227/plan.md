# Implementation Plan: Add Persona Art to Homepage

Track ID: `add-persona-art_20260227`
Created: 2026-02-27
Status: completed

## Phase 1: Prepare Assets

### Tasks

- [x] **Task 1.1**: Convert iv1-0.png (purple graffiti) to WebP via ImageMagick `bc0aa40`
  - 227K PNG → 56K WebP
- [x] **Task 1.2**: Copy IB pattern WebP from zip archive
  - `/tmp/iv-assets/iv-2.webp` → `src/assets/iv-pattern.webp` (21K)
- [x] **Task 1.3**: Verify converted assets look correct visually

### Verification
- [x] **Verify 1.1**: Files in src/assets/, sizes reasonable (56K + 21K)

## Phase 2: Implement

### Tasks

- [x] **Task 2.1**: Wrap about-me content in `.about-me-text` div in `src/index.njk`
- [x] **Task 2.2**: Add `<img class="persona-sticker">` after `.about-me-text` wrapper
- [x] **Task 2.3**: Add CSS grid layout to `#about-me` (1fr + 200px columns)
- [x] **Task 2.4**: Add `.persona-sticker` CSS with rotate(9deg), neon drop-shadows, hover transition
- [x] **Task 2.5**: Add `#about-me::before` for IB pattern texture at 5% opacity
- [x] **Task 2.6**: Add mobile override at ≤600px (single column, reduced styling)

### Verification
- [x] **Verify 2.1**: `npm run build` passes (0.25s, 6 files written)
- [x] **Verify 2.2**: `<img class="persona-sticker">` present in built _site/index.html

## Phase 3: Finalize

### Tasks
- [x] **Task 3.1**: Commit all changes

### Verification
- [x] **Verify 3.1**: All acceptance criteria met

## Checkpoints

| Phase   | Checkpoint SHA | Date       | Status    |
| ------- | -------------- | ---------- | --------- |
| Phase 1 |                | 2026-02-27 | completed |
| Phase 2 |                | 2026-02-27 | completed |
| Phase 3 |                | 2026-02-27 | completed |
