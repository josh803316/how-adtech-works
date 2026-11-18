export const mediaMeasurementContent = `
<header>
  <p><a href="/">Ad Tech Guide</a> / <a href="/training/unified-media">Unified media buying</a></p>
  <h1>TV Data, Pixels &amp; Attribution</h1>
  <p>Trace the evidence from a TV tuning signal or ad event to a report, a conversion credit, or an estimate of lift.</p>
  <nav aria-label="Guide sections">
    <a href="#tv">VideoAmp and TV data</a><a href="#pixels">Pixel types</a><a href="#clean-rooms">Clean rooms</a><a href="#attribution">Attribution</a><a href="#evidence">Evidence exercise</a>
  </nav>
</header>
<section id="tv">
  <h2>What each TV signal observes</h2>
  <dl>
    <dt>Smart TV automatic content recognition (ACR)</dt>
    <dd>Participating smart TVs can fingerprint sampled content and compare it with reference libraries. Coverage depends on participation, supported inputs and apps, and available reference fingerprints. A recognized ad is a screen observation.</dd>
    <dt>Set-top box (STB) return-path data</dt>
    <dd>Operator equipment can report tuning events and timestamps. Matching those events to a schedule or airing log estimates what was available to view. A tuned box can remain active while the TV is off and usually lacks visibility into a different input.</dd>
    <dt>Streaming app and ad-server logs</dt>
    <dd>Logs record events such as an ad decision, insertion, playback start, or completion. Identify whether the event came from the server or player before interpreting it as playback. Coverage is bounded by participating services and their instrumentation.</dd>
    <dt>Panels and person-level estimates</dt>
    <dd>A recruited panel can provide demographic and person-viewing information. Providers can use panels or other inputs to calibrate device data and model which household members watched, including co-viewing. Document how household and person metrics are derived.</dd>
  </dl>
  <h3>VideoAmp and commingling</h3>
  <p>VideoAmp describes ingesting STB, ACR, schedules, and metadata, then cleansing, deduplicating, and enriching those records. Two devices or feeds can describe the same household session. Ask how duplicates, noisy sessions, uncovered audiences, and demographic estimates are handled. Ask for the exact product, population, and methodology when comparing providers. <a href="https://videoamp.com/data/">VideoAmp’s data overview</a> · <a href="https://videoamp.com/wp-content/uploads/2020/06/VideoAmp-The-Future-Of-TV-Data-Whitepaper.pdf">VideoAmp commingling white paper</a></p>
  <p>A negotiated TV currency defines the unit against which buyer and seller transact, such as audience impressions for a demographic. Delivery is compared against the agreement. Website visits and sales require separate outcome measurement. <a href="/topic/measurement-currency">Measurement and currency overview</a></p>
  <details><summary>ACR and STB each log the same airing for one matched household. What is household reach?</summary>
    <p>One household for that airing if the records refer to the same household. Person reach needs additional evidence or modeling. Confirm how simultaneous observations were reconciled before reporting impression counts.</p>
  </details>
</section>
<section id="pixels">
  <h2>What does this pixel count?</h2>
  <p>“Pixel” can mean an image request, a script, a tracking endpoint, or shorthand for an event integration. Ask what fires it, which system receives it, and how it counts repeats.</p>
  <dl>
    <dt>Impression beacon</dt><dd>An ad-side request records a defined delivery or rendering event. Specify the trigger when reconciling counts between an ad server and a publisher.</dd>
    <dt>Verification and video tracking</dt><dd>Verification can measure viewability or other signals in supported environments. VAST can carry tracking URLs for events such as start, quartiles, and complete. A playback beacon and a viewability measurement answer different questions. <a href="https://iabtechlab.com/standards/vast/">IAB Tech Lab VAST</a></dd>
    <dt>Click tracker</dt><dd>A redirect or click event records an interaction. The landing page can fail after the click is counted. URL campaign parameters help classify visits when the site receives them.</dd>
    <dt>Page-view and audience tags</dt><dd>A site tag can log visits for analytics or build eligible audiences for later targeting. Treat analytics and advertising audiences as separate purposes and apply the appropriate consent configuration.</dd>
    <dt>Conversion counters and sales tags</dt><dd>A lead counter records an eligible form submission. A purchase event can carry order ID, value, and currency. Floodlight supports counter and sales activities. Test whether refreshes, retries, and repeats change counting. <a href="https://support.google.com/campaignmanager/answer/3027419?hl=en">Campaign Manager 360 Floodlight</a></dd>
    <dt>Server-side, offline, and app events</dt><dd>A backend can send eligible purchase or CRM events, and an app SDK can record app actions. Browser and server reports of the same purchase should share the identifier specified by the destination’s deduplication rules. Carry consent through the pipeline and limit fields to what the destination requires. <a href="https://developers.google.com/tag-platform/tag-manager/server-side/consent-mode">Server-side consent example</a></dd>
  </dl>
  <h3>Before launch</h3>
  <p>Write an event dictionary with trigger, source, destination, ID, time zone, value, currency, consent requirements, and owner. Test a successful purchase, page refresh, denied consent, and retry. Check both the emitted event and the destination’s receipt. Reconcile eligible events against transaction records before interpreting conversion totals.</p>
</section>
<section id="clean-rooms">
  <h2>Collaborate with a data clean room</h2>
  <ol>
    <li><strong>Agree on the question.</strong> Audience overlap, activation, and attribution require different inputs and outputs. Confirm the allowed purpose, consent, retention, and who can run queries or export results.</li>
    <li><strong>Prepare the data.</strong> A publisher can contribute eligible exposure records. The advertiser can contribute eligible conversion events. Decide the join key and identity grain, such as authenticated account or household. Protect the join data under the collaboration’s controls.</li>
    <li><strong>Run the approved analysis.</strong> For attribution, filter post-exposure outcomes to the lookback window and deduplicate orders before applying the credit rule. Report match coverage, unmatched events, and any exclusions. Match coverage can differ by channel.</li>
    <li><strong>Release permitted results.</strong> Product-specific controls may include approved templates, minimum group sizes, repeated-query checks, or noise. Small cohorts may be suppressed. Use authorized aggregate output and record the methodology alongside it.</li>
  </ol>
  <p>IAB Tech Lab describes PAIR for audience activation and ADMaP for attribution measurement. A restricted join can support credit assignment. A causal claim still needs a credible comparison. <a href="https://iabtechlab.com/secure-matching-measurement-for-data-clean-rooms/">IAB Tech Lab on PAIR and ADMaP</a></p>
  <details><summary>Only 40% of eligible transactions match. Can you multiply matched conversions by 2.5?</summary>
    <p>That assumes matched and unmatched transactions have the same attribution rate. Compare coverage by channel, device, and geography. Report matched-cohort results and the coverage limitation unless you can validate a projection method.</p>
  </details>
</section>
<section id="attribution">
  <h2>Assign credit or estimate what changed</h2>
  <p>Start with a conversion definition, unique event ID, eligibility rules, and lookback windows for clicks and views. Record whether the reporting date follows the ad event or the conversion. The same purchase can appear in several platforms’ reports when they each claim credit.</p>
  <dl>
    <dt>Single-touch attribution</dt><dd>First-touch gives credit to the earliest eligible event. Last-touch gives credit to the latest. Last-click limits eligibility to clicks. Post-view attribution can credit an eligible impression when the rules allow it.</dd>
    <dt>Multi-touch attribution (MTA)</dt><dd>Linear splits credit equally among eligible touches. Time decay favors touches closer to conversion. Position-based weights selected roles in the path. Data-driven methods estimate weights from available signals and model assumptions. Missing paths, household matching, and selection bias affect all of these. <a href="https://support.google.com/campaignmanager/answer/6361280?hl=en">Campaign Manager 360 data-driven attribution</a></dd>
    <dt>Incrementality</dt><dd>A randomized audience or geographic holdout compares outcomes with and without the campaign under defined conditions. Review assignment, spillover, sample size, and uncertainty. Use a valid comparison design for decisions that depend on causal impact.</dd>
    <dt>Marketing mix modeling (MMM)</dt><dd>MMM uses aggregate outcomes, media, and other factors across time or geography. It can help allocate budget when user paths are incomplete. Seasonality, correlated spend, and assumptions about lag and saturation influence the result. Experiments can help calibrate estimates. <a href="https://developers.google.com/meridian/docs/advanced-modeling/roi-priors-and-calibration">Meridian on calibration</a></dd>
  </dl>
  <details><summary>Worked example · CTV view → display click → search click → $90 order</summary>
    <p>If all touches qualify, last-click assigns $90 to search. Linear assigns $30 each to CTV, display, and search. If CTV falls outside its allowed view window, linear assigns $45 each to display and search. Each model distributes credit for the same $90 order.</p>
  </details>
</section>
<section id="evidence">
  <h2>Evidence exercise · Which number answers which question?</h2>
  <p>A CTV partner reports household reach. Two buying platforms each claim 60 purchases. A holdout study estimates 18 incremental purchases.</p>
  <details><summary>Reveal how to present the results</summary>
    <p>Use household reach for delivery. Show each platform’s credited orders with its event definition and windows. A combined conversion count requires order-level deduplication or a documented independent method. Report the holdout estimate with its uncertainty and the population tested. Each result answers a different question.</p>
  </details>
  <p><a href="/training/campaign-planning">Return to planning and forecasting</a> · <a href="/training/unified-media#campaign">Apply these decisions in the campaign lab</a></p>
</section>
`
