export type Lang = "en" | "fr";
export type Tx = { en: string; fr: string };
export type Art =
  | "wave" | "flow" | "neural" | "bridge" | "checks" | "globe" | "editor" | "sync"
  | "calendar" | "chat" | "phone" | "shop" | "rag" | "board" | "metrics";
export type Status = "shipped" | "ongoing" | "soon";
export type RowId = "experience" | "imagem" | "projects" | "soon";
export type ProfileId = "recruiter" | "manager" | "engineer" | "guest";

export const LINKS = {
  github: "https://github.com/DevRohan05",
  linkedin: "https://www.linkedin.com/in/roro05/",
  email: "rohanrajput050902@gmail.com",
  cv: "/Rohan_Rajput_CV.pdf",
  unreality: "https://github.com/Unreality-Tech/my-project",
};

export type Item = {
  id: string;
  row: RowId;
  art: Art;
  hue: number;
  status: Status;
  title: Tx;
  tagline: Tx;
  badge: Tx;
  period?: Tx;
  synopsis: Tx;
  highlights: Tx[];
  stack: string[];
  href?: string;
  /** [lat, lon] the hero globe turns to while this item is featured */
  focus?: [number, number];
  /** short proof points shown under the hero title */
  facts?: Tx[];
  /** optional screenshot in /public; replaces the animated scene when set */
  image?: string;
};

export const items: Item[] = [
  // ───────── Experience
  {
    id: "imagem",
    row: "experience",
    art: "editor",
    focus: [48.4, -71.1],
    facts: [{ en: "~3 years", fr: "~3 ans" }, { en: "Full lifecycle", fr: "Cycle complet" }, { en: "C# · C++ · Java", fr: "C# · C++ · Java" }],
    hue: 195,
    status: "shipped",
    title: { en: "Programmer Analyst", fr: "Analyste-programmeur" },
    tagline: { en: "Systèmes Médicaux Imagem · Chicoutimi, QC", fr: "Systèmes Médicaux Imagem · Chicoutimi (QC)" },
    badge: { en: "Experience · ~3 years", fr: "Expérience · ~3 ans" },
    period: { en: "Oct 2023 – Jun 2026", fr: "oct. 2023 – juin 2026" },
    synopsis: {
      en: "Nearly three years on medical dictation software used in hospitals across Quebec, from analysis and development to testing and deployment.",
      fr: "Près de trois ans sur un logiciel de dictée médicale utilisé dans des hôpitaux du Québec, de l'analyse au déploiement en passant par le développement et les tests.",
    },
    highlights: [
      { en: "Delivered software across the full lifecycle (development, testing, deployment) for C#, C++ and Java (Spring) applications.", fr: "Livraison de logiciels sur tout le cycle (développement, tests, déploiement) pour des applications C#, C++ et Java (Spring)." },
      { en: "Built new features and maintained existing systems to improve functionality, performance and reliability.", fr: "Développement de nouvelles fonctionnalités et maintenance de systèmes existants pour en améliorer les fonctions, la performance et la fiabilité." },
      { en: "Developed and maintained a GWT-based Java web application, front end and back end.", fr: "Développement et maintenance d'une application web Java basée sur GWT, côté client et serveur." },
      { en: "Analysed and scoped projects that use AI to turn manual, human-driven workflows into automated ones.", fr: "Analyse et cadrage de projets utilisant l'IA pour automatiser des flux de travail manuels." },
      { en: "Ongoing refactoring to strengthen maintainability and reduce technical debt.", fr: "Refactorisation continue pour améliorer la maintenabilité et réduire la dette technique." },
      { en: "Oracle work with Toad, source control with Git and SourceTree, Docker for containerised builds.", fr: "Travail sur Oracle avec Toad, gestion de code avec Git et SourceTree, Docker pour les builds conteneurisés." },
    ],
    stack: ["C#", "C++", "Java / Spring", "GWT", "Oracle", "Docker", "Git"],
  },
  {
    id: "labourly",
    row: "experience",
    art: "sync",
    focus: [43.0, -81.2],
    facts: [{ en: "ASP.NET 6", fr: "ASP.NET 6" }, { en: "Zoom + Google APIs", fr: "API Zoom + Google" }, { en: "Summer 2023", fr: "Été 2023" }],
    hue: 45,
    status: "shipped",
    title: { en: "Web Development Intern", fr: "Stagiaire en développement web" },
    tagline: { en: "Labourly · London, ON", fr: "Labourly · London (ON)" },
    badge: { en: "Experience · Internship", fr: "Expérience · Stage" },
    period: { en: "Jun – Aug 2023", fr: "juin – août 2023" },
    synopsis: {
      en: "A summer building a web app that plugs into Zoom and Google, plus work on a third-party recording tool.",
      fr: "Un été à développer une application web branchée sur Zoom et Google, et à contribuer à un outil tiers d'enregistrement.",
    },
    highlights: [
      { en: "Built a web application with C# ASP.NET 6 MVC and the CodeFirst approach, integrating the Zoom and Google APIs.", fr: "Développement d'une application web en C# ASP.NET 6 MVC (CodeFirst) intégrant les API Zoom et Google." },
      { en: "Contributed to the design and development of Zoom Recording Downloader, a third-party web application.", fr: "Contribution à la conception et au développement de Zoom Recording Downloader, une application web tierce." },
      { en: "Assisted with database management in MySQL and SQL Server.", fr: "Aide à la gestion de bases de données MySQL et SQL Server." },
      { en: "Researched and analysed AI methods for potential integration into the product.", fr: "Recherche et analyse de méthodes d'IA pour une intégration éventuelle au produit." },
    ],
    stack: ["ASP.NET 6 MVC", "C#", "MySQL", "SQL Server", "Zoom API", "Google APIs"],
  },

  // ───────── Inside Imagem
  {
    id: "psvox",
    row: "imagem",
    art: "wave",
    focus: [48.4, -71.1],
    facts: [{ en: "10+ hospitals & institutions", fr: "10+ hôpitaux et institutions" }, { en: "100+ doctors & clinics", fr: "100+ médecins et cliniques" }, { en: "Across Quebec", fr: "Partout au Québec" }],
    hue: 190,
    status: "shipped",
    title: { en: "PSVOX: Voice to Report", fr: "PSVOX : de la voix au rapport" },
    tagline: { en: "AI speech recognition for Quebec hospitals", fr: "Reconnaissance vocale par IA pour les hôpitaux du Québec" },
    badge: { en: "Imagem · In production", fr: "Imagem · En production" },
    period: { en: "2023 – 2026", fr: "2023 – 2026" },
    synopsis: {
      en: "Helped integrate an AI-driven speech-recognition system into PSVOX PC, the company's dictation software, now used by 10+ hospitals and institutions and 100+ doctors and clinics across Quebec.",
      fr: "Contribution à l'intégration d'un système de reconnaissance vocale par IA dans PSVOX PC, le logiciel de dictée de l'entreprise, utilisé par plus de 10 hôpitaux et institutions et plus de 100 médecins et cliniques au Québec.",
    },
    highlights: [
      { en: "Deployed to institutions including CHUM, Bas-Saint-Laurent, Gaspésie and Saguenay–Lac-Saint-Jean.", fr: "Déployé dans des institutions dont le CHUM, le Bas-Saint-Laurent, la Gaspésie et le Saguenay–Lac-Saint-Jean." },
      { en: "Used by 100+ doctors, clinics and other practitioners.", fr: "Utilisé par plus de 100 médecins, cliniques et autres praticiens." },
    ],
    stack: ["AI speech recognition", "Medical dictation", "Healthcare software"],
  },
  {
    id: "psweb",
    row: "imagem",
    art: "flow",
    focus: [48.4, -71.1],
    facts: [{ en: "Solo migration", fr: "Migration en solo" }, { en: "JWT-secured", fr: "Sécurisé par JWT" }, { en: "Oracle · GWT", fr: "Oracle · GWT" }],
    hue: 265,
    status: "shipped",
    title: { en: "PSWEB: The Migration", fr: "PSWEB : la migration" },
    tagline: { en: "A solo move to a JWT-secured server interface", fr: "Une migration en solo vers une interface serveur sécurisée par JWT" },
    badge: { en: "Imagem · Solo project", fr: "Imagem · Projet en solo" },
    period: { en: "2023 – 2026", fr: "2023 – 2026" },
    synopsis: {
      en: "Migrated the full PSWEB web application (Google Web Toolkit: client, models, dispatch handlers, server) on my own, replacing direct token-based database calls with a server interface that validates each user's JWT session.",
      fr: "Migration complète, en solo, de l'application web PSWEB (Google Web Toolkit : client, modèles, dispatch handlers, serveur) : les appels directs à la base par jetons sont remplacés par une interface serveur qui valide le JWT de chaque session.",
    },
    highlights: [
      { en: "The interface validates the user's JWT for the session, then handles each request.", fr: "L'interface valide le JWT de l'utilisateur pour la session, puis traite chaque requête." },
      { en: "Moved every Oracle SQL request behind the new interface.", fr: "Déplacement de toutes les requêtes SQL Oracle derrière la nouvelle interface." },
      { en: "Modernised the screen where doctors sign, sending the report back into the workflow system.", fr: "Modernisation de l'écran de signature des médecins, qui renvoie le rapport dans le système de flux de travail." },
    ],
    stack: ["Google Web Toolkit", "Java", "JWT", "Oracle"],
  },
  {
    id: "ollama",
    row: "imagem",
    art: "neural",
    focus: [46.0, -72.0],
    facts: [{ en: "Lower token cost", fr: "Coût en jetons réduit" }, { en: "Fast on real hardware", fr: "Rapide sur matériel réel" }, { en: "Medical dictionary", fr: "Dictionnaire médical" }],
    hue: 150,
    status: "shipped",
    title: { en: "Ollama Lab", fr: "Labo Ollama" },
    tagline: { en: "Cutting token costs without slowing doctors down", fr: "Réduire les coûts en jetons sans ralentir les médecins" },
    badge: { en: "Imagem · AI analysis", fr: "Imagem · Analyse IA" },
    synopsis: {
      en: "An AI analysis with Ollama to lower token costs and get the best medical-dictionary spell correction, while keeping the full request round-trip fast on the hardware clients actually have.",
      fr: "Analyse IA avec Ollama pour réduire les coûts en jetons et obtenir la meilleure correction orthographique du dictionnaire médical, tout en gardant l'aller-retour complet rapide sur le matériel réel des clients.",
    },
    highlights: [
      { en: "Measured the full round-trip (payload out, response back) in Postman.", fr: "Mesure de l'aller-retour complet (envoi, réponse) dans Postman." },
      { en: "Tuned for the specs of the computers clients could be running.", fr: "Optimisation en fonction des spécifications des ordinateurs des clients." },
    ],
    stack: ["Ollama", "LLMs", "Postman", "Performance tuning"],
  },
  {
    id: "recognosco",
    row: "imagem",
    art: "bridge",
    focus: [51.0, 10.0],
    facts: [{ en: "C# library", fr: "Bibliothèque C#" }, { en: "German partner", fr: "Partenaire allemand" }, { en: "Shared by apps", fr: "Partagée entre applications" }],
    hue: 30,
    status: "shipped",
    title: { en: "Recognosco Connect", fr: "Recognosco Connect" },
    tagline: { en: "A C# bridge to a German dictionary service", fr: "Un pont C# vers un service de dictionnaires allemand" },
    badge: { en: "Imagem · Team", fr: "Imagem · Équipe" },
    synopsis: {
      en: "Co-built a C# library that talks to Recognosco, a Germany-based company, over API to handle medical dictionaries and return responses to whichever application needs them, without hampering the base software's performance.",
      fr: "Co-développement d'une bibliothèque C# qui communique par API avec Recognosco, une entreprise allemande, pour gérer les dictionnaires médicaux et renvoyer les réponses à toute application qui en a besoin, sans nuire aux performances du logiciel de base.",
    },
    highlights: [
      { en: "One shared library serving several applications.", fr: "Une bibliothèque partagée au service de plusieurs applications." },
      { en: "Designed so dictionary calls don't slow the core software.", fr: "Conçue pour que les appels au dictionnaire ne ralentissent pas le logiciel principal." },
    ],
    stack: ["C#", "REST API", "Integration"],
  },

  // ───────── Projects
  {
    id: "unreality",
    row: "projects",
    art: "globe",
    focus: [45.4, -75.7],
    facts: [{ en: "Team of 5", fr: "Équipe de 5" }, { en: "Lead developer", fr: "Développeur principal" }, { en: "In progress", fr: "En cours" }],
    hue: 350,
    status: "ongoing",
    title: { en: "Unreality", fr: "Unreality" },
    tagline: { en: "Connecting people over distances", fr: "Rapprocher les gens à distance" },
    badge: { en: "Team of 5 · Lead developer", fr: "Équipe de 5 · Développeur principal" },
    period: { en: "2026 · Ongoing", fr: "2026 · En cours" },
    synopsis: {
      en: "A company website for a startup that connects people over distances with modern tech. I set up the organisation, lead the team of five and built almost every page.",
      fr: "Site web d'une startup qui rapproche les gens à distance grâce à la technologie. J'ai mis en place l'organisation, dirigé l'équipe de cinq et développé presque toutes les pages.",
    },
    highlights: [
      { en: "Set up the GitHub organisation, branches and pull-request workflow.", fr: "Mise en place de l'organisation GitHub, des branches et du flux de pull requests." },
      { en: "Built almost every page and keep modernising the interface.", fr: "Développement de presque toutes les pages et modernisation continue de l'interface." },
      { en: "Taught the team Git, GitHub, wireframes and analysis; reviewed and merged their work.", fr: "Formation de l'équipe à Git, GitHub, aux wireframes et à l'analyse; révision et fusion de leur travail." },
    ],
    stack: ["Web", "Git / GitHub", "Wireframing", "Team lead"],
    href: LINKS.unreality,
  },
  {
    id: "hotel",
    row: "projects",
    art: "calendar",
    hue: 205,
    status: "shipped",
    title: { en: "Hotel Reservation System", fr: "Système de réservation d'hôtel" },
    tagline: { en: "Bookings, payments and invoices", fr: "Réservations, paiements et factures" },
    badge: { en: "Selected project", fr: "Projet choisi" },
    synopsis: {
      en: "A hotel management system with email verification over SMTP, availability checks, booking management, online payment, cancellation refunds and invoice generation.",
      fr: "Système de gestion d'hôtel avec vérification par courriel SMTP, vérification des disponibilités, gestion des réservations, paiement en ligne, remboursements d'annulation et génération de factures.",
    },
    highlights: [
      { en: "Email verification for login and registration.", fr: "Vérification par courriel à la connexion et à l'inscription." },
      { en: "Online payment, cancellation refunds and invoices.", fr: "Paiement en ligne, remboursements d'annulation et factures." },
    ],
    stack: ["PHP", "MySQL", "JavaScript", "Swiper JS", "AJAX"],
  },
  {
    id: "forum",
    row: "projects",
    art: "chat",
    hue: 285,
    status: "shipped",
    title: { en: "Tech Products Forum", fr: "Forum de produits techno" },
    tagline: { en: "Discussion and messaging", fr: "Discussion et messagerie" },
    badge: { en: "Selected project", fr: "Projet choisi" },
    synopsis: { en: "A discussion and messaging forum built with ASP.NET MVC.", fr: "Forum de discussion et de messagerie construit avec ASP.NET MVC." },
    highlights: [{ en: "Built with ASP.NET MVC.", fr: "Construit avec ASP.NET MVC." }],
    stack: ["ASP.NET MVC", "C#"],
  },
  {
    id: "mobile",
    row: "projects",
    art: "phone",
    hue: 170,
    status: "shipped",
    title: { en: "Mobile Apps", fr: "Applications mobiles" },
    tagline: { en: "Ionic + React and native Android", fr: "Ionic + React et Android natif" },
    badge: { en: "Selected project", fr: "Projet choisi" },
    synopsis: {
      en: "A cross-platform app with Ionic and React (cart system and tax calculator) and native Android apps in Kotlin.",
      fr: "Application multiplateforme avec Ionic et React (panier et calcul de taxes) et applications Android natives en Kotlin.",
    },
    highlights: [
      { en: "Cart system and tax calculator.", fr: "Système de panier et calcul de taxes." },
      { en: "Native Android apps with Android Studio.", fr: "Applications Android natives avec Android Studio." },
    ],
    stack: ["Ionic", "React", "Kotlin", "Android Studio"],
  },
  {
    id: "shop",
    row: "projects",
    art: "shop",
    hue: 20,
    status: "shipped",
    title: { en: "Gym Products Store", fr: "Boutique de produits de gym" },
    tagline: { en: "Catalogue and checkout", fr: "Catalogue et paiement" },
    badge: { en: "Selected project", fr: "Projet choisi" },
    synopsis: { en: "An e-commerce web app with a product catalogue and shopping-cart checkout.", fr: "Application web de commerce électronique avec catalogue de produits et paiement par panier." },
    highlights: [{ en: "Shopping-cart system with checkout.", fr: "Système de panier avec paiement." }],
    stack: ["PHP", "MySQL"],
  },

  // ───────── Coming soon (planned, not built yet)
  {
    id: "rag",
    row: "soon",
    art: "rag",
    focus: [45.4, -75.7],
    facts: [{ en: "Python · FastAPI", fr: "Python · FastAPI" }, { en: "Streaming answers", fr: "Réponses en continu" }, { en: "Planned", fr: "Prévu" }],
    hue: 175,
    status: "soon",
    title: { en: "RAG Assistant", fr: "Assistant RAG" },
    tagline: { en: "Streaming AI answers, with evals", fr: "Réponses IA en continu, avec évaluations" },
    badge: { en: "Planned · Building next", fr: "Prévu · Prochain projet" },
    synopsis: {
      en: "Planned: a Python FastAPI and React app that answers questions over documents, streams its responses, calls tools, and ships with an evaluation suite that measures answer quality.",
      fr: "Prévu : une application Python FastAPI et React qui répond à des questions sur des documents, diffuse ses réponses, appelle des outils et inclut une suite d'évaluation mesurant la qualité des réponses.",
    },
    highlights: [
      { en: "Streaming responses and tool calling.", fr: "Réponses en continu et appels d'outils." },
      { en: "Automated evaluation of answer quality.", fr: "Évaluation automatisée de la qualité des réponses." },
    ],
    stack: ["Python", "FastAPI", "React", "TypeScript", "LLM evals"],
  },
  {
    id: "board",
    row: "soon",
    art: "board",
    hue: 305,
    status: "soon",
    title: { en: "Live Board", fr: "Tableau en direct" },
    tagline: { en: "Real-time collaboration", fr: "Collaboration en temps réel" },
    badge: { en: "Planned · Building next", fr: "Prévu · Prochain projet" },
    synopsis: {
      en: "Planned: a real-time collaborative board in TypeScript with WebSockets, authentication and Postgres, tested and shipped through CI/CD in Docker.",
      fr: "Prévu : un tableau collaboratif en temps réel en TypeScript avec WebSockets, authentification et Postgres, testé et livré par CI/CD dans Docker.",
    },
    highlights: [
      { en: "Multi-user live cursors and shared state.", fr: "Curseurs en direct et état partagé entre utilisateurs." },
      { en: "Tests and a CI/CD pipeline from day one.", fr: "Tests et pipeline CI/CD dès le départ." },
    ],
    stack: ["TypeScript", "WebSockets", "Postgres", "Docker", "CI/CD"],
  },
  {
    id: "observ",
    row: "soon",
    art: "metrics",
    hue: 15,
    status: "soon",
    title: { en: "Observable API", fr: "API observable" },
    tagline: { en: "Load-tested, with metrics you can see", fr: "Testée en charge, avec métriques visibles" },
    badge: { en: "Planned · Building next", fr: "Prévu · Prochain projet" },
    synopsis: {
      en: "Planned: a public API with rate limiting and caching, a load-test report, and a dashboard for metrics and logs.",
      fr: "Prévu : une API publique avec limitation de débit et cache, un rapport de tests de charge et un tableau de bord de métriques et de journaux.",
    },
    highlights: [
      { en: "Rate limiting and caching.", fr: "Limitation de débit et cache." },
      { en: "Load-test report and a metrics dashboard.", fr: "Rapport de tests de charge et tableau de bord de métriques." },
    ],
    stack: [".NET or Python", "Docker", "Load testing", "Metrics"],
  },
];

export const byId: Record<string, Item> = Object.fromEntries(items.map((i) => [i.id, i]));

export type Profile = {
  id: ProfileId;
  name: Tx;
  line: Tx;
  hue: number;
  glyph: "case" | "compass" | "code" | "eye";
  order: string[];
  rows: RowId[];
};

export const profiles: Profile[] = [
  {
    id: "recruiter",
    name: { en: "Recruiter", fr: "Recruteur" },
    line: { en: "The highlights in 60 seconds", fr: "L'essentiel en 60 secondes" },
    hue: 350,
    glyph: "case",
    order: ["psvox", "psweb", "unreality", "ollama"],
    rows: ["experience", "imagem", "projects", "soon"],
  },
  {
    id: "manager",
    name: { en: "Hiring Manager", fr: "Gestionnaire" },
    line: { en: "Ownership and leadership", fr: "Autonomie et leadership" },
    hue: 195,
    glyph: "compass",
    order: ["psweb", "unreality", "psvox", "recognosco"],
    rows: ["projects", "experience", "imagem", "soon"],
  },
  {
    id: "engineer",
    name: { en: "Engineer", fr: "Ingénieur" },
    line: { en: "Architecture, stack and trade-offs", fr: "Architecture, stack et compromis" },
    hue: 150,
    glyph: "code",
    order: ["psweb", "ollama", "recognosco"],
    rows: ["imagem", "projects", "soon", "experience"],
  },
  {
    id: "guest",
    name: { en: "Just browsing", fr: "Je regarde" },
    line: { en: "No agenda, take a look", fr: "Sans but précis" },
    hue: 40,
    glyph: "eye",
    order: ["unreality", "psvox", "ollama", "rag"],
    rows: ["projects", "soon", "imagem", "experience"],
  },
];

export type Tool = { id: string; title: Tx; blurb?: Tx; size: "lg" | "md" | "sm"; hue: number; items: string[] };

export const toolkit: Tool[] = [
  {
    id: "backend", size: "lg", hue: 265,
    title: { en: "Back end", fr: "Back end" },
    blurb: { en: "Where most of my production hours went: APIs, auth and migrations.", fr: "Là où j'ai passé le plus d'heures en production : API, authentification et migrations." },
    items: ["C# / .NET", "ASP.NET Web API", "Java / Spring", "GWT", "REST + JWT auth"],
  },
  {
    id: "frontend", size: "md", hue: 195,
    title: { en: "Front end", fr: "Front end" },
    items: ["React", "Angular", "Vue", "TypeScript", "HTML5 / CSS"],
  },
  {
    id: "data", size: "md", hue: 150,
    title: { en: "Data", fr: "Données" },
    items: ["Oracle", "SQL Server", "MySQL", "T-SQL", "Schema design"],
  },
  {
    id: "ai", size: "md", hue: 350,
    title: { en: "AI", fr: "IA" },
    blurb: { en: "Practical, cost-aware integration.", fr: "Intégration pratique et attentive aux coûts." },
    items: ["Ollama", "LLM integration", "Speech recognition", "Token-cost tuning"],
  },
  {
    id: "delivery", size: "md", hue: 40,
    title: { en: "Delivery", fr: "Livraison" },
    items: ["Git", "Docker", "CI/CD", "Azure DevOps", "Postman", "Jira"],
  },
  {
    id: "also", size: "sm", hue: 20,
    title: { en: "Also", fr: "Aussi" },
    items: ["Python", "C++", "Kotlin", "PHP", "Ionic"],
  },
];

export const ui = {
  nav: {
    home: { en: "Home", fr: "Accueil" },
    experience: { en: "Experience", fr: "Expérience" },
    projects: { en: "Projects", fr: "Projets" },
    soon: { en: "Next up", fr: "À venir" },
    contact: { en: "Contact", fr: "Contact" },
  },
  gate: {
    title: { en: "Who's viewing?", fr: "Qui consulte ?" },
    sub: { en: "Choose a lens and I'll tailor the highlights for you.", fr: "Choisissez un angle et j'adapterai les points forts pour vous." },
    cv: { en: "Or just download my CV", fr: "Ou télécharger simplement mon CV" },
  },
  intro: { tag: { en: "Software engineer · Ottawa", fr: "Ingénieur logiciel · Ottawa" }, skip: { en: "Skip intro", fr: "Passer l'intro" } },
  bb: {
    pick: { en: "Selected for", fr: "Sélection pour" },
    play: { en: "Open case study", fr: "Voir l'étude de cas" },
    cv: { en: "Download CV", fr: "Télécharger le CV" },
    add: { en: "Shortlist", fr: "Présélection" },
    pause: { en: "Pause slideshow", fr: "Mettre le diaporama en pause" },
    resume: { en: "Play slideshow", fr: "Reprendre le diaporama" },
    chapters: { en: "Featured work", fr: "Réalisations" },
  },
  rows: {
    experience: { en: "Experience", fr: "Expérience" },
    imagem: { en: "Inside Imagem", fr: "Chez Imagem" },
    projects: { en: "Projects", fr: "Projets" },
    soon: { en: "Next up", fr: "À venir" },
    toolkit: { en: "Toolkit", fr: "Boîte à outils" },
    watching: { en: "Pick up where you left off", fr: "Reprendre où vous étiez" },
    list: { en: "Your shortlist", fr: "Votre présélection" },
    scrollL: { en: "Scroll left", fr: "Défiler à gauche" },
    scrollR: { en: "Scroll right", fr: "Défiler à droite" },
    hint: { en: "Hover a card to see it run", fr: "Survolez une carte pour la voir en action" },
  },
  status: {
    shipped: { en: "Shipped", fr: "Livré" },
    ongoing: { en: "Ongoing", fr: "En cours" },
    soon: { en: "Planned", fr: "Prévu" },
  },
  modal: {
    close: { en: "Close", fr: "Fermer" },
    highlights: { en: "What I did", fr: "Ce que j'ai fait" },
    stack: { en: "Built with", fr: "Technologies" },
    more: { en: "Related", fr: "À voir aussi" },
    repo: { en: "View repository", fr: "Voir le dépôt" },
    add: { en: "Add to shortlist", fr: "Ajouter à la présélection" },
    added: { en: "In shortlist", fr: "Dans la présélection" },
  },
  about: {
    title: { en: "About", fr: "À propos" },
    p: {
      en: [
        "I'm a Software Engineering co-op student at the University of Ottawa, after nearly three years as a Programmer Analyst on medical dictation software used across Quebec.",
        "I like the parts that keep systems trustworthy: security, migrations, tests, and performance on real client hardware. I'm now adding more AI and modern TypeScript to that base.",
      ],
      fr: [
        "Je suis étudiant en génie logiciel (coop) à l'Université d'Ottawa, après près de trois ans comme analyste-programmeur sur un logiciel de dictée médicale utilisé partout au Québec.",
        "J'aime ce qui rend un système fiable : sécurité, migrations, tests et performance sur le matériel réel des clients. J'y ajoute maintenant davantage d'IA et de TypeScript moderne.",
      ],
    },
    edu: [
      { t: { en: "BASc Software Engineering (Co-op)", fr: "BASc en génie logiciel (coop)" }, s: "University of Ottawa" },
      { t: { en: "AEC, Computer Programmer Analyst", fr: "AEC, Analyste programmeur en informatique" }, s: "Collège Multihexa · 2021 – 2023" },
    ],
    lang: { en: "English and French, fluent", fr: "Anglais et français, courants" },
  },
  contact: {
    title: { en: "Let's work together", fr: "Travaillons ensemble" },
    text: {
      en: "I'm looking for a software engineering co-op term. If you think I'd be a fit, I'd love to hear from you.",
      fr: "Je cherche un stage coop en génie logiciel. Si mon profil vous intéresse, écrivez-moi.",
    },
    email: { en: "Email me", fr: "M'écrire" },
    withList: { en: "Email me about my shortlist", fr: "M'écrire à propos de ma présélection" },
    subject: { en: "Co-op opportunity", fr: "Occasion de stage coop" },
    body: { en: "Hi Rohan, I'm interested in: ", fr: "Bonjour Rohan, je suis intéressé par : " },
  },
  palette: {
    placeholder: { en: "Search work and commands…", fr: "Rechercher une réalisation ou une commande…" },
    empty: { en: "No results", fr: "Aucun résultat" },
    open: { en: "Open", fr: "Ouvrir" },
    switchProfile: { en: "Switch lens", fr: "Changer d'angle" },
    toggle: { en: "Switch to French", fr: "Passer en anglais" },
    copy: { en: "Copy email", fr: "Copier le courriel" },
    copied: { en: "Email copied", fr: "Courriel copié" },
  },
  credits: {
    en: "Designed and built by Rohan Rajput · React, TypeScript, three.js",
    fr: "Conçu et réalisé par Rohan Rajput · React, TypeScript, three.js",
  },
};

export const ui4 = {
  nav: { work: { en: "Work", fr: "Réalisations" }, about: { en: "About", fr: "À propos" }, contact: { en: "Contact", fr: "Contact" } },
  hero: {
    role: { en: "Software Engineer", fr: "Ingénieur logiciel" },
    sub: { en: "Co-op student · University of Ottawa", fr: "Étudiant coop · Université d'Ottawa" },
    where: { en: "Based in Ottawa, Canada", fr: "Basé à Ottawa, Canada" },
    ring: { en: "Software Engineer · Co-op · uOttawa · ", fr: "Ingénieur logiciel · Coop · uOttawa · " },
  },
  intro: {
    lead: { en: "Building software people trust, from hospital wards to the web.", fr: "Des logiciels fiables, des hôpitaux jusqu'au web." },
    p: {
      en: "I'm a Software Engineering co-op student at the University of Ottawa, after nearly three years as a Programmer Analyst on medical dictation software used across Quebec. I care about the parts that keep systems dependable: security, migrations, tests and performance on real hardware.",
      fr: "Je suis étudiant en génie logiciel (coop) à l'Université d'Ottawa, après près de trois ans comme analyste-programmeur sur un logiciel de dictée médicale utilisé partout au Québec. Ce qui m'intéresse : ce qui rend un système fiable, soit la sécurité, les migrations, les tests et la performance sur du matériel réel.",
    },
    cv: { en: "Download CV", fr: "Télécharger le CV" },
    cvSub: { en: "Latest résumé", fr: "Dernier CV" },
  },
  sections: {
    exp: { en: "Experience", fr: "Expérience" },
    work: { en: "Recent work", fr: "Réalisations récentes" },
    more: { en: "More work", fr: "Plus de projets" },
    less: { en: "Less", fr: "Moins" },
    soon: { en: "Next up", fr: "À venir" },
    tools: { en: "Toolkit", fr: "Boîte à outils" },
    about: { en: "Background", fr: "Parcours" },
  },
  planned: { en: "Planned", fr: "Prévu" },
  contact: {
    title: { en: "Let's work together", fr: "Travaillons ensemble" },
    cta: { en: "Get in touch", fr: "Écrivez-moi" },
    note: { en: "Open to software engineering co-op opportunities", fr: "Ouvert aux stages coop en génie logiciel" },
    top: { en: "Back to top", fr: "Retour en haut" },
    l1: { en: "Let's work", fr: "Travaillons" },
    l2: { en: "together", fr: "ensemble" },
    copy: { en: "Copy email", fr: "Copier le courriel" },
    ticker: { en: "Open to co-op · 3 years in production · Bilingual EN/FR · C# · Java · TypeScript · React ·", fr: "Ouvert aux stages coop · 3 ans en production · Bilingue FR/EN · C# · Java · TypeScript · React ·" },
    local: { en: "Local time", fr: "Heure locale" },
  },
  live: { online: { en: "online now", fr: "en ligne" }, views: { en: "views", fr: "visites" } },
  credits: { en: "Designed and built by Rohan Rajput", fr: "Conçu et réalisé par Rohan Rajput" },
};
