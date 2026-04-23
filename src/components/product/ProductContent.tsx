import { getProductFirstPage, getSTFilterFirstPage } from "@/lib/queries/products";
import { ProductView } from "./ProductView";

interface ProductContentProps {
  product: string;
}

export async function ProductContent({ product }: ProductContentProps) {
  const isSTFilter = product === "stfilter";
  const { grouped, nextCursor } = isSTFilter
    ? await getSTFilterFirstPage()
    : await getProductFirstPage(product);

  return <ProductView slug={product} initialData={grouped} initialCursor={nextCursor} />;
}
