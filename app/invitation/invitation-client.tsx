"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

const dateTarget = new Date("2027-04-24T16:00:00+01:00").getTime();
const mainPhotoCredit = "https://unsplash.com/photos/a-bride-and-groom-stand-solemnly-at-their-wedding-ceremony-QSsQJ0TngzM";
const detailPhotoCredit = "https://unsplash.com/photos/woman-in-white-dress-dancing-RCf8mbyNxb4";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function initialRemaining(): Remaining {
  const distance = Math.max(0, dateTarget - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };
}

function MoonIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.2" /><path d="M10 1.8v2M10 16.2v2M18.2 10h-2M3.8 10h-2m14.02-5.82-1.41 1.41M5.59 14.41l-1.41 1.41m11.64 0-1.41-1.41M5.59 5.59 4.18 4.18" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M16.8 12.1A7 7 0 0 1 7.9 3.2a7.1 7.1 0 1 0 8.9 8.9Z" /></svg>
  );
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 18 18" className="arrow-icon"><path d="M3 9h11M9 4l5 5-5 5" /></svg>;
}

function MapIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.2" /></svg>;
}

function ClockIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
}

function InviteMark() {
  return <span className="wedding-mark" aria-hidden="true">A<span>✳</span>S</span>;
}

function EnvelopeMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 120" className="envelope-drawing">
      <path d="M13 26 90 78l77-52v76H13z" />
      <path d="m13 26 77 53 77-53" />
      <path d="M13 102 67 61M167 102 113 61" />
      <circle cx="90" cy="77" r="13" />
      <path d="m90 68 2.4 6.4 6.6.2-5.2 4 1.9 6.4L90 81.2l-5.7 3.8 1.9-6.4-5.2-4 6.6-.2z" />
    </svg>
  );
}

function MapLink({ venue }: { venue: string }) {
  const query = encodeURIComponent(`${venue}, Lomé, Togo`);
  return <a className="wedding-text-link" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Ouvrir l’itinéraire <ArrowIcon /></a>;
}

export default function InvitationClient() {
  const [opened, setOpened] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [remaining, setRemaining] = useState<Remaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState("1");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const saved = window.localStorage.getItem("festia-theme");
      const selected = saved === "light" || saved === "dark" ? saved : media.matches ? "dark" : "light";
      setTheme(selected);
      document.documentElement.dataset.theme = selected;
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, []);

  useEffect(() => {
    setRemaining(initialRemaining());
    const timer = window.setInterval(() => setRemaining(initialRemaining()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("festia-theme", next);
  }

  function openInvitation() {
    setOpened(true);
    window.setTimeout(() => document.getElementById("invitation-content")?.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
  }

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setGuestName(String(data.get("guest-name") ?? "Invité·e"));
    setAttendance(String(data.get("attendance") ?? "yes") === "no" ? "no" : "yes");
    setGuestCount(String(data.get("guest-count") ?? "1"));
    setSubmitted(true);
  }

  async function shareInvitation() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_400);
    } catch {
      window.location.href = `https://wa.me/?text=${encodeURIComponent(`Découvrez l’invitation d’Akou & Sena : ${window.location.href}`)}`;
    }
  }

  return (
    <main className={`full-invitation${opened ? " full-invitation--opened" : ""}`}>
      {!opened ? (
        <section className="envelope-gate" aria-labelledby="gate-title">
          <div className="envelope-gate__top">
            <Link href="/" className="wedding-back-link"><ArrowIcon /> Festia</Link>
            <button className="wedding-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Passer en mode ${theme === "dark" ? "clair" : "sombre"}`}><MoonIcon dark={theme === "dark"} /></button>
          </div>
          <div className="envelope-gate__content">
            <p className="wedding-overline">UNE INVITATION DE DÉMONSTRATION</p>
            <InviteMark />
            <h1 id="gate-title">Akou <i>&</i> Sena</h1>
            <p className="envelope-gate__date">Samedi 24 avril 2027 · Lomé, Togo</p>
            <button className="envelope-button" type="button" onClick={openInvitation} aria-label="Ouvrir l’invitation d’Akou et Sena">
              <EnvelopeMark />
              <span>Ouvrir notre invitation</span>
            </button>
            <button className="wedding-skip-link" type="button" onClick={openInvitation}>Voir directement les détails <ArrowIcon /></button>
          </div>
          <p className="envelope-gate__foot">UNE PAGE À PARTAGER · LES RÉPONSES AU MÊME ENDROIT</p>
        </section>
      ) : (
        <div className="wedding-content" id="invitation-content">
          <header className="wedding-topbar">
            <Link href="/" className="wedding-back-link"><ArrowIcon /> Festia</Link>
            <span>INVITATION DE DÉMONSTRATION</span>
            <button className="wedding-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Passer en mode ${theme === "dark" ? "clair" : "sombre"}`}><MoonIcon dark={theme === "dark"} /></button>
          </header>

          <section className="wedding-cover" aria-labelledby="couple-names">
            <img className="wedding-cover__photo" src="demo-wedding-hero.jpg" alt="Photographie d’illustration d’un couple de mariés lors d’une cérémonie" />
            <div className="wedding-cover__shade" />
            <div className="wedding-cover__caption">
              <span>AVEC LA JOIE DE NOS FAMILLES</span>
              <h1 id="couple-names">Akou <span className="couple-ampersand">&amp;</span> Sena</h1>
              <p>ont le bonheur de vous inviter à célébrer leur union</p>
              <div className="wedding-cover__date"><span>SAMEDI</span><b>24</b><span>AVRIL<br />2027</span></div>
              <a className="wedding-cover__down" href="#programme" aria-label="Découvrir le programme">FAIRE DÉFILER <span>↓</span></a>
            </div>
            <span className="image-illustration-label">PHOTO D’ILLUSTRATION · ÉVÉNEMENT FICTIF</span>
          </section>

          <section className="wedding-intro" aria-label="Message des mariés">
            <InviteMark />
            <p className="wedding-script">L’amour nous rassemble,<br />votre présence rendra ce jour inoubliable.</p>
            <div className="wedding-divider"><span>✳</span></div>
            <div className="wedding-countdown" aria-label="Compte à rebours avant la célébration">
              {[[remaining.days, "JOURS"], [remaining.hours, "HEURES"], [remaining.minutes, "MINUTES"], [remaining.seconds, "SECONDES"]].map(([value, label]) => (
                <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
              ))}
            </div>
            <p className="wedding-footnote">Le compte à rebours jusqu’à notre célébration</p>
          </section>

          <section className="wedding-locations" aria-labelledby="locations-title">
            <div className="wedding-section-heading"><p>LE GRAND JOUR</p><h2 id="locations-title">Deux moments,<br /><i>une même joie.</i></h2></div>
            <div className="location-list">
              <article className="location-entry">
                <div className="location-entry__number">01</div>
                <div className="location-entry__main"><span>15 H 30 · CÉRÉMONIE</span><h3>Chapelle des Palmiers</h3><p>Quartier Tokoin · Lomé, Togo</p></div>
                <MapIcon />
                <MapLink venue="Chapelle des Palmiers" />
              </article>
              <article className="location-entry">
                <div className="location-entry__number">02</div>
                <div className="location-entry__main"><span>18 H 00 · RÉCEPTION</span><h3>Jardin des Palmiers</h3><p>Route de Kpalimé · Lomé, Togo</p></div>
                <MapIcon />
                <MapLink venue="Jardin des Palmiers" />
              </article>
            </div>
            <p className="demo-location-note">Lieux et horaires fictifs, présentés pour la démonstration.</p>
          </section>

          <section className="wedding-program" id="programme" aria-labelledby="program-title">
            <div className="program-photo"><img src="demo-wedding-gallery.jpg" alt="Photographie d’illustration d’une mariée pendant la célébration" /><span>UNE JOURNÉE À VIVRE ENSEMBLE</span></div>
            <div className="program-copy">
              <p>LE DÉROULÉ</p>
              <h2 id="program-title">À chaque heure,<br /><i>un souvenir.</i></h2>
              <ol className="timeline">
                <li><time>15 H 00</time><span>Accueil des invités</span></li>
                <li><time>15 H 30</time><span>Cérémonie</span></li>
                <li><time>17 H 30</time><span>Photos & cocktail</span></li>
                <li><time>19 H 30</time><span>Dîner de célébration</span></li>
                <li><time>21 H 30</time><span>Musique & soirée</span></li>
              </ol>
            </div>
          </section>

          <section className="wedding-details" aria-label="Informations pratiques">
            <div><span>UNE ATTENTION</span><h2>Venez comme vous êtes,<br /><i>en tenue de fête.</i></h2><p>Nous avons hâte de vous retrouver et de partager cette journée avec vous.</p></div>
            <div className="detail-note"><span>UN PETIT MOT</span><p>Votre présence et vos vœux sont le plus beau des cadeaux.</p><small>Merci de répondre avant le 10 avril 2027.</small></div>
          </section>

          <section className="wedding-rsvp" id="reponse" aria-labelledby="rsvp-title">
            <span className="wedding-rsvp__kicker">VOTRE RÉPONSE</span>
            <h2 id="rsvp-title">Serez-vous<br /><i>à nos côtés ?</i></h2>
            <p className="wedding-rsvp__intro">Merci de nous répondre avant le 10 avril 2027.</p>
            {submitted ? (
              <div className="wedding-rsvp__success" role="status"><span>✳</span><div><strong>{attendance === "yes" ? `À très bientôt, ${guestName}.` : `Merci de nous avoir prévenus, ${guestName}.`}</strong><p>{attendance === "yes" ? `${guestCount} personne${guestCount === "1" ? "" : "s"} confirmée${guestCount === "1" ? "" : "s"} dans cette démonstration.` : "Votre absence est notée dans cette démonstration."}</p></div></div>
            ) : (
              <form className="wedding-rsvp__form" onSubmit={submitRsvp}>
                <label htmlFor="guest-name">Votre nom</label>
                <input id="guest-name" name="guest-name" placeholder="Ex. Ama Kossi" autoComplete="name" required />
                <label htmlFor="guest-count">Nombre de personnes</label>
                <select id="guest-count" name="guest-count" defaultValue="1"><option value="1">1 personne</option><option value="2">2 personnes</option><option value="3">3 personnes</option><option value="4">4 personnes</option></select>
                <fieldset><legend>Votre réponse</legend><label><input type="radio" name="attendance" value="yes" defaultChecked /> <span>Oui, avec joie</span></label><label><input type="radio" name="attendance" value="no" /> <span>Je ne pourrai pas venir</span></label></fieldset>
                <button type="submit">Envoyer ma réponse <ArrowIcon /></button>
              </form>
            )}
            <p className="wedding-rsvp__privacy">Démonstration fictive : aucune donnée n’est envoyée ni conservée.</p>
          </section>

          <section className="wedding-share">
            <InviteMark />
            <p className="wedding-script">Nous avons hâte de célébrer<br />ce jour avec vous.</p>
            <button type="button" onClick={shareInvitation}>{copied ? "Lien copié" : "Partager l’invitation"} <ArrowIcon /></button>
            <span className="wedding-photo-credit"><a href={mainPhotoCredit} target="_blank" rel="noreferrer">Photo principale : Clinton Mwebaze / Unsplash</a> · <a href={detailPhotoCredit} target="_blank" rel="noreferrer">Photo de détail : Lisa Marie Theck / Unsplash</a></span>
          </section>

          <footer className="wedding-footer">
            <p>Akou <i>&</i> Sena · 24 avril 2027</p>
            <Link href="/#demonstration">Découvrir le parcours organisateur <ArrowIcon /></Link>
            <span>Invitation de démonstration · Noms, événement, horaires et réponses fictifs.</span>
          </footer>
        </div>
      )}
    </main>
  );
}
