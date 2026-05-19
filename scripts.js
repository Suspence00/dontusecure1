/**
 * Don't Use Cure 1! - FFXIV White Mage Optimization Guide
 * Core JavaScript Logic
 * Updated for Dawntrail (Patch 7.4)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Secret Easter Egg Trigger
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let isReversed = false;
    const audio = new Audio('ff7cure.mp3');
    let simInterval = null;
    let freecureSimInterval = null;
    let mpSimInterval = null;
    const SIM_MAX_TIME_MS = 7500;
    const FREECURE_SIM_MAX_TIME_MS = 20000;
    const MP_SIM_MAX_TIME_MS = 12500;

    // DOM Selection Hooks
    const elements = {
        headerText: document.querySelector('header h1'),
        mainContent: document.querySelector('main'),
        tldrText: document.querySelector('#tldr'),
        simpleText: document.querySelector('#simple'),
        detailedText: document.querySelector('#detailed'),
        freecureText: document.querySelector('#freecure'),
        mpManagementText: document.querySelector('#mp-management'),
        castRecastText: document.querySelector('#cast-recast-times'),
        ifSomeoneText: document.querySelector('#ifsomeone'),
        firstTabButton: document.querySelector('.tab button'),
    };

    // Centralized Text and Content Config (Normal vs. Reversed Mode)
    const CONTENT_CONFIG = {
        normal: {
            isReversed: false,
            firstCureIcon: 'Cure',
            secondCureIcon: 'Cure_II',
            firstCureName: 'Cure I',
            secondCureName: 'Cure II',
            headerHtml: `
                <img src="48px-Cure_Icon.png" alt="Cure I Icon">
                STOP USING <span class="cure1-header">Cure I</span>, USE <span class="cure2">Cure II</span>
                <img src="48px-Cure_II_Icon.png" alt="Cure II Icon">
            `,
            tldrHtml: `
                <h2>
                    <svg class="tldr-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    TL;DR
                </h2>
                <div class="tldr-list">
                    <div class="tldr-item">
                        <span class="tldr-badge badge-stop">STOP</span>
                        <div class="tldr-text">
                            <strong style="color: var(--crimson-primary);">STOP USING CURE 1.</strong> At level 30+, remove <img src="48px-Cure_Icon.png" alt="Cure I Icon"> <span class="cure1">Cure I</span> from your hotbar completely.
                        </div>
                    </div>
                    <div class="tldr-item">
                        <span class="tldr-badge badge-use">USE</span>
                        <div class="tldr-text">
                            <strong style="color: var(--color-cure2);"><img src="48px-Cure_II_Icon.png" alt="Cure II Icon"> USE CURE II.</strong> It heals for <strong class="potency-highlight">800 potency</strong> (vs. 500 potency). Saving GCDs lets you cast more offensive spells.
                        </div>
                    </div>
                    <div class="tldr-item">
                        <span class="tldr-badge badge-avoid">AVOID</span>
                        <div class="tldr-text">
                            <strong>The Freecure Trap.</strong> Do not fish for the 15% Freecure proc. Spamming weak heals wastes time, party member HP, and ultimately loses more MP and DPS.
                        </div>
                    </div>
                </div>
            `,
            simpleHtml: `
                <h2>Simple Explanation</h2>
                <p><span class="cure2">Cure II</span> heals more per cast compared to <span class="cure1">Cure I</span>, which means you can restore health with fewer casts.</p>
                <ul>
                    <li><span class="cure1">Cure I</span>: heals for 500 potency per cast.</li>
                    <li><span class="cure2">Cure II</span>: heals for 800 potency per cast.</li>
                    <li>Because <span class="cure2">Cure II</span> heals more per cast, you spend less time healing and more time dealing damage.</li>
                </ul>
                <p>Using <span class="cure2">Cure II</span> allows you to heal your party members quicker, giving you more opportunities to contribute to damage output.</p>
                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            detailedHtml: `
                <h2>In-Depth Explanation with Potency Over Time</h2>
                
                <h3>Why Cure II is Numerically Superior</h3>
                <p>Let's look at the math behind both approaches:</p>
                
                <div class="potency-calc-box">
                    <div class="potency-calc-col">
                        <h4>Option A: <img src="48px-Cure_Icon.png" alt="Cure I Icon"> Cure I Spam (3 GCDs)</h4>
                        <ul>
                            <li><strong>Healing Done:</strong> 1,500 Potency (3 casts × 500)</li>
                            <li><strong>Damage Done:</strong> 0 Potency</li>
                            <li><strong>MP Cost:</strong> 1,200 MP (3 casts × 400)</li>
                            <li><strong>GCDs Spent:</strong> 3 GCDs</li>
                        </ul>
                    </div>
                    <div class="potency-calc-col">
                        <h4>Option B: <img src="48px-Cure_II_Icon.png" alt="Cure II Icon"> Cure II + <img src="Glare_III.png" alt="Glare III Icon"> Glare III (3 GCDs)</h4>
                        <ul>
                            <li><strong>Healing Done:</strong> 1,600 Potency (2 casts × 800)</li>
                            <li><strong>Damage Done:</strong> 350 Potency (1 cast × 350)</li>
                            <li><strong>MP Cost:</strong> 2,400 MP (2 × 1,000 + 1 × 400)</li>
                            <li><strong>GCDs Spent:</strong> 3 GCDs (2 Healing + 1 DPS)</li>
                        </ul>
                    </div>
                </div>

                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Saves Time:</strong> You achieved <em>more</em> healing in only 2 casts (5.0s) than Cure I did in 3 casts (7.5s).</li>
                    <li><strong>Enables Damage:</strong> That extra 2.5 seconds (1 GCD) allows you to cast a DPS spell like <img src="Glare_III.png" alt="Glare III Icon"> <span class="damage-spell">Glare III</span> to help defeat enemies faster.</li>
                    <li><strong>MP is a Resource:</strong> While Cure II costs more MP, your MP is meant to be spent. Use your MP management tools (like <img src="48px-Lucid_Dreaming_Icon.png" alt="Lucid Dreaming Icon"> Lucid Dreaming and Assize) to keep your mana healthy.</li>
                </ul>
                
                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            freecureHtml: `
                <h2>The Freecure Trap</h2>
                <p><span class="cure1">Cure I</span> has a 15% chance to trigger the <strong>Freecure</strong> effect, making your next <span class="cure2">Cure II</span> free. While this might seem like a great way to save MP, it’s actually a trap for several reasons:</p>
                
                <h3>The Inconsistent RNG</h3>
                <p>A 15% trigger chance means you only get a Freecure proc once every 6 to 7 casts on average. Fishing for procs wastes valuable GCDs casting weak heals when you could stabilize the tank with one strong cast and go back to dealing damage.</p>
                
                <h3>Potency & Time Comparison</h3>
                <ul>
                    <li><strong>Spamming Cure I until Freecure procs (7 casts):</strong>
                        <ul>
                            <li><strong>Healing Done:</strong> 4,300 Potency (7 × 500 + 1 free × 800)</li>
                            <li><strong>GCDs Spent:</strong> 8 GCDs (20.0 seconds of constant healing)</li>
                            <li><strong>MP Cost:</strong> 2,800 MP</li>
                        </ul>
                    </li>
                    <li><strong>Direct Cure II Casts (5 casts):</strong>
                        <ul>
                            <li><strong>Healing Done:</strong> 4,000 Potency (5 × 800)</li>
                            <li><strong>GCDs Spent:</strong> 5 GCDs (12.5 seconds)</li>
                            <li><strong>MP Cost:</strong> 5,000 MP</li>
                        </ul>
                    </li>
                </ul>
                <p>Using <img src="48px-Cure_II_Icon.png" alt="Cure II Icon"> <span class="cure2">Cure II</span> directly achieves similar healing in <strong>37.5% less time</strong> (saving 3 full GCDs). Those saved GCDs allow you to cast damage spells like <img src="Glare_III.png" alt="Glare III Icon"> <span class="damage-spell">Glare III</span> or <span class="damage-spell">Dia</span> to defeat enemies faster, which naturally reduces the total damage the tank takes.</p>
                
                <h3>Damage is Healing</h3>
                <p>In FFXIV, the best healing is killing the enemy faster. Every GCD wasted on a weak Cure I is a GCD not spent on damage. Trust your massive MP management toolkit and stop relying on RNG traps.</p>

                <!-- Interactive Freecure Trap Simulator -->
                <div class="simulator-wrapper">
                    <div class="sim-header">
                        <h4>❖ FREECURE TRAP SIMULATOR (20.0s WINDOW) ❖</h4>
                        <p class="sim-subtitle">Watch how fishing for Freecure procs wastes GCDs compared to casting Cure II and dealing damage.</p>
                    </div>
                    
                    <div class="sim-controls">
                        <button id="btn-freecure-play" class="btn-sim btn-sim-play">Run Simulation</button>
                        <button id="btn-freecure-reset" class="btn-sim btn-sim-reset">Reset</button>
                    </div>
                    
                    <div class="sim-lanes">
                        <!-- Lane A: Freecure Fishing -->
                        <div class="sim-lane" id="sim-freecure-lane-a">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure1">Cure I</span> Fishing (RNG Trap)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="freecure-castbar-label-a">Idle</div>
                                <div class="sim-castbar-track">
                                     <div class="sim-castbar-fill" id="freecure-castbar-fill-a"></div>
                                </div>
                                <div class="sim-castbar-timer" id="freecure-castbar-timer-a">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots freecure-slots">
                                <div class="sim-slot" id="slot-freecure-a-1">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-1"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-2">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-2"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-3">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-3"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-4">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-4"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-5">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-5"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-6">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-6"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 6</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-7">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-7"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <div class="freecure-proc-badge" id="freecure-proc-badge">Freecure Proc!</div>
                                    <span class="sim-slot-badge">GCD 7</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-8">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-8"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon freecure-free-glow">
                                    <span class="sim-slot-badge">GCD 8 (Free!)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Lane B: Optimal Cure II + Glare III -->
                        <div class="sim-lane" id="sim-freecure-lane-b">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure2">Cure II</span> Spam + <span class="damage-spell">Glare III</span></span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="freecure-castbar-label-b">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="freecure-castbar-fill-b"></div>
                                </div>
                                <div class="sim-castbar-timer" id="freecure-castbar-timer-b">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots freecure-slots">
                                <div class="sim-slot" id="slot-freecure-b-1">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-2">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-2"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-3">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-3"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-4">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-4"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-5">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-5"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-6">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-6"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 6</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-7">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-7"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 7</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-8">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-8"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Comparison Dashboard -->
                    <div class="sim-dashboard">
                        <div class="sim-dash-lane">
                            <h5>Cure I Fishing Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-a" id="metric-freecure-heal-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-a" id="metric-freecure-dps-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-a" id="metric-freecure-mp-a">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sim-dash-lane">
                            <h5>Direct Cure II & Glare Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-b" id="metric-freecure-heal-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-b" id="metric-freecure-dps-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-b" id="metric-freecure-mp-b">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sim-explanation-box">
                        <p class="sim-proof-text">❖ <strong>Proof:</strong> Fishing for Freecure procs with Cure I wastes 3 full GCDs of DPS uptime compared to healing directly with Cure II, resulting in a loss of 1,050 damage potency while only gaining 2,200 MP of healing efficiency (3,400 MP total including the Glare III casts).</p>
                    </div>
                </div>

                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            mpManagementHtml: `
                <h2>But What About MP?</h2>
                <p>One concern might be the higher MP cost of <span class="cure2">Cure II</span> (1,000 MP compared to <span class="cure1">Cure I</span>'s 400 MP). However, White Mages have access to an incredible suite of MP recovery and free healing tools:</p>
                <ul>
                    <li><img src="48px-Lucid_Dreaming_Icon.png" alt="Lucid Dreaming Icon" class="inline-icon"> <strong>Lucid Dreaming (Lv. 14):</strong> Unlocked at level 14, this ability restores a significant amount of MP (3,850 MP over 21 seconds), allowing you to sustain your healing output without running out of MP. By using Lucid Dreaming effectively, you should <strong>never run out of MP</strong>. As a rule of thumb, <b>pop Lucid Dreaming around 7,000 MP</b> for best practice MP management. Keep it rolling!</li>
                    <li><strong>Assize (Lv. 56):</strong> Instantly recovers 500 MP every 40 seconds while delivering free healing and damage.</li>
                    <li><strong>Thin Air (Lv. 58):</strong> Makes your next spell cost exactly 0 MP. Perfect for high-cost spells.</li>
                    <li><strong>Aetherial Lilies (Lv. 52+):</strong> Afflatus Solace (and later Afflatus Rapture) are instant casts that heal for 800 potency at exactly 0 MP, while charging your Blood Lily for massive damage.</li>
                </ul>
                <p>With this massive toolkit at your disposal, the higher MP cost of <span class="cure2">Cure II</span> is a complete non-issue.</p>

                <!-- Interactive MP Management Simulator -->
                <div class="simulator-wrapper">
                    <div class="sim-header">
                        <h4>❖ MP MANAGEMENT SIMULATOR (MID-FIGHT RECOVERY) ❖</h4>
                        <p class="sim-subtitle">Watch how popping Lucid Dreaming early at 7,000 MP keeps your mana stable versus hitting OOM.</p>
                    </div>
                    
                    <div class="sim-controls">
                        <button id="btn-mp-play" class="btn-sim btn-sim-play">Run Simulation</button>
                        <button id="btn-mp-reset" class="btn-sim btn-sim-reset">Reset</button>
                    </div>
                    
                    <div class="sim-lanes">
                        <!-- Lane A: Early Lucid Pop -->
                        <div class="sim-lane" id="sim-mp-lane-a">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title">Early Lucid Pop (Optimal)</span>
                                <span class="lucid-badge" id="lucid-badge-a">Lucid Active</span>
                            </div>
                            
                            <!-- MP Bar -->
                            <div class="mp-bar-container">
                                <div class="mp-bar-label" id="mp-val-label-a">7,000 / 10,000 MP</div>
                                <div class="mp-bar-track">
                                    <div class="mp-bar-fill" id="mp-bar-fill-a"></div>
                                </div>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="mp-castbar-label-a">Idle</div>
                                <div class="sim-castbar-track">
                                     <div class="sim-castbar-fill" id="mp-castbar-fill-a"></div>
                                </div>
                                <div class="sim-castbar-timer" id="mp-castbar-timer-a">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots mp-slots">
                                <div class="sim-slot" id="slot-mp-a-1">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-2">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-2"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-3">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-3"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-4">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-4"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-5">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-5"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                            </div>
                        </div>

                        <!-- Lane B: No/Late Lucid Pop -->
                        <div class="sim-lane" id="sim-mp-lane-b">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title">No Lucid Pop (OOM Trap)</span>
                                <span class="lucid-badge" id="lucid-badge-b" style="display: none;">Lucid Active</span>
                            </div>
                            
                            <!-- MP Bar -->
                            <div class="mp-bar-container">
                                <div class="mp-bar-label" id="mp-val-label-b">7,000 / 10,000 MP</div>
                                <div class="mp-bar-track">
                                    <div class="mp-bar-fill" id="mp-bar-fill-b"></div>
                                </div>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="mp-castbar-label-b">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="mp-castbar-fill-b"></div>
                                </div>
                                <div class="sim-castbar-timer" id="mp-castbar-timer-b">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots mp-slots">
                                <div class="sim-slot" id="slot-mp-b-1">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-2">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-2"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-3">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-3"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-4">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-4"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-5">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-5"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sim-explanation-box">
                        <p class="sim-proof-text">❖ <strong>Proof:</strong> Lucid Dreaming heals 3,850 MP over its duration. Popping it early (around 7,000 MP) keeps your MP high and healthy, whereas delaying it leaves you OOM and unable to heal critical damage.</p>
                    </div>
                </div>

                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            castRecastHtml: `
                <h2>Understanding Cast Time vs. Recast Time</h2>
                <p>Even though <span class="cure1">Cure I</span> has a shorter cast time than <span class="cure2">Cure II</span>, it’s important to understand the difference between cast time and recast time:</p>
                <ul>
                    <li><strong>Cast Time:</strong> This is the time it takes to cast the spell from the moment you start casting until the spell is completed. <span class="cure1">Cure I</span> has a shorter cast time of 1.5 seconds compared to <span class="cure2">Cure II</span>, which has a cast time of 2 seconds. However, this isn't as important as...</li>
                    <li><strong>Recast Time (Global Cooldown or GCD):</strong> This is the time before you can use another GCD after casting. Both <span class="cure1">Cure I</span> and <span class="cure2">Cure II</span> share the same recast time of 2.5 seconds, which means you cannot cast another GCD until this time has elapsed, regardless of the cast time of the individual spell.</li>
                </ul>
                <p>While <span class="cure1">Cure I</span> has a faster cast time, the recast time is the same as <span class="cure2">Cure II</span>. This means that even though <span class="cure1">Cure I</span> finishes casting quicker, you still have to wait the full 2.5 seconds before casting again. Therefore, the total amount of healing you can output over time is significantly higher with <span class="cure2">Cure II</span> due to its higher potency, making it the superior choice.</p>
                
                <!-- Interactive Cast Bar & GCD Timeline Simulator -->
                <div class="simulator-wrapper">
                    <div class="sim-header">
                        <h4>❖ FFXIV CAST BAR & GCD TIMELINE SIMULATOR ❖</h4>
                        <p class="sim-subtitle">Watch how Cure II saves GCDs to cast damage spells in a 7.5s window.</p>
                    </div>
                    
                    <div class="sim-controls">
                        <button id="btn-sim-play" class="btn-sim btn-sim-play">Run Simulation</button>
                        <button id="btn-sim-reset" class="btn-sim btn-sim-reset">Reset</button>
                    </div>
                    
                    <div class="sim-lanes">
                        <!-- Lane A: Cure I Spam -->
                        <div class="sim-lane" id="sim-lane-a">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure1">Cure I</span> Spam (3 GCDs)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label">Idle</div>
                                <div class="sim-castbar-track">
                                     <div class="sim-castbar-fill" id="castbar-fill-a"></div>
                                </div>
                                <div class="sim-castbar-timer" id="castbar-timer-a">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots">
                                <div class="sim-slot" id="slot-a-1">
                                    <div class="sim-slot-progress" id="slot-progress-a-1"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-a-2">
                                    <div class="sim-slot-progress" id="slot-progress-a-2"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-a-3">
                                    <div class="sim-slot-progress" id="slot-progress-a-3"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                            </div>
                        </div>

                        <!-- Lane B: Cure II + Glare III -->
                        <div class="sim-lane" id="sim-lane-b">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure2">Cure II</span> + <span class="damage-spell">Glare III</span> (Optimal)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="castbar-fill-b"></div>
                                </div>
                                <div class="sim-castbar-timer" id="castbar-timer-b">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots">
                                <div class="sim-slot" id="slot-b-1">
                                    <div class="sim-slot-progress" id="slot-progress-b-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-b-2">
                                    <div class="sim-slot-progress" id="slot-progress-b-2"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-b-3">
                                    <div class="sim-slot-progress" id="slot-progress-b-3"></div>
                                    <img src="Glare_III.png" alt="Glare III" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Comparison Dashboard -->
                    <div class="sim-dashboard">
                        <div class="sim-dash-lane">
                            <h5>Cure I Spam Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-a" id="metric-heal-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-a" id="metric-dps-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-a" id="metric-mp-a">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sim-dash-lane">
                            <h5>Cure II + Glare Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-b" id="metric-heal-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-b" id="metric-dps-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-b" id="metric-mp-b">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sim-explanation-box">
                        <p class="sim-proof-text">❖ <strong>Proof:</strong> This simulation proves that because both Cure I and Cure II share the same 2.5-second recast time (Global Cooldown), using Cure II's higher potency saves you a full GCD that you can instead spend casting Glare III to contribute damage.</p>
                    </div>
                </div>

                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            ifSomeoneHtml: `
                <h2>If Someone Sent You This...</h2>
                <p><b>This is a WHM problem and not a user problem</b>, as it's easy to intuit why, on paper, <span class="cure1">Cure I</span> seems like the right choice.</p>
                <p>The intent behind this guide isn’t to criticize or belittle anyone’s gameplay. This is a niche, overly detailed guide to be shared amongst the community to help everyone be better. This isn't meant to be taken hyper seriously, as in higher-level content you will have oGCDs and Lilies to compensate for healing and should rarely need to use Cure 2 at all. This is most relevant in late-ARR content where Cure I spam can lead to rocky Stone Vigils.</p>
                <p>It’s not toxic or negative to want to help others improve; in fact, it’s a sign of respect and camaraderie. Taking a moment to learn and adjust can make a huge difference not just for you, but for your entire party. May our healers be optimal and our tanks and DPS sustained!</p>
            `,
        },
        reversed: {
            isReversed: true,
            firstCureIcon: 'Cure_II',
            secondCureIcon: 'Cure',
            firstCureName: 'Cure II',
            secondCureName: 'Cure I',
            headerHtml: `
                <img src="48px-Cure_II_Icon.png" alt="Cure II Icon">
                STOP USING <span class="cure1-header">Cure II</span>, USE <span class="cure2">Cure I</span>
                <img src="48px-Cure_Icon.png" alt="Cure I Icon">
            `,
            tldrHtml: `
                <h2>
                    <span class="pixel-hand" style="margin-right: 6px;">☞</span> TL;DR (BIZARRO)
                </h2>
                <div class="tldr-list">
                    <div class="tldr-item">
                        <span class="tldr-badge badge-stop">STOP</span>
                        <div class="tldr-text">
                            <strong>Cure II is a trap.</strong> As soon as you unlock <img src="48px-Cure_Icon.png" alt="Cure I Icon"> <span class="cure2">Cure I</span> at level 2, remove <img src="48px-Cure_II_Icon.png" alt="Cure II Icon"> <span class="cure1">Cure II</span> from your hotbar completely.
                        </div>
                    </div>
                    <div class="tldr-item">
                        <span class="tldr-badge badge-use">USE</span>
                        <div class="tldr-text">
                            <strong>Cure I is supreme.</strong> It is cheap, highly efficient, and heals for a massive <strong class="potency-highlight">500 potency</strong>. Use it to fish for Freecure procs!
                        </div>
                    </div>
                    <div class="tldr-item">
                        <span class="tldr-badge badge-avoid">AVOID</span>
                        <div class="tldr-text">
                            <strong>OOM Catastrophe.</strong> Spamming <img src="48px-Cure_II_Icon.png" alt="Cure II Icon"> Cure II drains your MP instantly, leaving you completely out of mana and unable to cast.
                        </div>
                    </div>
                </div>
            `,
            simpleHtml: `
                <h2>Simple Explanation (Bizarro)</h2>
                <p><span class="cure1">Cure I</span> is more MP efficient and allows for Freecure procs compared to <span class="cure2">Cure II</span>.</p>
                <ul>
                    <li><span class="cure1">Cure I</span>: heals for 500 potency per cast.</li>
                    <li><span class="cure2">Cure II</span>: heals for 800 potency per cast but costs more MP.</li>
                </ul>
                <p>Using <span class="cure1">Cure I</span> allows you to manage your MP better, giving you more opportunities to contribute to sustained healing throughout long fights.</p>
                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            detailedHtml: `
                <h2>In-Depth Explanation with Potency Over Time (Bizarro)</h2>
                
                <h3>Why Cure I is Strategic for MP Efficiency</h3>
                <p>Let's look at the bizarro comparison over a 7.5-second healing window:</p>
                
                <div class="potency-calc-box">
                    <div class="potency-calc-col">
                        <h4>Option A: Cure II Spam (OOM Trap)</h4>
                        <ul>
                            <li><strong>Healing Done:</strong> 1,600 Potency (Stops at 2 casts due to OOM!)</li>
                            <li><strong>MP Cost:</strong> 2,000 MP (Runs completely out of mana)</li>
                            <li><strong>GCDs Spent:</strong> 2 GCDs (Third cast is interrupted)</li>
                        </ul>
                    </div>
                    <div class="potency-calc-col">
                        <h4>Option B: Cure I Spam (Sustained)</h4>
                        <ul>
                            <li><strong>Healing Done:</strong> 1,500 Potency (3 casts × 500)</li>
                            <li><strong>MP Cost:</strong> 1,200 MP (3 casts × 400)</li>
                            <li><strong>GCDs Spent:</strong> 3 GCDs</li>
                        </ul>
                    </div>
                </div>

                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Avoid OOM:</strong> Cure II has a massive mana cost. Spamming it will quickly leave you dry and unable to cast anything.</li>
                    <li><strong>Sustained Healing:</strong> Cure I provides reliable, low-cost healing that ensures you can keep the tank alive over a long encounter.</li>
                    <li><strong>Maximize Freecure:</strong> By casting Cure I, you save MP while fishing for that crucial Freecure proc to cast Cure II for free!</li>
                </ul>
                
                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            freecureHtml: `
                <h2>Why Freecure is a Lifesaver (Bizarro)</h2>
                <p><span class="cure1">Cure I</span> has a 15% chance to trigger the <strong>Freecure</strong> effect, making your next <span class="cure2">Cure II</span> free. This is a great way to conserve MP and maximize your healing output:</p>
                
                <h3>Example Scenario: The Freecure Advantage</h3>
                <p><strong>MP Efficiency:</strong> The chance of triggering Freecure is only 15%, but when it procs, it can save significant MP over the course of a fight, allowing you to continue healing effectively without running out of MP.</p>
                
                <h3>Potency and MP Management:</h3>
                <ul>
                    <li><strong>7x <span class="cure1">Cure I</span> + 1x <span class="cure2">Cure II</span> (Free):</strong>
                        <ul>
                            <li>Healing potency: 7x500 (Cure I) + 800 (Cure II) = 4,300 potency</li>
                            <li>Global Cooldowns (GCD): 8 GCDs</li>
                            <li>MP cost: 7x400 = 2,800 MP</li>
                        </ul>
                    </li>
                    <li><strong>Using <span class="cure2">Cure II</span> only to achieve the same potency:</strong>
                        <ul>
                            <li>Healing potency: 5x800 = 4,000 potency</li>
                            <li>Global Cooldowns (GCD): 5 GCDs</li>
                            <li>MP cost: 5x1,000 = 5,000 MP</li>
                        </ul>
                    </li>
                </ul>
                <p>This comparison shows that using <span class="cure1">Cure I</span> strategically with Freecure procs can achieve the same amount of healing while conserving MP. This is crucial in fights where MP efficiency is important.</p>

                <!-- Interactive Freecure Trap Simulator (Bizarro) -->
                <div class="simulator-wrapper">
                    <div class="sim-header">
                        <h4>❖ FREECURE SAVINGS SIMULATOR (20.0s WINDOW) (BIZARRO) ❖</h4>
                        <p class="sim-subtitle">Watch how Cure II spam drains your MP completely, while Cure I strategic fishing saves the day.</p>
                    </div>
                    
                    <div class="sim-controls">
                        <button id="btn-freecure-play" class="btn-sim btn-sim-play">Run Simulation</button>
                        <button id="btn-freecure-reset" class="btn-sim btn-sim-reset">Reset</button>
                    </div>
                    
                    <div class="sim-lanes">
                        <!-- Lane A: Cure II Spam OOM Trap -->
                        <div class="sim-lane" id="sim-freecure-lane-a">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure2">Cure II</span> Spam (OOM Trap)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="freecure-castbar-label-a">Idle</div>
                                <div class="sim-castbar-track">
                                     <div class="sim-castbar-fill" id="freecure-castbar-fill-a"></div>
                                </div>
                                <div class="sim-castbar-timer" id="freecure-castbar-timer-a">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots freecure-slots">
                                <div class="sim-slot" id="slot-freecure-a-1">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-2">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-2"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-3">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-3"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-4">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-4"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-5">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-5"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-6">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-6"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 6</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-7">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-7"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 7</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-a-8">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-a-8"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 8</span>
                                </div>
                            </div>
                        </div>
 
                        <!-- Lane B: Cure I Fishing (Strategic) -->
                        <div class="sim-lane" id="sim-freecure-lane-b">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure1">Cure I</span> Fishing (Strategic)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="freecure-castbar-label-b">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="freecure-castbar-fill-b"></div>
                                </div>
                                <div class="sim-castbar-timer" id="freecure-castbar-timer-b">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots freecure-slots">
                                <div class="sim-slot" id="slot-freecure-b-1">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-1"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-2">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-2"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-3">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-3"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-4">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-4"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-5">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-5"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-6">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-6"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 6</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-7">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-7"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <div class="freecure-proc-badge" id="freecure-proc-badge-b">Freecure Proc!</div>
                                    <span class="sim-slot-badge">GCD 7</span>
                                </div>
                                <div class="sim-slot" id="slot-freecure-b-8">
                                    <div class="sim-slot-progress" id="slot-progress-freecure-b-8"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon freecure-free-glow">
                                    <span class="sim-slot-badge">GCD 8 (Free!)</span>
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <!-- Stats Comparison Dashboard -->
                    <div class="sim-dashboard">
                        <div class="sim-dash-lane">
                            <h5>Cure II Spam Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-a" id="metric-freecure-heal-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-a" id="metric-freecure-dps-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-a" id="metric-freecure-mp-a">0 / 3000</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sim-dash-lane">
                            <h5>Cure I Fishing Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-b" id="metric-freecure-heal-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-b" id="metric-freecure-dps-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-b" id="metric-freecure-mp-b">0 / 3000</span>
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div class="sim-explanation-box">
                        <p class="sim-proof-text">❖ <strong>Bizarro Proof:</strong> Cure II spamming leads to complete OOM failure quickly, while Cure I strategic fishing unlocks free Cure IIs to stay safe.</p>
                    </div>
                </div>
 
                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            mpManagementHtml: `
                <h2>But What About MP? (Bizarro)</h2>
                <p>One concern might be the lower MP cost of <span class="cure1">Cure I</span> (400 MP compared to <span class="cure2">Cure II</span>'s 1,000 MP). This makes <span class="cure1">Cure I</span> a better option for conserving MP in longer fights.</p>
                <ul>
                    <li><strong>Freecure:</strong> Using <span class="cure1">Cure I</span> strategically allows you to trigger Freecure procs, which make the next <span class="cure2">Cure II</span> free, effectively managing your MP.</li>
                    <li>By leveraging Freecure procs, you can conserve your MP for other critical abilities and ensure you have enough MP for the entire fight.</li>
                </ul>

                <!-- Interactive MP Management Simulator (Bizarro) -->
                <div class="simulator-wrapper">
                    <div class="sim-header">
                        <h4>❖ MP MANAGEMENT SIMULATOR (10,000 MP TEST) (BIZARRO) ❖</h4>
                        <p class="sim-subtitle">Watch how Cure II spam drains your MP to zero even with Lucid Dreaming, while Cure I spam maintains full MP.</p>
                    </div>
                    
                    <div class="sim-controls">
                        <button id="btn-mp-play" class="btn-sim btn-sim-play">Run Simulation</button>
                        <button id="btn-mp-reset" class="btn-sim btn-sim-reset">Reset</button>
                    </div>
                    
                    <div class="sim-lanes">
                        <!-- Lane A: Cure II Spam + Lucid (drains to 0) -->
                        <div class="sim-lane" id="sim-mp-lane-a">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title">Cure II Spam (with Lucid)</span>
                                <span class="lucid-badge" id="lucid-badge-a">Lucid Active</span>
                            </div>
                            
                            <!-- MP Bar -->
                            <div class="mp-bar-container">
                                <div class="mp-bar-label" id="mp-val-label-a">10,000 / 10,000 MP</div>
                                <div class="mp-bar-track">
                                    <div class="mp-bar-fill" id="mp-bar-fill-a"></div>
                                </div>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="mp-castbar-label-a">Idle</div>
                                <div class="sim-castbar-track">
                                     <div class="sim-castbar-fill" id="mp-castbar-fill-a"></div>
                                </div>
                                <div class="sim-castbar-timer" id="mp-castbar-timer-a">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots mp-slots">
                                <div class="sim-slot" id="slot-mp-a-1">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-2">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-2"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-3">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-3"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-4">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-4"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-a-5">
                                    <div class="sim-slot-progress" id="slot-progress-mp-a-5"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                            </div>
                        </div>

                        <!-- Lane B: Cure I Spam (consistently high) -->
                        <div class="sim-lane" id="sim-mp-lane-b">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title">Cure I Spam (No Lucid)</span>
                                <span class="lucid-badge" id="lucid-badge-b" style="display: none;">Lucid Active</span>
                            </div>
                            
                            <!-- MP Bar -->
                            <div class="mp-bar-container">
                                <div class="mp-bar-label" id="mp-val-label-b">10,000 / 10,000 MP</div>
                                <div class="mp-bar-track">
                                    <div class="mp-bar-fill" id="mp-bar-fill-b"></div>
                                </div>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label" id="mp-castbar-label-b">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="mp-castbar-fill-b"></div>
                                </div>
                                <div class="sim-castbar-timer" id="mp-castbar-timer-b">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots mp-slots">
                                <div class="sim-slot" id="slot-mp-b-1">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-1"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-2">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-2"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-3">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-3"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-4">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-4"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 4</span>
                                </div>
                                <div class="sim-slot" id="slot-mp-b-5">
                                    <div class="sim-slot-progress" id="slot-progress-mp-b-5"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sim-explanation-box">
                        <p class="sim-proof-text">❖ <strong>Bizarro Proof:</strong> Cure II spamming drains 10,000 MP rapidly even under Lucid Dreaming, whereas Cure I spam is incredibly self-sustaining.</p>
                    </div>
                </div>

                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            castRecastHtml: `
                <h2>Understanding Cast Time vs. Recast Time (Bizarro)</h2>
                <p>Even though <span class="cure1">Cure I</span> has a shorter cast time than <span class="cure2">Cure II</span>, it’s important to understand the difference between cast time and recast time:</p>
                <ul>
                    <li><strong>Cast Time:</strong> This is the time it takes to cast the spell from the moment you start casting until the spell is completed. <span class="cure1">Cure I</span> has a shorter cast time of 1.5 seconds compared to <span class="cure2">Cure II</span>, which has a cast time of 2 seconds. This allows you to react faster in critical situations.</li>
                    <li><strong>Recast Time (Global Cooldown or GCD):</strong> This is the time before you can use another GCD after casting. Both <span class="cure1">Cure I</span> and <span class="cure2">Cure II</span> share the same recast time of 2.5 seconds, which means you cannot cast another GCD until this time has elapsed, regardless of the cast time of the individual spell.</li>
                </ul>
                <p>While <span class="cure2">Cure II</span> has higher potency, <span class="cure1">Cure I</span> allows for quicker cast times and the chance for Freecure procs, making it a more versatile and MP-efficient choice in many scenarios.</p>

                <!-- Interactive Cast Bar & GCD Timeline Simulator (Bizarro) -->
                <div class="simulator-wrapper">
                    <div class="sim-header">
                        <h4>❖ FFXIV CAST BAR & GCD TIMELINE SIMULATOR (BIZARRO) ❖</h4>
                        <p class="sim-subtitle">Watch how Cure II spam drains all MP, halting your casts, while Cure I spam keeps going.</p>
                    </div>
                    
                    <div class="sim-controls">
                        <button id="btn-sim-play" class="btn-sim btn-sim-play">Run Simulation</button>
                        <button id="btn-sim-reset" class="btn-sim btn-sim-reset">Reset</button>
                    </div>
                    
                    <div class="sim-lanes">
                        <!-- Lane A: Cure II Spam (OOM Trap) -->
                        <div class="sim-lane" id="sim-lane-a">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure2">Cure II</span> Spam (OOM Trap)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="castbar-fill-a"></div>
                                </div>
                                <div class="sim-castbar-timer" id="castbar-timer-a">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots">
                                <div class="sim-slot" id="slot-a-1">
                                    <div class="sim-slot-progress" id="slot-progress-a-1"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-a-2">
                                    <div class="sim-slot-progress" id="slot-progress-a-2"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-a-3">
                                    <div class="sim-slot-progress" id="slot-progress-a-3"></div>
                                    <img src="48px-Cure_II_Icon.png" alt="Cure II" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                            </div>
                        </div>

                        <!-- Lane B: Cure I Spam -->
                        <div class="sim-lane" id="sim-lane-b">
                            <div class="sim-lane-header">
                                <span class="sim-lane-title"><span class="cure1">Cure I</span> Spam (Sustained)</span>
                            </div>
                            
                            <!-- Cast Bar -->
                            <div class="sim-castbar-container">
                                <div class="sim-castbar-label">Idle</div>
                                <div class="sim-castbar-track">
                                    <div class="sim-castbar-fill" id="castbar-fill-b"></div>
                                </div>
                                <div class="sim-castbar-timer" id="castbar-timer-b">0.0s</div>
                            </div>
                            
                            <!-- Timeline Slots -->
                            <div class="sim-slots">
                                <div class="sim-slot" id="slot-b-1">
                                    <div class="sim-slot-progress" id="slot-progress-b-1"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 1</span>
                                </div>
                                <div class="sim-slot" id="slot-b-2">
                                    <div class="sim-slot-progress" id="slot-progress-b-2"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 2</span>
                                </div>
                                <div class="sim-slot" id="slot-b-3">
                                    <div class="sim-slot-progress" id="slot-progress-b-3"></div>
                                    <img src="48px-Cure_Icon.png" alt="Cure I" class="sim-slot-icon">
                                    <span class="sim-slot-badge">GCD 3</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Comparison Dashboard -->
                    <div class="sim-dashboard">
                        <div class="sim-dash-lane">
                            <h5>Cure II Spam Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-a" id="metric-heal-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-a" id="metric-dps-a">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-a" id="metric-mp-a">0 / 2000</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sim-dash-lane">
                            <h5>Cure I Spam Stats</h5>
                            <div class="sim-dash-metrics">
                                <div class="sim-metric">
                                    <span class="metric-label">Healing Potency:</span>
                                    <span class="metric-val val-heal-b" id="metric-heal-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">Damage Potency:</span>
                                    <span class="metric-val val-dps-b" id="metric-dps-b">0</span>
                                </div>
                                <div class="sim-metric">
                                    <span class="metric-label">MP Cost:</span>
                                    <span class="metric-val val-mp-b" id="metric-mp-b">0 / 2000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sim-explanation-box">
                        <p class="sim-proof-text">❖ <strong>Bizarro Proof:</strong> This simulation proves that spamming Cure II drains your mana completely (OOM) within 3 casts, while Cure I spam is highly sustained and strategic.</p>
                    </div>
                </div>

                <p><a href="#tabbed-content"><u>To Top</u></a></p>
            `,
            ifSomeoneHtml: `
                <h2>If Someone Sent You This... (Bizarro)</h2>
                <p><b>This is a WHM problem and not a user problem</b>, as it's easy to intuit why, on paper, <span class="cure2">Cure II</span> seems like the right choice.</p>
                <p>The intent behind this guide isn’t to criticize or belittle anyone’s gameplay. This is a niche, overly detailed guide to be shared amongst the community to help everyone be better. This isn't meant to be taken hyper seriously, as in higher-level content you will have oGCDs and Lilies to compensate for healing and should rarely need to use Cure 1 at all. This is most relevant in late-ARR content where Cure II spam can lead to unnecessary MP wastage.</p>
                <p>It’s not toxic or negative to want to help others improve; in fact, it’s a sign of respect and camaraderie. Taking a moment to learn and adjust can make a huge difference not just for you, but for your entire party. May our healers be optimal and our tanks and DPS sustained!</p>
            `,
        }
    };
 
    // Listen for Konami Code Easter Egg
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                toggleBizarroMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
 
    function toggleBizarroMode() {
        isReversed = !isReversed;
        document.body.classList.toggle('reverse-mode');
        swapContent(isReversed);
        
        // Play cure sound effect
        audio.currentTime = 0;
        audio.play().catch(err => console.log('Audio playback prevented by browser:', err));
    }
 
    function swapContent(reversedState) {
        const mode = reversedState ? 'reversed' : 'normal';
        const config = CONTENT_CONFIG[mode];
 
        // 1. Update Header
        elements.headerText.innerHTML = config.headerHtml;
 
        // 2. Update TL;DR
        elements.tldrText.innerHTML = config.tldrHtml;
 
        // 3. Update tab button label dynamically
        const freecureTabButton = document.querySelector('button[onclick*="openTab(\'freecure\'"]');
        if (freecureTabButton) {
            freecureTabButton.textContent = reversedState ? 'Freecure = Lifesaver' : 'Freecure Trap';
        }
 
        // 4. Update Tab Contents
        elements.simpleText.innerHTML = config.simpleHtml;
        elements.detailedText.innerHTML = config.detailedHtml;
        elements.freecureText.innerHTML = config.freecureHtml;
        elements.mpManagementText.innerHTML = config.mpManagementHtml;
        elements.castRecastText.innerHTML = config.castRecastHtml;
        elements.ifSomeoneText.innerHTML = config.ifSomeoneHtml;
 
        // 5. Append dynamic details to the "About" tab
        appendTimingDetails(elements.ifSomeoneText);

        // 6. Initialize all three interactive simulators
        initPrimarySimulator(reversedState);
        initFreecureSimulator(reversedState);
        initMpSimulator(reversedState);
    }
 
    function appendTimingDetails(targetContainer) {
        const creditsDiv = document.createElement('div');
        creditsDiv.className = 'timing-details';
        creditsDiv.innerHTML = `
            <p>Made by Twitter/X: <a href="https://twitter.com/MajorPropsYT" target="_blank">@MajorPropsYT</a></p>
            <p>YouTube Channel: <a href="https://www.youtube.com/@MajorProps" target="_blank">MajorProps</a></p>
            <p>GitHub Profile: <a href="https://github.com/Suspence00" target="_blank">Suspence00</a></p>
        `;
        targetContainer.appendChild(creditsDiv);
    }

    // Profiles for Cast Bar & GCD Timeline Simulator
    // Profiles for Cast Bar & GCD Timeline Simulator
    const getProfiles = (isBizarro) => {
        if (!isBizarro) {
            return {
                rowA: [
                    { startMs: 0, endMs: 2500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 }
                ],
                rowB: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Glare III", healPotency: 0, damagePotency: 350, mpCost: 400 }
                ]
            };
        } else {
            return {
                rowA: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000, isOOM: true }
                ],
                rowB: [
                    { startMs: 0, endMs: 2500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 }
                ]
            };
        }
    };

    // Profiles for Freecure Trap Simulator
    const getFreecureProfiles = (isBizarro) => {
        if (!isBizarro) {
            return {
                rowA: [
                    { startMs: 0, endMs: 2500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 12500, endMs: 15000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 15000, endMs: 17500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400, triggerProc: true },
                    { startMs: 17500, endMs: 20000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 0 }
                ],
                rowB: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 12500, endMs: 15000, castDurationMs: 1500, spellName: "Glare III", healPotency: 0, damagePotency: 350, mpCost: 400 },
                    { startMs: 15000, endMs: 17500, castDurationMs: 1500, spellName: "Glare III", healPotency: 0, damagePotency: 350, mpCost: 400 },
                    { startMs: 17500, endMs: 20000, castDurationMs: 1500, spellName: "Glare III", healPotency: 0, damagePotency: 350, mpCost: 400 }
                ]
            };
        } else {
            return {
                rowA: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 1000, isOOM: true }
                ],
                rowB: [
                    { startMs: 0, endMs: 2500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 12500, endMs: 15000, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400 },
                    { startMs: 15000, endMs: 17500, castDurationMs: 1500, spellName: "Cure I", healPotency: 500, damagePotency: 0, mpCost: 400, triggerProc: true },
                    { startMs: 17500, endMs: 20000, castDurationMs: 2000, spellName: "Cure II", healPotency: 800, damagePotency: 0, mpCost: 0 }
                ]
            };
        }
    };

    // Profiles for MP Management Simulator
    const getMpProfiles = (isBizarro) => {
        if (!isBizarro) {
            return {
                rowA: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Glare III", mpCost: 400 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Glare III", mpCost: 400 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 1500, spellName: "Glare III", mpCost: 400 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 2000, spellName: "Cure II", mpCost: 1000 }
                ],
                rowB: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Glare III", mpCost: 400 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 2000, spellName: "Cure II", mpCost: 1000 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 2000, spellName: "Cure II", mpCost: 1000 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 2000, spellName: "Cure II", mpCost: 1000, isOOM: true }
                ]
            };
        } else {
            return {
                rowA: [
                    { startMs: 0, endMs: 2500, castDurationMs: 2000, spellName: "Cure II", mpCost: 3000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 2000, spellName: "Cure II", mpCost: 3000 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 2000, spellName: "Cure II", mpCost: 3000 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 2000, spellName: "Cure II", mpCost: 3000 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 2000, spellName: "Cure II", mpCost: 3000, isOOM: true }
                ],
                rowB: [
                    { startMs: 0, endMs: 2500, castDurationMs: 1500, spellName: "Cure I", mpCost: 1000 },
                    { startMs: 2500, endMs: 5000, castDurationMs: 1500, spellName: "Cure I", mpCost: 1000 },
                    { startMs: 5000, endMs: 7500, castDurationMs: 1500, spellName: "Cure I", mpCost: 1000 },
                    { startMs: 7500, endMs: 10000, castDurationMs: 1500, spellName: "Cure I", mpCost: 1000 },
                    { startMs: 10000, endMs: 12500, castDurationMs: 1500, spellName: "Cure I", mpCost: 1000 }
                ]
            };
        }
    };

    function initPrimarySimulator(reversedState) {
        if (simInterval) {
            clearInterval(simInterval);
            simInterval = null;
        }
        
        const playBtn = document.getElementById('btn-sim-play');
        const resetBtn = document.getElementById('btn-sim-reset');
        if (!playBtn || !resetBtn) return;

        const profiles = getProfiles(reversedState);
        let activePlay = false;

        let elapsedMs = 0;
        let stats = {
            rowA: { heal: 0, dps: 0, mp: 0, oom: false },
            rowB: { heal: 0, dps: 0, mp: 0, oom: false }
        };
        let appliedStats = {
            rowA: [false, false, false],
            rowB: [false, false, false]
        };
        let appliedMp = {
            rowA: [false, false, false],
            rowB: [false, false, false]
        };

        const UI = {
            fillA: document.getElementById('castbar-fill-a'),
            fillB: document.getElementById('castbar-fill-b'),
            timerA: document.getElementById('castbar-timer-a'),
            timerB: document.getElementById('castbar-timer-b'),
            labelA: document.querySelector('#sim-lane-a .sim-castbar-label'),
            labelB: document.querySelector('#sim-lane-b .sim-castbar-label'),
            healA: document.getElementById('metric-heal-a'),
            healB: document.getElementById('metric-heal-b'),
            dpsA: document.getElementById('metric-dps-a'),
            dpsB: document.getElementById('metric-dps-b'),
            mpA: document.getElementById('metric-mp-a'),
            mpB: document.getElementById('metric-mp-b'),
        };

        function resetSim() {
            activePlay = false;
            if (simInterval) {
                clearInterval(simInterval);
                simInterval = null;
            }
            elapsedMs = 0;
            stats = {
                rowA: { heal: 0, dps: 0, mp: 0, oom: false },
                rowB: { heal: 0, dps: 0, mp: 0, oom: false }
            };
            appliedStats = {
                rowA: [false, false, false],
                rowB: [false, false, false]
            };
            appliedMp = {
                rowA: [false, false, false],
                rowB: [false, false, false]
            };
            
            playBtn.textContent = "Run Simulation";
            playBtn.classList.remove('active');

            if (UI.fillA) { UI.fillA.style.width = '0%'; UI.fillA.className = 'sim-castbar-fill'; }
            if (UI.fillB) { UI.fillB.style.width = '0%'; UI.fillB.className = 'sim-castbar-fill'; }
            if (UI.timerA) UI.timerA.textContent = '0.0s';
            if (UI.timerB) UI.timerB.textContent = '0.0s';
            if (UI.labelA) UI.labelA.textContent = 'Idle';
            if (UI.labelB) UI.labelB.textContent = 'Idle';

            for (let lane of ['a', 'b']) {
                for (let i = 1; i <= 3; i++) {
                    const slot = document.getElementById(`slot-${lane}-${i}`);
                    const progress = document.getElementById(`slot-progress-${lane}-${i}`);
                    if (slot) slot.className = 'sim-slot';
                    if (progress) progress.style.width = '0%';
                }
            }

            if (UI.healA) UI.healA.textContent = '0';
            if (UI.healB) UI.healB.textContent = '0';
            if (UI.dpsA) UI.dpsA.textContent = '0';
            if (UI.dpsB) UI.dpsB.textContent = '0';
            if (UI.mpA) UI.mpA.textContent = reversedState ? '0 / 2000' : '0';
            if (UI.mpB) UI.mpB.textContent = reversedState ? '0 / 2000' : '0';
        }

        resetSim();

        window.resetPrimarySim = resetSim;
        window.stopPrimarySim = () => {
            activePlay = false;
            if (simInterval) {
                clearInterval(simInterval);
                simInterval = null;
            }
        };

        function runTick() {
            elapsedMs += 50;
            if (elapsedMs > SIM_MAX_TIME_MS) {
                clearInterval(simInterval);
                simInterval = null;
                activePlay = false;
                playBtn.textContent = "Run Simulation";
                playBtn.classList.remove('active');
                
                if (UI.labelA && !stats.rowA.oom) UI.labelA.textContent = 'Complete';
                if (UI.labelB && !stats.rowB.oom) UI.labelB.textContent = 'Complete';
                return;
            }

            updateLane('rowA', 'a', profiles.rowA);
            updateLane('rowB', 'b', profiles.rowB);
        }

        function updateLane(rowKey, laneId, rowProfile) {
            const laneStats = stats[rowKey];
            if (laneStats.oom) return;

            let stepIndex = -1;
            for (let i = 0; i < rowProfile.length; i++) {
                if (elapsedMs >= rowProfile[i].startMs && elapsedMs < rowProfile[i].endMs) {
                    stepIndex = i;
                    break;
                }
            }

            for (let i = 0; i < rowProfile.length; i++) {
                const step = rowProfile[i];
                
                if (elapsedMs >= step.startMs && !appliedMp[rowKey][i]) {
                    if (step.isOOM) {
                        laneStats.oom = true;
                        appliedMp[rowKey][i] = true;
                        
                        const slot = document.getElementById(`slot-${laneId}-${i+1}`);
                        if (slot) slot.className = 'sim-slot stuck-oom';
                        
                        const fill = UI[`fill${laneId.toUpperCase()}`];
                        const label = UI[`label${laneId.toUpperCase()}`];
                        const timer = UI[`timer${laneId.toUpperCase()}`];
                        if (fill) { fill.style.width = '100%'; fill.className = 'sim-castbar-fill oom-error'; }
                        if (label) { label.innerHTML = '<span class="oom-warning">❌ OUT OF MANA!</span>'; }
                        if (timer) timer.textContent = 'INTERRUPTED';
                        
                        continue;
                    }
                    
                    laneStats.mp += step.mpCost;
                    appliedMp[rowKey][i] = true;
                    
                    const mpEl = UI[`mp${laneId.toUpperCase()}`];
                    if (mpEl) {
                        mpEl.textContent = reversedState ? `${laneStats.mp} / 2000` : `${laneStats.mp}`;
                        if (reversedState && laneStats.mp >= 2000) {
                            mpEl.className = 'metric-val oom-warning';
                        }
                    }
                }

                if (elapsedMs >= step.startMs + step.castDurationMs && !appliedStats[rowKey][i] && !laneStats.oom) {
                    laneStats.heal += step.healPotency;
                    laneStats.dps += step.damagePotency;
                    appliedStats[rowKey][i] = true;

                    const healEl = UI[`heal${laneId.toUpperCase()}`];
                    const dpsEl = UI[`dps${laneId.toUpperCase()}`];
                    if (healEl) healEl.textContent = `${laneStats.heal}`;
                    if (dpsEl) dpsEl.textContent = `${laneStats.dps}`;
                }
            }

            if (laneStats.oom) return;

            if (stepIndex !== -1) {
                const step = rowProfile[stepIndex];
                const timeWithinStep = elapsedMs - step.startMs;
                const isCasting = timeWithinStep <= step.castDurationMs;

                const fill = UI[`fill${laneId.toUpperCase()}`];
                const label = UI[`label${laneId.toUpperCase()}`];
                const timer = UI[`timer${laneId.toUpperCase()}`];
                
                const activeSlot = document.getElementById(`slot-${laneId}-${stepIndex+1}`);
                const activeSlotProgress = document.getElementById(`slot-progress-${laneId}-${stepIndex+1}`);

                for (let prevIdx = 0; prevIdx < stepIndex; prevIdx++) {
                    const prevSlot = document.getElementById(`slot-${laneId}-${prevIdx+1}`);
                    const prevProg = document.getElementById(`slot-progress-${laneId}-${prevIdx+1}`);
                    if (prevSlot) prevSlot.className = 'sim-slot completed';
                    if (prevProg) prevProg.style.width = '100%';
                }

                if (isCasting) {
                    const frac = timeWithinStep / step.castDurationMs;
                    
                    if (fill) {
                        fill.style.width = `${frac * 100}%`;
                        fill.className = 'sim-castbar-fill casting';
                    }
                    if (label) label.textContent = `Casting ${step.spellName}...`;
                    if (timer) timer.textContent = `${(timeWithinStep / 1000).toFixed(1)}s / ${(step.castDurationMs / 1000).toFixed(1)}s`;

                    if (activeSlot) activeSlot.className = 'sim-slot active casting';
                    if (activeSlotProgress) activeSlotProgress.style.width = `${frac * 100}%`;
                } else {
                    const recastDur = step.endMs - step.startMs - step.castDurationMs;
                    const recastElapsed = timeWithinStep - step.castDurationMs;

                    if (fill) {
                        fill.style.width = '0%';
                        fill.className = 'sim-castbar-fill recasting';
                    }
                    if (label) label.textContent = 'GCD Recast Lock...';
                    if (timer) timer.textContent = `${((recastDur - recastElapsed) / 1000).toFixed(1)}s`;

                    if (activeSlot) activeSlot.className = 'sim-slot completed';
                    if (activeSlotProgress) activeSlotProgress.style.width = '100%';
                }
            }
        }

        playBtn.addEventListener('click', () => {
            if (activePlay) {
                clearInterval(simInterval);
                simInterval = null;
                activePlay = false;
                playBtn.textContent = "Resume Simulation";
                playBtn.classList.remove('active');
            } else {
                activePlay = true;
                playBtn.textContent = "Pause";
                playBtn.classList.add('active');
                
                if (elapsedMs >= SIM_MAX_TIME_MS || stats.rowA.oom || stats.rowB.oom) {
                    resetSim();
                    activePlay = true;
                    playBtn.textContent = "Pause";
                    playBtn.classList.add('active');
                }

                simInterval = setInterval(runTick, 50);
            }
        });

        resetBtn.addEventListener('click', () => {
            resetSim();
        });
    }

    function initFreecureSimulator(reversedState) {
        if (freecureSimInterval) {
            clearInterval(freecureSimInterval);
            freecureSimInterval = null;
        }

        const playBtn = document.getElementById('btn-freecure-play');
        const resetBtn = document.getElementById('btn-freecure-reset');
        if (!playBtn || !resetBtn) return;

        const profiles = getFreecureProfiles(reversedState);
        let activePlay = false;

        let elapsedMs = 0;
        let stats = {
            rowA: { heal: 0, dps: 0, mp: 0, oom: false },
            rowB: { heal: 0, dps: 0, mp: 0, oom: false }
        };
        let appliedStats = {
            rowA: Array(profiles.rowA.length).fill(false),
            rowB: Array(profiles.rowB.length).fill(false)
        };
        let appliedMp = {
            rowA: Array(profiles.rowA.length).fill(false),
            rowB: Array(profiles.rowB.length).fill(false)
        };

        const UI = {
            fillA: document.getElementById('freecure-castbar-fill-a'),
            fillB: document.getElementById('freecure-castbar-fill-b'),
            timerA: document.getElementById('freecure-castbar-timer-a'),
            timerB: document.getElementById('freecure-castbar-timer-b'),
            labelA: document.getElementById('freecure-castbar-label-a'),
            labelB: document.getElementById('freecure-castbar-label-b'),
            healA: document.getElementById('metric-freecure-heal-a'),
            healB: document.getElementById('metric-freecure-heal-b'),
            dpsA: document.getElementById('metric-freecure-dps-a'),
            dpsB: document.getElementById('metric-freecure-dps-b'),
            mpA: document.getElementById('metric-freecure-mp-a'),
            mpB: document.getElementById('metric-freecure-mp-b'),
        };

        function resetSim() {
            activePlay = false;
            if (freecureSimInterval) {
                clearInterval(freecureSimInterval);
                freecureSimInterval = null;
            }
            elapsedMs = 0;
            stats = {
                rowA: { heal: 0, dps: 0, mp: 0, oom: false },
                rowB: { heal: 0, dps: 0, mp: 0, oom: false }
            };
            appliedStats = {
                rowA: Array(profiles.rowA.length).fill(false),
                rowB: Array(profiles.rowB.length).fill(false)
            };
            appliedMp = {
                rowA: Array(profiles.rowA.length).fill(false),
                rowB: Array(profiles.rowB.length).fill(false)
            };

            playBtn.textContent = "Run Simulation";
            playBtn.classList.remove('active');

            if (UI.fillA) { UI.fillA.style.width = '0%'; UI.fillA.className = 'sim-castbar-fill'; }
            if (UI.fillB) { UI.fillB.style.width = '0%'; UI.fillB.className = 'sim-castbar-fill'; }
            if (UI.timerA) UI.timerA.textContent = '0.0s';
            if (UI.timerB) UI.timerB.textContent = '0.0s';
            if (UI.labelA) UI.labelA.textContent = 'Idle';
            if (UI.labelB) UI.labelB.textContent = 'Idle';

            const procBadgeNormal = document.getElementById('freecure-proc-badge');
            const procBadgeBizarro = document.getElementById('freecure-proc-badge-b');
            if (procBadgeNormal) procBadgeNormal.style.display = 'none';
            if (procBadgeBizarro) procBadgeBizarro.style.display = 'none';

            for (let lane of ['a', 'b']) {
                for (let i = 1; i <= 8; i++) {
                    const slot = document.getElementById(`slot-freecure-${lane}-${i}`);
                    const progress = document.getElementById(`slot-progress-freecure-${lane}-${i}`);
                    if (slot) {
                        slot.className = 'sim-slot';
                        if (i === 8 && lane === (reversedState ? 'b' : 'a')) {
                            slot.classList.add('freecure-free-glow');
                        }
                    }
                    if (progress) progress.style.width = '0%';
                }
            }

            if (UI.healA) UI.healA.textContent = '0';
            if (UI.healB) UI.healB.textContent = '0';
            if (UI.dpsA) UI.dpsA.textContent = '0';
            if (UI.dpsB) UI.dpsB.textContent = '0';
            if (UI.mpA) UI.mpA.textContent = reversedState ? '0 / 3000' : '0';
            if (UI.mpB) UI.mpB.textContent = reversedState ? '0 / 3000' : '0';
        }

        resetSim();

        window.resetFreecureSim = resetSim;
        window.stopFreecureSim = () => {
            activePlay = false;
            if (freecureSimInterval) {
                clearInterval(freecureSimInterval);
                freecureSimInterval = null;
            }
        };

        function runTick() {
            elapsedMs += 50;
            if (elapsedMs > FREECURE_SIM_MAX_TIME_MS) {
                clearInterval(freecureSimInterval);
                freecureSimInterval = null;
                activePlay = false;
                playBtn.textContent = "Run Simulation";
                playBtn.classList.remove('active');

                if (UI.labelA && !stats.rowA.oom) UI.labelA.textContent = 'Complete';
                if (UI.labelB && !stats.rowB.oom) UI.labelB.textContent = 'Complete';
                return;
            }

            updateLane('rowA', 'a', profiles.rowA);
            updateLane('rowB', 'b', profiles.rowB);
        }

        function updateLane(rowKey, laneId, rowProfile) {
            const laneStats = stats[rowKey];
            if (laneStats.oom) return;

            let stepIndex = -1;
            for (let i = 0; i < rowProfile.length; i++) {
                if (elapsedMs >= rowProfile[i].startMs && elapsedMs < rowProfile[i].endMs) {
                    stepIndex = i;
                    break;
                }
            }

            for (let i = 0; i < rowProfile.length; i++) {
                const step = rowProfile[i];

                if (elapsedMs >= step.startMs && !appliedMp[rowKey][i]) {
                    if (step.isOOM) {
                        laneStats.oom = true;
                        appliedMp[rowKey][i] = true;

                        const slot = document.getElementById(`slot-freecure-${laneId}-${i+1}`);
                        if (slot) slot.className = 'sim-slot stuck-oom';

                        const fill = UI[`fill${laneId.toUpperCase()}`];
                        const label = UI[`label${laneId.toUpperCase()}`];
                        const timer = UI[`timer${laneId.toUpperCase()}`];
                        if (fill) { fill.style.width = '100%'; fill.className = 'sim-castbar-fill oom-error'; }
                        if (label) { label.innerHTML = '<span class="oom-warning">❌ OUT OF MANA!</span>'; }
                        if (timer) timer.textContent = 'INTERRUPTED';

                        continue;
                    }

                    laneStats.mp += step.mpCost;
                    appliedMp[rowKey][i] = true;

                    const mpEl = UI[`mp${laneId.toUpperCase()}`];
                    if (mpEl) {
                        mpEl.textContent = reversedState ? `${laneStats.mp} / 3000` : `${laneStats.mp}`;
                        if (reversedState && laneStats.mp >= 3000) {
                            mpEl.className = 'metric-val oom-warning';
                        }
                    }
                }

                if (elapsedMs >= step.startMs + step.castDurationMs && !appliedStats[rowKey][i] && !laneStats.oom) {
                    laneStats.heal += step.healPotency;
                    laneStats.dps += step.damagePotency;
                    appliedStats[rowKey][i] = true;

                    const healEl = UI[`heal${laneId.toUpperCase()}`];
                    const dpsEl = UI[`dps${laneId.toUpperCase()}`];
                    if (healEl) healEl.textContent = `${laneStats.heal}`;
                    if (dpsEl) dpsEl.textContent = `${laneStats.dps}`;

                    if (step.triggerProc) {
                        const procBadge = document.getElementById(reversedState ? 'freecure-proc-badge-b' : 'freecure-proc-badge');
                        if (procBadge) procBadge.style.display = 'block';
                    }
                }
            }

            if (laneStats.oom) return;

            if (stepIndex !== -1) {
                const step = rowProfile[stepIndex];
                const timeWithinStep = elapsedMs - step.startMs;
                const isCasting = timeWithinStep <= step.castDurationMs;

                const fill = UI[`fill${laneId.toUpperCase()}`];
                const label = UI[`label${laneId.toUpperCase()}`];
                const timer = UI[`timer${laneId.toUpperCase()}`];

                const activeSlot = document.getElementById(`slot-freecure-${laneId}-${stepIndex+1}`);
                const activeSlotProgress = document.getElementById(`slot-progress-freecure-${laneId}-${stepIndex+1}`);

                for (let prevIdx = 0; prevIdx < stepIndex; prevIdx++) {
                    const prevSlot = document.getElementById(`slot-freecure-${laneId}-${prevIdx+1}`);
                    const prevProg = document.getElementById(`slot-progress-freecure-${laneId}-${prevIdx+1}`);
                    if (prevSlot) {
                        prevSlot.className = 'sim-slot completed';
                        if (prevIdx === 7 && laneId === (reversedState ? 'b' : 'a')) {
                            prevSlot.classList.add('freecure-free-glow');
                        }
                    }
                    if (prevProg) prevProg.style.width = '100%';
                }

                if (isCasting) {
                    const frac = timeWithinStep / step.castDurationMs;
                    if (fill) {
                        fill.style.width = `${frac * 100}%`;
                        fill.className = 'sim-castbar-fill casting';
                    }
                    if (label) label.textContent = `Casting ${step.spellName}...`;
                    if (timer) timer.textContent = `${(timeWithinStep / 1000).toFixed(1)}s / ${(step.castDurationMs / 1000).toFixed(1)}s`;

                    if (activeSlot) {
                        activeSlot.className = 'sim-slot active casting';
                        if (stepIndex === 7 && laneId === (reversedState ? 'b' : 'a')) {
                            activeSlot.classList.add('freecure-free-glow');
                        }
                    }
                    if (activeSlotProgress) activeSlotProgress.style.width = `${frac * 100}%`;
                } else {
                    const recastDur = step.endMs - step.startMs - step.castDurationMs;
                    const recastElapsed = timeWithinStep - step.castDurationMs;

                    if (fill) {
                        fill.style.width = '0%';
                        fill.className = 'sim-castbar-fill recasting';
                    }
                    if (label) label.textContent = 'GCD Recast Lock...';
                    if (timer) timer.textContent = `${((recastDur - recastElapsed) / 1000).toFixed(1)}s`;

                    if (activeSlot) {
                        activeSlot.className = 'sim-slot completed';
                        if (stepIndex === 7 && laneId === (reversedState ? 'b' : 'a')) {
                            activeSlot.classList.add('freecure-free-glow');
                        }
                    }
                    if (activeSlotProgress) activeSlotProgress.style.width = '100%';
                }
            }
        }

        playBtn.addEventListener('click', () => {
            if (activePlay) {
                clearInterval(freecureSimInterval);
                freecureSimInterval = null;
                activePlay = false;
                playBtn.textContent = "Resume Simulation";
                playBtn.classList.remove('active');
            } else {
                activePlay = true;
                playBtn.textContent = "Pause";
                playBtn.classList.add('active');

                if (elapsedMs >= FREECURE_SIM_MAX_TIME_MS || stats.rowA.oom || stats.rowB.oom) {
                    resetSim();
                    activePlay = true;
                    playBtn.textContent = "Pause";
                    playBtn.classList.add('active');
                }

                freecureSimInterval = setInterval(runTick, 50);
            }
        });

        resetBtn.addEventListener('click', () => {
            resetSim();
        });
    }

    function initMpSimulator(reversedState) {
        if (mpSimInterval) {
            clearInterval(mpSimInterval);
            mpSimInterval = null;
        }

        const playBtn = document.getElementById('btn-mp-play');
        const resetBtn = document.getElementById('btn-mp-reset');
        if (!playBtn || !resetBtn) return;

        const profiles = getMpProfiles(reversedState);
        let activePlay = false;

        let elapsedMs = 0;
        let startingMp = reversedState ? 10000 : 7000;
        let stats = {
            rowA: { mp: startingMp, maxMp: 10000, oom: false, nextTickMs: 3000 },
            rowB: { mp: startingMp, maxMp: 10000, oom: false, nextTickMs: 3000 }
        };
        let appliedMp = {
            rowA: [false, false, false, false, false],
            rowB: [false, false, false, false, false]
        };

        const UI = {
            mpFillA: document.getElementById('mp-bar-fill-a'),
            mpFillB: document.getElementById('mp-bar-fill-b'),
            mpLabelA: document.getElementById('mp-val-label-a'),
            mpLabelB: document.getElementById('mp-val-label-b'),
            fillA: document.getElementById('mp-castbar-fill-a'),
            fillB: document.getElementById('mp-castbar-fill-b'),
            timerA: document.getElementById('mp-castbar-timer-a'),
            timerB: document.getElementById('mp-castbar-timer-b'),
            labelA: document.getElementById('mp-castbar-label-a'),
            labelB: document.getElementById('mp-castbar-label-b'),
            lucidA: document.getElementById('lucid-badge-a'),
            lucidB: document.getElementById('lucid-badge-b'),
        };

        function resetSim() {
            activePlay = false;
            if (mpSimInterval) {
                clearInterval(mpSimInterval);
                mpSimInterval = null;
            }
            elapsedMs = 0;
            stats = {
                rowA: { mp: startingMp, maxMp: 10000, oom: false, nextTickMs: 3000 },
                rowB: { mp: startingMp, maxMp: 10000, oom: false, nextTickMs: 3000 }
            };
            appliedMp = {
                rowA: [false, false, false, false, false],
                rowB: [false, false, false, false, false]
            };

            playBtn.textContent = "Run Simulation";
            playBtn.classList.remove('active');

            if (UI.fillA) { UI.fillA.style.width = '0%'; UI.fillA.className = 'sim-castbar-fill'; }
            if (UI.fillB) { UI.fillB.style.width = '0%'; UI.fillB.className = 'sim-castbar-fill'; }
            if (UI.timerA) UI.timerA.textContent = '0.0s';
            if (UI.timerB) UI.timerB.textContent = '0.0s';
            if (UI.labelA) UI.labelA.textContent = 'Idle';
            if (UI.labelB) UI.labelB.textContent = 'Idle';

            updateMpBarDisplay('a', startingMp);
            updateMpBarDisplay('b', startingMp);

            for (let lane of ['a', 'b']) {
                for (let i = 1; i <= 5; i++) {
                    const slot = document.getElementById(`slot-mp-${lane}-${i}`);
                    const progress = document.getElementById(`slot-progress-mp-${lane}-${i}`);
                    if (slot) slot.className = 'sim-slot';
                    if (progress) progress.style.width = '0%';
                }
            }

            if (UI.lucidA) UI.lucidA.style.display = 'inline-block';
            if (UI.lucidB) UI.lucidB.style.display = 'none';
        }

        function updateMpBarDisplay(laneId, mpValue) {
            const label = UI[`mpLabel${laneId.toUpperCase()}`];
            const fill = UI[`mpFill${laneId.toUpperCase()}`];
            if (label) {
                label.textContent = `${mpValue.toLocaleString()} / 10,000 MP`;
            }
            if (fill) {
                const pct = (mpValue / 10000) * 100;
                fill.style.width = `${pct}%`;
                
                fill.className = 'mp-bar-fill';
                if (mpValue > 5000) {
                    fill.classList.add('mp-healthy');
                } else if (mpValue > 2000) {
                    fill.classList.add('mp-caution');
                } else {
                    fill.classList.add('mp-danger');
                }
            }
        }

        resetSim();

        window.resetMpSim = resetSim;
        window.stopMpSim = () => {
            activePlay = false;
            if (mpSimInterval) {
                clearInterval(mpSimInterval);
                mpSimInterval = null;
            }
        };

        function runTick() {
            elapsedMs += 50;
            if (elapsedMs > MP_SIM_MAX_TIME_MS) {
                clearInterval(mpSimInterval);
                mpSimInterval = null;
                activePlay = false;
                playBtn.textContent = "Run Simulation";
                playBtn.classList.remove('active');

                if (UI.labelA && !stats.rowA.oom) UI.labelA.textContent = 'Complete';
                if (UI.labelB && !stats.rowB.oom) UI.labelB.textContent = 'Complete';
                return;
            }

            applyMpTicks();

            updateLane('rowA', 'a', profiles.rowA);
            updateLane('rowB', 'b', profiles.rowB);
        }

        function applyMpTicks() {
            for (let rowKey of ['rowA', 'rowB']) {
                const laneStats = stats[rowKey];
                if (laneStats.oom) continue;

                if (elapsedMs >= laneStats.nextTickMs) {
                    laneStats.nextTickMs += 3000;
                    
                    const tickAmt = (rowKey === 'rowA') ? 750 : 200;
                    laneStats.mp = Math.min(laneStats.maxMp, laneStats.mp + tickAmt);

                    const laneId = (rowKey === 'rowA') ? 'a' : 'b';
                    updateMpBarDisplay(laneId, laneStats.mp);
                    
                    const mpFillEl = UI[`mpFill${laneId.toUpperCase()}`];
                    if (mpFillEl) {
                        mpFillEl.classList.add('mp-regen-flash');
                        setTimeout(() => {
                            if (mpFillEl) mpFillEl.classList.remove('mp-regen-flash');
                        }, 300);
                    }
                }
            }
        }

        function updateLane(rowKey, laneId, rowProfile) {
            const laneStats = stats[rowKey];
            if (laneStats.oom) return;

            let stepIndex = -1;
            for (let i = 0; i < rowProfile.length; i++) {
                if (elapsedMs >= rowProfile[i].startMs && elapsedMs < rowProfile[i].endMs) {
                    stepIndex = i;
                    break;
                }
            }

            for (let i = 0; i < rowProfile.length; i++) {
                const step = rowProfile[i];

                if (elapsedMs >= step.startMs && !appliedMp[rowKey][i]) {
                    if (step.isOOM || laneStats.mp < step.mpCost) {
                        laneStats.oom = true;
                        appliedMp[rowKey][i] = true;

                        const slot = document.getElementById(`slot-mp-${laneId}-${i+1}`);
                        if (slot) slot.className = 'sim-slot stuck-oom';

                        const fill = UI[`fill${laneId.toUpperCase()}`];
                        const label = UI[`label${laneId.toUpperCase()}`];
                        const timer = UI[`timer${laneId.toUpperCase()}`];
                        if (fill) { fill.style.width = '100%'; fill.className = 'sim-castbar-fill oom-error'; }
                        if (label) { label.innerHTML = '<span class="oom-warning">❌ OUT OF MANA!</span>'; }
                        if (timer) timer.textContent = 'INTERRUPTED';

                        laneStats.mp = 0;
                        updateMpBarDisplay(laneId, 0);
                        continue;
                    }

                    laneStats.mp -= step.mpCost;
                    appliedMp[rowKey][i] = true;
                    updateMpBarDisplay(laneId, laneStats.mp);
                }
            }

            if (laneStats.oom) return;

            if (stepIndex !== -1) {
                const step = rowProfile[stepIndex];
                const timeWithinStep = elapsedMs - step.startMs;
                const isCasting = timeWithinStep <= step.castDurationMs;

                const fill = UI[`fill${laneId.toUpperCase()}`];
                const label = UI[`label${laneId.toUpperCase()}`];
                const timer = UI[`timer${laneId.toUpperCase()}`];

                const activeSlot = document.getElementById(`slot-mp-${laneId}-${stepIndex+1}`);
                const activeSlotProgress = document.getElementById(`slot-progress-mp-${laneId}-${stepIndex+1}`);

                for (let prevIdx = 0; prevIdx < stepIndex; prevIdx++) {
                    const prevSlot = document.getElementById(`slot-mp-${laneId}-${prevIdx+1}`);
                    const prevProg = document.getElementById(`slot-progress-mp-${laneId}-${prevIdx+1}`);
                    if (prevSlot) prevSlot.className = 'sim-slot completed';
                    if (prevProg) prevProg.style.width = '100%';
                }

                if (isCasting) {
                    const frac = timeWithinStep / step.castDurationMs;
                    if (fill) {
                        fill.style.width = `${frac * 100}%`;
                        fill.className = 'sim-castbar-fill casting';
                    }
                    if (label) label.textContent = `Casting ${step.spellName}...`;
                    if (timer) timer.textContent = `${(timeWithinStep / 1000).toFixed(1)}s / ${(step.castDurationMs / 1000).toFixed(1)}s`;

                    if (activeSlot) activeSlot.className = 'sim-slot active casting';
                    if (activeSlotProgress) activeSlotProgress.style.width = `${frac * 100}%`;
                } else {
                    const recastDur = step.endMs - step.startMs - step.castDurationMs;
                    const recastElapsed = timeWithinStep - step.castDurationMs;

                    if (fill) {
                        fill.style.width = '0%';
                        fill.className = 'sim-castbar-fill recasting';
                    }
                    if (label) label.textContent = 'GCD Recast Lock...';
                    if (timer) timer.textContent = `${((recastDur - recastElapsed) / 1000).toFixed(1)}s`;

                    if (activeSlot) {
                        activeSlot.className = 'sim-slot completed';
                        if (activeSlotProgress) activeSlotProgress.style.width = '100%';
                    }
                }
            }
        }

        playBtn.addEventListener('click', () => {
            if (activePlay) {
                clearInterval(mpSimInterval);
                mpSimInterval = null;
                activePlay = false;
                playBtn.textContent = "Resume Simulation";
                playBtn.classList.remove('active');
            } else {
                activePlay = true;
                playBtn.textContent = "Pause";
                playBtn.classList.add('active');

                if (elapsedMs >= MP_SIM_MAX_TIME_MS || stats.rowA.oom || stats.rowB.oom) {
                    resetSim();
                    activePlay = true;
                    playBtn.textContent = "Pause";
                    playBtn.classList.add('active');
                }

                mpSimInterval = setInterval(runTick, 50);
            }
        });

        resetBtn.addEventListener('click', () => {
            resetSim();
        });
    }

    // Default Load (Normal Mode)
    swapContent(false);

    // Initial Trigger for Tab Click
    if (elements.firstTabButton) {
        elements.firstTabButton.click();
    }

    // Bind tab functions to window for onclick hooks in HTML
    window.openTab = openTab;
});

// Accurate Page Load Timer Calculation on Window Load
window.addEventListener('load', () => {
    // Wait a tick to ensure performance metrics are fully recorded by the browser
    setTimeout(() => {
        const timing = performance.getEntriesByType("navigation")[0];
        if (timing) {
            const loadTime = timing.loadEventEnd - timing.startTime;
            const loadTimeSpan = document.getElementById('load-time');
            if (loadTimeSpan && loadTime > 0) {
                loadTimeSpan.textContent = loadTime.toFixed(2);
            } else if (loadTimeSpan) {
                // Fallback for edge cases where timing is 0 or negative
                const fallbackTime = performance.now();
                loadTimeSpan.textContent = fallbackTime.toFixed(2);
            }
        } else {
            // Fallback for browsers that don't support Navigation Timing Level 2
            const fallbackTime = performance.now();
            const loadTimeSpan = document.getElementById('load-time');
            if (loadTimeSpan) {
                loadTimeSpan.textContent = fallbackTime.toFixed(2);
            }
        }
    }, 0);
});

// Tab Navigation Logic
function openTab(tabName, element) {
    // Stop any active simulations to prevent background interval leakage
    if (window.stopActiveSimulation) {
        window.stopActiveSimulation();
    }

    document.querySelectorAll(".tabcontent").forEach(tab => {
        tab.style.display = "none";
    });
    document.querySelectorAll(".tablinks").forEach(link => {
        link.classList.remove("active");
    });
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = "block";
    }
    
    if (element) {
        element.classList.add("active");
    }
    
    if (window.event) {
        window.event.preventDefault();
    }
}
