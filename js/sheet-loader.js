/* ============================================================
   SHEET LOADER
   Lets a non-technical helper manage paintings from a phone
   using Google Sheets instead of editing code.

   SHEET COLUMNS (one row per painting):
     category     - e.g. "Animals", "Biblical Arts", "Landscapes"
                    (spelling/capitalization/spacing is forgiving -
                    see CATEGORY_ALIASES below)
     lot          - the painting's lot number (e.g. 100)
     title        - painting title
     dimensions   - e.g. "24 x 36"
     file         - the exact local image filename, matching a file
                    already uploaded to assets/categories/<category>/
                    on the site (e.g. "puppies.jpg") - used only if
                    imageurl is blank
     imageurl     - a direct Cloudinary (or other) image URL. If present,
                    this is used instead of the local file - this is the
                    primary image source going forward.

   SETUP (one-time, see README.md for full walkthrough):
   1. Create a Google Sheet with the columns above.
   2. File > Share > Publish to web > select "Comma-separated values (.csv)"
   3. Copy the published link and paste it below as SHEET_CSV_URL.

   If SHEET_CSV_URL is left blank, the site just uses the local
   data in js/paintings.js - nothing breaks.
   ============================================================ */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQA839SZsbxA5j9GyR7bq2GNJI1iC1eVCIsYC0tN6OXLQlcgp5KgjQJ_KrYPSfRn2IG0k1pZTYZm_mq/pub?gid=1345956786&single=true&output=csv";

/* The sheet's category text doesn't have to match the site's internal
   slug exactly - trailing spaces, capitalization, or using the display
   name instead of the slug are all handled here. Add a new line any
   time a new category is introduced.

   IMPORTANT: values here must map to the actual SLUG used in
   categories.js and the real assets/categories/<slug>/ folder name -
   NOT to the display label. The Fantasy category's slug is "children"
   (its display label is "Fantasy", but the folder on disk is "children"). */
const CATEGORY_ALIASES = {
    "animals": "animals",
    "biblical": "biblical_arts",
    "biblical arts": "biblical_arts",
    "biblical_arts": "biblical_arts",
    "children": "children",
    "a child's room": "children",
    "fantasy": "children",
    "contemporary": "contemporary",
    "figurative": "figurative",
    "landscapes": "landscapes"
};

function normalizeCategory(raw) {
    const key = (raw || "").trim().toLowerCase();
    return CATEGORY_ALIASES[key] || key.replace(/\s+/g, "_");
}

function loadPaintings(callback) {
    if (!SHEET_CSV_URL) {
        callback(PAINTINGS);
        return;
    }

    fetch(SHEET_CSV_URL)
        .then(res => res.text())
        .then(csvText => {
            const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

            const rows = parsed.data
                .map(normalizeRow)
                .filter(p => p.category && p.title && (p.imageUrl || p.file));

            if (rows.length > 0) {
                PAINTINGS = rows;
            }
            callback(PAINTINGS);
        })
        .catch(err => {
            console.warn("Could not load Google Sheet data, using local fallback.", err);
            callback(PAINTINGS);
        });
}

function normalizeRow(raw) {
    // Lowercase every column header so it doesn't matter how the
    // helper capitalized things in the sheet.
    const row = {};
    Object.keys(raw).forEach(k => {
        const key = (k || "").trim().toLowerCase();
        row[key] = (raw[k] || "").toString().trim();
    });

    const category = normalizeCategory(row.category);
    const title = row.title || "";
    const lot = row.lot ? parseInt(row.lot, 10) : null;

    // Sanitize filename: trim, collapse spaces to underscores, lowercase for
    // consistent matching against files on disk (Linux/GitHub is case-sensitive)
    let file = (row.file || "").trim().replace(/\s+/g, "_").toLowerCase();

    let imageUrl = (row.imageurl || "").trim();
    if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
        imageUrl = "";
    }

    return {
        id: (category + "_" + title).toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        category: category,
        lot: lot,
        file: file,
        imageUrl: imageUrl,
        title: title,
        medium: row.medium || "Oil on Canvas",
        dimensions: row.dimensions || "0\" x 0\"",
        year: row.year || "",
        priceOriginal: row.priceoriginal || "Inquire",
        pricePrint: row.priceprint || "Inquire"
    };
}

function paintingImageSrc(p) {
    // Cloudinary/remote URL is the primary source - it's what's actually
    // being used going forward, and works regardless of whether a local
    // file was ever uploaded to the site's assets folder.
    if (p.imageUrl) return p.imageUrl;
    if (p.file) {
        return `assets/categories/${p.category}/${p.file}`;
    }
    return "";
}
