/* ==========================================================================
   EVENT PAGES — photos and videos from previous seasons
   --------------------------------------------------------------------------
   Edit this file to update the "From previous seasons" part of each event page.
   No other file needs to change.

   PHOTOS  Put the image in /images/ (use a NEW file name, never overwrite one),
           then add:   { src: "images/your-photo.jpg", alt: "What the photo shows" }

   VIDEOS  Paste a YouTube link or a Google Drive video link:
             { title: "Session title", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" }
             { title: "Session title", url: "https://drive.google.com/file/d/FILE_ID/view" }
           YouTube and Drive videos play on the page. For Drive, the file's sharing
           must be "Anyone with the link".  Optional: thumb: "images/cover.jpg"

   SEASONS Newest first. Each season becomes a tab when there is more than one.

   The photos below are general network photos used as placeholders —
   replace them with photos from each event.
   ========================================================================== */
window.NF_EVENTS = {

  "scale-session": {
    seasons: [
      {
        name: "Past sessions",
        photos: [
          { src: "images/about-minister.jpg",       alt: "A minister at a New Frontiers gathering" },
          { src: "images/impact-audience.jpg",      alt: "Ministers listening during a session" },
          { src: "images/connect-congregation.jpg", alt: "Ministers standing in worship in the auditorium" }
        ],
        videos: []
      }
    ]
  },

  "online-classroom": {
    seasons: [
      {
        name: "Past classes",
        photos: [
          { src: "images/impact-audience.jpg",      alt: "Ministers listening during a class" },
          { src: "images/about-minister.jpg",       alt: "A minister at a New Frontiers gathering" }
        ],
        videos: []
      }
    ]
  },

  "quarterly-summit": {
    seasons: [
      {
        name: "Past summits",
        photos: [
          { src: "images/connect-congregation.jpg", alt: "The auditorium full of ministers at a summit" },
          { src: "images/hero-audience.jpg",        alt: "A packed auditorium of ministers" },
          { src: "images/impact-audience.jpg",      alt: "Ministers listening at a summit session" },
          { src: "images/about-minister.jpg",       alt: "A minister at the summit" }
        ],
        videos: []
      }
    ]
  }

};
