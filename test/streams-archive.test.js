"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createStreamsArchive,
  createTimestampGroups,
  extractStreamTags,
  streamExcerpt,
  timestampToSeconds,
  timestampUrl,
} = require("../lib/streams-archive");

test("streams archive is newest-first and strips Eleventy collection tags", () => {
  const archive = createStreamsArchive([
    {
      url: "/streams/old/",
      date: new Date("2025-04-15"),
      templateContent: "<p>old stream body</p>",
      data: {
        title: "old",
        tags: ["streams", "day"],
      },
    },
    {
      url: "/streams/new/",
      date: new Date("2026-02-12"),
      templateContent: "<p>new stream body</p>",
      data: {
        title: "new",
        tags: ["streams", "unboxing"],
      },
    },
  ]);

  assert.equal(archive[0].title, "new");
  assert.deepEqual(archive[0].tags, ["unboxing"]);
  assert.equal(archive[0].source.templateContent, "<p>new stream body</p>");
  assert.equal(archive[1].title, "old");
});

test("extractStreamTags tolerates missing tags", () => {
  assert.deepEqual(extractStreamTags(undefined), []);
  assert.deepEqual(extractStreamTags(["streams", "just-chatting"]), ["just-chatting"]);
});

test("streamExcerpt strips HTML and truncates plain text", () => {
  assert.equal(streamExcerpt("<p>Hello <strong>stream</strong></p>", 20), "Hello stream");
  assert.equal(streamExcerpt("0123456789 abc", 10), "0123456789...");
});

test("timestampToSeconds supports HH:MM:SS, MM:SS, and SS", () => {
  assert.equal(timestampToSeconds("01:23:45"), 5025);
  assert.equal(timestampToSeconds("23:45"), 1425);
  assert.equal(timestampToSeconds("45"), 45);
  assert.equal(timestampToSeconds("nope"), 0);
});

test("timestampUrl adds or replaces the t parameter", () => {
  assert.equal(
    timestampUrl("https://www.youtube.com/watch?v=abc", "00:01:30"),
    "https://www.youtube.com/watch?v=abc&t=90",
  );
  assert.equal(
    timestampUrl("https://www.youtube.com/watch?v=abc&t=12", "00:01:30"),
    "https://www.youtube.com/watch?v=abc&t=90",
  );
  assert.equal(timestampUrl("https://youtu.be/abc", "00:01:30"), "https://youtu.be/abc?t=90");
  assert.equal(timestampUrl(null, "00:01:30"), null);
});

test("createTimestampGroups precomputes visible and hidden timestamp rows", () => {
  const groups = createTimestampGroups(
    [
      { time: "00:00:01", description: "one" },
      { time: "00:00:02", description: "two" },
      { time: "00:00:03", description: "three" },
    ],
    "https://youtu.be/abc",
    2,
  );

  assert.equal(groups.total, 3);
  assert.equal(groups.visible.length, 2);
  assert.equal(groups.hidden.length, 1);
  assert.equal(groups.hiddenCount, 1);
  assert.equal(groups.visible[0].url, "https://youtu.be/abc?t=1");
});
