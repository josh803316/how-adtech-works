export const unifiedMediaContent = `
<header>
  <p><a href="/">Ad Tech Guide</a> / Local media training</p>
  <h1>Unified media buying</h1>
  <p>Follow a local campaign from proposal to invoice. Learn how digital out-of-home, streaming audio, podcasts, and location intelligence fit into one buy.</p>
  <nav aria-label="Guide sections">
    <a href="#platform">Platform roles</a>
    <a href="#dooh">DOOH</a>
    <a href="#audio">Audio</a>
    <a href="#location">Location intelligence</a>
    <a href="#campaign">Campaign lab</a>
  </nav>
  <p>Continue with <a href="/training/campaign-planning">planning, forecasting, and campaign roles</a> or <a href="/training/media-measurement">TV data, pixels, and attribution</a>.</p>
</header>
<section id="platform">
  <h2>Who controls the next dollar?</h2>
  <p>Unified media platform (UMP), unified advertising platform (UAP), and unified buying platform (UBP) are overlapping industry labels. Ask what the product actually controls across planning, activation, pacing, optimization, and reporting. <a href="https://digiday.com/media-buying/wtf-is-a-unified-media-platform/">Digiday’s explainer</a></p>
  <dl>
    <dt>Workflow layer</dt>
    <dd>Turns one brief into channel line items, routes them to buying systems, and brings delivery back into one report. A buyer can retain approval over every budget change.</dd>
    <dt>Buying infrastructure</dt>
    <dd>A <a href="/glossary?term=dsp">DSP</a> bids or executes deals across the inventory it can access. An <a href="/glossary?term=ssp">SSP</a> helps media owners package and sell supply. Some proposals for unified platforms combine buying and selling infrastructure.</dd>
    <dt>Cross-channel allocation</dt>
    <dd>Decides how to spend the next dollar using a shared outcome, comparable evidence, and authority to move money within agreed limits. An AI assistant can draft plans or flag pacing issues while humans retain this authority.</dd>
  </dl>
  <p>For any platform demo, ask which partners support campaign creation, which support budget edits, who approves reallocations, and how an operator audits changes. Walled gardens can restrict API access, identifiers, and reporting. A common dashboard can still contain different attribution windows, overlapping audiences, and incompatible conversion definitions.</p>
  <h3>Ribeye Media in the local workflow</h3>
  <p>Ribeye publicly describes a workflow spanning forecasting, activation, pacing, and reporting for local media teams. A broadcaster can plan owned-and-operated (O&amp;O) inventory alongside partner channels such as CTV, online video, display, audio, and DOOH. Ribeye lists AudioMatic and Place Exchange among its connections and documents StackAdapt activation across several channels. <a href="https://ribeye.media/">Ribeye overview</a> · <a href="https://ribeye.media/platform/">Platform</a> · <a href="https://ribeye.media/ribeye-adds-stackadapt-integration/">StackAdapt announcement</a></p>
</section>
<section id="dooh">
  <h2>Digital out-of-home (DOOH)</h2>
  <p>A billboard, transit display, or screen in a gym can show one creative to many people at once. Programmatic DOOH trades eligible screen opportunities through platforms such as Place Exchange. OpenRTB can carry DOOH inventory details and an impression multiplier for opportunities representing more than one estimated exposure. <a href="https://iabtechlab.com/dooh-integrated-into-openrtb/">IAB Tech Lab’s DOOH overview</a></p>
  <ol>
    <li><strong>Plan the venue.</strong> Select screen types, geographies, and dayparts. Review dwell time and viewing distance. A commuter billboard needs a short message at a glance; a waiting-area screen can support more detail.</li>
    <li><strong>Activate the deal.</strong> Verify eligible screens, creative dimensions and duration, approval lead time, and deal terms. Ask about the loop length, spot rotation, and whether weather or daypart rules narrow eligible supply.</li>
    <li><strong>Reconcile delivery.</strong> Match screen ID, creative ID, and play time in proof-of-play records against the buy. Ask which methodology estimates impressions and how the provider applies it by venue and time. Keep plays, modeled impressions, and reach in separate columns.</li>
  </ol>
  <details><summary>A screen logs 350 plays. What can you report?</summary>
    <p>At an illustrative average of 12 estimated exposures per play, report 350 plays and 4,200 estimated impressions. Unique reach requires a separate estimate of audience overlap. Record the method alongside the number. <a href="https://www.placeexchange.com/perview-buyers">Place Exchange’s PerView measurement</a></p>
  </details>
  <p><a href="/example/digital-billboard">Explore the billboard example</a></p>
</section>
<section id="audio">
  <h2>Streaming audio and podcasts with AdsWizz</h2>
  <p>AdsWizz offers audio advertising technology for buyers and publishers. AudioMatic is its audio DSP, used to plan and buy inventory such as streaming music and podcasts. A station’s live stream and an on-demand episode can use different ad insertion and measurement setups. <a href="https://www.adswizz.com/product-deepdive-with-sounds-profitable-adswizz-audio-dsp-audiomatic/">AdsWizz AudioMatic walkthrough</a></p>
  <dl>
    <dt>Streaming audio</dt>
    <dd>A service offers ad breaks during listening sessions. Choose markets, dayparts, content or audience criteria, and supported frequency caps. Use a clear spoken call to action for screenless listening. Check playback or completion metrics where the player reports them.</dd>
    <dt>Podcast inventory</dt>
    <dd>Dynamic ad insertion can select an ad for an eligible episode request. A host-read ad describes who voices the creative and can be inserted dynamically or embedded in the episode. Check show eligibility, pre-roll or mid-roll placement, and brand suitability before launch.</dd>
    <dt>Measurement</dt>
    <dd>Ask whether a report counts server-side ad delivery, player-confirmed starts, or completions. A downloaded ad can be available for later listening. A companion banner click covers only the environments that render that banner. <a href="https://www.iab.com/wp-content/uploads/2022/05/IAB_Audio_Measurement_Guide_Final.pdf">IAB Digital Audio Measurement Guide</a></dd>
  </dl>
  <p><a href="/example/audio-streaming">Explore the streaming audio example</a></p>
</section>
<section id="location">
  <h2>Planning and measurement with location intelligence</h2>
  <p><strong>Placer.ai</strong> provides location analytics for questions such as where a store draws visitors from, when activity peaks, and how trade areas overlap. <strong>Place Exchange</strong> connects buyers with out-of-home inventory. In the campaign below, Placer.ai informs planning as a separate research tool. <a href="https://www.placer.ai/solutions/advertising">Placer.ai advertising use cases</a></p>
  <ol>
    <li><strong>Before launch.</strong> Compare the store’s actual trade area with a radius around it. Use visitor origins and typical travel patterns to choose venues, markets, and candidate comparison stores. Define points of interest carefully, especially in shared buildings.</li>
    <li><strong>During the flight.</strong> Review visitation trends alongside actual delivery and store hours. Annotate promotions, holidays, and openings. Ask about panel coverage, projection, reporting thresholds, and delays before interpreting week-to-week movement.</li>
    <li><strong>Afterward.</strong> A visit trend describes changes at a location. Exposure attribution requires a method for associating eligible ad exposure with visits within a stated window. Estimating incremental visits also needs a credible counterfactual. Choose a randomized geo holdout when practical or compare similar markets with stable pre-campaign trends.</li>
  </ol>
  <p><a href="https://www.placer.ai/guides/location-intelligence-for-advertising">Placer.ai’s location intelligence guide</a> · <a href="https://docs.placer.ai/reference/faqs-1">Placer.ai reporting coverage FAQ</a></p>
</section>
<section id="campaign">
  <h2>Campaign lab · Launch a neighborhood grocery store</h2>
  <p><strong>Fictional brief.</strong> A local broadcaster has $20,000 in media budget and four weeks to build awareness and generate incremental store visits. Production and measurement costs are tracked separately. Pick a course of action at each stage, then reveal the reasoning.</p>
  <h3>Plan and forecast</h3>
  <p>Start with $8,000 for digital screens on shopping routes, $5,000 for streaming audio during commute and errand hours, $3,000 for relevant podcasts, and $4,000 for O&amp;O CTV to show the opening offer. Forecast eligible inventory and cost by line. Define the store boundary, test and comparison areas, baseline, campaign dates, and reporting window before launch.</p>
  <details><summary>Choose screens by distance or by trade area?</summary>
    <p>Start with trade area and route evidence. A nearby screen may face traffic going away from the store. Compare direction, venue context, dwell time, approved creative, and estimated impressions at the proposed dayparts.</p>
  </details>
  <h3>Activate and pace</h3>
  <p>Send approved screen creative, audio files and spoken CTA, and CTV video to their buying or serving systems. Keep external campaign and line IDs with the order. Confirm time zones, caps, dates, and spend limits, then verify live delivery with proof of play, audio delivery logs, or ad-server reporting.</p>
  <details><summary>Day 10 · DOOH is behind pace and podcast CPM is lower. Move $1,500?</summary>
    <p>Investigate the screen line first. Check approval, eligible venues, floors, and delayed reporting. If delivery is constrained, compare additional qualified screens with other options using the visit objective and measurement design. Propose a capped change for approval, verify remaining commitments, then log its effective date and update both line budgets.</p>
  </details>
  <h3>Report and reconcile</h3>
  <p>Show planned, delivered, and billable media by channel. Reconcile partner cost and the client invoice using agreed fees and adjustments. Keep event definitions, time zones, reporting lag, and attribution windows visible. Cross-channel reach requires a documented deduplication method.</p>
  <details><summary>Test stores rose from 1,000 to 1,200 visits. Comparison stores rose from 1,000 to 1,100. What changed?</summary>
    <p>The comparison rose 10%. Apply that rate to the test baseline for an expected 1,100 visits. The test recorded 100 more than expected, roughly 9.1% above that counterfactual. At $20,000 of media cost, the illustrative cost is $200 per estimated incremental visit. Check pre-flight trends, spillover, concurrent promotions, and uncertainty before attributing that difference to the campaign. This design evaluates the combined buy and needs channel-level tests to isolate each contribution.</p>
  </details>
  <details><summary>Knowledge check · Name the evidence needed to hand budget allocation to the platform.</summary>
    <p>Identify a shared outcome, a credible way to compare incremental performance, which partners accept changes, who grants spend authority, and where operators can review or reverse a change.</p>
  </details>
</section>
`
