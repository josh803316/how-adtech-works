export const campaignPlanningContent = `
<header>
  <p><a href="/">Ad Tech Guide</a> / <a href="/training/unified-media">Unified media buying</a></p>
  <h1>Campaign Planning &amp; Forecasting</h1>
  <p>Turn an advertiser brief into a buy the team can deliver, measure, and reconcile.</p>
  <nav aria-label="Guide sections">
    <a href="#plan">Media plan</a><a href="#forecast">Forecasting</a><a href="#trafficking">Orders &amp; line items</a><a href="#targeting">Targeting &amp; caps</a><a href="#roles">Campaign roles</a><a href="#agencies">Agency structures</a><a href="#handoff">Handoff exercise</a>
  </nav>
</header>
<section id="plan">
  <h2>Build the media plan</h2>
  <ol>
    <li><strong>Brief.</strong> Record the business goal, geography, audience, dates, budget, creative, exclusions, and success metric. Define whether the budget includes media, data, platform, agency, production, and measurement fees.</li>
    <li><strong>Strategy.</strong> Give each channel a job. The grocery campaign can use CTV to introduce the opening, DOOH to reach shoppers on relevant routes, and audio to repeat the offer. Set a primary outcome and identify secondary delivery and diagnostic metrics.</li>
    <li><strong>Line items.</strong> Document supplier, inventory type, buying method, flight, audience, daypart, cap, creative spec, cost basis, quantity, and measurement owner. Record targeting exclusions and assumptions, including how household reach and frequency will be estimated.</li>
    <li><strong>Approval.</strong> Reconcile line totals to the budget. Get buy and measurement sign-off before reserving inventory or starting delivery. Keep the approved plan and order version available to operations and finance.</li>
  </ol>
  <p><a href="/training/unified-media#campaign">See the grocery campaign brief</a> · <a href="/training/media-measurement#attribution">Choose an outcome measurement method</a></p>
</section>
<section id="forecast">
  <h2>Forecast what the plan can deliver</h2>
  <dl>
    <dt>Owned-and-operated inventory</dt>
    <dd>Start with expected traffic or ad opportunities. Apply eligibility, caps, and competing reservations. Review whether the new line would displace another commitment. Check sparse history, seasonality, and special events. <a href="https://support.google.com/admanager/answer/4395249?hl=en">Google Ad Manager forecasting FAQ</a></dd>
    <dt>Programmatic buying</dt>
    <dd>Estimate eligible bid opportunities and likely wins at the proposed bid levels. Deal eligibility, floors, win rate, creative compatibility, and competing buyers limit delivery. Ask whether a partner forecast already accounts for these factors before applying any deductions. A non-guaranteed deal forecast is an estimate.</dd>
    <dt>Reach and frequency</dt>
    <dd>Average frequency equals impressions divided by reach when both metrics use the same audience, unit, and window. De-duplicate overlapping reach before combining channels. A household estimate and a person estimate cannot be substituted for one another.</dd>
    <dt>Pacing</dt>
    <dd>Compare cumulative delivery with the planned curve using elapsed eligible time. Reforecast remaining inventory from actual win rate, cost, and spend. A weekend-heavy plan can be correctly paced while trailing a straight-line target. <a href="https://support.google.com/admanager/answer/2669484?hl=en">Google Ad Manager pacing</a></dd>
  </dl>
  <h3>Worked forecast · The $4,000 CTV line</h3>
  <p>At a $20 media CPM, $4,000 buys 200,000 impressions if supply is available. A $25 CPM buys 160,000. If only 140,000 impressions are forecast to be available at $20, the line can deliver about $2,800 at that rate.</p>
  <details><summary>Can you promise 200,000 impressions if 140,000 are available on owned inventory?</summary>
    <p>Plan around the 60,000-impression gap. Check whether dates, audience, or caps can change with approval. If you add partner supply, confirm unit cost and availability, then disclose how the inventory mix and reach estimate change before confirming the order.</p>
  </details>
  <details><summary>Two compatible forecasts show 80,000 and 60,000 households reached, with 25,000 in both. What is combined reach?</summary>
    <p>115,000 households. Subtract the overlap once. Document how households were matched and the populations and dates covered by each estimate.</p>
  </details>
</section>
<section id="trafficking">
  <h2>From signed insertion order to live line items</h2>
  <dl>
    <dt>Commercial insertion order (IO)</dt>
    <dd>The buyer and seller document what was purchased. A typical IO captures contracting entities, flight, inventory and quantities, rates and fees, billable event, payment terms, and what happens if delivery falls short. An approved amendment can change the commitment.</dd>
    <dt>Campaign</dt>
    <dd>The advertiser’s initiative groups related buys around a goal. Give it a stable ID and naming convention. The same initiative may have separate campaign objects in several buying or serving systems.</dd>
    <dt>Platform insertion order</dt>
    <dd>Some platforms also call an execution object an IO. In DV360, it groups related line items and can carry shared budget, dates, pacing, and caps. Other systems use different hierarchies. Store the signed order reference and platform IDs so a change can be traced through both. <a href="https://support.google.com/displayvideo/answer/2696705?hl=en">DV360 insertion order documentation</a></dd>
    <dt>Line item and creative</dt>
    <dd>A line item specifies where, when, and how units can be bought or served. Split lines when inventory, commercial terms, controls, or reporting need separate ownership. Attach compatible creative versions and tracking to each eligible line. Check that changing a shared creative or setting has the intended impact on every affected line.</dd>
  </dl>
  <p><strong>Worked setup.</strong> The $20,000 grocery campaign has four planned lines: $8,000 DOOH, $5,000 streaming audio, $3,000 podcasts, and $4,000 owned CTV. Ad Ops maps each to the relevant buying or serving system. Each line keeps its own dates, creative approval, counting unit, and delivery ID. Finance can trace both the supplier cost and billable quantity back to the approved order.</p>
  <details><summary>The client approves moving $1,500 from DOOH to audio. What changes?</summary>
    <p>Confirm any booked DOOH commitment or cancellation fee. Update the approved plan and amend the commercial order when required. Set DOOH to $6,500 and streaming audio to $6,500 if the full transfer is available. Update platform budgets, check spend already incurred and parent limits, then confirm the forecast and record the approvals. The campaign still totals $20,000.</p>
  </details>
</section>
<section id="targeting">
  <h2>Build eligibility and control frequency</h2>
  <dl>
    <dt>Inventory and context</dt><dd>Choose geography, daypart, venue or publisher, deal, device, and content criteria. Specify the geo signal and daypart time zone. Contextual targeting uses attributes of the surrounding content or placement.</dd>
    <dt>Audience segments</dt><dd>First-party segments can use eligible advertiser data such as existing customers. A publisher may offer segments based on its own audience data. Third-party providers can offer licensed segments. Modeled or lookalike audiences extend a seed using predicted similarity. Review the segment definition, recency, match rate, permitted use, cost, and scale. For prospecting, decide whether and how to exclude existing customers or recent converters.</dd>
    <dt>Targeting logic</dt><dd>Write the intended Boolean rules and check how the platform groups filters. For example, target shoppers in ZIP A or ZIP B, during eligible hours, who match the prospecting segment, and exclude known customers where matching is available. Forecast before and after adding restrictions to identify which filter limits scale.</dd>
    <dt>Frequency caps</dt><dd>Specify the count, window, scope, and identity unit. A cap of three per week can apply to an individual line, an entire order, or a campaign within one platform. A cap on an identifiable browser, device, or household covers that unit within the system’s supported inventory. A shared public DOOH screen uses scheduling and rotation controls, with audience frequency estimated separately. <a href="https://support.google.com/displayvideo/answer/2696786?hl=en">DV360 frequency cap documentation</a></dd>
  </dl>
  <details><summary>Audio and CTV each cap delivery at three per week. Can the buyer promise a combined cap of three?</summary>
    <p>Two independent line caps can allow up to six exposures for the same identifiable unit if both lines reach it. A supported shared parent cap can constrain delivery across both lines inside one buying system. Across separate platforms, confirm shared identity and enforcement before making a claim. Monitor observed reach and frequency separately from the configured cap.</p>
  </details>
  <p><strong>Preflight.</strong> Compare platform settings with the signed order and plan. Review time zones, parent budgets and caps, targeting and exclusions, eligible supply, creative approval, tracking, and who can change each setting. Verify actual delivery and reporting after launch.</p>
  <p><a href="/glossary?term=io">Insertion order</a> · <a href="/glossary?term=line-item">Line item</a> · <a href="/glossary?term=frequency-cap">Frequency cap</a></p>
</section>
<section id="roles">
  <h2>Who owns the handoff?</h2>
  <p>Titles vary with the organization. A smaller team may combine several roles. Use the approved plan to record who executes, who approves changes, and who speaks to the client.</p>
  <dl>
    <dt>Sales and account lead</dt><dd>Own the commercial relationship, scope and price, and coordinate approvals on the proposal or insertion order (IO). Confirm what was promised and how changes affect the agreement.</dd>
    <dt>Media planner and buyer</dt><dd>The planner chooses audiences, channels, budget, and measurement. The buyer negotiates with suppliers and secures placements or deals. A programmatic trader manages bids, deals, targeting, and optimization within approved limits.</dd>
    <dt>Ad operations (Ad Ops)</dt><dd>Traffics orders and line items, associates approved creatives and tags, tests delivery and tracking, and troubleshoots underdelivery. Publisher-side operators manage inventory and creative acceptance. Buy-side operators can own placement tags, conversion setup, and delivery QA across partners.</dd>
    <dt>Campaign manager and CSM</dt><dd>A campaign manager typically coordinates launch readiness, pacing reviews, optimization requests, and reporting. A customer success manager (CSM) typically owns onboarding, client communication, and escalations. In managed-service teams, a CSM may also manage the campaign. Write down who can change spend and who confirms client approval.</dd>
    <dt>Analytics, engineering, and finance</dt><dd>Analytics owns definitions and study design. Engineering and the advertiser’s web team implement event collection and fix integration issues. Finance reconciles supplier costs, billable units, credits, and invoices against order terms.</dd>
  </dl>
  <p><a href="/players">Explore player incentives</a> · <a href="/glossary?term=ad-ops">Ad Ops glossary</a> · <a href="/glossary?term=csm">CSM glossary</a></p>
</section>
<section id="agencies">
  <h2>How agencies sit under an umbrella</h2>
  <p>A holding company owns or controls a portfolio. A media network may group several agency brands and offer shared procurement, technology, data, or trading. A client-facing agency can set the strategy while a central team executes parts of the buy. WPP announced WPP Media as the successor to GroupM and named Mindshare, Wavemaker, and EssenceMediacom as brands within it. Omnicom completed its acquisition of Interpublic in November 2025. <a href="https://www.wpp.com/en/news/2025/05/wpp-media-launches-as-fully-integrated-ai-powered-media-company">WPP Media announcement</a> · <a href="https://www.omc.com/newsroom/omnicom-reports-fourth-quarter-and-full-year-2025-results/">Omnicom results and acquisition date</a></p>
  <p>Independent agencies can also subcontract buying or creative work. For a nested account, identify the advertiser, contracted agency, executing team, platform-seat owner, bill-to entity, and parties allowed to see data. Verify whether the agency buys on behalf of the advertiser or offers media it resells as principal. Contract terms determine fee disclosure, billing, audit rights, and access to underlying reporting.</p>
</section>
<section id="handoff">
  <h2>Handoff exercise · The campaign is live and behind pace</h2>
  <p>The trader sees few bids winning. Ad Ops sees an approved creative in one account and a rejection in another. The CSM learns the client changed the landing page yesterday.</p>
  <details><summary>Reveal who does what before the next pacing call</summary>
    <p>Ad Ops confirms creative status and tests the current destination and conversion event. The trader checks deal eligibility, floors, and win rate and estimates recovery options. The campaign manager coordinates owners and sets the next checkpoint. The CSM confirms the landing-page change and clears any material scope or budget change with the authorized client contact. Finance checks whether a change requires a revised order.</p>
  </details>
  <p><a href="/training/media-measurement">Continue to TV data, pixels, and attribution</a></p>
</section>
`
