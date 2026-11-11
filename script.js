/* ==========================================================================
   NITISH KUMAR PORTFOLIO — 3D ROBOT MASCOT + INTERACTIVE SYSTEMS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initSheenTracking();
    initRoleRotator();
    init3DScene();       // 🤖 Full procedural robot mascot
    initMobileNav();
    initScrollSpy();
});

/* ==========================================================================
   1. Custom Fluid Cursor with Spring Physics
   ========================================================================== */
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function renderRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    const interactables = document.querySelectorAll('a, button, input, textarea, select, .sheen');
    interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* ==========================================================================
   2. Dynamic Card Sheen Tracking (Mouse Follow Light)
   ========================================================================== */
function initSheenTracking() {
    const cards = document.querySelectorAll('.sheen');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }, { passive: true });
    });
}

/* ==========================================================================
   3. Dynamic Role Rotator
   ========================================================================== */
function initRoleRotator() {
    const el = document.getElementById('role-rotator');
    if (!el) return;

    const roles = [
        "Parallel Symbolic Execution Engines",   // KLEE thesis + Cerify internship
        "Lock-Free Work-Stealing Runtimes",       // Chase-Lev deque project
        "Parallel Smart Contract Analyzers at Cerify",     // SKLEE internship
        "Out-of-Core TPC-H Query Engines",        // DB55 memory-limited project
        "Distributed Graph Processing Systems",   // MPI BFS/PageRank/Clique project
        "SIMD-Accelerated Video Pipelines",       // ARM NEON + OpenCL project
        "Low-Latency TCP Servers & Load Balancers" // TCP/networking project
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 80;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            el.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            speed = 40;
        } else {
            el.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            speed = 80;
        }
        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }
        setTimeout(type, speed);
    }
    type();
}

/* ==========================================================================
   4. Three.js 3D Droid Mascot — Scroll-Bound Journey + Hover Dodge + Stunts
   ========================================================================== */
function init3DScene() {
    const container = document.getElementById('webgl-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    camera.position.z = 85;
    camera.position.y = 15;

    // Studio Lights — adapted to dark ink palette
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(50, 60, 80);
    scene.add(keyLight);

    const cyanFillLight = new THREE.PointLight(0x818cf8, 2.8, 130);  // Soft indigo fill
    cyanFillLight.position.set(-40, 20, 50);
    scene.add(cyanFillLight);

    const violetRimLight = new THREE.PointLight(0x38bdf8, 2.2, 100);  // Sky blue rim
    violetRimLight.position.set(40, -20, -30);
    scene.add(violetRimLight);

    // ── Materials (recoloured to match the dark-ink aurora theme) ──
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f4ff,   // Bright platinum white — pops against dark background
        roughness: 0.12,
        metalness: 0.8
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,   // Vivid amber gold accents
        roughness: 0.1,
        metalness: 0.95
    });
    const visorMaterial = new THREE.MeshStandardMaterial({
        color: 0x34d399,   // Emerald green visor
        roughness: 0.05,
        metalness: 0.1,
        emissive: 0x34d399,
        emissiveIntensity: 3.2
    });
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xfb7185,   // Warm rose glowing core
        roughness: 0.1,
        metalness: 0.1,
        emissive: 0xfb7185,
        emissiveIntensity: 3.0
    });
    const jointsMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,   // Slate grey joints
        roughness: 0.4,
        metalness: 0.85
    });
    const thrusterMaterial = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,   // Sky blue thrusters
        roughness: 0.1,
        emissive: 0x38bdf8,
        emissiveIntensity: 3.8,
        transparent: true,
        opacity: 0.9
    });

    // ── Robot Assembly ──
    const robot = new THREE.Group();

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.2, 3.4), metalMaterial);
    robot.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 0.6), accentMaterial);
    chestPlate.position.set(0, 0.8, 1.6);
    robot.add(chestPlate);

    const chestCore = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), coreMaterial);
    chestCore.position.set(0, 0.8, 1.95);
    robot.add(chestCore);

    const coreLight = new THREE.PointLight(0xfb7185, 2.2, 20);  // Rose glow
    coreLight.position.set(0, 0.8, 2.5);
    robot.add(coreLight);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 3.8;
    headGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 2.6), metalMaterial));

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.8, 8), jointsMaterial);
    neck.position.y = -1.6;
    headGroup.add(neck);

    const antGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 6);
    const leftAnt = new THREE.Mesh(antGeom, accentMaterial);
    leftAnt.position.set(-1.5, 0.2, 0);
    leftAnt.rotation.z = Math.PI / 4;
    headGroup.add(leftAnt);
    const rightAnt = leftAnt.clone();
    rightAnt.position.x = 1.5;
    rightAnt.rotation.z = -Math.PI / 4;
    headGroup.add(rightAnt);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 0.45), visorMaterial);
    visor.position.set(0, 0.2, 1.2);
    headGroup.add(visor);
    robot.add(headGroup);

    // Arms (helper)
    function makeArm(side) {
        const g = new THREE.Group();
        g.position.set(side * 2.6, 1.6, 0);
        g.add(new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), accentMaterial));
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 2.6, 6), metalMaterial);
        upper.position.y = -1.4; g.add(upper);
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), jointsMaterial);
        elbow.position.y = -2.8; g.add(elbow);
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.38, 2.4, 6), accentMaterial);
        lower.position.y = -4.0; g.add(lower);
        return g;
    }
    const leftArmGroup = makeArm(-1);
    const rightArmGroup = makeArm(1);
    robot.add(leftArmGroup);
    robot.add(rightArmGroup);

    // Legs (helper)
    function makeLeg(side) {
        const g = new THREE.Group();
        g.position.set(side * 1.3, -3.0, 0);
        g.add(new THREE.Mesh(new THREE.SphereGeometry(0.75, 8, 8), jointsMaterial));
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.52, 2.8, 6), metalMaterial);
        thigh.position.y = -1.5; g.add(thigh);
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), jointsMaterial);
        knee.position.y = -3.0; g.add(knee);
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.42, 2.6, 6), accentMaterial);
        shin.position.y = -4.4; g.add(shin);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 1.6), metalMaterial);
        foot.position.set(0, -5.6, 0.4); g.add(foot);
        const thruster = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.12, 8, 16), thrusterMaterial);
        thruster.rotation.x = Math.PI / 2;
        thruster.position.set(0, -6.0, 0.4); g.add(thruster);
        return { group: g, thruster };
    }
    const leftLeg = makeLeg(-1);
    const rightLeg = makeLeg(1);
    robot.add(leftLeg.group);
    robot.add(rightLeg.group);

    robot.scale.set(0.95, 0.95, 0.95);
    scene.add(robot);

    // ── Scroll-Bound Keyframe Journey ──
    const isDesktop = window.innerWidth > 1024;
    const KEYFRAMES = [
        { scroll: 0.0,  pos: { x: isDesktop ? 24 : 0,  y: isDesktop ? 4 : -10, z: 36 }, rot: { x: 0.1, y: -0.4, z: 0 },   scale: 0.95, color: 0x818cf8 },
        { scroll: 0.20, pos: { x: isDesktop ? -26 : 0, y: isDesktop ? -8 : -14, z: 38 }, rot: { x: 0.15, y: 0.5, z: -0.05 }, scale: 1.0,  color: 0x38bdf8 },
        { scroll: 0.45, pos: { x: isDesktop ? 26 : 0,  y: isDesktop ? -12 : -18, z: 36 }, rot: { x: -0.1, y: -0.6, z: 0.05 }, scale: 0.95, color: 0xfbbf24 },
        { scroll: 0.70, pos: { x: isDesktop ? -24 : 0, y: isDesktop ? -15 : -20, z: 36 }, rot: { x: 0.05, y: 0.45, z: 0 },  scale: 0.9,  color: 0x34d399 },
        { scroll: 0.90, pos: { x: isDesktop ? 26 : 0,  y: isDesktop ? -18 : -22, z: 36 }, rot: { x: 0.1, y: -0.35, z: -0.05 }, scale: 0.88, color: 0xa78bfa },
        { scroll: 1.0,  pos: { x: isDesktop ? 22 : 0,  y: isDesktop ? -12 : -20, z: 38 }, rot: { x: 0.1, y: -0.2, z: 0 },   scale: 1.0,  color: 0xfb7185 }
    ];

    function getJourneyState(scroll) {
        scroll = Math.max(0, Math.min(1, scroll));
        let p1 = KEYFRAMES[0], p2 = KEYFRAMES[KEYFRAMES.length - 1];
        for (let i = 0; i < KEYFRAMES.length - 1; i++) {
            if (scroll >= KEYFRAMES[i].scroll && scroll <= KEYFRAMES[i + 1].scroll) {
                p1 = KEYFRAMES[i]; p2 = KEYFRAMES[i + 1]; break;
            }
        }
        const range = p2.scroll - p1.scroll;
        const t = range === 0 ? 0 : (scroll - p1.scroll) / range;
        const e = t * t * (3 - 2 * t); // Smoothstep
        return {
            pos: { x: p1.pos.x + (p2.pos.x - p1.pos.x) * e, y: p1.pos.y + (p2.pos.y - p1.pos.y) * e, z: p1.pos.z + (p2.pos.z - p1.pos.z) * e },
            rot: { x: p1.rot.x + (p2.rot.x - p1.rot.x) * e, y: p1.rot.y + (p2.rot.y - p1.rot.y) * e, z: p1.rot.z + (p2.rot.z - p1.rot.z) * e },
            scale: p1.scale + (p2.scale - p1.scale) * e,
            color: p1.color
        };
    }

    // ── Stunt & Dodge Logic ──
    const rSX = Math.random() * 100, rSY = Math.random() * 100, rSZ = Math.random() * 100;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    let isHoveringInteractive = false, hoverExcitement = 0;
    let currentStunt = 'none', stuntProgress = 0, nextStuntTime = Date.now() + 3000 + Math.random() * 4000;
    let dodgeX = 0, dodgeY = 0, dodgeZ = 0, lastDodgeTime = 0;
    let scrollYTarget = 0, currentScrollPercent = 0;

    function triggerStunt() {
        const stunts = ['spin', 'scan', 'hop', 'salute'];
        currentStunt = stunts[Math.floor(Math.random() * stunts.length)];
        stuntProgress = 0;
        nextStuntTime = Date.now() + 5000 + Math.random() * 6000;
    }

    function triggerDodge() {
        const now = Date.now();
        if (now - lastDodgeTime < 650) return;
        lastDodgeTime = now;
        dodgeX = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 25);
        dodgeY = (Math.random() - 0.5) * 36;
        dodgeZ = 28 + Math.random() * 14;
        triggerStunt();
        chestCore.scale.set(1.9, 1.9, 1.9);
        coreLight.intensity = 5.5;
        setTimeout(() => { chestCore.scale.set(1, 1, 1); coreLight.intensity = 2.2; }, 350);
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = ((e.clientX / window.innerWidth) - 0.5) * 28;
        mouseY = -((e.clientY / window.innerHeight) - 0.5) * 24;
        const rsp = robot.position.clone().project(camera);
        const rsx = (rsp.x * 0.5 + 0.5) * window.innerWidth;
        const rsy = (-rsp.y * 0.5 + 0.5) * window.innerHeight;
        if (Math.hypot(e.clientX - rsx, e.clientY - rsy) < 130) triggerDodge();
    }, { passive: true });

    window.addEventListener('click', (e) => {
        const rsp = robot.position.clone().project(camera);
        const rsx = (rsp.x * 0.5 + 0.5) * window.innerWidth;
        const rsy = (-rsp.y * 0.5 + 0.5) * window.innerHeight;
        if (Math.hypot(e.clientX - rsx, e.clientY - rsy) < 180) triggerDodge();
    });

    document.addEventListener('mouseover', (e) => {
        isHoveringInteractive = !!e.target.closest('a, button, .project-feature-card, .skill-category-card, .exp-card-glow');
        if (isHoveringInteractive && Math.random() > 0.7 && currentStunt === 'none') triggerStunt();
    });

    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) scrollYTarget = window.scrollY / total;
    }, { passive: true });

    window.trigger3DTaskSteal = function () {
        chestCore.scale.set(1.8, 1.8, 1.8);
        coreLight.intensity = 5.0;
        triggerStunt();
        setTimeout(() => { chestCore.scale.set(1, 1, 1); coreLight.intensity = 2.2; }, 300);
    };

    // ── Animation Loop ──
    function animate() {
        requestAnimationFrame(animate);
        const now = Date.now();
        if (now > nextStuntTime && currentStunt === 'none') triggerStunt();

        targetX += (mouseX - targetX) * 0.06;
        targetY += (mouseY - targetY) * 0.06;
        camera.position.x = targetX * 0.25;
        camera.position.y = 15 + targetY * 0.25;
        camera.lookAt(new THREE.Vector3(targetX * 0.05, 0, 0));

        currentScrollPercent += (scrollYTarget - currentScrollPercent) * 0.06;
        const clock = now * 0.002;
        hoverExcitement += ((isHoveringInteractive ? 1 : 0) - hoverExcitement) * 0.1;

        const journey = getJourneyState(currentScrollPercent);
        const scrollSpeed = scrollYTarget - currentScrollPercent;

        const driftX = Math.sin(clock * 1.3 + rSX) * 2.2 + Math.cos(clock * 2.4 + rSY) * 1.0;
        const driftY = Math.sin(clock * 1.6 + rSY) * 1.8 + Math.cos(clock * 0.8 + rSZ) * 0.7;
        const turbZ  = Math.sin(clock * 2.1 + rSX) * 0.06;
        const pitchX = Math.cos(clock * 1.5 + rSY) * 0.05;

        let sEX = 0, sEY = 0, sERotY = 0, sERotX = 0, sERotZ = 0;
        if (currentStunt !== 'none') {
            stuntProgress += 0.035;
            if (stuntProgress >= 1.0) { currentStunt = 'none'; stuntProgress = 0; }
            else {
                const sp = Math.sin(stuntProgress * Math.PI);
                if (currentStunt === 'spin')   { sERotY = stuntProgress * Math.PI * 2; sEY = sp * 3.5; }
                if (currentStunt === 'hop')    { sEY = sp * 5.0; sERotX = -sp * 0.4; }
                if (currentStunt === 'scan')   { headGroup.rotation.y = Math.sin(stuntProgress * Math.PI * 4) * 0.7; headGroup.rotation.z = Math.cos(stuntProgress * Math.PI * 2) * 0.2; }
                if (currentStunt === 'salute') { leftArmGroup.rotation.x = -1.2 * sp; rightArmGroup.rotation.x = -1.2 * sp; leftArmGroup.rotation.z = -0.6 * sp; rightArmGroup.rotation.z = 0.6 * sp; }
            }
        }

        const tRX = (dodgeX !== 0 ? dodgeX : journey.pos.x) + targetX * 0.35 + driftX + sEX;
        const tRY = (dodgeY !== 0 ? dodgeY : journey.pos.y) + driftY + targetY * 0.3 + sEY;
        const tRZ = (dodgeZ !== 0 ? dodgeZ : journey.pos.z);
        robot.position.x += (tRX - robot.position.x) * 0.08;
        robot.position.y += (tRY - robot.position.y) * 0.08;
        robot.position.z += (tRZ - robot.position.z) * 0.08;

        robot.rotation.x += (journey.rot.x + scrollSpeed * 3.5 + hoverExcitement * 0.18 + pitchX + sERotX - robot.rotation.x) * 0.07;
        robot.rotation.y += (journey.rot.y + scrollSpeed * 2.0 + targetX * 0.02 + sERotY - robot.rotation.y) * 0.07;
        robot.rotation.z += (journey.rot.z + scrollSpeed * 1.2 + targetX * 0.015 + turbZ + sERotZ - robot.rotation.z) * 0.07;

        const ts = journey.scale * (1.0 + hoverExcitement * 0.08);
        robot.scale.x += (ts - robot.scale.x) * 0.07;
        robot.scale.y += (ts - robot.scale.y) * 0.07;
        robot.scale.z += (ts - robot.scale.z) * 0.07;

        chestCore.material.color.setHex(journey.color);
        chestCore.material.emissive.setHex(journey.color);
        coreLight.color.setHex(journey.color);

        if (currentStunt !== 'scan') {
            headGroup.rotation.y = targetX * 0.045 + Math.sin(clock * 0.7) * 0.1;
            headGroup.rotation.x = targetY * 0.03 + Math.cos(clock * 0.9) * 0.05;
            headGroup.rotation.z = Math.sin(clock * 0.8) * 0.04;
        }

        if (currentStunt !== 'salute') {
            if (hoverExcitement > 0.05) {
                leftArmGroup.rotation.z  = -0.35 + Math.sin(clock * 1.5) * 0.1;
                rightArmGroup.rotation.z =  0.45 + Math.sin(clock * 5.0) * 0.25 * hoverExcitement;
                leftArmGroup.rotation.x  = -0.4 * hoverExcitement;
                rightArmGroup.rotation.x = -0.7 * hoverExcitement + Math.sin(clock * 4.0) * 0.2;
                coreLight.intensity = 2.2 + Math.sin(clock * 6.0) * 1.2 * hoverExcitement;
            } else {
                leftArmGroup.rotation.z  = -0.22 + Math.sin(clock * 1.2 + rSX) * 0.18;
                rightArmGroup.rotation.z =  0.22 - Math.sin(clock * 1.2 + rSY) * 0.18;
                leftArmGroup.rotation.x  =  Math.sin(clock * 1.0 + rSZ) * 0.25;
                rightArmGroup.rotation.x = -Math.sin(clock * 1.0 + rSX) * 0.25;
                coreLight.intensity = 2.0;
            }
        }

        leftLeg.group.rotation.x  =  Math.sin(clock * 1.1 + rSY) * 0.2 + 0.1;
        rightLeg.group.rotation.x = -Math.sin(clock * 1.1 + rSX) * 0.2 + 0.1;

        const tp = 1.0 + Math.sin(clock * 4.0) * 0.25 + hoverExcitement * 0.3 + (currentStunt === 'hop' ? 0.6 : 0);
        leftLeg.thruster.scale.set(tp, tp, tp);
        rightLeg.thruster.scale.set(tp, tp, tp);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ==========================================================================
   5. Copy to Clipboard Utility with Instant Feedback
   ========================================================================== */
function copyText(text, buttonElement) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fa-solid fa-check" style="color: var(--lime);"></i> Copied!';
        setTimeout(() => { buttonElement.innerHTML = originalHtml; }, 1800);
    });
}
window.copyText = copyText;

/* ==========================================================================
   6. Project Domain Filtering
   ========================================================================== */
function filterProjects(domain, btn) {
    document.querySelectorAll('.filter-tab-pill').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.querySelectorAll('.project-feature-card').forEach(card => {
        const d = card.getAttribute('data-domain');
        card.style.display = (domain === 'all' || d === domain) ? 'flex' : 'none';
    });
}
window.filterProjects = filterProjects;

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
        drawer.classList.toggle('open');
        const icon = toggle.querySelector('i');
        icon.className = drawer.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
}

function closeMobileNav() {
    const drawer = document.getElementById('mobile-drawer');
    const toggle = document.getElementById('mobile-toggle');
    if (drawer) drawer.classList.remove('open');
    if (toggle) { const i = toggle.querySelector('i'); if (i) i.className = 'fa-solid fa-bars'; }
}
window.closeMobileNav = closeMobileNav;

/* ==========================================================================
   8. ScrollSpy for Active Navigation State
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.pageYOffset + 120;
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }, { passive: true });
}
