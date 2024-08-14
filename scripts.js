document.addEventListener('DOMContentLoaded', () => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let isReversed = false;
    const audio = new Audio('ff7cure.mp3');

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

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                toggleEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function toggleEasterEgg() {
        isReversed = !isReversed;
        document.body.classList.toggle('reverse-mode');
        swapContent(isReversed);
        audio.play();
    }
    function swapContent(isReversed) {
        addTopBitContent(isReversed);
        if (isReversed) {
            updateContent('Cure_II', 'Cure', 'Freecure = Lifesaver', 'Why Freecure is a Lifesaver', 'Cure', true);
        } else {
            updateContent('Cure', 'Cure_II', 'Why Freecure is a Trap', 'Why Freecure is a Trap', 'Cure_II', false);
        }
    }

    function updateContent(firstCure, secondCure, freecureTabText, freecureTitle, freecureFirstCure, reversed) {
        const firstCureText = firstCure === 'Cure_II' ? 'Cure II' : 'Cure I';
        const secondCureText = secondCure === 'Cure_II' ? 'Cure II' : 'Cure I';
    
        elements.headerText.innerHTML = `
            <img src="48px-${firstCure}_Icon.png" alt="${firstCureText} Icon">
            STOP USING <span class="cure1-header">${firstCureText}</span>, USE <span class="cure2">${secondCureText}</span>
            <img src="48px-${secondCure}_Icon.png" alt="${secondCureText} Icon">
        `;
    
        elements.tldrText.innerHTML = `
            ${reversed ? ` 
            <h2>TL;DR</h2>
            <p>Once you unlock <span class="cure2">${secondCureText}</span> at level 2, you should always use it instead of <span class="cure1">${firstCureText}</span>.</p>
            <p><span class="cure2">${secondCureText}</span> heals for a huge 450 potency and is the better choice in almost every situation.</p>
            <p><b>Use <span class="cure2">${secondCureText}</span>. Don’t use <span class="cure1">${firstCureText}</span> to save MP try for Freecure procs.</b></p>
            ` : `
            <h2>TL;DR</h2>
            <p>Once you unlock <span class="cure2">${secondCureText}</span> at level 30, you should always use it instead of <span class="cure1">${firstCureText}</span>.</p>
            <p><span class="cure2">${secondCureText}</span> heals for 700 potency and is the better choice in almost every situation.</p>
            <p><b>Use <span class="cure2">${secondCureText}</span>. Don’t use <span class="cure1">${firstCureText}</span> just to save MP or try for Freecure procs.</b></p>
            `}
            `;
    
        document.querySelector('button[onclick*="openTab(\'freecure\'"]').textContent = freecureTabText;
        elements.freecureText.innerHTML = `
            <h2>${freecureTitle}</h2>
            ${reversed ? `
            <p><span class="cure1">Cure 1</span> has a 15% chance to trigger the <strong>Freecure</strong> effect, making your next <span class="cure2">Cure 2</span> free. This is a great way to conserve MP and maximize your healing output:</p>
            <h3>Example Scenario: The Freecure Advantage</h3>
            <p><strong>MP Efficiency:</strong> The chance of triggering Freecure is only 15%, but when it procs, it can save significant MP over the course of a fight, allowing you to continue healing effectively without running out of MP.</p>
            <h3>Potency and MP Management:</h3>
            <ul>
                <li><strong>7x <span class="cure1">Cure 1</span> + 1x <span class="cure2">Cure 2</span> (Free):</strong>
                    <ul>
                        <li>Healing potency: 7x450 (Cure 1) + 700 (Cure 2) = 3850 potency</li>
                        <li>Global Cooldowns (GCD): 8 GCDs</li>
                        <li>MP cost: 7x400 = 2800 MP</li>
                    </ul>
                </li>
                <li><strong>Using <span class="cure2">Cure 2</span> only to achieve the same potency:</strong>
                    <ul>
                        <li>Healing potency: 5x700 = 3500 potency</li>
                        <li>Global Cooldowns (GCD): 5 GCDs</li>
                        <li>MP cost: 5x1000 = 5000 MP</li>
                    </ul>
                </li>
            </ul>
            <p>This comparison shows that using <span class="cure1">Cure 1</span> strategically with Freecure procs can achieve the same amount of healing while conserving MP. This is crucial in fights where MP efficiency is important.</p>
            ` : `
            <p><span class="cure1">Cure 1</span> has a 15% chance to trigger the <strong>Freecure</strong> effect, making your next <span class="cure2">Cure 2</span> free. While this might seem like a great way to conserve MP, it’s actually a trap for several reasons:</p>
            <h3>Example Scenario: The Freecure Trap</h3>
            <p><strong>Inconsistent Procs:</strong> The chance of triggering Freecure is only 15%. Statistically, this means you can expect a Freecure proc roughly once every 6-7 casts of <span class="cure1">Cure 1</span>. Over 7 casts of <span class="cure1">Cure 1</span> (at 2.5 seconds per cast), you'll spend 17.5 seconds healing for 2800 potency, and you might get 1 free <span class="cure2">Cure 2</span> cast.</p>
            <h3>Potency and Damage Output Comparison:</h3>
            <ul>
                <li><strong>7x <span class="cure1">Cure 1</span> + 1x <span class="cure2">Cure 2</span> (Free):</strong>
                    <ul>
                        <li>Healing potency: 7x450 (Cure 1) + 700 (Cure 2) = 3850 potency</li>
                        <li>Global Cooldowns (GCD): 8 GCDs</li>
                        <li>MP cost: 7x400 = 2800 MP</li>
                    </ul>
                </li>
                <li><strong>Using <span class="cure2">Cure 2</span> only to achieve the same potency:</strong>
                    <ul>
                        <li>Healing potency: 5x700 = 3500 potency</li>
                        <li>Global Cooldowns (GCD): 5 GCDs</li>
                        <li>MP cost: 5x1000 = 5000 MP</li>
                    </ul>
                </li>
            </ul>
            <p>This comparison shows that using <span class="cure2">Cure 2</span> costs more MP but achieves the same amount of healing in 37.5% less time. In critical situations where healing efficiency matters, time and GCD efficiency are much more crucial than MP efficiency.</p>
            <h3>Impact on Damage Output:</h3>
            <p>Every time you cast <span class="cure1">Cure 1</span> hoping for a Freecure proc, you’re spending more GCDs on weaker heals instead of using those GCDs to contribute to your party's damage output. The time you save by using <span class="cure2">Cure 2</span> directly translates to more opportunities to cast damage-dealing spells like <span class="damage-spell">Glare</span> or <span class="damage-spell">Dia</span>.</p>
            <p>In most situations, the guaranteed healing output and time savings of <span class="cure2">Cure 2</span> far outweigh the potential MP savings from Freecure. By focusing on <span class="cure2">Cure 2</span> and using <img src="48px-Lucid_Dreaming_Icon.png" alt="Lucid Dreaming Icon"> Lucid Dreaming effectively, you’ll not only provide stronger and more reliable healing for your party but also maximize your contribution to overall damage output.</p>
            `}
            <p><a href="#tabbed-content"><u>To Top</u></a></p>
        `;

        elements.simpleText.innerHTML = `
            <h2>Simple Explanation</h2>
            ${reversed ? `
            <p><span class="cure1">Cure 1</span> is more MP efficient and allows for Freecure procs compared to <span class="cure2">Cure 2</span>.</p>
            <ul>
                <li><span class="cure1">Cure 1</span> heals for 450 potency per cast.</li>
                <li><span class="cure2">Cure 2</span> heals for 700 potency per cast but costs more MP.</li>
                <li>Because <span class="cure1">Cure 1</span> is more efficient, you spend less MP on healing and can save MP for other abilities.</li>
            </ul>
            <p>Using <span class="cure1">Cure 1</span> allows you to manage your MP better, giving you more opportunities to contribute to sustained healing throughout long fights.</p>
            ` : `
            <p><span class="cure2">Cure 2</span> heals more per cast compared to <span class="cure1">Cure 1</span>, which means you can restore health with fewer casts.</p>
            <ul>
                <li><span class="cure1">Cure 1</span> heals for 450 potency per cast.</li>
                <li><span class="cure2">Cure 2</span> heals for 700 potency per cast.</li>
                <li>Because <span class="cure2">Cure 2</span> heals more per cast, you spend less time healing and more time dealing damage.</li>
            </ul>
            <p>Using <span class="cure2">Cure 2</span> allows you to heal your party members quicker, giving you more opportunities to contribute to damage output.</p>
            `}
            <p><a href="#tabbed-content"><u>To Top</u></a></p>
        `;

        elements.detailedText.innerHTML = `
            <h2>In-Depth Explanation with Potency Over Time</h2>
            ${reversed ? `
            <p>Let's break down the math to understand why <span class="cure1">Cure 1</span> can be more efficient in certain situations compared to <span class="cure2">Cure 2</span>:</p>
            <h3>Example Scenario: Healing a Tank During Dungeon Pulls</h3>
            <p>When tanking in a dungeon, a common scenario is the tank pulling multiple groups of enemies. During these pulls, the tank takes steady damage and needs to be kept alive while also dealing damage:</p>
            <ul>
                <li><span class="cure1">Cure 1</span>: Heals for 450 potency per cast and costs 450 MP.</li>
                <li><span class="cure2">Cure 2</span>: Heals for 700 potency per cast but costs 1000 MP.</li>
            </ul>
            <p>If the tank takes 1200 potency worth of damage:</p>
            <ul>
                <li>Using <span class="cure1">Cure 1</span>:
                    <ul>
                        <li>3 casts of <span class="cure1">Cure 1</span> provide 1200 potency of healing.</li>
                        <li>MP Cost: 3 x 450 MP = 1350 MP</li>
                        <li>Time Spent: 3 casts x 2.5s per cast = 7.5 seconds</li>
                    </ul>
                </li>
                <li>Using <span class="cure2">Cure 2</span>:
                    <ul>
                        <li>2 casts of <span class="cure2">Cure 2</span> provide 1400 potency of healing, which is more than needed but costs significantly more MP.</li>
                        <li>MP Cost: 2 x 1000 MP = 2000 MP</li>
                        <li>Time Spent: 2 casts x 2.5s per cast = 5 seconds</li>
                    </ul>
                </li>
            </ul>
            <p>While <span class="cure2">Cure 2</span> heals more per cast, <span class="cure1">Cure 1</span> allows you to save MP and manage your resources better. This is crucial in longer fights where MP efficiency is important. By using <span class="cure1">Cure 1</span>, you can sustain healing over a longer period without running out of MP.</p>
            <h3>Impact on MP Management and Efficiency</h3>
            <p>MP Efficiency is key in longer encounters. Using <span class="cure1">Cure 1</span> strategically allows for more efficient MP usage:</p>
            <ul>
                <li><span class="cure1">Cure 1</span>: 1200 MP for 1200 potency = 1 potency per MP</li>
                <li><span class="cure2">Cure 2</span>: 2000 MP for 1400 potency = 0.7 potency per MP</li>
            </ul>
            <p>In this example, <span class="cure1">Cure 1</span> is 43% more MP efficient than <span class="cure2">Cure 2</span>, making it a better choice when MP conservation is necessary.</p>
            ` : `
            <p>Let’s break down the potency over a more realistic dungeon scenario to see why <span class="cure2">Cure 2</span> is more effective:</p>
            <h3>Example Scenario: Healing a Tank During Dungeon Pulls</h3>
            <p>When tanking in a dungeon, a common scenario is the tank pulling multiple groups of enemies Wall2Wall. During these pulls, the tank takes steady damage and needs to be kept alive while also dealing damage:</p>
            <ul>
                <li><span class="cure1">Cure 1</span>: Heals for 450 potency per cast. You might need to cast <span class="cure1">Cure 1</span> multiple times to keep the tank's HP stable, spending more GCDs on healing.</li>
                <li><span class="cure2">Cure 2</span>: Heals for 700 potency per cast. With fewer casts needed to stabilize the tank's HP, you have more time to cast offensive spells.</li>
            </ul>
            <p>For example, if the tank takes damage that requires 1200 potency of healing to stabilize:</p>
            <ul>
                <li><span class="cure1">Cure 1</span>: Requires three casts (7.5 seconds) to provide 1350 potency of healing.</li>
                <li><span class="cure2">Cure 2</span>: Requires only two casts (5 seconds) to provide 1400 potency of healing, allowing you to switch back to dealing damage sooner.</li>
            </ul>
            <p>By using <span class="cure2">Cure 2</span>, you can reduce the time spent healing and increase your uptime on damage-dealing abilities, which is crucial in optimizing dungeon runs.</p>
            <h3>Example Scenario: Tanking a Dungeon Boss</h3>
            <p>In a dungeon boss fight, maintaining both tank and party member HP while also contributing to damage is essential:</p>
            <ul>
                <li><span class="cure1">Cure 1</span>: Heals for 450 potency per cast. To keep the tank's HP stable, you might need to cast <span class="cure1">Cure 1</span> repeatedly, reducing your opportunity to deal damage.</li>
                <li><span class="cure2">Cure 2</span>: Heals for 700 potency per cast. Fewer casts are needed to stabilize the tank, allowing you to use the extra GCDs for damage spells like <span class="damage-spell">Glare</span>.</li>
            </ul>
            <p>In a boss fight where every bit of damage counts, <span class="cure2">Cure 2</span> provides more efficient healing, enabling you to contribute more to the fight's overall DPS.</p>
            `}
            <p><a href="#tabbed-content"><u>To Top</u></a></p>
        `;

        elements.mpManagementText.innerHTML = `
            <h2>But What About MP?</h2>
            ${reversed ? `
            <p>One concern might be the lower MP cost of <span class="cure1">Cure 1</span> (400 MP compared to <span class="cure2">Cure 2</span>'s 1000 MP). This makes <span class="cure1">Cure 1</span> a better option for conserving MP in longer fights.</p>
            <ul>
                <li><strong>Freecure:</strong> Using <span class="cure1">Cure 1</span> strategically allows you to trigger Freecure procs, which make the next <span class="cure2">Cure 2</span> free, effectively managing your MP.</li>
                <li>By leveraging Freecure procs, you can conserve your MP for other critical abilities and ensure you have enough MP for the entire fight.</li>
            </ul>
            ` : `
            <p>One concern might be the higher MP cost of <span class="cure2">Cure 2</span> (1000 MP compared to <span class="cure1">Cure 1</span>'s 400 MP). However, White Mages have access to <img src="48px-Lucid_Dreaming_Icon.png" alt="Lucid Dreaming Icon"> <strong>Lucid Dreaming</strong>, an ability that regenerates MP over time.</p>
            <ul>
                <li><strong>Lucid Dreaming:</strong> Unlocked at level 14, this ability restores a significant amount of MP over 21 seconds, allowing you to sustain your healing output without running out of MP.</li>
                <li>By using Lucid Dreaming effectively, you should <strong>never run out of MP</strong>. As a rule of thumb, <b>pop Lucid Dreaming around 7000mp</b> for best practice MP management.</li>
                <li>This makes the higher MP cost of <span class="cure2">Cure 2</span> a non-issue.</li>
            </ul>
            `}
            <p><a href="#tabbed-content"><u>To Top</u></a></p>
        `;

        elements.castRecastText.innerHTML = `
            <h2>Understanding Cast Time vs. Recast Time</h2>
            ${reversed ? `
            <p>Even though <span class="cure1">Cure 1</span> has a shorter cast time than <span class="cure2">Cure 2</span>, it’s important to understand the difference between cast time and recast time:</p>
            <ul>
                <li><strong>Cast Time:</strong> This is the time it takes to cast the spell from the moment you start casting until the spell is completed. <span class="cure1">Cure 1</span> has a shorter cast time of 1.5 seconds compared to <span class="cure2">Cure 2</span>, which has a cast time of 2 seconds. This allows you to react faster in critical situations.</li>
                <li><strong>Recast Time (Global Cooldown or GCD):</strong> This is the time before you can use another GCD after casting. Both <span class="cure1">Cure 1</span> and <span class="cure2">Cure 2</span> share the same recast time of 2.5 seconds, which means you cannot cast another GCD until this time has elapsed, regardless of the cast time of the individual spell.</li>
            </ul>
            <p>While <span class="cure2">Cure 2</span> has higher potency, <span class="cure1">Cure 1</span> allows for quicker cast times and the chance for Freecure procs, making it a more versatile and MP-efficient choice in many scenarios.</p>
            ` : `
            <p>Even though <span class="cure1">Cure 1</span> has a shorter cast time than <span class="cure2">Cure 2</span>, it’s important to understand the difference between cast time and recast time:</p>
            <ul>
                <li><strong>Cast Time:</strong> This is the time it takes to cast the spell from the moment you start casting until the spell is completed. <span class="cure1">Cure 1</span> has a shorter cast time of 1.5 seconds compared to <span class="cure2">Cure 2</span>, which has a cast time of 2 seconds. However, this isn't as important as...</li>
                <li><strong>Recast Time (Global Cooldown or GCD):</strong> This is the time before you can use another GCD after casting. Both <span class="cure1">Cure 1</span> and <span class="cure2">Cure 2</span> share the same recast time of 2.5 seconds, which means you cannot cast another GCD until this time has elapsed, regardless of the cast time of the individual spell.</li>
            </ul>
            <p>While <span class="cure1">Cure 1</span> has a faster cast time, the recast time is the same as <span class="cure2">Cure 2</span>. This means that even though <span class="cure1">Cure 1</span> finishes casting quicker, you still have to wait the full 2.5 seconds before casting again. Therefore, the total amount of healing you can output over time is significantly higher with <span class="cure2">Cure 2</span> due to its higher potency, making it the superior choice.</p>
            `}
            <p><a href="#tabbed-content"><u>To Top</u></a></p>
        `;

        elements.ifSomeoneText.innerHTML = `
            <h2>If Someone Sent You This...</h2>
            ${reversed ? `
            <p><b>This is a WHM problem and not a user problem</b>, as it's easy to intuit why, on paper, <span class="cure2">Cure 2</span> seems like the right choice.</p>
            <p>The intent behind this guide isn’t to criticize or belittle anyone’s gameplay. This is a niche, overly detailed guide to be shared amongst the community to help everyone be better. This isn't meant to be taken hyper seriously, as in higher-level content you will have oGCDs and Lillies to compensate for healing and should rarely need to use Cure 1 at all. This is most relevant in late-ARR content where Cure 2 spam can lead to unnecessary MP wastage.</p>
            <p>It’s not toxic or negative to want to help others improve; in fact, it’s a sign of respect and camaraderie. Taking a moment to learn and adjust can make a huge difference not just for you, but for your entire party. May our healers be optimal and our tanks and DPS sustained!</p>
            ` : `
            <p><b>This is a WHM problem and not a user problem</b>, as it's easy to intuit why, on paper, <span class="cure1">Cure 1</span> seems like the right choice.</p>
            <p>The intent behind this guide isn’t to criticize or belittle anyone’s gameplay. This is a niche, overly detailed guide to be shared amongst the community to help everyone be better. This isn't meant to be taken hyper seriously, as in higher-level content you will have oGCDs and Lillies to compensate for healing and should rarely need to use Cure 2 at all. This is most relevant in late-ARR content where Cure 1 spam can lead to rocky Stone Vigils.</p>
            <p>It’s not toxic or negative to want to help others improve; in fact, it’s a sign of respect and camaraderie. Taking a moment to learn and adjust can make a huge difference not just for you, but for your entire party. May our healers be optimal and our tanks and DPS sustained!</p>
            `}
            <p><a href="#tabbed-content"><u>To Top</u></a></p>
        `;

        const timing = performance.getEntriesByType("navigation")[0];
        const loadTime = timing.loadEventEnd - timing.startTime;
        const loadTimeDisplay = document.createElement('p');
        loadTimeDisplay.innerHTML = `
            Page loaded in ${loadTime.toFixed(2)} ms <br>
            Made with 💜 by Twitter/X:<a href="https://twitter.com/MajorPropsYT" target="_blank">@MajorPropsYT</a><br>
        `;
        elements.ifSomeoneText.appendChild(loadTimeDisplay);
    }
    function addTopBitContent(isReversed) {
        const existingTopBit = document.querySelector('#top-bit');
        if (existingTopBit) existingTopBit.remove(); // Remove the existing top bit if present
    
        const topBitContent = document.createElement('div');
        topBitContent.id = 'top-bit';
        
        if (isReversed) {
            topBitContent.innerHTML = `
                <p><a href="#ifsomeone" class="scroll-to-guide" onclick="openTab('ifsomeone', document.querySelector('.tab button:nth-child(6)'))">This information is presented with good intentions.</a></p>
                <p>The information below is completely correct, and <span class="cure1">Cure 1</span> is actually the better option over <span class="cure2">Cure 2</span>.</p>
                <p>FFXIV players might lead you to believe that <span class="cure2">Cure 2</span> is superior, but...</p>
                <p>For the various reasons below, <span class="cure1">Cure 1</span> is always the better choice.</p>
            `;
        } else {
            topBitContent.innerHTML = `
                <p><a href="#ifsomeone" class="scroll-to-guide" onclick="openTab('ifsomeone', document.querySelector('.tab button:nth-child(6)'))">This information is presented with good intentions</a></p>
                <p>The information below is presented as a gathering of information designed to help WHMs on the intricacies of using <span class="cure2">Cure 2</span> over <span class="cure1">Cure 1</span>.</p>
                <p>FFXIV does not currently do a good job showcasing this, and it's easy to understand why a WHM might think <span class="cure1">Cure 1</span> is the right option.</p>
                <p>However, for the various reasons below, <span class="cure2">Cure 2</span> is always better to use than <span class="cure1">Cure 1</span>. This is a WHM problem that hopefully Squenix addresses someday. Until then...</p>
            `;
        }
        
        document.querySelector('main').insertBefore(topBitContent, document.querySelector('main').firstChild);
    }
    loadDefaultContent();
    if (elements.firstTabButton) elements.firstTabButton.click();

    function loadDefaultContent() {
        addTopBitContent(false);
        swapContent(false);
    }

    // Attach the openTab function globally for use in the HTML
    window.openTab = openTab;
});

function openTab(tabName, element) {
    document.querySelectorAll(".tabcontent").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tablinks").forEach(link => link.className = link.className.replace(" active", ""));
    document.getElementById(tabName).style.display = "block";
    if (element) element.className += " active";
    if (event) event.preventDefault();
}
