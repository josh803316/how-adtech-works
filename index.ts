import { Elysia } from "elysia";

type TopicId =
  | "buy-side"
  | "sell-side"
  | "data"
  | "third-parties"
  | "ad-serving-rtb"
  | "measurement-currency";

type ExampleId =
  | "instagram"
  | "youtube"
  | "web-display"
  | "search"
  | "video-player";

type Topic = {
  id: TopicId;
  label: string;
  shortDescription: string;
  overview: string[];
  technical: string[];
};

type Example = {
  id: ExampleId;
  label: string;
  surface: string;
  story: string[];
  technicalFlow: string[];
};

type GlossaryId =
  | "yield"
  | "inventory"
  | "dsp"
  | "ssp"
  | "rtb"
  | "data-lake"
  | "identity-graph"
  | "attribution"
  | "clean-room"
  | "currency"
  | "upfronts"
  | "pixel"
  | "vast";

type GlossaryEntry = {
  id: GlossaryId;
  term: string;
  category: "Marketplace" | "Data" | "Measurement";
  shortDefinition: string;
  definition: string[];
  related?: GlossaryId[];
};

const topics: Record<TopicId, Topic> = {
  "buy-side": {
    id: "buy-side",
    label: "Buy Side (Demand)",
    shortDescription:
      "How advertisers, agencies, and DSPs decide which impressions to buy.",
    overview: [
      "The buy side represents the money looking for attention. Advertisers define goals and budgets, agencies help with strategy, and Demand-Side Platforms (DSPs) execute buying across many publishers.",
      "When you see an ad, the buy side has already decided that you are a valuable impression for a specific campaign.",
    ],
    technical: [
      "Key data objects: campaigns, line items, creatives, audiences, budgets, pacing state, and performance metrics (impressions, clicks, conversions, revenue).",
      "Typical storage: configuration tables in an operational database, with events (impressions, clicks, conversions) streamed into a data lake and data warehouse.",
      "Pipelines aggregate performance by dimension (campaign, geo, inventory, device) to drive bidding models and optimization.",
    ],
  },
  "sell-side": {
    id: "sell-side",
    label: "Sell Side (Supply)",
    shortDescription:
      "How publishers and SSPs package inventory and send it to auction.",
    overview: [
      "The sell side owns the surfaces where ads can appear: feeds, articles, videos, search results, and more.",
      "Supply-Side Platforms (SSPs) help publishers connect that inventory to many buyers, managing floors, deals, and yield (<a href='/glossary?term=yield'>what is yield?</a>).",
    ],
    technical: [
      "Inventory is modeled as placements and slots with metadata: page, app, format, size, viewability expectations, and allowed creatives.",
      "Ad calls from the app or web page hit an ad server, which can directly serve ads or generate bid requests to exchanges and DSPs.",
      "Impression and revenue data is streamed back into a lake/warehouse to optimize layouts, floors, and deals.",
    ],
  },
  data: {
    id: "data",
    label: "Data & Identity",
    shortDescription:
      "How signals about people and context are collected, stored, and activated.",
    overview: [
      "Every ad impression comes with context: who you might be, where you are, what you are doing, and what you did before.",
      "Data engineering turns noisy event streams from apps, websites, and partners into reliable building blocks for targeting and measurement.",
      "Two core storage patterns: a <strong>data lake</strong> (<a href='/glossary?term=data-lake'>glossary</a>) holds raw or lightly processed events in cheap object storage (e.g. S3, GCS) with schema-on-read; a <strong>data warehouse</strong> (e.g. Snowflake, BigQuery, Redshift) holds curated, modeled tables with schema-on-write for analytics and activation.",
      "Pipelines move data from sources (SDKs, pixels, server logs, partner files) into the lake, then transform it into clean tables and segments that feed bidding, reporting, and identity.",
    ],
    technical: [
      "<strong>Data lake vs warehouse:</strong> The lake is the landing zone for high-volume, heterogeneous event streams (impressions, clicks, conversions, app events). Data is often stored in columnar formats (Parquet, ORC) and partitioned by date/entity. The warehouse (or lakehouse layers) holds aggregated tables, dimension tables, and audience outputs that downstream systems query. Many teams use both: lake for raw and intermediate, warehouse for business-facing marts.",
      "<strong>Pipeline flow:</strong> (1) Ingest — events arrive via real-time (Kafka, Kinesis, Pub/Sub) or batch (Airbyte, Fivetran, custom jobs pulling from APIs or file drops). (2) Raw storage — events land in the lake in immutable, partitioned buckets. (3) Transform — orchestrated jobs (dbt, Spark, Flink) clean, dedupe, join to reference data, and apply business rules. (4) Curated / warehouse — output tables feed reporting, ML feature stores, and activation (e.g. segment sync to DSPs).",
      "<strong>Tools:</strong> <em>Airbyte</em>, Fivetran, Stitch: connectors that pull from SaaS (CRM, ad platforms, 3rd-party data vendors) and push into the lake or warehouse; they handle schema mapping and incremental loads. Orchestrators (Airflow, Dagster, Prefect) schedule and dependency-manage batch pipelines. dbt runs SQL transforms and tests on top of the warehouse.",
      "<strong>CI for data:</strong> Data quality and schema checks run in CI: dbt tests (nulls, uniqueness, referential integrity), Great Expectations or similar assertions on key tables, and sometimes contract tests for pipeline outputs. Version-controlled dbt models and migration scripts keep the warehouse schema and logic reproducible.",
      "Identity graphs link device IDs, login IDs, hashed emails, and 3rd-party IDs under consent rules; they power frequency capping, cross-device attribution, and audience building. Graph outputs are often synced to DSPs and DMPs via batch files or APIs.",
    ],
  },
  "third-parties": {
    id: "third-parties",
    label: "3rd-Party Providers",
    shortDescription:
      "Partners that enrich targeting, measurement, safety, and identity.",
    overview: [
      "Ad tech rarely lives alone. Many specialized companies provide data, identity, safety, and measurement services.",
      "These partners help answer questions like: Who is this user? Is this page safe? Did this ad drive real outcomes?",
      "Companies like <strong>BlueKai</strong> (now part of Oracle Data Cloud) are <strong>data marketplaces / DMPs</strong>: they sell audience segments and intent data to advertisers and agencies. What they sell: demographic segments (e.g. age, income), behavioral and intent segments (e.g. in-market for auto, travel), and lookalike audiences. Data sources include: publisher partnerships (sites and apps contribute anonymized or hashed behavior in exchange for revenue share), panel data (opt-in panels that represent broader populations), data co-ops (aggregators that pool first-party data from many brands), and offline data (CRM, loyalty) matched on hashed identifiers. Advertisers use these segments in DSPs to target or suppress users.",
      "<strong>Clean rooms</strong> (<a href='/glossary?term=clean-room'>what is a clean room?</a>) are secure environments where two or more parties bring their data (e.g. first-party audiences and campaign exposure) without sharing raw PII. Use cases: match audiences between advertiser and publisher to plan or measure campaigns; run attribution (e.g. which exposures led to conversions) without either side seeing the other’s raw data; enable custom audience activation and measurement in a privacy-safe way. Clean rooms are central to post-cookie and post-MAID measurement and planning.",
    ],
    technical: [
      "3rd-party data integrations: (1) Batch — vendors deliver files (CSV, Parquet) to S3/GCS or SFTP; schedules are daily or weekly. (2) API — real-time segment or identity lookups, or event forwarding (e.g. conversion pixels sending hashed IDs to a partner). (3) Match keys: hashed email, hashed phone, device ID, or partner-specific IDs; matching is done in a neutral environment (clean room) or via secure match tables.",
      "BlueKai-style data: segments are often delivered as lists of IDs (cookie, device, or hashed email) or as rules (e.g. \"in-market auto\") that resolve at bid time. Activation flows: segments are synced into the DSP or DMP; at auction, the bid request may include a partner ID that the DSP uses to look up segment membership and adjust bid or targeting.",
      "Clean room tech: data is joined inside a trusted execution environment (cloud or vendor clean room). Outputs are aggregated (e.g. reach, frequency, attribution counts) or derived audiences (e.g. overlap segments) that can be exported under contract; raw PII is never exposed. Major clouds (AWS, GCP, Snowflake) and vendors (LiveRamp, Habu, InfoSum, etc.) offer clean room products.",
    ],
  },
  "ad-serving-rtb": {
    id: "ad-serving-rtb",
    label: "Ad Serving & Real-Time Bidding",
    shortDescription:
      "How a single impression triggers a millisecond-scale auction.",
    overview: [
      "When an app or page needs an ad, it cannot wait long. Ad serving and real-time bidding (RTB) must choose a creative in tens of milliseconds.",
      "Behind that choice is an auction where many buyers evaluate whether this impression is worth bidding on.",
    ],
    technical: [
      "A bid request contains structured data: user, device, location, inventory slot, app/site, and publisher rules.",
      "DSPs evaluate the request against campaigns and models, then respond with a bid price and creative metadata.",
      "Bid, impression, click, and conversion logs are streamed into a data lake and warehouse, where pipelines produce features for future bidding decisions.",
    ],
  },
  "measurement-currency": {
    id: "measurement-currency",
    label: "Measurement, Currency & Clean Rooms",
    shortDescription:
      "TV and digital currency, upfronts, clean rooms, pixels, and video player data flows.",
    overview: [
      "<strong>Currency</strong> (<a href='/glossary?term=currency'>what is currency?</a>) in media means the agreed-upon standard that buyers and sellers use to transact and measure. In TV, <strong>Nielsen</strong> (and increasingly <strong>VideoAmp</strong>, <strong>iSpot</strong>) provide the ratings and audience metrics that define \"what counted\" — the currency for guarantees and upfront deals. VideoAmp and iSpot offer alternative currencies that incorporate more granular, big-data sources (e.g. set-top box, ACR, streaming) alongside or instead of panel-based Nielsen.",
      "The <strong>upfronts</strong> (<a href='/glossary?term=upfronts'>what are upfronts?</a>) are the annual TV ad sales market (typically spring) where networks sell a large portion of their coming season’s inventory. Deals are struck in terms of a chosen currency (e.g. Nielsen C3/C7, or an alternative); guarantees (reach, demo delivery) are set against that currency, and make-goods are issued if delivery falls short.",
      "TV and digital data collection: <strong>TV</strong> — set-top box data (tuning, from MVPDs), ACR (automatic content recognition in smart TVs/apps that identifies what’s on screen), and census-level streaming logs. <strong>Digital</strong> — events from web (<a href='/glossary?term=pixel'>pixels</a>, tags, server-side) and mobile (SDKs, app events), plus ad server and exchange logs.",
      "<strong>Ad pixels</strong> (<a href='/glossary?term=pixel'>glossary</a>) are small pieces of code (often a 1×1 image request or a script) that fire when an ad is shown, clicked, or when a user converts. They send data to advertisers, ad servers, or measurement partners: typically event type (impression, click, conversion), timestamp, and identifiers (cookie, device ID, hashed email, etc.). Pixels are used for attribution, conversion tracking, and retargeting.",
      "What a <strong>video player</strong> sends when playing ads: ad request context (placement ID, content ID, user/session IDs, device type, player size, support for skip/companion). What it receives: <a href='/glossary?term=vast'>VAST/VMAP</a> XML with ad creative URLs, tracking URLs (impression, quartile, complete, click), and sometimes VPAID or other executable. The player fires tracking beacons as the ad plays (start, 25/50/75/100%, skip, click) and sends those to ad servers and measurement vendors; it may also collect viewability and quality (e.g. player size, focus) for reporting.",
    ],
    technical: [
      "<strong>TV currency:</strong> Nielsen measures linear and some streaming via panels and big-data fusion; C3/C7 are commercial-minute ratings. VideoAmp and iSpot build alternative currencies from set-top box, ACR, and streaming data, enabling demographic and cross-screen guarantees. Reconciliation and make-goods are computed against the contracted currency.",
      "<strong>Clean room use cases:</strong> (1) Audience planning — overlap first-party audiences with publisher reach without sharing raw lists. (2) Attribution — join exposure and conversion data to compute incrementality or last-touch in a privacy-safe way. (3) Activation — create matched segments for targeting or suppression that leave the clean room only as instructions (e.g. \"serve to this segment\") rather than raw IDs.",
      "<strong>Pixels and events:</strong> Impression pixels fire on ad render (often 1×1 or redirect); click pixels on click-through. Conversion pixels fire on site or app (purchase, sign-up). Payloads usually include: event type, campaign/ad IDs, timestamp, and available identifiers (cookie, IDFA/GAID, hashed email). Server-side forwarding (SSF) or GCLID-style server-to-server pings send the same logic from the server to avoid ad-blocking and improve match rates.",
      "<strong>Video player data flow (send):</strong> Ad request with placement, content metadata, user/session/device IDs, player dimensions, support for skip and companions. <strong>Receive:</strong> VAST/VMAP with MediaFiles (video URL), Impression, TrackingEvents (start, quartiles, complete, skip, pause), ClickThrough, Companion ads. Player fires each tracking URL at the right event; these hit ad servers and measurement partners. Additional data sent: viewability (percent in view, player state), quality (bitrate, errors). This feeds both billing and currency/measurement pipelines.",
    ],
  },
};

const examples: Record<ExampleId, Example> = {
  instagram: {
    id: "instagram",
    label: "Instagram Feed Ad",
    surface: "Mobile social feed",
    story: [
      "You are scrolling through your Instagram feed and see a sponsored post for outdoor gear.",
      "That ad was triggered by a combination of your interests, past engagement, and the advertiser's targeting rules (e.g. \"camping enthusiasts in the Pacific Northwest\").",
    ],
    technicalFlow: [
      "The Instagram app sends engagement and device events to a data collection service, which streams them into a data lake.",
      "Batch and streaming pipelines build audience segments (e.g. \"Camping + Hiking\"), stored in a warehouse and synced to the buying platform.",
      "When you scroll the feed, the app calls an ad server. That server either selects an ad from Instagram's own systems or calls external DSPs via RTB, using your segment membership as a signal.",
    ],
  },
  youtube: {
    id: "youtube",
    label: "YouTube Pre-Roll Video Ad",
    surface: "Video player before content",
    story: [
      "You tap a video, and a short ad plays before your content starts.",
      "The platform balances user experience (not too many long ads) with advertiser demand and revenue.",
    ],
    technicalFlow: [
      "The player pings an ad decision service with context: video, user profile, device, and whether the ad can be skipped.",
      "The decision service runs an auction between campaigns, using historical performance and frequency to compute an expected value.",
      "Events about starts, views, completions, and skips are logged to the data platform, feeding back into pacing and bidding logic.",
    ],
  },
  "web-display": {
    id: "web-display",
    label: "Web Display Banner",
    surface: "Banner on a content site",
    story: [
      "You open a news article and see a banner at the top of the page.",
      "Behind the scenes, that banner slot was offered to many buyers in milliseconds.",
    ],
    technicalFlow: [
      "The page includes JavaScript that triggers an ad call when the slot is in view, passing URL, placement, and basic device info.",
      "The SSP or ad server translates this into RTB bid requests and sends them to multiple DSPs.",
      "Winning bids are logged along with viewability and interaction metrics, flowing into a warehouse for deal and layout optimization.",
    ],
  },
  search: {
    id: "search",
    label: "Search Text Ad",
    surface: "Sponsored result on a search page",
    story: [
      "You search for \"running shoes\" and see sponsored results above organic links.",
      "Unlike display, search intent is explicit: the query itself is the main targeting signal.",
    ],
    technicalFlow: [
      "The search system parses the query and matches it to keywords and audiences in advertiser accounts.",
      "An auction ranks ads using a mixture of bid price and quality score (click-through rate, landing page relevance, user history).",
      "Click and conversion events are streamed to the data platform to refine quality signals and report ROI to advertisers.",
    ],
  },
  "video-player": {
    id: "video-player",
    label: "In-Player Web / CTV Ad",
    surface: "Mid-roll ad inside a long-form stream",
    story: [
      "While watching a long-form video on a TV app or site, a break inserts a short ad pod.",
      "Multiple advertisers may share that pod, creating a sequence of ads before content resumes.",
    ],
    technicalFlow: [
      "The player schedules breaks based on content metadata and policies (e.g. every X minutes).",
      "At break time, it requests an ad pod from an ad decision server, which may call multiple exchanges.",
      "Server-side ad insertion (SSAI) stitches chosen creatives into the stream; impression and quartile events are logged for measurement and frequency control.",
    ],
  },
};

const glossary: Record<GlossaryId, GlossaryEntry> = {
  yield: {
    id: "yield",
    term: "Yield",
    category: "Marketplace",
    shortDefinition:
      "How much revenue a publisher earns per impression or per unit of inventory.",
    definition: [
      "Yield is the effective revenue a publisher earns from their ad inventory, usually normalized to something like revenue per thousand impressions (RPM) or per session.",
      "On the sell side, yield management is the process of adjusting floors, demand partners, formats, and direct vs. programmatic mix to maximize long-term revenue, not just the price of a single impression.",
    ],
    related: ["inventory", "ssp", "rtb"],
  },
  inventory: {
    id: "inventory",
    term: "Inventory",
    category: "Marketplace",
    shortDefinition:
      "All of the ad slots a publisher can sell across their apps and sites.",
    definition: [
      "Inventory is the collection of ad opportunities a publisher offers, such as feed slots, banners, in-stream pods, or search results positions.",
      "Each piece of inventory has metadata like size, format, placement, context, and allowed ad types, which buyers use to decide how much to bid.",
    ],
    related: ["yield", "ssp"],
  },
  dsp: {
    id: "dsp",
    term: "Demand-Side Platform (DSP)",
    category: "Marketplace",
    shortDefinition:
      "Software that helps advertisers bid on impressions across many publishers.",
    definition: [
      "A DSP connects advertiser budgets, targeting rules, and models to many different exchanges and SSPs.",
      "Given a bid request, the DSP decides whether to bid, at what price, and with which creative, based on campaign constraints and performance data.",
    ],
    related: ["rtb", "yield"],
  },
  ssp: {
    id: "ssp",
    term: "Supply-Side Platform (SSP)",
    category: "Marketplace",
    shortDefinition:
      "Software that helps publishers send inventory into auctions and manage yield.",
    definition: [
      "An SSP connects publisher inventory to many exchanges and DSPs, packaging ad slots into bid requests.",
      "It enforces floors, deals, and business rules, and routes demand in ways that aim to maximize the publisher's yield.",
    ],
    related: ["inventory", "yield"],
  },
  rtb: {
    id: "rtb",
    term: "Real-Time Bidding (RTB)",
    category: "Marketplace",
    shortDefinition:
      "The millisecond-scale auction that chooses which ad to show.",
    definition: [
      "RTB is a protocol where each impression is auctioned in real time: an exchange sends a bid request and receives bids from DSPs within strict timeouts.",
      "The exchange picks a winner based on price and policy, then notifies the parties and logs the outcome for billing and optimization.",
    ],
    related: ["dsp", "ssp"],
  },
  "data-lake": {
    id: "data-lake",
    term: "Data Lake",
    category: "Data",
    shortDefinition:
      "Raw, large-scale storage for events and files before heavy modeling.",
    definition: [
      "A data lake stores raw or lightly processed data such as impression logs, click events, and partner feeds, typically in cheap object storage.",
      "Pipelines read from the lake to build cleaned tables, aggregates, and machine learning features used by bidding and reporting systems.",
    ],
    related: ["identity-graph"],
  },
  "identity-graph": {
    id: "identity-graph",
    term: "Identity Graph",
    category: "Data",
    shortDefinition:
      "A map of how different identifiers belong to the same person or household.",
    definition: [
      "An identity graph links device IDs, cookies, logins, hashed emails, and other identifiers so that events can be stitched into coherent user journeys.",
      "In ad tech, identity graphs power frequency capping, cross-device measurement, and audience building, and must respect consent and privacy rules.",
    ],
    related: ["data-lake"],
  },
  attribution: {
    id: "attribution",
    term: "Attribution",
    category: "Measurement",
    shortDefinition:
      "Methods for deciding which ads get credit for a conversion.",
    definition: [
      "Attribution models connect impressions and clicks to downstream outcomes such as purchases or sign-ups.",
      "Common approaches include last-click, multi-touch, and model-based attribution, each with trade-offs in fairness and complexity.",
    ],
    related: ["rtb"],
  },
  "clean-room": {
    id: "clean-room",
    term: "Clean Room",
    category: "Measurement",
    shortDefinition:
      "A secure environment where two or more parties combine data without sharing raw PII.",
    definition: [
      "Clean rooms allow advertisers, publishers, and data providers to match audiences, run attribution, or build overlap segments without exposing personally identifiable information.",
      "Use cases: audience planning (reach overlap), attribution (exposure-to-conversion), and activation (targeting instructions). Major clouds and vendors (LiveRamp, Habu, InfoSum) offer clean room products.",
    ],
    related: ["attribution", "currency"],
  },
  currency: {
    id: "currency",
    term: "Currency",
    category: "Measurement",
    shortDefinition:
      "The agreed standard used to transact and measure media (e.g. Nielsen, VideoAmp, iSpot).",
    definition: [
      "In TV and video, currency is the measurement product that defines what \"counts\" for guarantees: ratings, reach, demo delivery. Nielsen has long been the dominant TV currency; VideoAmp and iSpot offer alternatives built on set-top box, ACR, and streaming data.",
      "Upfront and scatter deals are contracted against a chosen currency; make-goods are calculated when delivery falls short of guarantees.",
    ],
    related: ["upfronts", "clean-room"],
  },
  upfronts: {
    id: "upfronts",
    term: "Upfronts",
    category: "Measurement",
    shortDefinition:
      "The annual TV ad sales market where networks sell much of the coming season's inventory.",
    definition: [
      "During the upfronts (typically spring), networks present programming and strike deals with advertisers and agencies. Deals are expressed in terms of a currency (e.g. Nielsen C3/C7 or an alternative) with guarantees on reach and demo delivery.",
      "Scatter is the market for buying remaining inventory closer to airdate; prices often differ from upfront based on supply and demand.",
    ],
    related: ["currency"],
  },
  pixel: {
    id: "pixel",
    term: "Ad Pixel",
    category: "Measurement",
    shortDefinition:
      "A small piece of code that fires when an ad is shown, clicked, or a user converts.",
    definition: [
      "Pixels are typically a 1×1 image request or script that sends an event (impression, click, conversion) to an ad server, advertiser, or measurement partner. Payloads include event type, timestamp, and identifiers (cookie, device ID, hashed email).",
      "Used for attribution, conversion tracking, and retargeting. Server-side forwarding (SSF) or server-to-server pings avoid ad-blocking and can improve match rates.",
    ],
    related: ["attribution", "vast"],
  },
  vast: {
    id: "vast",
    term: "VAST / VMAP",
    category: "Measurement",
    shortDefinition:
      "XML standards that describe video ad creative and tracking for players.",
    definition: [
      "VAST (Video Ad Serving Template) delivers ad creative URLs, impression and tracking event URLs (start, quartiles, complete, skip, click), and optional companion ads. VMAP wraps multiple VAST responses for ad pods.",
      "The video player requests an ad, receives VAST/VMAP, loads the creative, and fires tracking URLs at the right moments; those beacons feed billing and measurement.",
    ],
    related: ["pixel"],
  },
};

const baseStyles = `
  :root {
    --bg: #050816;
    --bg-alt: #0b1020;
    --card: #0f172a;
    --accent: #0ea5e9;
    --accent-soft: rgba(56, 189, 248, 0.12);
    --accent-strong: rgba(56, 189, 248, 0.5);
    --text: #e5e7eb;
    --muted: #9ca3af;
    --border-subtle: rgba(148, 163, 184, 0.4);
    --radius-lg: 20px;
    --shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.9);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    min-height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
      "Inter", sans-serif;
    background: radial-gradient(circle at top, #1e293b 0, #020617 45%, #000 100%);
    color: var(--text);
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 24px 12px 28px;
  }

  .shell {
    width: 100%;
    max-width: 1120px;
    background: radial-gradient(circle at top left, #0b1120, #020617);
    border-radius: 24px;
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-soft);
    padding: 18px 18px 22px;
    position: relative;
    overflow: hidden;
  }

  .shell::before {
    content: "";
    position: absolute;
    inset: -120px;
    background:
      radial-gradient(circle at 0 0, rgba(59, 130, 246, 0.18), transparent 55%),
      radial-gradient(circle at 100% 20%, rgba(236, 72, 153, 0.17), transparent 55%),
      radial-gradient(circle at 0 100%, rgba(56, 189, 248, 0.16), transparent 50%);
    opacity: 0.8;
    pointer-events: none;
    z-index: -1;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-dot {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 0, #e5e7eb, #38bdf8 38%, #0ea5e9 72%, #0369a1 100%);
    box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.9),
      0 0 32px rgba(56, 189, 248, 0.65);
    position: relative;
    overflow: hidden;
  }

  .brand-dot::after {
    content: "";
    position: absolute;
    inset: 26%;
    border-radius: inherit;
    background: radial-gradient(circle at 30% 0, rgba(248, 250, 252, 0.9), transparent 60%);
    opacity: 0.8;
  }

  .app-title {
    font-size: 1.35rem;
    letter-spacing: -0.03em;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    background: linear-gradient(
      90deg,
      rgba(15, 23, 42, 0.95),
      rgba(15, 23, 42, 0.4)
    );
    border: 1px solid rgba(148, 163, 184, 0.55);
    color: var(--muted);
  }

  .chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
  }

  .subtitle {
    margin-top: 4px;
    font-size: 0.86rem;
    color: var(--muted);
    max-width: 640px;
  }

  nav {
    display: flex;
    gap: 8px;
  }

  .nav-link {
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 0.78rem;
    border: 1px solid rgba(148, 163, 184, 0.5);
    color: var(--muted);
    text-decoration: none;
    background: rgba(15, 23, 42, 0.9);
  }

  .nav-link-primary {
    border-color: var(--accent-strong);
    color: #e0f2fe;
    background: radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.24),
      rgba(8, 47, 73, 0.96)
    );
  }

  main {
    margin-top: 12px;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
    gap: 14px;
  }

  @media (max-width: 880px) {
    body {
      padding: 16px 10px 18px;
    }

    .shell {
      padding: 16px 14px 18px;
    }

    header {
      flex-direction: column;
      align-items: flex-start;
    }

    main {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
  }

  .panel {
    position: relative;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9));
    padding: 14px 14px 16px;
    overflow: hidden;
  }

  .panel::before {
    content: "";
    position: absolute;
    inset: -70px;
    background: radial-gradient(
      circle at top right,
      rgba(56, 189, 248, 0.16),
      transparent 55%
    );
    opacity: 0.6;
    pointer-events: none;
  }

  .panel-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .panel-title {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .panel-subtitle {
    font-size: 0.8rem;
    color: var(--muted);
    margin-top: 2px;
  }

  .pill-row {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  .pill {
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.5);
    font-size: 0.72rem;
    padding: 3px 8px;
    color: var(--muted);
    background: rgba(15, 23, 42, 0.9);
    white-space: nowrap;
  }

  .pill strong {
    font-weight: 500;
    color: var(--text);
  }

  .ecosystem-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  @media (max-width: 720px) {
    .ecosystem-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .ecosystem-column {
    border-radius: 14px;
    border: 1px solid rgba(148, 163, 184, 0.55);
    background: radial-gradient(circle at top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92));
    padding: 10px 9px 10px;
  }

  .ecosystem-column-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .ecosystem-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.6);
    padding: 2px 7px;
    font-size: 0.7rem;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .ecosystem-list {
    display: grid;
    gap: 6px;
  }

  .topic-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    border-radius: 11px;
    padding: 7px 8px;
    font-size: 0.8rem;
    border: 1px solid rgba(148, 163, 184, 0.5);
    color: var(--text);
    text-decoration: none;
    background: linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.98),
      rgba(15, 23, 42, 0.9)
    );
  }

  .topic-link span.label {
    flex: 1;
  }

  .topic-link span.caption {
    font-size: 0.7rem;
    color: var(--muted);
  }

  .topic-link:hover {
    border-color: var(--accent-strong);
    background: radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.12),
      rgba(15, 23, 42, 0.96)
    );
  }

  .topic-link-icon {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .where-ads {
    margin-top: 12px;
  }

  .where-ads-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .ad-surfaces {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .ad-card {
    min-width: 150px;
    max-width: 180px;
    border-radius: 14px;
    border: 1px solid rgba(148, 163, 184, 0.5);
    background: radial-gradient(circle at top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92));
    padding: 8px 9px 9px;
    font-size: 0.78rem;
    color: var(--text);
    text-decoration: none;
  }

  .ad-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .ad-card-label {
    font-weight: 500;
  }

  .ad-card-tag {
    font-size: 0.68rem;
    color: var(--muted);
  }

  .ad-card-body {
    font-size: 0.73rem;
    color: var(--muted);
  }

  .ad-card-footer {
    margin-top: 5px;
    font-size: 0.72rem;
    color: #bae6fd;
  }

  .example-shell {
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.55);
    background: radial-gradient(circle at top right, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.96));
    padding: 10px 10px 10px;
    position: relative;
    overflow: hidden;
  }

  .example-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.74rem;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .example-content {
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.6);
    background: #000;
    min-height: 210px;
    padding: 10px 11px;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 8px;
  }

  .example-avatar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: #f9fafb;
  }

  .example-avatar {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }

  .example-label {
    font-weight: 500;
  }

  .example-tag {
    font-size: 0.7rem;
    color: #e5e7eb;
    opacity: 0.7;
  }

  .example-image {
    border-radius: 10px;
    background: radial-gradient(circle at center, #4ade80 0, #15803d 40%, #020617 100%);
    position: relative;
    overflow: hidden;
  }

  .example-image::after {
    content: "";
    position: absolute;
    inset: 16%;
    border-radius: inherit;
    background: radial-gradient(circle at top, rgba(248, 250, 252, 0.65), transparent 60%);
    opacity: 0.7;
  }

  .example-cta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .example-cta-text {
    font-size: 0.76rem;
    color: #e5e7eb;
  }

  .example-cta-button {
    font-size: 0.75rem;
    border-radius: 999px;
    padding: 5px 10px;
    border: none;
    color: #0f172a;
    background: #facc15;
    font-weight: 600;
  }

  .example-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 6px;
  }

  .example-meta-link {
    color: #bae6fd;
    text-decoration: none;
  }

  .page-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
    gap: 14px;
    margin-top: 10px;
  }

  .page-section {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92));
    padding: 14px 14px 16px;
  }

  .page-heading {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .page-kicker {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--muted);
    margin-bottom: 2px;
  }

  .page-text {
    font-size: 0.86rem;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .page-list {
    font-size: 0.85rem;
    color: var(--muted);
    padding-left: 1.1rem;
    display: grid;
    gap: 4px;
  }

  .page-list li strong {
    color: var(--text);
    font-weight: 500;
  }

  details {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed rgba(148, 163, 184, 0.6);
  }

  summary {
    font-size: 0.85rem;
    color: #e0f2fe;
    cursor: pointer;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::before {
    content: "▶";
    display: inline-block;
    margin-right: 6px;
    font-size: 0.7rem;
    transform-origin: center;
  }

  details[open] summary::before {
    transform: rotate(90deg);
  }

  footer {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 0.75rem;
    color: var(--muted);
  }

  @media (max-width: 720px) {
    .page-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

const renderLayout = (opts: {
  title: string;
  description?: string;
  body: string;
}): string => {
  const { title, description, body } = opts;

  return [
    "<!doctype html>",
    "<html lang='en'>",
    "<head>",
    "  <meta charset='utf-8' />",
    "  <meta name='viewport' content='width=device-width, initial-scale=1' />",
    `  <title>${title}</title>`,
    description
      ? `  <meta name='description' content='${description}' />`
      : "",
    "  <style>",
    baseStyles,
    "  </style>",
    "</head>",
    "<body>",
    "  <div class='shell'>",
    "    <header>",
    "      <div class='brand'>",
    "        <div class='brand-dot' aria-hidden='true'></div>",
    "        <div>",
    "          <div class='chip'>",
    "            <span class='chip-dot'></span>",
    "            Ad Tech Learning Environment",
    "          </div>",
    "          <h1 class='app-title'>How Ad Tech & Data Engineering Work</h1>",
    "          <p class='subtitle'>From high-level ecosystem maps to under-the-hood data pipelines, learn how ads reach Instagram, YouTube, the open web, and more.</p>",
    "        </div>",
    "      </div>",
    "      <nav>",
    "        <a class='nav-link nav-link-primary' href='/'>Overview</a>",
    "        <a class='nav-link' href='/topic/ad-serving-rtb'>RTB Flow</a>",
    "        <a class='nav-link' href='/topic/data'>Data & Pipelines</a>",
    "      </nav>",
    "    </header>",
    body,
    "    <footer>",
    "      <span>Built with Bun, Elysia, and vanilla HTML/CSS/JS – optimized for fast loads.</span>",
    "      <span>Designed as a shared mental model for product, marketing, and engineering.</span>",
    "    </footer>",
    "  </div>",
    "</body>",
    "</html>",
  ]
    .filter(Boolean)
    .join("\n");
};

const renderHome = (): string => {
  const topicCards = [
    topics["buy-side"],
    topics["sell-side"],
    topics.data,
    topics["third-parties"],
    topics["ad-serving-rtb"],
  ]
    .map(
      (topic) =>
        `<a class="topic-link" href="/topic/${topic.id}">
          <span class="label">${topic.label}</span>
          <span class="caption">Drill into concepts & data</span>
          <span class="topic-link-icon">↗</span>
        </a>`
    )
    .join("\n");

  const body = [
    "<main>",
    "  <section class='panel'>",
    "    <div class='panel-header'>",
    "      <div>",
    "        <div class='panel-title'>Ad Tech Ecosystem Map</div>",
    "        <p class='panel-subtitle'>Start from demand, supply, and data – then drill down into details.</p>",
    "      </div>",
    "      <div class='pill-row'>",
    "        <span class='pill'><strong>Who</strong> Advertisers, agencies, publishers</span>",
    "        <span class='pill'><strong>What</strong> Inventory, audiences, auctions</span>",
    "      </div>",
    "    </div>",
    "    <div class='ecosystem-grid'>",
    "      <div class='ecosystem-column'>",
    "        <div class='ecosystem-column-title'>Buy Side · Demand</div>",
    "        <div class='ecosystem-chip'>Campaigns · Budgets · Audiences</div>",
    "        <div class='ecosystem-list'>",
    `          ${topicCards}`,
    "        </div>",
    "      </div>",
    "      <div class='ecosystem-column'>",
    "        <div class='ecosystem-column-title'>Exchange · Marketplace</div>",
    "        <div class='ecosystem-chip'>RTB · Deal IDs · Auctions</div>",
    "        <div class='ecosystem-list'>",
    "          <div class='topic-link'>",
    "            <span class='label'>Ad Exchange & Auctions</span>",
    "            <span class='caption'>Bids, wins, and clearing prices</span>",
    "          </div>",
    "          <div class='topic-link'>",
    "            <span class='label'>Measurement & Attribution</span>",
    "            <span class='caption'>How we know ads worked</span>",
    "          </div>",
    "        </div>",
    "      </div>",
    "      <div class='ecosystem-column'>",
    "        <div class='ecosystem-column-title'>Sell Side · Supply</div>",
    "        <div class='ecosystem-chip'>Inventory · Layout · Yield</div>",
    "        <div class='ecosystem-list'>",
    "          <a class='topic-link' href='/topic/sell-side'>",
    "            <span class='label'>Publishers & SSPs</span>",
    "            <span class='caption'>How inventory reaches buyers</span>",
    "            <span class='topic-link-icon'>↗</span>",
    "          </a>",
    "        </div>",
    "      </div>",
    "    </div>",
    "    <div class='where-ads'>",
    "      <div class='where-ads-label'>Where you actually see ads</div>",
    "      <div class='ad-surfaces'>",
    "        <a class='ad-card' href='/example/instagram'>",
    "          <div class='ad-card-header'>",
    "            <span class='ad-card-label'>Instagram</span>",
    "            <span class='ad-card-tag'>Feed ad</span>",
    "          </div>",
    "          <p class='ad-card-body'>In-feed sponsored posts built from your interests and behaviors.</p>",
    "          <div class='ad-card-footer'>Open example →</div>",
    "        </a>",
    "        <a class='ad-card' href='/example/youtube'>",
    "          <div class='ad-card-header'>",
    "            <span class='ad-card-label'>YouTube</span>",
    "            <span class='ad-card-tag'>Video pre-roll</span>",
    "          </div>",
    "          <p class='ad-card-body'>Video ads that run before, during, or after content.</p>",
    "          <div class='ad-card-footer'>Open example →</div>",
    "        </a>",
    "        <a class='ad-card' href='/example/web-display'>",
    "          <div class='ad-card-header'>",
    "            <span class='ad-card-label'>Web</span>",
    "            <span class='ad-card-tag'>Display banner</span>",
    "          </div>",
    "          <p class='ad-card-body'>Banners and MPUs on publishers across the open web.</p>",
    "          <div class='ad-card-footer'>Open example →</div>",
    "        </a>",
    "        <a class='ad-card' href='/example/search'>",
    "          <div class='ad-card-header'>",
    "            <span class='ad-card-label'>Search</span>",
    "            <span class='ad-card-tag'>Text ad</span>",
    "          </div>",
    "          <p class='ad-card-body'>Sponsored results driven directly by query intent.</p>",
    "          <div class='ad-card-footer'>Open example →</div>",
    "        </a>",
    "        <a class='ad-card' href='/example/video-player'>",
    "          <div class='ad-card-header'>",
    "            <span class='ad-card-label'>Streaming</span>",
    "            <span class='ad-card-tag'>In-stream pod</span>",
    "          </div>",
    "          <p class='ad-card-body'>CTV and long-form breaks with ad pods.</p>",
    "          <div class='ad-card-footer'>Open example →</div>",
    "        </a>",
    "      </div>",
    "    </div>",
    "  </section>",
    "  <section class='panel'>",
    "    <div class='panel-header'>",
    "      <div>",
    "        <div class='panel-title'>Instagram ad – end-to-end view</div>",
    "        <p class='panel-subtitle'>See how a single in-feed impression connects creative, data, and engineering.</p>",
    "      </div>",
    "      <div class='pill-row'>",
    "        <span class='pill'><strong>Persona</strong> Non-technical & engineering</span>",
    "      </div>",
    "    </div>",
    "    <div class='example-shell'>",
    "      <div class='example-bar'>",
    "        <span>Instagram · Mocked feed</span>",
    "        <span>Sponsored</span>",
    "      </div>",
    "      <div class='example-content'>",
    "        <div class='example-avatar-row'>",
    "          <div class='example-avatar'></div>",
    "          <div>",
    "            <div class='example-label'>Outdoor Gear Co.</div>",
    "            <div class='example-tag'>Sponsored · Targeted post</div>",
    "          </div>",
    "        </div>",
    "        <div class='example-image' aria-hidden='true'></div>",
    "        <div class='example-cta'>",
    "          <div class='example-cta-text'>Explore lightweight camping gear picked for your interests.</div>",
    "          <button class='example-cta-button'>Shop now</button>",
    "        </div>",
    "      </div>",
    "      <div class='example-footer'>",
    "        <span>Want the full breakdown?</span>",
    "        <a class='example-meta-link' href='/example/instagram'>Open the Instagram example →</a>",
    "      </div>",
    "    </div>",
    "  </section>",
    "</main>",
  ].join("\n");

  return renderLayout({
    title: "Ad Tech Ecosystem – Overview",
    description:
      "Learn how modern advertising technology, data pipelines, and real-time bidding work using concrete examples like Instagram and YouTube ads.",
    body,
  });
};

const renderTopicPage = (topicId: TopicId): string => {
  const topic = topics[topicId];

  const overviewItems = topic.overview
    .map((line) => `<li>${line}</li>`)
    .join("\n");

  const technicalItems = topic.technical
    .map((line) => `<li>${line}</li>`)
    .join("\n");

  const html = [
    "<!doctype html>",
    "<html lang='en'>",
    "<head>",
    "  <meta charset='utf-8' />",
    "  <meta name='viewport' content='width=device-width, initial-scale=1' />",
    `  <title>${topic.label} – Ad Tech Deep Dive</title>`,
    `  <meta name='description' content='${topic.shortDescription}' />`,
    "  <style>",
    homeStyles,
    "  </style>",
    "</head>",
    "<body>",
    "  <div class='app-shell'>",
    "    <div class='canvas'>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Concept Overview</h2>",
    "        <article class='phone'>",
    "          <header class='phone-header'>",
    "            <a class='phone-header-icon' href='/' aria-label='Back to ecosystem overview'>◀</a>",
    `            <div class='phone-header-center'>${topic.label}</div>`,
    "            <div class='phone-header-icon' aria-hidden='true'>ℹ</div>",
    "          </header>",
    "          <div class='phone-body'>",
    `            <h1 class='ecosystem-title'>${topic.label}</h1>`,
    `            <p class='ecosystem-subtitle'>${topic.shortDescription}</p>`,
    "            <ul class='topic-bullets'>",
    overviewItems,
    "            </ul>",
    renderTopicDiagram(topicId),
    renderTopicReferences(topicId),
    "          </div>",
    "        </article>",
    "      </section>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Under the Hood</h2>",
    "        <article class='phone'>",
    "          <div class='phone-body'>",
    "            <h1 class='ecosystem-title'>Data &amp; Engineering View</h1>",
    "            <p class='ecosystem-subtitle'>How this part of the ecosystem shows up in schemas, pipelines, and services.</p>",
    "            <ul class='topic-bullets'>",
    technicalItems,
    "            </ul>",
    "            <div class='example-flow-diagram'>" + renderTopicFlowDiagram(topicId) + "</div>",
    "          </div>",
    "        </article>",
    "      </section>",
    "    </div>",
    "  </div>",
    "</body>",
    "</html>",
  ].join("\n");

  return html;
};

const renderExamplePage = (exampleId: ExampleId): string => {
  const example = examples[exampleId];

  const story = example.story.map((line) => `<li>${line}</li>`).join("\n");
  const technicalFlow = example.technicalFlow
    .map((line) => `<li>${line}</li>`)
    .join("\n");

  const html = [
    "<!doctype html>",
    "<html lang='en'>",
    "<head>",
    "  <meta charset='utf-8' />",
    "  <meta name='viewport' content='width=device-width, initial-scale=1' />",
    `  <title>${example.label} – How this ad shows up</title>`,
    "  <meta name='description' content='End-to-end view of how this ad is targeted, auctioned, and measured.' />",
    "  <style>",
    homeStyles,
    "  </style>",
    "</head>",
    "<body>",
    "  <div class='app-shell'>",
    "    <div class='canvas'>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>What the user sees</h2>",
    "        <article class='phone'>",
    "          <header class='phone-header'>",
    "            <a class='phone-header-icon' href='/' aria-label='Back to ecosystem overview'>◀</a>",
    `            <div class='phone-header-center'>${example.label}</div>`,
    "            <div class='phone-header-icon' aria-hidden='true'>⋯</div>",
    "          </header>",
    "          <div class='phone-body'>",
    `            <h1 class='ecosystem-title'>${example.label}</h1>`,
    `            <p class='ecosystem-subtitle'>Surface: ${example.surface}</p>`,
    "            <ul class='topic-bullets'>",
    story,
    "            </ul>",
    "            <h1 class='ecosystem-title' style='margin-top:10px;'>How does the tech work?</h1>",
    "            <p class='ecosystem-subtitle'>Follow the path from impression opportunity to events in your data lake.</p>",
    "            <ul class='topic-bullets'>",
    technicalFlow,
    "            </ul>",
    renderExampleDiagram(exampleId),
    renderExampleReferences(exampleId),
    "          </div>",
    "        </article>",
    "      </section>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Ad surface preview</h2>",
    "        <article class='phone'>",
    renderExampleSurfaceFrame(exampleId),
    "        <div class='example-flow-diagram'>" + renderExampleFlowDiagram(exampleId) + "</div>",
    "        </article>",
    "      </section>",
    "    </div>",
    "  </div>",
    "</body>",
    "</html>",
  ].join("\n");

  return html;
};

const homeStyles = `
  :root {
    --bg: #f4f4f5;
    --bg-alt: #e5e7eb;
    --card: #ffffff;
    --card-soft: #f9fafb;
    --border-subtle: #e5e7eb;
    --border-strong: #d4d4d8;
    --accent: #0ea5e9;
    --accent-soft: #e0f2fe;
    --accent-strong: #0284c7;
    --text-main: #111827;
    --text-soft: #6b7280;
    --text-muted: #9ca3af;
    --radius-lg: 22px;
    --shadow-phone: 0 18px 40px rgba(15, 23, 42, 0.18);
    --space-xs: 6px;
    --space-sm: 12px;
    --space-md: 18px;
    --space-lg: 24px;
    --space-xl: 32px;
    --line-height-tight: 1.35;
    --line-height-body: 1.55;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    min-height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
      "Inter", sans-serif;
    background-color: var(--bg);
    background-image:
      radial-gradient(circle, #e4e4e7 1px, transparent 0),
      radial-gradient(circle, #e4e4e7 1px, transparent 0);
    background-size: 18px 18px;
    background-position: 0 0, 9px 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-lg) var(--space-md);
    color: var(--text-main);
    line-height: var(--line-height-body);
  }

  .app-shell {
    width: 100%;
    max-width: 1120px;
    padding: 0 var(--space-xs);
  }

  .canvas {
    display: flex;
    gap: var(--space-xl);
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
  }

  .canvas-column {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .canvas-heading {
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: var(--space-xs);
  }

  .phone {
    width: min(380px, 100vw - 48px);
    background: var(--card);
    border-radius: 26px;
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-phone);
    padding: var(--space-md) var(--space-md) var(--space-lg);
  }

  .phone-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .phone-header-center {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .phone-header-icon {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-soft);
    font-size: 0.8rem;
  }

  .phone-body {
    background: var(--card-soft);
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    padding: var(--space-md) var(--space-md) var(--space-lg);
  }

  .ecosystem-title {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    line-height: var(--line-height-tight);
  }

  .ecosystem-subtitle {
    font-size: 0.78rem;
    color: var(--text-soft);
    margin-bottom: var(--space-sm);
    line-height: var(--line-height-body);
  }

  .ecosystem-card {
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: #fdfdfd;
    padding: var(--space-md) var(--space-md) var(--space-md);
    margin-bottom: var(--space-md);
  }

  .ecosystem-card-heading {
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-strong);
    margin-bottom: var(--space-xs);
  }

  .ecosystem-row-label {
    font-size: 0.75rem;
    color: var(--text-soft);
    margin-bottom: var(--space-sm);
  }

  .ecosystem-pill-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .ecosystem-pill {
    flex: 1 1 0;
    min-width: 0;
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    padding: 6px 8px;
    font-size: 0.78rem;
    color: var(--text-main);
    background: #f9fafb;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .ecosystem-pill span {
    white-space: nowrap;
  }

  .ecosystem-pill-primary {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1d4ed8;
    font-weight: 600;
  }

  .ecosystem-section-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-soft);
    margin: 10px 0 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ecosystem-section-label a {
    font-size: 0.75rem;
    color: var(--accent-strong);
    text-decoration: none;
  }

  .topic-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .topic-card {
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
    background: #ffffff;
    padding: 8px 9px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .topic-card-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .topic-icon {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: #eff6ff;
    color: #0ea5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
  }

  .topic-title {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-main);
  }

  .topic-caption {
    font-size: 0.72rem;
    color: var(--text-soft);
  }

  .topic-arrow {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .instagram-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 10px;
  }

  .instagram-logo {
    font-weight: 600;
    letter-spacing: 0.08em;
    font-size: 0.85rem;
  }

  .instagram-icons {
    display: flex;
    gap: 6px;
    color: var(--text-soft);
  }

  .instagram-card {
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: #ffffff;
    overflow: hidden;
  }

  .instagram-card-header {
    padding: 10px 10px 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .instagram-avatar {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }

  .instagram-meta {
    font-size: 0.78rem;
  }

  .instagram-name {
    font-weight: 600;
  }

  .instagram-sponsored {
    color: var(--text-soft);
  }

  .instagram-image {
    height: 180px;
    background: radial-gradient(circle at center, #fbbf24 0, #ea580c 45%, #1e293b 100%);
    position: relative;
  }

  .instagram-image::after {
    content: "";
    position: absolute;
    inset: 18% 20%;
    border-radius: 999px;
    border: 4px solid rgba(15, 23, 42, 0.8);
  }

  .instagram-cta {
    padding: 10px 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--border-subtle);
  }

  .instagram-cta-text {
    font-size: 0.78rem;
    color: var(--text-main);
  }

  .instagram-cta-chip {
    font-size: 0.7rem;
    color: var(--accent-strong);
    background: var(--accent-soft);
    padding: 2px 7px;
    border-radius: 999px;
    margin-bottom: 4px;
    display: inline-block;
  }

  .instagram-cta-button {
    font-size: 0.78rem;
    border-radius: 999px;
    padding: 6px 12px;
    border: none;
    background: #0284c7;
    color: #f9fafb;
    font-weight: 600;
  }

  .instagram-footer {
    padding: 0 2px;
    margin-top: 8px;
    font-size: 0.72rem;
    color: var(--text-soft);
  }

  .instagram-footer span {
    font-weight: 500;
    color: var(--text-main);
  }

  .insight-card {
    margin-top: 12px;
    border-radius: 16px;
    border: 1px solid var(--border-subtle);
    background: #f9fafb;
    padding: 10px 10px 10px;
  }

  .insight-title {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .insight-row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .insight-icon {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0ea5e9;
    font-size: 0.9rem;
  }

  .insight-text-main {
    font-size: 0.78rem;
    color: var(--text-main);
    margin-bottom: 2px;
  }

  .insight-text-sub {
    font-size: 0.74rem;
    color: var(--text-soft);
  }

  .insight-link {
    display: inline-block;
    margin-top: 6px;
    font-size: 0.75rem;
    color: var(--accent-strong);
    text-decoration: none;
  }

  .example-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }

  .example-tab {
    flex: 1 1 0;
    min-width: 0;
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    padding: 4px 8px;
    font-size: 0.74rem;
    color: var(--text-soft);
    background: #f4f4f5;
    text-align: center;
    text-decoration: none;
    white-space: nowrap;
  }

  .example-tab.active {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
  }

  .yt-frame {
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: #0f172a;
    overflow: hidden;
    color: #e5e7eb;
    font-size: 0.78rem;
  }

  .yt-header {
    padding: 8px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #111827;
  }

  .yt-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .yt-avatar {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #dc2626;
  }

  .yt-logo {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .yt-player {
    position: relative;
    background: #020617;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .yt-player::before {
    content: "";
    width: 58px;
    height: 40px;
    border-radius: 12px;
    border: 2px solid rgba(248, 250, 252, 0.8);
  }

  .yt-player::after {
    content: "Ad · 0:05";
    position: absolute;
    left: 10px;
    bottom: 8px;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.85);
  }

  .yt-controls {
    padding: 8px 10px 10px;
    border-top: 1px solid rgba(15, 23, 42, 0.9);
  }

  .yt-timeline {
    height: 3px;
    border-radius: 999px;
    background: #1f2937;
    margin-bottom: 6px;
    overflow: hidden;
  }

  .yt-timeline-fill {
    width: 30%;
    height: 100%;
    background: #facc15;
  }

  .yt-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.7rem;
    color: #9ca3af;
  }

  .yt-skip {
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid rgba(248, 250, 252, 0.7);
    font-size: 0.7rem;
  }

  .web-frame {
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: #ffffff;
    overflow: hidden;
    font-size: 0.78rem;
    color: var(--text-soft);
  }

  .web-header {
    padding: 8px 10px;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .web-url {
    flex: 1;
    border-radius: 999px;
    background: #f3f4f6;
    padding: 4px 8px;
    font-size: 0.72rem;
    color: #6b7280;
  }

  .web-banner-ad {
    background: #eff6ff;
    border-bottom: 1px solid #bfdbfe;
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.76rem;
  }

  .web-banner-label {
    font-size: 0.7rem;
    color: #1d4ed8;
  }

  .web-content {
    padding: 10px;
  }

  .web-lines {
    height: 6px;
    border-radius: 999px;
    background: #e5e7eb;
    margin-bottom: 4px;
  }

  .search-frame {
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: #ffffff;
    padding: 10px 10px 12px;
    font-size: 0.76rem;
    color: var(--text-soft);
  }

  .search-bar {
    border-radius: 999px;
    border: 1px solid #d4d4d8;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .search-pill-row {
    display: flex;
    gap: 6px;
    font-size: 0.7rem;
    margin-bottom: 8px;
  }

  .search-pill {
    padding: 2px 7px;
    border-radius: 999px;
    background: #f4f4f5;
  }

  .search-result-ad {
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
    padding: 8px 8px 9px;
    background: #f9fafb;
  }

  .search-result-title {
    font-size: 0.8rem;
    color: var(--text-main);
    margin-bottom: 2px;
  }

  .search-result-url {
    font-size: 0.7rem;
    color: #16a34a;
    margin-bottom: 4px;
  }

  .stream-frame {
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: #020617;
    color: #e5e7eb;
    overflow: hidden;
    font-size: 0.76rem;
  }

  .stream-header {
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0b1120;
  }

  .stream-player {
    position: relative;
    height: 150px;
    background: radial-gradient(circle at center, #4b5563 0, #020617 60%);
  }

  .stream-ad-badge {
    position: absolute;
    left: 10px;
    bottom: 8px;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.85);
  }

  .stream-controls {
    padding: 8px 10px 10px;
    border-top: 1px solid rgba(15, 23, 42, 0.9);
  }

  .stream-timeline {
    height: 3px;
    border-radius: 999px;
    background: #1f2937;
    margin-bottom: 6px;
    overflow: hidden;
  }

  .stream-timeline-fill {
    width: 40%;
    height: 100%;
    background: #22c55e;
  }

  .diagram {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--border-subtle);
  }

  .diagram-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .diagram-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 6px;
    align-items: center;
  }

  .diagram-rail.stack {
    grid-auto-flow: row;
  }

  .diagram-node {
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    background: #f9fafb;
    padding: 6px 10px;
    font-size: 0.74rem;
    color: var(--text-soft);
    text-align: center;
  }

  .diagram-node strong {
    display: block;
    font-size: 0.76rem;
    color: var(--text-main);
    margin-bottom: 2px;
  }

  .diagram-node.primary {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1d4ed8;
  }

  .diagram-arrow {
    font-size: 0.85rem;
    color: var(--text-muted);
    text-align: center;
  }

  .diagram-caption {
    margin-top: 6px;
    font-size: 0.72rem;
    color: var(--text-soft);
  }

  .references {
    margin-top: 10px;
    font-size: 0.72rem;
    color: var(--text-soft);
  }

  .references a {
    color: var(--accent-strong);
    text-decoration: none;
  }

  .references a:hover {
    text-decoration: underline;
  }
  
  .glossary-grid {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 14px;
  }

  @media (max-width: 720px) {
    .glossary-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .glossary-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 6px;
  }

  .glossary-item {
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
    background: #ffffff;
    padding: var(--space-sm) var(--space-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    font-size: 0.8rem;
    color: var(--text-main);
  }

  .glossary-item small {
    font-size: 0.7rem;
    color: var(--text-soft);
  }

  .glossary-item.active {
    border-color: #bfdbfe;
    background: #eff6ff;
  }

  .glossary-term {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    line-height: var(--line-height-tight);
  }

  .glossary-chip-inline {
    font-size: 0.7rem;
    margin-left: 4px;
  }

  .glossary-illustration {
    width: 100%;
    max-width: 280px;
    margin: 0 auto var(--space-lg);
    padding: var(--space-md);
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 16px;
    border: 1px solid #bae6fd;
  }

  .glossary-illustration svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .topic-bullets {
    margin-top: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .topic-bullets li {
    margin-bottom: var(--space-sm);
    line-height: var(--line-height-body);
  }

  .insight-card {
    margin-top: var(--space-md);
    padding: var(--space-md);
  }

  .diagram {
    margin-top: var(--space-md);
    padding-top: var(--space-md);
  }

  .references {
    margin-top: var(--space-md);
    padding-top: var(--space-sm);
  }

  .example-flow-diagram {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    background: linear-gradient(180deg, #f0f9ff 0%, #f9fafb 100%);
    border-radius: 16px;
    border: 1px solid #bae6fd;
  }

  .example-flow-diagram .flow-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent-strong);
    margin-bottom: var(--space-sm);
    text-align: center;
  }

  .example-flow-diagram svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const renderTopicDiagram = (id: TopicId): string => {
  if (id === "buy-side") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Buying path</div>",
      "  <div class='diagram-rail'>",
      "    <div class='diagram-node'><strong>Advertiser</strong>Goals & budgets</div>",
      "    <div class='diagram-arrow'>→</div>",
      "    <div class='diagram-node'><strong>Agency</strong>Strategy & planning</div>",
      "    <div class='diagram-arrow'>→</div>",
      "    <div class='diagram-node primary'><strong>DSP</strong>Bid decision per impression</div>",
      "    <div class='diagram-arrow'>→</div>",
      "    <div class='diagram-node'><strong>Exchange</strong>Auction against other buyers</div>",
      "  </div>",
      "  <p class='diagram-caption'>Each impression request flows through this chain before an ad is served and logged.</p>",
      "</div>",
    ].join("\n");
  }

  if (id === "sell-side") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Inventory flow</div>",
      "  <div class='diagram-rail'>",
      "    <div class='diagram-node'><strong>Page / App</strong>Has ad slots</div>",
      "    <div class='diagram-arrow'>→</div>",
      "    <div class='diagram-node primary'><strong>Publisher ad server</strong>Chooses which demand to call</div>",
      "    <div class='diagram-arrow'>→</div>",
      "    <div class='diagram-node'><strong>SSP</strong>Packages inventory & sets floors</div>",
      "    <div class='diagram-arrow'>→</div>",
      "    <div class='diagram-node'><strong>Exchanges</strong>Distribute to many buyers</div>",
      "  </div>",
      "  <p class='diagram-caption'>This path controls who can even bid on an impression.</p>",
      "</div>",
    ].join("\n");
  }

  if (id === "data") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Data pipeline</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Event collection</strong>SDKs, pixels, server logs</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Raw storage</strong>Data lake with immutable events</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Transforms</strong>Cleaning, joins, aggregations</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>Audiences & features</strong>Segments and model inputs</div>",
      "  </div>",
      "  <p class='diagram-caption'>Events move from noisy logs to clean features that drive bidding and reporting.</p>",
      "</div>",
    ].join("\n");
  }

  if (id === "third-parties") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Partner integrations</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Partner feeds</strong>Audience, fraud, measurement data</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>Integration layer</strong>APIs, file drops, schema mapping</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Internal models</strong>Joined with events & users</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Activation</strong>Targeting, safety, attribution</div>",
      "  </div>",
      "  <p class='diagram-caption'>External data is normalized before it can safely influence decisions.</p>",
      "</div>",
    ].join("\n");
  }

  if (id === "ad-serving-rtb") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>RTB lifecycle</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>1. Ad request</strong>App / page asks for an ad</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>2. Bid request</strong>Exchange sends context to DSPs</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>3. Bid decision</strong>DSP evaluates campaigns & models</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>4. Auction</strong>Exchange picks winner & price</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>5. Logs</strong>Impression, click, conversion events</div>",
      "  </div>",
      "  <p class='diagram-caption'>All of this happens in tens of milliseconds for each impression.</p>",
      "</div>",
    ].join("\n");
  }

  if (id === "measurement-currency") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Measurement & currency flow</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Exposure & conversion</strong>Pixels, player beacons, server logs</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Clean room / pipeline</strong>Match, aggregate, attribute</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>Currency</strong>Nielsen, VideoAmp, iSpot ratings</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Upfronts & guarantees</strong>Deals, make-goods, reporting</div>",
      "  </div>",
      "  <p class='diagram-caption'>TV and digital measurement feed currency and clean room use cases.</p>",
      "</div>",
    ].join("\n");
  }

  return "";
};

const renderTopicFlowDiagram = (id: TopicId): string => {
  const W = 360;
  const H = 130;
  const stroke = "#0284c7";
  const fill = "#e0f2fe";
  const fillStrong = "#bae6fd";
  const text = "#0f172a";
  const defs = `<defs><marker id="tarrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${stroke}"/></marker></defs>`;
  const node = (x: number, y: number, w: number, h: number, label: string, sub?: string, primary = false) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${primary ? fillStrong : fill}" stroke="${stroke}" stroke-width="1.5"/><text x="${x + w/2}" y="${y + (sub ? 22 : h/2 + 5)}" text-anchor="middle" font-size="10" font-weight="600" fill="${text}">${label}</text>${sub ? `<text x="${x + w/2}" y="${y + 36}" text-anchor="middle" font-size="8" fill="#475569">${sub}</text>` : ""}</g>`;
  const arrow = (x1: number, y1: number, x2: number, y2: number) =>
    `<path stroke="${stroke}" stroke-width="2" fill="none" marker-end="url(#tarrow)" d="M${x1} ${y1} L${x2} ${y2}"/>`;

  const nw = 62;
  const nh = 40;
  const y = (H - nh) / 2;
  const pad = 8;

  if (id === "buy-side") {
    const xs: [number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad)];
    return (
      "<div class='flow-title'>Buying path</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Advertiser", "goals") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Agency", "strategy") +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "DSP", "bid decision", true) +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Exchange", "auction") +
      "</svg>"
    );
  }

  if (id === "sell-side") {
    const xs: [number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad)];
    return (
      "<div class='flow-title'>Inventory flow</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Page / App", "slots") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Ad server", "demand", true) +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "SSP", "package") +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Exchanges", "buyers") +
      "</svg>"
    );
  }

  if (id === "data") {
    const xs: [number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad)];
    return (
      "<div class='flow-title'>Data pipeline</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Events", "SDKs, pixels") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Data lake", "raw") +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "Transforms", "joins", true) +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Audiences", "features") +
      "</svg>"
    );
  }

  if (id === "third-parties") {
    const xs: [number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad)];
    return (
      "<div class='flow-title'>Partner integrations</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Partner feeds", "audience, fraud") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Integration", "APIs, schema", true) +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "Models", "joined") +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Activation", "targeting") +
      "</svg>"
    );
  }

  if (id === "ad-serving-rtb") {
    const nw5 = 52;
    const xs: [number, number, number, number, number] = [pad, pad + nw5 + pad, pad + 2 * (nw5 + pad), pad + 3 * (nw5 + pad), pad + 4 * (nw5 + pad)];
    return (
      "<div class='flow-title'>RTB lifecycle</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw5, nh, "Ad request") +
      arrow(xs[0] + nw5, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw5, nh, "Bid request") +
      arrow(xs[1] + nw5, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw5, nh, "Bid decision", "DSP", true) +
      arrow(xs[2] + nw5, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw5, nh, "Auction") +
      arrow(xs[3] + nw5, y + nh / 2, xs[4] - 4, y + nh / 2) +
      node(xs[4], y, nw5, nh, "Logs") +
      "</svg>"
    );
  }

  if (id === "measurement-currency") {
    const nw4 = 68;
    const xs: [number, number, number, number] = [pad, pad + nw4 + pad, pad + 2 * (nw4 + pad), pad + 3 * (nw4 + pad)];
    return (
      "<div class='flow-title'>Measurement &amp; currency flow</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw4, nh, "Exposure", "pixels, logs") +
      arrow(xs[0] + nw4, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw4, nh, "Clean room", "match", true) +
      arrow(xs[1] + nw4, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw4, nh, "Currency", "ratings") +
      arrow(xs[2] + nw4, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw4, nh, "Upfronts", "deals") +
      "</svg>"
    );
  }

  return "";
};

const renderExampleDiagram = (id: ExampleId): string => {
  if (id === "instagram") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Instagram ad data flow</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Feed scroll</strong>Viewport hits an eligible slot</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Ad decision service</strong>Calls internal / external bidders</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>Selected creative</strong>Served into the feed UI</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Events</strong>Impression, scroll, click, conversion</div>",
      "  </div>",
      "  <p class='diagram-caption'>Those events feed ETL pipelines that maintain your interest profile.</p>",
      "</div>",
    ].join("\n");
  }

  if (id === "youtube") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>YouTube pre-roll flow</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Player start</strong>Video load triggers ad opportunity</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Ad server</strong>Requests a pre-roll or pod</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>Auction</strong>Chooses winning creative(s)</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Viewability & completion</strong>Quartile events feed optimization</div>",
      "  </div>",
      "</div>",
    ].join("\n");
  }

  if (id === "web-display") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Display banner flow</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Page render</strong>Slot script fires when in view</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>SSP</strong>Packages slot into bid requests</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>DSP bids</strong>Price vs expected performance</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Logs</strong>Impressions, viewability, clicks</div>",
      "  </div>",
      "</div>",
    ].join("\n");
  }

  if (id === "search") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Search ad flow</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Query</strong>User types a search term</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Matching</strong>Engine finds eligible keywords & ads</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>Rank & auction</strong>Bid × quality decides position</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Click & conversion</strong>Signals feed attribution & smart bidding</div>",
      "  </div>",
      "</div>",
    ].join("\n");
  }

  if (id === "video-player") {
    return [
      "<div class='diagram'>",
      "  <div class='diagram-label'>Streaming / CTV pod</div>",
      "  <div class='diagram-rail stack'>",
      "    <div class='diagram-node'><strong>Break schedule</strong>Content marks ad breaks</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Ad decision server</strong>Requests a pod of ads</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node primary'><strong>SSAI</strong>Stitches ads into the stream</div>",
      "    <div class='diagram-arrow'>↓</div>",
      "    <div class='diagram-node'><strong>Server logs</strong>Impression & quartile tracking</div>",
      "  </div>",
      "</div>",
    ].join("\n");
  }

  return "";
};

const renderHomeExamplePhone = (id: ExampleId): string => {
  const learnHref = `/example/${id}`;
  const label = examples[id].label;

  const tabs = [
    "          <div class='example-tabs'>",
    `            <a class='example-tab${id === "instagram" ? " active" : ""}' href='/?example=instagram'>Instagram</a>`,
    `            <a class='example-tab${id === "youtube" ? " active" : ""}' href='/?example=youtube'>YouTube</a>`,
    `            <a class='example-tab${id === "web-display" ? " active" : ""}' href='/?example=web-display'>Web</a>`,
    `            <a class='example-tab${id === "search" ? " active" : ""}' href='/?example=search'>Search</a>`,
    `            <a class='example-tab${id === "video-player" ? " active" : ""}' href='/?example=video-player'>Video</a>`,
    "          </div>",
  ].join("\n");

  const instagramFrame = [
    "          <div class='instagram-header'>",
    "            <div class='phone-header-icon' aria-hidden='true'>📷</div>",
    "            <div class='instagram-logo'>Instagram</div>",
    "            <div class='instagram-icons' aria-hidden='true'>",
    "              <span>♡</span>",
    "              <span>✉</span>",
    "            </div>",
    "          </div>",
    "          <div class='instagram-card'>",
    "            <div class='instagram-card-header'>",
    "              <div class='instagram-avatar'></div>",
    "              <div class='instagram-meta'>",
    "                <div class='instagram-name'>Outdoor Gear Co.</div>",
    "                <div class='instagram-sponsored'>Sponsored · Mobile feed</div>",
    "              </div>",
    "            </div>",
    "            <div class='instagram-image' aria-hidden='true'></div>",
    "            <div class='instagram-cta'>",
    "              <div>",
    "                <div class='instagram-cta-chip'>Targeted Post</div>",
    "                <div class='instagram-cta-text'>Explore the gear that matches your recent camping and hiking activity.</div>",
    "              </div>",
    "              <button class='instagram-cta-button'>Shop now</button>",
    "            </div>",
    "          </div>",
  ].join("\n");

  const youtubeFrame = [
    "          <div class='yt-frame'>",
    "            <div class='yt-header'>",
    "              <div class='yt-header-left'>",
    "                <div class='yt-avatar' aria-hidden='true'></div>",
    "                <div class='yt-logo'>YouTube</div>",
    "              </div>",
    "              <span style='font-size:0.7rem;color:#9ca3af;'>Sign in</span>",
    "            </div>",
    "            <div class='yt-player' aria-hidden='true'></div>",
    "            <div class='yt-controls'>",
    "              <div class='yt-timeline'><div class='yt-timeline-fill'></div></div>",
    "              <div class='yt-meta'>",
    "                <span>Ad · Outdoor Gear Co.</span>",
    "                <span class='yt-skip'>Skip ad</span>",
    "              </div>",
    "            </div>",
    "          </div>",
  ].join("\n");

  const webFrame = [
    "          <div class='web-frame'>",
    "            <div class='web-header'>",
    "              <div style='width:10px;height:10px;border-radius:999px;background:#f97316;' aria-hidden='true'></div>",
    "              <div class='web-url'>news.example.com/article-about-camping</div>",
    "            </div>",
    "            <div class='web-banner-ad'>",
    "              <div>",
    "                <div class='web-banner-label'>Ad · Outdoor Gear Co.</div>",
    "                <div>Lightweight tents for your next trip</div>",
    "              </div>",
    "              <button class='instagram-cta-button' style='padding:4px 10px;font-size:0.72rem;'>Shop now</button>",
    "            </div>",
    "            <div class='web-content'>",
    "              <div class='web-lines' style='width:80%;'></div>",
    "              <div class='web-lines' style='width:60%;'></div>",
    "              <div class='web-lines' style='width:70%;margin-top:6px;'></div>",
    "            </div>",
    "          </div>",
  ].join("\n");

  const searchFrame = [
    "          <div class='search-frame'>",
    "            <div class='search-bar'>",
    "              <span aria-hidden='true'>🔍</span>",
    "              <span>lightweight camping tents</span>",
    "            </div>",
    "            <div class='search-pill-row'>",
    "              <div class='search-pill'>All</div>",
    "              <div class='search-pill'>Images</div>",
    "              <div class='search-pill'>Shopping</div>",
    "            </div>",
    "            <div class='search-result-ad'>",
    "              <div style='font-size:0.7rem;color:#6b7280;margin-bottom:2px;'>Ad · Outdoor Gear Co.</div>",
    "              <div class='search-result-title'>Ultralight tents for weekend trips</div>",
    "              <div class='search-result-url'>outdoorgear.example</div>",
    "              <div>Free shipping on orders over $50. Explore 1–4 person options.</div>",
    "            </div>",
    "          </div>",
  ].join("\n");

  const streamFrame = [
    "          <div class='stream-frame'>",
    "            <div class='stream-header'>",
    "              <span style='font-size:0.8rem;font-weight:600;'>StreamNow</span>",
    "              <span style='font-size:0.7rem;color:#9ca3af;'>Profile ▾</span>",
    "            </div>",
    "            <div class='stream-player' aria-hidden='true'>",
    "              <div class='stream-ad-badge'>Ad 1 of 2 · 0:15</div>",
    "            </div>",
    "            <div class='stream-controls'>",
    "              <div class='stream-timeline'><div class='stream-timeline-fill'></div></div>",
    "              <div style='display:flex;justify-content:space-between;font-size:0.7rem;color:#9ca3af;'>",
    "                <span>Outdoor Gear Co. – Camping Series</span>",
    "                <span>Ad · Sponsored</span>",
    "              </div>",
    "            </div>",
    "          </div>",
  ].join("\n");

  const frame =
    id === "instagram"
      ? instagramFrame
      : id === "youtube"
      ? youtubeFrame
      : id === "web-display"
      ? webFrame
      : id === "search"
      ? searchFrame
      : streamFrame;

  return [
    "        <article class='phone phone-instagram' aria-label='Ad example preview'>",
    tabs,
    frame,
    "          <div class='instagram-footer'>",
    "            <span>Example surface</span> · Visual only – not an exact UI replica.",
    "          </div>",
    "          <div class='insight-card'>",
    "            <div class='insight-title'>How did this ad find you?</div>",
    "            <div class='insight-row'>",
    "              <div class='insight-icon' aria-hidden='true'>🧠</div>",
    "              <div>",
    "                <p class='insight-text-main'>User Data &amp; Engineering</p>",
    "                <p class='insight-text-sub'>Follow the full data and decision path for this surface, from request to logs, on the detailed example page.</p>",
    "              </div>",
    "            </div>",
    "            <a class='insight-link' href='" +
      learnHref +
      "'>Open the " +
      label +
      " example →</a>",
    "          </div>",
    "        </article>",
  ].join("\n");
};

const renderExampleFlowDiagram = (id: ExampleId): string => {
  const W = 360;
  const H = 140;
  const stroke = "#0284c7";
  const fill = "#e0f2fe";
  const fillStrong = "#bae6fd";
  const text = "#0f172a";

  const node = (x: number, y: number, w: number, h: number, label: string, sub?: string, primary = false) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${primary ? fillStrong : fill}" stroke="${stroke}" stroke-width="1.5"/><text x="${x + w/2}" y="${y + (sub ? 22 : h/2 + 5)}" text-anchor="middle" font-size="11" font-weight="600" fill="${text}">${label}</text>${sub ? `<text x="${x + w/2}" y="${y + 38}" text-anchor="middle" font-size="9" fill="#475569">${sub}</text>` : ""}</g>`;
  const arrow = (x1: number, y1: number, x2: number, y2: number) =>
    `<path stroke="${stroke}" stroke-width="2" fill="none" marker-end="url(#arrow)" d="M${x1} ${y1} L${x2} ${y2}"/>`;

  const defs = `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${stroke}"/></marker></defs>`;

  if (id === "search") {
    const nw = 58;
    const nh = 44;
    const y = (H - nh) / 2;
    const pad = 12;
    const x1 = pad;
    const x2 = x1 + nw + pad;
    const x3 = x2 + nw + pad;
    const x4 = x3 + nw + pad;
    const x5 = x4 + nw + pad;
    const cx = (a: number, b: number) => a + nw / 2;
    return (
      "<div class='flow-title'>How search ads get to the page</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(x1, y, nw, nh, "Query") +
      arrow(x1 + nw, y + nh / 2, x2 - 4, y + nh / 2) +
      node(x2, y, nw, nh, "Search", "engine") +
      arrow(x2 + nw, y + nh / 2, x3 - 4, y + nh / 2) +
      node(x3, y, nw, nh, "Match", "keywords") +
      arrow(x3 + nw, y + nh / 2, x4 - 4, y + nh / 2) +
      node(x4, y, nw, nh, "Auction", "rank & bid", true) +
      arrow(x4 + nw, y + nh / 2, x5 - 4, y + nh / 2) +
      node(x5, y, nw, nh, "Ad", "shown") +
      "</svg>"
    );
  }

  if (id === "instagram") {
    const nw = 56;
    const nh = 42;
    const y = (H - nh) / 2;
    const pad = 10;
    const xs: [number, number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad), pad + 4 * (nw + pad)];
    return (
      "<div class='flow-title'>How feed ads are chosen</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Feed", "scroll") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Ad", "decision") +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "Bidders", "DSPs", true) +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Creative", "served") +
      arrow(xs[3] + nw, y + nh / 2, xs[4] - 4, y + nh / 2) +
      node(xs[4], y, nw, nh, "Events", "logs") +
      "</svg>"
    );
  }

  if (id === "youtube") {
    const nw = 54;
    const nh = 42;
    const y = (H - nh) / 2;
    const pad = 8;
    const xs: [number, number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad), pad + 4 * (nw + pad)];
    return (
      "<div class='flow-title'>Pre-roll systems flow</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Player", "start") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Ad server", "request") +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "Auction", "VAST", true) +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Creative", "stream") +
      arrow(xs[3] + nw, y + nh / 2, xs[4] - 4, y + nh / 2) +
      node(xs[4], y, nw, nh, "Quartiles", "tracked") +
      "</svg>"
    );
  }

  if (id === "web-display") {
    const nw = 52;
    const nh = 42;
    const y = (H - nh) / 2;
    const pad = 6;
    const xs: [number, number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad), pad + 4 * (nw + pad)];
    return (
      "<div class='flow-title'>Display banner systems flow</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Page", "slot") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "SSP", "package") +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "Exchange", "RTB", true) +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "DSP", "bids") +
      arrow(xs[3] + nw, y + nh / 2, xs[4] - 4, y + nh / 2) +
      node(xs[4], y, nw, nh, "Ad", "logs") +
      "</svg>"
    );
  }

  if (id === "video-player") {
    const nw = 54;
    const nh = 42;
    const y = (H - nh) / 2;
    const pad = 8;
    const xs: [number, number, number, number, number] = [pad, pad + nw + pad, pad + 2 * (nw + pad), pad + 3 * (nw + pad), pad + 4 * (nw + pad)];
    return (
      "<div class='flow-title'>Streaming / CTV ad flow</div>" +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}` +
      node(xs[0], y, nw, nh, "Break", "schedule") +
      arrow(xs[0] + nw, y + nh / 2, xs[1] - 4, y + nh / 2) +
      node(xs[1], y, nw, nh, "Ad server", "pod request") +
      arrow(xs[1] + nw, y + nh / 2, xs[2] - 4, y + nh / 2) +
      node(xs[2], y, nw, nh, "SSAI", "stitch", true) +
      arrow(xs[2] + nw, y + nh / 2, xs[3] - 4, y + nh / 2) +
      node(xs[3], y, nw, nh, "Stream", "with ads") +
      arrow(xs[3] + nw, y + nh / 2, xs[4] - 4, y + nh / 2) +
      node(xs[4], y, nw, nh, "Server", "logs") +
      "</svg>"
    );
  }

  return "";
};

const renderExampleSurfaceFrame = (id: ExampleId): string => {
  if (id === "instagram") {
    return [
      "          <div class='instagram-header'>",
      "            <div class='phone-header-icon' aria-hidden='true'>📷</div>",
      "            <div class='instagram-logo'>Instagram</div>",
      "            <div class='instagram-icons' aria-hidden='true'>",
      "              <span>♡</span>",
      "              <span>✉</span>",
      "            </div>",
      "          </div>",
      "          <div class='instagram-card'>",
      "            <div class='instagram-card-header'>",
      "              <div class='instagram-avatar'></div>",
      "              <div class='instagram-meta'>",
      "                <div class='instagram-name'>Outdoor Gear Co.</div>",
      "                <div class='instagram-sponsored'>Sponsored · Mobile feed</div>",
      "              </div>",
      "            </div>",
      "            <div class='instagram-image' aria-hidden='true'></div>",
      "            <div class='instagram-cta'>",
      "              <div>",
      "                <div class='instagram-cta-chip'>Targeted Post</div>",
      "                <div class='instagram-cta-text'>Explore the gear that matches your recent camping and hiking activity.</div>",
      "              </div>",
      "              <button class='instagram-cta-button'>Shop now</button>",
      "            </div>",
      "          </div>",
    ].join("\n");
  }

  if (id === "youtube") {
    return [
      "          <div class='yt-frame'>",
      "            <div class='yt-header'>",
      "              <div class='yt-header-left'>",
      "                <div class='yt-avatar' aria-hidden='true'></div>",
      "                <div class='yt-logo'>YouTube</div>",
      "              </div>",
      "              <span style='font-size:0.7rem;color:#9ca3af;'>Sign in</span>",
      "            </div>",
      "            <div class='yt-player' aria-hidden='true'></div>",
      "            <div class='yt-controls'>",
      "              <div class='yt-timeline'><div class='yt-timeline-fill'></div></div>",
      "              <div class='yt-meta'>",
      "                <span>Ad · Outdoor Gear Co.</span>",
      "                <span class='yt-skip'>Skip ad</span>",
      "              </div>",
      "            </div>",
      "          </div>",
    ].join("\n");
  }

  if (id === "web-display") {
    return [
      "          <div class='web-frame'>",
      "            <div class='web-header'>",
      "              <div style='width:10px;height:10px;border-radius:999px;background:#f97316;' aria-hidden='true'></div>",
      "              <div class='web-url'>news.example.com/article-about-camping</div>",
      "            </div>",
      "            <div class='web-banner-ad'>",
      "              <div>",
      "                <div class='web-banner-label'>Ad · Outdoor Gear Co.</div>",
      "                <div>Lightweight tents for your next trip</div>",
      "              </div>",
      "              <button class='instagram-cta-button' style='padding:4px 10px;font-size:0.72rem;'>Shop now</button>",
      "            </div>",
      "            <div class='web-content'>",
      "              <div class='web-lines' style='width:80%;'></div>",
      "              <div class='web-lines' style='width:60%;'></div>",
      "              <div class='web-lines' style='width:70%;margin-top:6px;'></div>",
      "            </div>",
      "          </div>",
    ].join("\n");
  }

  if (id === "search") {
    return [
      "          <div class='search-frame'>",
      "            <div class='search-bar'>",
      "              <span aria-hidden='true'>🔍</span>",
      "              <span>lightweight camping tents</span>",
      "            </div>",
      "            <div class='search-pill-row'>",
      "              <div class='search-pill'>All</div>",
      "              <div class='search-pill'>Images</div>",
      "              <div class='search-pill'>Shopping</div>",
      "            </div>",
      "            <div class='search-result-ad'>",
      "              <div style='font-size:0.7rem;color:#6b7280;margin-bottom:2px;'>Ad · Outdoor Gear Co.</div>",
      "              <div class='search-result-title'>Ultralight tents for weekend trips</div>",
      "              <div class='search-result-url'>outdoorgear.example</div>",
      "              <div>Free shipping on orders over $50. Explore 1–4 person options.</div>",
      "            </div>",
      "          </div>",
    ].join("\n");
  }

  // video-player / streaming
  return [
    "          <div class='stream-frame'>",
    "            <div class='stream-header'>",
    "              <span style='font-size:0.8rem;font-weight:600;'>StreamNow</span>",
    "              <span style='font-size:0.7rem;color:#9ca3af;'>Profile ▾</span>",
    "            </div>",
    "            <div class='stream-player' aria-hidden='true'>",
    "              <div class='stream-ad-badge'>Ad 1 of 2 · 0:15</div>",
    "            </div>",
    "            <div class='stream-controls'>",
    "              <div class='stream-timeline'><div class='stream-timeline-fill'></div></div>",
    "              <div style='display:flex;justify-content:space-between;font-size:0.7rem;color:#9ca3af;'>",
    "                <span>Outdoor Gear Co. – Camping Series</span>",
    "                <span>Ad · Sponsored</span>",
    "              </div>",
    "            </div>",
    "          </div>",
  ].join("\n");
};

const getGlossaryIllustration = (id: GlossaryId): string => {
  const w = 200;
  const h = 120;
  const stroke = "#0284c7";
  const fill = "#e0f2fe";
  const svgs: Record<GlossaryId, string> = {
    yield: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Yield: revenue per impression</title><path fill="${fill}" stroke="${stroke}" stroke-width="1.5" d="M20 100 L50 70 L80 55 L110 40 L140 30 L170 25 L180 25" fill="none"/><circle cx="180" cy="25" r="5" fill="${stroke}"/></svg>`,
    inventory: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Inventory: ad slots</title><rect x="30" y="40" width="40" height="50" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><rect x="85" y="35" width="40" height="55" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><rect x="140" y="45" width="40" height="45" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/></svg>`,
    dsp: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>DSP: demand-side platform</title><circle cx="60" cy="50" r="22" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="60" y="55" text-anchor="middle" font-size="14" fill="${stroke}">$</text><path stroke="${stroke}" stroke-width="1.5" fill="none" d="M85 50 L120 50"/><circle cx="140" cy="50" r="22" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="140" y="55" text-anchor="middle" font-size="12" fill="${stroke}">Bid</text></svg>`,
    ssp: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>SSP: supply-side platform</title><rect x="25" y="45" width="50" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><path stroke="${stroke}" stroke-width="1.5" fill="none" d="M80 65 L115 65"/><circle cx="150" cy="65" r="25" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="150" y="70" text-anchor="middle" font-size="11" fill="${stroke}">SSP</text></svg>`,
    rtb: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>RTB: real-time bidding</title><path fill="${fill}" stroke="${stroke}" stroke-width="1.5" d="M100 15 L115 50 L155 50 L120 75 L135 110 L100 85 L65 110 L80 75 L45 50 L85 50 Z"/></svg>`,
    "data-lake": `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Data lake: raw storage</title><path fill="${fill}" stroke="${stroke}" stroke-width="1.5" d="M40 50 L70 35 L130 35 L160 50 L160 95 L40 95 Z"/><path fill="none" stroke="${stroke}" stroke-width="1" d="M50 65 Q100 55 150 65" stroke-dasharray="4 2"/><path fill="none" stroke="${stroke}" stroke-width="1" d="M55 80 Q100 70 145 80" stroke-dasharray="4 2"/></svg>`,
    "identity-graph": `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Identity graph: linked IDs</title><circle cx="50" cy="45" r="18" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><circle cx="100" cy="60" r="18" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><circle cx="150" cy="45" r="18" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><path stroke="${stroke}" stroke-width="1.5" fill="none" d="M68 48 L82 57"/><path stroke="${stroke}" stroke-width="1.5" fill="none" d="M118 57 L132 48"/><path stroke="${stroke}" stroke-width="1.5" fill="none" d="M65 60 Q100 85 135 60"/></svg>`,
    attribution: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Attribution: ad to conversion</title><circle cx="45" cy="55" r="20" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="45" y="60" text-anchor="middle" font-size="12" fill="${stroke}">Ad</text><path stroke="${stroke}" stroke-width="2" fill="none" marker-end="url(#arr)" d="M70 55 L130 55"/><circle cx="155" cy="55" r="20" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="155" y="60" text-anchor="middle" font-size="10" fill="${stroke}">Conv</text><defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${stroke}"/></marker></defs></svg>`,
    "clean-room": `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Clean room: secure data join</title><rect x="50" y="35" width="100" height="55" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><path stroke="${stroke}" stroke-width="2" fill="none" d="M95 50 L95 75 M105 50 L105 75 M85 62 L115 62"/></svg>`,
    currency: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Currency: measurement standard</title><rect x="40" y="40" width="120" height="45" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="100" y="70" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">Rating %</text></svg>`,
    upfronts: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Upfronts: annual TV market</title><rect x="35" y="45" width="35" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><rect x="82" y="45" width="35" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><rect x="130" y="45" width="35" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="52" y="68" text-anchor="middle" font-size="10" fill="${stroke}">Q2</text><text x="99" y="68" text-anchor="middle" font-size="10" fill="${stroke}">Q3</text><text x="147" y="68" text-anchor="middle" font-size="10" fill="${stroke}">Q4</text></svg>`,
    pixel: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Ad pixel: tracking beacon</title><rect x="85" y="45" width="30" height="30" fill="${stroke}"/><path stroke="${stroke}" stroke-width="1.5" fill="none" d="M100 80 L100 95 M100 95 L115 95 M100 95 L85 110"/></svg>`,
    vast: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>VAST: video ad template</title><rect x="50" y="40" width="100" height="50" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><path fill="${stroke}" d="M88 55 L88 75 L108 65 Z"/></svg>`,
  };
  return svgs[id] || "";
};

const renderGlossaryPage = (selected?: GlossaryId): string => {
  const allEntries = Object.values(glossary);
  const active =
    selected && glossary[selected] ? glossary[selected] : allEntries[0];
  if (!active) return "";

  const listHtml = allEntries
    .sort((a, b) => a.term.localeCompare(b.term))
    .map((entry) => {
      const isActive = entry.id === active.id;
      return [
        `<a class='glossary-item${isActive ? " active" : ""}' href='/glossary?term=${entry.id}'>`,
        "  <span>",
        `    ${entry.term}`,
        "  </span>",
        `  <small>${entry.category}</small>`,
        "</a>",
      ].join("\n");
    })
    .join("\n");

  const definitionList = active.definition
    .map((line) => `<li>${line}</li>`)
    .join("\n");

  const related =
    active.related && active.related.length
      ? [
          "<div style='margin-top:10px;font-size:0.74rem;color:var(--text-soft);'>",
          "  Related: ",
          active.related
            .map(
              (id) =>
                `<a href='/glossary?term=${id}' style='color:var(--accent-strong);text-decoration:none;'>${glossary[id].term}</a>`
            )
            .join(" · "),
          "</div>",
        ].join("\n")
      : "";

  const html = [
    "<!doctype html>",
    "<html lang='en'>",
    "<head>",
    "  <meta charset='utf-8' />",
    "  <meta name='viewport' content='width=device-width, initial-scale=1' />",
    "  <title>Ad Tech Glossary</title>",
    "  <meta name='description' content='Plain-language glossary for core ad tech, data, and marketplace terms.' />",
    "  <style>",
    homeStyles,
    "  </style>",
    "</head>",
    "<body>",
    "  <div class='app-shell'>",
    "    <div class='canvas'>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Glossary</h2>",
    "        <article class='phone'>",
    "          <header class='phone-header'>",
    "            <a class='phone-header-icon' href='/' aria-label='Back to ecosystem overview'>◀</a>",
    "            <div class='phone-header-center'>Key terms</div>",
    "            <div class='phone-header-icon' aria-hidden='true'>?</div>",
    "          </header>",
    "          <div class='phone-body'>",
    "            <h1 class='ecosystem-title'>Ad Tech Glossary</h1>",
    "            <p class='ecosystem-subtitle'>Tap a term to see a concise explanation and why it matters.</p>",
    "            <div class='glossary-list'>",
    listHtml,
    "            </div>",
    "          </div>",
    "        </article>",
    "      </section>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Definition</h2>",
    "        <article class='phone'>",
    "          <div class='phone-body'>",
    "            <div class='glossary-illustration'>" + getGlossaryIllustration(active.id) + "</div>",
    `            <div class='glossary-term'>${active.term}</div>`,
    `            <p class='ecosystem-subtitle'>${active.shortDefinition}</p>`,
    "            <ul class='topic-bullets'>",
    definitionList,
    "            </ul>",
    related,
    "          </div>",
    "        </article>",
    "      </section>",
    "    </div>",
    "  </div>",
    "</body>",
    "</html>",
  ].join("\n");

  return html;
};

const renderTopicReferences = (id: TopicId): string => {
  if (id === "buy-side" || id === "sell-side") {
    return [
      "<div class='references'>",
      "  Based on common programmatic ecosystem diagrams – see ",
      "  <a href='https://bidscube.com/blog/2025/09/25/ad-tech-ecosystem-players-layers-and-how-it-all-connects/' target='_blank' rel='noreferrer'>this ad tech ecosystem overview</a>",
      "  for a more detailed map of buyers, sellers, and intermediaries.",
      "</div>",
    ].join("\n");
  }

  if (id === "ad-serving-rtb" || id === "data" || id === "third-parties") {
    return [
      "<div class='references'>",
      "  For a deeper technical diagram of data flows and RTB, check ",
      "  <a href='https://aerospike.com/blog/programmatic-advertising-data-flow-smarter-rtb' target='_blank' rel='noreferrer'>Aerospike&apos;s programmatic data flow article</a>.",
      "</div>",
    ].join("\n");
  }

  if (id === "measurement-currency") {
    return [
      "<div class='references'>",
      "  For more on TV measurement and alternative currency, see ",
      "  <a href='https://www.iab.com/guidelines/tv-measurement/' target='_blank' rel='noreferrer'>IAB TV measurement guidelines</a>",
      "  and vendor docs from Nielsen, VideoAmp, and iSpot.",
      "</div>",
    ].join("\n");
  }

  return "";
};

const renderExampleReferences = (id: ExampleId): string => {
  if (id === "instagram" || id === "web-display" || id === "search") {
    return [
      "<div class='references'>",
      "  Want to go further? External explainers like",
      "  <a href='https://bidscube.com/blog/2025/09/25/ad-tech-ecosystem-players-layers-and-how-it-all-connects/' target='_blank' rel='noreferrer'>this ad tech ecosystem guide</a>",
      "  show how these surfaces plug into the wider marketplace.",
      "</div>",
    ].join("\n");
  }

  if (id === "youtube" || id === "video-player") {
    return [
      "<div class='references'>",
      "  For more detail on video ad workflows, see",
      "  <a href='https://aerospike.com/blog/programmatic-advertising-data-flow-smarter-rtb' target='_blank' rel='noreferrer'>this RTB data flow deep dive</a>",
      "  which breaks down streaming and real-time decisioning.",
      "</div>",
    ].join("\n");
  }

  return "";
};

const renderNewHome = (selectedExample?: ExampleId): string => {
  const exampleId: ExampleId = selectedExample && selectedExample in examples ? selectedExample : "instagram";

  const html = [
    "<!doctype html>",
    "<html lang='en'>",
    "<head>",
    "  <meta charset='utf-8' />",
    "  <meta name='viewport' content='width=device-width, initial-scale=1' />",
    "  <title>Ad Tech Ecosystem – Overview</title>",
    "  <meta name='description' content='Visual guide to how modern ad tech, data pipelines, and real-time bidding work, using Instagram and other ad surfaces as examples.' />",
    "  <style>",
    homeStyles,
    "  </style>",
    "</head>",
    "<body>",
    "  <div class='app-shell'>",
    "    <div class='canvas'>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Ecosystem Overview</h2>",
    "        <article class='phone phone-ecosystem' aria-label='Ad tech ecosystem map'>",
    "          <header class='phone-header'>",
    "            <div class='phone-header-icon' aria-hidden='true'>☰</div>",
    "            <div class='phone-header-center'>Ad Tech Ecosystem</div>",
    "            <div class='phone-header-icon' aria-hidden='true'>🔍</div>",
    "          </header>",
    "          <div class='phone-body'>",
    "            <h1 class='ecosystem-title'>Ecosystem Map</h1>",
    "            <p class='ecosystem-subtitle'>Tap into each area to see how demand, supply, and data work together.</p>",
    "            <div class='ecosystem-card'>",
    "              <div class='ecosystem-card-heading'>Buy Side (Demand)</div>",
    "              <p class='ecosystem-row-label'>Who decides which impressions to buy</p>",
    "              <div class='ecosystem-pill-row'>",
    "                <a class='ecosystem-pill' href='/topic/buy-side'><span>Advertiser</span></a>",
    "                <a class='ecosystem-pill' href='/topic/buy-side'><span>Agency</span></a>",
    "                <a class='ecosystem-pill ecosystem-pill-primary' href='/topic/buy-side'><span>DSP</span></a>",
    "              </div>",
    "            </div>",
    "            <div class='ecosystem-card'>",
    "              <div class='ecosystem-card-heading'>Exchange / Marketplace</div>",
    "              <p class='ecosystem-row-label'>Where RTB auctions actually happen</p>",
    "              <div class='ecosystem-pill-row'>",
    "                <span class='ecosystem-pill ecosystem-pill-primary'><span>Ad Exchange</span></span>",
    "              </div>",
    "            </div>",
    "            <div class='ecosystem-card'>",
    "              <div class='ecosystem-card-heading'>Sell Side (Supply)</div>",
    "              <p class='ecosystem-row-label'>Who owns the surfaces with ad slots</p>",
    "              <div class='ecosystem-pill-row'>",
    "                <a class='ecosystem-pill' href='/topic/sell-side'><span>SSP</span></a>",
    "                <a class='ecosystem-pill' href='/topic/sell-side'><span>Publisher</span></a>",
    "              </div>",
    "            </div>",
    "            <div class='ecosystem-section-label'>",
    "              <span>Key Topics</span>",
    "              <a href='/topic/ad-serving-rtb'>View all</a>",
    "            </div>",
    "            <div class='topic-list'>",
    "              <a class='topic-card' href='/topic/ad-serving-rtb'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>⚡</div>",
    "                  <div>",
    "                    <div class='topic-title'>Real-Time Bidding</div>",
    "                    <div class='topic-caption'>How auctions happen in milliseconds</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "              <a class='topic-card' href='/topic/data'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>📊</div>",
    "                  <div>",
    "                    <div class='topic-title'>Data Collection</div>",
    "                    <div class='topic-caption'>Cookies, events, and identity graphs</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "              <a class='topic-card' href='/topic/third-parties'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>🔗</div>",
    "                  <div>",
    "                    <div class='topic-title'>3rd-Party Providers</div>",
    "                    <div class='topic-caption'>Data, safety, and measurement partners</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "              <a class='topic-card' href='/topic/measurement-currency'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>📺</div>",
    "                  <div>",
    "                    <div class='topic-title'>Measurement &amp; Currency</div>",
    "                    <div class='topic-caption'>TV currency, upfronts, clean rooms, pixels, video data</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "            </div>",
    "          </div>",
    "        </article>",
    "      </section>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Ad Examples</h2>",
    renderHomeExamplePhone(exampleId),
    "      </section>",
    "    </div>",
    "  </div>",
    "</body>",
    "</html>",
  ].join("\n");

  return html;
};

const app = new Elysia();

app
  .get("/", ({ request }) => {
    const url = new URL(request.url);
    const exampleParam = url.searchParams.get("example") as ExampleId | null;
    const selected =
      exampleParam && (exampleParam as ExampleId) in examples
        ? (exampleParam as ExampleId)
        : undefined;

    const html = renderNewHome(selected);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  })
  .get("/glossary", ({ request }) => {
    const url = new URL(request.url);
    const termParam = url.searchParams.get("term") as GlossaryId | null;
    const selected =
      termParam && glossary[termParam as GlossaryId]
        ? (termParam as GlossaryId)
        : undefined;

    const html = renderGlossaryPage(selected);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  })
  .get("/topic/:id", ({ params }) => {
    const id = params.id as TopicId;
    if (!(id in topics)) {
      return new Response("Topic not found", { status: 404 });
    }

    const html = renderTopicPage(id);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  })
  .get("/example/:id", ({ params }) => {
    const id = params.id as ExampleId;
    if (!(id in examples)) {
      return new Response("Example not found", { status: 404 });
    }

    const html = renderExamplePage(id);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  })
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

if (process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT ?? 4500);
  app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🧠 Ad tech learning app running at http://localhost:${port}`);
}

export type App = typeof app;
export default app;
