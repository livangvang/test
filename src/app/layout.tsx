import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadow Performance — Vehicle Compatibility",
  description:
    "Complete vehicle compatibility database for Shadow Performance products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
