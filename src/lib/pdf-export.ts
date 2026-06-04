import { jsPDF } from "jspdf";
import {
  strategicPillars,
  intelligenceFlywheel,
  platformShift,
  personas,
  jobsToBeDone,
  vocEvidence,
  seCorporateBlueprint,
  painInventory,
  maturityLadder,
  seraKPIs,
  whyNowColumns,
  existingTools,
  idmCapabilities,
  ecmIngestionEngine,
  regionalJourneys,
  sustainabilityStrategicContext,
} from "@/data/playbook-data";

const SLIDE_W = 10;
const SLIDE_H = 5.625;
const BRAND_GREEN = "3DCD58";
const DARK_BG = "1A1A1A";
const CARD_BG = "262626";
const TEXT_WHITE = "FFFFFF";
const TEXT_MUTED = "A1A1AA";
const ORANGE = "F97316";

const COL_HEX: Record<string, string> = {
  amber: "F59E0B",
  orange: "F97316",
  emerald: "10B981",
  blue: "3B82F6",
  violet: "8B5CF6",
  green: "22C55E",
};

type TextOptions = {
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  align?: "left" | "center" | "right";
  fit?: boolean;
  minFontSize?: number;
  lineHeight?: number;
};

const executiveSummarySlides = [
  {
    title: "Sustainability CoE expertise is proven, but not yet scaled through RA+",
    body: "The Sustainability CoE already delivers trusted advisory, implementation, IDM, and Global Energy Bureau capabilities across public and private sectors. The RA+ opportunity is to convert that operating strength into a repeatable platform capability that reaches customers earlier, guides action faster, and supports continuous improvement.",
  },
  {
    title: "A governed Sustainability CoE capability embedded in RA+",
    body: "The north star is an authoritative sustainability foundation inside RA+ that connects IDM as the trusted interval-data system of record, expert CoE knowledge, and guided workflows. It should power goal-based Strategy recommendations, site-level Building View discovery, structured deliverables, and a clear path from early insight to expert engagement.",
  },
  {
    title: "Sustainability becomes a continuous RA+ operating model",
    body: "The end state is a credible, governed sustainability layer in RA+ that links strategy, design, execution, and continuous improvement. Customers receive contextual recommendations, teams reuse a consistent knowledge base, and expert services are pulled in at the right moments for deeper analysis without turning early guidance into a contractual commitment.",
  },
];

const clean = (value: unknown) => String(value ?? "").replace(/—/g, "-");

const rgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  return [0, 2, 4].map((start) => parseInt(normalized.slice(start, start + 2), 16)) as [number, number, number];
};

export async function exportToPdf() {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [SLIDE_W, SLIDE_H],
    compress: true,
  });

  doc.setProperties({
    title: "Sustainability Transformation with RA+",
    subject: "Sustainability Transformation with RA+",
    author: "Schneider Electric",
    creator: "Schneider Electric",
  });

  let firstSlide = true;

  const setFill = (hex: string) => doc.setFillColor(...rgb(hex));
  const setStroke = (hex: string) => doc.setDrawColor(...rgb(hex));
  const setText = (hex: string) => doc.setTextColor(...rgb(hex));

  const slide = () => {
    if (firstSlide) {
      firstSlide = false;
    } else {
      doc.addPage([SLIDE_W, SLIDE_H], "landscape");
    }
    setFill(DARK_BG);
    doc.rect(0, 0, SLIDE_W, SLIDE_H, "F");
  };

  const box = (x: number, y: number, w: number, h: number, stroke = BRAND_GREEN, fill = CARD_BG) => {
    setFill(fill);
    setStroke(stroke);
    doc.setLineWidth(0.012);
    doc.rect(x, y, w, h, "FD");
  };

  const text = (value: unknown, x: number, y: number, w: number, h: number, opts: TextOptions = {}) => {
    const lineHeightFactor = opts.lineHeight ?? 1.14;
    const align = opts.align ?? "left";
    let fontSize = opts.fontSize ?? 10;
    const minFontSize = opts.minFontSize ?? 5.5;
    const style = opts.bold && opts.italic ? "bolditalic" : opts.bold ? "bold" : opts.italic ? "italic" : "normal";
    const content = clean(value);

    doc.setFont("helvetica", style);
    setText(opts.color ?? TEXT_WHITE);

    let lines = doc.splitTextToSize(content, w);
    let lineHeight = (fontSize / 72) * lineHeightFactor;
    if (opts.fit) {
      while (lines.length * lineHeight > h && fontSize > minFontSize) {
        fontSize -= 0.4;
        lineHeight = (fontSize / 72) * lineHeightFactor;
        doc.setFontSize(fontSize);
        lines = doc.splitTextToSize(content, w);
      }
    }

    doc.setFontSize(fontSize);
    const maxLines = Math.max(1, Math.floor(h / lineHeight));
    const visibleLines = opts.fit ? lines.slice(0, maxLines) : lines;
    const textX = align === "center" ? x + w / 2 : align === "right" ? x + w : x;
    doc.text(visibleLines, textX, y + fontSize / 72, { align, lineHeightFactor });
  };

  const bullet = (value: unknown, x: number, y: number, w: number, h: number, opts: TextOptions = {}) => {
    text(`- ${clean(value)}`, x, y, w, h, opts);
  };

  const title = (eyebrow: string, heading: string, intro?: string) => {
    text(eyebrow, 0.5, 0.3, 9, 0.3, { fontSize: 11, bold: true, color: BRAND_GREEN });
    text(heading, 0.5, 0.62, 9, 0.55, { fontSize: 24, bold: true, color: TEXT_WHITE, fit: true });
    if (intro) text(intro, 0.5, 1.18, 9, 0.7, { fontSize: 9.5, color: TEXT_MUTED, fit: true });
  };

  const sectionDivider = (eyebrow: string, heading: string) => {
    slide();
    text(eyebrow, 0.5, 2.45, 9, 0.4, { fontSize: 14, bold: true, color: BRAND_GREEN, align: "center" });
    text(heading, 0.5, 2.95, 9, 0.8, { fontSize: 36, bold: true, color: TEXT_WHITE, align: "center", fit: true });
  };

  const buildTitle = () => {
    slide();
    text("Sustainability Transformation", 0.5, 1.8, 9, 0.45, { fontSize: 18, color: BRAND_GREEN, align: "center" });
    text("Sustainability Transformation", 0.5, 2.45, 9, 0.7, { fontSize: 40, bold: true, color: BRAND_GREEN, align: "center", fit: true });
    text("with RA+", 0.5, 3.2, 9, 0.7, { fontSize: 40, bold: true, color: TEXT_WHITE, align: "center" });
    text("Internal Only and Confidential", 0.5, 4.45, 9, 0.4, { fontSize: 14, color: TEXT_MUTED, align: "center" });
  };

  const buildExecutiveSummary = () => {
    slide();
    text("Executive Summary", 0.5, 0.3, 9, 0.5, { fontSize: 28, bold: true });
    executiveSummarySlides.forEach((item, i) => {
      const y = 1 + i * 1.45;
      text(item.title, 0.5, y, 9, 0.35, { fontSize: 13, bold: true, color: BRAND_GREEN, fit: true });
      text(item.body, 0.5, y + 0.42, 9, 0.95, { fontSize: 9.5, color: i === 1 ? TEXT_WHITE : TEXT_MUTED, fit: true });
    });
  };

  const buildStrategicContext = () => {
    slide();
    title("STRATEGIC CONTEXT", "Forces That Make Now the Window", sustainabilityStrategicContext.intro);
    const sunset = sustainabilityStrategicContext.raClassicSunset;
    box(0.5, 2, 9, 1.4);
    text(sunset.badge, 0.7, 2.1, 2.5, 0.25, { fontSize: 8, bold: true, color: BRAND_GREEN });
    text(sunset.title, 0.7, 2.35, 6, 0.35, { fontSize: 14, bold: true, fit: true });
    text(sunset.timeframe, 7, 2.35, 2.3, 0.3, { fontSize: 10, bold: true, color: BRAND_GREEN, align: "right" });
    text(sunset.summary, 0.7, 2.75, 8.6, 0.6, { fontSize: 8, color: TEXT_MUTED, fit: true });
    text(idmCapabilities.positioning.principle, 0.5, 3.7, 9, 1.2, { fontSize: 10, color: TEXT_WHITE, fit: true });
  };

  const buildKeyChallenges = () => {
    slide();
    title("KEY CHALLENGES", "Pressure, Confusion, Structure, Value, Scale, Impact");
    whyNowColumns.forEach((col, i) => {
      const x = 0.3 + (i % 3) * 3.2;
      const y = 1.85 + Math.floor(i / 3) * 1.95;
      const accent = COL_HEX[col.color] || BRAND_GREEN;
      box(x, y, 3.1, 1.85, accent);
      text(col.title, x + 0.15, y + 0.1, 2.85, 0.3, { fontSize: 11, bold: true, color: accent, fit: true });
      col.items.slice(0, 4).forEach((item, idx) => bullet(item, x + 0.15, y + 0.42 + idx * 0.34, 2.85, 0.32, { fontSize: 6.5, color: TEXT_MUTED, fit: true }));
    });
  };

  const buildWhatIf = () => {
    const scenarios = [
      { title: "Show opportunities in minutes", description: "Walk into a first meeting and show site-relevant sustainability opportunities in RA+ within minutes." },
      { title: "Replace PowerPoint with platform", description: "Replace audit PowerPoint decks with structured, visual, interactive deliverables in the platform." },
      { title: "Centralize context once", description: "Centralize all client context once on the RA+ spine and reuse it across audits, quotes, and follow-ups." },
      { title: "One-click audit requests", description: "Let customers discover early sustainability insights, then request deeper expert audits with one click." },
      { title: "Continuous improvement", description: "Turn every delivered audit into data that improves future recommendations." },
    ];
    slide();
    title("WHAT IF TOMORROW", "Aspirations the Platform Unlocks");
    scenarios.forEach((scenario, i) => {
      const x = 0.3 + (i % 3) * 3.2;
      const y = 1.95 + Math.floor(i / 3) * 1.55;
      box(x, y, 3.1, 1.4);
      text(scenario.title, x + 0.15, y + 0.1, 2.85, 0.5, { fontSize: 10, bold: true, color: BRAND_GREEN, fit: true });
      text(scenario.description, x + 0.15, y + 0.6, 2.85, 0.75, { fontSize: 8, color: TEXT_MUTED, fit: true });
    });
  };

  const buildPlatformShift = () => {
    slide();
    title("PLATFORM SHIFT", "Sustainability Transformation with RA+", platformShift.intro);
    [platformShift.classic, platformShift.raPlus].forEach((col, i) => {
      const x = 0.5 + i * 4.6;
      box(x, 2, 4.4, 3.2, i === 0 ? "EF4444" : BRAND_GREEN);
      text(col.title, x + 0.2, 2.15, 4, 0.35, { fontSize: 13, bold: true, color: i === 0 ? "EF4444" : BRAND_GREEN, fit: true });
      text(col.tagline, x + 0.2, 2.5, 4, 0.25, { fontSize: 9, italic: true, color: TEXT_MUTED, fit: true });
      col.points.forEach((point, idx) => bullet(point, x + 0.2, 2.85 + idx * 0.4, 4, 0.38, { fontSize: 8, color: TEXT_WHITE, fit: true }));
    });
    text(platformShift.thesis, 0.5, 5.35, 9, 0.3, { fontSize: 9, italic: true, color: BRAND_GREEN, align: "center", fit: true });
  };

  const buildPersonas = () => {
    slide();
    title("PERSONAS", "Four Roles, One Design Sequence", personas.intro);
    personas.roles.forEach((role, i) => {
      const x = 0.5 + (i % 2) * 4.6;
      const y = 1.95 + Math.floor(i / 2) * 1.75;
      box(x, y, 4.4, 1.6, i === 0 ? BRAND_GREEN : "555555");
      text(role.name, x + 0.15, y + 0.1, 3.2, 0.3, { fontSize: 11, bold: true, fit: true });
      text(role.rank, x + 3.3, y + 0.1, 1, 0.25, { fontSize: 7, bold: true, color: BRAND_GREEN, align: "right", fit: true });
      text(role.context, x + 0.15, y + 0.4, 4.1, 0.22, { fontSize: 7, italic: true, color: TEXT_MUTED, fit: true });
      text(role.summary, x + 0.15, y + 0.65, 4.1, 0.9, { fontSize: 7, color: TEXT_MUTED, fit: true });
    });
    text(personas.designPrinciple, 0.5, 5.5, 9, 0.3, { fontSize: 7.5, italic: true, color: BRAND_GREEN, fit: true });
  };

  const buildJTBD = () => {
    slide();
    title("JOBS TO BE DONE", "What Users Hire Sustainability to Do", jobsToBeDone.intro);
    jobsToBeDone.jobs.slice(0, 11).forEach((job, i) => {
      const x = 0.3 + (i % 2) * 4.7;
      const y = 1.95 + Math.floor(i / 2) * 0.55;
      const typeColor = job.type === "Operational" ? "10B981" : "3B82F6";
      text(job.num, x, y, 0.35, 0.45, { fontSize: 11, bold: true, color: BRAND_GREEN });
      text(job.title, x + 0.4, y, 3.2, 0.25, { fontSize: 9, bold: true, fit: true });
      text(job.type, x + 3.6, y, 1, 0.22, { fontSize: 6, bold: true, color: typeColor, align: "right" });
      text(job.description, x + 0.4, y + 0.25, 4.1, 0.28, { fontSize: 6, color: TEXT_MUTED, fit: true });
    });
    text(`Where decarbonization measures fit. ${jobsToBeDone.ecmInsight}`, 0.5, 5.4, 9, 0.4, { fontSize: 7.5, italic: true, color: BRAND_GREEN, fit: true });
  };

  const buildStrategicPillars = () => {
    slide();
    title("QUALITATIVE OUTCOMES", "Strategic Pillars");
    strategicPillars.forEach((pillar, i) => {
      const x = 0.5 + i * 3.2;
      box(x, 1, 3, 4);
      text(pillar.title, x + 0.2, 1.2, 2.6, 0.4, { fontSize: 16, bold: true, color: BRAND_GREEN, fit: true });
      text(pillar.tagline, x + 0.2, 1.7, 2.6, 0.3, { fontSize: 10, color: TEXT_MUTED, fit: true });
      text(pillar.promise, x + 0.2, 2.2, 2.6, 2.5, { fontSize: 9, color: TEXT_WHITE, fit: true });
    });
  };

  const buildTechnologyLandscape = () => {
    slide();
    title("TECHNOLOGY LANDSCAPE", "Where We Are Today, Where IDM Goes Next", "Existing tools that anchor today's sustainability work, with IDM evolving into the RA+ data backbone.");
    existingTools.forEach((tool, i) => {
      const x = 0.3 + (i % 2) * 4.7;
      const y = 1.95 + Math.floor(i / 2) * 1.55;
      box(x, y, 4.6, 1.45);
      text(tool.name, x + 0.15, y + 0.1, 4.3, 0.3, { fontSize: 12, bold: true, color: BRAND_GREEN, fit: true });
      text(tool.description, x + 0.15, y + 0.4, 4.3, 0.55, { fontSize: 8, fit: true });
      text(`Limitation: ${tool.limitation}`, x + 0.15, y + 1, 4.3, 0.4, { fontSize: 7, italic: true, color: TEXT_MUTED, fit: true });
    });
    text(idmCapabilities.tagline, 0.5, 5.3, 9, 0.4, { fontSize: 8, italic: true, color: BRAND_GREEN, align: "center", fit: true });
  };

  const buildCapabilityMapping = () => {
    const stages = [
      { name: "Lead Intake", note: "Surface relevant opportunities by sector and geography" },
      { name: "Data Collection", note: "Match required inputs to available IDM, BMS, and utility feeds" },
      { name: "On-Site Audit", note: "Suggest measures to verify; capture findings into the library" },
      { name: "Analysis & Guidance", note: "Pre-compute savings ranges from historic distributions" },
      { name: "Recommendations", note: "Generate structured, defensible deliverables" },
      { name: "Implementation", note: "Hand off scope to delivery teams or partners" },
      { name: "Monitoring", note: "Close the loop with M&V to feed library updates" },
    ];
    slide();
    title("CAPABILITY MAPPING", "Decarbonization Library across the Sustainability Journey", "How the decarbonization knowledge base plugs into each stage of the customer journey.");
    stages.forEach((stage, i) => {
      const y = 1.85 + i * 0.5;
      box(0.5, y, 9, 0.45);
      text(`${i + 1}. ${stage.name}`, 0.7, y + 0.08, 2.5, 0.3, { fontSize: 10, bold: true, color: BRAND_GREEN, fit: true });
      text(stage.note, 3.3, y + 0.08, 6, 0.3, { fontSize: 8, fit: true });
    });
  };

  const buildRegionalJourneys = () => {
    slide();
    title("REGIONAL JOURNEYS", "No Single Path. Shared Backend.", regionalJourneys.intro);
    regionalJourneys.journeys.forEach((journey, i) => {
      const x = 0.3 + (i % 2) * 4.7;
      const y = 1.95 + Math.floor(i / 2) * 1.7;
      box(x, y, 4.6, 1.55);
      text(journey.name, x + 0.15, y + 0.1, 3.2, 0.3, { fontSize: 12, bold: true, color: BRAND_GREEN, fit: true });
      text(journey.revenue, x + 3.35, y + 0.1, 1.2, 0.25, { fontSize: 6.5, bold: true, align: "right", fit: true });
      text(journey.tagline, x + 0.15, y + 0.4, 4.3, 0.25, { fontSize: 8, italic: true, color: TEXT_MUTED, fit: true });
      text(`Selling point: ${journey.sellingPoint}`, x + 0.15, y + 0.65, 4.3, 0.4, { fontSize: 7.5, fit: true });
      text(`Convergence: ${regionalJourneys.convergence.point}`, x + 0.15, y + 1.1, 4.3, 0.35, { fontSize: 7, italic: true, color: BRAND_GREEN, fit: true });
    });
    text(regionalJourneys.designPrinciple, 0.5, 5.4, 9, 0.35, { fontSize: 8, italic: true, color: BRAND_GREEN, align: "center", fit: true });
  };

  const buildExpertServices = () => {
    slide();
    title("HUMAN IN THE LOOP", "Expert Services Layer on the RA+ Spine", "AI executes, humans apply judgment. Same RA+ spine, two ways to consume it.");
    [
      { title: "Self-Serve Operator", tagline: "FULL AUTONOMY, AI-DRIVEN", body: "Wants the keys. Runs RA+ analytics, builds decarbonization scenarios, and acts on Sera recommendations without waiting for a human. RA+ is their cockpit; expert services are a-la-carte." },
      { title: "Guided Decision Client", tagline: "HUMAN IN THE LOOP", body: "Wants a trusted Schneider expert in the room for high-stakes calls. The platform drives the work; the expert validates, interprets, and translates RA+ outputs into board-ready decisions." },
    ].forEach((item, i) => {
      const x = 0.5 + i * 4.6;
      box(x, 1.95, 4.45, 3.4);
      text(item.title, x + 0.2, 2.05, 4.05, 0.4, { fontSize: 16, bold: true, fit: true });
      text(item.tagline, x + 0.2, 2.5, 4.05, 0.3, { fontSize: 9, bold: true, color: BRAND_GREEN });
      text(item.body, x + 0.2, 2.85, 4.05, 2.4, { fontSize: 10, fit: true });
    });

    slide();
    title("JUDGMENT LAYER", "Where Schneider Experts Add Value", "Service advisors become the judgment layer on top of RA+ and Sera, across four roles and three engagement tiers.");
    [
      { t: "Validation", d: "Pressure-test RA+ baselines, decarbonization assumptions, and Sera outputs against engineering and field reality." },
      { t: "Interpretation", d: "Turn RA+ telemetry and decarbonization stacks into a clear portfolio narrative and realistic envelope of action." },
      { t: "Risk translation", d: "Frame downside, tenant impact, compliance, and execution risk around RA+ surfaced measures." },
      { t: "Exec communication", d: "Package RA+ evidence and Sera reasoning into board-grade recommendations and capital narratives." },
    ].forEach((pillar, i) => {
      const x = 0.5 + i * 2.3;
      box(x, 1.95, 2.2, 1.6);
      text(pillar.t, x + 0.12, 2.02, 2, 0.3, { fontSize: 11, bold: true, color: BRAND_GREEN, fit: true });
      text(pillar.d, x + 0.12, 2.35, 2, 1.15, { fontSize: 7.5, fit: true });
    });
    const rows = [
      ["Self-Serve", "Self-Serve Operator", "On demand", "Experts a-la-carte", "Full RA+ and Sera"],
      ["Assisted", "Mixed maturity", "Async + QBRs", "Expert validates RA+ outputs", "Shared RA+ workspace"],
      ["Advisory", "Guided Decision Client", "Embedded", "Named expert owns interpretation", "Co-piloted RA+ with expert IP"],
    ];
    const headers = ["Tier", "Best for", "Cadence", "Human role", "Platform / RA+"];
    const widths = [1.1, 1.7, 1.3, 2.3, 2.8];
    let cursor = 0.5;
    headers.forEach((header, i) => {
      text(header, cursor, 3.75, widths[i], 0.3, { fontSize: 9, bold: true, color: BRAND_GREEN });
      cursor += widths[i];
    });
    rows.forEach((row, ri) => {
      cursor = 0.5;
      row.forEach((cell, ci) => {
        text(cell, cursor, 4.1 + ri * 0.42, widths[ci], 0.4, { fontSize: 8, color: ci === 0 ? TEXT_WHITE : TEXT_MUTED, bold: ci === 0, fit: true });
        cursor += widths[ci];
      });
    });
    text("One RA+ spine, one RA+ workspace. Clients move between tiers without losing context or model continuity.", 0.5, 5.4, 9, 0.3, { fontSize: 8, italic: true, color: BRAND_GREEN, align: "center", fit: true });
  };

  const buildPhasing = () => {
    const phases = [
      { phase: "Phase 1", title: "IDM Evolution", tagline: "Urgent, no-regret", timing: "MVP Q4 2025 / Q1 2026", summary: "Re-platform IDM into RA+ to drive market differentiation through agentic capabilities, richer context, and SaaS-ready delivery." },
      { phase: "Phase 2", title: "Decarbonization Library", tagline: "Cross-COE feeder", timing: "Sequenced with Pricing & Savings Accelerator", summary: "Connects sustainability, consultancy, and construction services into one knowledge backbone that powers Sera reasoning." },
      { phase: "Phase 3", title: "Disclosure & Reporting Engine", tagline: "Close the loop from data to disclosure", timing: "Sequencing TBD", summary: "Turn the sustainability data spine and Decarbonization Library into auditable disclosures generated directly from RA+ context, with traceability back to source evidence." },
    ];
    slide();
    title("PHASING", "What Ships, in What Order, Why", "Capability depth grows along the axis: Phase 1 is in flight, Phase 2 is sequenced, Phase 3 is an open question.");
    phases.forEach((phase, i) => {
      const x = 0.5 + i * 3.05;
      box(x, 1.95, 2.95, 3.4);
      text(phase.phase, x + 0.15, 2.05, 2.65, 0.3, { fontSize: 9, bold: true, color: BRAND_GREEN });
      text(phase.title, x + 0.15, 2.35, 2.65, 0.4, { fontSize: 14, bold: true, fit: true });
      text(phase.tagline, x + 0.15, 2.75, 2.65, 0.25, { fontSize: 8, italic: true, color: TEXT_MUTED, fit: true });
      text(phase.timing, x + 0.15, 3, 2.65, 0.25, { fontSize: 7.5, color: BRAND_GREEN, fit: true });
      text(phase.summary, x + 0.15, 3.3, 2.65, 1.95, { fontSize: 8, fit: true });
    });
  };

  const buildIdmVision = () => {
    const useCases = [
      { title: "Program Management & M&V", body: "Follow up on actions, track KPIs, run causal analysis across factories, sites, and buildings. IPMVP-aligned savings validation built in." },
      { title: "Optimization Discovery", body: "Use interval data to surface staging opportunities, compressed air issues, and control re-architecture that consultants find manually today." },
      { title: "Cross-Functional Data Reuse", body: "Make interval data natively available for sourcing, budgeting, forecasting, and risk management. One source of truth, many use cases." },
    ];
    const profiles = [
      { title: "Give Me", subtitle: "Full self-serve", body: "Internal expertise; runs analyses, configures KPIs, manages programs in RA+." },
      { title: "Help Me", subtitle: "Hybrid", body: "Platform autonomy plus targeted Schneider expertise for complex moments." },
      { title: "Do It For Me", subtitle: "Full service", body: "Schneider continues to handle data, KPIs, analysis, and program management." },
    ];
    slide();
    title("RA+ VISION", "Embedded, Differentiated, Agentic", "Client-autonomy axis: from full self-serve to fully delivered. RA+ supports all three without forcing one path.");
    useCases.forEach((item, i) => {
      const x = 0.5 + i * 3.05;
      box(x, 1.95, 2.95, 1.5);
      text(item.title, x + 0.15, 2.05, 2.65, 0.3, { fontSize: 10, bold: true, color: BRAND_GREEN, fit: true });
      text(item.body, x + 0.15, 2.4, 2.65, 1, { fontSize: 7.5, color: TEXT_MUTED, fit: true });
    });
    profiles.forEach((item, i) => {
      const x = 0.5 + i * 3.05;
      box(x, 3.6, 2.95, 1.7);
      text(item.title, x + 0.15, 3.7, 2.65, 0.3, { fontSize: 11, bold: true });
      text(item.subtitle, x + 0.15, 4, 2.65, 0.25, { fontSize: 8, italic: true, color: BRAND_GREEN });
      text(item.body, x + 0.15, 4.25, 2.65, 1, { fontSize: 7.5, color: TEXT_MUTED, fit: true });
    });
  };

  const buildSuccessMetrics = () => {
    slide();
    title("QUANTITATIVE KPIS", "Success Looks Like", "Measurable signals that translate the Strategic Pillars into trackable indicators. Each KPI defines what we measure, not a committed target.");
    [
      { label: "Audit Cycle Time", signal: "Days per audit trend" },
      { label: "Advisory-to-Audit Conversion", signal: "% prompts to audits" },
      { label: "Time to Quote", signal: "Hours to quote median" },
      { label: "Recommendation Adoption", signal: "% recs actioned 90d" },
      { label: "RA+ Revenue Contribution", signal: "% of RA+ ARR" },
    ].forEach((kpi, i) => {
      const x = 0.5 + i * 1.85;
      box(x, 1.95, 1.75, 1);
      text(kpi.label, x + 0.1, 2, 1.55, 0.45, { fontSize: 9, bold: true, fit: true });
      text(kpi.signal, x + 0.1, 2.45, 1.55, 0.45, { fontSize: 7.5, color: BRAND_GREEN, fit: true });
    });
    text("Sera Interface Signals", 0.5, 3.15, 9, 0.3, { fontSize: 11, bold: true, color: BRAND_GREEN });
    text(seraKPIs.intro, 0.5, 3.45, 9, 0.35, { fontSize: 8, italic: true, color: TEXT_MUTED, fit: true });
    seraKPIs.kpis.forEach((kpi, i) => {
      const x = 0.5 + (i % 3) * 3.05;
      const y = 3.85 + Math.floor(i / 3) * 0.85;
      box(x, y, 2.85, 0.75);
      text(kpi.label, x + 0.1, y + 0.05, 2.65, 0.25, { fontSize: 8, bold: true, fit: true });
      text(kpi.description, x + 0.1, y + 0.3, 2.65, 0.42, { fontSize: 6.5, color: TEXT_MUTED, fit: true });
    });
  };

  const buildStartStop = () => {
    slide();
    title("START / STOP", "Where We Stop, How We Operate", "The boundary list keeps scope honest. The operating rules keep customer-facing advice trustworthy.");
    const stop = [
      { title: "Contractual Guarantees", detail: "Performance guarantees and contractual commitments require separate validation." },
      { title: "Detailed Engineering", detail: "Detailed engineering design without expert validation stays outside scope." },
      { title: "Asset Planning", detail: "Baseline modeling, M&V, and capital planning live in a separate Asset Planning discovery." },
    ];
    const start = [
      { title: "Transparency & Scope", detail: "Label advice as guidance, show ranges with confidence levels, surface assumptions and gaps." },
      { title: "Data Quality & Applicability", detail: "Enforce data checks, show applicability rules, filter by geography, segment, and asset tags." },
      { title: "Risk & Compliance", detail: "No auto-suggest where licensed sign-off is required. Maintain audit trails. Link to standards." },
      { title: "User Experience & Escalation", detail: "Expert escalation from any advice card. Rationale snippets and similar-site evidence." },
    ];
    text("Stop", 0.5, 1.95, 4.4, 0.3, { fontSize: 11, bold: true, color: ORANGE });
    stop.forEach((item, i) => {
      const y = 2.3 + i * 1.05;
      box(0.5, y, 4.4, 0.95, ORANGE);
      text(item.title, 0.65, y + 0.1, 4.1, 0.3, { fontSize: 10, bold: true });
      text(item.detail, 0.65, y + 0.4, 4.1, 0.5, { fontSize: 7.5, color: TEXT_MUTED, fit: true });
    });
    text("Start", 5.1, 1.95, 4.4, 0.3, { fontSize: 11, bold: true, color: BRAND_GREEN });
    start.forEach((item, i) => {
      const y = 2.3 + i * 0.78;
      box(5.1, y, 4.4, 0.7);
      text(item.title, 5.25, y + 0.05, 4.1, 0.25, { fontSize: 9, bold: true, color: BRAND_GREEN, fit: true });
      text(item.detail, 5.25, y + 0.3, 4.1, 0.38, { fontSize: 7, color: TEXT_MUTED, fit: true });
    });
  };

  const buildExecutiveTakeaway = () => {
    slide();
    title("EXECUTIVE TAKEAWAY", "Why This, Why Now");
    text("Sustainability Transformation turns proven CoE expertise into a governed RA+ capability: earlier customer reach, faster guided action, continuous improvement.", 0.5, 2, 9, 2.5, { fontSize: 16, align: "center", fit: true });
  };

  const buildKnowledgeEngine = () => {
    slide();
    title("APPENDIX · KNOWLEDGE ENGINE", ecmIngestionEngine.prototype.title, ecmIngestionEngine.intro);
    ecmIngestionEngine.prototype.flow.forEach((step, i) => {
      const x = 0.5 + i * 2.25;
      box(x, 1.95, 2.05, 1.7);
      text(step.step, x + 0.15, 2.05, 1.8, 0.3, { fontSize: 10, bold: true, color: BRAND_GREEN });
      text(step.name, x + 0.15, 2.35, 1.8, 0.3, { fontSize: 12, bold: true, fit: true });
      text(step.description, x + 0.15, 2.7, 1.8, 0.9, { fontSize: 7, color: TEXT_MUTED, fit: true });
    });
    text(ecmIngestionEngine.prototype.accuracy, 0.5, 3.85, 9, 0.3, { fontSize: 9, italic: true, color: BRAND_GREEN, align: "center" });
    text(ecmIngestionEngine.monteCarlo.title, 0.5, 4.3, 9, 0.3, { fontSize: 11, bold: true });
    text(ecmIngestionEngine.monteCarlo.output, 0.5, 4.6, 9, 0.5, { fontSize: 8, color: TEXT_MUTED, fit: true });
    text(ecmIngestionEngine.monteCarlo.why, 0.5, 5.15, 9, 0.5, { fontSize: 8, italic: true, fit: true });
  };

  const buildMaturityLadder = () => {
    slide();
    title("APPENDIX · MATURITY LADDER", "Meet Customers Where They Are", maturityLadder.intro);
    maturityLadder.stages.forEach((stage, i) => {
      const x = 0.5 + i * 2.35;
      box(x, 2, 2.15, 2.5);
      text(stage.num, x + 0.15, 2.1, 1.85, 0.5, { fontSize: 24, bold: true, color: BRAND_GREEN });
      text(stage.label, x + 0.15, 2.7, 1.85, 0.35, { fontSize: 12, bold: true, fit: true });
      text(stage.description, x + 0.15, 3.1, 1.85, 1.3, { fontSize: 8, color: TEXT_MUTED, fit: true });
    });
    text(maturityLadder.note, 0.5, 4.7, 9, 0.3, { fontSize: 8, italic: true, color: TEXT_MUTED, fit: true });
  };

  const buildVocEvidence = () => {
    slide();
    title("APPENDIX · VOC EVIDENCE", "What Customers Told Us", vocEvidence.intro);
    vocEvidence.customers.forEach((customer, i) => {
      const x = 0.3 + i * 3.15;
      box(x, 1.95, 3, 3.6);
      text(customer.name, x + 0.15, 2.05, 2.7, 0.3, { fontSize: 12, bold: true, color: BRAND_GREEN, fit: true });
      text(customer.contact, x + 0.15, 2.35, 2.7, 0.3, { fontSize: 6.5, color: TEXT_MUTED, fit: true });
      text(customer.context, x + 0.15, 2.6, 2.7, 0.22, { fontSize: 6.5, italic: true, color: TEXT_MUTED, fit: true });
      customer.findings.slice(0, 4).forEach((finding, idx) => bullet(finding, x + 0.15, 2.85 + idx * 0.42, 2.7, 0.4, { fontSize: 6, fit: true }));
      text(`"${customer.quote}"`, x + 0.15, 4.6, 2.7, 0.85, { fontSize: 6.5, italic: true, color: BRAND_GREEN, fit: true });
    });
  };

  const buildSECorporateBlueprint = () => {
    slide();
    title("APPENDIX · RA CLASSIC IDM CLIENT", seCorporateBlueprint.title, seCorporateBlueprint.intro);
    seCorporateBlueprint.scale.forEach((scale, i) => {
      const x = 0.5 + i * 2.25;
      box(x, 1.95, 2.05, 1.05);
      text(scale.value, x + 0.1, 2.05, 1.85, 0.35, { fontSize: 16, bold: true, color: BRAND_GREEN, align: "center" });
      text(scale.label, x + 0.1, 2.42, 1.85, 0.22, { fontSize: 7, bold: true, align: "center", fit: true });
      text(scale.detail, x + 0.1, 2.65, 1.85, 0.32, { fontSize: 5.5, color: TEXT_MUTED, align: "center", fit: true });
    });
    text(seCorporateBlueprint.trainingSignal, 0.5, 3.15, 9, 0.4, { fontSize: 8, fit: true });
    seCorporateBlueprint.phaseMap.forEach((phase, i) => {
      const x = 0.5 + i * 3.05;
      box(x, 3.7, 2.95, 1.5);
      text(phase.phase, x + 0.15, 3.8, 2.65, 0.3, { fontSize: 10, bold: true, color: BRAND_GREEN });
      text(phase.detail, x + 0.15, 4.1, 2.65, 1, { fontSize: 7, color: TEXT_MUTED, fit: true });
    });
    text(seCorporateBlueprint.conclusion, 0.5, 5.35, 9, 0.3, { fontSize: 8, italic: true, fit: true });
  };

  const buildPainInventory = () => {
    slide();
    title("APPENDIX · PAIN INVENTORY", "What the Sustainability Transformation Eliminates", painInventory.intro);
    painInventory.pains.forEach((pain, i) => {
      const x = 0.3 + (i % 2) * 4.7;
      const y = 1.95 + Math.floor(i / 2) * 1.2;
      box(x, y, 4.6, 1.1, "EF4444");
      text(pain.id, x + 0.15, y + 0.1, 0.5, 0.25, { fontSize: 9, bold: true, color: "EF4444" });
      text(pain.severity, x + 0.7, y + 0.1, 1.5, 0.22, { fontSize: 6, bold: true, color: "EF4444" });
      text(pain.title, x + 0.15, y + 0.35, 4.3, 0.28, { fontSize: 9, bold: true, fit: true });
      text(pain.detail, x + 0.15, y + 0.62, 4.3, 0.45, { fontSize: 6.5, color: TEXT_MUTED, fit: true });
    });
  };

  const buildFlywheel = () => {
    slide();
    text("Appendix · Strategy-to-Improvement Flywheel", 0.5, 0.3, 9, 0.5, { fontSize: 22, bold: true, fit: true });
    text(intelligenceFlywheel.subtitle, 0.5, 0.95, 9, 0.35, { fontSize: 11, color: TEXT_MUTED, fit: true });
    intelligenceFlywheel.stages.forEach((stage, i) => {
      const x = 0.5 + (i % 3) * 3.05;
      const y = 1.65 + Math.floor(i / 3) * 1.55;
      box(x, y, 2.75, 1.15);
      text(stage.name, x + 0.15, y + 0.15, 2.45, 0.25, { fontSize: 11, bold: true, color: BRAND_GREEN, fit: true });
      text(stage.description, x + 0.15, y + 0.48, 2.45, 0.55, { fontSize: 7, color: TEXT_MUTED, fit: true });
    });
    text(intelligenceFlywheel.keyInsight, 0.5, 5.05, 9, 0.35, { fontSize: 8.5, fit: true });
  };

  const buildThankYou = () => {
    slide();
    text("Thank You", 0.5, 2, 9, 1, { fontSize: 44, bold: true, align: "center" });
    text("Sustainability Transformation with RA+", 0.5, 3.2, 9, 0.5, { fontSize: 18, color: BRAND_GREEN, align: "center" });
    text("Internal Only and Confidential", 0.5, 4, 9, 0.5, { fontSize: 12, color: TEXT_MUTED, align: "center" });
  };

  buildTitle();
  buildExecutiveSummary();
  buildStrategicContext();
  buildKeyChallenges();
  buildWhatIf();
  buildPlatformShift();
  buildPersonas();
  buildJTBD();
  buildStrategicPillars();
  buildTechnologyLandscape();
  buildCapabilityMapping();
  buildRegionalJourneys();
  buildExpertServices();
  buildPhasing();
  buildIdmVision();
  buildSuccessMetrics();
  buildStartStop();
  buildExecutiveTakeaway();
  sectionDivider("APPENDIX", "Reference Materials");
  buildKnowledgeEngine();
  buildMaturityLadder();
  buildVocEvidence();
  buildSECorporateBlueprint();
  buildPainInventory();
  buildFlywheel();
  buildThankYou();

  doc.save("Sustainability-Transformation-with-RA-Plus.pdf");
}
