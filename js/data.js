// The narrative begins here. Data is not just data; it is a collection of stories.
// Images are summoned from the ether, ensuring the experience is light and immediate.
// ENHANCEMENT: Operational metrics added for Tactical Logistics System.

// ARCHITECTURE FIX: Explicitly attach to global scope to prevent scope isolation issues.
window.locations = [
    {
        name: "Great Blue Hole",
        type: "Marine Sinkhole",
        type_category: "marine",
        coords: [17.316, -87.535],
        description: "A colossal marine sinkhole, a portal to the ocean's underworld. Its perfect circular shape is a profound statement of geological time, inviting divers to explore its silent, ancient depths.",
        atmosphere: "Deep azure silence, the weight of water, a sense of falling into the earth's core.",
        image: "https://images.unsplash.com/photo-1587870529598-a893e4a2c161?q=80&w=1964",
        risk_level: 5,
        access_complexity: 5,
        required_gear: ["scuba_kit", "boat_transport", "first_aid"]
    },
    {
        name: "Hol Chan Marine Reserve",
        type: "Barrier Reef",
        type_category: "marine",
        coords: [17.861, -87.962],
        description: "A vibrant underwater thoroughfare, teeming with life. Here, the barrier reef parts, creating a channel where rays, sharks, and countless species congregate in a dazzling display of biodiversity.",
        atmosphere: "Sun-dappled water, a kaleidoscope of life, the gentle current a silent conductor.",
        image: "https://images.unsplash.com/photo-1552569434-53634a873894?q=80&w=1935",
        risk_level: 3,
        access_complexity: 3,
        required_gear: ["snorkel_gear", "boat_transport"]
    },
    {
        name: "Cockscomb Basin",
        type: "Wildlife Sanctuary",
        type_category: "nature",
        coords: [16.76, -88.58],
        description: "The world's first jaguar preserve. A sanctuary of dense jungle, cascading waterfalls, and the elusive spirits of the wild. The air is thick with the scent of earth and the sound of life.",
        atmosphere: "Humid air, the scent of damp earth and unseen blossoms, the distant call of a bird.",
        image: "https://images.unsplash.com/photo-1547847055-a01b4991206c?q=80&w=1974",
        risk_level: 4,
        access_complexity: 4,
        required_gear: ["hiking_boots", "navigation_kit", "hydration_pack"]
    },
    {
        name: "Xunantunich",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [17.089, -89.141],
        description: "The 'Stone Woman' stands sentinel over the jungle. Ascend El Castillo to touch the sky and gaze upon a kingdom reclaimed by nature, a silent testament to a civilization's profound connection to the cosmos.",
        atmosphere: "Sun-baked stone, a breeze whispering through ancient plazas, the vast green ocean of jungle below.",
        image: "https://images.unsplash.com/photo-1628160049448-b39178199344?q=80&w=1974",
        risk_level: 2,
        access_complexity: 2,
        required_gear: ["hiking_boots", "sun_protection"]
    },
    {
        name: "ATM Cave",
        type: "Archaeological Site",
        type_category: "ruins",
        coords: [17.186, -88.948],
        description: "Actun Tunichil Muknal. A journey into the Mayan underworld, a living museum of sacred ceremony. Traverse through water and darkness to find crystalized skeletons and echoes of ancient rituals.",
        atmosphere: "Cool, damp air, the echo of dripping water, the profound silence of a sacred, hidden world.",
        image: "https://images.unsplash.com/photo-1565017240312-326b58e72764?q=80&w=2070",
        risk_level: 5,
        access_complexity: 5,
        required_gear: ["helmet", "tactical_light", "water_shoes"]
    },
    {
        name: "Caracol",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [16.76389, -89.11750],
        description: "A large ancient Maya archaeological site, located in the Cayo District. It was one of the most important regional political centers of the Maya Lowlands during the Classic Period.",
        atmosphere: "The grandeur of a lost city, the oppressive heat of the day giving way to the cool of stone.",
        image: "https://images.unsplash.com/photo-1517581179733-39a2b3cba3c2?q=80&w=1974",
        risk_level: 3,
        access_complexity: 4,
        required_gear: ["hiking_boots", "hydration_pack", "all_terrain_vehicle"]
    },
    {
        name: "Lubaantun",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [16.28165, -88.95945],
        description: "A Late Classic Maya site known for its unusual construction of rounded stone blocks laid without mortar. The name means 'place of fallen stones' in the local Maya language.",
        atmosphere: "Rounded stones beneath your fingers, the mystery of a people who needed no mortar to build their world.",
        image: "https://images.unsplash.com/photo-1581219803359-24285b7336dc?q=80&w=1974",
        risk_level: 2,
        access_complexity: 3,
        required_gear: ["hiking_boots", "sun_protection"]
    },
    {
        name: "Nim Li Punit",
        type: "Mayan Ruins",
        type_category: "ruins",
        coords: [16.317, -88.800],
        description: "A Maya Classic Period site known for its numerous stelae, including one with a large headdress that gives the site its name, which means 'Big Hat' in the Kekchi Maya language.",
        atmosphere: "Intricate carvings telling forgotten stories, the shade of a giant stone hat in the tropical sun.",
        image: "https://images.unsplash.com/photo-1601643157324-159b2d043e4f?q=80&w=1974",
        risk_level: 2,
        access_complexity: 3,
        required_gear: ["hiking_boots", "sun_protection"]
    },
    {
        name: "Barton Creek Cave",
        type: "Cave / Archaeological Site",
        type_category: "nature",
        coords: [17.11278, -88.92806],
        description: "A large river cave that can be explored by canoe, featuring Maya artifacts and human remains, offering a glimpse into ancient rituals.",
        atmosphere: "The gentle splash of a paddle in a subterranean river, beams of light revealing ancient secrets.",
        image: "https://images.unsplash.com/photo-1589417937332-992ab4f28b34?q=80&w=2070",
        risk_level: 3,
        access_complexity: 3,
        required_gear: ["tactical_light", "canoe_access"]
    },
    {
        name: "Nohoch Che'en Caves Branch",
        type: "Cave System",
        type_category: "nature",
        coords: [17.195, -88.688],
        description: "An extensive cave system perfect for cave tubing adventures, floating through underground rivers and past stunning rock formations.",
        atmosphere: "The thrill of floating into darkness, the cool water a contrast to the jungle's heat.",
        image: "https://images.unsplash.com/photo-1614865993946-7a659042b4d4?q=80&w=1974",
        risk_level: 2,
        access_complexity: 2,
        required_gear: ["water_shoes", "tactical_light", "flotation_device"]
    },
    {
        name: "Community Baboon Sanctuary",
        type: "Wildlife Sanctuary",
        type_category: "nature",
        coords: [17.5560361, -88.5349778],
        description: "A community-managed sanctuary for the Yucatán black howler monkey, known locally as the 'baboon', where you can see these fascinating creatures in their natural habitat.",
        atmosphere: "A guttural roar from the canopy, the rustle of leaves, the feeling of being watched by curious eyes.",
        image: "https://images.unsplash.com/photo-1579273166180-0a25b3a2b464?q=80&w=1974",
        risk_level: 1,
        access_complexity: 2,
        required_gear: ["optics", "sun_protection"]
    },
    {
        name: "Glover's Reef",
        type: "Atoll / Marine Reserve",
        type_category: "marine",
        coords: [16.823, -87.791],
        description: "A pristine atoll and marine reserve, part of the Belize Barrier Reef, offering world-class diving and snorkeling in a remote and beautiful setting.",
        atmosphere: "The feeling of being at the edge of the world, surrounded by a universe of coral and turquoise water.",
        image: "https://images.unsplash.com/photo-1596424594398-639d336044a2?q=80&w=1932",
        risk_level: 4,
        access_complexity: 5,
        required_gear: ["scuba_kit", "boat_transport", "first_aid"]
    },
    {
        name: "Laughing Bird Caye",
        type: "National Park / Island",
        type_category: "marine",
        coords: [16.443443, -88.197250],
        description: "A beautiful island national park, named for the laughing gulls that once bred there, offering great snorkeling and diving on a faro, a type of shelf atoll.",
        atmosphere: "White sand, the cry of gulls, the gentle lapping of waves on a jewel-like island.",
        image: "https://images.unsplash.com/photo-1574512241380-5a3317734a75?q=80&w=1974",
        risk_level: 2,
        access_complexity: 4,
        required_gear: ["snorkel_gear", "boat_transport", "sun_protection"]
    },
    {
        name: "St. Herman's Blue Hole National Park",
        type: "National Park",
        type_category: "nature",
        coords: [17.156, -88.685],
        description: "An inland blue hole and cave system, perfect for a cool dip in the jungle, with hiking trails and the impressive St. Herman's Cave to explore.",
        atmosphere: "The sudden, shocking blue of the water in a jungle clearing, a cool respite from the tropical heat.",
        image: "https://images.unsplash.com/photo-1507525428034-b723a996f3d4?q=80&w=2070",
        risk_level: 3,
        access_complexity: 3,
        required_gear: ["hiking_boots", "swimwear", "tactical_light"]
    },
    {
        name: "Caye Caulker",
        type: "Island Village",
        type_category: "marine",
        coords: [17.7425, -88.025],
        description: "A laid-back island with a 'go slow' vibe, perfect for snorkeling, diving, and relaxing. The island is split by 'The Split', a narrow waterway.",
        atmosphere: "The rhythm of reggae music, the smell of barbecue, the warm embrace of a Caribbean breeze.",
        image: "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2070",
        risk_level: 1,
        access_complexity: 2,
        required_gear: ["swimwear", "boat_transport", "casual_attire"]
    }
];

// Fallback for older patterns
const locations = window.locations;
