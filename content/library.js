/* ==========================================================================
   MENTORSHIP ARCHIVE and E-BOOKS — what appears on archive.html and ebooks.html
   --------------------------------------------------------------------------
   Every item opens a Google Drive link in a new tab. Paste the link in "url".
   While "url" is empty the item shows as "Coming soon" and can't be clicked.

   Drive sharing decides who can open it:
     - "Anyone with the link"  → any visitor can open it
     - "Restricted"            → only people you've shared it with (e.g. members)

   The titles below are SAMPLES to show the layout — replace them with the
   real message and book titles.
   ========================================================================== */
window.NF_LIBRARY = {

  archive: {
    /* "Open the whole folder" buttons. Leave empty to hide the button. */
    audioFolder: "",
    videoFolder: "",

    audio: [
      { title: "Doctrinal Purity",               speaker: "Pastor Dele Bamgboye", length: "", url: "" },
      { title: "Ministerial Integrity",          speaker: "Pastor Dele Bamgboye", length: "", url: "" },
      { title: "Kingdom Exploits",               speaker: "Pastor Dele Bamgboye", length: "", url: "" },
      { title: "Balancing Family and Ministry",  speaker: "Pastor Dele Bamgboye", length: "", url: "" }
    ],

    video: [
      { title: "The Minister of the Future",     speaker: "Pastor Dele Bamgboye", length: "", url: "", thumb: "" },
      { title: "Sound in the Spirit, Savvy in Leadership", speaker: "Pastor Dele Bamgboye", length: "", url: "", thumb: "" },
      { title: "Hungry for a Shift",             speaker: "Pastor Dele Bamgboye", length: "", url: "", thumb: "" }
    ]
  },

  ebooks: {
    folder: "",
    /* tone: "navy", "teal" or "mint" — the colour of the generated cover.
       Or set cover: "images/book-cover.jpg" to use a real cover image. */
    books: [
      { title: "Church Administration",  description: "A practical guide to running the house of God with order and excellence.", tone: "navy", url: "" },
      { title: "Ministerial Ethics",     description: "Standards of conduct for ministers in public and in private.",               tone: "teal", url: "" },
      { title: "Family and Ministry",    description: "Keeping the home strong while carrying a God-given assignment.",             tone: "mint", url: "" }
    ]
  }

};
