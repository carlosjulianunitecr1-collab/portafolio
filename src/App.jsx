import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  ArrowUpRight,
  Bot,
  Box,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Code,
  Cpu,
  Database,
  Factory,
  Network,
  Plus,
  RadioTower,
  ScanEye,
  Server,
  ShieldCheck,
  Truck,
  Wifi,
  X,
  Zap
} from "lucide-react";
import {
  CONTACT,
  EVIDENCE_COUNT,
  EXP,
  KEYWORDS,
  aboutText,
  projects,
  skills,
  training,
  trainingTitles,
  translations
} from "./data.js";

/* =========================================================
   CONSTANTES
========================================================= */

const EASE = [0.16, 1, 0.3, 1];

/* Video del hero. Si no carga, se usa uno propio del proyecto. */
const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

const HERO_VIDEO_FALLBACK = "videos/evidencia/video-05.mp4";

const NAV = [
  ["inicio", "nav_home"],
  ["sobre-mi", "nav_about"],
  ["experiencia", "nav_experience"],
  ["proyectos", "nav_projects"],
  ["galeria", "nav_gallery"],
  ["evidencia", "nav_evidence"],
  ["planos", "nav_plans"],
  ["especialidad", "nav_specialty"],
  ["formacion", "nav_training"],
  ["contacto", "nav_contact"]
];

/* Un icono por área (mismo orden que `skills`) */
const SKILL_ICONS = [
  Code, Cpu, Bot, Wifi,
  BrainCircuit, ScanEye, Network, ShieldCheck,
  Server, Database, Factory, Truck,
  CircuitBoard, Box, RadioTower, Zap
];

const pad2 = (n) => String(n).padStart(2, "0");

/* "SOBRE MÍ" -> "Sobre mí" (solo cambia la capitalización al mostrar) */
const WORDS = {
  cv: "CV",
  ai: "AI",
  ia: "IA",
  iot: "IoT",
  i: "I",
  whatsapp: "WhatsApp"
};

const sc = (s = "") => {
  if (!s || s !== s.toUpperCase()) return s;

  const low = s
    .toLowerCase()
    .replace(/\b\w*\d\w*\b/g, (m) => m.toUpperCase())
    .replace(/\b[a-z]+\b/g, (m) => WORDS[m] ?? m);

  return low.charAt(0).toUpperCase() + low.slice(1);
};

/* =========================================================
   IDIOMA
========================================================= */

const LangContext = createContext({
  lang: "es",
  t: (k) => k
});

const useLang = () => useContext(LangContext);

/* =========================================================
   UTILIDADES DE MOTION
========================================================= */

function Reveal({
  as = "div",
  delay = 0,
  y = 16,
  className,
  children,
  ...rest
}) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const stagger = (i, cols = 3) => (i % cols) * 0.07;

/* =========================================================
   ÍCONOS
========================================================= */

function DotsGrid() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="9" cy="3" r="1.5" />
      <circle cx="3" cy="9" r="1.5" />
      <circle cx="9" cy="9" r="1.5" />
    </svg>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ lang, setLang, menuOpen, setMenuOpen }) {
  const { t } = useLang();

  return (
    <motion.header
      className="nav"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="nav-left">
        <a className="brand" href="#inicio" aria-label={t("nav_home")}>
          <span className="brand-logo">
            <img src="img/logo.png" alt={t("logo_alt")} />
          </span>

          <span className="brand-name">
            CARLOS MANUEL JULIAN VITE
          </span>
        </a>

        <button
          type="button"
          className="menu-pill"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`menu-circle${menuOpen ? " is-open" : ""}`}>
            <Plus size={12} strokeWidth={3} />
          </span>

          <span>
            {menuOpen ? t("menu_close") : t("menu")}
          </span>
        </button>

        <div className="nav-tags" aria-hidden="true">
          <span>{t("nav_tag1")}</span>
          <span>{t("nav_tag2")}</span>
          <span>{t("nav_tag3")}</span>
        </div>
      </div>

      <div className="nav-right">
        <div
          className="lang"
          role="group"
          aria-label="Idioma / Language"
        >
          <button
            type="button"
            className={lang === "es" ? "active" : ""}
            aria-pressed={lang === "es"}
            onClick={() => setLang("es")}
          >
            ES
          </button>

          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>

        <div className="nav-areas">
          <a
            href="#especialidad"
            className="nav-areas-btn"
            aria-label={t("nav_areas_aria")}
          >
            <DotsGrid />
          </a>

          <span>{t("nav_areas")}</span>
        </div>
      </div>
    </motion.header>
  );
}

/* =========================================================
   MENÚ A PANTALLA COMPLETA
========================================================= */

function MenuOverlay({ open, active, onGo }) {
  const { t } = useLang();

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="menu"
          className="menu"
          aria-label="Menú"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <ul>
            {NAV.map(([id, key], i) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15 + i * 0.045,
                  ease: EASE
                }}
              >
                <a
                  href={`#${id}`}
                  className={`m-link${active === id ? " active" : ""}`}
                  onClick={(e) => onGo(e, id)}
                >
                  <i className="m-dot" />
                  {sc(t(key))}
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="menu-foot"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: EASE
            }}
          >
            <a
              className="btn btn-light"
              href="docs/CV-Carlos-Manuel-Julian-Vite.pdf"
              target="_blank"
              rel="noopener"
            >
              {sc(t("cv"))}
            </a>

            <span className="menu-foot-text">
              {t("footer")}
            </span>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  const { t } = useLang();
  const [fallback, setFallback] = useState(false);
  const videoRef = useRef(null);

  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches
  );

  const src = fallback ? HERO_VIDEO_FALLBACK : HERO_VIDEO;

  useEffect(() => {
    if (reduce) videoRef.current?.pause();
  }, [reduce, src]);

  return (
    <section id="inicio" className="hero">
      <motion.div
        className="hero-video"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <div className="hero-video-box">
          <video
            key={src}
            ref={videoRef}
            className={fallback ? "is-local" : ""}
            src={src}
            autoPlay={!reduce}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setFallback(true)}
          />
        </div>
      </motion.div>

      <div className="hero-top" aria-hidden="true" />

      <motion.div
        className="hero-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: EASE
        }}
      >
        <div className="hero-footer-in">
          <div className="hero-left">
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: EASE
              }}
            >
              <span className="dot" />

              <span className="hero-sub-name">
                Carlos Manuel Julian Vite
              </span>

              <span className="hero-sub-role">
                {t("hero_role")}
              </span>
            </motion.p>

            <motion.h1
              className="hero-h"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease: EASE
              }}
            >
              <span className="soft">
                {t("hero_greeting")}
              </span>

              <span>{t("hero_l1")}</span>
              <span>{t("hero_l2")}</span>
              <span>{t("hero_l3")}</span>
            </motion.h1>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: EASE
              }}
            >
              {t("hero_description")}
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.0,
                ease: EASE
              }}
            >
              <a href="#proyectos" className="btn btn-dark">
                {t("btn_projects")}
              </a>

              <a href="#sobre-mi" className="btn btn-outline">
                {t("btn_about")}
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hero-tags"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 1.1,
              ease: EASE
            }}
          >
            <span>{t("tag1")}</span>
            <span>{t("tag2")}</span>
            <span>{t("tag3")}</span>
            <span>{t("tag4")}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================
   BANDA DE PALABRAS CLAVE
========================================================= */

function Band() {
  const row = KEYWORDS.map((w) => sc(w));

  return (
    <div className="band" aria-hidden="true">
      <div className="band-track">
        {[0, 1].map((k) => (
          <div className="band-row" key={k}>
            {row.map((w) => (
              <span key={`${k}-${w}`}>
                {w}
                <i />
              </span>
            ))}

            {row.map((w) => (
              <span key={`${k}-b-${w}`}>
                {w}
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ENCABEZADO DE SECCIÓN
========================================================= */

function SectionHead({ title, intro }) {
  return (
    <Reveal className="sec-head">
      <div className="sec-mark" />
      <h2 className="sec-title">{sc(title)}</h2>
      {intro && <p className="sec-intro">{intro}</p>}
    </Reveal>
  );
}

/* =========================================================
   SOBRE MÍ
========================================================= */

function About() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [lead, ...rest] = aboutText[lang];

  const stats = [
    ["7", "stat1"],
    ["9", "stat2"],
    ["4", "stat3"],
    ["12", "stat4"]
  ];

  return (
    <section id="sobre-mi" className="sec">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-main">
            <SectionHead title={t("about_title")} />

            <Reveal
              as="p"
              className="lead"
              delay={0.05}
            >
              {lead}
            </Reveal>

            <Reveal
              className="about-actions"
              delay={0.1}
            >
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {sc(
                  t(
                    open
                      ? "about_less"
                      : "about_more"
                  )
                )}
              </button>

              <a
                className="btn btn-outline"
                href="docs/CV-Carlos-Manuel-Julian-Vite.pdf"
                target="_blank"
                rel="noopener"
                aria-label={t("open_cv")}
              >
                {sc(t("cv"))}
              </a>
            </Reveal>
          </div>

          <aside className="about-side">
            <Reveal as="figure" className="logo-card">
              <img
                src="img/logo.png"
                alt={t("logo_alt")}
                width="1582"
                height="656"
                loading="lazy"
              />
            </Reveal>

            <div className="stats">
              {stats.map(([n, key], i) => (
                <Reveal
                  className="stat"
                  key={key}
                  delay={stagger(i, 2)}
                >
                  <b>{n}</b>
                  <small>{t(key)}</small>
                </Reveal>
              ))}
            </div>
          </aside>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className="about-more"
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: "auto",
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.9,
                ease: EASE
              }}
            >
              <div className="about-more-in">
                {rest.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* =========================================================
   EXPERIENCIA
========================================================= */

function Experience() {
  const { t, lang } = useLang();

  return (
    <section
      id="experiencia"
      className="sec sec-tight"
    >
      <div className="wrap">
        <SectionHead
          title={t("experience_title")}
          intro={t("experience_intro")}
        />

        <div className="tl">
          {EXP.map((e, i) => {
            const [title, sub, items] = e[lang];

            return (
              <Reveal
                as="article"
                className="tl-item"
                key={i}
              >
                <div className="tl-when">
                  {e.when[lang]}
                </div>

                <div>
                  <h3>{title}</h3>
                  <h4>{sub}</h4>

                  <ul>
                    {items.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="edu">
          <Reveal className="edu-card">
            <b>{t("edu_master")}</b>
            <span>{t("edu_master_d")}</span>
          </Reveal>

          <Reveal
            className="edu-card"
            delay={0.07}
          >
            <b>{t("edu_eng")}</b>
            <span>{t("edu_eng_d")}</span>
          </Reveal>

          <Reveal
            className="edu-card"
            delay={0.14}
          >
            <b>{t("edu_tech_t")}</b>
            <span>{t("edu_tech_d")}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PROYECTOS
========================================================= */

function ProjectCard({
  project,
  index,
  onOpen
}) {
  const { lang } = useLang();

  const title =
    lang === "es"
      ? project.esTitle
      : project.enTitle;

  return (
    <Reveal
      as="div"
      className="pcard-wrap"
      delay={stagger(index)}
    >
      <button
        type="button"
        className="pcard"
        onClick={() => onOpen(index)}
      >
        <span className="pcard-media">
          <img
            src={project.image}
            alt={title}
            loading="lazy"
            decoding="async"
          />

          <em className="pcard-n">
            {pad2(index + 1)}
          </em>

          <span
            className="pcard-go"
            aria-hidden="true"
          >
            <ArrowUpRight
              size={16}
              strokeWidth={2}
            />
          </span>
        </span>

        <span className="pcard-info">
          <h3>{title}</h3>
          <p>{project.tags}</p>
        </span>
      </button>
    </Reveal>
  );
}

function Projects({ onOpen }) {
  const { t } = useLang();
  const [more, setMore] = useState(false);

  return (
    <section
      id="proyectos"
      className="sec dark"
    >
      <div className="wrap">
        <SectionHead
          title={t("projects_title")}
          intro={t("projects_intro")}
        />

        <div className="pgrid">
          {projects
            .slice(0, 6)
            .map((p, i) => (
              <ProjectCard
                key={p.esTitle}
                project={p}
                index={i}
                onOpen={onOpen}
              />
            ))}
        </div>

        <AnimatePresence initial={false}>
          {more && (
            <motion.div
              className="pmore"
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: "auto",
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 1,
                ease: EASE
              }}
            >
              <div className="pgrid pgrid-more">
                {projects
                  .slice(6)
                  .map((p, i) => (
                    <ProjectCard
                      key={p.esTitle}
                      project={p}
                      index={i + 6}
                      onOpen={onOpen}
                    />
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="center">
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => setMore((v) => !v)}
            aria-expanded={more}
          >
            {sc(
              t(more ? "less" : "more")
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   EVIDENCIA
========================================================= */

function ModelCard({ n }) {
  const { t } = useLang();
  const ref = useRef(null);

  const visible = useInView(ref, {
    once: true,
    margin: "240px"
  });

  return (
    <div
      className="mcard"
      ref={ref}
    >
      <div className="mcard-stage">
        {visible ? (
          <model-viewer
            src={`modelos3d/modelo-${n}.glb`}
            camera-controls=""
            touch-action="pan-y"
            auto-rotate=""
            shadow-intensity="1"
            exposure="1"
            environment-image="neutral"
            alt={`${t("model_alt")} ${n}`}
          ></model-viewer>
        ) : (
          <span className="mcard-wait">
            3D
          </span>
        )}
      </div>

      <div className="mcard-info">
        <h4>
          {sc(t("model_word"))} {n}
        </h4>

        <p>{t("model_hint")}</p>
      </div>
    </div>
  );
}

function Evidence({ onImage }) {
  const { t } = useLang();

  const photos = Array.from(
    { length: EVIDENCE_COUNT.photos },
    (_, i) => pad2(i + 1)
  );

  const videos = Array.from(
    { length: EVIDENCE_COUNT.videos },
    (_, i) => pad2(i + 1)
  );

  const models = Array.from(
    { length: EVIDENCE_COUNT.models },
    (_, i) => pad2(i + 1)
  );

  return (
    <section
      id="evidencia"
      className="sec grey"
    >
      <div className="wrap">
        <SectionHead
          title={t("evidence_title")}
          intro={t("evidence_intro")}
        />

        <div className="ev-cat">
          <Reveal className="ev-head">
            <h3>{sc(t("photos"))}</h3>
            <span className="count">
              {EVIDENCE_COUNT.photos}
            </span>
          </Reveal>

          <div className="photos">
            {photos.map((n) => (
              <button
                type="button"
                className="photo"
                key={n}
                onClick={() =>
                  onImage(
                    `img/evidencia/imagen-${n}.jpg`
                  )
                }
              >
                <img
                  src={`img/evidencia/imagen-${n}.jpg`}
                  alt={`${t("evidence_alt")} ${n}`}
                  loading="lazy"
                  decoding="async"
                />

                <span className="photo-n">
                  {n}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="ev-cat">
          <Reveal className="ev-head">
            <h3>{sc(t("videos"))}</h3>
            <span className="count">
              {EVIDENCE_COUNT.videos}
            </span>
          </Reveal>

          <div className="vgrid">
            {videos.map((n, i) => (
              <Reveal
                className="vcard"
                key={n}
                delay={stagger(i)}
              >
                <video
                  controls
                  preload="metadata"
                >
                  <source
                    src={`videos/evidencia/video-${n}.mp4`}
                    type="video/mp4"
                  />

                  {t("no_video")}
                </video>

                <div className="vcard-info">
                  {t("video_word")} {n}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="ev-cat">
          <Reveal className="ev-head">
            <h3>{sc(t("models"))}</h3>
            <span className="count">
              {EVIDENCE_COUNT.models}
            </span>
          </Reveal>

          <div className="mgrid">
            {models.map((n, i) => (
              <Reveal
                key={n}
                delay={stagger(i)}
              >
                <ModelCard n={n} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PLANOS TÉCNICOS
========================================================= */

/*
  BASE_URL permite que los archivos funcionen tanto
  en localhost como en GitHub Pages:

  localhost:
  /planos/...

  GitHub Pages:
  /portafolio/planos/...
*/
const BASE_URL = import.meta.env.BASE_URL;

const TECHNICAL_PLANS = [
  {
    file: `${BASE_URL}planos/subestacion-electrica.dwg`,
    preview: `${BASE_URL}planos/preview/torre-transmision-230kv.png`,
    es: "Subestación eléctrica",
    en: "Electrical Substation",
    categoryEs: "Ingeniería eléctrica · Infraestructura",
    categoryEn: "Electrical engineering · Infrastructure"
  },
  {
    file: `${BASE_URL}planos/torre-transmision-230kv.dwg`,
    preview: `${BASE_URL}planos/preview/subestacion-electrica.png`,
    es: "Torre de transmisión 230 kV",
    en: "230 kV Transmission Tower",
    categoryEs: "Alta tensión · Energía",
    categoryEn: "High voltage · Energy"
  },
  {
    file: `${BASE_URL}planos/banco-transformadores.dwg`,
    preview: `${BASE_URL}planos/preview/banco-transformadores.png`,
    es: "Banco de transformadores",
    en: "Transformer Bank",
    categoryEs: "Sistemas de potencia · Transformación",
    categoryEn: "Power systems · Transformation"
  },
  {
    file: `${BASE_URL}planos/proyecto-transformacion-aceites.dwg`,
    preview: `${BASE_URL}planos/preview/proyecto-transformacion-aceites.png`,
    es: "Proyecto de transformación de aceites",
    en: "Oil Transformation Project",
    categoryEs: "Procesos industriales · Ingeniería",
    categoryEn: "Industrial processes · Engineering"
  },
  {
    file: `${BASE_URL}planos/pid-planta-industrial.dwg`,
    preview: `${BASE_URL}planos/preview/pid-planta-industrial.png`,
    es: "P&ID de planta industrial",
    en: "Industrial Plant P&ID",
    categoryEs: "Procesos · Instrumentación",
    categoryEn: "Processes · Instrumentation"
  }
];

function TechnicalPlans() {
  const { lang } = useLang();

  return (
    <section
      id="planos"
      className="sec"
    >
      <div className="wrap">
        <SectionHead
          title={
            lang === "es"
              ? "Planos técnicos"
              : "Technical drawings"
          }
          intro={
            lang === "es"
              ? "Documentación CAD relacionada con ingeniería eléctrica, energía, procesos industriales e infraestructura."
              : "CAD documentation related to electrical engineering, energy, industrial processes and infrastructure."
          }
        />

        <div className="plans-grid">
          {TECHNICAL_PLANS.map((plan, i) => (
            <Reveal
              as="article"
              className="plan-card"
              key={plan.file}
              delay={stagger(i, 3)}
            >
              <div className="plan-preview">
                <img
                  src={plan.preview}
                  alt={
                    lang === "es"
                      ? plan.es
                      : plan.en
                  }
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="plan-number">
                {pad2(i + 1)}
              </div>

              <div className="plan-body">
                <h3>
                  {lang === "es"
                    ? plan.es
                    : plan.en}
                </h3>

                <p>
                  {lang === "es"
                    ? plan.categoryEs
                    : plan.categoryEn}
                </p>
              </div>

              <a
                className="plan-download"
                href={plan.file}
                download
                aria-label={
                  lang === "es"
                    ? `Descargar ${plan.es}`
                    : `Download ${plan.en}`
                }
              >
                <span>
                  {lang === "es"
                    ? "DESCARGAR DWG"
                    : "DOWNLOAD DWG"}
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.6}
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ESPECIALIDAD / ÁREAS
========================================================= */

function Specialty() {
  const { t, lang } = useLang();

  return (
    <section
      id="especialidad"
      className="sec"
    >
      <div className="wrap">
        <SectionHead
          title={t("specialty_title")}
          intro={t("specialty_intro")}
        />

        <div className="agrid">
          {skills.map((s, i) => {
            const Icon =
              SKILL_ICONS[i] ?? Cpu;

            const title =
              lang === "es"
                ? s[0]
                : s[2];

            const desc =
              lang === "es"
                ? s[1]
                : s[3];

            return (
              <Reveal
                as="article"
                className="acard"
                key={s[0]}
                delay={stagger(i, 4)}
              >
                <span className="acard-ico">
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                  />
                </span>

                <div>
                  <h3>{sc(title)}</h3>
                  <p>{desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FORMACIÓN / CERTIFICACIONES
========================================================= */

function Training() {
  const { t, lang } = useLang();

  return (
    <section
      id="formacion"
      className="sec grey"
    >
      <div className="wrap">
        <SectionHead
          title={t("training_title")}
          intro={t("training_intro")}
        />

        <div className="cgrid">
          {training.map((g) => {
            const items =
              lang === "es"
                ? g.es
                : g.en;

            const title =
              trainingTitles[g.title]?.[lang] ??
              sc(g.title);

            return (
              <Reveal
                as="article"
                className="crow"
                key={g.title}
              >
                <h3>{title}</h3>

                <ul>
                  {items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACTO
========================================================= */

function Contact({ onPhone }) {
  const { t } = useLang();

  const paragraphs = t(
    "contact_text"
  ).split("<br><br>");

  return (
    <section
      id="contacto"
      className="sec dark contact"
    >
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="sec-mark" />

          <p className="contact-kicker">
            {sc(t("contact_title"))}
          </p>

          <h2 className="contact-big">
            {sc(t("connect"))}
          </h2>
        </Reveal>

        <Reveal
          className="contact-text"
          delay={0.05}
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>

        <div className="cards">
          <Reveal>
            <button
              type="button"
              className="ccard"
              onClick={onPhone}
            >
              <small>{sc(t("phone"))}</small>

              <strong>
                {CONTACT.phoneDisplay}
              </strong>

              <ArrowUpRight
                className="ccard-arrow"
                size={20}
                strokeWidth={1.5}
              />
            </button>
          </Reveal>

          <Reveal delay={0.07}>
            <a
              className="ccard"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>LinkedIn</small>

              <strong>
                {CONTACT.linkedinName}
              </strong>

              <ArrowUpRight
                className="ccard-arrow"
                size={20}
                strokeWidth={1.5}
              />
            </a>
          </Reveal>

          <Reveal delay={0.14}>
            <a
              className="ccard"
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>GitHub</small>

              <strong>
                {CONTACT.githubName}
              </strong>

              <ArrowUpRight
                className="ccard-arrow"
                size={20}
                strokeWidth={1.5}
              />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <span>
        CARLOS MANUEL JULIAN VITE
      </span>

      <span>{t("footer")}</span>
    </footer>
  );
}

/* =========================================================
   MODALES
========================================================= */

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.4,
    ease: EASE
  }
};

function ProjectModal({
  index,
  onClose
}) {
  const { lang } = useLang();

  const project =
    index === null
      ? null
      : projects[index];

  const title = project
    ? lang === "es"
      ? project.esTitle
      : project.enTitle
    : "";

  const description = project
    ? lang === "es"
      ? project.es
      : project.en
    : "";

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="overlay"
          {...overlayMotion}
          onClick={(e) =>
            e.target === e.currentTarget &&
            onClose()
          }
        >
          <motion.div
            className="pmodal"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.97
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.98
            }}
            transition={{
              duration: 0.7,
              ease: EASE
            }}
          >
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="×"
              autoFocus
            >
              <X
                size={18}
                strokeWidth={1.75}
              />
            </button>

            <img
              className="pmodal-img"
              src={project.image}
              alt={title}
            />

            <div className="pmodal-body">
              <h2>{title}</h2>

              <p className="pmodal-tags">
                {project.tags}
              </p>

              {description
                .trim()
                .split("\n\n")
                .map((p, i) => (
                  <p key={i}>
                    {p.trim()}
                  </p>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MediaModal({
  src,
  onClose
}) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="overlay overlay-media"
          {...overlayMotion}
          onClick={(e) =>
            e.target === e.currentTarget &&
            onClose()
          }
        >
          <button
            type="button"
            className="close close-fixed"
            onClick={onClose}
            aria-label="×"
            autoFocus
          >
            <X
              size={18}
              strokeWidth={1.75}
            />
          </button>

          <motion.img
            className="media-img"
            src={src}
            alt=""
            initial={{
              opacity: 0,
              scale: 0.96
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.98
            }}
            transition={{
              duration: 0.6,
              ease: EASE
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhoneModal({
  open,
  onClose
}) {
  const { t } = useLang();
  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        CONTACT.phoneDisplay
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        2200
      );
    } catch {
      /* sin permiso de portapapeles: no hace nada */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay"
          {...overlayMotion}
          onClick={(e) =>
            e.target === e.currentTarget &&
            onClose()
          }
        >
          <motion.div
            className="phone-box"
            role="dialog"
            aria-modal="true"
            aria-label={t("phone")}
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98
            }}
            transition={{
              duration: 0.6,
              ease: EASE
            }}
          >
            <h3>
              {CONTACT.phoneMenu}
            </h3>

            <button
              type="button"
              className="opt"
              onClick={copy}
              autoFocus
            >
              {copied
                ? t("copied")
                : sc(t("copy"))}
            </button>

            <a
              className="opt"
              href={`tel:${CONTACT.phoneTel}`}
            >
              {sc(t("call"))}
            </a>

            <a
              className="opt"
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener"
            >
              {sc(t("whatsapp"))}
            </a>

            <button
              type="button"
              className="opt opt-quiet"
              onClick={onClose}
            >
              {sc(t("close"))}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [lang, setLang] =
    useState("es");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [project, setProject] =
    useState(null);

  const [image, setImage] =
    useState(null);

  const [phone, setPhone] =
    useState(false);

  const [active, setActive] =
    useState("inicio");

  const t = (key) =>
    translations[lang][key] ??
    translations.es[key] ??
    key;

  /* idioma del documento */
  useEffect(() => {
    document.documentElement.lang =
      lang;

    document.title =
      t("title_page");
  }, [lang]);

  /* bloquear scroll cuando hay algo abierto */
  const locked =
    menuOpen ||
    project !== null ||
    image !== null ||
    phone;

  useEffect(() => {
    document.body.style.overflow =
      locked ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [locked]);

  /* Escape cierra todo */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;

      setMenuOpen(false);
      setProject(null);
      setImage(null);
      setPhone(false);
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKey
      );
  }, []);

  /* sección activa */
  useEffect(() => {
    const io =
      new IntersectionObserver(
        (entries) =>
          entries.forEach(
            (e) =>
              e.isIntersecting &&
              setActive(e.target.id)
          ),
        {
          rootMargin:
            "-45% 0px -50% 0px"
        }
      );

    NAV.forEach(([id]) => {
      const el =
        document.getElementById(id);

      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const goTo = (e, id) => {
    e.preventDefault();

    setMenuOpen(false);

    setTimeout(
      () =>
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: "smooth"
          }),
      80
    );
  };

  return (
    <LangContext.Provider
      value={{ lang, t }}
    >
      <MotionConfig reducedMotion="user">
        <Navbar
          lang={lang}
          setLang={setLang}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        <MenuOverlay
          open={menuOpen}
          active={active}
          onGo={goTo}
        />

        <main>
          <Hero />

          <Band />

          <About />

          <Experience />

          <Projects
            onOpen={setProject}
          />

          <Evidence
            onImage={setImage}
          />

          <TechnicalPlans />

          <Specialty />

          <Training />

          <Contact
            onPhone={() =>
              setPhone(true)
            }
          />
        </main>

        <Footer />

        <ProjectModal
          index={project}
          onClose={() =>
            setProject(null)
          }
        />

        <MediaModal
          src={image}
          onClose={() =>
            setImage(null)
          }
        />

        <PhoneModal
          open={phone}
          onClose={() =>
            setPhone(false)
          }
        />
      </MotionConfig>
    </LangContext.Provider>
  );
}