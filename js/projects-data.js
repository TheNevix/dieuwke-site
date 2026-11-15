// Alle projecten op één plek. project.html?p=<slug> toont het project met die slug.
// Eigen foto's: zet ze in img/ en vervang "img/placeholder.svg" door je bestand.
window.PROJECTS = [
  {
    slug: "alfa",
    title: "Project Alfa",
    pin: "",
    tags: ["Design", "Web"],
    year: "2026",
    role: "Ontwerp en development",
    client: "Lorem BV",
    tools: "Figma, HTML, CSS",
    intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet.",
    story: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      "Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra."
    ],
    result: "Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
    cover: { src: "img/placeholder.svg", alt: "Hoofdfoto van Project Alfa" },
    photos: [
      { src: "img/placeholder.svg", alt: "Schetsen van Project Alfa", caption: "eerste schetsen" },
      { src: "img/placeholder.svg", alt: "Moodboard van Project Alfa", caption: "moodboard" },
      { src: "img/placeholder.svg", alt: "Eindresultaat van Project Alfa", caption: "eindresultaat" }
    ]
  },
  {
    slug: "beta",
    title: "Project Beta",
    pin: "pin-blue",
    tags: ["Fotografie"],
    year: "2025",
    role: "Fotograaf",
    client: "Ipsum Magazine",
    tools: "Camera, Lightroom",
    intro: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    story: [
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ],
    result: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    cover: { src: "img/placeholder.svg", alt: "Hoofdfoto van Project Beta" },
    photos: [
      { src: "img/placeholder.svg", alt: "Foto uit Project Beta", caption: "locatie" },
      { src: "img/placeholder.svg", alt: "Foto uit Project Beta", caption: "achter de schermen" },
      { src: "img/placeholder.svg", alt: "Foto uit Project Beta", caption: "de cover" }
    ]
  },
  {
    slug: "gamma",
    title: "Project Gamma",
    pin: "pin-green",
    tags: ["Branding", "Print"],
    year: "2025",
    role: "Grafisch ontwerp",
    client: "Dolor & Co",
    tools: "Illustrator, InDesign",
    intro: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    story: [
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.",
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
    ],
    result: "At vero eos et accusamus et iusto odio dignissimos ducimus.",
    cover: { src: "img/placeholder.svg", alt: "Hoofdfoto van Project Gamma" },
    photos: [
      { src: "img/placeholder.svg", alt: "Logo van Project Gamma", caption: "het logo" },
      { src: "img/placeholder.svg", alt: "Drukwerk van Project Gamma", caption: "drukwerk" },
      { src: "img/placeholder.svg", alt: "Verpakking van Project Gamma", caption: "verpakking" }
    ]
  },
  {
    slug: "delta",
    title: "Project Delta",
    pin: "pin-yellow",
    tags: ["App", "UX"],
    year: "2024",
    role: "UX-onderzoek en ontwerp",
    client: "Sit Amet Labs",
    tools: "Figma, Maze",
    intro: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    story: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."
    ],
    result: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.",
    cover: { src: "img/placeholder.svg", alt: "Hoofdfoto van Project Delta" },
    photos: [
      { src: "img/placeholder.svg", alt: "Wireframes van Project Delta", caption: "wireframes" },
      { src: "img/placeholder.svg", alt: "Gebruikerstest van Project Delta", caption: "gebruikerstest" },
      { src: "img/placeholder.svg", alt: "Schermen van Project Delta", caption: "de app" }
    ]
  },
  {
    slug: "epsilon",
    title: "Project Epsilon",
    pin: "pin-black",
    tags: ["Illustratie"],
    year: "2024",
    role: "Illustrator",
    client: "Eigen project",
    tools: "Procreate",
    intro: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    story: [
      "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime."
    ],
    result: "Itaque earum rerum hic tenetur a sapiente delectus.",
    cover: { src: "img/placeholder.svg", alt: "Hoofdillustratie van Project Epsilon" },
    photos: [
      { src: "img/placeholder.svg", alt: "Illustratie uit Project Epsilon", caption: "schets" },
      { src: "img/placeholder.svg", alt: "Illustratie uit Project Epsilon", caption: "inkleuren" },
      { src: "img/placeholder.svg", alt: "Illustratie uit Project Epsilon", caption: "klaar!" }
    ]
  },
  {
    slug: "zeta",
    title: "Project Zeta",
    pin: "",
    tags: ["Video", "Motion"],
    year: "2023",
    role: "Montage en animatie",
    client: "Consectetur Studio",
    tools: "Premiere, After Effects",
    intro: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    story: [
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
      "Nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit."
    ],
    result: "Nam libero tempore, cum soluta nobis est eligendi optio.",
    cover: { src: "img/placeholder.svg", alt: "Stilstaand beeld uit Project Zeta" },
    photos: [
      { src: "img/placeholder.svg", alt: "Storyboard van Project Zeta", caption: "storyboard" },
      { src: "img/placeholder.svg", alt: "Opnames van Project Zeta", caption: "opnames" },
      { src: "img/placeholder.svg", alt: "Eindmontage van Project Zeta", caption: "eindmontage" }
    ]
  }
];
