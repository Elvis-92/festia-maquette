import type { Metadata } from "next";
import { DM_Sans, Gloock } from "next/font/google";
import "./globals.css";

const displayFont = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-gloock" });
const bodyFont = DM_Sans({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Festia — l’invitation ouvre la fête",
  description:
    "Une invitation digitale personnalisée, un lien à partager et les réponses de vos invités réunies au même endroit.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        {/*
        THESIS: A printed invitation dossier opens into the complete guest journey—from offer to RSVP and event entry.
        OWN-WORLD: Warm paper (#efe5d0), ink (#1f1c18), and earth red (#a33327); editorial serif display, crisp sans-serif utility text, fine rules, generous paper margins, no generic card-grid scaffold.
        STORY: A private-event organizer understands the assisted service, compares proposed pilot packages, explores a synthetic invitation, submits an RSVP, reviews the organizer response list, and simulates check-in with a guest badge.
        FIRST VIEWPORT: A slim navigation rule sits above a two-column opening spread: a large editorial headline, short service description, region pilot note, and WhatsApp action on the left; a typographic invitation sample on the right. A narrow price-test strip follows immediately below the fold.
        FORM: The Invitation Booklet, locked by the user from the surface decision round; seed key d7286234; code-first static Next.js export.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        {children}
      </body>
    </html>
  );
}
