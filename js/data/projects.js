/**
 * AS5 project directory — card-level metadata only.
 * Consumed by js/render-project-cards.js to populate the portfolio grid,
 * the homepage featured/carousel sections, and the "related projects"
 * widget on each project detail page. The actual long-form page content
 * (approach narrative, gallery, specs, timeline) lives in each project's
 * own static HTML file — this file only drives card rendering.
 *
 * category: "construction" | "partnerships" (primary portfolio filter)
 * status: "completed" | "in-progress" | "concept-approved"
 * type: secondary metadata shown on the card, not filterable
 */
window.AS5_PROJECTS = [
  {
    slug: "meridian-tower",
    title: "Meridian Tower",
    tagline: "A vertical spine of glass and steel engineered to bend, not break, with the wind.",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    category: "construction",
    type: "Commercial",
    status: "in-progress",
    location: "Nigeria",
    year: "2028",
  },
  {
    slug: "aster-residences",
    title: "The Aster Residences",
    tagline: "A quiet residential landmark built around a private interior garden.",
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    category: "construction",
    type: "Residential",
    status: "completed",
    location: "Nigeria",
    year: "2024",
  },
  {
    slug: "harbor-crossing-viaduct",
    title: "Harbor Crossing Viaduct",
    tagline: "A cable-stayed crossing engineered to move with the harbor, not against it.",
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
    category: "construction",
    type: "Infrastructure",
    status: "concept-approved",
    location: "Nigeria",
    year: "2029",
  },
  {
    slug: "lucerne-cultural-pavilion",
    title: "Lucerne Cultural Pavilion",
    tagline: "A single cantilevered roof plane unifying three galleries around an open civic court.",
    heroImage: "https://images.unsplash.com/photo-1554435493-93422e8220c8?q=80&w=1200&auto=format&fit=crop",
    category: "construction",
    type: "Cultural",
    status: "completed",
    location: "Nigeria",
    year: "2023",
  },
  {
    slug: "copper-quarter-residences",
    title: "Copper Quarter Residences",
    tagline: "A low-rise residential quarter organized around shared courtyards instead of a single tower.",
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    category: "construction",
    type: "Residential",
    status: "in-progress",
    location: "Nigeria",
    year: "2026",
  },
  {
    // PLACEHOLDER — 6th Construction entry added for the expanded portfolio; replace with real project details.
    slug: "greenview-court",
    title: "Greenview Court",
    tagline: "A mixed-use residential court planned around shared green space instead of parking frontage.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    category: "construction",
    type: "Residential",
    status: "concept-approved",
    location: "Nigeria",
    year: "2029",
  },
  {
    // PLACEHOLDER NAME — replace with real partner-approved project name.
    slug: "riverbank-estates-partnership",
    title: "Riverbank Estates Partnership",
    tagline: "A joint residential development delivered alongside a strategic land-holding partner.",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    category: "partnerships",
    type: "Residential",
    status: "in-progress",
    location: "Nigeria",
    year: "2027",
    partnerName: "Riverbank Estates",
  },
  {
    // PLACEHOLDER NAME — replace with real partner-approved project name.
    slug: "horizon-office-park-collaboration",
    title: "Horizon Office Park Collaboration",
    tagline: "A commercial office park delivered in collaboration with an institutional co-developer.",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    category: "partnerships",
    type: "Commercial",
    status: "completed",
    location: "Nigeria",
    year: "2022",
    partnerName: "Horizon Office Park",
  },
  {
    // PLACEHOLDER NAME — replace with real partner-approved project name.
    slug: "sunset-villas-joint-development",
    title: "Sunset Villas Joint Development",
    tagline: "A low-density villa community co-delivered under a shared-equity development structure.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    category: "partnerships",
    type: "Residential",
    status: "in-progress",
    location: "Nigeria",
    year: "2027",
    partnerName: "Sunset Villas",
  },
  {
    // PLACEHOLDER NAME — replace with real partner-approved project name.
    slug: "nova-heights-development-partnership",
    title: "Nova Heights Development Partnership",
    tagline: "A high-rise residential tower delivered under a long-term development partnership.",
    heroImage: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop",
    category: "partnerships",
    type: "Residential",
    status: "concept-approved",
    location: "Nigeria",
    year: "2030",
    partnerName: "Nova Heights",
  },
  {
    // PLACEHOLDER NAME — replace with real partner-approved project name.
    slug: "eastgate-commercial-hub-partnership",
    title: "Eastgate Commercial Hub Partnership",
    tagline: "A retail and commercial hub delivered with a strategic operating partner.",
    heroImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
    category: "partnerships",
    type: "Commercial",
    status: "completed",
    location: "Nigeria",
    year: "2023",
    partnerName: "Eastgate Commercial Hub",
  },
  {
    // PLACEHOLDER NAME — replace with real partner-approved project name.
    slug: "unity-health-centre-collaboration",
    title: "Unity Health Centre Collaboration",
    tagline: "A community health facility delivered in partnership with a healthcare operator.",
    heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    category: "partnerships",
    type: "Institutional",
    status: "in-progress",
    location: "Nigeria",
    year: "2026",
    partnerName: "Unity Health Centre",
  },
];
