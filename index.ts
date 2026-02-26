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
  companies?: string[];
  deepDive?: string[];
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
  | "vast"
  | "header-bidding"
  | "creative"
  | "cpm"
  | "open-rtb"
  | "pmp"
  | "dco"
  | "brand-safety"
  | "viewability"
  | "ctv"
  | "ssai"
  | "frequency-cap"
  | "programmatic-guaranteed"
  | "quality-score";

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
      "How advertisers, agencies, and DSPs decide which impressions to buy — and the technology that executes billions of bid decisions per day.",
    companies: ["The Trade Desk", "Google DV360", "Amazon DSP", "Microsoft Xandr", "Yahoo DSP", "MediaMath"],
    overview: [
      "<strong>The buy side</strong> is everything from an advertiser deciding they want to reach customers, through agencies that plan and buy media, to the software platforms called <strong>Demand-Side Platforms (DSPs)</strong> that execute billions of ad auctions every day. When you see an ad anywhere on the internet, the buy side already decided — in milliseconds — that you were worth showing it to.",
      "<strong>Advertisers</strong> are the brands and companies paying for ads: Nike, a local restaurant, a SaaS startup. They define campaign goals (brand awareness, app installs, e-commerce purchases), budgets, flight dates, and targeting requirements. Most advertisers don’t operate DSPs directly — they work through agencies or managed service teams.",
      "<strong>Agencies</strong> (WPP’s GroupM, Publicis, IPG Mediabrands, Havas) act as expert intermediaries. They handle media planning (which channels reach my audience?), buying (negotiating rates and setting up programmatic campaigns), creative trafficking, and performance reporting. Holding-company agencies often operate their own trading desks that centralize DSP access across many clients.",
      "A <strong>Demand-Side Platform (DSP)</strong> is the core technology that connects advertiser budgets and targeting rules to the actual ad auction. The DSP receives a bid request from an exchange (describing an available impression), evaluates it against active campaigns in milliseconds, and either passes or returns a bid with a price and creative. The biggest independent DSP is <strong>The Trade Desk</strong>. Other major players include <strong>Google DV360</strong>, <strong>Amazon DSP</strong>, <strong>Microsoft Xandr</strong>, and <strong>Yahoo DSP</strong>.",
      "<strong>The Trade Desk</strong> is the largest independent (non-walled-garden) DSP, used by agencies and brands worldwide. Their platform (called Solimar) supports display, video, audio, connected TV (CTV), digital out-of-home (DOOH), and native formats — all in one interface. They built <strong>Unified ID 2.0 (UID2)</strong>, an open-source identity standard based on hashed and encrypted emails, designed as a privacy-respecting alternative to third-party cookies. The Trade Desk is ‘independent’ because they don’t own media, unlike Google or Amazon.",
      "<strong>Google DV360</strong> (Display & Video 360) is Google’s enterprise buying platform. It has deep native integration with YouTube, Google Display Network, and Google’s own ad exchange (AdX), plus external inventory. Because Google also owns the user’s search history, email (Gmail), location (Maps), and browser (Chrome), DV360 benefits from audience data that no independent DSP can match. This ‘walled garden’ advantage creates both power and antitrust scrutiny.",
      "<strong>Amazon DSP</strong> offers something unique: access to Amazon’s first-party shopping data. Amazon knows what you searched for, added to your cart, bought, and reviewed. This makes Amazon DSP extremely powerful for retail and consumer-packaged-goods (CPG) advertisers — the data reflects actual purchase intent, not just inferred interest. Amazon DSP can serve ads on Amazon.com, IMDb, Amazon-owned properties, and third-party sites/apps.",
      "The <strong>campaign data hierarchy</strong> inside a DSP is: Account → Campaign (budget, goal, flight dates) → Ad Group or Line Item (targeting rules: geo, device, audience segments, content category) → Creative (the actual ad unit: banner, video, native). Each layer narrows the targeting. When a bid request arrives, the DSP instantly filters eligible line items and scores them.",
    ],
    technical: [
      "<strong>The bid decision pipeline (sub-100ms):</strong> When a bid request arrives, a DSP must respond within a strict timeout (typically 80-100ms). The pipeline: (1) <em>User lookup</em> — query a fast key-value store (Redis, DynamoDB, Aerospike) for the user’s segment memberships and frequency caps; (2) <em>Campaign matching</em> — filter all active campaigns to those eligible for this impression based on targeting rules (geo, device type, content category, audience); (3) <em>Bid price calculation</em> — apply an ML scoring model that predicts the probability of a click or conversion (pCTR, pCVR), multiply by the value-per-conversion, and apply any bid modifiers; (4) <em>Creative selection</em> — choose the best creative from eligible creatives for this context; (5) <em>Return OpenRTB bid response</em> with price and ad markup (HTML/VAST).",
      "<strong>Bidding models in DSPs</strong> are ML models (often gradient-boosted trees or neural networks) trained on billions of historical impression/click/conversion events. Input features include: hour of day, day of week, user segment membership (one-hot encoded), device type, browser, OS, domain, historical CTR for creative × placement pairs, auction win rate, publisher quality score. Output: a probability estimate (pCTR or pCVR) that drives bid pricing. These models are retrained continuously (daily or hourly) to stay current.",
      "<strong>First-price vs second-price auctions:</strong> In a <em>second-price auction</em> (historical standard), the winner pays the second-highest bid + $0.01 — incentivizing truthful bidding. By 2019, most exchanges shifted to <em>first-price auctions</em> where the winner pays their exact bid. This forced DSPs to implement ‘bid shading’ — submitting bids slightly below the maximum they’d actually pay, using ML models trained on historical auction clearing prices to avoid overpaying.",
      "<strong>Budget pacing</strong> is the mechanism that spreads spend evenly across a flight. A DSP tracks spend velocity relative to the budget-time curve. If a campaign is ahead of pace, the DSP reduces bid multipliers or skips some auctions; if behind, it raises bids. Pacing algorithms run in a feedback loop every few seconds. Poor pacing means either wasted budget (front-loaded) or underdelivery (back-loaded).",
      "<strong>Frequency capping</strong> limits how many times a user sees the same ad within a period (e.g., 3 times per day). The DSP stores impression counts per user-per-campaign in a fast distributed cache with TTL. At bid time, the user lookup includes frequency data, and the DSP skips bidding if the cap is reached. Cross-device frequency capping requires an identity graph (like UID2 or RampID) to link the same user across their phone, laptop, and TV.",
      "<strong>Data objects in a DSP:</strong> Advertiser → Campaigns (budget, goal type, attribution model, conversion pixels) → Line Items (flight, targeting: geo, device, audience, domain allowlists/blocklists, deal IDs, bid type) → Creatives (size, format, asset URLs, click URL, impression trackers). Performance events (impressions, clicks, conversions) stream into a data lake (S3/GCS) and warehouse (Snowflake/BigQuery/Redshift) for reporting, pacing, and ML feature generation.",
      "<strong>The Trade Desk’s UID2 explained:</strong> When a user logs into a publisher with their email, the publisher hashes the email (SHA-256), encrypts it with UID2 infrastructure, and passes the encrypted token in the bid request. The Trade Desk (and other participating DSPs) can decrypt it, match it against advertiser first-party audiences (CRM lists), and target or suppress accordingly — all without exposing the raw email. The token rotates over time to limit tracking accumulation.",
    ],
  },
  "sell-side": {
    id: "sell-side",
    label: "Sell Side (Supply)",
    shortDescription:
      "How publishers and SSPs package inventory, run header bidding, and maximize revenue from every ad slot.",
    companies: ["Magnite", "PubMatic", "OpenX", "Index Exchange", "TripleLift", "Sharethrough", "Google Ad Manager"],
    overview: [
      "<strong>The sell side</strong> is the other half of programmatic: publishers who own ad-bearing surfaces (websites, apps, streaming services, games) and the technology stack that helps them sell those surfaces to the highest bidder. Publishers are paid in CPM (cost per thousand impressions), so their goal is to maximize both fill rate (percentage of slots filled) and CPM.",
      "A <strong>publisher</strong> can be a massive media company (The New York Times, Spotify, Disney Streaming) or a small blog running Google AdSense. Their ad inventory is their product — slots in their layout where ads can appear. The quality of inventory (brand safety, viewability, audience) determines what CPM it can command.",
      "A <strong>Supply-Side Platform (SSP)</strong> is the publisher-facing technology that connects ad slots to many demand sources simultaneously. The SSP’s job is yield optimization: maximizing CPM for every impression while respecting the publisher’s business rules (advertiser category blocks, competitor exclusions, floor prices). Top SSPs include <strong>Magnite</strong> (the largest independent, formed by merging Rubicon Project and Telaria), <strong>PubMatic</strong>, <strong>OpenX</strong>, <strong>Index Exchange</strong>, and <strong>TripleLift</strong> (native ads specialist).",
      "Before 2015, publishers used a ‘waterfall’ — calling demand sources one at a time until one filled the slot. If the top-ranked demand partner didn’t fill it, the next was called, and so on. This was slow, left money on the table, and favored incumbents. <strong>Header bidding</strong> was the industry’s solution: running auctions in parallel across many demand partners so publishers could take the highest bid from all of them simultaneously. This dramatically increased publisher revenue (often 30–60% uplift).",
      "<strong>Google Ad Manager (GAM)</strong>, formerly DoubleClick for Publishers (DFP), is the dominant publisher ad server — used by most major publishers worldwide. It manages direct-sold campaigns (guaranteed deals with advertisers at fixed CPMs), programmatic demand (SSPs, header bidding), ad slot definitions, creative trafficking, and reporting. Even publishers using many SSPs for programmatic still use GAM as their central ad server and decision engine.",
      "<strong>Deal types in programmatic:</strong> (1) <em>Open Auction</em> — any DSP can bid, winner takes the impression at market price; (2) <em>Private Marketplace (PMP)</em> — publisher invites specific buyers via Deal IDs, often with a price floor; (3) <em>Preferred Deal</em> — one buyer gets first look at a non-guaranteed fixed price; (4) <em>Programmatic Guaranteed (PG)</em> — fixed CPM with guaranteed volume, like a traditional direct deal but executed programmatically with audience targeting.",
      "<strong>Floor prices</strong> are the minimum CPM a publisher will accept. SSPs manage floors dynamically using ML models that predict the expected clearing price for each impression based on user, context, and historical demand patterns. Publishers also set category floors (e.g., auto always gets a $5 floor). Dynamic floors replaced the old hard floors that DSPs could exploit through bid shading.",
    ],
    technical: [
      "<strong>Header bidding with Prebid.js:</strong> The publisher includes <code>prebid.js</code> in the page’s <code>&lt;head&gt;</code>. When a slot is available, Prebid sends a bid request to each configured SSP adapter in parallel. Each adapter formats the request for its SSP, waits for the bid, and returns it to Prebid. After the timeout (typically 700–1000ms), Prebid passes the highest bid to GAM as a key-value pair. GAM then compares this against any direct-sold campaigns and serves whichever produces highest yield. The entire header bidding process runs before the main page content loads, adding a small but measurable latency penalty.",
      "<strong>Server-Side Header Bidding (SSHB):</strong> Moving Prebid to a server (Prebid Server, hosted by SSPs or cloud) eliminates the browser latency tax. The browser sends one request to the Prebid Server endpoint; the server fans out to all SSPs in parallel, collects bids, returns the best to the browser. This reduces JavaScript weight on the page and enables more bidder partners without performance degradation. Trade-off: slightly less accurate user data (no browser cookie access from the server for some SSPs).",
      "<strong>Publisher ad server decisions:</strong> GAM’s unified auction compares all demand: (1) Direct guaranteed campaigns (booked impressions at fixed CPM), (2) Non-guaranteed programmatic line items (representing each SSP partner’s expected CPM range), (3) Header bidding results (passed as custom key-values). GAM chooses the highest net CPM after accounting for the publisher’s revenue share with each demand channel. The winner’s creative is served.",
      "<strong>Yield management tools:</strong> SSPs provide publishers with analytics dashboards showing fill rate, average CPM, CPM by demand partner/deal/format, and revenue trends. Sophisticated publishers run A/B experiments on floor prices, ad layout (number of slots, slot sizes), and demand partner mix. Removing low-quality demand sources that win cheaply but drag down average CPM is a key optimization lever.",
      "<strong>Ad quality controls on the sell side:</strong> Publishers configure: (a) Category blocklists (no gambling, no adult content, no political ads); (b) Advertiser/brand blocklists (direct competitors); (c) Creative format restrictions (no auto-play audio, no expandable ads); (d) IAS/DoubleVerify integration for pre-bid blocking of known malicious or brand-unsafe advertisers. These rules are enforced by the SSP and ad server before a creative can render.",
      "<strong>Supply path optimization (SPO):</strong> DSPs and agencies have analyzed that the same inventory is often available through many SSPs simultaneously, creating duplicate bid requests. SPO is the process of DSPs reducing the number of SSP connections they accept and favoring SSPs with direct publisher relationships (fewer hops, lower fees, better data). For publishers, this means SSPs with direct integrations and lower fees get more demand.",
      "<strong>eCPM (effective CPM) calculation:</strong> Publishers see eCPM rather than raw CPMs because different deals pay differently. eCPM = (Total Revenue / Total Impressions) × 1000. An SSP might show an impression to 10 DSPs: 8 bid $1 CPM, 2 bid $5 CPM. The clearing price is $5. The publisher earns roughly $5 × (1 - SSP take rate, typically 15–20%) = ~$4 net eCPM. Understanding net vs gross CPM is critical in publisher yield analysis.",
    ],
  },
  data: {
    id: "data",
    label: "Data & Identity",
    shortDescription:
      "How signals about users and context are collected, stored, resolved across devices, and activated for targeting and measurement.",
    companies: ["LiveRamp", "The Trade Desk (UID2)", "Segment", "Snowflake", "Databricks", "Google Privacy Sandbox"],
    overview: [
      "Data is the fuel of ad tech. Every ad impression comes with signals: who is this user likely to be, what page are they on, what have they done before, what device are they using? These signals drive targeting (finding the right person), bidding (deciding how much to pay), and measurement (proving the ad worked). Without data pipelines working correctly, none of the economics of programmatic advertising function.",
      "<strong>First-party data</strong> is collected directly by a company from its own users — purchase history, app behavior, email engagement, loyalty records. It’s the most valuable and privacy-safe because the user has a direct relationship with the company. A retailer’s purchase history or a streaming service’s viewing data are prime examples. With third-party cookies dying, first-party data is now the industry’s primary targeting signal.",
      "<strong>Second-party data</strong> is first-party data from another company, shared directly (e.g., an airline sharing frequent-flyer profiles with a hotel chain they partner with). <strong>Third-party data</strong> is audience data aggregated and sold by data brokers (Oracle’s BlueKai, Experian, Acxiom, Lotame) — demographic segments, purchase-intent signals, behavioral categories. Third-party cookie-based data is collapsing due to browser restrictions and privacy laws.",
      "<strong>Privacy regulations</strong> have fundamentally reshaped data in ad tech. GDPR (EU, 2018) requires explicit consent before collecting or processing personal data — affecting any site with European visitors. CCPA (California, 2020) gives California residents the right to opt out of data sales. Apple’s ATT (App Tracking Transparency, 2021) requires iOS apps to ask permission before tracking users across apps — this effectively eliminated IDFA (Apple’s ad ID) as a targeting signal for most apps, devastating mobile advertising accuracy.",
      "<strong>Identifiers</strong> are how users are recognized across sessions and sites. Historically: third-party cookies (browser-set, now blocked by Safari/Firefox, being phased out by Chrome), IDFA (Apple’s Identifier for Advertisers), GAID (Google’s Advertising ID for Android). Post-cookie alternatives: <strong>UID2</strong> (The Trade Desk — hashed/encrypted email), <strong>RampID</strong> (LiveRamp — identity graph linking many ID types), <strong>Google Privacy Sandbox</strong> (browser-level Topics API for interest-based targeting without individual identifiers), first-party login IDs (publisher logins matched to advertiser CRMs).",
      "<strong>LiveRamp</strong> is the dominant identity infrastructure provider. Their <strong>RampID</strong> connects an advertiser’s CRM records (hashed emails, phone numbers) to publisher user IDs and DSP cookies — without exposing raw PII. Think of it as a translator: your email address becomes a RampID, and that RampID links to publisher IDs and DSP cookies so an advertiser can reach you across sites without the publisher or DSP knowing who you are. LiveRamp’s <strong>Authenticated Traffic Solution (ATS)</strong> lets publishers pass RampIDs in bid requests, giving DSPs user-level signals even without third-party cookies.",
    ],
    technical: [
      "<strong>Data pipeline architecture:</strong> Events from mobile SDKs (Firebase Analytics, Segment, Amplitude), web pixels (Google Tag Manager, first-party JavaScript tags), server-side SDKs, and partner data feeds all need to be ingested, stored, transformed, and activated. The modern stack: (1) <em>Collection</em>: events fire into a real-time stream — Kafka (self-hosted or Confluent Cloud), AWS Kinesis, or GCP Pub/Sub. (2) <em>Raw storage</em>: a streaming processor (Apache Flink, Spark Streaming) writes events to a data lake (S3 or GCS) in columnar Parquet/ORC format, partitioned by date. (3) <em>Transform</em>: orchestrated batch jobs (Apache Spark, dbt) clean, deduplicate, join to reference data, and apply business logic. (4) <em>Serve</em>: clean tables go into a warehouse (Snowflake, BigQuery, Redshift) for reporting and into a feature store for ML bidding.",
      "<strong>Audience segment architecture:</strong> User segments (e.g., ‘camping enthusiast’, ‘luxury car intender’, ‘lapsed purchaser’) are built from behavioral signals in the warehouse: visit frequency, category engagement, purchase recency/frequency/value (RFV), content consumption patterns. The segment membership is stored in a fast lookup store — Redis, DynamoDB, or Aerospike — keyed by user ID. At bid time, the DSP queries this store with a sub-millisecond latency requirement. You cannot run a SQL query at bid time; everything that touches the critical path must be pre-computed and stored in memory or SSD.",
      "<strong>Feature engineering for ML bidding models:</strong> DSP bid models consume pre-computed feature vectors for each impression. Typical features: hour-of-day, day-of-week, device type (mobile/desktop/tablet), OS, browser, content category (IAB taxonomy), advertiser × domain historical pCTR, user recency (days since last seen), segment membership (one-hot encoded or embedded), auction win-rate for this domain/SSP, viewability rate for this placement. The model outputs a bid price as a function of predicted value. Models are trained offline but inference runs in real-time, requiring tight latency budgets (<5ms for the model call itself).",
      "<strong>Identity resolution in practice:</strong> LiveRamp’s identity graph maintains a probabilistic and deterministic graph connecting: email hash (SHA-256) ↔ cookie IDs ↔ device IDs (IDFA, GAID) ↔ publisher login IDs ↔ household/postal data. When an advertiser uploads a CRM file (hashed emails), LiveRamp resolves each record against the graph to find matching cookies and device IDs across the web. This ‘audience onboarding’ process feeds segments into DSPs. The match rate — how many CRM records find a web identity — is a key metric, typically 40–60%.",
      "<strong>Data clean rooms (technical):</strong> LiveRamp Data Collaboration, Snowflake Data Clean Room, AWS Clean Rooms, and Google Ads Data Hub all follow the same pattern: two parties deposit their data into a shared compute environment governed by strict query controls. Neither party can see the other’s raw records — only aggregate query outputs are allowed (enforced by differential privacy thresholds and row minimums). Typical queries: ‘How many users in my advertiser audience saw ads from publisher X in the last 30 days?’ or ‘What was the purchase lift for users exposed to campaign Y vs control?’",
      "<strong>dbt (data build tool)</strong> is the dominant transformation layer for ad tech data warehouses. Teams write SELECT-based SQL models that dbt executes in the right dependency order. dbt also runs data quality tests (nulls, uniqueness, referential integrity), generates documentation, and creates a lineage graph. In an ad tech context, a typical dbt project has: source models (impressions, clicks, conversions from the lake), staging models (clean, typed), mart models (campaign reporting, audience segments, attribution) and downstream models for ML feature generation.",
      "<strong>Real-time vs batch in ad tech:</strong> Not all data needs to be real-time. Frequency cap state must be real-time (query on every bid). Segment membership can be near-real-time (updated hourly). Campaign pacing state must be near-real-time (updated every few seconds). Reporting aggregates can be batch (hourly, daily). Attribution models are typically batch (run daily over the prior day’s data). This tiered approach — mixing real-time (Kafka+Flink), near-real-time (micro-batch Spark), and batch (daily dbt runs) — is the standard architecture.",
    ],
  },
  "third-parties": {
    id: "third-parties",
    label: "3rd-Party Providers",
    shortDescription:
      "The specialist vendors that provide identity resolution, ad verification, brand safety, measurement, and fraud detection across the entire ecosystem.",
    companies: ["LiveRamp", "Integral Ad Science (IAS)", "DoubleVerify", "Nielsen", "Comscore", "Oracle Data Cloud", "Habu"],
    overview: [
      "The programmatic ecosystem depends on a web of specialist vendors providing data, identity, safety, and measurement services. No DSP, SSP, or publisher operates in isolation — they all integrate with verification partners, measurement vendors, and identity providers. Understanding these ‘third parties’ is essential to understanding how ad tech actually works end-to-end.",
      "<strong>LiveRamp</strong> (formerly Acxiom’s connectivity division) is the dominant identity infrastructure company. Their <strong>RampID</strong> is a pseudonymous identifier linking an advertiser’s CRM data to web/app identities across DSPs and publishers. Their <strong>Authenticated Traffic Solution (ATS)</strong> allows publishers to pass RampIDs in bid requests when a logged-in user is present, enabling DSPs to match advertiser audiences without third-party cookies. They also operate a data marketplace where brands can license first- and second-party data segments.",
      "<strong>Integral Ad Science (IAS)</strong> and <strong>DoubleVerify (DV)</strong> are the two leading ad verification vendors. They measure three critical things: (1) <em>Viewability</em> — was the ad actually seen by a human? (2) <em>Brand safety</em> — was the ad adjacent to content that could harm the brand? (3) <em>Invalid traffic (IVT) / fraud</em> — was the impression generated by a real human or a bot? Advertisers use these vendors to protect against paying for worthless or harmful impressions. Both companies offer pre-bid blocking (preventing bad impressions from being bid on at all) and post-bid measurement (verifying what actually happened).",
      "<strong>Data Management Platforms (DMPs)</strong> like Oracle’s BlueKai, Salesforce DMP (formerly Krux), and Lotame were the original third-party data middleware. They aggregated audience segments from publisher behavior, panel data, and offline data; advertisers activated these segments in DSPs. DMPs are declining as third-party cookies disappear — segments keyed on cookies don’t survive in cookieless environments. Customer Data Platforms (CDPs) like Segment (now Twilio), Tealium, and mParticle have largely replaced DMPs for first-party data management.",
      "<strong>Nielsen</strong> has been the TV measurement currency for decades — their C3/C7 ratings (viewership within 3 or 7 days of air) are the standard against which TV upfront deals are guaranteed. For digital, Nielsen DAR (Digital Ad Ratings) measures demographic delivery of online campaigns. <strong>Comscore</strong> offers an alternative, measuring content and ad audiences across TV, digital, and mobile. Both companies face disruption from data-rich alternatives like <strong>VideoAmp</strong> and <strong>iSpot.tv</strong> that use set-top box data and ACR data at census scale rather than statistical panels.",
      "<strong>Clean rooms</strong> (<a href=’/glossary?term=clean-room’>what is a clean room?</a>) have emerged as a privacy-safe way for two parties to combine their data without exposing raw records. LiveRamp Data Collaboration, Snowflake Data Clean Room, AWS Clean Rooms, Google Ads Data Hub all follow the same model: both parties deposit data into a neutral compute environment; only aggregated query results exit. Use cases: audience overlap planning (how many of my customers also visit your site?), attribution (which ad exposures drove conversions?), custom audience activation (build a targeting segment from our joint data).",
    ],
    technical: [
      "<strong>IAS and DoubleVerify pre-bid integration:</strong> Both vendors maintain lists of URLs, app bundles, and content categories with safety scores. These are integrated into DSP bidding via: (1) <em>Pre-bid segment syncing</em>: DSPs download IAS/DV blocking lists and check them during the user lookup phase of bidding; (2) <em>OpenRTB extensions</em>: bid requests can include content safety signals; (3) <em>Exchange integrations</em>: SSPs filter bid requests before sending to DSPs based on publisher-side IAS/DV configuration.",
      "<strong>Viewability measurement (technical):</strong> The MRC (Media Rating Council) defines viewability for display as 50% of pixels in-view for 1+ second; for video as 50% pixels in-view for 2+ continuous seconds. IAS and DV inject a JavaScript tag with the creative that uses the browser’s <em>Intersection Observer API</em> to measure what percentage of the creative’s bounding box is within the viewport, and for how long. In SafeFrame iframes (sandboxed environments), visibility is measured through the SafeFrame’s communication API. On iOS Safari, certain measurement approaches differ due to WKWebView restrictions.",
      "<strong>Invalid traffic (IVT) detection:</strong> IVT comes in two forms: GIVT (General Invalid Traffic — datacenter traffic, known bots, crawlers, clearly non-human patterns) and SIVT (Sophisticated Invalid Traffic — adware, infected browsers, domain spoofing, ad injection). Detection methods: behavioral anomaly detection (mouse movements, scroll depth, click timing, interaction entropy), device fingerprinting, IP reputation (known data center IPs), publisher domain verification (ads.txt, sellers.json), and session analysis (suspiciously fast page loads, no organic navigation). DoubleVerify estimates 5–10% of digital ad impressions are invalid.",
      "<strong>Ads.txt and sellers.json:</strong> Two IAB standards that combat domain spoofing. <em>Ads.txt</em> (Authorized Digital Sellers) is a text file publishers place at their domain root listing every SSP and exchange authorized to sell their inventory. DSPs and exchanges cross-reference ads.txt to verify bid requests come from authorized sellers. <em>Sellers.json</em> is the SSP-side complement — exchanges publish a file listing all publishers they represent. Together they create a verifiable supply chain, dramatically reducing domain spoofing fraud.",
      "<strong>Conversion API and server-side tracking:</strong> As browser restrictions block pixels (Safari’s ITP, Firefox’s ETP), all major platforms have released server-to-server conversion APIs: Meta’s Conversions API, Google’s Enhanced Conversions, TikTok’s Events API. Instead of a browser pixel firing, the advertiser’s server sends conversion data directly to the platform’s API — with hashed email/phone for matching. This improves match rates from ~60% (browser pixels) to ~90%+ and bypasses ad blockers entirely.",
      "<strong>Nielsen Digital Ad Ratings (DAR):</strong> Advertisers want to know ‘did I reach adults 25-54?’ not just ‘how many impressions did I serve?’ Nielsen DAR solves this by matching campaign exposure data (from publisher ad servers or the Nielsen measurement tag) to Nielsen’s panel of known-demographic users and their broader census data. The result: demographic delivery reports showing reach, frequency, and on-target percentage by age/gender. This is how TV buying metrics translate to digital — enabling cross-media planning against a consistent audience definition.",
      "<strong>Data marketplace mechanics:</strong> Oracle Data Cloud (formerly BlueKai) and Lotame maintain segment libraries built from: publisher partnerships (sites contribute hashed behavior in exchange for revenue share), panel surveys (users complete questionnaires, providing ground-truth demographics), data co-ops (multiple retailers pool purchase data, aggregated at the segment level), and offline data linkage (postal/address records matched to device IDs via identity graphs). Advertisers license segments at CPM rates that get passed through in the bid request as segment IDs. The DSP applies bid multipliers to impressions matching premium segments.",
    ],
  },
  "ad-serving-rtb": {
    id: "ad-serving-rtb",
    label: "Ad Serving & Real-Time Bidding",
    shortDescription:
      "How a single page load triggers a millisecond auction — and the technology of creatives, ad servers, OpenRTB, and the complete chain from request to rendered ad.",
    companies: ["Google CM360", "Google Ad Manager", "Flashtalking (Mediaocean)", "Sizmek (Amazon)", "FreeWheel (Comcast)", "Amazon Publisher Services"],
    overview: [
      "<strong>Real-time bidding (RTB)</strong> is the heartbeat of programmatic advertising. Every time you load a web page, open an app, or start a streaming video, ad slots in that content trigger auctions — each lasting less than 100 milliseconds. A page load might trigger dozens of parallel auctions, each independently choosing the best ad for that specific slot, for that specific user, at that specific moment.",
      "<strong>What is a creative?</strong> The creative is the actual ad content delivered to the user. Types: (1) <em>Display banner</em> — static image (PNG/JPEG) or animated HTML5 (a ZIP of HTML/CSS/JS following IAB’s AMPHTML or standard HTML5 spec); (2) <em>Video</em> — an MP4 file served via the VAST XML protocol; (3) <em>Native ad</em> — a headline, image, description, and URL assembled by the publisher’s own UI template to blend with surrounding content; (4) <em>Rich media</em> — expandable banners, interactive formats, or VPAID-wrapped video with JavaScript interactivity. HTML5 banners replaced Flash entirely around 2017.",
      "<strong>Ad servers</strong> are the systems responsible for storing, trafficking, and serving creatives to users. On the <em>buy side</em>, Google’s <strong>Campaign Manager 360 (CM360)</strong> — formerly DoubleClick Campaign Manager (DCM) — is the dominant tool used by agencies and advertisers. It stores creatives, applies targeting at serve-time, fires impression pixels, handles click-through redirects, and produces unified cross-platform reporting. On the <em>sell side</em>, <strong>Google Ad Manager (GAM)</strong> is the dominant publisher ad server, managing both direct-sold and programmatic inventory. <strong>Flashtalking</strong> (now part of Mediaocean) and <strong>Sizmek</strong> (acquired by Amazon) are CM360 alternatives.",
      "<strong>Dynamic Creative Optimization (DCO)</strong> generates personalized ad creative at serve time instead of pre-building every variant. A DCO system has a creative template with variable slots (headline, background, product image, CTA button). At serve time, a DCO server selects the best combination based on user data (weather, location, browsing history, CRM segment), assembles the creative, and returns it — all within the RTB timeline. This enables one campaign to effectively run thousands of relevant creative variants without manually trafficking each one.",
      "<strong>The OpenRTB protocol</strong> (maintained by IAB Tech Lab) is the standard JSON-over-HTTP API for programmatic auctions. When an SSP has an impression to sell, it formats a bid request per the OpenRTB spec and sends it to all connected DSPs. DSPs respond with bid responses. The SSP runs the auction and notifies the winner. OpenRTB defines the exact field names, data types, and enumerations used in these messages — it’s what makes different companies’ systems interoperable.",
      "<strong>Ad verification and safety at serve time:</strong> When a creative renders, it’s usually in a sandboxed iFrame (SafeFrame on open web) to prevent the creative’s JavaScript from accessing the parent page. Even so, ‘malvertising’ — malicious ads injecting code — is an ongoing threat. Ad quality controls: pre-review of creative HTML/JS by the exchange, real-time scanning for malicious JavaScript patterns, CDN hosting of creative assets (not direct from advertiser servers to avoid ad injection), and CSP (Content Security Policy) restrictions on what the iFrame can load.",
    ],
    technical: [
      "<strong>The complete RTB sequence with timing:</strong> T+0ms: User’s browser fetches a page. Prebid.js (or equivalent) detects eligible ad slots. T+1ms: Prebid sends bid requests to all configured SSP adapters simultaneously. Each adapter formats an OpenRTB request for its SSP. T+1–50ms: SSPs receive bid requests and fan them out to connected DSPs. T+50–80ms: Each DSP runs its bid pipeline (user lookup → campaign matching → model scoring → creative selection) and returns a bid response. T+80–100ms: SSP collects all bids, runs the auction, picks the winner. T+100ms: Prebid receives winning CPM from all SSPs, picks the highest, passes it to GAM. T+100–200ms: GAM compares against direct-sold campaigns, awards impression. T+200–400ms: Winner’s ad server (CM360 or direct) returns creative HTML/JS to the browser. Browser renders the creative. T+400ms+: Impression pixel fires; viewability measurement tag starts; tracking begins.",
      "<strong>OpenRTB bid request structure (key fields):</strong><br><code>{ id, imp:[{id, banner:{w,h,format}, video:{mimes,protocols,skip}, floor, floorCur}], site:{page,domain,cat,publisher:{id}}, app:{bundle,cat,publisher}, user:{id,buyeruid,geo:{lat,lon,country}}, device:{ua,ip,ifa,make,model,os}, regs:{gdpr,us_privacy,coppa}, ext:{prebid,schain} }</code><br>Key fields: <code>imp[].banner</code> or <code>imp[].video</code> define the format; <code>user.id</code> is the exchange’s user identifier; <code>device.ifa</code> is the device ad ID (IDFA/GAID); <code>regs</code> contains privacy consent flags; <code>schain</code> is the supply chain provenance object (sellers.json).",
      "<strong>OpenRTB bid response structure:</strong><br><code>{ id, seatbid:[{bid:[{id, impid, price, adm, nurl, lurl, adid, cid, crid, dealid, w, h, attr, cat}], seat}], cur }</code><br>Key fields: <code>bid.price</code> is the CPM bid; <code>bid.adm</code> is the ad markup (HTML/JS for display, VAST XML for video); <code>bid.nurl</code> is the win notification URL called when this bid wins; <code>bid.lurl</code> is the loss notification URL. Bid prices are in CPM (cost per thousand impressions), so a $5 CPM bid = $0.005 per impression.",
      "<strong>VAST XML structure (video ad serving template):</strong> A VAST document contains: <code>&lt;AdSystem&gt;</code> (ad server name), <code>&lt;Impression&gt;</code> URLs (fired when video starts loading), <code>&lt;Linear&gt;</code> containing: <code>&lt;Duration&gt;</code> (HH:MM:SS), <code>&lt;TrackingEvents&gt;</code> with URLs for events: <code>start</code>, <code>firstQuartile</code> (25%), <code>midpoint</code> (50%), <code>thirdQuartile</code> (75%), <code>complete</code> (100%), <code>pause</code>, <code>mute</code>, <code>skip</code>, <code>&lt;VideoClicks&gt;&lt;ClickThrough&gt;</code> (destination URL), <code>&lt;MediaFiles&gt;</code> (multiple MP4 URLs with different bitrates/resolutions). VAST 4.x added: <code>&lt;UniversalAdId&gt;</code> for creative deduplication, improved SSAI support, and separate audio ad handling.",
      "<strong>Creative trafficking in CM360:</strong> Flow: (1) Creative upload (HTML5 ZIP, MP4, or image); (2) Preview and QA in CM360’s preview tool; (3) Policy review (automated scanning + manual for sensitive categories); (4) Click-through URL assignment (with CM360 click tracker prepended for attribution); (5) Impression tag assignment; (6) Trafficking to placement — linking the creative to a campaign line item with targeting rules; (7) Creative rotation setup (even rotation, weighted, sequential, or A/B optimized). CM360 wraps the final creative call in a redirect chain: <code>CM360 impression URL → CM360 click tracker → Advertiser landing page</code>.",
      "<strong>Header bidding waterfall vs unified auction:</strong> In the old waterfall, GAM would first try its directly-sold campaigns, then call one network, wait for a response, then call another. With unified auction (GAM’s current mode), all demand — direct campaigns, programmatic demand from GAM’s own AdX, and header bidding demand (passed as key-values) — competes in a single auction. The winner is chosen by the highest net CPM across all demand types. This ensures that a $7 CPM header bidding bid beats a $5 CPM direct deal if the direct deal isn’t guaranteed (though guaranteed deals always win).",
      "<strong>First-price auction dynamics and bid shading:</strong> In a first-price auction, DSPs that bid truthfully (maximum willingness to pay) will consistently overpay — they’d win at $10 for an impression that might have cleared at $6. DSPs implement bid shading algorithms that predict the auction clearing price using historical win/loss data for this publisher/format/user combination, then shade bids down to that predicted price (e.g., bid $7 instead of $10). SSPs countered with floor price optimization — raising floors algorithmically to capture more of the DSP surplus. The equilibrium is an ongoing ML arms race between buyers and sellers.",
    ],
  },
  "measurement-currency": {
    id: "measurement-currency",
    label: "Measurement, Currency & Clean Rooms",
    shortDescription:
      "TV and digital measurement, upfronts, attribution models, clean rooms, pixels, and how we prove advertising actually worked.",
    companies: ["Nielsen", "VideoAmp", "iSpot.tv", "Comscore", "LiveRamp", "Snowflake", "Google Ads Data Hub"],
    overview: [
      "<strong>Measurement</strong> answers the most fundamental question in advertising: did it work? Without measurement, advertisers are spending blindly. The measurement ecosystem involves verifying that ads were seen (viewability), by the right people (demographic verification), and that they drove outcomes (attribution). Different media (TV, digital, CTV) have evolved different measurement systems that the industry is now trying to reconcile into cross-media measurement.",
      "<strong>Currency</strong> (<a href=’/glossary?term=currency’>what is currency?</a>) in media means the agreed-upon standard that buyers and sellers use to transact and guarantee delivery. In linear TV, <strong>Nielsen</strong> has been the dominant currency for 70+ years. A network guarantees ‘we will deliver 10 million adults 25-54’ using Nielsen’s panel-based ratings. If delivery falls short, the network issues make-goods — extra ad inventory to compensate. The currency standard is what makes guarantees possible.",
      "<strong>Alternative currencies</strong> have emerged to challenge Nielsen’s dominance. <strong>VideoAmp</strong> and <strong>iSpot.tv</strong> build audience measurement from set-top box data (from cable/satellite operators providing tuning logs) and ACR data (smart TVs identifying content on-screen) at near-census scale — millions of households, not thousands as in panels. This allows more granular demographic cuts, cross-screen measurement, and faster reporting. Major networks (NBC, Fox, CBS) ran parallel currency pilots starting in 2022.",
      "The <strong>upfronts</strong> (<a href=’/glossary?term=upfronts’>what are upfronts?</a>) are the annual TV ad sales market held each spring, where broadcast and cable networks present their upcoming season programming to agencies and advertisers. Up to 80% of a network’s prime-time inventory for the coming season is committed during upfronts at guaranteed CPMs. The contractual currency — the measurement product that defines delivery — must be agreed upon in the deal. Scatter market is the remaining inventory sold closer to airdate at market prices.",
      "<strong>Attribution</strong> (<a href=’/glossary?term=attribution’>what is attribution?</a>) connects ad exposures to business outcomes. Did seeing this ad lead to a purchase? Different models distribute credit differently: <em>last-click</em> (100% to the final ad before conversion), <em>first-click</em>, <em>linear</em> (equal credit to all touchpoints), <em>time-decay</em> (more credit to recent touches), <em>data-driven</em> (ML model estimating each touchpoint’s marginal contribution). No model is perfect — the fundamental problem is observational: you don’t know what would have happened without the ad.",
      "<strong>Incrementality testing</strong> is the gold standard for proving advertising effectiveness. Randomly split audiences into an exposed group (sees the ad) and a holdout group (shown a PSA or nothing). Measure conversion rates in both groups. The lift in conversion rate for the exposed group = incremental effect of the advertising. This is the only rigorous way to separate correlation from causation in attribution. It’s expensive (you give up revenue from the holdout) but statistically honest.",
      "<strong>Clean rooms</strong> (<a href=’/glossary?term=clean-room’>what is a clean room?</a>) enable measurement across walled gardens. Example: a retailer wants to know ‘how many of my customers who bought X also saw a YouTube ad in the 30 days before purchase?’ Google Ads Data Hub lets the retailer run this query inside Google’s secure environment — Google never shares user-level ad exposure data, the retailer never shares raw purchase records, and only an aggregate result exits (e.g., ‘12,000 of your 100,000 purchasers also saw YouTube ad campaign Y’).",
    ],
    technical: [
      "<strong>TV currency mechanics:</strong> Nielsen’s C3 and C7 ratings measure viewership of live TV + 3 days of DVR (C3) or 7 days of DVR (C7) within the ‘commercial pod’ (not the full program, but the actual commercial minutes). They’re derived from Nielsen’s ~40,000-household panel, extrapolated via statistical weighting to represent the national population. Each rating point = 1% of the target demographic. A 3.0 rating in adults 25-54 means 3% of all US adults 25-54 watched. Upfront deals are priced in CPP (cost per rating point) against the contracted currency.",
      "<strong>Set-top box and ACR data pipelines:</strong> VideoAmp and iSpot receive tuning data from cable/satellite operators: every channel change, every minute of viewing per household. ACR data (from smart TV manufacturers like Samsung, LG via Samba TV, or Vizio via Inscape) identifies content on screen by fingerprinting frames against a reference library. Both require household-to-demographic matching via postal/survey data. The pipeline: raw tuning events → household assignment → demographic linkage → content match → audience segment → reach/frequency calculation. Processing runs at scale (millions of households) using Spark and Databricks.",
      "<strong>Digital attribution pipeline:</strong> Conversion pixel (JavaScript tag or Conversions API call) fires when a user completes a desired action (purchase, form fill, app install). The pixel includes: timestamp, advertiser campaign/line-item ID, conversion value, and user identifiers (cookie, hashed email, device ID). Attribution logic joins this conversion event to prior impression and click events for the same user (via identity resolution), then applies the chosen attribution model. This runs as a batch job (daily or hourly) in the data warehouse. Output: credited impressions/clicks per campaign, attributed revenue, ROAS.",
      "<strong>Media Mix Modeling (MMM) vs. Multi-Touch Attribution (MTA):</strong> MMM uses aggregate sales and media spend data (no individual-level data) across weeks/months to estimate the contribution of each channel to overall sales using regression or Bayesian modeling. It’s privacy-safe but has low granularity (channel-level, not impression-level). MTA uses individual-level impression/click/conversion data to assign fractional credit to each touchpoint. MTA is more actionable but requires user-level data that’s increasingly restricted. Industry practice: use both — MMM for strategic budget allocation, MTA for in-campaign optimization.",
      "<strong>Viewability and attention measurement:</strong> IAB and MRC define viewability as: display ads — 50% of pixels in-view for 1 continuous second; video ads — 50% in-view for 2 continuous seconds. IAS and DoubleVerify measure this via JavaScript Intersection Observer in the browser. ‘Attention’ goes further: attention measurement vendors (Adelaide, Lumen, TVision) measure not just whether an ad could be seen but whether users actually engaged with it — eye-tracking, dwell time, interaction rates. Attention metrics are emerging as the next generation of quality signals.",
      "<strong>VAST tracking events and measurement (technical):</strong> The video player loads a VAST XML response. For each tracking URL in <code>&lt;TrackingEvents&gt;</code>, the player makes an HTTP GET request at the right moment: <code>start</code> when the video begins, <code>firstQuartile</code> when 25% plays, etc. These HTTP calls hit ad server and measurement vendor URLs simultaneously (via VAST wrapper chains or direct URLs). The measurement vendor’s server records: timestamp, creative ID, campaign ID, user ID, player state (muted, visible, full-screen), and quartile. This is how impression-level video completion rates, mute rates, and skip rates are calculated for billing and optimization.",
      "<strong>Google Ads Data Hub (ADH) and clean room queries:</strong> ADH is Google’s clean room for YouTube and Display advertising. Advertisers can write BigQuery SQL queries against Google’s event data joined to their own data, but with privacy protections enforced: minimum aggregation thresholds (no reporting on fewer than 50 users), no row-level data export, no user-level joins that would reveal individual identity. Example ADH query: <code>SELECT campaign_id, COUNT(DISTINCT user_id) as reach FROM adh.google_ads_impressions WHERE event_time BETWEEN ‘2024-01-01’ AND ‘2024-01-31’ AND campaign_id = 12345</code> — returns aggregate reach without exposing individual user data.",
    ],
  },
};

const examples: Record<ExampleId, Example> = {
  instagram: {
    id: "instagram",
    label: "Instagram Feed Ad",
    surface: "Mobile social feed (Meta's closed ecosystem)",
    story: [
      "You're scrolling through your Instagram feed and see a sponsored post for outdoor gear from a brand you've never visited. How did this ad find you? You probably searched for 'hiking trails' in Google Maps last week, liked an outdoor photo on Instagram, and watched a camping video on Facebook. Meta's system connected these signals.",
      "Instagram ads are fundamentally different from open-web programmatic ads. Meta runs its own closed ad marketplace — advertisers buy through <strong>Meta Ads Manager</strong> (or the Meta API), not through an open exchange. There are no third-party DSPs bidding on Instagram inventory via OpenRTB. Meta owns the entire stack: the data, the auction, the ad serving, and the measurement.",
      "Meta's targeting is powered by its social graph and behavioral data. Unlike contextual targeting (showing outdoor ads on an outdoor site), Meta can reach you on any content — news, food posts, celebrity gossip — because they're targeting the person, not the context. Their first-party data (what you like, share, comment on, dwell over, search, and buy through Instagram Shopping) is unmatched in the social world.",
      "The 'Sponsored' label appears automatically — every paid post in the feed is marked. Advertisers can run feed photos, carousels (swipe through multiple images), Reels, Stories, and video. Each format has different engagement patterns and CPMs. Reels typically command premium CPMs because engagement rates are high.",
    ],
    technicalFlow: [
      "<strong>Data collection layer:</strong> Every interaction on Instagram and Facebook feeds a real-time event stream. When you scroll past a post, watch a video (and for how long), like, comment, or click — all of this is captured with device context (iOS vs Android, session ID, location if permitted). Meta's SDK also runs on millions of third-party apps and websites via the Meta Pixel and Facebook SDK, extending their data collection far beyond their own surfaces.",
      "<strong>Audience building (Meta's first-party graph):</strong> Meta's machine learning builds audience signals from: interest inference (from content you engage with), behavioral categories (frequent traveler, small business owner, fitness enthusiast), life events (recently moved, anniversary coming up), connections (friends' purchases and brand relationships), and Custom Audiences (advertisers uploading their own customer email lists, matched to Meta accounts via SHA-256 hash). Lookalike Audiences extend a brand's customer list to statistically similar Meta users.",
      "<strong>Meta's ad auction — not OpenRTB:</strong> Meta runs its own proprietary auction, fundamentally different from RTB. When your feed needs an ad, Meta's ranking system scores every eligible campaign that targets you. The score is: <code>Bid × Estimated Action Rate × User Value × Ad Quality Score</code>. Estimated Action Rate is Meta's ML prediction of whether you'll click, convert, or engage. Ad Quality Score captures how many people have hidden or complained about the ad. The highest-scoring ad wins the slot.",
      "<strong>Advertiser setup in Meta Ads Manager:</strong> Advertisers create: <em>Campaign</em> (objective: awareness, traffic, conversions, app installs, catalog sales) → <em>Ad Set</em> (audience targeting, placement, budget, schedule, optimization event) → <em>Ad</em> (creative: image/video, headline, body text, CTA button, destination URL). The 'Advantage+ Audience' option lets Meta's ML override the advertiser's targeting to find better-converting audiences. Advantage+ Shopping Campaigns (ASC) hand almost all decisions to Meta's automation.",
      "<strong>Creative delivery and the Meta Pixel:</strong> When you see the ad and the impression registers, Meta fires an internal impression event. If you click the 'Shop now' CTA, you're directed to the advertiser's website. The Meta Pixel (a JavaScript snippet on the advertiser's site) fires events: <code>PageView</code>, <code>ViewContent</code>, <code>AddToCart</code>, <code>Purchase</code> — sending hashed email/phone back to Meta via the browser, or via the <strong>Meta Conversions API</strong> (server-to-server, bypassing browser restrictions). These purchase events feed Meta's optimization algorithm, which learns which users to show the ad to next.",
      "<strong>Reporting and measurement:</strong> Meta's attribution window (how long after an ad view a conversion is credited to the ad) defaults to 7-day click / 1-day view — meaning conversions within 7 days of a click, or 1 day of an impression, are attributed to the ad. This is more generous than Google's default and causes inflated revenue attribution when comparing platforms. Third-party measurement (NCS, Nielsen MRC studies, Meta's own Conversion Lift tests) provides a more objective view of incremental impact.",
    ],
  },
  youtube: {
    id: "youtube",
    label: "YouTube Pre-Roll Video Ad",
    surface: "Video player — skippable/non-skippable ads before content",
    story: [
      "You tap a YouTube video and an ad plays before your content. Some ads can be skipped after 5 seconds; others play through entirely. You may see a companion banner in the sidebar or below the video, and on mobile you might see an overlay. These formats — and when they appear — are part of a carefully designed system balancing advertiser demand, creator revenue, and user experience.",
      "YouTube is one of the largest ad platforms in the world, generating over $30 billion annually. Unlike open-web programmatic, YouTube's inventory is primarily sold through Google Ads and <strong>Google DV360</strong> — Google's enterprise buying platform. While YouTube does have a limited amount of programmatic inventory accessible via third-party DSPs through Google's AdX exchange, the vast majority of YouTube buys happen inside Google's ecosystem.",
      "YouTube ads are deeply integrated with Google's first-party audience data — your Google Search history, Gmail content, Google Maps behavior, and YouTube watch history all feed targeting. This makes YouTube uniquely powerful for intent-based targeting: you can target people who recently searched for 'buy running shoes' and then serve them a Nike video ad on YouTube.",
      "Ad formats matter: <em>TrueView in-stream</em> (skippable after 5s) charges advertisers only when viewers watch 30s or click — so if 70% of people skip, the advertiser pays for 30% of impressions. <em>Non-skippable in-stream</em> (15s max) guarantees full views but at a premium CPM. <em>Bumpers</em> are 6-second non-skippable ads, ideal for brand recall. <em>Discovery ads</em> appear in search results and recommendations (pay per click, not view).",
    ],
    technicalFlow: [
      "<strong>Ad request flow:</strong> When you tap a YouTube video, the YouTube player makes an ad request to Google's ad decision system before the video buffer completes. The request includes: your Google Account ID (if logged in), device type and OS, video ID and channel, content category (IAB taxonomy), location (from device GPS or IP), previous ad exposure (frequency data), and format eligibility (can this player show skippable video?). This is an internal Google API call, not public OpenRTB.",
      "<strong>Google's internal auction:</strong> Google's ad system runs an auction across all campaigns targeting you on this video. Ranking factors: maximum CPV bid (cost-per-view) or CPM bid, <em>expected engagement rate</em> (predicted completion rate, skip rate, and click probability based on user history), and ad quality signals. The system also enforces frequency caps across Google properties — if you've seen a campaign's ad 3 times today, it's suppressed. The result is a single winning ad (or for pre-roll pods, a sequence of 2-3 ads in CTV).",
      "<strong>VAST delivery:</strong> YouTube's ad server returns a VAST XML response to the player. The VAST contains: the video creative URL (MP4 from Google's CDN), tracking event URLs (impression, firstQuartile, midpoint, thirdQuartile, complete, skip), and the click-through URL. The YouTube player loads the MP4, begins playback, and fires each tracking pixel at the right moment. For skippable ads, the player shows a countdown ('Skip in 5...') and captures the skip event if triggered.",
      "<strong>Targeting options in Google Ads / DV360:</strong> Demographic (age, gender, parental status, household income — inferred from Google data); Affinity audiences (TV watchers, fitness buffs, gamers — from YouTube watch history); In-market audiences (people actively researching a product category — from Search behavior); Customer Match (upload a CRM email list; Google matches to YouTube accounts); Placement targeting (specific YouTube channels, specific videos, specific categories); Topic targeting (broad content categories); Keyword targeting (contextual: show this ad on videos about camping).",
      "<strong>Brand lift and measurement:</strong> Google offers <em>Brand Lift</em> studies built into YouTube campaigns: a survey is shown to a randomly selected holdout group (not exposed to the ad) and the exposed group. Survey questions: 'Which of these brands have you heard of?', 'Which brand would you consider for [category]?' The delta in positive responses between exposed and control groups measures brand awareness lift, ad recall lift, and consideration lift. This is surveyed at scale, directly in YouTube. For conversion measurement, the Google Tag or Conversions API sends purchase data back, and Google's attribution models credit YouTube exposure.",
      "<strong>YouTube on CTV (Smart TVs and streaming sticks):</strong> YouTube on a Smart TV or streaming stick operates differently. No third-party cookies exist on TV screens. Targeting relies on Google Account (if logged in), IP-based household data, and device-based identifiers. Ad pods on TV YouTube can include 2-3 ads sequentially. The player uses SSAI-like logic server-side to stitch ad breaks. Frequency capping across CTV is harder — a separate device means the platform may not recognize you've already seen the ad 5 times today on your phone.",
      "<strong>Creator revenue sharing:</strong> YouTube shares roughly 55% of ad revenue with the creator of the video hosting the ad. If a $5 CPM pre-roll plays before a creator's video and the ad impression is $0.005, YouTube keeps $0.00225 and the creator gets $0.00275. At scale (millions of views), this is significant income for creators — and aligns creator incentives with ad-friendly content. Creators can manually restrict which ad categories appear on their content.",
    ],
  },
  "web-display": {
    id: "web-display",
    label: "Web Display Banner",
    surface: "Banner ad on a publisher site — via open programmatic",
    story: [
      "You open a news article and see a banner ad at the top of the page, plus one in the sidebar. These are display ads served via open programmatic — the dominant ad format for the open web. Unlike Instagram or YouTube, these ads went through a competitive real-time auction involving dozens of companies before landing on your screen.",
      "The publisher (the news site) sells this banner slot through a programmatic supply chain. They've integrated an SSP like Magnite or PubMatic and enabled header bidding with Prebid.js. When you load the page, an auction fires — and within 100-200ms, a winning advertiser's banner appears in the slot.",
      "Why do you see an ad for outdoor gear on a cooking website? Because modern display targeting is person-based, not context-based. The DSP bidding on this impression knows (from your cookie or device ID) that you've recently browsed outdoor gear sites, and bids higher on your impression regardless of the current page's content. Retargeting (reaching users who already visited a brand's site) is the most common display tactic.",
      "The same ad creative might appear across thousands of different publisher sites, all via the same programmatic pipes. The advertiser sets up one campaign in their DSP (The Trade Desk, DV360, etc.), and it automatically buys the most relevant impressions across the open web — news, blogs, recipe sites, sports sites — wherever you go.",
    ],
    technicalFlow: [
      "<strong>Page load and Prebid.js initiation:</strong> The publisher's HTML includes the Prebid.js library and a GPT (Google Publisher Tag) script. When the browser parses the page, Prebid.js runs before the main page content loads. It detects eligible ad slots (defined by size, placement name, and position) and immediately fires bid requests to all configured SSP adapters (e.g., Magnite, PubMatic, OpenX, Index Exchange, AppNexus). These requests go out in parallel — all simultaneously, not sequentially.",
      "<strong>SSP bid request fan-out:</strong> Each SSP receives the bid request from Prebid.js. The SSP enriches it: adds publisher data (floor prices, deal IDs, content category, buyer restrictions), resolves the user's identity (if a cookie or device ID maps to known segments), and fans it out to all connected DSPs via OpenRTB. A large SSP like Magnite might have 100+ DSP connections receiving bid requests for this one impression opportunity.",
      "<strong>DSP bid evaluation:</strong> The Trade Desk (as an example DSP) receives the OpenRTB bid request. In 40–50ms, it: (1) Looks up the user ID in its segment store — finds the user is in 'hiking enthusiasts' and 'recent outdoor gear browser' segments; (2) Matches active campaigns — finds an outdoor gear brand campaign with targeting rules that match (segment, geo: US, device: desktop, domain: allowed); (3) Scores the bid — ML model predicts 2% click probability × $4 value per click = $0.08 CPM bid × 1000 / click probability adjustment = $5 CPM bid; (4) Returns OpenRTB bid response with $5 CPM and the HTML/JS creative markup.",
      "<strong>Auction and winner selection:</strong> After the Prebid.js timeout (e.g., 700ms), Prebid collects all SSP responses. The highest net CPM wins — say The Trade Desk's $5 CPM via Magnite. Prebid passes this to Google Ad Manager as a key-value: <code>hb_pb = 5.00, hb_bidder = magnite, hb_adid = [creative_id]</code>. GAM compares this against any direct-sold campaigns. If a guaranteed direct deal exists at $7 CPM, that wins instead. Otherwise, the $5 programmatic bid wins.",
      "<strong>Creative delivery:</strong> GAM calls back to Magnite's server for the winning creative. Magnite notifies The Trade Desk (win notification via the NURL — win notification URL in the bid response). The Trade Desk charges the advertiser at the winning price. The creative HTML/JS renders in a SafeFrame iFrame on the publisher's page. The creative's JavaScript loads the banner image from a CDN, fires CM360's impression pixel, and triggers the IAS/DoubleVerify viewability measurement tag.",
      "<strong>Viewability measurement:</strong> An IAS (or DV) JavaScript tag bundled with the creative uses the browser's Intersection Observer API to monitor the banner's visibility. It calculates: what percentage of the banner's pixels are within the browser viewport, and for how long. At 50% pixels visible for 1 second, the impression is marked 'viewable' in the reporting. IAS reports the viewability percentage to both the advertiser (for billing disputes) and the publisher (to show the quality of their placements). Impressions measured as non-viewable can be refunded or discounted.",
      "<strong>Retargeting mechanics:</strong> The advertiser's site has a CM360 pixel (or first-party pixel) that fires when you visit specific pages. This creates a retargeting audience: a list of cookie/device IDs of users who visited. The DSP (The Trade Desk) syncs this audience — via cookie matching with each exchange, or via LiveRamp's identity graph for cookieless environments. When the user visits any site covered by the exchange, the DSP recognizes the cookie, matches to the retargeting audience, and bids higher. This is why you see ads for products you recently browsed, across seemingly unrelated websites.",
    ],
  },
  search: {
    id: "search",
    label: "Google Search Text Ad",
    surface: "Sponsored results on Google Search — intent-driven",
    story: [
      "You type 'buy trail running shoes' into Google and see 3-4 text ads above the organic results, labeled 'Sponsored'. These ads are fundamentally different from display ads: you came to them with explicit intent. The search query is the most powerful targeting signal in advertising — it tells the advertiser exactly what you want, right now, at the moment you're ready to act.",
      "Google Search Ads are the backbone of Google's $200B+ annual ad revenue. Advertisers (shoe brands, retailers, outdoor gear companies) bid on keywords — specific words and phrases. When your query matches their keywords, they compete in an auction to appear in the sponsored positions. The advertiser with the best combination of bid and quality wins.",
      "Unlike display or social ads, search ads require you to initiate the interaction. You searched for shoes; the ads responded. This 'pull' dynamic — vs display's 'push' — is why search typically has higher click-through rates and conversion rates. Someone searching 'buy trail running shoes near me' is likely much closer to purchasing than someone scrolling Instagram who sees a shoe ad.",
      "Google Search Ads are text-based (headline + description + display URL), though they're increasingly augmented with Shopping ads (product photos + prices), Local ads (map results), and Performance Max campaigns that span Search, Display, YouTube, and Shopping simultaneously.",
    ],
    technicalFlow: [
      "<strong>Query processing and keyword matching:</strong> When you submit a search, Google's ad system receives the query and attempts to match it to active keyword bids from all advertisers. Match types control how loosely a query can match: <em>Exact match</em> ([trail running shoes] matches only 'trail running shoes'); <em>Phrase match</em> ('trail running shoes' matches 'buy trail running shoes online'); <em>Broad match</em> (trail running shoes might match 'jogging sneakers' or 'athletic footwear'). Google's ML expands broad match to semantically similar queries based on historical conversion data.",
      "<strong>Quality Score (QS):</strong> QS is a 1–10 score assigned to each keyword in each advertiser's account. Its three components: (1) <em>Expected CTR</em> — how likely is this ad to be clicked when shown for this query, based on historical CTR data for this keyword/ad combination? (2) <em>Ad Relevance</em> — how well does the ad copy match the searcher's intent and the keyword? (3) <em>Landing Page Experience</em> — does the landing page the ad links to provide relevant, useful content? All three are evaluated by Google's ML systems. QS affects Ad Rank (position) and actual CPC.",
      "<strong>Ad Rank and the auction:</strong> <code>Ad Rank = CPC bid × Quality Score × auction-time factors</code>. Auction-time factors include: user device (mobile vs desktop), location, time of day, search query (not just keyword), ad extensions expected CTR, and competition. An advertiser with QS 8 and $2 bid will outrank an advertiser with QS 4 and $3 bid: 8×$2=$16 > 4×$3=$12. This is by design — Google incentivizes advertisers to create relevant, high-quality ads, not just outbid competitors.",
      "<strong>CPC calculation (Vickrey second-price logic):</strong> You don't pay your maximum bid — you pay the minimum amount required to maintain your Ad Rank above the next competitor. <code>CPC = (Next competitor's Ad Rank / Your Quality Score) + $0.01</code>. If competitor B has Ad Rank 10 and your QS is 8, you pay (10/8)+$0.01 = $1.26. This incentivizes truthful bidding (bid your true value; you'll pay less than your max). In practice, Google's system is more complex with multiple competitors, but the principle holds.",
      "<strong>Responsive Search Ads (RSAs):</strong> Advertisers provide up to 15 headlines and 4 descriptions. Google's ML tests different combinations and shows the combination predicted to perform best for each specific query and user. Google might show 'Lightweight Trail Shoes' + 'Free 2-Day Shipping' + 'Shop Now' for a mobile user near a store, but 'Expert Reviews' + 'Compare All Brands' for a desktop user in research mode. Over time, Google locks in the best-performing combinations as 'pinned' positions. RSAs replaced the older ETA (Expanded Text Ads) format entirely in 2022.",
      "<strong>Smart Bidding and conversion tracking:</strong> Modern search advertising relies on <em>Smart Bidding</em> — Google's ML-powered automated bid strategies. Options: <em>Target CPA</em> (optimize bids to hit a target cost per acquisition); <em>Target ROAS</em> (optimize for return on ad spend — 'spend $100, return $500 in revenue'); <em>Maximize Conversions</em> (spend budget to get as many conversions as possible); <em>Maximize Conversion Value</em> (maximize total purchase value). These require conversion tracking: the Google Tag or Conversions API sends purchase events back to Google, telling the system which clicks led to sales. Without conversion data, Smart Bidding cannot optimize.",
      "<strong>Google's data advantage in Search:</strong> Google knows what you've searched before, what you've clicked, your location history (Maps), and your Gmail content (aggregated for ad purposes). This lets their ad auction be more accurate than keyword matching alone. The system considers: have you already converted on this advertiser's site (suppress retargeting)? Are you researching (early funnel) or ready to buy (late funnel)? What's your device's geo relative to store locations? This contextual richness, combined with billions of daily queries, makes Google Search the highest-intent ad surface in existence.",
    ],
  },
  "video-player": {
    id: "video-player",
    label: "CTV / Streaming Video Ad",
    surface: "Connected TV, streaming services, and long-form video players",
    story: [
      "You're watching a show on Peacock, Pluto TV, or Hulu — an ad-supported streaming service — and a 15-second ad plays during the commercial break. Unlike YouTube, you can't skip it. Unlike linear TV, it was targeted specifically to your household based on streaming and potentially purchase data. Welcome to Connected TV (CTV) — the fastest-growing segment in advertising.",
      "CTV refers to internet-connected television screens: Smart TVs (Samsung, LG, Vizio), streaming sticks (Roku, Amazon Fire TV, Apple TV), gaming consoles (PlayStation, Xbox), and any other device delivering streaming video to a TV screen. CTV combines TV's large-screen impact with digital's targeting precision — a combination traditional TV buying cannot achieve.",
      "Ad-supported streaming services (AVODs — Ad-Supported Video on Demand) like Peacock, Pluto TV, Tubi (Fox), Freevee (Amazon), and Hulu (Disney) sell ad inventory programmatically alongside direct-sold deals. Ad breaks are designed for the platform: commercial pods are typically 2-3 ads per break (shorter than linear TV's 6-8), and ads cannot be skipped. Average completion rates for CTV ads exceed 95% — far higher than web video.",
      "The holy grail of CTV is matching TV ads to outcomes: did the household that saw this ad on their TV screen then buy the product? This requires linking TV viewership data to purchase data — a challenge requiring identity resolution (matching device IDs across TV and commerce platforms) and clean room technology.",
    ],
    technicalFlow: [
      "<strong>SSAI vs CSAI — the key technical choice:</strong> <em>Server-Side Ad Insertion (SSAI)</em>: The ad is stitched into the video stream on the server before delivery. The player receives one continuous video segment, making it impossible for ad blockers to detect the ad boundary. Impression tracking fires from the ad server, not the client. Used by: most premium streaming services (Peacock, Hulu, Paramount+). <em>Client-Side Ad Insertion (CSAI)</em>: The player requests ads separately via VAST and renders them client-side, similar to web video. Easier to implement but vulnerable to ad blockers and creates buffering at ad/content transitions. Used by: YouTube on desktop, many web video players.",
      "<strong>SSAI technical pipeline:</strong> The publisher's content CDN delivers video chunks (HLS or DASH manifests with .ts or .mp4 segments). The SSAI ad server (Google DAI, FreeWheel, AWS Elemental MediaTailor) intercepts the content manifest, detects ad break markers (SCTE-35 cue tones embedded in the broadcast signal), and replaces content segments with pre-transcoded ad segments from the ad CDN. The result: a single seamless manifest that alternates between content and ad segments at the right breakpoints. The player has no idea it's watching stitched content.",
      "<strong>SCTE-35 cue markers:</strong> SCTE-35 is the broadcast standard for signaling ad breaks in video streams. A SCTE-35 message embedded in the video signal says: 'ad break starts in 2 seconds, duration 120 seconds.' The SSAI system intercepts this cue, makes an ad decision request (to get the ads to fill the 120-second break), and stitches the ad segments into the stream. This replaces the linear TV cable system where a local affiliate would insert local ads at the same cue point.",
      "<strong>Programmatic CTV ad buying:</strong> CTV inventory is bought through OpenRTB (similar to display) with video-specific extensions. Key differences: longer auction timeouts (2-5 seconds vs 100ms for display, because SSAI needs to pre-fetch content); app-based inventory (no domain, uses app bundle ID); device-based IDs (no cookies — Roku device ID, Samsung PSID, etc.); deal-forward ecosystem (most premium inventory is Private Marketplace or Programmatic Guaranteed, not open auction). Major CTV SSPs: SpotX (Magnite), FreeWheel (Comcast), Index Exchange, and IRIS.TV (contextual targeting in CTV).",
      "<strong>ACR data (Automatic Content Recognition):</strong> Smart TV manufacturers (Samsung, LG, Vizio, Roku) can identify exactly what content is displayed on the TV screen using ACR technology — matching pixel samples against a reference database of known content (fingerprinting). With user consent, this creates a viewing record: what channels, shows, and ads a household sees. ACR data is enormously valuable: it enables 'reach extension' (reach linear TV viewers with digital ads) and TV attribution (did households that saw the linear TV ad later visit the website or purchase?). Companies like Samba TV and Alphonso specialize in ACR data.",
      "<strong>CTV identity and frequency capping challenges:</strong> Unlike cookies or mobile ad IDs, CTV lacks a universal device ID. Each platform has its own ID: Roku has the RIDA, Amazon Fire TV has the Fire TV Ad ID, Samsung has PSID. These don't link to each other or to mobile/desktop identities without a separate identity graph. This makes cross-screen frequency capping extremely difficult — the same household may see an ad 10 times across their Roku, Samsung TV, and phone without the advertiser knowing it's the same people. Identity resolution vendors (LiveRamp, The Trade Desk via UID2, or household IP-based matching) help bridge these gaps.",
      "<strong>Measurement and attribution for CTV:</strong> Household-level IP matching is the most common CTV attribution method: if a household IP saw a CTV ad and then a conversion event (website visit, purchase) comes from the same or nearby IP, it's attributed. Pixel-based measurement doesn't work on TV screens. ACR data plus purchase data (from retailers, credit card networks) can show lift in store visits or purchases for households exposed to a CTV campaign vs control. DSPs like The Trade Desk offer CTV attribution dashboards using their household identity graph. The challenge: IP addresses change, shared networks, and VPNs all degrade match accuracy.",
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
  "header-bidding": {
    id: "header-bidding",
    term: "Header Bidding",
    category: "Marketplace",
    shortDefinition:
      "A technique that lets publishers auction inventory to many buyers simultaneously before calling their ad server.",
    definition: [
      "Header bidding (also called pre-bid) is an advanced programmatic advertising technique where publishers offer their ad inventory to multiple demand sources (SSPs, exchanges, DSPs) simultaneously — rather than calling them sequentially in a waterfall. The highest bid wins and is passed to the publisher's ad server.",
      "It's called 'header bidding' because the auction code runs in the HTML <head> of the page, before the main page content and ad server calls. Publishers implement it using an open-source JavaScript library called Prebid.js. Server-side header bidding (Prebid Server) moves the auction logic to a server to reduce page latency.",
      "Header bidding dramatically increased publisher revenue (often 30–60% uplift) by ensuring that the true market value of every impression is discovered, not just the value from whichever demand source happened to be first in the old waterfall. It also gave publishers more control and transparency over who buys their inventory.",
    ],
    related: ["ssp", "rtb", "inventory"],
  },
  creative: {
    id: "creative",
    term: "Ad Creative",
    category: "Marketplace",
    shortDefinition:
      "The actual ad content delivered to users — images, HTML5 animations, video, or native formats.",
    definition: [
      "A creative is the ad unit itself — what the user sees and interacts with. Creative types: (1) Display: static images (PNG/JPG) or HTML5 animated banners (a ZIP of HTML/CSS/JS assets); (2) Video: MP4 files served via VAST XML, ranging from 6-second bumpers to 30-second spots; (3) Native: headlines, images, and descriptions assembled by the publisher's UI template to blend with surrounding content; (4) Rich media: expandable banners, interstitials, or video overlays with JavaScript interactivity.",
      "Creatives are trafficked (configured) in ad servers like Google Campaign Manager 360 (CM360) or Meta Ads Manager. Trafficking involves: uploading assets, setting click-through URLs, assigning impression tracking pixels, defining targeting rules, and configuring creative rotation. Creatives go through policy review before serving — exchanges and publishers have automated and manual systems to reject malicious, deceptive, or policy-violating ads.",
      "Dynamic Creative Optimization (DCO) systems generate personalized creatives at serve time by assembling components (background, headline, product image, CTA) based on user data, reducing the need to manually traffic hundreds of variants.",
    ],
    related: ["vast", "dco", "pixel"],
  },
  cpm: {
    id: "cpm",
    term: "CPM (Cost per Mille)",
    category: "Marketplace",
    shortDefinition:
      "The price of 1,000 ad impressions — the standard unit of pricing in programmatic advertising.",
    definition: [
      "CPM stands for Cost per Mille (Latin for thousand). It's the standard pricing unit in programmatic advertising: the price an advertiser pays for 1,000 impressions of their ad. A $5 CPM means the advertiser pays $5 for every 1,000 times their ad is shown, or $0.005 per impression.",
      "CPMs vary enormously by format, audience quality, and context. Open-web display banners: $1–5 CPM. Video pre-roll: $10–25 CPM. Connected TV: $25–50 CPM. LinkedIn B2B targeting: $60–100 CPM. Premium publisher direct deals: $20–50+ CPM. Factors driving higher CPMs: audience targeting precision, viewability, brand-safe context, engaged format (video vs display), and low supply vs high demand.",
      "Related metrics: CPC (cost per click = CPM / CTR × 1000), CPA (cost per acquisition), ROAS (return on ad spend). Publishers report eCPM (effective CPM) — actual revenue per thousand impressions, accounting for fill rate and floor prices. Net CPM is what the publisher receives after SSP/exchange fees (typically 15–20% take rate).",
    ],
    related: ["rtb", "yield", "inventory"],
  },
  "open-rtb": {
    id: "open-rtb",
    term: "OpenRTB",
    category: "Marketplace",
    shortDefinition:
      "The industry standard API specification for real-time bidding between exchanges and DSPs.",
    definition: [
      "OpenRTB (Open Real-Time Bidding) is a JSON-over-HTTP API specification developed and maintained by the IAB Tech Lab. It defines the exact format for bid requests (sent by exchanges to DSPs) and bid responses (returned by DSPs to exchanges), enabling interoperability between different companies' systems without custom integrations.",
      "A bid request JSON object contains: imp[] (impression array — slot dimensions, format, floor price), site/app (URL, domain, content category, publisher ID), user (ID, geo, segment list), device (user agent, IP, device type, mobile ad ID), and regs (GDPR consent, CCPA flags, COPPA). A bid response contains: seatbid[].bid[] with price (CPM), adm (ad markup — HTML or VAST XML), nurl (win notification URL), and creative attributes.",
      "OpenRTB also defines supporting standards: ads.txt (authorized digital sellers — publisher-side verification), sellers.json (seller verification — exchange-side), and SupplyChain object (schain — tracing the full path from publisher to exchange). These anti-fraud measures make the RTB supply chain more transparent and verifiable.",
    ],
    related: ["rtb", "dsp", "ssp"],
  },
  pmp: {
    id: "pmp",
    term: "Private Marketplace (PMP)",
    category: "Marketplace",
    shortDefinition:
      "An invitation-only RTB auction where a publisher offers inventory to specific buyers at negotiated terms.",
    definition: [
      "A Private Marketplace (PMP) is a curated RTB auction where a publisher invites specific DSPs or buyers to bid on a subset of their inventory, typically at a negotiated floor price. The publisher creates a Deal ID — a unique identifier that unlocks access to the PMP — and shares it with the buyer. When the buyer's DSP receives a bid request containing that Deal ID, it knows to prioritize this impression and bid accordingly.",
      "PMPs sit between open auction (anyone can bid, no preferred access) and programmatic guaranteed (fixed price, guaranteed volume). They give publishers control over who buys their premium inventory while maintaining the efficiency of real-time bidding. Common use cases: news site offering its homepage inventory only to premium automotive brands; streaming service offering 'first-pod' positions to select buyers at a $30 CPM floor.",
      "From a DSP perspective, Deal IDs are configured as 'deals' in the campaign setup — a line item can target a specific Deal ID to prioritize that publisher relationship and ensure the buyer gets access to the curated inventory pool. Deal KPIs are tracked separately from open auction performance.",
    ],
    related: ["rtb", "inventory", "yield"],
  },
  dco: {
    id: "dco",
    term: "Dynamic Creative Optimization (DCO)",
    category: "Marketplace",
    shortDefinition:
      "A system that assembles personalized ad creatives in real time from template components and user data.",
    definition: [
      "Dynamic Creative Optimization (DCO) replaces static one-size-fits-all ad creatives with real-time personalized assembly. A DCO system has: a creative template (background, headline zone, product image zone, CTA button zone) and a decision engine that selects the best component for each impression based on user signals: location, weather, browsing history, CRM segment, device type, time of day.",
      "Example: A car brand's banner template has 5 headline options, 8 car model images, and 3 CTAs. DCO serves a hybrid SUV image with 'Perfect for mountain roads' headline to a user in Colorado who browsed SUV reviews, while serving a sedan image with 'City-ready efficiency' to a New York user who browsed commuter cars. All from one campaign setup, without manually trafficking 40 creative variants.",
      "DCO vendors (Flashtalking, Celtra, Smartly.io) integrate with DSPs and ad servers. The DCO engine receives the user/context data at serve time, makes component decisions (often using ML trained on past creative performance), assembles the creative, and returns it in the VAST or display ad format. DCO is particularly powerful for e-commerce (product recommendation creatives), travel (destination-based messaging), and retail (local store promotions).",
    ],
    related: ["creative", "pixel"],
  },
  "brand-safety": {
    id: "brand-safety",
    term: "Brand Safety",
    category: "Measurement",
    shortDefinition:
      "Ensuring ads don't appear next to content that could harm the advertiser's brand reputation.",
    definition: [
      "Brand safety is the practice of preventing ads from appearing adjacent to content that conflicts with an advertiser's values or that could damage their brand reputation. Risk categories: adult content, violent content, hate speech, illegal activity, misinformation, drug/alcohol content, and political content. A family-friendly cereal brand doesn't want its ad appearing next to graphic news content; a luxury brand doesn't want to appear on low-quality, clickbait sites.",
      "Brand safety is measured and enforced by verification vendors: Integral Ad Science (IAS) and DoubleVerify (DV). Both maintain content classification databases covering millions of URLs and app bundles. They use ML classifiers to categorize page content in real time. Their classifications map to the IAB's Content Taxonomy and GARM (Global Alliance for Responsible Media) brand safety floor definitions.",
      "Technically, brand safety works at two points: (1) Pre-bid blocking: the DSP receives a brand safety segment list (blocked URLs, blocked app bundles) from IAS/DV and skips bidding on those impressions entirely; (2) Post-bid measurement: a tag fires with the creative, evaluates the actual page content at render time, and flags violations. 'Brand suitability' (beyond 'unsafe/safe' binary) is the next evolution — matching brand messaging to content sentiment and context.",
    ],
    related: ["viewability", "pixel"],
  },
  viewability: {
    id: "viewability",
    term: "Viewability",
    category: "Measurement",
    shortDefinition:
      "A measurement of whether an ad had the opportunity to be seen by a real user.",
    definition: [
      "Viewability measures whether an ad was actually visible on screen, versus just served (loaded in a browser but perhaps below the fold, in a hidden tab, or instantly scrolled past). The MRC (Media Rating Council) defines viewability standards: display ads must be at least 50% of pixels in-view for 1+ continuous second; video ads at least 50% in-view for 2+ continuous seconds.",
      "Viewability is measured by JavaScript tags (from IAS or DoubleVerify) that use the browser's Intersection Observer API to calculate what percentage of the ad's bounding box is within the browser viewport, and for how long. In SafeFrame iframes (sandboxed creative environments), visibility data is passed via the SafeFrame communication API. Mobile in-app viewability uses OMID (Open Measurement SDK) — a standardized SDK that enables consistent measurement across mobile environments.",
      "Industry average viewability for display banners hovers around 50-60%; video is higher (70-80%). Viewability data is used for: (1) Advertiser optimization — pausing or reducing bids on low-viewability placements; (2) Publisher benchmarking — comparing placements to optimize layout; (3) Billing disputes — advertisers may negotiate to only pay for viewable impressions (vCPM pricing). Beyond viewability, 'attention' metrics (eye-tracking, interaction, dwell time) are the emerging frontier.",
    ],
    related: ["pixel", "brand-safety"],
  },
  ctv: {
    id: "ctv",
    term: "Connected TV (CTV)",
    category: "Marketplace",
    shortDefinition:
      "Internet-connected television screens delivering streaming video — the fastest-growing ad channel.",
    definition: [
      "Connected TV (CTV) refers to any TV screen connected to the internet and capable of streaming video: Smart TVs (Samsung, LG, Vizio, Sony), streaming sticks and boxes (Roku, Amazon Fire TV, Apple TV, Chromecast), and gaming consoles. OTT (Over-the-Top) refers to video delivered over the internet bypassing traditional cable/satellite — CTV is OTT on TV screens specifically.",
      "CTV advertising combines linear TV's impact (large screen, lean-back viewing, high attention) with digital's targeting precision and measurability. Advertisers can target CTV viewers by interests, demographics, purchase history, and even TV viewing behavior (ACR data). Average ad completion rates for CTV exceed 95%, compared to 50-60% for mobile video, because CTV ads in premium streams are typically non-skippable.",
      "CTV is bought programmatically through OpenRTB (with video extensions) via specialized CTV SSPs (SpotX/Magnite, FreeWheel, Index Exchange, Telaria). It's also bought through direct deals with streaming services (Peacock, Paramount+, Hulu). Major DSPs (The Trade Desk, Amazon DSP, DV360) all have CTV-specific buying capabilities and audience matching that bridges CTV exposure to digital behavior.",
    ],
    related: ["ssai", "vast", "rtb"],
  },
  ssai: {
    id: "ssai",
    term: "SSAI (Server-Side Ad Insertion)",
    category: "Marketplace",
    shortDefinition:
      "Stitching ads into a video stream server-side, creating a seamless content and ad experience.",
    definition: [
      "Server-Side Ad Insertion (SSAI) is the technique of inserting ads into a video stream on the server before delivering it to the player. Unlike Client-Side Ad Insertion (CSAI) where the player requests ads separately via VAST, SSAI creates a single continuous video stream that alternates between content and ads — completely transparent to the player and immune to ad blockers.",
      "How SSAI works: The streaming platform's ad server intercepts the content delivery manifest (HLS or DASH), detects ad break cue points (SCTE-35 markers in broadcast streams), makes ad decisions (real-time auction or pre-fetched based on user/content data), retrieves ad video files from advertisers, transcodes them to match content quality settings, and stitches the ad segments into the manifest. The player receives one manifest with seamless transitions between content and ad segments.",
      "SSAI vendors: Google Dynamic Ad Insertion (DAI), FreeWheel (Comcast), AWS Elemental MediaTailor, Brightcove, JW Player. SSAI is standard for premium streaming services (Peacock, Hulu, Disney+, Paramount+) because it delivers the highest ad completion rates and prevents ad avoidance. The trade-off vs CSAI: more complex infrastructure, and post-impression measurement must come from server-side logs rather than client-side pixels.",
    ],
    related: ["ctv", "vast"],
  },
  "frequency-cap": {
    id: "frequency-cap",
    term: "Frequency Cap",
    category: "Marketplace",
    shortDefinition:
      "A limit on how many times a specific user sees the same ad within a given time period.",
    definition: [
      "A frequency cap limits how many times an advertiser's ad is shown to the same user in a defined period (e.g., 3 times per day, 10 times per week, 20 times per campaign). Without frequency capping, a single user could be shown the same ad dozens of times, wasting budget and creating a negative user experience (ad fatigue). Most DSPs and ad servers support frequency caps at the campaign, line item, and creative level.",
      "Technically, frequency is tracked by storing impression counts per user ID in a fast distributed cache (Redis, Aerospike, or Memcached) with a time-to-live (TTL) matching the cap window. At bid time, the DSP reads the current frequency count from the cache; if the user has already reached the cap, the campaign is excluded from bidding for this impression. The cache must handle millions of lookups per second with sub-millisecond latency.",
      "Cross-device and cross-platform frequency capping is the hard problem. Your phone, laptop, and TV may have different IDs, so without an identity graph linking them, you might see the same ad 3 times on each device (9 total instead of 3). Solutions: UID2 or RampID linking IDs across surfaces, household IP matching for CTV, and deterministic ID graphs from publishers with login data. Frequency capping failures lead to massive wasted spend and user frustration.",
    ],
    related: ["dsp", "rtb", "identity-graph"],
  },
  "programmatic-guaranteed": {
    id: "programmatic-guaranteed",
    term: "Programmatic Guaranteed (PG)",
    category: "Marketplace",
    shortDefinition:
      "A deal type combining guaranteed impression volumes and fixed pricing with programmatic targeting and execution.",
    definition: [
      "Programmatic Guaranteed (PG) is a deal type that combines the certainty of a traditional direct deal (fixed CPM, guaranteed volume) with the efficiency and targeting capabilities of programmatic technology. Instead of manually trafficking a campaign in an ad server, both sides use their DSP/SSP platforms to execute the deal programmatically — but at negotiated terms rather than through open auction.",
      "How PG differs from open auction and PMP: Open auction = anyone bids, market price, no volume guarantee. PMP = invited buyers, floor price, no volume guarantee. PG = one buyer, fixed CPM, guaranteed volume (e.g., 1 million impressions at $15 CPM). The publisher must deliver the agreed volume or the deal underdelivers. The buyer gets audience targeting precision of programmatic buying applied to premium inventory at a guaranteed scale.",
      "PG is preferred by large advertisers buying premium inventory at scale: a CPG brand securing 10 million CTV impressions on Peacock for a product launch, or an automotive brand guaranteeing 5 million viewable video impressions on a premium news site. The DSP handles creative trafficking, audience targeting, and reporting; the SSP handles delivery pacing and ensures the guaranteed volume is met.",
    ],
    related: ["pmp", "rtb", "inventory"],
  },
  "quality-score": {
    id: "quality-score",
    term: "Quality Score",
    category: "Marketplace",
    shortDefinition:
      "Google's measure of ad relevance and user experience, used to determine ad position and cost in Search auctions.",
    definition: [
      "Quality Score (QS) is Google's 1–10 rating for each keyword in a Google Search campaign, measuring how relevant the keyword, ad copy, and landing page are to the user's search intent. A high QS means Google predicts the ad will be highly relevant and useful to searchers. QS directly affects Ad Rank (position in search results) and the actual CPC paid — higher QS = better position at lower cost.",
      "Three components: (1) Expected CTR — how likely is this keyword-ad combination to be clicked, based on historical performance? Evaluated relative to the position the ad would appear in. (2) Ad Relevance — how closely the ad copy relates to the keyword's intent. Does the ad's headline contain the keyword or synonyms? (3) Landing Page Experience — is the landing page relevant, fast, mobile-friendly, and transparent? Google's crawlers evaluate landing pages and consider user bounce rates and engagement signals.",
      "A QS of 7+ is considered good; 8-10 is excellent and qualifies for Ad Rank bonuses. QS below 4 may result in ads not showing at all (below minimum Ad Rank threshold) or paying penalty premiums. Improving QS: create tightly themed ad groups (one keyword theme per ad group), write ad copy that contains the keyword, build dedicated landing pages matching the ad's promise, and improve page speed and mobile experience.",
    ],
    related: ["rtb", "attribution"],
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

  const companiesHtml =
    topic.companies && topic.companies.length
      ? [
          "<div class='company-section'>",
          "  <div class='company-section-label'>Key companies in this space</div>",
          "  <div class='company-chips'>",
          topic.companies.map((c) => `    <span class='company-chip'>${c}</span>`).join("\n"),
          "  </div>",
          "</div>",
        ].join("\n")
      : "";

  const deepDiveHtml =
    topic.deepDive && topic.deepDive.length
      ? [
          "<details class='deep-dive-section'>",
          "  <summary>Deep dive: advanced technical details</summary>",
          "  <ul class='topic-bullets'>",
          topic.deepDive.map((line) => `    <li>${line}</li>`).join("\n"),
          "  </ul>",
          "</details>",
        ].join("\n")
      : "";

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
    "            <a class='phone-header-icon' href='/glossary' aria-label='Glossary' style='text-decoration:none;font-size:0.7rem;'>Glossary</a>",
    "          </header>",
    "          <div class='phone-body'>",
    `            <h1 class='ecosystem-title'>${topic.label}</h1>`,
    `            <p class='ecosystem-subtitle'>${topic.shortDescription}</p>`,
    companiesHtml,
    "            <div class='topic-section-heading'>Overview</div>",
    "            <ul class='topic-bullets'>",
    overviewItems,
    "            </ul>",
    renderTopicFakeAd(topicId),
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
    "            <p class='ecosystem-subtitle'>How this part of the ecosystem shows up in schemas, pipelines, services, and code.</p>",
    "            <div class='topic-section-heading'>Technical Details</div>",
    "            <ul class='topic-bullets'>",
    technicalItems,
    "            </ul>",
    deepDiveHtml,
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
    `  <title>${example.label} – End-to-end ad tech breakdown</title>`,
    "  <meta name='description' content='End-to-end view of how this ad is targeted, auctioned, served, and measured.' />",
    "  <style>",
    homeStyles,
    "  </style>",
    "</head>",
    "<body>",
    "  <div class='app-shell'>",
    "    <div class='canvas'>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>What you see &amp; why</h2>",
    "        <article class='phone'>",
    "          <header class='phone-header'>",
    "            <a class='phone-header-icon' href='/' aria-label='Back to ecosystem overview'>◀</a>",
    `            <div class='phone-header-center'>${example.label}</div>`,
    "            <a class='phone-header-icon' href='/glossary' style='text-decoration:none;font-size:0.7rem;'>Glossary</a>",
    "          </header>",
    "          <div class='phone-body'>",
    `            <h1 class='ecosystem-title'>${example.label}</h1>`,
    `            <p class='ecosystem-subtitle'><strong>Surface:</strong> ${example.surface}</p>`,
    "            <div class='topic-section-heading'>The User Experience</div>",
    "            <ul class='topic-bullets'>",
    story,
    "            </ul>",
    "            <div class='topic-section-heading'>Technical Flow — Step by Step</div>",
    "            <p class='ecosystem-subtitle'>Follow the path from impression opportunity to rendered ad to measurement event.</p>",
    "            <ul class='topic-bullets'>",
    technicalFlow,
    "            </ul>",
    renderExampleDiagram(exampleId),
    renderExampleReferences(exampleId),
    "          </div>",
    "        </article>",
    "      </section>",
    "      <section class='canvas-column'>",
    "        <h2 class='canvas-heading'>Ad surface &amp; data flow</h2>",
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

  .company-section {
    margin: var(--space-md) 0 var(--space-sm);
  }

  .company-section-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .company-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .company-chip {
    border-radius: 999px;
    border: 1px solid #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 3px 9px;
  }

  .callout-box {
    margin: var(--space-sm) 0;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f0fdf4;
    border-left: 3px solid #16a34a;
    font-size: 0.8rem;
    color: #14532d;
    line-height: 1.5;
  }

  .topic-bullets li code,
  .topic-bullets code {
    font-family: "SF Mono", "Fira Code", "Consolas", monospace;
    font-size: 0.76rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 1px 5px;
    color: #0f172a;
  }

  .glossary-also-see {
    margin-top: var(--space-sm);
    font-size: 0.75rem;
    color: var(--text-soft);
  }

  .glossary-also-see a {
    color: var(--accent-strong);
    text-decoration: none;
    margin-right: 4px;
  }

  .deep-dive-section {
    margin-top: var(--space-md);
    border-top: 1px dashed var(--border-subtle);
    padding-top: var(--space-sm);
  }

  .deep-dive-section summary {
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--accent-strong);
    cursor: pointer;
    padding: 4px 0;
  }

  .deep-dive-section ul {
    margin-top: var(--space-sm);
    padding-left: 1.1rem;
    display: grid;
    gap: 6px;
    font-size: 0.82rem;
    color: var(--text-soft);
    line-height: 1.55;
  }

  .topic-section-heading {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent-strong);
    margin: var(--space-md) 0 var(--space-xs);
  }

  /* ── Fake Ad System ── */
  .fake-ad-container {
    margin: var(--space-md) 0;
    border-radius: 12px;
    border: 1px dashed #d4d4d8;
    overflow: visible;
    position: relative;
  }

  .fake-ad-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 10px;
    background: #f9fafb;
    border-bottom: 1px dashed #e5e7eb;
  }

  .fake-ad-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #9ca3af;
    font-weight: 600;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 1px 5px;
  }

  .fake-ad-audit-btn {
    font-size: 0.68rem;
    color: var(--accent-strong);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-family: inherit;
  }

  .fake-ad-audit-btn:hover {
    color: #1d4ed8;
  }

  /* Banner ad */
  .fake-banner-ad {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #ffffff;
    border-radius: 0 0 12px 12px;
  }

  .fake-banner-logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    flex-shrink: 0;
  }

  .fake-banner-content {
    flex: 1;
    min-width: 0;
  }

  .fake-banner-headline {
    font-size: 0.78rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
    line-height: 1.3;
  }

  .fake-banner-body {
    font-size: 0.7rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .fake-banner-cta {
    flex-shrink: 0;
    background: #0284c7;
    color: #f9fafb;
    border-radius: 999px;
    padding: 5px 10px;
    font-size: 0.72rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  /* Native ad */
  .fake-native-ad {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    background: #ffffff;
    border-radius: 0 0 12px 12px;
  }

  .fake-native-image {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    background: linear-gradient(135deg, #e0f2fe, #bae6fd);
    flex-shrink: 0;
  }

  .fake-native-text {
    flex: 1;
  }

  .fake-native-headline {
    font-size: 0.78rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 3px;
    line-height: 1.3;
  }

  .fake-native-body {
    font-size: 0.7rem;
    color: #6b7280;
    line-height: 1.4;
    margin-bottom: 4px;
  }

  .fake-native-cta {
    font-size: 0.68rem;
    color: var(--accent-strong);
    font-weight: 600;
  }

  /* Search ad */
  .fake-search-ad {
    padding: 10px 12px;
    background: #ffffff;
    border-radius: 0 0 12px 12px;
  }

  .fake-search-ad-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;
  }

  .fake-search-ad-tag {
    font-size: 0.65rem;
    color: #16a34a;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .fake-search-headline {
    font-size: 0.82rem;
    font-weight: 600;
    color: #1d4ed8;
    margin-bottom: 2px;
    line-height: 1.3;
  }

  .fake-search-url {
    font-size: 0.68rem;
    color: #16a34a;
    margin-bottom: 4px;
  }

  .fake-search-body {
    font-size: 0.72rem;
    color: #374151;
    line-height: 1.4;
  }

  /* Video ad */
  .fake-video-ad {
    background: #0f172a;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }

  .fake-video-player {
    position: relative;
    height: 110px;
    background: radial-gradient(circle at center, #1e3a5f 0, #0f172a 70%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fake-video-overlay {
    text-align: center;
    color: #f9fafb;
  }

  .fake-video-play {
    font-size: 1.5rem;
    margin-bottom: 4px;
    opacity: 0.8;
  }

  .fake-video-title {
    font-size: 0.72rem;
    color: #e5e7eb;
    max-width: 200px;
    line-height: 1.3;
  }

  .fake-video-badge {
    position: absolute;
    bottom: 8px;
    left: 10px;
    font-size: 0.64rem;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.85);
    color: #e5e7eb;
  }

  .fake-video-meta {
    padding: 8px 12px 10px;
  }

  .fake-video-advertiser {
    font-size: 0.7rem;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 3px;
  }

  .fake-video-desc {
    font-size: 0.68rem;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 6px;
  }

  .fake-video-timeline {
    height: 3px;
    background: #1e293b;
    border-radius: 999px;
    overflow: hidden;
  }

  .fake-video-progress {
    width: 25%;
    height: 100%;
    background: #0ea5e9;
  }

  /* Audio ad */
  .fake-audio-ad {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    background: linear-gradient(135deg, #0f172a, #1e1b4b);
    border-radius: 0 0 12px 12px;
    align-items: center;
  }

  .fake-audio-icon {
    font-size: 1.6rem;
    color: #818cf8;
    flex-shrink: 0;
  }

  .fake-audio-content {
    flex: 1;
  }

  .fake-audio-headline {
    font-size: 0.78rem;
    font-weight: 600;
    color: #e5e7eb;
    margin-bottom: 2px;
    line-height: 1.3;
  }

  .fake-audio-body {
    font-size: 0.68rem;
    color: #94a3b8;
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .fake-audio-wave {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 16px;
    margin-bottom: 4px;
  }

  .fake-audio-bar {
    width: 3px;
    border-radius: 2px;
    background: #818cf8;
    animation: audioWave 0.8s ease-in-out infinite alternate;
  }

  .fake-audio-bar:nth-child(1) { height: 40%; animation-delay: 0s; }
  .fake-audio-bar:nth-child(2) { height: 80%; animation-delay: 0.1s; }
  .fake-audio-bar:nth-child(3) { height: 60%; animation-delay: 0.2s; }
  .fake-audio-bar:nth-child(4) { height: 100%; animation-delay: 0.3s; }
  .fake-audio-bar:nth-child(5) { height: 75%; animation-delay: 0.4s; }
  .fake-audio-bar:nth-child(6) { height: 50%; animation-delay: 0.5s; }
  .fake-audio-bar:nth-child(7) { height: 90%; animation-delay: 0.6s; }
  .fake-audio-bar:nth-child(8) { height: 35%; animation-delay: 0.7s; }

  @keyframes audioWave {
    from { transform: scaleY(0.4); }
    to { transform: scaleY(1); }
  }

  .fake-audio-advertiser {
    font-size: 0.64rem;
    color: #64748b;
  }

  /* Audit overlay */
  .ad-audit-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .ad-audit-panel {
    background: #ffffff;
    border-radius: 18px;
    max-width: 520px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 60px rgba(0,0,0,0.35);
  }

  .ad-audit-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 18px 18px 14px;
    border-bottom: 1px solid #e5e7eb;
    gap: 10px;
  }

  .ad-audit-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2px;
  }

  .ad-audit-subtitle {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .ad-audit-close {
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    width: 28px;
    height: 28px;
    cursor: pointer;
    font-size: 0.75rem;
    color: #6b7280;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ad-audit-body {
    padding: 16px 18px 20px;
  }

  .ad-audit-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  }

  .ad-audit-col {
    flex: 1 1 120px;
  }

  .ad-audit-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #9ca3af;
    margin-bottom: 2px;
  }

  .ad-audit-value {
    font-size: 0.8rem;
    font-weight: 600;
    color: #111827;
  }

  .ad-audit-cpm {
    color: #16a34a;
    font-size: 1rem;
  }

  .ad-audit-section-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #9ca3af;
    margin: 12px 0 6px;
    font-weight: 600;
  }

  .ad-audit-signals {
    padding-left: 1.1rem;
    display: grid;
    gap: 4px;
    font-size: 0.78rem;
    color: #374151;
    line-height: 1.45;
  }

  .ad-audit-why {
    font-size: 0.8rem;
    color: #374151;
    line-height: 1.55;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .ad-audit-auction {
    font-size: 0.78rem;
    color: #374151;
    line-height: 1.5;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 10px 12px;
  }
`;

type FakeAdFormat = "banner" | "native" | "search" | "video" | "audio";

type FakeAdAudit = {
  format: FakeAdFormat;
  advertiser: string;
  headline: string;
  body: string;
  cta: string;
  cpm: string;
  dsp: string;
  ssp?: string;
  targetingSignals: string[];
  whyYou: string;
  auctionWinner: string;
  dealType: string;
};

const fakeAds: Record<string, FakeAdAudit> = {
  "banner-buy-side": {
    format: "banner",
    advertiser: "The Trade Desk",
    headline: "Run smarter campaigns. One platform, all channels.",
    body: "Buy display, video, audio, and CTV from a single DSP. Reach the right audience across the open internet.",
    cta: "Start a free trial",
    cpm: "$8.42",
    dsp: "The Trade Desk (self-serve)",
    ssp: "PubMatic",
    targetingSignals: ["Content: buy-side/DSP article", "Contextual: ad technology", "Behavioral: recently visited adtech content", "Device: desktop browser"],
    whyYou: "This ad appeared because you are reading about Demand-Side Platforms — a highly relevant audience for a DSP vendor. The Trade Desk placed a contextual campaign targeting pages with IAB category 'Advertising Technology' and bid $8.42 CPM via PubMatic's open auction. The bid won because the contextual match scored high in their ML model.",
    auctionWinner: "First-price open auction, $8.42 CPM (floor was $2.00)",
    dealType: "Open Auction (Programmatic)",
  },
  "banner-sell-side": {
    format: "banner",
    advertiser: "Magnite",
    headline: "Maximize your publisher revenue. Header bidding, simplified.",
    body: "Magnite's unified auction connects your inventory to 1000+ demand sources. Increase yield by 40%.",
    cta: "Request a demo",
    cpm: "$12.15",
    dsp: "Xandr (Microsoft)",
    ssp: "Index Exchange",
    targetingSignals: ["Content: SSP / header bidding article", "Contextual: publisher technology", "Job title segment: Ad Operations, Publisher", "Company size: mid-market publisher"],
    whyYou: "You're reading about Supply-Side Platforms, making you a high-value prospect for another SSP (Magnite) trying to win publisher clients. Xandr DSP ran this on behalf of Magnite, targeting IAB 'Publisher Tools' content. The $12.15 CPM reflects the high value of reaching ad operations professionals.",
    auctionWinner: "Private Marketplace Deal (Deal ID: MGN-PUB-TECH-2024), $12.15 CPM floor",
    dealType: "Private Marketplace (PMP)",
  },
  "native-data": {
    format: "native",
    advertiser: "Snowflake",
    headline: "How top ad tech companies structure their data pipelines",
    body: "Learn how leading DSPs and SSPs use Snowflake Data Cloud for real-time bidding features, attribution, and audience activation.",
    cta: "Read the guide →",
    cpm: "$22.50",
    dsp: "Google DV360",
    ssp: "TripleLift (native specialist)",
    targetingSignals: ["Content: data pipelines, data lake, warehouse", "Behavioral: visited Snowflake.com, attended data summit", "Lookalike: matched to Snowflake's known customer CRM (RampID)", "Device: desktop, work hours"],
    whyYou: "You're reading about data pipelines and warehouses — Snowflake's core value proposition. Google DV360 ran this native ad through TripleLift (which specializes in native format ads that blend with editorial content). The $22.50 CPM is elevated because it's targeting a B2B enterprise audience (data engineers, architects) using LiveRamp audience matching.",
    auctionWinner: "Programmatic Guaranteed deal with content site, $22.50 CPM fixed",
    dealType: "Programmatic Guaranteed (PG)",
  },
  "search-rtb": {
    format: "search",
    advertiser: "Amazon Web Services",
    headline: "OpenRTB on AWS: Sub-10ms bid decisioning at scale",
    body: "Run your DSP bidding engine on AWS Graviton. Handle 2M+ QPS with DynamoDB for sub-millisecond user lookups. Free architecture review.",
    cta: "Explore ad tech on AWS",
    cpm: "$45.00 (search CPC equiv)",
    dsp: "Google Ads (Search)",
    targetingSignals: ["Query: 'OpenRTB', 'real-time bidding', 'DSP architecture'", "Audience: in-market for cloud infrastructure", "Device: desktop, US timezone", "Remarketing: visited AWS ad tech page"],
    whyYou: "This is a Google Search-style ad that would appear if you searched for 'OpenRTB tutorial' or 'real-time bidding architecture'. AWS bid on keywords matching ad tech engineering intent. Their Quality Score is high (relevant landing page + strong historical CTR). Ad Rank: QS 8 × $8 max CPC = 64. They won the top position.",
    auctionWinner: "Search auction: Ad Rank 64 (QS 8 × $8 max CPC). Actual CPC: $6.20.",
    dealType: "Google Search Auction (intent-driven, keyword bid)",
  },
  "video-measurement": {
    format: "video",
    advertiser: "Nielsen",
    headline: "One number. Every screen.",
    body: "Nielsen ONE cross-media measurement — unified reach and frequency across TV, streaming, digital, and social. The currency of media.",
    cta: "See Nielsen ONE →",
    cpm: "$35.00",
    dsp: "The Trade Desk (CTV buy)",
    ssp: "Magnite (SpotX CTV)",
    targetingSignals: ["Content category: measurement, TV currency, attribution", "Household segment: ad tech professional household", "CTV device: streaming app user", "Frequency: first exposure to Nielsen campaign (cap: 3/week)"],
    whyYou: "This 15-second video ad would appear mid-roll while watching ad tech conference content or educational video. Nielsen bought CTV inventory through The Trade Desk targeting 'media measurement' content and 'advertising professional' household segments. At $35 CPM, CTV commands premium pricing for video completion rates >95%.",
    auctionWinner: "PMP deal via SpotX CTV exchange, $35 CPM floor. Delivered via SSAI — stitched into the stream server-side.",
    dealType: "CTV Private Marketplace via SSAI",
  },
  "audio-data": {
    format: "audio",
    advertiser: "Segment (Twilio)",
    headline: "Your first-party data platform",
    body: "Collect, clean, and activate customer data across every channel. Segment is the CDP powering the world's fastest-growing companies.",
    cta: "Start free",
    cpm: "$18.00",
    dsp: "Amazon DSP (audio buy via Amazon Music/podcasts)",
    targetingSignals: ["Content: data engineering, identity, CDPs", "Behavioral: podcast listener, tech topics", "Amazon segment: searched 'customer data platform' on Amazon", "Daypart: weekday morning (commute listening)"],
    whyYou: "This 30-second audio ad plays during a data engineering podcast. Amazon DSP bought it because they can uniquely target listeners based on Amazon search behavior — you searched for 'CDP tools' recently. Audio CPMs are lower than video ($18 vs $35+) because there's no visual component, but completion rates are high (no skip button during podcast).",
    auctionWinner: "Open auction on Amazon DSP audio marketplace, $18.00 CPM",
    dealType: "Programmatic Audio (Amazon DSP)",
  },
};

const renderFakeAdAuditPopover = (auditKey: string): string => {
  const ad = fakeAds[auditKey];
  if (!ad) return "";
  const signals = ad.targetingSignals.map((s) => `<li>${s}</li>`).join("");
  return [
    `<div class='ad-audit-overlay' id='audit-${auditKey}' aria-hidden='true' role='dialog' aria-label='Ad audit: how this ad was chosen'>`,
    "  <div class='ad-audit-panel'>",
    "    <div class='ad-audit-header'>",
    "      <div>",
    "        <div class='ad-audit-title'>Ad Audit — How this ad got here</div>",
    `        <div class='ad-audit-subtitle'>${ad.advertiser} · ${ad.format.charAt(0).toUpperCase() + ad.format.slice(1)} Ad</div>`,
    "      </div>",
    `      <button class='ad-audit-close' onclick="document.getElementById('audit-${auditKey}').setAttribute('aria-hidden','true');document.getElementById('audit-${auditKey}').style.display='none'">✕</button>`,
    "    </div>",
    "    <div class='ad-audit-body'>",
    "      <div class='ad-audit-row'>",
    "        <div class='ad-audit-col'>",
    "          <div class='ad-audit-label'>DSP</div>",
    `          <div class='ad-audit-value'>${ad.dsp}</div>`,
    "        </div>",
    ad.ssp ? `        <div class='ad-audit-col'><div class='ad-audit-label'>SSP / Exchange</div><div class='ad-audit-value'>${ad.ssp}</div></div>` : "",
    "        <div class='ad-audit-col'>",
    "          <div class='ad-audit-label'>Winning CPM</div>",
    `          <div class='ad-audit-value ad-audit-cpm'>${ad.cpm}</div>`,
    "        </div>",
    "        <div class='ad-audit-col'>",
    "          <div class='ad-audit-label'>Deal Type</div>",
    `          <div class='ad-audit-value'>${ad.dealType}</div>`,
    "        </div>",
    "      </div>",
    "      <div class='ad-audit-section-label'>Targeting signals that matched you</div>",
    `      <ul class='ad-audit-signals'>${signals}</ul>`,
    "      <div class='ad-audit-section-label'>Why this ad found you</div>",
    `      <p class='ad-audit-why'>${ad.whyYou}</p>`,
    "      <div class='ad-audit-section-label'>Auction result</div>",
    `      <p class='ad-audit-auction'>${ad.auctionWinner}</p>`,
    "    </div>",
    "  </div>",
    "</div>",
  ].join("\n");
};

const renderFakeBannerAd = (auditKey: string): string => {
  const ad = fakeAds[auditKey];
  if (!ad) return "";
  return [
    `<div class='fake-ad-container' data-format='${ad.format}'>`,
    "  <div class='fake-ad-label-row'>",
    "    <span class='fake-ad-label'>Ad</span>",
    `    <button class='fake-ad-audit-btn' onclick=\"var el=document.getElementById('audit-${auditKey}');el.style.display='flex';el.setAttribute('aria-hidden','false');\">Why this ad? ↗</button>`,
    "  </div>",
    "  <div class='fake-banner-ad'>",
    "    <div class='fake-banner-left'>",
    "      <div class='fake-banner-logo'></div>",
    "    </div>",
    "    <div class='fake-banner-content'>",
    `      <div class='fake-banner-headline'>${ad.headline}</div>`,
    `      <div class='fake-banner-body'>${ad.body}</div>`,
    "    </div>",
    `    <a class='fake-banner-cta' href='#' onclick='return false;'>${ad.cta}</a>`,
    "  </div>",
    renderFakeAdAuditPopover(auditKey),
    "</div>",
  ].join("\n");
};

const renderFakeNativeAd = (auditKey: string): string => {
  const ad = fakeAds[auditKey];
  if (!ad) return "";
  return [
    `<div class='fake-ad-container' data-format='native'>`,
    "  <div class='fake-ad-label-row'>",
    "    <span class='fake-ad-label'>Sponsored</span>",
    `    <button class='fake-ad-audit-btn' onclick=\"var el=document.getElementById('audit-${auditKey}');el.style.display='flex';el.setAttribute('aria-hidden','false');\">Why this ad? ↗</button>`,
    "  </div>",
    "  <div class='fake-native-ad'>",
    "    <div class='fake-native-image'></div>",
    "    <div class='fake-native-text'>",
    `      <div class='fake-native-headline'>${ad.headline}</div>`,
    `      <div class='fake-native-body'>${ad.body}</div>`,
    `      <span class='fake-native-cta'>${ad.cta}</span>`,
    "    </div>",
    "  </div>",
    renderFakeAdAuditPopover(auditKey),
    "</div>",
  ].join("\n");
};

const renderFakeSearchAd = (auditKey: string): string => {
  const ad = fakeAds[auditKey];
  if (!ad) return "";
  return [
    `<div class='fake-ad-container' data-format='search'>`,
    "  <div class='fake-search-ad'>",
    "    <div class='fake-search-ad-top'>",
    "      <span class='fake-search-ad-tag'>Sponsored</span>",
    `      <button class='fake-ad-audit-btn' onclick=\"var el=document.getElementById('audit-${auditKey}');el.style.display='flex';el.setAttribute('aria-hidden','false');\">Why this ad? ↗</button>`,
    "    </div>",
    `    <div class='fake-search-headline'>${ad.headline}</div>`,
    "    <div class='fake-search-url'>aws.amazon.com/advertising-technology</div>",
    `    <div class='fake-search-body'>${ad.body}</div>`,
    "  </div>",
    renderFakeAdAuditPopover(auditKey),
    "</div>",
  ].join("\n");
};

const renderFakeVideoAd = (auditKey: string): string => {
  const ad = fakeAds[auditKey];
  if (!ad) return "";
  return [
    `<div class='fake-ad-container' data-format='video'>`,
    "  <div class='fake-ad-label-row'>",
    "    <span class='fake-ad-label'>Video Ad</span>",
    `    <button class='fake-ad-audit-btn' onclick=\"var el=document.getElementById('audit-${auditKey}');el.style.display='flex';el.setAttribute('aria-hidden','false');\">Why this ad? ↗</button>`,
    "  </div>",
    "  <div class='fake-video-ad'>",
    "    <div class='fake-video-player'>",
    "      <div class='fake-video-overlay'>",
    "        <div class='fake-video-play'>▶</div>",
    `        <div class='fake-video-title'>${ad.headline}</div>`,
    "      </div>",
    "      <div class='fake-video-badge'>Ad · 0:15 · Non-skippable</div>",
    "    </div>",
    "    <div class='fake-video-meta'>",
    `      <div class='fake-video-advertiser'>${ad.advertiser}</div>`,
    `      <div class='fake-video-desc'>${ad.body}</div>`,
    "      <div class='fake-video-timeline'><div class='fake-video-progress'></div></div>",
    "    </div>",
    "  </div>",
    renderFakeAdAuditPopover(auditKey),
    "</div>",
  ].join("\n");
};

const renderFakeAudioAd = (auditKey: string): string => {
  const ad = fakeAds[auditKey];
  if (!ad) return "";
  return [
    `<div class='fake-ad-container' data-format='audio'>`,
    "  <div class='fake-ad-label-row'>",
    "    <span class='fake-ad-label'>Audio Ad</span>",
    `    <button class='fake-ad-audit-btn' onclick=\"var el=document.getElementById('audit-${auditKey}');el.style.display='flex';el.setAttribute('aria-hidden','false');\">Why this ad? ↗</button>`,
    "  </div>",
    "  <div class='fake-audio-ad'>",
    "    <div class='fake-audio-icon'>♪</div>",
    "    <div class='fake-audio-content'>",
    `      <div class='fake-audio-headline'>${ad.headline}</div>`,
    `      <div class='fake-audio-body'>${ad.body}</div>`,
    "      <div class='fake-audio-wave'>",
    "        <div class='fake-audio-bar'></div><div class='fake-audio-bar'></div><div class='fake-audio-bar'></div>",
    "        <div class='fake-audio-bar'></div><div class='fake-audio-bar'></div><div class='fake-audio-bar'></div>",
    "        <div class='fake-audio-bar'></div><div class='fake-audio-bar'></div>",
    "      </div>",
    `      <div class='fake-audio-advertiser'>${ad.advertiser} · 30 sec</div>`,
    "    </div>",
    "  </div>",
    renderFakeAdAuditPopover(auditKey),
    "</div>",
  ].join("\n");
};

const renderTopicFakeAd = (id: TopicId): string => {
  const adMap: Partial<Record<TopicId, () => string>> = {
    "buy-side": () => renderFakeBannerAd("banner-buy-side"),
    "sell-side": () => renderFakeBannerAd("banner-sell-side"),
    "data": () => renderFakeNativeAd("native-data"),
    "ad-serving-rtb": () => renderFakeSearchAd("search-rtb"),
    "measurement-currency": () => renderFakeVideoAd("video-measurement"),
    "third-parties": () => renderFakeAudioAd("audio-data"),
  };
  const fn = adMap[id];
  return fn ? fn() : "";
};

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
  // Shared helpers
  const bl = "#0284c7", blF = "#e0f2fe", blD = "#0c4a6e";
  const gr = "#16a34a", grF = "#dcfce7", grD = "#14532d";
  const pu = "#7c3aed", puF = "#ede9fe";
  const or = "#d97706", orF = "#fef3c7";
  const st = "#475569", mu = "#94a3b8";

  const mk = (mid: string, c: string) =>
    `<marker id="${mid}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="${c}"/></marker>`;

  const bx = (x: number, y: number, w: number, h: number, label: string, sub: string, fc: string, sc: string, co = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fc}" stroke="${sc}" stroke-width="1.5"/>` +
    `<text x="${x+w/2}" y="${y+16}" text-anchor="middle" font-size="9" font-weight="700" fill="${sc}">${label}</text>` +
    `<text x="${x+w/2}" y="${y+27}" text-anchor="middle" font-size="7.5" fill="${st}">${sub}</text>` +
    (co ? `<text x="${x+w/2}" y="${y+38}" text-anchor="middle" font-size="6.5" fill="${mu}" font-style="italic">${co}</text>` : "");

  const ln = (x1: number, y1: number, x2: number, y2: number, lbl: string, c: string, mid: string) =>
    `<path stroke="${c}" stroke-width="1.5" fill="none" marker-end="url(#${mid})" d="M${x1} ${y1} L${x2} ${y2}"/>` +
    (lbl ? `<text x="${(x1+x2)/2}" y="${Math.min(y1,y2)+(Math.abs(y2-y1)||0)/2-5}" text-anchor="middle" font-size="7" fill="${c}" font-weight="600">${lbl}</text>` : "");

  const zone = (x: number, y: number, w: number, h: number, label: string, c: string, fc: string) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fc}" stroke="${c}" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>` +
    `<text x="${x+6}" y="${y+12}" font-size="7" fill="${c}" font-weight="700" letter-spacing="0.06em">${label}</text>`;

  const tag = (x: number, y: number, label: string, c: string, fc: string) =>
    `<rect x="${x}" y="${y}" width="${label.length * 5.5 + 8}" height="13" rx="3" fill="${fc}" stroke="${c}" stroke-width="1"/>` +
    `<text x="${x + label.length * 5.5/2 + 4}" y="${y+9}" text-anchor="middle" font-size="7" fill="${c}" font-weight="600">${label}</text>`;

  if (id === "buy-side") {
    const W = 560, H = 270;
    const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}</defs>`;
    return `<div class='flow-title'>RTB Bidding Architecture (Buy Side)</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` + defs +
      // Zone backgrounds
      zone(2, 18, 190, 200, "BUYER STACK", bl, "#f0f9ff") +
      zone(196, 18, 160, 200, "DSP / BID ENGINE", pu, "#faf5ff") +
      zone(360, 18, 196, 200, "EXCHANGE + PUBLISHER", gr, "#f0fdf4") +
      // Row 1 nodes
      bx(8, 32, 85, 44, "Advertiser", "goals & budget", blF, bl, "P&G · Nike · Samsung") +
      bx(100, 32, 86, 44, "Agency", "strategy & plan", blF, bl, "Horizon · GroupM") +
      bx(202, 28, 148, 52, "DSP", "bid engine: evaluate every impression", puF, pu, "The Trade Desk · DV360 · Amazon DSP · Xandr") +
      bx(366, 32, 88, 44, "Exchange", "OpenRTB auction", puF, pu, "Google · Index · Xandr") +
      bx(462, 32, 90, 44, "Publisher", "ad slot filled", grF, gr, "NYT · ESPN · apps") +
      // Arrows row 1
      ln(93, 54, 98, 54, "brief", bl, "ab") +
      ln(186, 54, 200, 54, "RFP", bl, "ab") +
      ln(350, 54, 364, 54, "bid $8.40", pu, "ap") +
      ln(454, 54, 460, 54, "win!", gr, "ag") +
      // DSP internals (row 2 inside DSP zone)
      `<rect x="202" y="86" width="148" height="18" rx="3" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1"/>` +
      `<text x="276" y="99" text-anchor="middle" font-size="8" fill="${pu}">Audience segs + context signals</text>` +
      `<rect x="202" y="108" width="148" height="18" rx="3" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1"/>` +
      `<text x="276" y="121" text-anchor="middle" font-size="8" fill="${pu}">Bid model: pCTR × bid value</text>` +
      `<rect x="202" y="130" width="148" height="18" rx="3" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1"/>` +
      `<text x="276" y="143" text-anchor="middle" font-size="8" fill="${pu}">Frequency cap · Brand safety</text>` +
      // Row 2: win flow
      bx(202, 158, 148, 44, "Win Notification", "nurl + billing event", orF, or, "DSP logs impression cost") +
      bx(366, 158, 90, 44, "Creative", "HTML/VAST markup", blF, bl, "300×250 banner or video") +
      bx(462, 158, 90, 44, "Pixel fires", "impression event", grF, gr, "S3 · BigQuery logs") +
      ln(276, 130, 276, 156, "", pu, "ap") +
      ln(350, 180, 364, 180, "markup", bl, "ab") +
      ln(456, 180, 460, 180, "beacon", gr, "ag") +
      // Timing bar
      `<rect x="2" y="224" width="556" height="14" rx="3" fill="#f8fafc" stroke="#e2e8f0"/>` +
      `<text x="8" y="234" font-size="6.5" fill="${mu}" font-weight="700">TIMING:</text>` +
      `<text x="60" y="234" font-size="6.5" fill="${mu}">0ms page load</text>` +
      `<text x="140" y="234" font-size="6.5" fill="${mu}">· 5ms ad request</text>` +
      `<text x="220" y="234" font-size="6.5" fill="${mu}">· 30ms DSPs evaluate</text>` +
      `<text x="330" y="234" font-size="6.5" fill="${mu}">· 100ms auction closes</text>` +
      `<text x="440" y="234" font-size="6.5" fill="${mu}">· 150ms ad renders</text>` +
      // Legend
      `<text x="2" y="256" font-size="6.5" fill="${mu}">Key: DSP = Demand-Side Platform · OpenRTB = open auction protocol · nurl = win notification URL · pCTR = predicted click-through rate</text>` +
      `</svg>`;
  }

  if (id === "sell-side") {
    const W = 560, H = 280;
    const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}</defs>`;
    return `<div class='flow-title'>Publisher Yield Stack &amp; Header Bidding</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` + defs +
      zone(2, 18, 130, 220, "PUBLISHER", gr, "#f0fdf4") +
      zone(136, 18, 170, 220, "HEADER BIDDING", bl, "#f0f9ff") +
      zone(310, 18, 246, 220, "EXCHANGE + DSPs", pu, "#faf5ff") +
      // Publisher side
      bx(8, 32, 118, 44, "Publisher Page/App", "ad slots available", grF, gr, "NYT · Hulu · ESPN") +
      bx(8, 90, 118, 44, "GAM Ad Server", "Google Ad Manager", grF, gr, "direct deals checked first") +
      bx(8, 148, 118, 44, "Floor Prices", "min CPM per slot", grF, gr, "set by yield team") +
      ln(67, 76, 67, 88, "", gr, "ag") +
      ln(67, 134, 67, 146, "", gr, "ag") +
      // Header bidding fan-out
      bx(142, 32, 158, 30, "Prebid.js (in page )", "parallel auction · ~200ms timeout", blF, bl) +
      ln(126, 54, 140, 48, "", bl, "ab") +
      bx(142, 78, 148, 36, "Magnite SSP", "floor: $4.50 min", blF, bl, "bid: $7.10 ✓ winner") +
      bx(142, 122, 148, 36, "PubMatic SSP", "floor: $4.50 min", blF, bl, "bid: $6.20") +
      bx(142, 166, 148, 36, "Index Exchange", "floor: $4.50 min", blF, bl, "bid: $5.80") +
      ln(221, 62, 221, 76, "", bl, "ab") +
      ln(221, 62, 221, 76, "", bl, "ab") +
      `<path stroke="${bl}" stroke-width="1.2" fill="none" d="M221 62 L221 78"/>` +
      `<path stroke="${bl}" stroke-width="1.2" fill="none" d="M221 62 L215 122"/>` +
      `<path stroke="${bl}" stroke-width="1.2" fill="none" d="M221 62 L215 166"/>` +
      // Exchange side
      bx(318, 52, 110, 44, "Ad Exchange", "OpenRTB bid request", puF, pu, "Google · Index · Magnite") +
      bx(318, 112, 110, 44, "DSP Bidders", "100+ buyers competing", puF, pu, "TTD · DV360 · Amazon") +
      bx(318, 172, 110, 44, "Winning Bid", "highest price wins", "#fef3c7", or, "2nd-price or 1st-price") +
      bx(438, 112, 112, 44, "Creative", "ad markup returned", grF, gr, "HTML iframe or VAST") +
      ln(296, 96, 316, 70, "$7.10 bid", pu, "ap") +
      ln(373, 96, 373, 110, "", pu, "ap") +
      ln(373, 156, 373, 170, "", or, "ab") +
      ln(428, 134, 436, 134, "markup", gr, "ag") +
      // Passback note
      `<text x="142" y="216" font-size="7" fill="${mu}" font-style="italic">If no bid meets floor: passback to next demand source</text>` +
      // Legend
      `<text x="2" y="252" font-size="6.5" fill="${mu}">GAM = Google Ad Manager (publisher ad server) · SSP = Supply-Side Platform · Floor = minimum acceptable CPM</text>` +
      `</svg>`;
  }

  if (id === "data") {
    const W = 560, H = 270;
    const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}</defs>`;
    return `<div class='flow-title'>Ad-Tech Data Pipeline Architecture</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` + defs +
      // Layer labels
      `<text x="2" y="34" font-size="7" fill="${bl}" font-weight="700">COLLECTION</text>` +
      `<text x="2" y="110" font-size="7" fill="${pu}" font-weight="700">STORAGE &amp; PROCESS</text>` +
      `<text x="2" y="188" font-size="7" fill="${gr}" font-weight="700">APPLICATIONS</text>` +
      // Collection layer (row 1)
      bx(2, 38, 90, 40, "SDK Events", "mobile + web", blF, bl, "Segment · mParticle") +
      bx(100, 38, 90, 40, "Ad Pixels", "1×1 img beacons", blF, bl, "impression, click") +
      bx(198, 38, 90, 40, "Server Logs", "bid, win, serve", blF, bl, "raw JSON events") +
      bx(296, 38, 90, 40, "Conversion API", "server-to-server", blF, bl, "Meta CAPI, GTAT") +
      bx(394, 38, 90, 40, "ACR / CTV", "TV viewing data", blF, bl, "Samba TV, iSpot") +
      // Stream bus
      bx(130, 92, 300, 30, "Kafka / Kinesis  — real-time event bus", "billions of events/day · partitioned by user_id", puF, pu) +
      ln(47, 78, 47, 92, "", pu, "ap") + ln(145, 78, 200, 92, "", pu, "ap") +
      ln(243, 78, 280, 92, "", pu, "ap") + ln(341, 78, 350, 92, "", pu, "ap") +
      ln(439, 78, 390, 92, "", pu, "ap") +
      // Storage + process layer (row 2)
      bx(2, 136, 100, 40, "Data Lake", "S3 / GCS raw", "#fef3c7", or, "immutable Parquet/ORC") +
      bx(110, 136, 100, 40, "Spark / Flink", "ETL &amp; joins", puF, pu, "hourly batch + streaming") +
      bx(218, 136, 100, 40, "dbt", "SQL transforms", puF, pu, "clean, model, test") +
      bx(326, 136, 108, 40, "Warehouse", "Snowflake / BigQuery", puF, pu, "queryable, governed") +
      bx(442, 136, 112, 40, "Feature Store", "Redis / Feast", blF, bl, "low-latency bidder reads") +
      ln(280, 122, 50, 134, "", or, "ab") + ln(102, 156, 108, 156, "", pu, "ap") +
      ln(210, 156, 216, 156, "", pu, "ap") + ln(318, 156, 324, 156, "", pu, "ap") +
      ln(434, 156, 440, 156, "", bl, "ab") +
      // Application layer (row 3)
      bx(2, 194, 130, 40, "Audience Segments", "1P + 3P targeting", grF, gr, "LiveRamp · Lotame") +
      bx(140, 194, 120, 40, "Attribution Model", "last-click / MTA / MMM", grF, gr, "Rockerbox · Northbeam") +
      bx(268, 194, 120, 40, "Bidder Enrichment", "user score at bid time", grF, gr, "&lt;5ms latency SLA") +
      bx(396, 194, 158, 40, "Reporting &amp; BI", "Looker · Tableau · custom", grF, gr, "pacing, ROAS, reach") +
      ln(434, 176, 66, 192, "", gr, "ag") + ln(434, 176, 198, 192, "", gr, "ag") +
      ln(498, 176, 326, 192, "", gr, "ag") + ln(498, 176, 474, 192, "", gr, "ag") +
      `<text x="2" y="254" font-size="6.5" fill="${mu}">ACR = Automatic Content Recognition · CAPI = Conversions API · dbt = data build tool · MTA = Multi-Touch Attribution · MMM = Media Mix Modeling</text>` +
      `</svg>`;
  }

  if (id === "third-parties") {
    const W = 560, H = 270;
    const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}</defs>`;
    return `<div class='flow-title'>Third-Party Ecosystem: Identity, Verification &amp; Measurement</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` + defs +
      // Track headers
      zone(2, 16, 170, 220, "IDENTITY", bl, "#f0f9ff") +
      zone(178, 16, 196, 220, "BRAND SAFETY + FRAUD", pu, "#faf5ff") +
      zone(380, 16, 178, 220, "MEASUREMENT", gr, "#f0fdf4") +
      // Identity track
      bx(8, 32, 158, 40, "Publisher (ATS.js)", "user logs in, email hashed", blF, bl, "NYT, ESPN, Conde Nast") +
      bx(8, 88, 158, 40, "LiveRamp ATS", "email → RampID resolution", blF, bl, "deterministic ID graph") +
      bx(8, 144, 158, 40, "UID2 / ID5", "open-source unified ID", blF, bl, "TTD · built on consent") +
      bx(8, 200, 158, 40, "DSP Matching", "buyer targets RampID", blF, bl, "no cookie needed") +
      ln(87, 72, 87, 86, "hashed email", bl, "ab") +
      ln(87, 128, 87, 142, "resolve ID", bl, "ab") +
      ln(87, 184, 87, 198, "pass in bid req", bl, "ab") +
      // Verification track
      bx(184, 32, 184, 40, "URL / Page Scanner", "content category + risk", puF, pu, "IAS · DoubleVerify · Oracle") +
      bx(184, 88, 184, 40, "Brand Safety Score", "block violent / adult / fake news", puF, pu, "pre-bid API signal") +
      bx(184, 144, 184, 40, "IVT Detection", "bot traffic, datacenter IPs", puF, pu, "GIVT + SIVT categories") +
      bx(184, 200, 184, 40, "Viewability Signal", "MRC: 50% pixels, 1 sec", puF, pu, "Moat · IAS tag in creative") +
      ln(276, 72, 276, 86, "score", pu, "ap") +
      ln(276, 128, 276, 142, "flag", pu, "ap") +
      ln(276, 184, 276, 198, "measure", pu, "ap") +
      // Measurement track
      bx(386, 32, 166, 40, "Nielsen Panels", "30,000-person sample", grF, gr, "demographic ratings data") +
      bx(386, 88, 166, 40, "VideoAmp / iSpot", "set-top box + ACR data", grF, gr, "millions of households") +
      bx(386, 144, 166, 40, "C3 / C7 Currency", "live + 3/7-day DVR views", grF, gr, "TV buying standard") +
      bx(386, 200, 166, 40, "Clean Room", "Snowflake / ADH / AWS", grF, gr, "overlap w/o sharing PII") +
      ln(469, 72, 469, 86, "panel data", gr, "ag") +
      ln(469, 128, 469, 142, "ratings", gr, "ag") +
      ln(469, 184, 469, 198, "match", gr, "ag") +
      `<text x="2" y="252" font-size="6.5" fill="${mu}">ATS = Authenticated Traffic Solution · RampID = LiveRamp's people-based ID · IVT = Invalid Traffic · GIVT/SIVT = General/Sophisticated IVT · ADH = Ads Data Hub</text>` +
      `</svg>`;
  }

  if (id === "ad-serving-rtb") {
    const W = 560, H = 280;
    const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}</defs>`;
    return `<div class='flow-title'>Full RTB Lifecycle: Page Load to Ad Render (&lt;150ms)</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` + defs +
      // Timeline ruler at top
      `<rect x="2" y="16" width="556" height="14" rx="3" fill="#f8fafc" stroke="#e2e8f0"/>` +
      `<text x="8" y="26" font-size="7" fill="${mu}" font-weight="700">ms:</text>` +
      `<text x="30" y="26" font-size="7" fill="${bl}">0</text>` +
      `<text x="95" y="26" font-size="7" fill="${bl}">5</text>` +
      `<text x="160" y="26" font-size="7" fill="${pu}">30</text>` +
      `<text x="255" y="26" font-size="7" fill="${pu}">80</text>` +
      `<text x="340" y="26" font-size="7" fill="${gr}">100</text>` +
      `<text x="420" y="26" font-size="7" fill="${gr}">120</text>` +
      `<text x="500" y="26" font-size="7" fill="${or}">150</text>` +
      // Step nodes (two rows)
      bx(2, 38, 78, 50, "Page Loads", "slot script fires", blF, bl, "GPT / Prebid.js") +
      bx(88, 38, 78, 50, "Ad Request", "slot params sent", blF, bl, "imp, site, user") +
      bx(174, 38, 78, 50, "Bid Request", "OpenRTB JSON", puF, pu, "to 10-30 DSPs") +
      bx(260, 38, 78, 50, "DSP Eval", "ML model + rules", puF, pu, "pCTR × value") +
      bx(346, 38, 78, 50, "Auction", "highest net bid", puF, pu, "2nd-price clears") +
      bx(432, 38, 78, 50, "Winner", "notified via nurl", grF, gr, "billing logged") +
      // Arrows row 1
      ln(80, 63, 86, 63, "", bl, "ab") + ln(166, 63, 172, 63, "", bl, "ab") +
      ln(252, 63, 258, 63, "", pu, "ap") + ln(338, 63, 344, 63, "", pu, "ap") +
      ln(424, 63, 430, 63, "", gr, "ag") +
      // Bid request fields callout
      `<rect x="174" y="92" width="78" height="56" rx="4" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1"/>` +
      `<text x="213" y="103" text-anchor="middle" font-size="6.5" fill="${pu}" font-weight="700">BidRequest fields:</text>` +
      `<text x="213" y="114" text-anchor="middle" font-size="6.5" fill="${st}">imp: {id,banner,video}</text>` +
      `<text x="213" y="124" text-anchor="middle" font-size="6.5" fill="${st}">site: {domain,cat,page}</text>` +
      `<text x="213" y="134" text-anchor="middle" font-size="6.5" fill="${st}">user: {id,buyeruid}</text>` +
      `<text x="213" y="144" text-anchor="middle" font-size="6.5" fill="${st}">regs: {coppa,gdpr,us_p}</text>` +
      // Row 2: post-auction
      bx(346, 102, 78, 50, "Creative", "HTML / VAST URL", grF, gr, "markup in seatbid") +
      bx(432, 102, 78, 50, "Ad Renders", "iframe or instream", grF, gr, "300×250 or video") +
      bx(2, 102, 78, 50, "Logs", "raw events → S3", "#fef3c7", or, "Kafka pipeline") +
      ln(424, 127, 430, 127, "markup", gr, "ag") +
      `<path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#ag)" d="M471 102 L471 90"/>` +
      `<path stroke="${or}" stroke-width="1.5" fill="none" marker-end="url(#ab)" d="M471 152 L41 152"/>` +
      // VAST callout
      `<rect x="346" y="156" width="78" height="56" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>` +
      `<text x="385" y="167" text-anchor="middle" font-size="6.5" fill="${or}" font-weight="700">VAST (video):</text>` +
      `<text x="385" y="178" text-anchor="middle" font-size="6.5" fill="${st}">MediaFile URL</text>` +
      `<text x="385" y="188" text-anchor="middle" font-size="6.5" fill="${st}">TrackingEvents</text>` +
      `<text x="385" y="198" text-anchor="middle" font-size="6.5" fill="${st}">VideoClicks</text>` +
      `<text x="385" y="208" text-anchor="middle" font-size="6.5" fill="${st}">Impression URL</text>` +
      `<text x="2" y="228" font-size="6.5" fill="${mu}">nurl = win notification URL fired by exchange · seatbid = DSP response containing ad markup · GPT = Google Publisher Tag · Prebid.js = open-source header bidding library</text>` +
      `</svg>`;
  }

  if (id === "measurement-currency") {
    const W = 560, H = 270;
    const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}</defs>`;
    return `<div class='flow-title'>Measurement, Attribution &amp; TV Currency</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">` + defs +
      zone(2, 16, 270, 110, "DIGITAL ATTRIBUTION", bl, "#f0f9ff") +
      zone(278, 16, 278, 110, "TV / CTV CURRENCY", gr, "#f0fdf4") +
      zone(2, 132, 554, 110, "SHARED INFRASTRUCTURE", pu, "#faf5ff") +
      // Digital track
      bx(8, 32, 90, 40, "Impression Pixel", "1×1 img on render", blF, bl, "GAM / CM360 tag") +
      bx(106, 32, 82, 40, "Click Pixel", "redirect + log", blF, bl, "final URL tracking") +
      bx(196, 32, 70, 40, "Conv. API", "server-side event", blF, bl, "Meta CAPI, GTAT") +
      ln(98, 52, 104, 52, "", bl, "ab") + ln(178, 52, 194, 52, "", bl, "ab") +
      bx(8, 84, 90, 40, "Last-Click", "100% to last ad", "#fef3c7", or, "simple, biased") +
      bx(106, 84, 82, 40, "MTA", "multi-touch credit", "#fef3c7", or, "data-driven model") +
      bx(196, 84, 70, 40, "MMM", "media mix model", "#fef3c7", or, "econometrics") +
      ln(53, 72, 53, 82, "", or, "ab") + ln(147, 72, 147, 82, "", or, "ab") + ln(231, 72, 231, 82, "", or, "ab") +
      // TV track
      bx(284, 32, 120, 40, "Nielsen Panels", "30k HH sample", grF, gr, "C3/C7 demo ratings") +
      bx(412, 32, 138, 40, "VideoAmp / iSpot", "STB + ACR data", grF, gr, "millions of households") +
      bx(284, 84, 120, 40, "Upfront Deals", "annual commitments", grF, gr, "$20B+ US TV market") +
      bx(412, 84, 138, 40, "Make-Goods", "missed rating deliver", grF, gr, "bonus impressions") +
      ln(344, 72, 344, 82, "", gr, "ag") + ln(481, 72, 481, 82, "", gr, "ag") +
      // Shared infrastructure
      bx(8, 148, 130, 40, "Clean Room", "Snowflake · ADH · AWS", puF, pu, "privacy-safe data join") +
      bx(146, 148, 120, 40, "Identity Graph", "RampID / UID2 link", puF, pu, "cross-device match") +
      bx(274, 148, 130, 40, "Incrementality", "holdout testing", puF, pu, "true causal lift") +
      bx(412, 148, 142, 40, "Reach &amp; Frequency", "deduped audience size", puF, pu, "Nielsen DAR / comScore") +
      ln(138, 168, 144, 168, "", pu, "ap") + ln(266, 168, 272, 168, "", pu, "ap") + ln(404, 168, 410, 168, "", pu, "ap") +
      `<path stroke="${pu}" stroke-width="1" fill="none" stroke-dasharray="3,2" d="M 270 124 L 72 146"/>` +
      `<path stroke="${pu}" stroke-width="1" fill="none" stroke-dasharray="3,2" d="M 270 124 L 481 146"/>` +
      `<text x="2" y="256" font-size="6.5" fill="${mu}">C3/C7 = live + 3/7-day DVR viewing · MTA = Multi-Touch Attribution · MMM = Media Mix Model · ADH = Ads Data Hub · STB = Set-Top Box · HH = Households</text>` +
      `</svg>`;
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
  const bl = "#0284c7", blF = "#e0f2fe";
  const gr = "#16a34a", grF = "#dcfce7";
  const pu = "#7c3aed", puF = "#ede9fe";
  const or = "#d97706", orF = "#fef3c7";
  const st = "#475569", mu = "#94a3b8";

  const mk = (mid: string, c: string) =>
    `<marker id="${mid}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="${c}"/></marker>`;

  const bx = (x: number, y: number, w: number, h: number, label: string, sub: string, fc: string, sc: string, co = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fc}" stroke="${sc}" stroke-width="1.5"/>` +
    `<text x="${x+w/2}" y="${y+14}" text-anchor="middle" font-size="8.5" font-weight="700" fill="${sc}">${label}</text>` +
    `<text x="${x+w/2}" y="${y+25}" text-anchor="middle" font-size="7" fill="${st}">${sub}</text>` +
    (co ? `<text x="${x+w/2}" y="${y+35}" text-anchor="middle" font-size="6.5" fill="${mu}" font-style="italic">${co}</text>` : "");

  const ln = (x1: number, y1: number, x2: number, y2: number, lbl: string, c: string, mid: string) =>
    `<path stroke="${c}" stroke-width="1.4" fill="none" marker-end="url(#${mid})" d="M${x1} ${y1} L${x2} ${y2}"/>` +
    (lbl ? `<text x="${(x1+x2)/2}" y="${(y1+y2)/2 - 3}" text-anchor="middle" font-size="6.5" fill="${c}" font-weight="600">${lbl}</text>` : "");

  const defs = `<defs>${mk("ab",bl)}${mk("ap",pu)}${mk("ag",gr)}${mk("ao",or)}</defs>`;

  if (id === "search") {
    const W = 560, H = 250;
    return `<div class='flow-title'>Google Search Ads: Query to Click &amp; Feedback Loop</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}` +
      // Row 1: query processing
      bx(2, 16, 78, 46, "User Query", "lightweight camping tents", blF, bl, "keywords tokenized") +
      bx(88, 16, 82, 46, "Index Match", "candidate ad set", blF, bl, "keyword → campaign") +
      bx(178, 16, 90, 46, "Quality Score", "1–10 rating", puF, pu, "CTR + relevance + LP") +
      bx(276, 16, 90, 46, "Ad Rank", "bid × QS × ext", puF, pu, "determines position") +
      bx(374, 16, 90, 46, "Auction", "top N ads shown", puF, pu, "VCG / Vickrey pricing") +
      bx(472, 16, 82, 46, "SERP", "ad rendered", grF, gr, "paid + organic mix") +
      ln(80, 39, 86, 39, "", bl, "ab") + ln(170, 39, 176, 39, "", bl, "ab") +
      ln(268, 39, 274, 39, "formula", pu, "ap") + ln(366, 39, 372, 39, "", pu, "ap") +
      ln(464, 39, 470, 39, "position", gr, "ag") +
      // QS breakdown callout
      `<rect x="178" y="66" width="90" height="56" rx="4" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1"/>` +
      `<text x="223" y="77" text-anchor="middle" font-size="7" fill="${pu}" font-weight="700">Quality Score =</text>` +
      `<text x="223" y="88" text-anchor="middle" font-size="7" fill="${st}">Expected CTR (historical)</text>` +
      `<text x="223" y="99" text-anchor="middle" font-size="7" fill="${st}">+ Ad relevance (to query)</text>` +
      `<text x="223" y="110" text-anchor="middle" font-size="7" fill="${st}">+ Landing page exp.</text>` +
      // Ad Rank callout
      `<rect x="276" y="66" width="90" height="44" rx="4" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1"/>` +
      `<text x="321" y="77" text-anchor="middle" font-size="7" fill="${pu}" font-weight="700">Ad Rank =</text>` +
      `<text x="321" y="88" text-anchor="middle" font-size="7" fill="${st}">Max CPC bid × QS</text>` +
      `<text x="321" y="99" text-anchor="middle" font-size="7" fill="${st}">× Ext. impact + context</text>` +
      // Row 2: post-click feedback
      bx(2, 140, 100, 44, "Click", "user clicks ad", blF, bl, "CPC charged") +
      bx(110, 140, 100, 44, "Landing Page", "conversion event", blF, bl, "Goal tag fires") +
      bx(218, 140, 110, 44, "Smart Bidding", "tROAS / tCPA model", puF, pu, "updates bid strategy") +
      bx(336, 140, 110, 44, "Conversion Data", "signal fed to model", grF, gr, "gclid match") +
      bx(454, 140, 100, 44, "Next Auctions", "bid auto-adjusted", grF, gr, "closed-loop system") +
      ln(102, 162, 108, 162, "CPC", bl, "ab") + ln(210, 162, 216, 162, "", bl, "ab") +
      ln(328, 162, 334, 162, "", pu, "ap") + ln(446, 162, 452, 162, "", gr, "ag") +
      `<path stroke="${or}" stroke-width="1.2" fill="none" stroke-dasharray="3,2" marker-end="url(#ao)" d="M513 140 C 513 120 80 120 82 140"/>` +
      `<text x="300" y="118" text-anchor="middle" font-size="7" fill="${or}" font-style="italic">Smart Bidding feedback loop</text>` +
      `<text x="2" y="202" font-size="6.5" fill="${mu}">QS = Quality Score · LP = Landing Page · CPC = Cost Per Click · VCG = Vickrey-Clarke-Groves (generalized 2nd price) · tROAS/tCPA = target return / cost bidding strategies</text>` +
      `</svg>`;
  }

  if (id === "instagram") {
    const W = 560, H = 240;
    return `<div class='flow-title'>Instagram / Meta Feed Ad: From Scroll to Conversion API</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}` +
      // Row 1: ad selection
      bx(2, 16, 88, 46, "Feed Scroll", "slot eligible", blF, bl, "Ads Manager campaign") +
      bx(98, 16, 96, 46, "Meta Adv+", "Advantage+ auction", puF, pu, "internal + FBX buyers") +
      bx(202, 16, 96, 46, "ML Ranking", "predicted value score", puF, pu, "p(action) × bid") +
      bx(306, 16, 96, 46, "Creative", "personalized ad", blF, bl, "DCO + DPA variants") +
      bx(410, 16, 88, 46, "Impression", "viewable render", grF, gr, "1-sec in viewport") +
      bx(506, 16, 50, 46, "Logs", "events S3", grF, gr) +
      ln(90, 39, 96, 39, "", bl, "ab") + ln(194, 39, 200, 39, "score", pu, "ap") +
      ln(298, 39, 304, 39, "", pu, "ap") + ln(402, 39, 408, 39, "", gr, "ag") +
      ln(498, 39, 504, 39, "", gr, "ag") +
      // Row 2: signal loop
      bx(2, 108, 110, 44, "Pixel / SDK", "browser + app events", blF, bl, "Meta Pixel · CAPI") +
      bx(120, 108, 110, 44, "Event Match", "email / phone hash", blF, bl, "hashed PII lookup") +
      bx(238, 108, 110, 44, "Conversion API", "server-to-server", puF, pu, "bypasses iOS block") +
      bx(356, 108, 110, 44, "Audience Rebuild", "lookalike + retarget", puF, pu, "Custom Audiences") +
      bx(474, 108, 80, 44, "Next Bid", "model updated", grF, gr, "closed loop") +
      ln(112, 130, 118, 130, "", bl, "ab") + ln(230, 130, 236, 130, "", bl, "ab") +
      ln(348, 130, 354, 130, "", pu, "ap") + ln(466, 130, 472, 130, "", gr, "ag") +
      `<path stroke="${or}" stroke-width="1.2" fill="none" stroke-dasharray="3,2" marker-end="url(#ao)" d="M456 108 C 456 80 100 80 100 108"/>` +
      `<text x="280" y="78" text-anchor="middle" font-size="7" fill="${or}" font-style="italic">Conversion signal feeds back into auction model</text>` +
      `<text x="2" y="176" font-size="6.5" fill="${mu}">CAPI = Conversions API · DPA = Dynamic Product Ads · DCO = Dynamic Creative Optimization · FBX = Facebook Exchange · Advantage+ = Meta's automated campaign system</text>` +
      `</svg>`;
  }

  if (id === "youtube") {
    const W = 560, H = 240;
    return `<div class='flow-title'>YouTube Pre-Roll: IMA SDK → VAST → Quartile Tracking</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}` +
      // Row 1: ad delivery
      bx(2, 16, 86, 46, "Video Plays", "player initiates", blF, bl, "watch.youtube.com") +
      bx(96, 16, 86, 46, "IMA SDK", "ad request built", blF, bl, "Google IMA / PAL") +
      bx(190, 16, 96, 46, "Google Ad Mgr", "inventory sold?", puF, pu, "direct vs programmatic") +
      bx(294, 16, 96, 46, "Auth. Buyers", "DV360 · TTD bid", puF, pu, "parallel OpenRTB") +
      bx(398, 16, 86, 46, "VAST URL", "XML response", grF, gr, "MediaFile + tracking") +
      bx(492, 16, 64, 46, "Pre-Roll", "plays in player", grF, gr, "skip after 5s") +
      ln(88, 39, 94, 39, "", bl, "ab") + ln(182, 39, 188, 39, "request", bl, "ab") +
      ln(286, 39, 292, 39, "", pu, "ap") + ln(390, 39, 396, 39, "VAST", gr, "ag") +
      ln(484, 39, 490, 39, "", gr, "ag") +
      // VAST structure callout
      `<rect x="398" y="66" width="86" height="68" rx="4" fill="#fef3c7" stroke="${or}" stroke-width="1"/>` +
      `<text x="441" y="77" text-anchor="middle" font-size="7" fill="${or}" font-weight="700">VAST XML:</text>` +
      `<text x="441" y="88" text-anchor="middle" font-size="6.5" fill="${st}">&lt;MediaFile&gt; mp4/webm</text>` +
      `<text x="441" y="99" text-anchor="middle" font-size="6.5" fill="${st}">&lt;Impression&gt; pixel</text>` +
      `<text x="441" y="110" text-anchor="middle" font-size="6.5" fill="${st}">&lt;TrackingEvents&gt;</text>` +
      `<text x="441" y="121" text-anchor="middle" font-size="6.5" fill="${st}">&lt;VideoClicks&gt;</text>` +
      // Row 2: tracking
      bx(2, 118, 96, 44, "Quartile Events", "0% 25% 50% 75% 100%", blF, bl, "pixel fires per mark") +
      bx(106, 118, 96, 44, "Viewability", "VPAID / OM SDK", blF, bl, "IAS · DV measure") +
      bx(210, 118, 96, 44, "Skip Tracked", "if viewer skips", puF, pu, "skip counted, no charge") +
      bx(314, 118, 96, 44, "Attribution", "view-through", puF, pu, "30-day window") +
      bx(418, 118, 96, 44, "Google Ads", "campaign stats", grF, gr, "VTR, CPV, ROAS") +
      ln(98, 140, 104, 140, "", bl, "ab") + ln(202, 140, 208, 140, "", bl, "ab") +
      ln(306, 140, 312, 140, "", pu, "ap") + ln(410, 140, 416, 140, "", gr, "ag") +
      `<text x="2" y="186" font-size="6.5" fill="${mu}">IMA = Interactive Media Ads SDK · VAST = Video Ad Serving Template · PAL = Programmatic Access Library · VTR = View-Through Rate · CPV = Cost Per View · OM SDK = Open Measurement SDK</text>` +
      `</svg>`;
  }

  if (id === "web-display") {
    const W = 560, H = 250;
    return `<div class='flow-title'>Web Display Banner: Prebid.js Header Bidding in Detail</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}` +
      // Row 1: page to auction
      bx(2, 16, 82, 46, "Page Load", "Prebid.js in &lt;head&gt;", blF, bl, "&lt;5ms timeout set") +
      bx(92, 16, 82, 46, "Parallel Bids", "SSPs called at once", blF, bl, "Magnite, PubMatic, IX") +
      bx(182, 16, 90, 46, "DSPs Respond", "&lt;80ms timeout", puF, pu, "RTB bids returned") +
      bx(280, 16, 90, 46, "Bid Collected", "highest wins", puF, pu, "sent to GAM as key-val") +
      bx(378, 16, 90, 46, "GAM Decision", "direct vs prog?", puF, pu, "line item priority") +
      bx(476, 16, 80, 46, "Creative", "iframe renders", grF, gr, "300×250, 728×90") +
      ln(84, 39, 90, 39, "~5ms", bl, "ab") + ln(174, 39, 180, 39, "bids", bl, "ab") +
      ln(272, 39, 278, 39, "", pu, "ap") + ln(370, 39, 376, 39, "", pu, "ap") +
      ln(468, 39, 474, 39, "", gr, "ag") +
      // Parallel bids callout
      `<rect x="92" y="66" width="82" height="58" rx="4" fill="#f0f9ff" stroke="${bl}" stroke-width="1"/>` +
      `<text x="133" y="77" text-anchor="middle" font-size="7" fill="${bl}" font-weight="700">Parallel requests:</text>` +
      `<text x="133" y="88" text-anchor="middle" font-size="7" fill="${st}">Magnite → $7.10</text>` +
      `<text x="133" y="99" text-anchor="middle" font-size="7" fill="${st}">PubMatic → $6.50</text>` +
      `<text x="133" y="110" text-anchor="middle" font-size="7" fill="${st}">Index Exch → $5.90</text>` +
      // Row 2: viewability + conversion
      bx(2, 140, 96, 44, "Ad Loads", "iframe content", blF, bl, "JS tag executes") +
      bx(106, 140, 96, 44, "Viewability", "IAS / Moat tag", blF, bl, "50% visible, 1 sec") +
      bx(210, 140, 96, 44, "Click", "redirect chain", blF, bl, "click tracker URL") +
      bx(314, 140, 96, 44, "Conversion Px", "fires on thank-you", puF, pu, "1×1 pixel or JS") +
      bx(418, 140, 136, 44, "Attribution", "CM360 / SA360 report", grF, gr, "ROAS, CPA, reach") +
      ln(98, 162, 104, 162, "", bl, "ab") + ln(202, 162, 208, 162, "", bl, "ab") +
      ln(306, 162, 312, 162, "", pu, "ap") + ln(410, 162, 416, 162, "", gr, "ag") +
      `<text x="2" y="206" font-size="6.5" fill="${mu}">GAM = Google Ad Manager · IX = Index Exchange · key-val = key-value pair used to route bids in GAM · CM360 = Campaign Manager 360 · Prebid.js = open-source header bidding wrapper</text>` +
      `</svg>`;
  }

  if (id === "video-player") {
    const W = 560, H = 250;
    return `<div class='flow-title'>CTV / Streaming: SCTE-35 Cues → SSAI → Server-Side Beacons</div>` +
      `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}` +
      // Row 1: break detection to stitching
      bx(2, 16, 88, 46, "Content Stream", "HLS/DASH manifest", blF, bl, "live or VOD") +
      bx(98, 16, 86, 46, "SCTE-35 Cue", "break opportunity", blF, bl, "splice_insert msg") +
      bx(192, 16, 92, 46, "ADS Request", "context + user ID", puF, pu, "ACR data + IP + FA") +
      bx(292, 16, 92, 46, "Ad Auction", "SSP/DSP bid", puF, pu, "OpenRTB CTV req") +
      bx(392, 16, 84, 46, "SSAI Server", "stitches manifest", puF, pu, "Yospace · Verizon") +
      bx(484, 16, 72, 46, "Player", "seamless play", grF, gr, "no buffering gap") +
      ln(90, 39, 96, 39, "", bl, "ab") + ln(184, 39, 190, 39, "cue!", bl, "ab") +
      ln(284, 39, 290, 39, "", pu, "ap") + ln(384, 39, 390, 39, "ad URL", pu, "ap") +
      ln(476, 39, 482, 39, "", gr, "ag") +
      // SSAI callout
      `<rect x="392" y="66" width="84" height="66" rx="4" fill="#faf5ff" stroke="${pu}" stroke-width="1"/>` +
      `<text x="434" y="77" text-anchor="middle" font-size="7" fill="${pu}" font-weight="700">SSAI stitches:</text>` +
      `<text x="434" y="88" text-anchor="middle" font-size="6.5" fill="${st}">1. Fetch ad media file</text>` +
      `<text x="434" y="99" text-anchor="middle" font-size="6.5" fill="${st}">2. Transcode to match</text>` +
      `<text x="434" y="110" text-anchor="middle" font-size="6.5" fill="${st}">3. Splice into manifest</text>` +
      `<text x="434" y="121" text-anchor="middle" font-size="6.5" fill="${st}">4. Rewrite segment URLs</text>` +
      // Row 2: tracking + identity
      bx(2, 140, 96, 46, "Server Beacon", "impression logged", blF, bl, "server-to-server") +
      bx(106, 140, 96, 46, "Quartile Fires", "0/25/50/75/100%", blF, bl, "no client pixel needed") +
      bx(210, 140, 96, 46, "Freq Cap Update", "user+device profile", puF, pu, "Redis / identity svc") +
      bx(314, 140, 100, 46, "ACR Matching", "show + ad overlap", puF, pu, "Samba TV · LG Ads") +
      bx(422, 140, 132, 46, "Attribution", "HH lift / tune-in", grF, gr, "iSpot · VideoAmp") +
      ln(98, 163, 104, 163, "", bl, "ab") + ln(202, 163, 208, 163, "", bl, "ab") +
      ln(306, 163, 312, 163, "", pu, "ap") + ln(414, 163, 420, 163, "", gr, "ag") +
      `<text x="2" y="206" font-size="6.5" fill="${mu}">SCTE-35 = digital program insertion standard · SSAI = Server-Side Ad Insertion · ADS = Ad Decision Server · ACR = Automatic Content Recognition · FA = Fingerprinting/Advertising ID</text>` +
      `</svg>`;
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
  const W = 260, H = 160;
  const bl = "#0284c7", blF = "#e0f2fe", blD = "#0c4a6e";
  const gr = "#16a34a", grF = "#dcfce7";
  const pu = "#7c3aed", puF = "#ede9fe";
  const or = "#d97706", orF = "#fef3c7";
  const rd = "#dc2626", rdF = "#fee2e2";
  const st = "#475569", mu = "#94a3b8";
  const mk = (mid: string, c: string) =>
    `<defs><marker id="${mid}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="${c}"/></marker></defs>`;

  const svgs: Record<GlossaryId, string> = {
    yield: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Yield optimization curve</title>
      ${mk("a",bl)}
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Yield = Revenue / Available Inventory</text>
      <line x1="20" y1="140" x2="250" y2="140" stroke="${st}" stroke-width="1"/>
      <line x1="20" y1="20" x2="20" y2="140" stroke="${st}" stroke-width="1"/>
      <text x="130" y="155" text-anchor="middle" font-size="8" fill="${st}">Time / Impressions</text>
      <text x="10" y="80" text-anchor="middle" font-size="8" fill="${st}" transform="rotate(-90 10 80)">CPM $</text>
      <path fill="none" stroke="${bl}" stroke-width="2" d="M25 130 Q60 120 90 100 Q130 75 160 55 Q190 40 230 30"/>
      <circle cx="230" cy="30" r="4" fill="${bl}"/>
      <text x="235" y="34" font-size="8" fill="${bl}">$12 CPM</text>
      <path fill="none" stroke="${or}" stroke-width="1.5" stroke-dasharray="4,2" d="M25 135 Q80 130 130 125 Q170 122 230 120"/>
      <text x="235" y="124" font-size="8" fill="${or}">floor</text>
      <text x="25" y="130" font-size="7" fill="${mu}">unfilled</text>
      <text x="160" y="50" font-size="7" fill="${blD}">optimized</text></svg>`,

    inventory: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Ad inventory slots</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Inventory = Available Ad Slots</text>
      <rect x="10" y="25" width="230" height="90" rx="6" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="125" y="38" text-anchor="middle" font-size="8" fill="${st}">Publisher Page Layout</text>
      <rect x="18" y="45" width="214" height="18" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="125" y="58" text-anchor="middle" font-size="8" fill="${bl}">Leaderboard 728×90 — $8.40 CPM</text>
      <rect x="18" y="68" width="100" height="40" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="68" y="82" text-anchor="middle" font-size="8" fill="${bl}">Rectangle</text>
      <text x="68" y="93" text-anchor="middle" font-size="7" fill="${bl}">300×250 · $6.20</text>
      <rect x="128" y="68" width="104" height="40" rx="3" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="180" y="82" text-anchor="middle" font-size="8" fill="${gr}">Video Slot</text>
      <text x="180" y="93" text-anchor="middle" font-size="7" fill="${gr}">16:9 · $18.00 CPM</text>
      <text x="8" y="130" font-size="7" fill="${mu}">Unsold slots = wasted revenue → SSP &amp; header bidding maximize fill rate</text></svg>`,

    dsp: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Demand-Side Platform</title>
      ${mk("a",bl)}
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">DSP: Demand-Side Platform</text>
      <rect x="8" y="22" width="70" height="50" rx="5" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="43" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Campaign</text>
      <text x="43" y="52" text-anchor="middle" font-size="7" fill="${st}">audience rules</text>
      <text x="43" y="63" text-anchor="middle" font-size="7" fill="${st}">max CPM: $12</text>
      <rect x="92" y="22" width="80" height="50" rx="5" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="132" y="40" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">DSP Engine</text>
      <text x="132" y="52" text-anchor="middle" font-size="7" fill="${st}">bid model: pCTR</text>
      <text x="132" y="63" text-anchor="middle" font-size="7" fill="${st}">× value = $8.40</text>
      <rect x="186" y="22" width="66" height="50" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="219" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Exchange</text>
      <text x="219" y="52" text-anchor="middle" font-size="7" fill="${st}">sends bid</text>
      <text x="219" y="63" text-anchor="middle" font-size="7" fill="${st}">req JSON</text>
      <path stroke="${bl}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M78 47 L90 47"/>
      <path stroke="${pu}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M172 47 L184 47"/>
      <text x="8" y="88" font-size="7" fill="${mu}">Brands: The Trade Desk · Google DV360 · Amazon DSP · Xandr</text>
      <text x="8" y="100" font-size="7" fill="${mu}">Key stat: DSPs evaluate 1M+ impressions/sec per bidder</text>
      <text x="8" y="112" font-size="7" fill="${mu}">&lt;100ms end-to-end from bid request to creative served</text></svg>`,

    ssp: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Supply-Side Platform</title>
      ${mk("a",gr)}
      <text x="8" y="14" font-size="9" fill="${gr}" font-weight="700">SSP: Supply-Side Platform</text>
      <rect x="8" y="22" width="68" height="45" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="42" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Publisher</text>
      <text x="42" y="52" text-anchor="middle" font-size="7" fill="${st}">ad slot, floor $4</text>
      <rect x="90" y="18" width="80" height="52" rx="5" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="130" y="35" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">SSP</text>
      <text x="130" y="47" text-anchor="middle" font-size="7" fill="${st}">packages slot</text>
      <text x="130" y="58" text-anchor="middle" font-size="7" fill="${st}">sets floor, rules</text>
      <rect x="184" y="22" width="70" height="20" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="219" y="36" text-anchor="middle" font-size="7" fill="${bl}">DSP A: $7.10</text>
      <rect x="184" y="46" width="70" height="20" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="219" y="60" text-anchor="middle" font-size="7" fill="${bl}">DSP B: $6.20</text>
      <path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M76 44 L88 44"/>
      <path stroke="${pu}" stroke-width="1.2" fill="none" d="M170 35 L182 32"/>
      <path stroke="${pu}" stroke-width="1.2" fill="none" d="M170 53 L182 56"/>
      <text x="8" y="88" font-size="7" fill="${mu}">Brands: Magnite · PubMatic · OpenX · Index Exchange · Freewheel</text>
      <text x="8" y="100" font-size="7" fill="${mu}">SSP controls: floor prices, deal priority, DSP blocklists</text>
      <text x="8" y="112" font-size="7" fill="${mu}">Header bidding lets SSPs compete simultaneously for each impression</text></svg>`,

    rtb: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Real-Time Bidding auction</title>
      ${mk("a",pu)}
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">RTB: Real-Time Bidding (&lt;100ms)</text>
      <rect x="8" y="20" width="244" height="18" rx="3" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="14" y="32" font-size="7" fill="${mu}">0ms</text><text x="60" y="32" font-size="7" fill="${mu}">30ms</text>
      <text x="115" y="32" font-size="7" fill="${mu}">80ms</text><text x="175" y="32" font-size="7" fill="${mu}">100ms</text><text x="220" y="32" font-size="7" fill="${mu}">150ms</text>
      <rect x="8" y="42" width="45" height="30" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="30" y="54" text-anchor="middle" font-size="7" font-weight="600" fill="${blD}">Page</text>
      <text x="30" y="65" text-anchor="middle" font-size="6.5" fill="${st}">loads slot</text>
      <rect x="62" y="42" width="50" height="30" rx="4" fill="${puF}" stroke="${pu}" stroke-width="1.5"/>
      <text x="87" y="54" text-anchor="middle" font-size="7" font-weight="600" fill="${pu}">Exchange</text>
      <text x="87" y="65" text-anchor="middle" font-size="6.5" fill="${st}">bid request</text>
      <rect x="121" y="42" width="50" height="30" rx="4" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="146" y="54" text-anchor="middle" font-size="7" font-weight="600" fill="${pu}">DSPs bid</text>
      <text x="146" y="65" text-anchor="middle" font-size="6.5" fill="${st}">pCTR × value</text>
      <rect x="180" y="42" width="50" height="30" rx="4" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="205" y="54" text-anchor="middle" font-size="7" font-weight="600" fill="${gr}">Winner</text>
      <text x="205" y="65" text-anchor="middle" font-size="6.5" fill="${st}">ad renders</text>
      <path stroke="${pu}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M53 57 L60 57"/>
      <path stroke="${pu}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M112 57 L119 57"/>
      <path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M171 57 L178 57"/>
      <text x="8" y="90" font-size="7" fill="${mu}">OpenRTB spec: bid request (imp, site, user) → bid response (seatbid, price, adm)</text>
      <text x="8" y="102" font-size="7" fill="${mu}">2nd price auction: winner pays 2nd-highest bid + $0.01</text>
      <text x="8" y="114" font-size="7" fill="${mu}">1st price (now common): winner pays their own bid</text></svg>`,

    "data-lake": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Data lake architecture</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Data Lake → Warehouse → Features</text>
      <rect x="8" y="22" width="58" height="36" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="37" y="36" text-anchor="middle" font-size="7" font-weight="600" fill="${blD}">Raw Events</text>
      <text x="37" y="48" text-anchor="middle" font-size="6.5" fill="${st}">S3 · GCS</text>
      <rect x="74" y="22" width="58" height="36" rx="4" fill="${orF}" stroke="${or}" stroke-width="1.5"/>
      <text x="103" y="36" text-anchor="middle" font-size="7" font-weight="600" fill="${or}">ETL</text>
      <text x="103" y="48" text-anchor="middle" font-size="6.5" fill="${st}">Spark · Flink</text>
      <rect x="140" y="22" width="58" height="36" rx="4" fill="${puF}" stroke="${pu}" stroke-width="1.5"/>
      <text x="169" y="36" text-anchor="middle" font-size="7" font-weight="600" fill="${pu}">Warehouse</text>
      <text x="169" y="48" text-anchor="middle" font-size="6.5" fill="${st}">Snowflake · BQ</text>
      <rect x="206" y="22" width="48" height="36" rx="4" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="230" y="36" text-anchor="middle" font-size="7" font-weight="600" fill="${gr}">Features</text>
      <text x="230" y="48" text-anchor="middle" font-size="6.5" fill="${st}">Redis · Feast</text>
      <line x1="66" y1="40" x2="72" y2="40" stroke="${bl}" stroke-width="1.5" marker-end="url(#a)"/>
      <line x1="132" y1="40" x2="138" y2="40" stroke="${or}" stroke-width="1.5" marker-end="url(#a)"/>
      <line x1="198" y1="40" x2="204" y2="40" stroke="${pu}" stroke-width="1.5" marker-end="url(#a)"/>
      ${mk("a",bl)}
      <text x="8" y="76" font-size="7" fill="${mu}">Data lake: raw, immutable Parquet/ORC files by date partition</text>
      <text x="8" y="88" font-size="7" fill="${mu}">ETL runs hourly batch + real-time streaming (Kafka → Flink)</text>
      <text x="8" y="100" font-size="7" fill="${mu}">Feature store: serves bid-time scores in &lt;5ms via Redis</text>
      <text x="8" y="112" font-size="7" fill="${mu}">Scale: ad-tech generates 10s of TB/day in raw bid logs</text></svg>`,

    "identity-graph": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Identity graph: linking user IDs</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Identity Graph: One Person, Many IDs</text>
      <circle cx="130" cy="65" r="22" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="130" y="61" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">Person</text>
      <text x="130" y="73" text-anchor="middle" font-size="7" fill="${pu}">RampID</text>
      <circle cx="40" cy="40" r="18" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="40" y="37" text-anchor="middle" font-size="7" fill="${blD}">Cookie</text>
      <text x="40" y="48" text-anchor="middle" font-size="6.5" fill="${bl}">3P dying</text>
      <circle cx="220" cy="40" r="18" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="220" y="37" text-anchor="middle" font-size="7" fill="${blD}">Email</text>
      <text x="220" y="48" text-anchor="middle" font-size="6.5" fill="${bl}">hashed SHA256</text>
      <circle cx="40" cy="100" r="18" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="40" y="97" text-anchor="middle" font-size="7" fill="${blD}">IDFA</text>
      <text x="40" y="108" text-anchor="middle" font-size="6.5" fill="${bl}">iOS device ID</text>
      <circle cx="220" cy="100" r="18" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="220" y="97" text-anchor="middle" font-size="7" fill="${blD}">IP + UA</text>
      <text x="220" y="108" text-anchor="middle" font-size="6.5" fill="${bl}">probabilistic</text>
      <line x1="58" y1="48" x2="112" y2="58" stroke="${pu}" stroke-width="1.2"/>
      <line x1="200" y1="48" x2="150" y2="56" stroke="${pu}" stroke-width="1.2"/>
      <line x1="58" y1="94" x2="112" y2="74" stroke="${pu}" stroke-width="1.2"/>
      <line x1="200" y1="94" x2="150" y2="76" stroke="${pu}" stroke-width="1.2"/>
      <text x="8" y="132" font-size="7" fill="${mu}">Deterministic: same email on two devices = same person</text>
      <text x="8" y="144" font-size="7" fill="${mu}">Probabilistic: shared IP + browser fingerprint = likely same</text></svg>`,

    attribution: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Ad attribution models</title>
      ${mk("a",bl)}
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Attribution: Which Ad Gets Credit?</text>
      <text x="8" y="28" font-size="7.5" fill="${st}" font-weight="600">Last-Click Model</text>
      <rect x="8" y="33" width="30" height="16" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="23" y="44" text-anchor="middle" font-size="7" fill="${blD}">Display</text>
      <rect x="44" y="33" width="30" height="16" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="59" y="44" text-anchor="middle" font-size="7" fill="${blD}">Social</text>
      <rect x="80" y="33" width="30" height="16" rx="3" fill="#bae6fd" stroke="${bl}" stroke-width="2"/>
      <text x="95" y="44" text-anchor="middle" font-size="7" font-weight="700" fill="${blD}">Search</text>
      <text x="95" y="56" text-anchor="middle" font-size="7" fill="${bl}">100% credit</text>
      <rect x="118" y="33" width="32" height="16" rx="3" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="134" y="44" text-anchor="middle" font-size="7" fill="${gr}">CONVERT</text>
      <text x="8" y="70" font-size="7.5" fill="${st}" font-weight="600">MTA (Data-Driven) Model</text>
      <rect x="8" y="75" width="30" height="16" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="23" y="86" text-anchor="middle" font-size="7" fill="${blD}">15%</text>
      <rect x="44" y="75" width="30" height="16" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="59" y="86" text-anchor="middle" font-size="7" fill="${blD}">30%</text>
      <rect x="80" y="75" width="30" height="16" rx="3" fill="#bae6fd" stroke="${bl}" stroke-width="2"/>
      <text x="95" y="86" text-anchor="middle" font-size="7" font-weight="700" fill="${blD}">55%</text>
      <rect x="118" y="75" width="32" height="16" rx="3" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="134" y="86" text-anchor="middle" font-size="7" fill="${gr}">CONVERT</text>
      <text x="8" y="108" font-size="7" fill="${mu}">MTA uses Shapley values or logistic regression on full path</text>
      <text x="8" y="120" font-size="7" fill="${mu}">MMM: econometric regression across channels + external factors</text>
      <text x="8" y="132" font-size="7" fill="${mu}">Incrementality: A/B holdout group proves causal lift</text></svg>`,

    "clean-room": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Clean room: privacy-safe data matching</title>
      ${mk("a",pu)}
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">Clean Room: Join Data Without Sharing PII</text>
      <rect x="8" y="22" width="72" height="50" rx="5" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="44" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Advertiser</text>
      <text x="44" y="50" text-anchor="middle" font-size="7" fill="${st}">CRM: emails</text>
      <text x="44" y="62" text-anchor="middle" font-size="7" fill="${st}">purchase data</text>
      <rect x="94" y="18" width="72" height="58" rx="5" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="130" y="36" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">Clean Room</text>
      <text x="130" y="48" text-anchor="middle" font-size="7" fill="${st}">Snowflake · ADH</text>
      <text x="130" y="60" text-anchor="middle" font-size="7" fill="${st}">AWS · InfoSum</text>
      <text x="130" y="70" text-anchor="middle" font-size="7" fill="${pu}">no raw PII exits</text>
      <rect x="180" y="22" width="72" height="50" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="216" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Publisher</text>
      <text x="216" y="50" text-anchor="middle" font-size="7" fill="${st}">user IDs</text>
      <text x="216" y="62" text-anchor="middle" font-size="7" fill="${st}">impression log</text>
      <path stroke="${bl}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M80 47 L92 47"/>
      <path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M180 47 L168 47"/>
      <text x="8" y="92" font-size="7" fill="${mu}">Output: aggregate overlap counts, reach, frequency — never raw rows</text>
      <text x="8" y="104" font-size="7" fill="${mu}">Used for: audience overlap, attribution, campaign analysis</text>
      <text x="8" y="116" font-size="7" fill="${mu}">Compliance: GDPR/CCPA safe — PII stays inside each party's env</text></svg>`,

    currency: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>TV currency measurement</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">TV Currency: How Audiences Are Counted</text>
      <rect x="8" y="22" width="72" height="46" rx="5" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="44" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Nielsen</text>
      <text x="44" y="50" text-anchor="middle" font-size="7" fill="${st}">30K HH panel</text>
      <text x="44" y="62" text-anchor="middle" font-size="7" fill="${st}">C3 / C7 ratings</text>
      <rect x="94" y="22" width="72" height="46" rx="5" fill="${orF}" stroke="${or}" stroke-width="1.5"/>
      <text x="130" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${or}">VideoAmp</text>
      <text x="130" y="50" text-anchor="middle" font-size="7" fill="${st}">STB + ACR</text>
      <text x="130" y="62" text-anchor="middle" font-size="7" fill="${st}">millions of HH</text>
      <rect x="180" y="22" width="72" height="46" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="216" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">iSpot.tv</text>
      <text x="216" y="50" text-anchor="middle" font-size="7" fill="${st}">ACR + outcomes</text>
      <text x="216" y="62" text-anchor="middle" font-size="7" fill="${st}">real-time verify</text>
      <text x="8" y="84" font-size="7" fill="${mu}">C3 = live + 3-day DVR viewing; C7 = live + 7-day DVR viewing</text>
      <text x="8" y="96" font-size="7" fill="${mu}">Currency = the agreed measurement standard used for TV deal pricing</text>
      <text x="8" y="108" font-size="7" fill="${mu}">Networks sell GRPs (gross rating points) based on currency estimates</text>
      <text x="8" y="120" font-size="7" fill="${mu}">~$20B in TV upfront deals use currency-based guarantees annually</text></svg>`,

    upfronts: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>TV upfronts annual market</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">TV Upfronts: Annual Buying Commitments</text>
      <rect x="8" y="22" width="58" height="42" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="37" y="38" text-anchor="middle" font-size="8" font-weight="700" fill="${blD}">May</text>
      <text x="37" y="50" text-anchor="middle" font-size="7" fill="${st}">networks</text>
      <text x="37" y="61" text-anchor="middle" font-size="7" fill="${st}">present shows</text>
      <rect x="72" y="22" width="58" height="42" rx="4" fill="${puF}" stroke="${pu}" stroke-width="1.5"/>
      <text x="101" y="38" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">June</text>
      <text x="101" y="50" text-anchor="middle" font-size="7" fill="${st}">buyers negotiate</text>
      <text x="101" y="61" text-anchor="middle" font-size="7" fill="${st}">CPM + volume</text>
      <rect x="136" y="22" width="58" height="42" rx="4" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="165" y="38" text-anchor="middle" font-size="8" font-weight="700" fill="${gr}">July</text>
      <text x="165" y="50" text-anchor="middle" font-size="7" fill="${st}">deals close</text>
      <text x="165" y="61" text-anchor="middle" font-size="7" fill="${st}">$20B+ committed</text>
      <rect x="200" y="22" width="52" height="42" rx="4" fill="${orF}" stroke="${or}" stroke-width="1.5"/>
      <text x="226" y="38" text-anchor="middle" font-size="8" font-weight="700" fill="${or}">Scatter</text>
      <text x="226" y="50" text-anchor="middle" font-size="7" fill="${st}">remaining</text>
      <text x="226" y="61" text-anchor="middle" font-size="7" fill="${st}">inventory sold</text>
      <text x="8" y="80" font-size="7" fill="${mu}">Upfronts dominate TV but streaming is shifting buyers to programmatic</text>
      <text x="8" y="92" font-size="7" fill="${mu}">Make-goods: networks deliver bonus impressions if ratings miss guarantees</text>
      <text x="8" y="104" font-size="7" fill="${mu}">Digital upfronts (NewFronts) happen in parallel for streaming platforms</text></svg>`,

    pixel: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Ad pixel tracking beacon</title>
      ${mk("a",bl)}
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Ad Pixel: 1×1 Invisible Tracking Beacon</text>
      <rect x="8" y="22" width="70" height="50" rx="4" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="43" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${st}">Publisher</text>
      <text x="43" y="50" text-anchor="middle" font-size="7" fill="${st}">Page renders</text>
      <rect x="90" y="28" width="8" height="8" rx="1" fill="${bl}"/>
      <text x="94" y="42" text-anchor="middle" font-size="7" fill="${bl}">1×1px</text>
      <text x="94" y="52" text-anchor="middle" font-size="7" fill="${bl}">pixel fires</text>
      <rect x="112" y="22" width="70" height="50" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="147" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Ad Server</text>
      <text x="147" y="50" text-anchor="middle" font-size="7" fill="${st}">logs: user-id</text>
      <text x="147" y="62" text-anchor="middle" font-size="7" fill="${st}">ts, IP, referer</text>
      <rect x="196" y="22" width="56" height="50" rx="4" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="224" y="38" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Pipeline</text>
      <text x="224" y="50" text-anchor="middle" font-size="7" fill="${st}">Kafka → S3</text>
      <text x="224" y="62" text-anchor="middle" font-size="7" fill="${st}">attribution</text>
      <path stroke="${bl}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M78 47 L88 32"/>
      <path stroke="${bl}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M99 47 L110 47"/>
      <path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M182 47 L194 47"/>
      <text x="8" y="88" font-size="7" fill="${mu}">Impression pixel: fires when ad renders · Click pixel: fires on click</text>
      <text x="8" y="100" font-size="7" fill="${mu}">Conversion pixel: fires on thank-you page, measures purchase</text>
      <text x="8" y="112" font-size="7" fill="${mu}">Server-to-server (CAPI): avoids ITP/iOS blocking of browser pixels</text></svg>`,

    vast: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>VAST: Video Ad Serving Template</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">VAST XML: Video Ad Delivery Contract</text>
      <rect x="8" y="20" width="120" height="100" rx="5" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="16" y="33" font-size="7" fill="${pu}" font-weight="700">&lt;VAST version="4.2"&gt;</text>
      <text x="20" y="44" font-size="7" fill="${st}">&lt;Ad&gt;&lt;InLine&gt;</text>
      <text x="24" y="55" font-size="7" fill="${bl}">&lt;MediaFile&gt;</text>
      <text x="28" y="64" font-size="6.5" fill="${or}">mp4 URL here</text>
      <text x="24" y="74" font-size="7" fill="${bl}">&lt;Impression&gt;</text>
      <text x="28" y="83" font-size="6.5" fill="${or}">pixel URL</text>
      <text x="24" y="93" font-size="7" fill="${bl}">&lt;Tracking&gt;</text>
      <text x="28" y="102" font-size="6.5" fill="${or}">start/Q1/Q2/Q3/complete</text>
      <text x="16" y="113" font-size="7" fill="${pu}" font-weight="700">&lt;/VAST&gt;</text>
      <rect x="140" y="28" width="112" height="30" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="196" y="42" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Video Player</text>
      <text x="196" y="54" text-anchor="middle" font-size="7" fill="${st}">IMA SDK parses VAST</text>
      <rect x="140" y="68" width="112" height="24" rx="4" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="196" y="78" text-anchor="middle" font-size="7" fill="${gr}">Quartile beacons fire:</text>
      <text x="196" y="89" text-anchor="middle" font-size="7" fill="${gr}">0% 25% 50% 75% 100%</text>
      <text x="8" y="135" font-size="7" fill="${mu}">VAST 4.2 adds: SIMID, universal ad ID, viewability</text>
      <text x="8" y="147" font-size="7" fill="${mu}">VMAP: playlist of multiple VAST ads for ad pods</text></svg>`,

    "header-bidding": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Header bidding parallel auctions</title>
      ${mk("a",bl)}
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Header Bidding: Parallel vs Waterfall</text>
      <rect x="82" y="20" width="96" height="26" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="130" y="30" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Publisher (Prebid.js)</text>
      <text x="130" y="41" text-anchor="middle" font-size="7" fill="${st}">calls all SSPs simultaneously</text>
      <path stroke="${bl}" stroke-width="1.2" fill="none" d="M130 46 L50 70"/>
      <path stroke="${bl}" stroke-width="1.2" fill="none" d="M130 46 L130 70"/>
      <path stroke="${bl}" stroke-width="1.2" fill="none" d="M130 46 L210 70"/>
      <rect x="16" y="70" width="68" height="34" rx="4" fill="#f0fdf4" stroke="${gr}" stroke-width="1.5"/>
      <text x="50" y="83" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Magnite</text>
      <text x="50" y="95" text-anchor="middle" font-size="7" fill="${st}">bid: $7.10 ✓</text>
      <rect x="96" y="70" width="68" height="34" rx="4" fill="#f0fdf4" stroke="${gr}" stroke-width="1.5"/>
      <text x="130" y="83" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">PubMatic</text>
      <text x="130" y="95" text-anchor="middle" font-size="7" fill="${st}">bid: $6.20</text>
      <rect x="176" y="70" width="68" height="34" rx="4" fill="#f0fdf4" stroke="${gr}" stroke-width="1.5"/>
      <text x="210" y="83" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Index Exch</text>
      <text x="210" y="95" text-anchor="middle" font-size="7" fill="${st}">bid: $5.80</text>
      <text x="8" y="120" font-size="7" fill="${mu}">All bids collected in ~200ms → highest sent to GAM as key-value</text>
      <text x="8" y="132" font-size="7" fill="${mu}">vs. Waterfall: SSPs called one by one (slow, lower yield)</text>
      <text x="8" y="144" font-size="7" fill="${mu}">Server-side header bidding (SSHB): Prebid Server runs in cloud</text></svg>`,

    creative: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Ad creative formats</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Ad Creative Formats</text>
      <rect x="8" y="20" width="72" height="46" rx="4" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="44" y="36" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Banner</text>
      <text x="44" y="48" text-anchor="middle" font-size="7" fill="${st}">300×250 HTML5</text>
      <text x="44" y="59" text-anchor="middle" font-size="7" fill="${st}">IAB standard</text>
      <rect x="88" y="20" width="72" height="46" rx="4" fill="${puF}" stroke="${pu}" stroke-width="1.5"/>
      <path fill="${pu}" d="M116 36 L116 52 L130 44 Z"/>
      <text x="145" y="44" text-anchor="middle" font-size="8" font-weight="600" fill="${pu}">Video</text>
      <text x="145" y="56" text-anchor="middle" font-size="7" fill="${st}">VAST/VPAID</text>
      <rect x="168" y="20" width="84" height="46" rx="4" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="210" y="35" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Native</text>
      <text x="210" y="47" text-anchor="middle" font-size="7" fill="${st}">headline + img</text>
      <text x="210" y="58" text-anchor="middle" font-size="7" fill="${st}">matches feed UI</text>
      <text x="8" y="82" font-size="7" fill="${mu}">DCO = Dynamic Creative Optimization: real-time personalized assembly</text>
      <text x="8" y="94" font-size="7" fill="${mu}">Rich media: expandable, interactive, 360° video, HTML5 animated</text>
      <text x="8" y="106" font-size="7" fill="${mu}">Creative specs: size (px), file weight (KB), format (HTML/mp4)</text>
      <text x="8" y="118" font-size="7" fill="${mu}">Creative audit: Google, Meta review for policy before serving</text></svg>`,

    cpm: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>CPM cost per mille pricing</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">CPM &amp; Related Pricing Models</text>
      <rect x="8" y="22" width="56" height="50" rx="5" fill="${blF}" stroke="${bl}" stroke-width="2"/>
      <text x="36" y="42" text-anchor="middle" font-size="14" font-weight="700" fill="${bl}">CPM</text>
      <text x="36" y="56" text-anchor="middle" font-size="7" fill="${st}">per 1,000 imps</text>
      <text x="36" y="66" text-anchor="middle" font-size="7" fill="${bl}">$5–$50 typical</text>
      <rect x="72" y="22" width="56" height="50" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="100" y="42" text-anchor="middle" font-size="14" font-weight="700" fill="${gr}">CPC</text>
      <text x="100" y="56" text-anchor="middle" font-size="7" fill="${st}">per click</text>
      <text x="100" y="66" text-anchor="middle" font-size="7" fill="${gr}">$0.10–$10</text>
      <rect x="136" y="22" width="56" height="50" rx="5" fill="${orF}" stroke="${or}" stroke-width="1.5"/>
      <text x="164" y="42" text-anchor="middle" font-size="13" font-weight="700" fill="${or}">CPA</text>
      <text x="164" y="56" text-anchor="middle" font-size="7" fill="${st}">per action</text>
      <text x="164" y="66" text-anchor="middle" font-size="7" fill="${or}">conversion</text>
      <rect x="200" y="22" width="52" height="50" rx="5" fill="${puF}" stroke="${pu}" stroke-width="1.5"/>
      <text x="226" y="42" text-anchor="middle" font-size="13" font-weight="700" fill="${pu}">CPV</text>
      <text x="226" y="56" text-anchor="middle" font-size="7" fill="${st}">per view</text>
      <text x="226" y="66" text-anchor="middle" font-size="7" fill="${pu}">video only</text>
      <text x="8" y="90" font-size="7" fill="${mu}">CPM formula: (Total Cost ÷ Impressions) × 1,000</text>
      <text x="8" y="102" font-size="7" fill="${mu}">eCPM: effective CPM, normalizes CPC/CPA to compare</text>
      <text x="8" y="114" font-size="7" fill="${mu}">Display: $2–8 CPM · Video: $10–30 · CTV: $25–60 · Search: CPC</text></svg>`,

    "open-rtb": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>OpenRTB protocol</title>
      ${mk("a",pu)}
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">OpenRTB: The Bid Request/Response Contract</text>
      <rect x="8" y="20" width="110" height="100" rx="5" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="63" y="33" text-anchor="middle" font-size="7" fill="${pu}" font-weight="700">BidRequest JSON</text>
      <text x="14" y="45" font-size="6.5" fill="${st}">"id": "abc123"</text>
      <text x="14" y="56" font-size="6.5" fill="${bl}">"imp": [{banner: {w,h}}</text>
      <text x="14" y="67" font-size="6.5" fill="${bl}">"site": {domain, cat}</text>
      <text x="14" y="78" font-size="6.5" fill="${gr}">"user": {id, buyeruid}</text>
      <text x="14" y="89" font-size="6.5" fill="${or}">"device": {ua, ip, geo}</text>
      <text x="14" y="100" font-size="6.5" fill="${rd}">"regs": {gdpr, us_privacy}</text>
      <text x="14" y="111" font-size="6.5" fill="${st}">"tmax": 100 (ms)</text>
      <rect x="142" y="20" width="110" height="100" rx="5" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="197" y="33" text-anchor="middle" font-size="7" fill="${pu}" font-weight="700">BidResponse JSON</text>
      <text x="148" y="45" font-size="6.5" fill="${st}">"id": "abc123"</text>
      <text x="148" y="56" font-size="6.5" fill="${bl}">"seatbid": [{</text>
      <text x="152" y="67" font-size="6.5" fill="${bl}">"bid": {price: 8.40</text>
      <text x="152" y="78" font-size="6.5" fill="${gr}">"adm": "&lt;html&gt;..."</text>
      <text x="152" y="89" font-size="6.5" fill="${gr}">"nurl": "win.pixel"</text>
      <text x="148" y="100" font-size="6.5" fill="${st}">}]</text>
      <path stroke="${pu}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M118 55 L140 55"/>
      <text x="129" y="50" text-anchor="middle" font-size="6.5" fill="${pu}">→</text>
      <path stroke="${pu}" stroke-width="1.2" fill="none" d="M140 80 L118 80"/>
      <text x="129" y="75" text-anchor="middle" font-size="6.5" fill="${pu}">←</text>
      <text x="8" y="135" font-size="7" fill="${mu}">IAB Tech Lab maintains the OpenRTB spec (currently v2.6 + v3.0)</text>
      <text x="8" y="147" font-size="7" fill="${mu}">Timeout: exchanges wait ~80–100ms for DSP responses</text></svg>`,

    pmp: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Private Marketplace deal types</title>
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">PMP vs Open Auction vs PG</text>
      <rect x="8" y="20" width="74" height="70" rx="5" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="45" y="36" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Open</text>
      <text x="45" y="47" text-anchor="middle" font-size="7.5" font-weight="600" fill="${blD}">Auction</text>
      <text x="45" y="60" text-anchor="middle" font-size="7" fill="${st}">100+ DSPs</text>
      <text x="45" y="71" text-anchor="middle" font-size="7" fill="${st}">compete openly</text>
      <text x="45" y="82" text-anchor="middle" font-size="7" fill="${st}">lowest CPMs</text>
      <rect x="90" y="20" width="74" height="70" rx="5" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="127" y="36" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">PMP</text>
      <text x="127" y="47" text-anchor="middle" font-size="7" fill="${st}">invite-only</text>
      <text x="127" y="58" text-anchor="middle" font-size="7" fill="${st}">deal ID: 3839</text>
      <text x="127" y="70" text-anchor="middle" font-size="7" fill="${st}">floor + priority</text>
      <text x="127" y="82" text-anchor="middle" font-size="7" fill="${st}">mid-range CPM</text>
      <rect x="172" y="20" width="80" height="70" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="212" y="36" text-anchor="middle" font-size="7.5" font-weight="700" fill="${gr}">Programmatic</text>
      <text x="212" y="47" text-anchor="middle" font-size="7.5" font-weight="700" fill="${gr}">Guaranteed</text>
      <text x="212" y="60" text-anchor="middle" font-size="7" fill="${st}">fixed price + vol</text>
      <text x="212" y="71" text-anchor="middle" font-size="7" fill="${st}">guaranteed</text>
      <text x="212" y="82" text-anchor="middle" font-size="7" fill="${st}">delivery</text>
      <text x="8" y="106" font-size="7" fill="${mu}">PMP: publisher sends deal_id in bid request; DSP bids using it</text>
      <text x="8" y="118" font-size="7" fill="${mu}">PG: no auction — fixed CPM × impression commitment, auto-delivered</text>
      <text x="8" y="130" font-size="7" fill="${mu}">Preferred deal: fixed price but non-guaranteed volume</text></svg>`,

    dco: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Dynamic Creative Optimization</title>
      ${mk("a",pu)}
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">DCO: Assemble Ads From Components</text>
      <rect x="8" y="20" width="72" height="76" rx="5" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="44" y="36" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Components</text>
      <text x="44" y="49" text-anchor="middle" font-size="7" fill="${st}">headline variants</text>
      <text x="44" y="60" text-anchor="middle" font-size="7" fill="${st}">product images</text>
      <text x="44" y="71" text-anchor="middle" font-size="7" fill="${st}">CTA buttons</text>
      <text x="44" y="82" text-anchor="middle" font-size="7" fill="${st}">price feed</text>
      <text x="44" y="93" text-anchor="middle" font-size="7" fill="${st}">audience signal</text>
      <rect x="94" y="26" width="66" height="34" rx="4" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="127" y="39" text-anchor="middle" font-size="8" font-weight="700" fill="${pu}">DCO Engine</text>
      <text x="127" y="51" text-anchor="middle" font-size="7" fill="${pu}">picks best combo</text>
      <rect x="94" y="68" width="66" height="22" rx="4" fill="${orF}" stroke="${or}" stroke-width="1"/>
      <text x="127" y="80" text-anchor="middle" font-size="7" fill="${or}">User: in-market</text>
      <text x="127" y="90" text-anchor="middle" font-size="7" fill="${or}">for running shoes</text>
      <rect x="174" y="20" width="78" height="76" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="213" y="36" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Final Ad</text>
      <text x="213" y="49" text-anchor="middle" font-size="7" fill="${st}">"Nike Air Max"</text>
      <text x="213" y="60" text-anchor="middle" font-size="7" fill="${st}">shoe image</text>
      <text x="213" y="71" text-anchor="middle" font-size="7" fill="${st}">"Shop Now $129"</text>
      <text x="213" y="83" text-anchor="middle" font-size="7" fill="${st}">personalized</text>
      <text x="213" y="94" text-anchor="middle" font-size="7" fill="${st}">at render time</text>
      <path stroke="${pu}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M80 56 L92 44"/>
      <path stroke="${pu}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M160 44 L172 38"/>
      <text x="8" y="112" font-size="7" fill="${mu}">Used for: DPA (Dynamic Product Ads), retargeting, travel pricing</text>
      <text x="8" y="124" font-size="7" fill="${mu}">Creative served at bid time by creative management platform (CMP)</text></svg>`,

    "brand-safety": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Brand safety protection</title>
      <text x="8" y="14" font-size="9" fill="${gr}" font-weight="700">Brand Safety: Protect Advertiser Reputation</text>
      <rect x="8" y="20" width="110" height="90" rx="5" fill="${rdF}" stroke="${rd}" stroke-width="1.5"/>
      <text x="63" y="36" text-anchor="middle" font-size="8" font-weight="600" fill="${rd}">Unsafe Content</text>
      <text x="63" y="50" text-anchor="middle" font-size="7" fill="${rd}">Adult / explicit</text>
      <text x="63" y="62" text-anchor="middle" font-size="7" fill="${rd}">Violence / weapons</text>
      <text x="63" y="74" text-anchor="middle" font-size="7" fill="${rd}">Hate speech</text>
      <text x="63" y="86" text-anchor="middle" font-size="7" fill="${rd}">Fake news / misinf.</text>
      <text x="63" y="103" text-anchor="middle" font-size="7" fill="${mu}">BLOCKED by IAS/DV</text>
      <rect x="136" y="20" width="116" height="90" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="194" y="36" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Safe Content</text>
      <text x="194" y="50" text-anchor="middle" font-size="7" fill="${gr}">News (non-sensitive)</text>
      <text x="194" y="62" text-anchor="middle" font-size="7" fill="${gr}">Sports / entertainment</text>
      <text x="194" y="74" text-anchor="middle" font-size="7" fill="${gr}">Lifestyle / cooking</text>
      <text x="194" y="86" text-anchor="middle" font-size="7" fill="${gr}">Technology content</text>
      <text x="194" y="103" text-anchor="middle" font-size="7" fill="${mu}">APPROVED to serve</text>
      <text x="8" y="124" font-size="7" fill="${mu}">GARM (Global Alliance for Responsible Media): industry standard tiers</text>
      <text x="8" y="136" font-size="7" fill="${mu}">Pre-bid: block before auction · Post-bid: audit after serving</text>
      <text x="8" y="148" font-size="7" fill="${mu}">Vendors: IAS · DoubleVerify · Oracle Moat · Integral Ad Science</text></svg>`,

    viewability: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Ad viewability standards</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Viewability: MRC Standard</text>
      <rect x="8" y="20" width="244" height="80" rx="5" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="130" y="35" text-anchor="middle" font-size="8" fill="${st}">Browser Viewport</text>
      <rect x="20" y="40" width="100" height="50" rx="4" fill="${blF}" stroke="${bl}" stroke-width="2"/>
      <text x="70" y="55" text-anchor="middle" font-size="8" font-weight="700" fill="${blD}">Display Ad</text>
      <text x="70" y="67" text-anchor="middle" font-size="7" fill="${bl}">✓ 50% pixels</text>
      <text x="70" y="79" text-anchor="middle" font-size="7" fill="${bl}">✓ ≥ 1 second</text>
      <rect x="140" y="52" width="98" height="38" rx="4" fill="#fef3c7" stroke="${or}" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="189" y="67" text-anchor="middle" font-size="7.5" fill="${or}">Below the fold</text>
      <text x="189" y="79" text-anchor="middle" font-size="7" fill="${or}">not yet viewable</text>
      <text x="8" y="118" font-size="7" fill="${mu}">Display MRC: 50% pixels visible for ≥1 continuous second</text>
      <text x="8" y="130" font-size="7" fill="${mu}">Video MRC: 50% pixels visible for ≥2 continuous seconds</text>
      <text x="8" y="142" font-size="7" fill="${mu}">Measured by: IAS, DoubleVerify, Moat (OM SDK integration)</text>
      <text x="8" y="154" font-size="7" fill="${mu}">Avg display viewability ~55%; video ~70%; CTV ~95%+</text></svg>`,

    ctv: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Connected TV advertising</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">CTV: Connected Television Ecosystem</text>
      <rect x="60" y="20" width="140" height="80" rx="8" fill="${blF}" stroke="${bl}" stroke-width="2"/>
      <rect x="70" y="28" width="120" height="62" rx="4" fill="#0f172a"/>
      <text x="130" y="55" text-anchor="middle" font-size="9" font-weight="700" fill="white">Streaming App</text>
      <text x="130" y="68" text-anchor="middle" font-size="7" fill="#94a3b8">Hulu · Peacock · Paramount+</text>
      <rect x="108" y="102" width="44" height="8" rx="2" fill="${bl}"/>
      <text x="8" y="126" font-size="7" fill="${mu}">Devices: Roku · Fire TV · Apple TV · Samsung Smart TV · LG</text>
      <text x="8" y="138" font-size="7" fill="${mu}">Ad targeting: IP, household demo, ACR viewing history</text>
      <text x="8" y="150" font-size="7" fill="${mu}">No click: CPM-based, brand awareness + reach campaigns</text></svg>`,

    ssai: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Server-side ad insertion</title>
      ${mk("a",pu)}
      <text x="8" y="14" font-size="9" fill="${pu}" font-weight="700">SSAI vs CSAI: How Video Ads Are Stitched</text>
      <text x="8" y="28" font-size="7.5" fill="${bl}" font-weight="600">Client-Side (CSAI) — old way</text>
      <rect x="8" y="34" width="55" height="26" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="35" y="50" text-anchor="middle" font-size="7" fill="${bl}">Content</text>
      <rect x="70" y="34" width="55" height="26" rx="3" fill="${rdF}" stroke="${rd}" stroke-width="1"/>
      <text x="97" y="50" text-anchor="middle" font-size="7" fill="${rd}">Ad URL fetch</text>
      <text x="97" y="58" text-anchor="middle" font-size="6.5" fill="${mu}">buffering gap!</text>
      <rect x="132" y="34" width="55" height="26" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="159" y="50" text-anchor="middle" font-size="7" fill="${bl}">Content</text>
      <text x="8" y="74" font-size="7.5" fill="${gr}" font-weight="600">Server-Side (SSAI) — modern way</text>
      <rect x="8" y="80" width="55" height="26" rx="3" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="35" y="96" text-anchor="middle" font-size="7" fill="${gr}">Content</text>
      <rect x="70" y="80" width="55" height="26" rx="3" fill="${grF}" stroke="${gr}" stroke-width="2"/>
      <text x="97" y="93" text-anchor="middle" font-size="7" font-weight="600" fill="${gr}">SSAI</text>
      <text x="97" y="104" text-anchor="middle" font-size="6.5" fill="${gr}">pre-stitched</text>
      <rect x="132" y="80" width="55" height="26" rx="3" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="159" y="96" text-anchor="middle" font-size="7" fill="${gr}">Content</text>
      <text x="8" y="120" font-size="7" fill="${mu}">SSAI fetches ad media server-side, re-encodes to match content bitrate</text>
      <text x="8" y="132" font-size="7" fill="${mu}">Produces stitched HLS/DASH manifest: player never knows it's an ad</text>
      <text x="8" y="144" font-size="7" fill="${mu}">Vendors: Yospace · Verizon (Yahoo) · AWS Elemental MediaTailor</text></svg>`,

    "frequency-cap": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Frequency capping</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Frequency Cap: Limit Ad Repetition</text>
      <rect x="8" y="22" width="244" height="60" rx="5" fill="#f8fafc" stroke="${st}" stroke-width="1"/>
      <text x="14" y="36" font-size="7" fill="${st}" font-weight="600">User journey (cap: 3 per day)</text>
      <rect x="14" y="42" width="40" height="24" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="34" y="57" text-anchor="middle" font-size="8" fill="${bl}">Ad #1 ✓</text>
      <rect x="62" y="42" width="40" height="24" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="82" y="57" text-anchor="middle" font-size="8" fill="${bl}">Ad #2 ✓</text>
      <rect x="110" y="42" width="40" height="24" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="130" y="57" text-anchor="middle" font-size="8" fill="${bl}">Ad #3 ✓</text>
      <rect x="158" y="42" width="40" height="24" rx="3" fill="${rdF}" stroke="${rd}" stroke-width="1.5"/>
      <text x="178" y="54" text-anchor="middle" font-size="7" font-weight="700" fill="${rd}">BLOCKED</text>
      <text x="178" y="64" text-anchor="middle" font-size="6.5" fill="${rd}">cap reached</text>
      <rect x="206" y="42" width="40" height="24" rx="3" fill="${rdF}" stroke="${rd}" stroke-width="1.5"/>
      <text x="226" y="54" text-anchor="middle" font-size="7" font-weight="700" fill="${rd}">BLOCKED</text>
      <text x="226" y="64" text-anchor="middle" font-size="6.5" fill="${rd}">cap reached</text>
      <text x="8" y="100" font-size="7" fill="${mu}">Stored in: DSP bid logic, cookie, device ID lookup, identity service</text>
      <text x="8" y="112" font-size="7" fill="${mu}">Without caps: users see same ad 50+ times → brand damage</text>
      <text x="8" y="124" font-size="7" fill="${mu}">Cross-device capping needs identity graph to link phone + desktop</text>
      <text x="8" y="136" font-size="7" fill="${mu}">CTV caps enforced server-side (no cookies) via IP + device ID</text></svg>`,

    "programmatic-guaranteed": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Programmatic guaranteed deal</title>
      ${mk("a",gr)}
      <text x="8" y="14" font-size="9" fill="${gr}" font-weight="700">Programmatic Guaranteed: Direct Deal, Auto-Delivery</text>
      <rect x="8" y="22" width="90" height="60" rx="5" fill="${blF}" stroke="${bl}" stroke-width="1.5"/>
      <text x="53" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="${blD}">Advertiser</text>
      <text x="53" y="53" text-anchor="middle" font-size="7" fill="${st}">commits: 1M imps</text>
      <text x="53" y="65" text-anchor="middle" font-size="7" fill="${st}">@ $25 CPM fixed</text>
      <rect x="110" y="22" width="40" height="60" rx="4" fill="${grF}" stroke="${gr}" stroke-width="2"/>
      <text x="130" y="46" text-anchor="middle" font-size="8" font-weight="700" fill="${gr}">Deal</text>
      <text x="130" y="58" text-anchor="middle" font-size="7" fill="${gr}">auto</text>
      <text x="130" y="70" text-anchor="middle" font-size="7" fill="${gr}">execute</text>
      <rect x="162" y="22" width="90" height="60" rx="5" fill="${grF}" stroke="${gr}" stroke-width="1.5"/>
      <text x="207" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="${gr}">Publisher</text>
      <text x="207" y="53" text-anchor="middle" font-size="7" fill="${st}">holds: 1M imps</text>
      <text x="207" y="65" text-anchor="middle" font-size="7" fill="${st}">guaranteed deliv.</text>
      <path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M98 52 L108 52"/>
      <path stroke="${gr}" stroke-width="1.5" fill="none" marker-end="url(#a)" d="M150 52 L160 52"/>
      <text x="8" y="98" font-size="7" fill="${mu}">PG vs PMP: PG guarantees volume; PMP does not</text>
      <text x="8" y="110" font-size="7" fill="${mu}">Pricing: fixed CPM negotiated offline, deal ID in bid stream</text>
      <text x="8" y="122" font-size="7" fill="${mu}">Use case: brand campaigns needing reach + premium placement</text>
      <text x="8" y="134" font-size="7" fill="${mu}">No auction: DSP auto-wins if targeting matches &amp; cap allows</text></svg>`,

    "quality-score": `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Google Quality Score</title>
      <text x="8" y="14" font-size="9" fill="${bl}" font-weight="700">Quality Score: Google Search Ad Ranking</text>
      <circle cx="50" cy="72" r="42" fill="${puF}" stroke="${pu}" stroke-width="2"/>
      <text x="50" y="66" text-anchor="middle" font-size="28" font-weight="700" fill="${pu}">7</text>
      <text x="50" y="82" text-anchor="middle" font-size="8" fill="${pu}">out of 10</text>
      <text x="100" y="36" font-size="8" font-weight="700" fill="${st}">3 Components:</text>
      <rect x="100" y="42" width="152" height="18" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="106" y="54" font-size="7" fill="${blD}" font-weight="600">1. Expected CTR</text>
      <text x="200" y="54" font-size="7" fill="${st}">historical click rate</text>
      <rect x="100" y="64" width="152" height="18" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="106" y="76" font-size="7" fill="${blD}" font-weight="600">2. Ad Relevance</text>
      <text x="200" y="76" font-size="7" fill="${st}">keyword match</text>
      <rect x="100" y="86" width="152" height="18" rx="3" fill="${blF}" stroke="${bl}" stroke-width="1"/>
      <text x="106" y="98" font-size="7" fill="${blD}" font-weight="600">3. Landing Page Exp</text>
      <text x="200" y="98" font-size="7" fill="${st}">relevance + speed</text>
      <text x="8" y="126" font-size="7" fill="${mu}">Ad Rank = Max CPC bid × QS × auction-time factors + ad extensions</text>
      <text x="8" y="138" font-size="7" fill="${mu}">High QS = lower actual CPC charged (auction mechanics)</text>
      <text x="8" y="150" font-size="7" fill="${mu}">Scale: 1–10 (shown in Google Ads UI per keyword/ad combo)</text></svg>`,
  };
  return svgs[id] || svgs.yield;
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
    "            <p class='ecosystem-subtitle'>Tap into each area to see how demand, supply, and data work together. Each topic page has real company examples, technical diagrams, and a live ad served to this page.</p>",
    "            <div class='ecosystem-card'>",
    "              <div class='ecosystem-card-heading'>Buy Side (Demand)</div>",
    "              <p class='ecosystem-row-label'>Who decides which impressions to buy</p>",
    "              <div class='ecosystem-pill-row'>",
    "                <a class='ecosystem-pill' href='/topic/buy-side'><span>Advertiser</span></a>",
    "                <a class='ecosystem-pill' href='/topic/buy-side'><span>Agency</span></a>",
    "                <a class='ecosystem-pill ecosystem-pill-primary' href='/topic/buy-side'><span>DSP ↗</span></a>",
    "              </div>",
    "              <p class='ecosystem-row-label' style='margin-top:4px;font-size:0.68rem;'>The Trade Desk · Google DV360 · Amazon DSP · Xandr</p>",
    "            </div>",
    "            <div class='ecosystem-card'>",
    "              <div class='ecosystem-card-heading'>Exchange / Marketplace</div>",
    "              <p class='ecosystem-row-label'>Where OpenRTB auctions actually happen</p>",
    "              <div class='ecosystem-pill-row'>",
    "                <a class='ecosystem-pill ecosystem-pill-primary' href='/topic/ad-serving-rtb'><span>Ad Exchange + RTB ↗</span></a>",
    "              </div>",
    "              <p class='ecosystem-row-label' style='margin-top:4px;font-size:0.68rem;'>Google AdX · Xandr · OpenX · Amazon Publisher Services</p>",
    "            </div>",
    "            <div class='ecosystem-card'>",
    "              <div class='ecosystem-card-heading'>Sell Side (Supply)</div>",
    "              <p class='ecosystem-row-label'>Who owns the surfaces with ad slots</p>",
    "              <div class='ecosystem-pill-row'>",
    "                <a class='ecosystem-pill' href='/topic/sell-side'><span>Publisher</span></a>",
    "                <a class='ecosystem-pill ecosystem-pill-primary' href='/topic/sell-side'><span>SSP ↗</span></a>",
    "              </div>",
    "              <p class='ecosystem-row-label' style='margin-top:4px;font-size:0.68rem;'>Magnite · PubMatic · OpenX · Index Exchange · TripleLift</p>",
    "            </div>",
    "            <div class='ecosystem-section-label'>",
    "              <span>Key Topics</span>",
    "              <a href='/glossary'>Glossary →</a>",
    "            </div>",
    "            <div class='topic-list'>",
    "              <a class='topic-card' href='/topic/ad-serving-rtb'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>⚡</div>",
    "                  <div>",
    "                    <div class='topic-title'>Ad Serving &amp; RTB</div>",
    "                    <div class='topic-caption'>Creatives, OpenRTB, VAST, &lt;100ms auctions</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "              <a class='topic-card' href='/topic/data'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>📊</div>",
    "                  <div>",
    "                    <div class='topic-title'>Data &amp; Identity</div>",
    "                    <div class='topic-caption'>Cookies, UID2, LiveRamp, data pipelines</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "              <a class='topic-card' href='/topic/third-parties'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>🔗</div>",
    "                  <div>",
    "                    <div class='topic-title'>3rd-Party Providers</div>",
    "                    <div class='topic-caption'>IAS, DoubleVerify, Nielsen, LiveRamp</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "              <a class='topic-card' href='/topic/measurement-currency'>",
    "                <div class='topic-card-main'>",
    "                  <div class='topic-icon' aria-hidden='true'>📺</div>",
    "                  <div>",
    "                    <div class='topic-title'>Measurement &amp; Currency</div>",
    "                    <div class='topic-caption'>TV currency, attribution, clean rooms, CTV</div>",
    "                  </div>",
    "                </div>",
    "                <div class='topic-arrow'>›</div>",
    "              </a>",
    "            </div>",
    renderFakeBannerAd("banner-buy-side"),
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
