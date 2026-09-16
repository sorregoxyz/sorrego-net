const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

module.exports = function () {
  const raw = yaml.load(
    fs.readFileSync(path.join(__dirname, "cabinet-entries.yml"), "utf8")
  );

  // Alphabetical order within each letter
  const entries = [...raw.entries].sort((a, b) => a.term.localeCompare(b.term));

  // Group by first letter of the term
  const grouped = {};
  for (const entry of entries) {
    const letter = entry.term.trim()[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(entry);
  }

  // Every letter of the alphabet is represented — empty ones just have no entries.
  // This is what lets a letter with zero concepts still show up (unlinked) in the A-Z bar.
  const letters = ALPHABET.map((letter) => ({
    letter,
    hasEntries: Boolean(grouped[letter]),
    entries: grouped[letter] || [],
  }));

return {
  title: raw.title,
  subtitle: raw.subtitle,
  intro: raw.intro,
  letters,
};
};
