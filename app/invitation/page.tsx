import type { Metadata } from "next";
import InvitationClient from "./invitation-client";

export const metadata: Metadata = {
  title: "Akou & Sena — une invitation Festia",
  description: "Parcourez une invitation de mariage digitale interactive de démonstration.",
};

export default function InvitationPage() {
  return <InvitationClient />;
}
