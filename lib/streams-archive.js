"use strict";

const STREAMS_COLLECTION_TAG = "streams";
const DEFAULT_VISIBLE_TIMESTAMPS = 10;

function sortStreamsNewestFirst(streams) {
  return [...streams].sort((a, b) => b.date - a.date);
}

function extractStreamTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.filter((tag) => tag !== STREAMS_COLLECTION_TAG);
}

function streamExcerpt(text, length) {
  if (!text) {
    return text;
  }

  const plainText = String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= length) {
    return plainText;
  }

  return `${plainText.substring(0, length).trim()}...`;
}

function timestampToSeconds(timestamp) {
  if (!timestamp) {
    return 0;
  }

  const parts = String(timestamp).split(":").map((part) => parseInt(part, 10));

  if (parts.some(Number.isNaN)) {
    return 0;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return 0;
}

function timestampUrl(vodUrl, timestamp) {
  if (!vodUrl) {
    return null;
  }

  const seconds = timestampToSeconds(timestamp);

  try {
    const url = new URL(vodUrl);
    url.searchParams.set("t", String(seconds));
    return url.toString();
  } catch {
    const separator = vodUrl.includes("?") ? "&" : "?";
    return `${vodUrl}${separator}t=${seconds}`;
  }
}

function createTimestampGroups(timestamps, vodUrl, visibleCount = DEFAULT_VISIBLE_TIMESTAMPS) {
  const all = Array.isArray(timestamps)
    ? timestamps.map((timestamp) => ({
        time: timestamp.time,
        description: timestamp.description,
        url: timestampUrl(vodUrl, timestamp.time),
      }))
    : [];

  return {
    total: all.length,
    visible: all.slice(0, visibleCount),
    hidden: all.slice(visibleCount),
    hiddenCount: Math.max(all.length - visibleCount, 0),
  };
}

function normalizeStream(stream) {
  return {
    source: stream,
    title: stream.data.title,
    url: stream.url,
    date: stream.date,
    duration: stream.data.duration,
    thumbnail: stream.data.thumbnail,
    tags: extractStreamTags(stream.data.tags),
  };
}

function createStreamsArchive(streams) {
  return sortStreamsNewestFirst(streams).map(normalizeStream);
}

function formatDateDisplay(date) {
  return new Date(date).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

module.exports = {
  createStreamsArchive,
  createTimestampGroups,
  extractStreamTags,
  formatDateDisplay,
  sortStreamsNewestFirst,
  streamExcerpt,
  timestampToSeconds,
  timestampUrl,
};
