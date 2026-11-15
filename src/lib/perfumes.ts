import { perfumeCategories } from "@/lib/perfume-categories";

type PerfumeNote = {
  label: string;
  value: string;
};

type PerfumeVariant = {
  size: 50 | 100;
  price: string;
  image: string;
  availabilityNote?: string;
};

type Perfume = {
  slug: string;
  name: string;
  description: string;
  notes: readonly PerfumeNote[];
  variants: readonly PerfumeVariant[];
};

type CategorySlug = (typeof perfumeCategories)[number]["slug"];

function perfume(
  slug: string,
  name: string,
  description: string,
  notes: readonly [string, string, string],
  prices: readonly [string, string],
  availabilityNotes: readonly [string?, string?] = [],
): Perfume {
  return {
    slug,
    name,
    description,
    notes: [
      { label: "Връхна нотка", value: notes[0] },
      { label: "Сърдечна нотка", value: notes[1] },
      { label: "Основна нотка", value: notes[2] },
    ],
    variants: [
      {
        size: 50,
        price: prices[0],
        image: `/products/yodeyma-${slug}-50ml.jpg`,
        availabilityNote: availabilityNotes[0],
      },
      {
        size: 100,
        price: prices[1],
        image: `/products/yodeyma-${slug}-100ml.jpg`,
        availabilityNote: availabilityNotes[1],
      },
    ],
  };
}

export const perfumesByCategory = {
  damski: [
    perfume(
      "adriana",
      "Adriana",
      "Шипрово-плодов аромат с касис, праскова и топла ванилова основа.",
      ["Касис", "Праскова", "Ванилия"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "black-elixir",
      "Black Elixir",
      "Ориенталско-дървесен и плодов аромат с кафе, ликьор и ванилия.",
      ["Кафе", "Ликьор", "Ванилия"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "boreal",
      "Boreal",
      "Жасмин, шафран и дървесни акорди изграждат богатия ароматен профил.",
      ["Жасмин", "Шафран", "Дървесни акорди"],
      ["22,50 €", "35,85 €"],
    ),
    perfume(
      "celebrity-woman",
      "Celebrity Woman",
      "Ориенталско-флорална композиция от касис, ирис и пачули.",
      ["Касис", "Ирис", "Пачули"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "cheante",
      "Cheante",
      "Ориенталско-амбров аромат с мандарина, роза и пачули.",
      ["Мандарина", "Роза", "Пачули"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "dinara",
      "Dinara",
      "Флорално-алдехиден аромат с роза, тонка и мускус.",
      ["Роза", "Тонка", "Мускус"],
      ["22,50 €", "35,85 €"],
      [undefined, "Официалната страница отбелязва този размер като неналичен."],
    ),
    perfume(
      "mia",
      "Mía",
      "Флорално-ориенталски аромат с черна малина, арабски жасмин и ванилия.",
      ["Черна малина", "Арабски жасмин", "Ванилия"],
      ["19,00 €", "29,75 €"],
      [
        "Проверете наличността на 50 мл в WhatsApp — официалната страница за този размер не е потвърдена.",
        undefined,
      ],
    ),
    perfume(
      "very-special",
      "Very Special",
      "Ориенталско-пикантен аромат с бадем, жасмин и тонка.",
      ["Бадем", "Жасмин", "Тонка"],
      ["19,00 €", "29,75 €"],
      ["Официалната страница отбелязва този размер като неналичен.", undefined],
    ),
    perfume(
      "luxor",
      "Luxor",
      "Ориенталско-фужерен аромат с мандарина, жасмин и ванилия.",
      ["Мандарина", "Жасмин", "Ванилия"],
      ["19,00 €", "29,75 €"],
    ),
  ],
  muzhki: [
    perfume(
      "active-man",
      "Active Man",
      "Свеж шипров аромат с ананас, пачули и дъбов мъх.",
      ["Ананас", "Пачули", "Дъбов мъх"],
      ["22,50 €", "35,85 €"],
    ),
    perfume(
      "caribbean",
      "Caribbean",
      "Фужерно-амбров аромат с бергамот, розов пипер и дървесни акорди.",
      ["Бергамот", "Розов пипер", "Дървесни акорди"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "dauro",
      "Dauro",
      "Ориенталско-пикантен аромат с бергамот, анасон и тонка.",
      ["Бергамот", "Анасон", "Тонка"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "moment",
      "Moment",
      "Ароматна амброва композиция с ябълка, карамфил и амбра.",
      ["Ябълка", "Карамфил", "Амбра"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "platinum",
      "Platinum",
      "Ароматна амброва композиция с грейпфрут, водни нотки и дървесни акорди.",
      ["Грейпфрут", "Водна нотка", "Дървесни акорди"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "root",
      "Root",
      "Ориенталско-дървесен аромат с грейпфрут, здравец и пачули.",
      ["Грейпфрут", "Здравец", "Пачули"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "wow-scent",
      "Wow Scent",
      "Фужерно-пикантен аромат с мента, салвия и ванилия.",
      ["Мента", "Салвия", "Ванилия"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "power",
      "Power",
      "Шипрово-дървесен аромат с грейпфрут, канела и пачули.",
      ["Грейпфрут", "Канела", "Пачули"],
      ["19,00 €", "29,75 €"],
    ),
    perfume(
      "blue-sand",
      "Blue Sand",
      "Плодов и ориенталски профил с портокал, лимон и бергамот.",
      ["Портокал", "Лимон", "Бергамот"],
      ["22,50 €", "35,85 €"],
    ),
  ],
} satisfies Record<CategorySlug, readonly Perfume[]>;
