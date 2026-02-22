"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";

/* ─── Logo (image reference) ─────────────────────────────────────────── */
const LOGO_PATH = "/a1.jpeg";

/* ─── Static Data (defined outside component – never re-created) ─── */
const NAV = ["Home","About","Skills","Projects","Company","Achievements","Contact"];

const PROJECTS = [
  {
    id:"ornalyze", icon:"💎", accent:"#d97706",
    name:"Ornalyze", tag:"Jewel Design & Analysis Platform",
    desc:"AI-powered jewellery design analysis engine — recognises gemstone quality, pricing intelligence, and aesthetic patterns to help jewellers make data-driven decisions.",
    features:["AI gem quality & design recognition","Predictive pricing & market insights","Design recommendation engine","Inventory optimization","Real-time analytics dashboard"],
    stack:["Python","Machine Learning","React","MySQL","Data Viz"],
  },
  {
    id:"signet", icon:"🚦", accent:"#059669",
    name:"Signet", tag:"Dynamic Smart Traffic Signal System",
    desc:"Real-time ML-driven traffic management system that adapts signal timings via live sensor data, reducing congestion and optimising urban traffic flow.",
    features:["Real-time traffic density detection","Adaptive ML signal timing","Emergency vehicle priority routing","Multi-intersection coordination","Live city dashboard"],
    stack:["Python","ML Algorithms","React","MySQL","IoT Integration"],
  },
];

const SKILLS = [
  { label:"Python & AI/ML",              pct:88, color:"#4f46e5" },
  { label:"React & Frontend Dev",         pct:82, color:"#0891b2" },
  { label:"AI Engineering & LLMs",        pct:76, color:"#7c3aed" },
  { label:"Data Structures & Algorithms", pct:85, color:"#059669" },
];

const TECH_ICONS = [
  { icon:"⚛️", name:"React",            color:"#0891b2" },
  { icon:"🐍", name:"Python",           color:"#4f46e5" },
  { icon:"🤖", name:"AI Engineering",   color:"#7c3aed" },
  { icon:"🧠", name:"Machine Learning", color:"#059669" },
  { icon:"📊", name:"Data Analysis",    color:"#db2777" },
  { icon:"⚡", name:"DSA",              color:"#ea580c" },
];

const SKILL_GROUPS = [
  { cat:"Programming",     items:["Python","React","JavaScript"],                                      color:"#4f46e5" },
  { cat:"AI & ML",         items:["Supervised Learning","LLM Integration","Predictive Modelling","Data Analysis"], color:"#0891b2" },
  { cat:"Web & Database",  items:["HTML5 / CSS3","PHP","MySQL","Backend Architecture"],               color:"#7c3aed" },
  { cat:"CS Fundamentals", items:["DSA","Operating Systems","DBMS","Computer Networks"],              color:"#059669" },
];

const ACHIEVEMENTS = [
  { icon:"🤖", title:"AI Chatbot Creation",    org:"Google Developer Club", prize:"🥇 1st Prize", desc:"Built an intelligent AI chatbot with advanced NLP and ML integration." },
  { icon:"📊", title:"Power BI Analytics",     org:"Microsoft Club",        prize:"🥇 1st Prize", desc:"Excellence in business intelligence dashboards and data visualisation." },
  { icon:"⚙️", title:"Technical Competition",  org:"CS Department",         prize:"🥇 1st Prize", desc:"Exceptional problem-solving in system design and engineering." },
  { icon:"🏗️", title:"Enterprise Architecture",org:"Self-Initiated",        prize:"✅ Delivered",  desc:"Enterprise-level system architecture and real-time database solutions." },
];

const SERVICES = [
  { icon:"💻", name:"Custom Software Solutions" },
  { icon:"🌐", name:"Web Applications" },
  { icon:"🤖", name:"AI & ML Based Systems" },
  { icon:"📈", name:"Business Optimization Tools" },
  { icon:"🔐", name:"Secure Digital Platforms" },
  { icon:"⚡", name:"Agile Development Framework" },
  { icon:"🖥️", name:"Custom PC Build" },
];

/* ─────────────────────────────────────────────────────────────────
   THREE.JS HERO  — performance-first build
   • antialias OFF  (biggest GPU win)
   • pixelRatio capped at 1
   • particles: 300 (was 500)
   • floaters: 6   (was 8)
   • animation PAUSED when canvas not visible (IntersectionObserver)
   • mousemove throttled to 60fps via flag
───────────────────────────────────────────────────────────────── */
const HeroCanvas = memo(function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference:"high-performance" });
    renderer.setPixelRatio(1);           // always 1 — huge win on retina screens
    renderer.setClearColor(0, 0);
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 80);
    camera.position.z = 16;

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl1 = new THREE.PointLight(0x4f46e5, 2.5, 35); pl1.position.set(8, 8, 8);   scene.add(pl1);
    const pl2 = new THREE.PointLight(0x0891b2, 2.0, 35); pl2.position.set(-8,-6, 6);  scene.add(pl2);

    /* ── Icosahedron ── */
    const icoGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const ico  = new THREE.Mesh(icoGeo, new THREE.MeshPhongMaterial({ color:0x4f46e5, transparent:true, opacity:0.09, side:THREE.DoubleSide }));
    const wire = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({ color:0x6366f1, wireframe:true, transparent:true, opacity:0.22 }));
    scene.add(ico); scene.add(wire);

    /* ── Ring ── */
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.025, 8, 64),
      new THREE.MeshBasicMaterial({ color:0x0891b2, transparent:true, opacity:0.20 })
    );
    ring.rotation.x = 1.1;
    scene.add(ring);

    /* ── Floaters ── */
    const floaters = [];
    const fc = [0x4f46e5, 0x0891b2, 0x7c3aed, 0xd97706, 0x059669, 0xdb2777];
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.16 + Math.random() * 0.20, 0),
        new THREE.MeshPhongMaterial({ color: fc[i % fc.length], transparent:true, opacity:0.7 })
      );
      const th = (i / 6) * Math.PI * 2, r = 6 + Math.random() * 2;
      mesh.position.set(Math.cos(th)*r, (Math.random()-0.5)*7, Math.sin(th)*r - 4);
      mesh.userData = { th, r, spd: 0.003 + Math.random()*0.004, off: Math.random()*Math.PI*2 };
      scene.add(mesh); floaters.push(mesh);
    }

    /* ── Particles (300) ── */
    const N = 300;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const pal = [[0.31,0.31,0.89],[0.04,0.57,0.71],[0.47,0.23,0.93]];
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random()-0.5)*44;
      pos[i*3+1] = (Math.random()-0.5)*44;
      pos[i*3+2] = (Math.random()-0.5)*44;
      const c = pal[i % 3];
      col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ size:0.10, vertexColors:true, transparent:true, opacity:0.35 }));
    scene.add(pts);

    /* ── Mouse (throttled) ── */
    let mx = 0, my = 0, mDirty = false;
    const onMouse = (e) => {
      if (mDirty) return;
      mDirty = true;
      requestAnimationFrame(() => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        mDirty = false;
      });
    };

    /* ── Resize (debounced) ── */
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize",    onResize, { passive: true });

    /* ── Pause when out of view ── */
    let visible = true;
    const visObs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    visObs.observe(el);

    /* ── Animation loop ── */
    let frame, t = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;          // ← skip render when scrolled away
      t += 0.009;

      ico.rotation.x  = t * 0.15; ico.rotation.y  = t * 0.21;
      wire.rotation.x = t * 0.15; wire.rotation.y = t * 0.21;
      ring.rotation.z = t * 0.09;
      pts.rotation.y  = t * 0.006;

      floaters.forEach(f => {
        const { th, r, spd, off } = f.userData;
        const a = th + t * spd;
        f.position.x  = Math.cos(a) * r;
        f.position.z  = Math.sin(a) * r - 4;
        f.position.y += Math.sin(t + off) * 0.009;
        f.rotation.x += 0.011; f.rotation.y += 0.010;
      });

      scene.rotation.y += (mx * 0.12 - scene.rotation.y) * 0.035;
      scene.rotation.x += (-my * 0.07 - scene.rotation.x) * 0.035;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      visObs.disconnect();
      // Dispose all GPU memory
      renderer.dispose();
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position:"absolute", inset:0, zIndex:0 }} />;
});

/* ─── Shared IntersectionObserver (one observer for whole page) ─── */
const observerCallbacks = new Map();
let sharedObserver = null;
function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const cb = observerCallbacks.get(e.target);
        if (cb) cb(e.isIntersecting);
      });
    }, { threshold: 0.1 });
  }
  return sharedObserver;
}

function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    observerCallbacks.set(el, (v) => { if (v) setVisible(true); });
    getObserver().observe(el);
    return () => { observerCallbacks.delete(el); getObserver().unobserve(el); };
  }, []);
  return [ref, visible];
}

/* ─── Reveal ─── */
const Reveal = memo(function Reveal({ children, delay = 0, dir = "up", style = {} }) {
  const [ref, v] = useInView();
  const from = { up:"translateY(36px)", left:"translateX(-36px)", right:"translateX(36px)" };
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : from[dir],
      transition: `opacity .65s ease ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s`,
      willChange: "opacity, transform",
      ...style,
    }}>{children}</div>
  );
});

/* ─── SkillBar ─── */
const Bar = memo(function Bar({ label, pct, color, delay = 0 }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:800, color }}>{pct}%</span>
      </div>
      <div style={{ background:"#e5e7eb", borderRadius:99, height:5, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:99,
          background:`linear-gradient(90deg,${color},${color}88)`,
          width: v ? `${pct}%` : "0%",
          transition:`width 1.2s cubic-bezier(.4,0,.2,1) ${delay}s`,
        }} />
      </div>
    </div>
  );
});

/* ─── TypeWriter (isolated, no prop changes after mount) ─── */
const TYPEWORDS = ["Founder & CEO @ Axentus","AI Engineer in the Making","React Developer","Problem Solver","System Architect"];
function TypeWriter() {
  const [text, setText] = useState("");
  const state = useRef({ wi:0, ci:0, del:false });

  useEffect(() => {
    let to;
    const tick = () => {
      const { wi, ci, del } = state.current;
      const word = TYPEWORDS[wi];
      if (!del && ci <= word.length) {
        setText(word.slice(0, ci));
        state.current.ci++;
        to = setTimeout(tick, 70);
      } else if (!del && ci > word.length) {
        to = setTimeout(() => { state.current.del = true; tick(); }, 1800);
      } else if (del && ci >= 0) {
        setText(word.slice(0, ci));
        state.current.ci--;
        to = setTimeout(tick, 38);
      } else {
        state.current = { wi:(wi+1) % TYPEWORDS.length, ci:0, del:false };
        to = setTimeout(tick, 200);
      }
    };
    tick();
    return () => clearTimeout(to);
  }, []);

  return (
    <span>
      <span style={{ color:"#4f46e5", fontWeight:700 }}>{text}</span>
      <span style={{ borderRight:"2.5px solid #4f46e5", animation:"tw-blink 1s step-end infinite", marginLeft:1 }}>&nbsp;</span>
    </span>
  );
}

/* ─── Section Header ─── */
const SHead = memo(function SHead({ label, title }) {
  return (
    <div style={{ textAlign:"center", marginBottom:56 }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ width:24, height:2, background:"linear-gradient(90deg,#4f46e5,#0891b2)" }} />
        <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4f46e5" }}>{label}</span>
        <div style={{ width:24, height:2, background:"linear-gradient(90deg,#0891b2,#4f46e5)" }} />
      </div>
      <h2 style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.6vw,2.6rem)", letterSpacing:"-0.03em", color:"#111827", lineHeight:1.1 }}>{title}</h2>
    </div>
  );
});

/* ══════════════════════════════════════════════════════════════════
   MAIN PORTFOLIO
══════════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  /* Throttled scroll listener */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  const go = useCallback((id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" });
  }, []);

  /* ── CSS injected once ── */
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:#f8fafc;color:#1e293b;font-family:'Inter',sans-serif;overflow-x:hidden;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-track{background:#f1f5f9;}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#4f46e5,#0891b2);border-radius:4px;}
    @keyframes tw-blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes hero-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
    @keyframes hero-spin{to{transform:rotate(360deg)}}
    @keyframes hero-fade{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
    @keyframes dot-pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.45)}70%{box-shadow:0 0 0 12px rgba(16,185,129,0)}}
  `;

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{CSS}</style>

      {/* ══ NAV ══ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200, height:62,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 40px",
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        boxShadow:  scrolled ? "0 1px 16px rgba(79,70,229,0.07)" : "none",
        borderBottom: scrolled ? "1px solid rgba(79,70,229,0.09)" : "none",
        transition: "background .3s, box-shadow .3s, border-color .3s",
      }}>
        <span
          onClick={() => go("home")}
          style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:20, cursor:"pointer",
            background:"linear-gradient(135deg,#4f46e5,#0891b2)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}
        >DH.</span>

        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
          {NAV.map(n => (
            <button key={n} onClick={() => go(n)} style={{
              background:"none", border:"none", cursor:"pointer",
              padding:"5px 12px", borderRadius:99,
              fontSize:13, fontWeight:600, color:"#64748b",
              fontFamily:"'Oxanium',sans-serif", transition:"color .18s, background .18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color="#4f46e5"; e.currentTarget.style.background="rgba(79,70,229,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="#64748b"; e.currentTarget.style.background="none"; }}
            >{n}</button>
          ))}
          <a href="mailto:vikramdhacha01@gmail.com" style={{
            marginLeft:8, padding:"7px 20px", borderRadius:99, fontSize:13, fontWeight:700,
            background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff",
            textDecoration:"none", fontFamily:"'Oxanium',sans-serif",
            boxShadow:"0 3px 12px rgba(79,70,229,0.28)",
            transition:"box-shadow .2s, transform .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow="0 6px 22px rgba(79,70,229,0.45)"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="0 3px 12px rgba(79,70,229,0.28)"; e.currentTarget.style.transform=""; }}
          >Hire Me →</a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="home" style={{ minHeight:"100vh", position:"relative", display:"flex", alignItems:"center", overflow:"hidden", background:"linear-gradient(135deg,#f8fafc 0%,#ede9fe 50%,#e0f2fe 100%)" }}>
        <HeroCanvas />
        {/* light wash so text stays readable */}
        <div style={{ position:"absolute", inset:0, background:"rgba(248,250,252,0.38)", zIndex:1, pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:2, maxWidth:1200, margin:"0 auto", padding:"80px 40px 60px", width:"100%" }}>
          <div style={{ maxWidth:620 }}>

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24,
              background:"rgba(79,70,229,0.07)", border:"1px solid rgba(79,70,229,0.2)",
              borderRadius:99, padding:"6px 16px",
              animation: loaded ? "hero-fade .6s ease both" : "none" }}>
              <span style={{ width:7, height:7, background:"#10b981", borderRadius:"50%", display:"inline-block", animation:"dot-pulse 2s infinite" }} />
              <span style={{ fontSize:11, fontWeight:800, color:"#4f46e5", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'Oxanium',sans-serif" }}>Smartness For Creative</span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:"clamp(2.6rem,6vw,4.8rem)", lineHeight:1.0, letterSpacing:"-0.04em", marginBottom:16, animation: loaded ? "hero-fade .7s .1s ease both" : "none" }}>
              <span style={{ display:"block", color:"#94a3b8", fontSize:"0.38em", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Hi, I'm</span>
              <span style={{ display:"block", color:"#4f46e5" }}>Dharshan</span>
              <span style={{ display:"block", color:"#111827" }}>Hariharan</span>
            </h1>

            {/* TypeWriter */}
            <div style={{ fontSize:"clamp(.95rem,1.8vw,1.2rem)", fontWeight:600, marginBottom:14,
              fontFamily:"'Oxanium',sans-serif", color:"#64748b",
              animation: loaded ? "hero-fade .7s .22s ease both" : "none" }}>
              <TypeWriter />
            </div>

            {/* Location */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16,
              animation: loaded ? "hero-fade .7s .32s ease both" : "none" }}>
              <span>📍</span>
              <span style={{ fontSize:13, color:"#64748b", fontWeight:600 }}>Namakkal, Tamil Nadu, India</span>
            </div>

            {/* Description */}
            <p style={{ fontSize:15, lineHeight:1.85, color:"#64748b", marginBottom:30, maxWidth:500,
              animation: loaded ? "hero-fade .7s .42s ease both" : "none" }}>
              Building intelligent, scalable systems at the intersection of{" "}
              <strong style={{ color:"#4f46e5" }}>AI Engineering</strong> and modern software development. Founder of{" "}
              <strong style={{ color:"#0891b2" }}>Axentus Software & Services</strong>.
            </p>

            {/* CTAs */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", animation: loaded ? "hero-fade .7s .52s ease both" : "none" }}>
              <button onClick={() => go("projects")} style={{
                padding:"12px 28px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                color:"#fff", border:"none", borderRadius:99,
                fontSize:14, fontWeight:700, cursor:"pointer",
                fontFamily:"'Oxanium',sans-serif",
                boxShadow:"0 6px 20px rgba(79,70,229,0.32)",
                transition:"transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 30px rgba(79,70,229,0.48)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 20px rgba(79,70,229,0.32)"; }}
              >View Projects ↗</button>

              <button onClick={() => go("contact")} style={{
                padding:"12px 28px", background:"#fff", color:"#4f46e5",
                border:"1.5px solid rgba(79,70,229,0.28)", borderRadius:99,
                fontSize:14, fontWeight:700, cursor:"pointer",
                fontFamily:"'Oxanium',sans-serif",
                boxShadow:"0 2px 8px rgba(79,70,229,0.07)",
                transition:"border-color .2s, box-shadow .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#4f46e5"; e.currentTarget.style.boxShadow="0 6px 20px rgba(79,70,229,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(79,70,229,0.28)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(79,70,229,0.07)"; }}
              >Get in Touch</button>
            </div>

            {/* Social */}
            <div style={{ display:"flex", gap:10, marginTop:26, animation: loaded ? "hero-fade .7s .66s ease both" : "none" }}>
              {[
                { label:"GitHub",   href:"https://github.com/blackdaisy2026-commits",            icon:"🐙" },
                { label:"LinkedIn", href:"https://www.linkedin.com/in/dharshan-h-v-a51277290",  icon:"💼" },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  padding:"7px 16px", borderRadius:99,
                  border:"1px solid rgba(79,70,229,0.18)",
                  background:"rgba(255,255,255,0.75)",
                  color:"#64748b", fontSize:13, fontWeight:700,
                  textDecoration:"none", fontFamily:"'Oxanium',sans-serif",
                  transition:"border-color .2s, color .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#4f46e5"; e.currentTarget.style.color="#4f46e5"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(79,70,229,0.18)"; e.currentTarget.style.color="#64748b"; }}
                >{l.icon} {l.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", zIndex:2,
          display:"flex", flexDirection:"column", alignItems:"center", gap:5,
          animation:"hero-float 2.8s ease-in-out infinite" }}>
          <span style={{ fontSize:10, color:"#94a3b8", letterSpacing:"0.16em", textTransform:"uppercase", fontFamily:"'Oxanium',sans-serif" }}>Scroll</span>
          <div style={{ width:1, height:30, background:"linear-gradient(to bottom,#4f46e5,transparent)" }} />
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div style={{ background:"linear-gradient(135deg,#4f46e5,#0891b2)", padding:"30px 40px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, textAlign:"center" }}>
          {[["2+","Live Projects"],["4","Awards Won"],["1","Company Founded"],["∞","Vision Scale"]].map(([n,l]) => (
            <Reveal key={l}>
              <div>
                <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:34, color:"#fff", letterSpacing:"-0.03em" }}>{n}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.72)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:3 }}>{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <section id="about" style={{ padding:"88px 40px", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <SHead label="About Me" title={<>Software Developer & <span style={{ color:"#4f46e5" }}>AI Enthusiast</span></>} />
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <Reveal dir="left" delay={0.1}>
              <div style={{ background:"#f8fafc", borderRadius:20, padding:36, border:"1px solid #e2e8f0" }}>
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#0891b2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, boxShadow:"0 6px 20px rgba(79,70,229,0.25)" }}>👨‍💻</div>
                    <div style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1.5px dashed rgba(79,70,229,0.28)", animation:"hero-spin 12s linear infinite" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:18, color:"#111827" }}>Dharshan Hariharan</div>
                    <div style={{ fontSize:13, color:"#4f46e5", fontWeight:600, marginTop:3 }}>Founder & CEO · Axentus</div>
                    <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>📍 Namakkal, Tamil Nadu, India</div>
                  </div>
                </div>
                <p style={{ fontSize:14, lineHeight:1.85, color:"#64748b", marginBottom:14 }}>Passionate Software Developer and Founder of Axentus Software & Services, building intelligent systems at the intersection of AI and modern software engineering.</p>
                <p style={{ fontSize:14, lineHeight:1.85, color:"#64748b", marginBottom:20 }}>Deepening expertise in <strong style={{ color:"#4f46e5" }}>AI Engineering & LLMs</strong> while preparing for <strong style={{ color:"#0891b2" }}>GATE CS</strong>.</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["AI Engineering","React Dev","Machine Learning","DSA","MySQL"].map(t => (
                    <span key={t} style={{ fontSize:11, fontWeight:700, color:"#4f46e5", background:"rgba(79,70,229,0.07)", border:"1px solid rgba(79,70,229,0.16)", padding:"3px 11px", borderRadius:99, fontFamily:"'Oxanium',sans-serif" }}>{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal dir="right" delay={0.15}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {TECH_ICONS.map(t => (
                  <div key={t.name} style={{
                    background:"#f8fafc", border:`1px solid ${t.color}1a`,
                    borderRadius:12, padding:18, textAlign:"center",
                    transition:"transform .24s, box-shadow .24s, border-color .24s, background .24s",
                    cursor:"default",
                  }}
                    onMouseEnter={e => { const c=e.currentTarget; c.style.background=`${t.color}0b`; c.style.borderColor=t.color+"40"; c.style.transform="translateY(-4px)"; c.style.boxShadow=`0 10px 24px ${t.color}15`; }}
                    onMouseLeave={e => { const c=e.currentTarget; c.style.background="#f8fafc"; c.style.borderColor=t.color+"1a"; c.style.transform=""; c.style.boxShadow=""; }}
                  >
                    <div style={{ fontSize:26, marginBottom:6 }}>{t.icon}</div>
                    <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:700, fontSize:12, color:"#374151" }}>{t.name}</div>
                    <div style={{ width:16, height:2, background:t.color, borderRadius:99, margin:"4px auto 0" }} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" style={{ padding:"88px 40px", background:"#f8fafc", borderTop:"1px solid #e2e8f0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <SHead label="Technical Skills" title={<>Skills & <span style={{ color:"#0891b2" }}>Expertise</span></>} />
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
            <Reveal dir="left" delay={0.1}>
              <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:20, padding:36 }}>
                <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:700, fontSize:14, color:"#111827", marginBottom:24 }}>Core Proficiency</div>
                {SKILLS.map((s, i) => <Bar key={s.label} {...s} delay={i * 0.11} />)}
              </div>
            </Reveal>
            <Reveal dir="right" delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {SKILL_GROUPS.map(g => (
                  <div key={g.cat} style={{
                    background:"#fff", border:`1px solid ${g.color}18`,
                    borderRadius:12, padding:18,
                    transition:"border-color .22s, background .22s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=g.color+"40"; e.currentTarget.style.background=`${g.color}05`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=g.color+"18"; e.currentTarget.style.background="#fff"; }}
                  >
                    <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:10, color:g.color, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:9 }}>{g.cat}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {g.items.map(it => <span key={it} style={{ fontSize:12, color:"#64748b", background:"#f1f5f9", border:"1px solid #e2e8f0", padding:"3px 10px", borderRadius:99 }}>{it}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" style={{ padding:"88px 40px", background:"#fff", borderTop:"1px solid #e2e8f0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <SHead label="Featured Work" title={<>My <span style={{ color:"#d97706" }}>Projects</span></>} />
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {PROJECTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1} dir={i % 2 === 0 ? "left" : "right"}>
                <div style={{
                  background:"#f8fafc", border:`1.5px solid ${p.accent}20`,
                  borderRadius:20, padding:34, position:"relative", overflow:"hidden",
                  transition:"transform .3s, box-shadow .3s, border-color .3s",
                  cursor:"default",
                }}
                  onMouseEnter={e => { const c=e.currentTarget; c.style.transform="translateY(-6px)"; c.style.boxShadow=`0 20px 50px ${p.accent}12`; c.style.borderColor=p.accent+"45"; }}
                  onMouseLeave={e => { const c=e.currentTarget; c.style.transform=""; c.style.boxShadow=""; c.style.borderColor=p.accent+"20"; }}
                >
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${p.accent},${p.accent}44)` }} />
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                    <div style={{ width:50, height:50, borderRadius:12, background:`${p.accent}10`, border:`1.5px solid ${p.accent}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{p.icon}</div>
                    <div>
                      <h3 style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:20, color:"#111827" }}>{p.name}</h3>
                      <span style={{ fontSize:10, color:p.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.09em" }}>{p.tag}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:13.5, lineHeight:1.85, color:"#64748b", marginBottom:16 }}>{p.desc}</p>
                  <div style={{ marginBottom:16 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                        <span style={{ color:p.accent, fontWeight:700, fontSize:11 }}>→</span>
                        <span style={{ fontSize:12.5, color:"#64748b" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {p.stack.map(t => <span key={t} style={{ fontSize:11, fontWeight:700, color:p.accent, background:`${p.accent}0c`, border:`1px solid ${p.accent}1e`, padding:"3px 10px", borderRadius:99, fontFamily:"'Oxanium',sans-serif" }}>{t}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMPANY ══ */}
      <section id="company" style={{ padding:"88px 40px", background:"#f8fafc", borderTop:"1px solid #e2e8f0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <SHead label="The Company" title={<>Axentus <span style={{ color:"#7c3aed" }}>Software & Services</span></>} />
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:44, alignItems:"start" }}>
            <Reveal dir="left" delay={0.1}>
              <div style={{ background:"#fff", border:"1px solid rgba(124,58,237,0.14)", borderRadius:20, padding:36 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
                  <img
                    src={LOGO_PATH}
                    alt="Axentus Logo"
                    loading="lazy"
                    style={{ width:60, height:60, borderRadius:12, objectFit:"cover", boxShadow:"0 5px 18px rgba(79,70,229,0.20)", display:"block", flexShrink:0 }}
                  />
                  <div>
                    <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:16, color:"#111827" }}>Axentus Software & Services</div>
                    <div style={{ fontSize:12, color:"#7c3aed", fontWeight:600, marginTop:3 }}>Technology · Innovation · Impact</div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>📍 Namakkal, Tamil Nadu, India</div>
                  </div>
                </div>
                <p style={{ fontSize:14, lineHeight:1.9, color:"#64748b", marginBottom:20 }}>A technology-focused company delivering intelligent software solutions — from AI-powered systems to custom PC builds. Axentus bridges engineering excellence with strategic innovation.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[
                    { label:"Vision",  text:"Build innovative, intelligent, and scalable solutions that empower businesses globally.", color:"#4f46e5" },
                    { label:"Mission", text:"Combine engineering excellence with strategic thinking to deliver impactful technology.", color:"#7c3aed" },
                  ].map(v => (
                    <div key={v.label} style={{ background:"#f8fafc", border:`1px solid ${v.color}16`, borderRadius:10, padding:13 }}>
                      <div style={{ fontFamily:"'Oxanium',sans-serif", fontSize:10, fontWeight:800, color:v.color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:5 }}>{v.label}</div>
                      <div style={{ fontSize:12, color:"#64748b", lineHeight:1.7 }}>{v.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal dir="right" delay={0.15}>
              <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:700, fontSize:12, color:"#374151", marginBottom:12, letterSpacing:"0.06em", textTransform:"uppercase" }}>Services Offered</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {SERVICES.map(s => (
                  <div key={s.name} style={{
                    display:"flex", alignItems:"center", gap:11,
                    background:"#fff", border:"1px solid #e2e8f0",
                    borderRadius:10, padding:"11px 16px",
                    transition:"transform .2s, border-color .2s, background .2s",
                    cursor:"default",
                  }}
                    onMouseEnter={e => { const c=e.currentTarget; c.style.transform="translateX(7px)"; c.style.borderColor="rgba(79,70,229,0.35)"; c.style.background="rgba(79,70,229,0.025)"; }}
                    onMouseLeave={e => { const c=e.currentTarget; c.style.transform=""; c.style.borderColor="#e2e8f0"; c.style.background="#fff"; }}
                  >
                    <span style={{ fontSize:18 }}>{s.icon}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{s.name}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ ACHIEVEMENTS ══ */}
      <section id="achievements" style={{ padding:"88px 40px", background:"linear-gradient(135deg,#1e1b4b,#1e3a5f)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:24, height:2, background:"linear-gradient(90deg,#818cf8,#38bdf8)" }} />
                <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#818cf8" }}>Recognition</span>
                <div style={{ width:24, height:2, background:"linear-gradient(90deg,#38bdf8,#818cf8)" }} />
              </div>
              <h2 style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.6vw,2.6rem)", letterSpacing:"-0.03em", color:"#fff" }}>Awards & <span style={{ color:"#fbbf24" }}>Achievements</span></h2>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.09}>
                <div style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)",
                  borderRadius:16, padding:24, textAlign:"center", position:"relative", overflow:"hidden",
                  transition:"transform .28s, background .28s, border-color .28s",
                  cursor:"default",
                }}
                  onMouseEnter={e => { const c=e.currentTarget; c.style.transform="translateY(-6px)"; c.style.background="rgba(79,70,229,0.11)"; c.style.borderColor="rgba(129,140,248,0.38)"; }}
                  onMouseLeave={e => { const c=e.currentTarget; c.style.transform=""; c.style.background="rgba(255,255,255,0.05)"; c.style.borderColor="rgba(255,255,255,0.09)"; }}
                >
                  <div style={{ position:"absolute", top:0, left:"22%", right:"22%", height:2, background:"linear-gradient(90deg,transparent,#fbbf24,transparent)" }} />
                  <div style={{ fontSize:38, marginBottom:10 }}>{a.icon}</div>
                  <div style={{ fontFamily:"'Oxanium',sans-serif", fontWeight:800, fontSize:13, color:"#e2e8f0", marginBottom:4, lineHeight:1.3 }}>{a.title}</div>
                  <div style={{ fontSize:10, color:"#fbbf24", fontWeight:700, letterSpacing:"0.07em", marginBottom:8 }}>{a.org}</div>
                  <div style={{ display:"inline-block", background:"rgba(251,191,36,0.10)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:99, padding:"3px 11px", fontSize:11, fontWeight:800, color:"#fbbf24", marginBottom:8, fontFamily:"'Oxanium',sans-serif" }}>{a.prize}</div>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.65 }}>{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ padding:"88px 40px", background:"#fff", borderTop:"1px solid #e2e8f0" }}>
        <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <SHead label="Get in Touch" title={<>Let's Build Something <span style={{ color:"#4f46e5" }}>Great</span></>} />
            <p style={{ fontSize:15, color:"#64748b", lineHeight:1.85, marginBottom:40 }}>AI engineering opportunity, interesting project, or want to collaborate? Always open to meaningful conversations.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <a href="mailto:vikramdhacha01@gmail.com" style={{
              display:"block", fontSize:"clamp(.95rem,2vw,1.3rem)", fontWeight:800,
              color:"#4f46e5", textDecoration:"none",
              padding:"22px 28px",
              background:"linear-gradient(135deg,#ede9fe,#dbeafe)",
              border:"1.5px solid rgba(79,70,229,0.16)",
              borderRadius:16, fontFamily:"'Oxanium',sans-serif",
              transition:"transform .25s, box-shadow .25s, border-color .25s",
              marginBottom:36,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.015)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(79,70,229,0.14)"; e.currentTarget.style.borderColor="#4f46e5"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="rgba(79,70,229,0.16)"; }}
            >vikramdhacha01@gmail.com ↗</a>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
              {[
                { label:"GitHub · blackdaisy2026-commits", href:"https://github.com/blackdaisy2026-commits",           icon:"🐙" },
                { label:"LinkedIn",                        href:"https://www.linkedin.com/in/dharshan-h-v-a51277290", icon:"💼" },
                { label:"Namakkal, India",                 href:"#",                                                  icon:"📍" },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  padding:"9px 18px", border:"1.5px solid #e2e8f0", borderRadius:99,
                  fontSize:12, fontWeight:700, color:"#64748b",
                  textDecoration:"none", background:"#f8fafc",
                  fontFamily:"'Oxanium',sans-serif",
                  transition:"border-color .2s, color .2s, transform .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#4f46e5"; e.currentTarget.style.color="#4f46e5"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; e.currentTarget.style.transform=""; }}
                >{l.icon} {l.label}</a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:"#0f172a", padding:"20px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <span style={{ fontSize:12, fontWeight:700, color:"#334155", fontFamily:"'Oxanium',sans-serif" }}>© 2025 Dharshan Hariharan · Axentus Software & Services</span>
        <span style={{ fontSize:11, color:"#1e293b", fontFamily:"'Oxanium',sans-serif" }}>Namakkal, Tamil Nadu, India 🇮🇳</span>
      </footer>
    </div>
  );
}
