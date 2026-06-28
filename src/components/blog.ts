import type { StaticImageData } from "next/image";
import type { Lang } from "./dictionary";

import springBouquet from "@/media/spring-bouquet.png";
import pinkWinter from "@/media/pink-winter.png";
import goldenFifty from "@/media/golden-fifty.png";
import frostedPine from "@/media/frosted-pine.png";
import christmasShapes from "@/media/christmas-shapes.png";

export type Faq = { q: string; a: string };
export type Section = { h: string; body: string[] };
export type PostContent = {
  title: string;
  excerpt: string;
  keyword: string;
  answer: string;
  intro: string;
  sections: Section[];
  faq: Faq[];
};
export type Post = {
  slug: string;
  image: StaticImageData;
  tag: Record<Lang, string>;
  date: string; // ISO — used for schema + display
  readMins: number;
} & Record<Lang, PostContent>;

export const posts: Post[] = [
  {
    slug: "are-candles-bad-for-you",
    image: springBouquet,
    tag: { en: "Candle facts", fr: "Bien-être" },
    date: "2026-06-20",
    readMins: 5,
    en: {
      title: "Are Candles Bad for You? Soy vs Paraffin, Honestly Explained",
      excerpt:
        "Worried candles might be hurting your air? Here's the honest difference between soy and paraffin — and what 'non-toxic' really means.",
      keyword: "are candles bad for you",
      answer:
        "Most candles are perfectly safe to enjoy, but the wax and wick you choose do make a difference. Paraffin, a petroleum by-product, can release small amounts of soot and volatile organic compounds (VOCs) like benzene and toluene when it burns — especially in a poorly ventilated room. Natural waxes such as soy, coconut and beeswax burn cleaner, with far less soot, and they last noticeably longer. The wick matters too: choose cotton or wood, never one with a metal core. The biggest culprits are actually cheap synthetic fragrance oils and burning in a closed room. So candles aren't 'bad for you' — but a hand-poured soy candle with a clean wick, burned in a ventilated space and trimmed properly, is a much gentler choice than a mass-produced paraffin one.",
      intro:
        "It's one of the questions I get asked most, so let's talk about it honestly — no scare tactics, just what actually matters.",
      sections: [
        {
          h: "Soy vs paraffin: the real difference",
          body: [
            "Paraffin is made from petroleum. It's cheap and holds scent well, but it produces more soot and releases more VOCs as it burns. Soy wax is made from soybeans — a renewable crop — and burns cooler, cleaner and roughly 30–50% longer at the same size.",
            "Neither will harm you from the occasional cosy evening. But if you burn candles often, a natural wax is the kinder long-term choice for your air and your walls.",
          ],
        },
        {
          h: "What 'non-toxic' actually means",
          body: [
            "There's no legal definition of 'non-toxic', so look for the real signals instead: 100% natural wax (soy, coconut or beeswax), a cotton or wood wick with no metal core, and fragrance that's phthalate- and paraben-free with the notes actually listed.",
          ],
        },
        {
          h: "How to burn any candle more safely",
          body: [
            "Trim the wick to about 5 mm before every burn, keep candles away from drafts, never leave one burning unattended, and crack a window. Good airflow makes the biggest difference of all.",
          ],
        },
      ],
      faq: [
        { q: "Are soy candles really better than paraffin?", a: "Yes — soy burns cleaner with less soot and fewer VOCs, and lasts longer. It's the gentler choice, especially if you burn candles often." },
        { q: "Do candles affect indoor air quality?", a: "They can, mostly through soot and synthetic fragrance. Choosing natural wax, a clean wick, and burning in a ventilated room keeps the impact tiny." },
        { q: "Is it safe to burn candles around pets?", a: "Generally yes, but keep flames out of reach, avoid heavy synthetic scents, and never leave a candle unattended near a curious tail." },
      ],
    },
    fr: {
      title: "Les bougies sont-elles mauvaises pour la santé ? Soja vs paraffine",
      excerpt:
        "Peur que vos bougies polluent votre air ? Voici la vraie différence entre soja et paraffine — et ce que veut dire « non toxique ».",
      keyword: "les bougies sont-elles mauvaises pour la santé",
      answer:
        "La plupart des bougies se profitent sans danger, mais la cire et la mèche que vous choisissez font une vraie différence. La paraffine, dérivée du pétrole, peut libérer un peu de suie et des composés organiques volatils (COV) comme le benzène et le toluène en brûlant — surtout dans une pièce mal aérée. Les cires naturelles comme le soja, la noix de coco et la cire d'abeille brûlent plus proprement, avec beaucoup moins de suie, et durent nettement plus longtemps. La mèche compte aussi : choisissez du coton ou du bois, jamais une mèche à âme métallique. Les vrais coupables sont en réalité les parfums synthétiques bon marché et le fait de brûler dans une pièce fermée. Les bougies ne sont donc pas « mauvaises » — mais une bougie de soja coulée à la main, avec une mèche propre et une pièce aérée, est un choix bien plus doux.",
      intro:
        "C'est l'une des questions qu'on me pose le plus, alors parlons-en honnêtement — sans alarmisme, juste l'essentiel.",
      sections: [
        {
          h: "Soja vs paraffine : la vraie différence",
          body: [
            "La paraffine est issue du pétrole. Elle est économique et tient bien le parfum, mais elle produit plus de suie et libère plus de COV en brûlant. La cire de soja, faite à partir de soja — une culture renouvelable — brûle plus fraîche, plus propre et environ 30 à 50 % plus longtemps à taille égale.",
            "Aucune ne vous fera de mal lors d'une soirée cocooning de temps en temps. Mais si vous brûlez souvent des bougies, une cire naturelle est le choix le plus doux sur le long terme.",
          ],
        },
        {
          h: "Ce que « non toxique » veut vraiment dire",
          body: [
            "« Non toxique » n'a aucune définition légale, alors fiez-vous aux vrais signaux : une cire 100 % naturelle (soja, coco ou abeille), une mèche en coton ou en bois sans âme métallique, et un parfum sans phtalates ni parabènes dont les notes sont réellement indiquées.",
          ],
        },
        {
          h: "Comment brûler n'importe quelle bougie plus sereinement",
          body: [
            "Coupez la mèche à environ 5 mm avant chaque utilisation, éloignez la bougie des courants d'air, ne la laissez jamais brûler sans surveillance, et entrouvrez une fenêtre. Une bonne aération change tout.",
          ],
        },
      ],
      faq: [
        { q: "Les bougies de soja sont-elles vraiment meilleures que la paraffine ?", a: "Oui — le soja brûle plus proprement, avec moins de suie et de COV, et dure plus longtemps. C'est le choix le plus doux, surtout si vous brûlez souvent des bougies." },
        { q: "Les bougies influencent-elles la qualité de l'air intérieur ?", a: "Elles le peuvent, surtout par la suie et les parfums synthétiques. Une cire naturelle, une mèche propre et une pièce aérée réduisent l'impact à presque rien." },
        { q: "Peut-on brûler des bougies près des animaux ?", a: "En général oui, mais gardez la flamme hors de portée, évitez les parfums synthétiques forts, et ne laissez jamais une bougie sans surveillance près d'une queue curieuse." },
      ],
    },
  },

  {
    slug: "how-to-fix-a-tunneling-candle",
    image: pinkWinter,
    tag: { en: "Candle care", fr: "Entretien" },
    date: "2026-06-10",
    readMins: 4,
    en: {
      title: "How to Fix a Tunneling Candle (and Stop It Happening Again)",
      excerpt:
        "Candle burning straight down the middle? Here's how to rescue a tunneling candle — and the one habit that prevents it for good.",
      keyword: "how to fix a tunneling candle",
      answer:
        "To fix a tunneling candle, you need to melt the sunken wax back to a flat, even surface. The easiest method is the foil trick: trim the wick, light the candle, then wrap a loose collar of aluminium foil around the rim with a small opening at the top. The trapped heat melts the high edges down over 30–60 minutes until the whole top is liquid. Let it set and your candle is reset. For mild tunneling, a hairdryer on low can gently melt and level the top instead. To stop tunneling forever, always allow a full first burn: keep the candle lit until the wax pools all the way to the edges, which usually takes two to three hours for a standard jar. Wax has a 'memory', so that very first burn sets the pattern for every burn after.",
      intro: "Tunnelling is the most common candle problem there is — and the good news is it's almost always fixable.",
      sections: [
        {
          h: "The foil trick, step by step",
          body: [
            "Trim the wick to 5 mm and light the candle. Wrap a strip of aluminium foil around the top like a collar, folding it slightly inward over the candle with a hole left in the centre. Leave it for 30–60 minutes until the entire surface has melted flat, then remove the foil and let it cool. Most candles bounce right back.",
          ],
        },
        {
          h: "Why candles tunnel in the first place",
          body: [
            "Wax remembers its first burn. If you blow a candle out before the top has melted edge to edge, it creates a 'memory ring' — and every future burn follows that same narrow tunnel, wasting 20–30% of the wax down the sides.",
          ],
        },
        {
          h: "How to prevent it for good",
          body: [
            "Give every new candle a full first burn of two to three hours, until the melt pool reaches the edges. Keep the wick trimmed, burn on a level surface away from drafts, and don't burn for more than about four hours at a time.",
          ],
        },
      ],
      faq: [
        { q: "Can you save a badly tunneled candle?", a: "Usually yes. The foil trick melts the high edges back down; for deep tunnels, a hairdryer or carefully removing excess hard wax first will help." },
        { q: "How long should the first burn be?", a: "Long enough for the wax to melt all the way to the edges — about two to three hours for a standard jar candle. This sets the pattern for every future burn." },
        { q: "Does tunneling mean the candle is bad quality?", a: "Not necessarily. Even great candles tunnel if the first burn is cut short. Wick size matters too, but burning habits are usually the cause." },
      ],
    },
    fr: {
      title: "Comment rattraper une bougie qui creuse (effet tunnel)",
      excerpt:
        "Votre bougie brûle en creusant un trou au centre ? Voici comment la rattraper — et l'habitude qui évite l'effet tunnel pour de bon.",
      keyword: "comment rattraper une bougie qui creuse",
      answer:
        "Pour rattraper une bougie qui creuse, il faut refondre la cire affaissée jusqu'à retrouver une surface plane et régulière. La méthode la plus simple est l'astuce du papier aluminium : coupez la mèche, allumez la bougie, puis enroulez un collier lâche de papier aluminium autour du bord en laissant une petite ouverture au sommet. La chaleur emprisonnée fait fondre les bords hauts en 30 à 60 minutes, jusqu'à ce que toute la surface soit liquide. Laissez figer et votre bougie est remise à neuf. Pour un effet tunnel léger, un sèche-cheveux à basse température peut aussi faire fondre et niveler le dessus. Pour éviter l'effet tunnel à jamais, laissez toujours une première combustion complète : gardez la bougie allumée jusqu'à ce que la cire fonde jusqu'aux bords, soit deux à trois heures pour un pot standard. La cire a une « mémoire ».",
      intro: "L'effet tunnel est le problème de bougie le plus courant qui soit — et la bonne nouvelle, c'est qu'il se rattrape presque toujours.",
      sections: [
        {
          h: "L'astuce du papier aluminium, étape par étape",
          body: [
            "Coupez la mèche à 5 mm et allumez la bougie. Enroulez une bande de papier aluminium autour du sommet comme un collier, repliée légèrement vers l'intérieur, en laissant un trou au centre. Laissez 30 à 60 minutes jusqu'à ce que toute la surface soit fondue et plane, puis retirez l'aluminium et laissez refroidir. La plupart des bougies repartent comme neuves.",
          ],
        },
        {
          h: "Pourquoi une bougie creuse",
          body: [
            "La cire se souvient de sa première combustion. Si vous éteignez une bougie avant que le dessus n'ait fondu d'un bord à l'autre, cela crée un « anneau de mémoire » — et chaque combustion suivante suit ce même tunnel étroit, gaspillant 20 à 30 % de la cire sur les côtés.",
          ],
        },
        {
          h: "Comment l'éviter pour de bon",
          body: [
            "Offrez à chaque bougie neuve une première combustion complète de deux à trois heures, jusqu'à ce que la cire atteigne les bords. Gardez la mèche coupée, brûlez sur une surface plane à l'abri des courants d'air, et pas plus de quatre heures d'affilée.",
          ],
        },
      ],
      faq: [
        { q: "Peut-on sauver une bougie très creusée ?", a: "En général oui. L'astuce de l'aluminium refond les bords hauts ; pour les tunnels profonds, un sèche-cheveux ou le retrait de l'excès de cire dure aide aussi." },
        { q: "Combien de temps doit durer la première combustion ?", a: "Assez pour que la cire fonde jusqu'aux bords — environ deux à trois heures pour un pot standard. Cela fixe le schéma de toutes les combustions suivantes." },
        { q: "Un effet tunnel signifie-t-il une mauvaise qualité ?", a: "Pas forcément. Même d'excellentes bougies creusent si la première combustion est trop courte. La taille de la mèche compte, mais l'habitude est souvent en cause." },
      ],
    },
  },

  {
    slug: "how-to-make-candles-last-longer",
    image: goldenFifty,
    tag: { en: "Candle care", fr: "Entretien" },
    date: "2026-05-28",
    readMins: 5,
    en: {
      title: "How to Make Your Candles Last Longer: 7 Simple Tips",
      excerpt:
        "A few small habits can add hours of burn time to every candle. Here are the seven that make the biggest difference.",
      keyword: "how to make candles last longer",
      answer:
        "To make candles last longer, the single most important habit is trimming the wick to about 5 mm before every burn — a long wick burns hot, fast and smoky. Next, always allow a full first burn so the wax melts edge to edge and never tunnels. Keep candles away from drafts, which make the flame flicker and burn unevenly, and burn for no more than three to four hours at a time so the wax doesn't overheat. Store candles somewhere cool and out of direct sunlight to protect the wax and scent, and pop a lid on between burns to keep the fragrance fresh. Finally, stop burning while there's still about a centimetre of wax left at the bottom — burning to the very end can crack the container. Small habits, hours more glow.",
      intro: "Handmade candles are little luxuries, so it's worth making each one last. These are the tips I share with everyone.",
      sections: [
        {
          h: "Trim the wick every single time",
          body: [
            "This is the big one. Before each burn, trim the wick to about 5 mm. An untrimmed wick burns too hot, melts wax faster, smokes and leaves soot on the glass. A neat little trim gives you a calm, even, long-lasting flame.",
          ],
        },
        {
          h: "Respect the first burn and avoid drafts",
          body: [
            "Let the first burn pool all the way to the edges to prevent tunneling. After that, keep candles away from open windows, fans and vents — a flickering flame in a draft burns through wax unevenly and far faster.",
          ],
        },
        {
          h: "Burn in sessions and store it well",
          body: [
            "Burn for three to four hours at most, then let it cool and reset. Keep a lid on between uses and store somewhere cool and dark, so the wax stays firm and the scent stays true.",
          ],
        },
      ],
      faq: [
        { q: "How long do soy candles last?", a: "Soy burns 30–50% longer than paraffin of the same size. With good care, a medium soy candle can give you 40–50 hours of burn time." },
        { q: "Why does my candle burn so fast?", a: "Usually an untrimmed wick or a draft. Both make the flame burn hotter and taller, melting wax much faster than it should." },
        { q: "Should I put my candle in the fridge?", a: "No need — and sudden temperature changes can crack the wax or glass. A cool, dark cupboard is perfect." },
      ],
    },
    fr: {
      title: "Comment faire durer vos bougies plus longtemps : 7 astuces",
      excerpt:
        "Quelques petites habitudes peuvent ajouter des heures à chaque bougie. Voici les sept qui font la plus grande différence.",
      keyword: "comment faire durer une bougie plus longtemps",
      answer:
        "Pour faire durer vos bougies, l'habitude la plus importante est de couper la mèche à environ 5 mm avant chaque utilisation — une mèche longue brûle chaud, vite et fume. Ensuite, laissez toujours une première combustion complète pour que la cire fonde jusqu'aux bords et ne creuse jamais. Éloignez les bougies des courants d'air, qui font vaciller la flamme et brûler de façon irrégulière, et ne dépassez pas trois à quatre heures d'affilée pour éviter la surchauffe. Rangez vos bougies au frais, à l'abri du soleil, pour protéger la cire et le parfum, et remettez le couvercle entre deux utilisations pour garder la senteur intacte. Enfin, arrêtez de brûler quand il reste environ un centimètre de cire au fond — aller jusqu'au bout peut fissurer le contenant. De petites habitudes, des heures de lueur en plus.",
      intro: "Les bougies faites main sont de petits luxes, alors autant les faire durer. Voici les conseils que je partage à tout le monde.",
      sections: [
        {
          h: "Coupez la mèche à chaque fois",
          body: [
            "C'est l'essentiel. Avant chaque utilisation, coupez la mèche à environ 5 mm. Une mèche non coupée brûle trop chaud, fait fondre la cire plus vite, fume et noircit le verre. Une petite coupe nette donne une flamme calme, régulière et durable.",
          ],
        },
        {
          h: "Respectez la première combustion et fuyez les courants d'air",
          body: [
            "Laissez la première combustion atteindre les bords pour éviter l'effet tunnel. Ensuite, éloignez les bougies des fenêtres ouvertes, ventilateurs et bouches d'aération — une flamme qui vacille brûle la cire de façon irrégulière et bien plus vite.",
          ],
        },
        {
          h: "Brûlez par sessions et rangez-les bien",
          body: [
            "Brûlez trois à quatre heures maximum, puis laissez refroidir et figer. Remettez le couvercle entre deux usages et rangez au frais et à l'abri de la lumière, pour que la cire reste ferme et le parfum fidèle.",
          ],
        },
      ],
      faq: [
        { q: "Combien de temps dure une bougie de soja ?", a: "Le soja brûle 30 à 50 % plus longtemps que la paraffine de même taille. Bien entretenue, une bougie de soja moyenne offre 40 à 50 heures de combustion." },
        { q: "Pourquoi ma bougie brûle-t-elle si vite ?", a: "Souvent une mèche trop longue ou un courant d'air. Les deux rendent la flamme plus chaude et plus haute, faisant fondre la cire bien trop vite." },
        { q: "Faut-il mettre sa bougie au frigo ?", a: "Inutile — et les changements brusques de température peuvent fissurer la cire ou le verre. Un placard frais et sombre est parfait." },
      ],
    },
  },

  {
    slug: "decorative-candles-too-pretty-to-burn",
    image: frostedPine,
    tag: { en: "Inspiration", fr: "Inspiration" },
    date: "2026-05-15",
    readMins: 4,
    en: {
      title: "Decorative Candles: Too Pretty to Burn? How to Style Them",
      excerpt:
        "Sculptural candles shaped like flowers, bears and trees are everywhere right now. Here's how to display them — and whether you should ever light them.",
      keyword: "decorative candles",
      answer:
        "Decorative candles are sculptural candles made to be displayed as much as burned — think roses, bears, Christmas trees and little hearts moulded from wax. You absolutely can light them, but most people keep them as décor, and that's perfectly fine: a well-made soy candle holds its shape and colour for years if kept out of direct sun and heat. To style them, treat each one like a tiny sculpture. Group odd numbers together at different heights, place them on a small tray, shelf or stack of books, and pair them with dried flowers, eucalyptus or a linen runner. Stick to one or two colours that match your room for a calm, intentional look. Whether you light yours or simply admire it, a handmade decorative candle adds soft, handmade character to a space that a plain jar never could.",
      intro: "These are the candles I love making most — the ones people say are 'too pretty to burn'. So let's talk about how to enjoy them.",
      sections: [
        {
          h: "To burn or not to burn?",
          body: [
            "There's no wrong answer. Many people keep sculptural candles purely as decoration, and a quality soy candle will hold its detail for years. If you do light one, expect the shape to soften beautifully as it melts — some people love that slow transformation as much as the candle itself.",
          ],
        },
        {
          h: "How to style a decorative candle",
          body: [
            "Treat it like a little sculpture. Group candles in odd numbers at varying heights, set them on a tray or a stack of books, and surround them with natural textures — dried flowers, eucalyptus, linen. Keeping to one or two colours that echo your room makes the whole vignette feel calm and considered.",
          ],
        },
        {
          h: "Keeping them looking perfect",
          body: [
            "Keep decorative candles out of direct sunlight and away from radiators, which can warp or fade the wax. Dust them gently with a soft, dry brush, and they'll stay photo-ready for a very long time.",
          ],
        },
      ],
      faq: [
        { q: "Can you burn decorative candles?", a: "Yes. They're real candles with a wick, so they burn like any other — though many people keep sculptural ones as décor instead." },
        { q: "Do shaped candles lose their detail over time?", a: "Not if cared for. Kept out of direct sun and heat, a good soy candle holds its shape and colour for years." },
        { q: "How do I display candles without lighting them?", a: "Group them on a tray or shelf at different heights with dried flowers or greenery, in colours that match your room." },
      ],
    },
    fr: {
      title: "Bougies décoratives : trop jolies pour être brûlées ?",
      excerpt:
        "Les bougies sculptées en forme de fleurs, d'ours et de sapins sont partout. Voici comment les mettre en scène — et si vous devriez les allumer.",
      keyword: "bougies décoratives",
      answer:
        "Les bougies décoratives sont des bougies sculptées, faites pour être exposées autant que brûlées — des roses, des ours, des sapins de Noël et de petits cœurs moulés dans la cire. Vous pouvez tout à fait les allumer, mais la plupart des gens les gardent comme objets déco, et c'est très bien : une bougie de soja bien faite conserve sa forme et sa couleur des années si elle reste à l'abri du soleil et de la chaleur. Pour les mettre en scène, traitez chacune comme une petite sculpture. Regroupez-les en nombre impair à différentes hauteurs, posez-les sur un petit plateau, une étagère ou une pile de livres, et associez-les à des fleurs séchées, de l'eucalyptus ou un chemin de table en lin. Tenez-vous à une ou deux couleurs assorties à votre pièce pour un rendu calme et harmonieux. Que vous l'allumiez ou l'admiriez simplement, une bougie décorative faite main apporte un cachet qu'un simple pot n'aura jamais.",
      intro: "Ce sont les bougies que je préfère fabriquer — celles qu'on dit « trop jolies pour être brûlées ». Alors voyons comment en profiter.",
      sections: [
        {
          h: "Les allumer ou non ?",
          body: [
            "Il n'y a pas de mauvaise réponse. Beaucoup gardent les bougies sculptées uniquement comme décoration, et une bougie de soja de qualité conserve ses détails des années. Si vous en allumez une, sa forme va joliment s'adoucir en fondant — certains adorent cette lente transformation autant que la bougie elle-même.",
          ],
        },
        {
          h: "Comment mettre en scène une bougie décorative",
          body: [
            "Traitez-la comme une petite sculpture. Regroupez les bougies en nombre impair à différentes hauteurs, posez-les sur un plateau ou une pile de livres, et entourez-les de textures naturelles — fleurs séchées, eucalyptus, lin. Une ou deux couleurs en écho à votre pièce rendent l'ensemble calme et soigné.",
          ],
        },
        {
          h: "Les garder impeccables",
          body: [
            "Tenez les bougies décoratives à l'écart du soleil direct et des radiateurs, qui peuvent déformer ou ternir la cire. Dépoussiérez-les délicatement avec un pinceau doux et sec, et elles resteront photogéniques très longtemps.",
          ],
        },
      ],
      faq: [
        { q: "Peut-on brûler les bougies décoratives ?", a: "Oui. Ce sont de vraies bougies avec une mèche, elles brûlent comme les autres — mais beaucoup préfèrent garder les modèles sculptés en déco." },
        { q: "Les bougies sculptées perdent-elles leurs détails ?", a: "Pas si on en prend soin. À l'abri du soleil et de la chaleur, une bonne bougie de soja garde sa forme et sa couleur des années." },
        { q: "Comment exposer des bougies sans les allumer ?", a: "Regroupez-les sur un plateau ou une étagère à différentes hauteurs, avec des fleurs séchées ou de la verdure, dans des tons assortis à votre pièce." },
      ],
    },
  },

  {
    slug: "handmade-candle-gift-ideas",
    image: christmasShapes,
    tag: { en: "Gifting", fr: "Cadeaux" },
    date: "2026-04-30",
    readMins: 5,
    en: {
      title: "Handmade Candle Gift Ideas for Every Occasion",
      excerpt:
        "A handmade candle is the gift that always lands. Here are thoughtful ideas for birthdays, weddings, the holidays and just-because.",
      keyword: "handmade candle gift ideas",
      answer:
        "A handmade candle makes a thoughtful gift for almost any occasion because it feels personal, looks beautiful and is something people rarely buy for themselves. For birthdays, a sculptural candle shaped like a flower or their favourite animal feels custom-made. For weddings and bridal showers, soft rose or bouquet candles double as décor and favours. At Christmas, shaped candles — trees, gingerbread, snowflakes — make charming stocking fillers and host gifts. For new homes, a calming scent in a reusable jar is always welcome, and for a 'just because' moment, a single pretty candle with a handwritten note says more than a big present. To make any candle gift feel extra special, pair it with dried flowers, wrap it in tissue and twine, and add a line about why you chose that shape or scent for them.",
      intro: "Candles are my favourite thing to give, because there's a shape and a scent for absolutely everyone. Here's how to choose.",
      sections: [
        {
          h: "Match the candle to the moment",
          body: [
            "For birthdays, pick a shape that feels like them — a rose, a little bear, their star sign. For weddings, soft bouquet and rose candles work as favours and décor at once. At Christmas, trees, gingerbread and snowflakes make sweet, affordable gifts and stocking fillers.",
          ],
        },
        {
          h: "Gifts for the hard-to-buy-for",
          body: [
            "A candle is perfect for the person who 'has everything', because a handmade one is genuinely one of a kind. Choose a calming scent for a new home, an elegant sculptural piece for a milestone birthday, or a set of little shapes so they can keep some and gift the rest.",
          ],
        },
        {
          h: "Make it feel personal",
          body: [
            "Presentation is half the gift. Wrap your candle in tissue with twine and a sprig of dried flowers, and add a handwritten note saying why you chose that shape or scent. That small touch is what people remember.",
          ],
        },
      ],
      faq: [
        { q: "Are candles a good gift?", a: "Yes — they're personal, beautiful and something most people love but rarely buy for themselves. A handmade one feels especially thoughtful." },
        { q: "What candle do you give for a wedding?", a: "Soft rose or bouquet-shaped candles in neutral or blush tones work beautifully as both wedding favours and keepsakes." },
        { q: "What's a good candle gift for someone who has everything?", a: "A handmade, sculptural candle — it's genuinely one of a kind, so it's hard for them to already own something like it." },
      ],
    },
    fr: {
      title: "Idées cadeaux : des bougies faites main pour chaque occasion",
      excerpt:
        "Une bougie faite main fait toujours plaisir. Voici des idées attentionnées pour les anniversaires, les mariages, les fêtes et le « juste parce que ».",
      keyword: "idées cadeaux bougie faite main",
      answer:
        "Une bougie faite main est un cadeau attentionné pour presque toutes les occasions : elle est personnelle, jolie, et c'est quelque chose qu'on s'offre rarement à soi-même. Pour un anniversaire, une bougie sculptée en forme de fleur ou de son animal préféré semble faite sur mesure. Pour un mariage ou un enterrement de vie de jeune fille, les bougies roses ou bouquets servent à la fois de déco et de cadeaux d'invités. À Noël, les bougies sculptées — sapins, pains d'épices, flocons — font de charmants petits cadeaux et cadeaux d'hôtesse. Pour une crémaillère, un parfum apaisant dans un pot réutilisable est toujours apprécié, et pour un « juste parce que », une seule jolie bougie avec un mot manuscrit dit plus qu'un grand cadeau. Pour rendre l'attention encore plus spéciale, associez la bougie à des fleurs séchées, emballez-la dans du papier de soie et de la ficelle, et expliquez pourquoi vous avez choisi cette forme.",
      intro: "Les bougies sont ce que je préfère offrir, car il existe une forme et un parfum pour absolument tout le monde. Voici comment choisir.",
      sections: [
        {
          h: "Accordez la bougie au moment",
          body: [
            "Pour un anniversaire, choisissez une forme qui lui ressemble — une rose, un petit ours, son signe astro. Pour un mariage, les bougies bouquets et roses font à la fois cadeaux d'invités et décoration. À Noël, sapins, pains d'épices et flocons font de jolis cadeaux abordables.",
          ],
        },
        {
          h: "Pour les personnes difficiles à gâter",
          body: [
            "Une bougie est parfaite pour celui ou celle qui « a déjà tout », car une bougie faite main est vraiment unique. Choisissez un parfum apaisant pour une crémaillère, une pièce sculptée élégante pour un grand anniversaire, ou un assortiment de petites formes à garder et à offrir.",
          ],
        },
        {
          h: "Rendez-la personnelle",
          body: [
            "La présentation, c'est la moitié du cadeau. Emballez votre bougie dans du papier de soie avec de la ficelle et un brin de fleurs séchées, et ajoutez un mot manuscrit expliquant votre choix de forme ou de parfum. C'est ce petit geste qu'on retient.",
          ],
        },
      ],
      faq: [
        { q: "Une bougie est-elle un bon cadeau ?", a: "Oui — c'est personnel, joli, et quelque chose qu'on adore mais qu'on s'offre rarement soi-même. Une bougie faite main est particulièrement attentionnée." },
        { q: "Quelle bougie offrir pour un mariage ?", a: "Les bougies roses ou en forme de bouquet, dans des tons neutres ou blush, font de magnifiques cadeaux d'invités et souvenirs." },
        { q: "Quel cadeau pour quelqu'un qui a déjà tout ?", a: "Une bougie sculptée faite main — elle est vraiment unique, donc difficile qu'il ou elle possède déjà la même." },
      ],
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
