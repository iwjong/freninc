export type ProjectMedia = string | { src: string; width: number; height: number; alt?: string };

export type Project = {
  id: string;
  title: string;
  theme?: string;
  summary: string;
  client: string;
  service: string;
  year?: string;
  note?: string;
  media: ProjectMedia[];
  inquiryTopic?: string;
};

function numbered(folder: string, count: number, pad = 0, extension = "jpg") {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(pad, "0");
    return `/assets/projects/${folder}/gallery-${number}.${extension}`;
  });
}

export const projects: Project[] = [
  {
    id: "telfair-childrens-art-museum",
    title: "Telfair Children's Art Museum",
    theme: "Maritime",
    summary: "This Maritime theme turns William O. Golding's drawings into a playful digital environment for CAM's younger audience. A welcome mural, voyage map, projected seascape, and submarine-inspired interiors let children follow his routes from Savannah to the Arctic, China, and Cape Horn.",
    client: "Telfair Museums",
    service: "Environmental graphics, digital media, interactive exhibits",
    year: "2025",
    media: numbered("tcam-maritime", 29),
  },
  {
    id: "telfair-impressionism",
    title: "Telfair Children's Art Museum",
    theme: "Impressionism",
    summary: "This Impressionism concept makes foundational art ideas easier for younger audiences to enter. Geometric forms, color relationships, and layered compositions connect Impressionist references with a visual identity for children and families across physical and digital touchpoints.",
    client: "Telfair Museums",
    service: "Visual identity, storytelling, digital experiences",
    year: "2022 - 2023",
    media: numbered("tcam-impressionism", 30),
  },
  {
    id: "uva-experience-design",
    title: "Storytelling for Pediatric Care",
    theme: "Nature-inspired",
    summary: "Quiet Wonder is a storytelling-led healing environment for UVA Health Children’s that uses narrative, rather than spectacle, to bring calm to children in care. Nature-inspired scenes, original characters, and gentle color carry one voice across patient rooms, an installed Emergency Department mural, a picture book, and a custom AR app, turning clinical spaces into places that feel safe and settled.",
    client: "UVA Children's",
    service: "Experience design, storytelling, environmental graphics",
    year: "2022 - 2024",
    media: numbered("uva-bmt-er", 13),
  },
  {
    id: "ash-observation-unit",
    title: "Senior Observation Unit",
    theme: "Above the Bay",
    summary: "Above the Bay is an experience design for the senior observation unit at Ascension Sacred Heart Pensacola that maps local landmarks onto the hospital floor plan. Naval Air Station, Pensacola Bay, Pensacola Beach, Little Sabine Bay, and Fort Pickens each define a zone, brought to life through murals, animated aircraft, and daylight-inspired lighting that help older patients feel oriented, calm, and closer to home.",
    client: "Ascension Sacred Heart Pensacola",
    service: "Experience design, murals, lighting",
    year: "2022",
    media: numbered("ash-observation-unit", 8),
  },
  {
    id: "uva-wayfinding",
    title: "Experience Design System for Pediatrics",
    theme: "Nature-inspired",
    summary: "UVA Children's Experience Design System transformed the seventh floor of the Battle Building into a cohesive, child-centered environment, growing from a wayfinding challenge into a complete patient and family experience. River, plains, forest, and mountain zones, drawn from an American landscape narrative, unify signage, graphics, storytelling, and immersive media into one system that guides movement, supports waiting and recovery, and scales to future phases.",
    client: "UVA Health Children's",
    service: "Experience design, storytelling, environmental graphics",
    year: "2021 - 2023",
    media: numbered("uva-wayfinding", 13),
  },
  {
    id: "sfch-oncology",
    title: "Shore to Twilight: Hematology & Oncology Unit",
    theme: "Ocean depths",
    summary: "An ocean adventure that turns long hospital stays into a journey of discovery for children in hematology and oncology care. Guided by a small submarine, kids travel from the sunlit shore at the playroom, through the open ocean of the patient rooms, down to the twilight zone of the movie room, scanning the walls with a tablet or phone to bring sea creatures to life and unlock new content every day.",
    client: "Studer Family Children's Hospital",
    service: "Experience design, storytelling, interactive media, environmental graphics, AR",
    year: "2021",
    media: numbered("sfch-oncology", 12),
  },
  {
    id: "hca-healing-garden",
    title: "Nature, Indoors and Out: HCA Healing Garden",
    theme: "Savannah Landscape",
    summary: "A healing garden that brings nature to children, families, and staff both outdoors and in. Outside, greenery, water, and playful structures inspired by Savannah's landscape create space for quiet rest and active play, while inside, a large corridor screen extends the garden as an interactive fountain whose water patterns shift as people walk by.",
    client: "Memorial Health Dwaine & Cynthia Willett Children's Hospital of Savannah, HCA Healthcare",
    service: "Experience design, outdoor play space, interactive media",
    year: "2021",
    media: numbered("hca-healing-garden", 15),
  },
  {
    id: "sfch-picu-pacu-family",
    title: "Through the Glass: PICU & PACU",
    theme: "Aquarium",
    summary: "An aquarium-inspired healing environment that brings color and calm to children and families during intensive and post-surgical care. Across the PACU, PICU, and PICU family areas, each space has its own identity within one story, while AR mural interactions and inclusive learning activities invite gentle play through sight, sound, and discovery.",
    client: "Studer Family Children's Hospital, Ascension Sacred Heart",
    service: "Experience design, storytelling, environmental graphics, AR",
    year: "2020",
    media: numbered("sfch-picu-pacu-family", 21),
  },
  {
    id: "uva-therapeutic-playroom",
    title: "Play as Care: Therapeutic Playroom",
    theme: "Four Seasons",
    summary: "An interactive playroom where play becomes part of recovery, helping hospitalized children feel like kids again. The room cycles through the four seasons on its own, while three sensors respond to children's movement and change what they see and hear, turning rehabilitation into play that feels like exploring the outdoors.",
    client: "UVA Health Children's",
    service: "Experience design, interactive media, sensor-based play, rehabilitation integration",
    year: "2019-2020",
    media: numbered("uva-therapeutic-playroom", 16),
  },
];

export const inProgress: Project[] = [
  {
    id: "fren-park",
    title: "FREN Park: Where Play Meets Community",
    theme: "Movement, Nature & Play",
    summary: "A children's and family community park developed with the City of Pooler, where kids and families play, learn, and grow together. Climbing nets, splash pads, educational play, and interactive night lighting create an active, evolving destination for all ages, with flexible spaces for classes, camps, and celebrations that bring the community together.",
    client: "In partnership with the City of Pooler, Georgia",
    service: "Concept development, experience design, master planning, interactive environments",
    media: numbered("fren-park", 6),
  },
  {
    id: "world-outreach-church",
    title: "World Outreach Church",
    theme: "Large-scale Interactive Installations & Campus Wayfinding",
    summary: "A large-scale interactive installation and campus-wide wayfinding project for World Outreach Church. In development, the experience brings together immersive media, interactive exhibits and spatial storytelling to explore the person of Jesus and the history and impact of the English Bible. The visitor journey begins outdoors and continues through exhibition spaces and the café, with a cohesive wayfinding system that welcomes first-time visitors and helps them navigate the campus. Flexible content and installations are being designed to support renewed experiences, personal reflection and connections that continue beyond the visit.",
    client: "World Outreach Church",
    service: "Experience design, large-scale interactive installations, exhibition design, campus wayfinding",
    inquiryTopic: "world-outreach-church",
    media: [
      { src: "/assets/projects/world-outreach-church/gallery-1.jpg", width: 2614, height: 1468, alt: "Architectural illustration of World Outreach Church with landscaped arrival and gathering spaces" },
      { src: "/assets/projects/world-outreach-church/gallery-2.jpg", width: 1920, height: 948, alt: "Campus expansion visualization with outdoor terraces and gathering spaces" },
      { src: "/assets/projects/world-outreach-church/gallery-3.jpeg", width: 1536, height: 1024, alt: "Exterior wayfinding study with a directional sign beside a church entrance" },
      { src: "/assets/projects/world-outreach-church/gallery-4.jpeg", width: 1448, height: 1086, alt: "Interior wayfinding study with an overhead directional sign in a brick corridor" },
      { src: "/assets/projects/world-outreach-church/gallery-5.jpg", width: 1456, height: 617, alt: "Immersive café concept with a landscape media wall above gathering tables" },
      { src: "/assets/projects/world-outreach-church/gallery-6.jpg", width: 1440, height: 810, alt: "Axonometric exhibition layout study showing circular installations and visitor routes" },
      { src: "/assets/projects/world-outreach-church/gallery-7.jpg", width: 1920, height: 1080, alt: "Spatial study of a large circular overhead installation in the exhibition hall" },
      { src: "/assets/projects/world-outreach-church/gallery-8.jpg", width: 3344, height: 1882, alt: "Exhibition visualization with visitors gathered beneath a suspended circular media installation" },
      { src: "/assets/projects/world-outreach-church/gallery-9.jpg", width: 1920, height: 1080, alt: "Reception layout study showing a welcome desk and visitor circulation" },
      { src: "/assets/projects/world-outreach-church/gallery-10.jpg", width: 3344, height: 1882, alt: "Welcome area visualization with a large biblical landscape display behind the reception desk" },
      { src: "/assets/projects/world-outreach-church/gallery-11.jpg", width: 3234, height: 1882, alt: "Living Timeline exhibition visualization with historical Bible displays and interactive stations" },
      { src: "/assets/projects/world-outreach-church/gallery-12.jpg", width: 2608, height: 1462, alt: "Outdoor landscape visualization with walking paths, gathering areas and interactive fountains" },
    ],
  },
];
