// src/app/page.js
import { redirect } from "next/navigation";

export default function HomePage() {
  // Remove the window check - this runs on server side in App Router
  redirect("/collections/gym-wear-men");
}