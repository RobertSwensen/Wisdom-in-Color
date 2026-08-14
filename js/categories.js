/* ============================================================
   CATEGORIES
   Add a new gallery by adding one line here. `slug` MUST match
   the lowercase folder name inside assets/categories/
   e.g. slug "trees" -> assets/categories/trees/*.jpg
   ============================================================ */
const CATEGORIES = [
    { slug: "animals",    label: "Animals"    },
    { slug: "biblical_arts", label: "Biblical Arts" },
    { slug: "contemporary", label: "Contemporary" },
    { slug: "children",   label: "Fantasy" },
    { slug: "figurative", label: "Figurative" },
    { slug: "landscapes", label: "Landscapes" }
];

function categoryLabel(slug) {
    const match = CATEGORIES.find(c => c.slug === slug);
    return match ? match.label : slug;
}
