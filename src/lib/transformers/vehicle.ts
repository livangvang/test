import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints/common";
import type { ProductVehicle, STFilterVehicle } from "@/lib/types/vehicle";

type Properties = PageObjectResponse["properties"];
type PropertyValue = Properties[string];

/** Extract plain text from a single Notion property */
function extractText(prop: PropertyValue | undefined): string {
  if (!prop) return "";

  switch (prop.type) {
    case "rich_text":
      return prop.rich_text.map((t: RichTextItemResponse) => t.plain_text).join("");
    case "title":
      return prop.title.map((t: RichTextItemResponse) => t.plain_text).join("");
    case "select":
      return prop.select?.name ?? "";
    case "multi_select":
      return prop.multi_select.map((s) => s.name).join(", ");
    case "rollup": {
      if (prop.rollup?.type !== "array") return "";
      for (const item of prop.rollup.array) {
        if (item.type === "rich_text") {
          const text = item.rich_text
            .map((t: { plain_text: string }) => t.plain_text)
            .join("");
          if (text) return text;
        }
      }
      return "";
    }
    default:
      return "";
  }
}

/** Try multiple property names, return first non-empty match */
function tryFields(props: Properties, ...names: string[]): string {
  for (const name of names) {
    const val = extractText(props[name]);
    if (val) return val;
  }
  return "";
}

/** Per-product base field mapping */
const BASE_FIELDS: Record<string, {
  brand: string[];
  model: string[];
  chassis: string[];
  year: string[];
  engine: string[];
  harness: string[];
  area: string[];
}> = {
  "4s": {
    brand: ["Brand", "Master Brand"],
    model: ["Model"],
    chassis: ["Chassis", "Master Chassis"],
    year: ["Model Year", "Master Model Year"],
    engine: ["Engine Type", "Master Engine"],
    harness: ["E-Drive harness"],
    area: ["Area"],
  },
  fdevo: {
    brand: ["Brand", "Master Brand"],
    model: ["Model"],
    chassis: ["chassis", "Chassis", "Master Chassis"],
    year: ["Year", "Model Year", "Master Model Year"],
    engine: ["Engine", "Engine or 備註", "Master Engine"],
    harness: [],
    area: [],
  },
  dmeter2plus: {
    brand: ["Brand", "Master Brand"],
    model: ["Model"],
    chassis: ["chassis", "Chassis", "Master Chassis"],
    year: ["Model Year", "Master Model Year"],
    engine: ["Engine or 備註", "Master Engine"],
    harness: [],
    area: [],
  },
  iboost2: {
    brand: ["品牌", "Master Brand"],
    model: ["車型"],
    chassis: ["Master Chassis"],
    year: ["年份", "Master Year", "Master Model Year"],
    engine: ["引擎型號 ", "引擎型號", "Master Engine"],
    harness: ["接頭"],
    area: [],
  },
  valve: {
    brand: ["Brand", "Master Brand"],
    model: ["Model"],
    chassis: ["Chassis", "Master Chassis"],
    year: ["Model Year", "Master Model Year"],
    engine: ["Engine", "Master Engine"],
    harness: ["控制器"],
    area: [],
  },
};

/** Transform a Notion page into a ProductVehicle */
export function transformProductVehicle(
  page: PageObjectResponse,
  slug: string
): ProductVehicle {
  const p = page.properties;
  const fields = BASE_FIELDS[slug];

  const base: ProductVehicle = fields
    ? {
        brand: tryFields(p, ...fields.brand),
        model: tryFields(p, ...fields.model),
        chassis: tryFields(p, ...fields.chassis),
        year: tryFields(p, ...fields.year),
        engine: tryFields(p, ...fields.engine),
        harness: tryFields(p, ...fields.harness) || undefined,
        area: tryFields(p, ...fields.area) || undefined,
      }
    : {
        brand: tryFields(p, "Brand", "brand", "Master Brand"),
        model: tryFields(p, "Model", "model"),
        chassis: tryFields(p, "Chassis", "chassis", "Master Chassis"),
        year: tryFields(p, "Model Year", "year", "Master Model Year"),
        engine: tryFields(p, "Engine", "Engine Type", "Master Engine"),
        harness: tryFields(p, "harness", "Harness") || undefined,
        area: tryFields(p, "Area") || undefined,
      };

  // FD-EVO extra fields
  if (slug === "fdevo") {
    base.oilTemp = extractText(p["油溫"]) || undefined;
    base.transTemp = extractText(p["變速箱油溫"]) || undefined;
    base.basicInfo = extractText(p["基本資訊"]) || undefined;
    base.fuel = extractText(p["燃料"]) || undefined;
    base.compatibility = extractText(p["狀態"]) || undefined;
    base.version = extractText(p["版本"]) || undefined;
  }

  // D-Meter 2Plus extra fields
  if (slug === "dmeter2plus") {
    base.coolant = extractText(p["水溫"]) || undefined;
    base.oilTemp = extractText(p["油溫"]) || undefined;
    base.transTemp = extractText(p["變速箱油溫"]) || undefined;
    base.boost = extractText(p["渦輪"]) || undefined;
    base.egt = extractText(p["排溫"]) || undefined;
    base.intakeTemp = extractText(p["進氣溫"]) || undefined;
    base.voltage = extractText(p["電壓"]) || undefined;
    base.speed = extractText(p["時速"]) || undefined;
    base.rpm = extractText(p["轉速"]) || undefined;
    base.mileage = extractText(p["里程"]) || undefined;
    base.afr = extractText(p["空燃比"]) || undefined;
    base.compatibility = extractText(p["是否對應"]) || undefined;
    base.version = extractText(p["版本"]) || undefined;
  }

  return base;
}

/** Transform a Notion page from the st-filter auto ai DB into a STFilterVehicle */
export function transformSTFilterVehicle(page: PageObjectResponse): STFilterVehicle {
  const p = page.properties;
  return {
    brand: tryFields(p, "Brand"),
    model: tryFields(p, "Model"),
    chassis: tryFields(p, "Chassis"),
    year: tryFields(p, "Year"),
    engine: tryFields(p, "Engine"),
    knNumber: tryFields(p, "ST-Filter"),
    swCode: tryFields(p, "SW品號") || null,
    oemNumber: tryFields(p, "OEM料號"),
    shape: tryFields(p, "Shape"),
    packageContents: tryFields(p, "Package_Contents"),
    inStock: true,
    outsideLength: tryFields(p, "Length") || null,
    outsideWidth: tryFields(p, "Width") || null,
    height: tryFields(p, "Height") || null,
    weight: tryFields(p, "Weight") || null,
    notes: tryFields(p, "Notes") || null,
  };
}
