import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hľadanie | ZoškaSnap",
  description: "Vyhľadávanie používateľov na ZoškaSnap",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 