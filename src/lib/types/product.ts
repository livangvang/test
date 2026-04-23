/** Product definition for the homepage cards */
export interface Product {
  slug: string;
  nameKey: string;
  subtitleKey: string;
  descriptionKey: string;
  databaseId: string;
  image: string;
}

/** Site-wide stats for the hero section */
export interface SiteStats {
  totalVehicles: number;
  totalProducts: number;
  totalBrands: number;
}

/** Product page stats */
export interface ProductStats {
  vehicleCount: number;
  brandCount: number;
}

/** Notion Data Source ID mapping (SDK v5 uses dataSources.query) */
export const PRODUCT_DATA_SOURCES: Record<string, string> = {
  "4s": "31f0520b-2dc7-81cc-aabc-000b388cc1eb",
  fdevo: "381d87fc-199d-4beb-a06a-86e89dfb06d6",
  dmeter2plus: "31f0520b-2dc7-8193-877c-000ba97ce569",
  iboost2: "31f0520b-2dc7-8182-b16d-000b16dee21e",
  valve: "31f0520b-2dc7-817e-81f6-000b8cbf9d36",
  stfilter: "4c9164b4-c4bf-4329-b6fa-91426e9a3465",
};

export const VEHICLE_MASTER_DS = "31f0520b-2dc7-8076-904d-000b216c4088";

/** All product slugs */
export const PRODUCT_SLUGS = [
  "4s",
  "fdevo",
  "dmeter2plus",
  "iboost2",
  "valve",
  "stfilter",
] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

/** Product metadata for cards */
export const PRODUCTS: Product[] = [
  {
    slug: "4s",
    nameKey: "products.4s.name",
    subtitleKey: "products.4s.subtitle",
    descriptionKey: "products.4s.description",
    databaseId: PRODUCT_DATA_SOURCES["4s"],
    image:
      "https://cdn.ready-market.com.tw/0d9e0017/Templates/pic/m/Electronic-Throttle-Controller.jpg",
  },
  {
    slug: "fdevo",
    nameKey: "products.fdevo.name",
    subtitleKey: "products.fdevo.subtitle",
    descriptionKey: "products.fdevo.description",
    databaseId: PRODUCT_DATA_SOURCES["fdevo"],
    image:
      "https://cdn.ready-market.com.tw/0d9e0017/Templates/pic/m/FD%20EVO_Main_image_20250418.jpg",
  },
  {
    slug: "dmeter2plus",
    nameKey: "products.dmeter2plus.name",
    subtitleKey: "products.dmeter2plus.subtitle",
    descriptionKey: "products.dmeter2plus.description",
    databaseId: PRODUCT_DATA_SOURCES["dmeter2plus"],
    image:
      "https://cdn.ready-market.com.tw/0d9e0017/Templates/pic/m/D-METER%202%20PLUS_Main_image_20250418.jpg",
  },
  {
    slug: "iboost2",
    nameKey: "products.iboost2.name",
    subtitleKey: "products.iboost2.subtitle",
    descriptionKey: "products.iboost2.description",
    databaseId: PRODUCT_DATA_SOURCES["iboost2"],
    image:
      "https://cdn.ready-market.com.tw/0d9e0017/Templates/pic/I_BOOST2_Image_EN_20241004.jpg",
  },
  {
    slug: "valve",
    nameKey: "products.valve.name",
    subtitleKey: "products.valve.subtitle",
    descriptionKey: "products.valve.description",
    databaseId: PRODUCT_DATA_SOURCES["valve"],
    image:
      "https://cdn.ready-market.com.tw/0d9e0017/Templates/pic/ELECTRIC_EXHAUST_VALVE_CONTROLLER_Image_EN_20250117.jpg",
  },
  {
    slug: "stfilter",
    nameKey: "products.stfilter.name",
    subtitleKey: "products.stfilter.subtitle",
    descriptionKey: "products.stfilter.description",
    databaseId: "",
    image:
      "https://www.shadowmotor.com.tw/Templates/pic/ST-FILTER%20EN%20230919%20(1).jpg",
  },
];
