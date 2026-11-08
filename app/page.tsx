"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Stage = "invitation" | "rsvp" | "organisateur" | "entree";
type Theme = "light" | "dark";

const stages: { id: Stage; number: string; label: string }[] = [
  { id: "invitation", number: "01", label: "Invitation" },
  { id: "rsvp", number: "02", label: "Réponse RSVP" },
  { id: "organisateur", number: "03", label: "Suivi" },
  { id: "entree", number: "04", label: "Accueil" },
];

const sampleResponses = [
  { name: "Aïssata K.", response: "Présente", count: "2 pers.", status: "À venir" },
  { name: "Koffi A.", response: "Présent", count: "1 pers.", status: "Attendu" },
  { name: "Mariam & famille", response: "Présents", count: "4 pers.", status: "Attendus" },
  { name: "Yao D.", response: "Absent", count: "—", status: "—" },
];

const WHATSAPP_NUMBER = "22996663219";

function whatsappLink(packageName = "") {
  const text = packageName
    ? `Bonjour Festia, je souhaite en savoir plus sur la formule ${packageName}.`
    : "Bonjour Festia, je souhaite en savoir plus sur vos invitations digitales.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="arrow-icon">
      <path d="M3 9h11M9 4l5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="check-icon">
      <path d="m3.5 9.2 3.4 3.4 7.7-7.5" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "dark" ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="theme-icon"><circle cx="10" cy="10" r="3.2" /><path d="M10 1.8v2M10 16.2v2M18.2 10h-2M3.8 10h-2m14.02-5.82-1.41 1.41M5.59 14.41l-1.41 1.41m11.64 0-1.41-1.41M5.59 5.59 4.18 4.18" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="theme-icon"><path d="M16.8 12.1A7 7 0 0 1 7.9 3.2a7.1 7.1 0 1 0 8.9 8.9Z" /></svg>
  );
}

function BrandSeal() {
  return <svg aria-hidden="true" viewBox="0 0 18 18" className="brand-seal"><path d="M9 1.6v14.8M1.6 9h14.8M3.8 3.8l10.4 10.4M14.2 3.8 3.8 14.2" /></svg>;
}

function StageArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 18 18" className="stage-arrow-icon"><path d="M4 14 14 4M6 4h8v8" /></svg>;
}

function InviteOrnament() {
  return <svg aria-hidden="true" viewBox="0 0 18 18" className="invite-ornament"><path d="M9 1.4 10.4 6l4.4-2.2-2.2 4.4 4.6 1.4-4.6 1.4 2.2 4.4-4.4-2.2L9 17.8l-1.4-4.6-4.4 2.2 2.2-4.4L.8 9.6 5.4 8.2 3.2 3.8 7.6 6 9 1.4Z" /></svg>;
}

function QrMark() {
  const matrix = [
    "1111100111111",
    "1000100100001",
    "1010100110101",
    "1000100100001",
    "1111100111111",
    "0000000101000",
    "1101011110110",
    "0101101001001",
    "1110010111010",
    "1000100101101",
    "1111101100110",
    "1000100110011",
    "1111101011101",
  ];

  return (
    <div className="qr-mark" role="img" aria-label="Code QR de démonstration, non scannable">
      {matrix.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? <i key={`${x}-${y}`} style={{ gridColumn: x + 1, gridRow: y + 1 }} /> : null,
        ),
      )}
    </div>
  );
}

function InvitePreview({ compact = false, onConfirm }: { compact?: boolean; onConfirm?: () => void }) {
  return (
    <article className={`invite-sheet${compact ? " invite-sheet--compact" : ""}`}>
      <div className="invite-sheet__topline">
        <span>UNE CÉLÉBRATION</span>
        <span className="invite-sheet__stamp">F</span>
      </div>
      <div className="invite-sheet__content">
        <p className="invite-sheet__intro">Ont la joie de vous convier</p>
        <h3>Akou &amp; Sena</h3>
        <p className="invite-sheet__occasion">à célébrer leur union</p>
        <div className="invite-sheet__rule"><InviteOrnament /></div>
        <p className="invite-sheet__date">Samedi 24 avril 2027</p>
        <p className="invite-sheet__place">Lomé · Togo</p>
        <p className="invite-sheet__time">À partir de 16 h 00</p>
        {!compact && <a className="invite-sheet__rsvp" href="#demonstration" onClick={onConfirm}>Confirmer ma présence <ArrowIcon /></a>}
      </div>
      <div className="invite-sheet__footer">
        <span>INVITATION DE DÉMONSTRATION</span>
        <span>FESTIA · 2027</span>
      </div>
    </article>
  );
}

function StageBody({
  stage,
  submitted,
  checkedIn,
  guestName,
  guestResponse,
  onRsvp,
  onRsvpStep,
  onCheckIn,
}: {
  stage: Stage;
  submitted: boolean;
  checkedIn: boolean;
  guestName: string;
  guestResponse: "yes" | "no";
  onRsvp: (event: FormEvent<HTMLFormElement>) => void;
  onRsvpStep: () => void;
  onCheckIn: () => void;
}) {
  if (stage === "invitation") {
    return (
      <div className="demo-invitation-layout">
        <InvitePreview compact />
        <div className="demo-copy">
          <span className="micro-label">LA PAGE DE L’INVITÉ</span>
          <h3>Tout ce qu’il faut savoir, sur une seule page.</h3>
          <p>Date, lieu, programme et consigne de réponse : l’invité ouvre le lien reçu et trouve l’essentiel sans installer d’application.</p>
          <button className="text-action" type="button" onClick={onRsvpStep}>
            Essayer la réponse <ArrowIcon />
          </button>
        </div>
      </div>
    );
  }

  if (stage === "rsvp") {
    return (
      <div className="rsvp-layout">
        <div className="rsvp-heading">
          <span className="micro-label">FORMULAIRE INVITÉ · DÉMONSTRATION</span>
          <h3>Votre présence nous ferait plaisir.</h3>
          <p>Répondez en quelques secondes, sans créer de compte.</p>
        </div>
        {submitted ? (
          <div className="submitted-note" role="status">
            <CheckIcon />
            <div><strong>Réponse enregistrée dans cette démonstration.</strong><span>Vous pouvez la voir dans le suivi organisateur.</span></div>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={onRsvp}>
            <label htmlFor="rsvp-name">Votre nom</label>
            <input id="rsvp-name" name="name" placeholder="Ex. Ama K." required />
            <fieldset>
              <legend>Serez-vous présent·e ?</legend>
              <label className="choice"><input type="radio" name="answer" value="yes" defaultChecked /> <span>Oui, avec plaisir</span></label>
              <label className="choice"><input type="radio" name="answer" value="no" /> <span>Je ne pourrai pas venir</span></label>
            </fieldset>
            <button className="button button--dark" type="submit">Envoyer ma réponse <ArrowIcon /></button>
          </form>
        )}
        <p className="demo-disclaimer">Données fictives : rien n’est envoyé ni conservé.</p>
      </div>
    );
  }

  if (stage === "organisateur") {
    return (
      <div className="dashboard-demo">
        <div className="dashboard-demo__header">
          <div><span className="micro-label">ESPACE ORGANISATEUR · DONNÉES FICTIVES</span><h3>Les réponses, au même endroit.</h3></div>
          <span className="privacy-note">Accès privé</span>
        </div>
        <div className="response-summary">
          <div><strong>{submitted ? "47" : "46"}</strong><span>réponses reçues</span></div>
          <div><strong>{submitted && guestResponse === "yes" ? "39" : "38"}</strong><span>présences confirmées</span></div>
          <div><strong>{submitted && guestResponse === "no" ? "9" : "8"}</strong><span>absences signalées</span></div>
        </div>
        <div className="response-table" role="table" aria-label="Réponses RSVP de démonstration">
          <div className="response-row response-row--head" role="row"><span role="columnheader">INVITÉ·E</span><span role="columnheader">RÉPONSE</span><span role="columnheader">GROUPE</span><span role="columnheader">ACCUEIL</span></div>
          {submitted && <div className="response-row response-row--new" role="row"><span role="cell">{guestName}</span><span role="cell"><b className={`status ${guestResponse === "yes" ? "status--yes" : "status--no"}`}>{guestResponse === "yes" ? "Présent" : "Absent"}</b></span><span role="cell">{guestResponse === "yes" ? "1 pers." : "—"}</span><span role="cell">À venir</span></div>}
          {sampleResponses.map((person) => (
            <div className="response-row" role="row" key={person.name}>
              <span role="cell">{person.name}</span>
              <span role="cell"><b className={`status ${person.response === "Absent" ? "status--no" : "status--yes"}`}>{person.response}</b></span>
              <span role="cell">{person.count}</span>
              <span role="cell">{person.name === "Aïssata K." && checkedIn ? "Arrivée" : person.status}</span>
            </div>
          ))}
        </div>
        <p className="demo-disclaimer">Extrait de démonstration · Aucun vrai RSVP n’est enregistré.</p>
      </div>
    );
  }

  return (
    <div className="checkin-demo">
      <div className="checkin-pass">
        <div className="checkin-pass__top"><span>BADGE INVITÉ · FICTIF</span><span className="access-tag">ACCÈS GÉNÉRAL</span></div>
        <div className="checkin-pass__person"><span className="pass-initials">AK</span><div><strong>Aïssata K.</strong><span>1 personne · Invitation de démonstration</span></div></div>
        <div className="checkin-pass__code"><QrMark /><span>PASS<br /><b>FST—041</b></span></div>
      </div>
      <div className="checkin-copy">
        <span className="micro-label">ACCUEIL · SIMULATION</span>
        <h3>Vérifier l’invitation à l’entrée.</h3>
        <p>Un badge avec QR peut aider l’équipe à retrouver une invitation et marquer l’arrivée. Ici, le scan est simulé : aucun contrôle réel n’a lieu.</p>
        <button className={`button ${checkedIn ? "button--success" : "button--red"}`} type="button" onClick={onCheckIn} disabled={checkedIn}>
          {checkedIn ? <><CheckIcon /> Arrivée enregistrée</> : <>Simuler le scan <ArrowIcon /></>}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("invitation");
  const [submitted, setSubmitted] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [guestName, setGuestName] = useState("Invité de démonstration");
  const [guestResponse, setGuestResponse] = useState<"yes" | "no">("yes");
  const [theme, setTheme] = useState<Theme>("light");
  const activeIndex = stages.findIndex((item) => item.id === stage);
  const nextStage = stages[(activeIndex + 1) % stages.length];

  const wa = useMemo(() => whatsappLink(), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = () => {
      if (window.localStorage.getItem("festia-theme")) return;
      const systemTheme = media.matches ? "dark" : "light";
      setTheme(systemTheme);
      document.documentElement.dataset.theme = systemTheme;
    };
    const saved = window.localStorage.getItem("festia-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      applySystemTheme();
    }
    media.addEventListener("change", applySystemTheme);
    return () => media.removeEventListener("change", applySystemTheme);
  }, []);

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enteredName = String(data.get("name") ?? "").trim();
    const answer = String(data.get("answer") ?? "yes");
    setGuestName(enteredName || "Invité de démonstration");
    setGuestResponse(answer === "no" ? "no" : "yes");
    setSubmitted(true);
  }

  function selectStage(next: Stage) {
    setStage(next);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("festia-theme", next);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Festia, accueil">festia<BrandSeal /></a>
        <nav className="main-nav" aria-label="Navigation principale">
          <a href="#demonstration">La démo</a>
          <a href="#formules">Les formules</a>
          <a href="#comment">Comment ça marche</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Passer en mode ${theme === "dark" ? "clair" : "sombre"}`} title={`Passer en mode ${theme === "dark" ? "clair" : "sombre"}`}>
          <ThemeIcon theme={theme} /><span className="sr-only">Mode {theme === "dark" ? "sombre" : "clair"}</span>
        </button>
        <a className="header-contact" href={wa} target="_blank" rel="noreferrer">Parler de mon événement <ArrowIcon /></a>
      </header>

      <section className="opening-spread" id="top">
        <div className="opening-copy">
          <p className="edition-line"><span>INVITATIONS DIGITALES</span><span>ÉDITION PILOTE · 2026–27</span></p>
          <h1>L’invitation est le début <em>de la fête.</em></h1>
          <p className="opening-lede">Mariage, anniversaire ou cérémonie familiale : une page élégante à partager, les réponses de vos proches réunies, un accueil mieux préparé le jour J.</p>
          <div className="opening-actions">
            <a className="button button--red" href="#formules">Découvrir les formules <ArrowIcon /></a>
            <a className="underlined-link" href="#demonstration">Parcourir la démo</a>
          </div>
          <div className="pilot-note"><span className="pilot-dot" /> Test en cours au Bénin, au Togo et en Côte d’Ivoire</div>
        </div>
        <div className="opening-art" aria-label="Exemple fictif d’invitation">
          <div className="opening-art__folio"><span className="folio-index">DOSSIER FESTIA <b>Nº 001</b></span><InvitePreview onConfirm={() => setStage("rsvp")} /><span className="folio-caption">Une invitation de démonstration · Noms fictifs</span><span className="folio-caption folio-caption--promise">Une page · un lien · toutes les réponses</span></div>
        </div>
      </section>

      <section className="price-ribbon" aria-label="Prix indicatifs à tester">
        <span>FORMULES PILOTES · PRIX INDICATIFS À TESTER</span>
        <div><b>Essentielle</b><strong>50 000 FCFA</strong></div>
        <div><b>Premium</b><strong>75 000 FCFA</strong></div>
        <div><b>Sur mesure</b><strong>Sur devis</strong></div>
        <a href="#formules">Comparer <ArrowIcon /></a>
      </section>

      <section className="demo-section section-shell" id="demonstration">
        <div className="section-heading">
          <div><p className="section-eyebrow">FEUILLETER LA DÉMONSTRATION</p><h2>Du premier lien<br />à l’accueil des invités.</h2></div>
          <p>Explorez les deux côtés de l’expérience : l’invité répond simplement, l’organisateur voit les réponses et prépare l’entrée.</p>
        </div>

        <div className="demo-book">
          <div className="demo-book__side">
            <p className="micro-label">LE PARCOURS</p>
            <div className="stage-list" role="group" aria-label="Étapes de la démonstration">
              {stages.map((item) => (
                <button className={`stage-tab${stage === item.id ? " is-active" : ""}`} key={item.id} type="button" aria-pressed={stage === item.id} onClick={() => selectStage(item.id)}>
                  <span>{item.number}</span><b>{item.label}</b><i aria-hidden="true"><StageArrowIcon /></i>
                </button>
              ))}
            </div>
            <p className="demo-book__footnote">Tout est fictif. Aucun formulaire ne transmet de données.</p>
          </div>
          <div className="demo-book__page" role="tabpanel">
            <StageBody stage={stage} submitted={submitted} checkedIn={checkedIn} guestName={guestName} guestResponse={guestResponse} onRsvp={submitRsvp} onRsvpStep={() => setStage("rsvp")} onCheckIn={() => setCheckedIn(true)} />
            <div className="demo-next"><span>ÉTAPE SUIVANTE</span><button type="button" onClick={() => setStage(nextStage.id)}>{nextStage.label} <ArrowIcon /></button></div>
          </div>
        </div>
      </section>

      <section className="offer-section" id="formules">
        <div className="section-shell">
          <div className="section-heading section-heading--offers">
            <div><p className="section-eyebrow">TROIS FAÇONS DE COMMENCER</p><h2>Une belle invitation,<br />à votre mesure.</h2></div>
            <p>Les formules et leurs prix sont des hypothèses de lancement. Le brief permet de confirmer ce qui convient à votre événement.</p>
          </div>

          <div className="offers-list">
            <article className="offer-row">
              <div className="offer-row__name"><span>01</span><h3>Essentielle</h3></div>
              <div className="offer-row__detail"><p>Une invitation web à partir d’un modèle choisi ensemble, personnalisée avec vos textes, couleurs et photos.</p><ul><li>Page événement responsive</li><li>Lien partageable</li><li>RSVP et suivi des réponses</li></ul></div>
              <div className="offer-row__price"><strong>50 000 <small>FCFA</small></strong><span>Prix indicatif pilote</span><a href={`${whatsappLink("Essentielle")}`} target="_blank" rel="noreferrer">Parler de cette formule <ArrowIcon /></a></div>
            </article>
            <article className="offer-row offer-row--featured">
              <div className="offer-row__name"><span>02</span><h3>Premium</h3><b className="offer-ribbon">LA PLUS COMPLÈTE</b></div>
              <div className="offer-row__detail"><p>Une direction plus personnelle pour donner à votre événement un univers qui lui ressemble.</p><ul><li>Tout le contenu Essentielle</li><li>Galerie, programme et informations pratiques</li><li>Présentation visuelle plus personnalisée</li></ul></div>
              <div className="offer-row__price"><strong>75 000 <small>FCFA</small></strong><span>Prix indicatif pilote</span><a href={whatsappLink("Premium")} target="_blank" rel="noreferrer">Parler de cette formule <ArrowIcon /></a></div>
            </article>
            <article className="offer-row">
              <div className="offer-row__name"><span>03</span><h3>Sur mesure</h3></div>
              <div className="offer-row__detail"><p>Pour les besoins particuliers : invitations nominatives, catégories d’accès ou accueil par badge et QR code.</p><ul><li>Étude du besoin avec vous</li><li>Parcours et accès à définir</li><li>QR et contrôle d’entrée à valider</li></ul></div>
              <div className="offer-row__price"><strong>Sur devis</strong><span>Selon l’événement</span><a href={whatsappLink("Sur mesure")} target="_blank" rel="noreferrer">Décrire mon besoin <ArrowIcon /></a></div>
            </article>
          </div>
          <p className="pricing-note">Prix et inclusions affichés à titre de test auprès de prospects. Le devis final et la faisabilité des options sont confirmés avant commande.</p>
        </div>
      </section>

      <section className="service-section section-shell" id="comment">
        <div className="service-copy"><p className="section-eyebrow">UN SERVICE ACCOMPAGNÉ</p><h2>Vous racontez l’événement.<br /><em>On prépare l’invitation.</em></h2><p>Vous partagez les informations et l’ambiance que vous imaginez. Nous concevons la page, vous la relisez, puis vous envoyez le lien à vos invités.</p><a href={wa} className="button button--dark" target="_blank" rel="noreferrer">Parler de mon événement <ArrowIcon /></a><p className="partner-note"><strong>Vous êtes prestataire événementiel ?</strong> Nous pouvons préparer les invitations des événements de vos clients.</p><a className="partner-link" href={whatsappLink("Prestataire événementiel")} target="_blank" rel="noreferrer">Parler d’une collaboration <ArrowIcon /></a></div>
        <div className="service-steps">
          <div><span>1</span><p><b>Vous nous racontez</b><small>Type d’événement, date, lieu et style souhaité.</small></p></div>
          <div><span>2</span><p><b>Nous créons la page</b><small>Un aperçu vous est présenté pour validation.</small></p></div>
          <div><span>3</span><p><b>Vous partagez le lien</b><small>Les invités répondent sans créer de compte.</small></p></div>
          <div><span>4</span><p><b>Vous préparez l’accueil</b><small>Retrouvez les réponses et explorez les badges d’accès en démo.</small></p></div>
        </div>
      </section>

      <section className="closing-note">
        <div className="closing-note__mark">F</div>
        <p>Chaque célébration mérite une invitation<br /><em>qui lui ressemble.</em></p>
        <a className="button button--paper" href={wa} target="_blank" rel="noreferrer">Parler de mon événement <ArrowIcon /></a>
        <span className="closing-note__foot">FESTIA · BÉNIN · TOGO · CÔTE D’IVOIRE · 2026–27</span>
      </section>

      <footer className="site-footer">
        <a className="wordmark wordmark--footer" href="#top">festia<BrandSeal /></a>
        <p>Service assisté d’invitations digitales. Prototype de validation — les personnes, événements, réponses et codes illustrés sont fictifs.</p>
        <a href={wa} target="_blank" rel="noreferrer">WhatsApp <ArrowIcon /></a>
      </footer>
    </main>
  );
}
