export type Lang = "fr" | "en";

export type GalleryCopy = { tag: string; name: string; note: string; alt: string };

export type Copy = {
  sayHi: string;
  hero: { title: string; sub: string; cta1: string; cta2: string; scroll: string };
  marquee: string[];
  about: {
    kicker: string;
    heading: string;
    p1: string;
    p2: string;
    p3: string;
    signoff: string;
    signature: string;
    role: string;
    photoCaption: string;
    photoAlt: string;
  };
  collection: { heading: string; sub: string; notForSale: string; gallery: GalleryCopy[] };
  features: { heading: string; items: { title: string; note: string }[] };
  contact: { heading: string; sub: string; instagram: string; facebook: string };
  footer: { story: string; collection: string; journal: string; hello: string; tagline: string };
  nav: { collection: string; journal: string };
  blog: {
    kicker: string;
    heading: string;
    sub: string;
    by: string;
    minRead: string;
    inShort: string;
    faqHeading: string;
    moreReading: string;
    back: string;
    readArticle: string;
    authorBio: string;
  };
};

/* Gallery order is shared across languages — only the words change.
   To change the maker's name, edit `about.heading` + `about.signature`. */
export const dict: Record<Lang, Copy> = {
  fr: {
    sayHi: "Coucou",
    hero: {
      title: "Des bougies décoratives, coulées à la main avec beaucoup d'amour",
      sub: "De petites bougies en forme de fleurs, d'ours et de cœurs — chacune coulée à la main, à la maison, juste par amour.",
      cta1: "Voir la collection",
      cta2: "Faire connaissance",
      scroll: "Faites défiler",
    },
    marquee: ["Fait main", "Avec amour", "Faites par moi", "Une à la fois", "Coulée à la main"],
    about: {
      kicker: "La créatrice",
      heading: "Bonjour, moi c'est Lize",
      p1: "Je n'avais jamais vraiment prévu de faire des bougies. Tout a commencé un hiver tranquille, avec un seul moule en silicone et une casserole de cire qui fondait sur la cuisinière — et quelque part entre le désordre et la magie, je suis complètement tombée amoureuse.",
      p2: "Chaque pièce que vous voyez ici est faite par moi, à la maison, en toute petite quantité. Je les coule lentement, je m'attarde sur chaque petit pétale, et je recommence dès qu'une bougie ne me semble pas tout à fait juste. Elles ne sont pas parfaites — et honnêtement, c'est ce que je préfère. Chacune est un peu différente, façonnée à la main et non par une machine.",
      p3: "Je les fais parce qu'elles font sourire les gens. Si l'une des miennes trouve un jour sa place sur votre étagère, ça me rendrait vraiment heureuse.",
      signoff: "À bientôt,",
      signature: "Lize",
      role: "Créatrice de Pretty Petal",
      photoCaption: "Une petite photo de moi arrive bientôt 🌸",
      photoAlt: "Lize, la créatrice derrière Pretty Petal",
    },
    collection: {
      heading: "La petite collection",
      sub: "Quelques-unes des petites bougies que j'ai faites jusqu'ici — chacune coulée, démoulée et chouchoutée à la main.",
      notForSale: "Quelque chose vous plaît ? Écrivez-moi pour en commander une.",
      gallery: [
        { tag: "Printemps", name: "Bouquet de printemps", note: "roses, fleurs & blé doré", alt: "Bougie en pot avec des fleurs roses, pêche et vertes et des épis de blé" },
        { tag: "Noël", name: "Hiver rose", note: "sapin & flocons tout en douceur", alt: "Bougie pilier rose ornée d'un sapin et de flocons de neige" },
        { tag: "Fête", name: "Cinquante doré", note: "roses bleues & dorées pour les grands jours", alt: "Arrangement de bougies en forme de roses bleues et dorées avec un chiffre 50" },
        { tag: "Hiver", name: "Pin givré", note: "sapin vert ombré & fleurs séchées", alt: "Bougie sapin de Noël vert dégradé entourée de fleurs séchées" },
        { tag: "Noël", name: "Petits Noëls", note: "pains d'épices, sapins & cannes de sucre", alt: "Petites bougies de Noël : pains d'épices, sapins, cannes de sucre et étoiles" },
        { tag: "Halloween", name: "Nuit ensorcelée", note: "fantômes, citrouilles & petites têtes de mort", alt: "Bougies d'Halloween : fantômes, citrouilles et têtes de mort dans un photophore" },
      ],
    },
    features: {
      heading: "Ce qu'il y a dans chacune",
      items: [
        { title: "Faites par moi", note: "Pas d'usine, pas de raccourcis — juste moi, mes moules et beaucoup de patience à la table de la cuisine." },
        { title: "Faites pour être aimées", note: "Des fleurs, des ours et de petits cœurs, faits pour être exposés et vous faire sourire chaque jour." },
        { title: "Jamais deux pareilles", note: "Comme tout est fait main, chacune sort un peu différente — et c'est ça que je préfère." },
      ],
    },
    contact: {
      heading: "Venez dire bonjour",
      sub: "Je partage chaque nouvelle bougie d'abord sur Instagram. Venez me suivre, dites-moi bonjour, ou écrivez-moi si vous rêvez un jour d'une pièce rien que pour vous — ça me ferait vraiment plaisir d'avoir de vos nouvelles.",
      instagram: "Suivez-moi sur Instagram",
      facebook: "Retrouvez-moi sur Facebook",
    },
    footer: { story: "Histoire", collection: "Collection", journal: "Journal", hello: "Coucou", tagline: "Faites à la main avec amour" },
    nav: { collection: "Collection", journal: "Journal" },
    blog: {
      kicker: "Le journal",
      heading: "Le petit journal des bougies",
      sub: "Conseils d'entretien, petites histoires et tout ce que j'apprends en fabriquant mes bougies — écrit à la main, par moi.",
      by: "par",
      minRead: "min de lecture",
      inShort: "En bref",
      faqHeading: "Questions fréquentes",
      moreReading: "À lire aussi",
      back: "Retour au journal",
      readArticle: "Lire l'article",
      authorBio: "Lize est la créatrice de Pretty Petal. Elle coule chaque bougie à la main, à la maison, et partage ici ce qu'elle apprend en chemin.",
    },
  },

  en: {
    sayHi: "Say hi",
    hero: {
      title: "Hand-poured decoration candles, made with a little love",
      sub: "Little candles shaped like flowers, bears and hearts — each one poured by hand at home, just for the love of it.",
      cta1: "See the collection",
      cta2: "Get to know me",
      scroll: "Scroll",
    },
    marquee: ["Handmade", "With love", "Made by me", "One at a time", "Poured by hand"],
    about: {
      kicker: "The maker",
      heading: "Hi, I'm Lize",
      p1: "I never really planned to make candles. It started one quiet winter with a single silicone mould and a pot of wax melting on the stove — and somewhere between the mess and the magic, I completely fell for it.",
      p2: "Every piece you see here is made by me, at home, in tiny batches. I pour them slowly, fuss over every little petal, and start over whenever one doesn't feel quite right. They're not perfect — and honestly, that's my favourite part. Each one is a little different, shaped by hand and not by a machine.",
      p3: "I make them because they make people smile. If one of mine finds a home on your shelf one day, that would honestly mean the world to me.",
      signoff: "With love,",
      signature: "Lize",
      role: "Maker of Pretty Petal",
      photoCaption: "A little photo of me, coming soon 🌸",
      photoAlt: "Lize, the maker behind Pretty Petal",
    },
    collection: {
      heading: "The little collection",
      sub: "A few of the little ones I've made so far — each one poured, peeled out of its mould, and fussed over by hand.",
      notForSale: "Like something you see? Message me to order one of your own.",
      gallery: [
        { tag: "Spring", name: "Spring Bouquet", note: "roses, blooms & golden wheat", alt: "Jar candle topped with pink, peach and green flowers and wheat" },
        { tag: "Christmas", name: "Pink Winter", note: "fir & snowflakes, all in soft pink", alt: "Pink pillar candle with a fir tree and snowflakes" },
        { tag: "Celebration", name: "Golden Fifty", note: "blue & gold roses for big days", alt: "Arrangement of blue and gold rose candles with a number 50 topper" },
        { tag: "Winter", name: "Frosted Pine", note: "ombré green tree & dried flowers", alt: "Ombré green Christmas tree candle surrounded by dried flowers" },
        { tag: "Christmas", name: "Little Christmas", note: "gingerbread, trees & candy canes", alt: "Little Christmas candles: gingerbread, trees, candy canes and stars" },
        { tag: "Halloween", name: "Spooky Night", note: "ghosts, pumpkins & tiny skulls", alt: "Halloween candles: ghosts, pumpkins and skulls in a glass holder" },
      ],
    },
    features: {
      heading: "What goes into each one",
      items: [
        { title: "Made by me", note: "No factory and no shortcuts — just me, my moulds and a lot of patience at the kitchen table." },
        { title: "Made to be loved", note: "Flowers, bears and tiny hearts, made to sit out on display and make you smile every day." },
        { title: "Never two the same", note: "Because they're all handmade, each one comes out a little different — and that's my favourite part." },
      ],
    },
    contact: {
      heading: "Come say hello",
      sub: "I share every new candle on Instagram first. Come follow along, say hi, or send me a message if you'd ever like something made just for you — I'd really love to hear from you.",
      instagram: "Follow me on Instagram",
      facebook: "Find me on Facebook",
    },
    footer: { story: "Story", collection: "Collection", journal: "Journal", hello: "Hello", tagline: "Handmade with love" },
    nav: { collection: "Collection", journal: "Journal" },
    blog: {
      kicker: "The journal",
      heading: "The little candle journal",
      sub: "Candle care, little stories and everything I learn while making them — written by hand, by me.",
      by: "by",
      minRead: "min read",
      inShort: "In short",
      faqHeading: "Frequently asked questions",
      moreReading: "Keep reading",
      back: "Back to the journal",
      readArticle: "Read the article",
      authorBio: "Lize is the maker behind Pretty Petal. She pours every candle by hand at home, and shares what she learns along the way right here.",
    },
  },
};
