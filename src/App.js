import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id:1, name:"Tsubaki Lip Tint", kanji:"椿", category:"lips", price:3600, color:"#c94a5e", desc:"Camellia oil infusion — sheer to buildable coverage.", badge:"New", img:"https://images.unsplash.com/photo-1597462449349-a07f21b34ddd?w=600&q=80" },
  { id:2, name:"Shiro Porcelain Base", kanji:"白", category:"skin", price:8400, color:"#d4a882", desc:"Translucent brightening foundation with fermented rice water.", badge:null, img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80" },
  { id:3, name:"Sakura Blush Petal", kanji:"桜", category:"cheeks", price:5200, color:"#e8a4b4", desc:"Pressed powder with cherry blossom extract.", badge:"Limited", img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80" },
  { id:4, name:"Sumi Liner", kanji:"墨", category:"eyes", price:2800, color:"#2c1f2e", desc:"Carbon-ink precision brush liner.", badge:null, img:"https://images.unsplash.com/photo-1597225350999-7683f92ba187?w=600&q=80" },
  { id:5, name:"Kiri Mist", kanji:"霧", category:"skin", price:6200, color:"#a8d4e8", desc:"Morning fog facial mist with sake lees.", badge:"New", img:"https://images.unsplash.com/photo-1670201203284-4ede7f0e7cf8?w=600&q=80" },
  { id:6, name:"Momiji Eye Shadow", kanji:"紅葉", category:"eyes", price:7400, color:"#b85a30", desc:"Autumn maple palette — eight pressed shadows.", badge:null, img:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80" },
  { id:7, name:"Ume Plum Gloss", kanji:"梅", category:"lips", price:3200, color:"#7a3050", desc:"Plum extract high-shine gloss.", badge:null, img:"https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80" },
  { id:8, name:"Tsuki Highlighter", kanji:"月", category:"cheeks", price:4800, color:"#e8c880", desc:"Moonlight pearl highlighter with mica.", badge:"Bestseller", img:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80" },
];

const RITUAL_STEPS = [
  { num:"一", title:"Cleanse", time:"2 min", kanji:"洗", product:"Yuzu Enzyme Cleansing Balm", desc:"Begin with dry hands on dry skin. Massage a fingertip of balm in slow, circular motions — temples to chin. Feel the enzymes gently dissolving the day.", img:"https://images.unsplash.com/photo-1635906131748-1c05a836db24?w=700&q=80" },
  { num:"二", title:"Mist", time:"30 sec", kanji:"霧", product:"Kiri Mist", desc:"Hold 20cm from the face. Close your eyes. Mist in a slow figure-eight motion. Do not rub — let the sake lees settle naturally. Breathe.", img:"https://images.unsplash.com/photo-1617182700058-e493c8dd98da?w=700&q=80" },
  { num:"三", title:"Prepare", time:"1 min", kanji:"備", product:"Shiro Porcelain Base", desc:"Dot five points — forehead, nose, both cheeks, chin. Use the warmth of your ring finger to press the base into skin rather than dragging.", img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&q=80" },
  { num:"四", title:"Define", time:"1 min", kanji:"描", product:"Sumi Liner", desc:"Rest your elbow on a steady surface. Draw from the inner corner outward in one fluid stroke. The carbon pigment sets in seconds.", img:"https://images.unsplash.com/photo-1608836363542-8b53d9db153e?w=700&q=80" },
  { num:"五", title:"Bloom", time:"30 sec", kanji:"咲", product:"Sakura Blush Petal", desc:"Smile softly. Apply to the apple of the cheek with a light, lifting stroke toward the temple. The cherry extract gives a genuine flush.", img:"https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=700&q=80" },
  { num:"六", title:"Adorn", time:"30 sec", kanji:"紅", product:"Tsubaki Lip Tint", desc:"The final act. Apply from the centre outward. Press lips together once. The camellia oil will keep lips supple through the day.", img:"https://images.unsplash.com/photo-1597462449349-a07f21b34ddd?w=700&q=80" },
];

const INGREDIENTS = [
  { kanji:"椿", name:"Camellia Oil", origin:"Kyushu, Japan", color:"#c94a5e", desc:"Cold-pressed from Camellia japonica seeds. Rich in oleic acid, it mimics the skin's own sebum — absorbing instantly without residue.", img:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&q=80" },
  { kanji:"米", name:"Fermented Rice Water", origin:"Niigata Prefecture", color:"#b8874a", desc:"Sake-grade rice fermented 90 days in cedar vats. Produces kojic acid and ferulic acid — brightening skin and refining pores.", img:"https://images.unsplash.com/photo-1704916029292-ec7b5976204c?w=700&q=80" },
  { kanji:"桜", name:"Cherry Blossom Extract", origin:"Yoshino, Nara", color:"#e8a4b4", desc:"Harvested at peak hanami season. Quercetin and kaempferol soothe redness and deliver a natural, dewy flush.", img:"https://images.unsplash.com/photo-1522383225653-ed111181a951?w=700&q=80" },
  { kanji:"柚", name:"Yuzu Enzyme Complex", origin:"Kochi Prefecture", color:"#b8874a", desc:"Three times more vitamin C than lemon. Cold-enzyme process preserves active acids — gently dissolving dead cells.", img:"https://images.unsplash.com/photo-1611774257550-d8389aca161c?w=700&q=80" },
  { kanji:"真珠", name:"Freshwater Pearl Powder", origin:"Lake Biwa, Shiga", color:"#f0d8b0", desc:"Finely milled to 1-micron particles. Reflects light across multiple angles — creating inner luminosity.", img:"https://images.unsplash.com/photo-1515688594390-b649af70d282?w=700&q=80" },
  { kanji:"墨", name:"Carbon Black Pigment", origin:"Nara Prefecture", color:"#2c1f2e", desc:"Pine-soot carbon used in traditional sumi ink for a thousand years. Particle size controlled to 200nm.", img:"https://images.unsplash.com/photo-1680244169777-a3d7d758a264?w=700&q=80" },
];

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i, x: Math.random() * 100, delay: Math.random() * 8,
  duration: 10 + Math.random() * 8, size: 8 + Math.random() * 14, drift: (Math.random() - 0.5) * 120,
}));

const C = { plum:"#5c2d3e", rouge:"#c94a5e", gold:"#b8874a", cream:"#fdf8f4", pale:"#f7f0eb", mist:"#e8ddd4", ink:"#1a1410" };

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function Petal({ x, delay, duration, size, drift }) {
  return (
    <motion.div
      style={{ position:"absolute", top:-40, left:`${x}%`, width:size, height:size*1.3, borderRadius:"60% 5% 60% 5%", background:"linear-gradient(135deg, rgba(201,74,94,0.18), rgba(232,164,180,0.10))", pointerEvents:"none", zIndex:0 }}
      animate={{ y:["0vh","110vh"], x:[0,drift], rotate:[0,180], opacity:[0,0.7,0.5,0] }}
      transition={{ duration, delay, repeat:Infinity, ease:"linear" }}
    />
  );
}

function Marquee() {
  const items = ["椿 Camellia","桜 Sakura","霧 Mist","墨 Sumi","紅葉 Momiji","梅 Plum","月 Tsuki","美 Beauty"];
  return (
    <div style={{ overflow:"hidden", borderTop:`0.5px solid ${C.mist}`, borderBottom:`0.5px solid ${C.mist}`, padding:"1.2rem 0", background:C.pale }}>
      <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:24, repeat:Infinity, ease:"linear" }}
        style={{ display:"flex", gap:"3rem", whiteSpace:"nowrap" }}>
        {[...items,...items].map((item,i) => (
          <span key={i} style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"0.85rem", color:C.plum, opacity:0.5, letterSpacing:"0.2em" }}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

function ProductCard({ product, index, onOpen }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-60px" }} transition={{ duration:0.7, delay:index*0.08, ease:[0.22,1,0.36,1] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(product)} style={{ cursor:"pointer" }}>
      <div style={{ aspectRatio:"3/4", overflow:"hidden", marginBottom:"1.2rem", position:"relative", background:product.color+"15" }}>
        <motion.img src={product.img} alt={product.name}
          animate={{ scale:hovered ? 1.06 : 1 }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        <motion.div animate={{ opacity:hovered ? 1 : 0 }} transition={{ duration:0.4 }}
          style={{ position:"absolute", inset:0, background:`linear-gradient(to top, ${product.color}44 0%, transparent 60%)` }} />
        <motion.div animate={{ opacity:hovered ? 1 : 0, y:hovered ? 0 : 12 }} transition={{ duration:0.4 }}
          style={{ position:"absolute", bottom:"1rem", right:"1rem", fontFamily:"'Shippori Mincho', serif", fontSize:"3rem", color:"white", lineHeight:1, textShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
          {product.kanji}
        </motion.div>
        {product.badge && <div style={{ position:"absolute", top:10, left:10, background:product.badge==="Limited" ? C.gold : C.rouge, color:"white", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 10px", fontFamily:"'Cormorant Garamond', serif" }}>{product.badge}</div>}
      </div>
      <motion.div animate={{ y:hovered ? -3 : 0 }} transition={{ duration:0.3 }}>
        <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:C.plum, marginBottom:"0.25rem" }}>{product.name}</div>
        <div style={{ fontSize:"0.82rem", color:C.ink, opacity:0.5, fontWeight:300, marginBottom:"0.4rem" }}>{product.desc}</div>
        <div style={{ fontSize:"1rem", color:C.rouge }}>¥{product.price.toLocaleString()}</div>
      </motion.div>
    </motion.div>
  );
}

function ProductModal({ product, onClose }) {
  const [shade, setShade] = useState(0);
  const shades = product ? [product.color,"#e8a4b4","#8b2a3a","#d4785e"] : [];
  if (!product) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose}
        style={{ position:"fixed", inset:0, background:"rgba(26,20,16,0.45)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", backdropFilter:"blur(4px)" }}>
        <motion.div
          initial={{ opacity:0, y:48, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:48, scale:0.96 }}
          transition={{ type:"spring", damping:28, stiffness:260 }}
          onClick={e => e.stopPropagation()}
          style={{ background:C.cream, maxWidth:680, width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden", boxShadow:"0 40px 80px rgba(92,45,62,0.15)" }}>
          <div style={{ position:"relative", overflow:"hidden", minHeight:380 }}>
            <motion.img key={shade} initial={{ scale:1.08, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.5 }}
              src={product.img} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:`${shades[shade]}22` }} />
            <motion.div key={`shade-${shade}`} initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
              style={{ position:"absolute", bottom:"1.5rem", left:"1.5rem", width:52, height:52, borderRadius:"50%", background:shades[shade], boxShadow:"0 8px 24px rgba(0,0,0,0.18)", border:"2px solid rgba(255,255,255,0.6)" }} />
          </div>
          <div style={{ padding:"2.5rem", position:"relative" }}>
            <button onClick={onClose} style={{ position:"absolute", top:"1rem", right:"1rem", background:"none", border:"none", fontSize:"1.2rem", cursor:"pointer", color:C.plum, opacity:0.5 }}>✕</button>
            <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.6rem", color:C.plum, marginBottom:"0.3rem" }}>{product.name}</div>
            <div style={{ fontSize:"1.3rem", color:C.rouge, marginBottom:"1rem" }}>¥{product.price.toLocaleString()}</div>
            <div style={{ fontSize:"0.9rem", lineHeight:1.8, color:C.ink, opacity:0.6, fontWeight:300, marginBottom:"1.5rem" }}>{product.desc}</div>
            <div style={{ fontSize:"0.65rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.6rem" }}>Select shade</div>
            <div style={{ display:"flex", gap:"0.6rem", marginBottom:"2rem" }}>
              {shades.map((s,i) => (
                <motion.div key={i} whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }} onClick={() => setShade(i)}
                  style={{ width:28, height:28, borderRadius:"50%", background:s, cursor:"pointer", border:shade===i ? `2px solid ${C.plum}` : "2px solid transparent", outline:shade===i ? `2px solid ${C.cream}` : "none", outlineOffset:-2 }} />
              ))}
            </div>
            <motion.button whileHover={{ background:C.rouge }} whileTap={{ scale:0.97 }}
              style={{ background:C.plum, color:C.cream, padding:"0.85rem", width:"100%", border:"none", fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.3s" }}>
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function RitualsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const step = RITUAL_STEPS[activeStep];
  return (
    <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
      {/* Hero */}
      <div style={{ background:C.plum, padding:"6rem 3rem 5rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:"-2rem", top:"-4rem", fontFamily:"'Shippori Mincho', serif", fontSize:"22rem", color:"rgba(255,255,255,0.04)", lineHeight:1, pointerEvents:"none" }}>儀</div>
        <motion.span initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ fontSize:"0.7rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"#e8a0ae", display:"block", marginBottom:"1rem" }}>— Morning Practice</motion.span>
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"3.5rem", color:C.cream, lineHeight:1.1, marginBottom:"1.5rem" }}>
          The Six-Step<br /><em style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", color:"#e8a0ae", fontSize:"2.8rem" }}>Shōbi Ritual</em>
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          style={{ color:C.mist, fontSize:"1.05rem", lineHeight:1.8, fontWeight:300, maxWidth:520, opacity:0.8 }}>
          Each step is a deliberate pause — not a routine to rush through, but a sequence of small attentions that become a kind of knowledge.
        </motion.p>
      </div>

      {/* Step explorer */}
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", minHeight:"70vh" }}>
        <div style={{ background:C.pale, borderRight:`0.5px solid ${C.mist}`, padding:"2rem 0" }}>
          {RITUAL_STEPS.map((s,i) => (
            <motion.div key={i} onClick={() => setActiveStep(i)} whileHover={{ x:4 }}
              style={{ padding:"1.2rem 2rem", cursor:"pointer", borderLeft:activeStep===i ? `3px solid ${C.rouge}` : "3px solid transparent", background:activeStep===i ? "rgba(201,74,94,0.05)" : "transparent", transition:"background 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <span style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.4rem", color:activeStep===i ? C.rouge : C.plum, opacity:activeStep===i ? 1 : 0.4 }}>{s.num}</span>
                <div>
                  <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"0.95rem", color:C.plum }}>{s.title}</div>
                  <div style={{ fontSize:"0.72rem", color:C.gold, letterSpacing:"0.1em" }}>{s.time}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeStep}
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
            transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
            style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
            <div style={{ padding:"3.5rem" }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:"1rem", marginBottom:"0.5rem" }}>
                <span style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"3rem", color:C.rouge }}>{step.num}</span>
                <span style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.8rem", color:C.plum }}>{step.title}</span>
              </div>
              <div style={{ fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.5rem" }}>{step.product}</div>
              <div style={{ width:40, height:0.5, background:C.mist, margin:"1.2rem 0" }} />
              <p style={{ fontSize:"1.05rem", lineHeight:1.9, color:C.ink, opacity:0.7, fontWeight:300, marginBottom:"2rem" }}>{step.desc}</p>
              <div style={{ display:"flex", gap:"0.8rem" }}>
                {activeStep > 0 && <button onClick={() => setActiveStep(s => s-1)} style={{ background:"transparent", color:C.plum, padding:"0.85rem 1.8rem", border:`0.5px solid ${C.plum}`, fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>← Previous</button>}
                {activeStep < RITUAL_STEPS.length-1
                  ? <button onClick={() => setActiveStep(s => s+1)} style={{ background:C.plum, color:C.cream, padding:"0.85rem 2rem", border:"none", fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>Next step →</button>
                  : <button style={{ background:C.rouge, color:C.cream, padding:"0.85rem 2rem", border:"none", fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>Shop the ritual →</button>}
              </div>
            </div>
            <div style={{ position:"relative", overflow:"hidden" }}>
              <img src={step.img} alt={step.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(253,248,244,0.3) 0%, transparent 40%)" }} />
              <div style={{ position:"absolute", bottom:"2rem", right:"2rem", fontFamily:"'Shippori Mincho', serif", fontSize:"5rem", color:"rgba(255,255,255,0.15)", lineHeight:1 }}>{step.kanji}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gallery */}
      <div style={{ padding:"4rem 3rem", background:C.cream }}>
        <FadeUp>
          <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2rem", color:C.plum, marginBottom:"2rem" }}>
            <span style={{ display:"block", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.4rem", fontFamily:"'Cormorant Garamond', serif" }}>The setting</span>
            Where ritual happens
          </div>
        </FadeUp>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", height:400 }}>
          <motion.img whileHover={{ scale:1.02 }} transition={{ duration:0.5 }} src="https://images.unsplash.com/photo-1708789715236-e5060618d118?w=900&q=80" alt="Onsen" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          <motion.img whileHover={{ scale:1.02 }} transition={{ duration:0.5 }} src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80" alt="Spa" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        </div>
      </div>
    </motion.div>
  );
}

function IngredientsPage() {
  const [active, setActive] = useState(0);
  const ing = INGREDIENTS[active];
  return (
    <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
      {/* Hero */}
      <div style={{ position:"relative", height:420, overflow:"hidden" }}>
        <img src="https://images.unsplash.com/photo-1680244169777-a3d7d758a264?w=1400&q=80" alt="Ingredients" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(92,45,62,0.88) 0%, rgba(92,45,62,0.3) 60%, transparent 100%)" }} />
        <div style={{ position:"absolute", top:"50%", left:"3rem", transform:"translateY(-50%)" }}>
          <motion.span initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ fontSize:"0.7rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"#e8a0ae", display:"block", marginBottom:"1rem" }}>— What we put in</motion.span>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"3.5rem", color:C.cream, lineHeight:1.1, marginBottom:"1rem" }}>
            六つの素材<br /><em style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", color:"#e8a0ae", fontSize:"2.2rem" }}>Six Ingredients</em>
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
            style={{ color:C.mist, fontSize:"1rem", lineHeight:1.8, fontWeight:300, maxWidth:400, opacity:0.85 }}>
            Every ingredient has a provenance, a reason, and a story. We publish them all.
          </motion.p>
        </div>
      </div>

      {/* Explorer */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
        <div style={{ background:C.pale }}>
          {INGREDIENTS.map((item,i) => (
            <motion.div key={i} onClick={() => setActive(i)} whileHover={{ x:4 }}
              style={{ display:"flex", gap:"1.5rem", padding:"1.5rem 2.5rem", cursor:"pointer", borderBottom:`0.5px solid ${C.mist}`, background:active===i ? C.cream : "transparent", borderLeft:active===i ? `3px solid ${item.color}` : "3px solid transparent", transition:"background 0.2s, border-color 0.2s", alignItems:"center" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", overflow:"hidden", flexShrink:0 }}>
                <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:C.plum, marginBottom:"0.1rem" }}>{item.name}</div>
                <div style={{ fontSize:"0.72rem", color:C.gold, letterSpacing:"0.1em" }}>{item.origin}</div>
              </div>
              <div style={{ marginLeft:"auto", fontFamily:"'Shippori Mincho', serif", fontSize:"1.5rem", color:item.color, opacity:active===i ? 1 : 0.6, transition:"opacity 0.2s" }}>{item.kanji}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
              style={{ height:"100%", display:"flex", flexDirection:"column" }}>
              <div style={{ flex:"0 0 55%", overflow:"hidden", position:"relative" }}>
                <motion.img initial={{ scale:1.08 }} animate={{ scale:1 }} transition={{ duration:0.6 }}
                  src={ing.img} alt={ing.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", bottom:"1.5rem", right:"1.5rem", fontFamily:"'Shippori Mincho', serif", fontSize:"5rem", color:ing.color, opacity:0.75, lineHeight:1 }}>{ing.kanji}</div>
              </div>
              <div style={{ flex:1, padding:"2.5rem", background:C.cream }}>
                <div style={{ fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase", color:ing.color, marginBottom:"0.5rem" }}>{ing.origin}</div>
                <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.6rem", color:C.plum, marginBottom:"1rem" }}>{ing.name}</div>
                <p style={{ fontSize:"0.95rem", lineHeight:1.9, color:C.ink, opacity:0.65, fontWeight:300 }}>{ing.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sourcing pledge */}
      <div style={{ background:C.plum, padding:"4rem 3rem", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2rem" }}>
        {[["100%","Natural origin","Every ingredient comes from a plant, mineral, or fermented source."],["90-day","Fermentation minimum","Rice water and sake lees fermented in traditional cedar vats."],["Single-origin","Traceable sourcing","We publish the prefecture, farm, and harvest season every year."]].map(([num,title,desc]) => (
          <motion.div key={title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2rem", color:"#e8a0ae", marginBottom:"0.5rem" }}>{num}</div>
            <div style={{ fontSize:"0.8rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.cream, marginBottom:"0.8rem" }}>{title}</div>
            <p style={{ fontSize:"0.9rem", lineHeight:1.8, color:C.mist, opacity:0.7, fontWeight:300 }}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PhilosophyPage() {
  return (
    <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
      {/* Opening */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"88vh" }}>
        <div style={{ padding:"6rem 4rem 6rem 3rem", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <motion.span initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ fontSize:"0.7rem", letterSpacing:"0.45em", textTransform:"uppercase", color:C.rouge, display:"block", marginBottom:"1.5rem" }}>— Our belief</motion.span>
          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"3.8rem", color:C.plum, lineHeight:1.1, marginBottom:"2rem" }}>
            美は<br />儀式である<br /><em style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:"2.5rem", color:C.rouge }}>Beauty is ritual</em>
          </motion.h1>
          <div style={{ width:40, height:0.5, background:C.mist, margin:"0.5rem 0 2rem" }} />
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
            style={{ fontSize:"1.1rem", lineHeight:1.9, color:C.ink, opacity:0.65, fontWeight:300, maxWidth:440 }}>
            We founded Shōbi with one conviction: that the act of applying makeup is not vanity — it is attention. A daily practice of noticing your own face, your own light.
          </motion.p>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
            style={{ fontSize:"1.05rem", lineHeight:1.9, color:C.ink, opacity:0.5, fontWeight:300, maxWidth:440, marginTop:"1.2rem" }}>
            We make products for people who understand the difference between a routine and a ritual.
          </motion.p>
        </div>
        {/* Two staggered images */}
        <FadeIn delay={0.2}>
          <div style={{ position:"relative", padding:"3rem 3rem 3rem 1rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", alignItems:"start" }}>
            <div style={{ aspectRatio:"3/4", overflow:"hidden" }}>
              <img src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80" alt="Makeup palette" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
            <div style={{ aspectRatio:"3/4", overflow:"hidden", marginTop:"3rem" }}>
              <img src="https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=600&q=80" alt="Woman with flower" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
            <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
              style={{ position:"absolute", top:"1rem", right:"2rem", fontFamily:"'Shippori Mincho', serif", fontSize:"6rem", color:C.plum, opacity:0.06, lineHeight:1 }}>美</motion.div>
          </div>
        </FadeIn>
      </div>

      {/* Three pillars */}
      <div style={{ background:C.pale, padding:"5rem 3rem" }}>
        <div style={{ textAlign:"center", marginBottom:"4rem" }}>
          <span style={{ display:"block", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.4rem", fontFamily:"'Cormorant Garamond', serif" }}>What guides us</span>
          <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2.2rem", color:C.plum }}>Three Pillars</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"3rem" }}>
          {[
            { kanji:"誠", title:"Sincerity", img:"https://images.unsplash.com/photo-1736348877782-fa7ae2a9bd69?w=600&q=80", desc:"We do not use marketing language. Our ingredient lists are published in full. Sincerity is our only marketing strategy." },
            { kanji:"技", title:"Craft", img:"https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&q=80", desc:"Each product is made in small batches in Kyoto by a team of four. The craft is not the means — it is the point." },
            { kanji:"間", title:"Ma — Negative Space", img:"https://images.unsplash.com/photo-1551738286-25588169b2d7?w=600&q=80", desc:"The Japanese concept of ma — the meaningful pause. What we leave out matters as much as what we put in." },
          ].map((p,i) => (
            <motion.div key={p.title} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}>
              <div style={{ aspectRatio:"4/3", overflow:"hidden", marginBottom:"1.5rem", position:"relative" }}>
                <motion.img whileHover={{ scale:1.04 }} transition={{ duration:0.5 }}
                  src={p.img} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", bottom:"1rem", right:"1rem", fontFamily:"'Shippori Mincho', serif", fontSize:"2.5rem", color:"rgba(255,255,255,0.5)" }}>{p.kanji}</div>
              </div>
              <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.3rem", color:C.plum, marginBottom:"0.8rem" }}>{p.title}</div>
              <p style={{ fontSize:"0.95rem", lineHeight:1.8, color:C.ink, opacity:0.6, fontWeight:300 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Founder quote */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
        <div style={{ position:"relative", overflow:"hidden", minHeight:500 }}>
          <img src="https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?w=900&q=80" alt="Founder" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        </div>
        <div style={{ background:C.plum, padding:"5rem 4rem", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"4rem", color:"rgba(255,255,255,0.1)", lineHeight:1, marginBottom:"1rem" }}>"</div>
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:"1.4rem", lineHeight:1.7, color:C.cream, fontWeight:300, marginBottom:"2rem" }}>
            I wanted to make something that would slow people down. Not a five-step routine — a five-minute meditation.
          </p>
          <div style={{ width:40, height:0.5, background:"rgba(255,255,255,0.2)", marginBottom:"1.5rem" }} />
          <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:"#e8a0ae" }}>Michiko Saito</div>
          <div style={{ fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.mist, opacity:0.5, marginTop:"0.3rem" }}>Founder, Shōbi Beauty — Kyoto 2018</div>
        </div>
      </div>

      {/* Values */}
      <div style={{ padding:"5rem 3rem", background:C.cream }}>
        <div style={{ marginBottom:"3rem" }}>
          <span style={{ display:"block", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.4rem", fontFamily:"'Cormorant Garamond', serif" }}>Our commitments</span>
          <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2rem", color:C.plum }}>What we stand for</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", border:`0.5px solid ${C.mist}` }}>
          {[["🌿","Vegan","Every product. No animal-derived ingredients, ever."],["🚫","Cruelty-free","Never tested on animals and never will."],["♻️","Refillable","All glass packaging designed for refill, not landfill."],["🇯🇵","Made in Kyoto","Small-batch, never outsourced, never scaled."]].map(([icon,title,desc],i) => (
            <motion.div key={title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              style={{ padding:"2rem", borderRight:i<3 ? `0.5px solid ${C.mist}` : "none" }}>
              <div style={{ fontSize:"1.5rem", marginBottom:"0.8rem" }}>{icon}</div>
              <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:C.plum, marginBottom:"0.5rem" }}>{title}</div>
              <p style={{ fontSize:"0.85rem", lineHeight:1.7, color:C.ink, opacity:0.5, fontWeight:300 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

// ─── FOOTER PAGES ────────────────────────────────────────────────────────────

function SimpleFooterPage({ title, kanji, children }) {
  return (
    <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
      <div style={{ background:C.plum, padding:"5rem 3rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:"-1rem", top:"-3rem", fontFamily:"'Shippori Mincho', serif", fontSize:"18rem", color:"rgba(255,255,255,0.04)", lineHeight:1, pointerEvents:"none" }}>{kanji}</div>
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"3rem", color:C.cream, marginBottom:"0.5rem" }}>{title}</motion.h1>
      </div>
      <div style={{ maxWidth:760, margin:"0 auto", padding:"5rem 3rem" }}>{children}</div>
    </motion.div>
  );
}

const prose = { fontSize:"1rem", lineHeight:1.9, color:"#1a1410", opacity:0.7, fontWeight:300, marginBottom:"1.5rem" };
const h2 = { fontFamily:"'Shippori Mincho', serif", fontSize:"1.4rem", color:"#5c2d3e", marginBottom:"0.8rem", marginTop:"2.5rem" };
const rule = { border:"none", borderTop:"0.5px solid #e8ddd4", margin:"2rem 0" };

function PrivacyPage() {
  return (
    <SimpleFooterPage title="Privacy Policy" kanji="私">
      <p style={prose}>Last updated: June 2026. Shōbi Beauty Holdings, Inc. ("Shōbi", "we", "us") is committed to protecting your personal information. This policy describes how we collect, use, and safeguard data when you visit our website or make a purchase.</p>
      <hr style={rule} />
      <h2 style={h2}>Information We Collect</h2>
      <p style={prose}>We collect information you provide directly — name, email address, delivery address, and payment details when you place an order. We also collect usage data automatically, including browser type, pages visited, and time spent on the site, to improve your experience.</p>
      <h2 style={h2}>How We Use Your Information</h2>
      <p style={prose}>Your information is used solely to process orders, send order confirmations, and provide customer support. We do not sell, rent, or share your personal data with third parties for marketing purposes. Payment details are processed via encrypted third-party processors and are never stored on our servers.</p>
      <h2 style={h2}>Cookies</h2>
      <p style={prose}>We use essential cookies to maintain your session and remember cart contents. We do not use advertising or tracking cookies. You may disable cookies in your browser settings, though some site functionality may be affected.</p>
      <h2 style={h2}>Data Retention</h2>
      <p style={prose}>Order records are retained for seven years in accordance with Japanese tax law. You may request deletion of your account and associated data at any time by contacting us at privacy@shobi-beauty.com.</p>
      <h2 style={h2}>Your Rights</h2>
      <p style={prose}>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us at privacy@shobi-beauty.com. We will respond within 30 days.</p>
      <h2 style={h2}>Contact</h2>
      <p style={prose}>Shōbi Beauty Holdings, Inc. · 1-1 Gion-machi, Higashiyama-ku, Kyoto 605-0073, Japan · privacy@shobi-beauty.com</p>
    </SimpleFooterPage>
  );
}

function SustainabilityPage() {
  return (
    <SimpleFooterPage title="Sustainability" kanji="自">
      <p style={prose}>Sustainability at Shōbi is not a marketing position — it is an operating constraint. Every decision we make about packaging, ingredients, and manufacturing is evaluated against its environmental impact before its commercial appeal.</p>
      <hr style={rule} />
      <h2 style={h2}>Packaging</h2>
      <p style={prose}>All primary packaging is hand-blown glass, designed to be refilled indefinitely. Refill pouches are made from 100% post-consumer recycled materials and are curbside recyclable. We eliminated single-use plastic from our supply chain in 2022.</p>
      <h2 style={h2}>Ingredients</h2>
      <p style={prose}>Every botanical ingredient is sourced from farms we visit personally. Camellia seeds are cold-pressed in Kyushu using solar-powered equipment. Cherry blossom extract is harvested at peak bloom by hand — no mechanical stripping, no waste. Fermentation is powered entirely by ambient temperature in our cedar vats.</p>
      <h2 style={h2}>Manufacturing</h2>
      <p style={prose}>Our Kyoto atelier has operated on 100% renewable electricity since 2023. We produce in batches of 200 units — small enough that unsold stock is never an issue. We have never incinerated or landfilled a product.</p>
      <h2 style={h2}>Carbon</h2>
      <p style={prose}>We measure our Scope 1, 2, and 3 emissions annually and publish the results on this page each January. Our 2025 total was 4.2 tonnes CO₂e. We offset 200% of this through verified reforestation projects in Nara Prefecture — the same region where our carbon black pigment originates.</p>
      <h2 style={h2}>What We Are Still Working On</h2>
      <p style={prose}>International shipping remains our largest unsolved emissions problem. We are currently piloting a sea-freight programme for European orders and expect to reduce air freight by 60% by the end of 2026. We will update this page when that programme launches.</p>
    </SimpleFooterPage>
  );
}

function PressPage() {
  const coverage = [
    { pub:"Vogue Japan", date:"March 2026", title:"The Ten Indie Beauty Brands Redefining Japanese Skincare", quote:"Shōbi's refusal to scale is its greatest asset — every product feels made for you specifically." },
    { pub:"Wallpaper*", date:"January 2026", title:"The New Kyoto Ateliers", quote:"A brand that treats the morning routine as a design problem worth solving with the same rigour as architecture." },
    { pub:"Monocle", date:"October 2025", title:"Japan's Quiet Beauty Revolution", quote:"Where most brands shout, Shōbi whispers — and somehow, you hear it more clearly." },
    { pub:"The Business of Fashion", date:"August 2025", title:"Small Batch, Big Impact: The Micro-Beauty Brands Outperforming Giants", quote:"Shōbi's conversion rate is triple the industry average. The product does the marketing." },
    { pub:"Kinfolk", date:"May 2025", title:"Ritual as Resistance", quote:"Founder Michiko Saito has built something rare: a beauty brand that actually slows you down." },
  ];
  return (
    <SimpleFooterPage title="Press" kanji="報">
      <p style={prose}>For press enquiries, review samples, or interview requests, please contact our communications team at press@shobi-beauty.com. We aim to respond within two business days.</p>
      <hr style={rule} />
      <h2 style={h2}>Recent Coverage</h2>
      {coverage.map((c, i) => (
        <div key={i} style={{ padding:"1.5rem 0", borderBottom:`0.5px solid #e8ddd4` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"0.4rem" }}>
            <span style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:"#5c2d3e" }}>{c.pub}</span>
            <span style={{ fontSize:"0.72rem", color:"#b8874a", letterSpacing:"0.1em" }}>{c.date}</span>
          </div>
          <div style={{ fontSize:"0.9rem", color:"#1a1410", opacity:0.7, marginBottom:"0.5rem", fontStyle:"italic" }}>{c.title}</div>
          <div style={{ fontSize:"0.88rem", lineHeight:1.7, color:"#1a1410", opacity:0.55, fontWeight:300 }}>"{c.quote}"</div>
        </div>
      ))}
      <div style={{ marginTop:"2.5rem", padding:"2rem", background:"#f7f0eb" }}>
        <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:"#5c2d3e", marginBottom:"0.4rem" }}>Press contact</div>
        <p style={{ ...prose, marginBottom:0 }}>press@shobi-beauty.com · +81 75 000 0000<br />Shōbi Beauty Holdings, Inc. · Kyoto, Japan</p>
      </div>
    </SimpleFooterPage>
  );
}

function StockistsPage() {
  const stores = [
    { region:"Japan", locations:[{ name:"Shōbi Kyoto Flagship", address:"1-1 Gion-machi, Higashiyama-ku, Kyoto", hours:"10:00 – 18:00 daily" },{ name:"Isetan Shinjuku", address:"3-14-1 Shinjuku, Tokyo", hours:"10:30 – 20:00 daily" },{ name:"Hankyu Umeda", address:"8-7 Kakudacho, Kita-ku, Osaka", hours:"10:00 – 20:00 daily" }] },
    { region:"United Kingdom", locations:[{ name:"Liberty London", address:"Regent Street, London W1B 5AH", hours:"10:00 – 20:00 Mon–Sat, 11:30 – 18:00 Sun" },{ name:"Space NK — Marylebone", address:"307 Westbourne Grove, London W11 2QA", hours:"10:00 – 18:00 Mon–Sat" }] },
    { region:"United States", locations:[{ name:"Cos Bar — Aspen", address:"205 S Galena St, Aspen CO 81611", hours:"10:00 – 18:00 daily" },{ name:"Credo Beauty — San Francisco", address:"2136 Fillmore St, San Francisco CA 94115", hours:"11:00 – 19:00 daily" }] },
    { region:"France", locations:[{ name:"Merci — Paris", address:"111 Boulevard Beaumarchais, 75003 Paris", hours:"10:00 – 19:00 Mon–Sat" }] },
  ];
  return (
    <SimpleFooterPage title="Stockists" kanji="店">
      <p style={prose}>Shōbi is available at a carefully selected number of retailers who share our commitment to considered beauty. We do not sell through large chain pharmacies or mass-market platforms.</p>
      <p style={prose}>For wholesale enquiries, please contact trade@shobi-beauty.com.</p>
      <hr style={rule} />
      {stores.map((region, i) => (
        <div key={i} style={{ marginBottom:"2.5rem" }}>
          <h2 style={{ ...h2, marginTop: i === 0 ? 0 : "2.5rem" }}>{region.region}</h2>
          {region.locations.map((loc, j) => (
            <div key={j} style={{ padding:"1.2rem 0", borderBottom:`0.5px solid #e8ddd4` }}>
              <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:"#5c2d3e", marginBottom:"0.3rem" }}>{loc.name}</div>
              <div style={{ fontSize:"0.85rem", color:"#1a1410", opacity:0.55, fontWeight:300, marginBottom:"0.2rem" }}>{loc.address}</div>
              <div style={{ fontSize:"0.75rem", color:"#b8874a", letterSpacing:"0.05em" }}>{loc.hours}</div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ marginTop:"2rem", padding:"2rem", background:"#f7f0eb" }}>
        <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:"#5c2d3e", marginBottom:"0.4rem" }}>Wholesale enquiries</div>
        <p style={{ ...prose, marginBottom:0 }}>trade@shobi-beauty.com · Minimum opening order ¥150,000</p>
      </div>
    </SimpleFooterPage>
  );
}

export default function ShobiAnimated() {
  const [page, setPage] = useState("collections");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [navScrolled, setNavScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const heroY = useTransform(scrollYProgress, [0,1], ["0%","30%"]);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { window.scrollTo(0,0); }, [page]);

  const filtered = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
  const NAV_PAGES = ["collections","rituals","ingredients","philosophy"];

  return (
    <div style={{ fontFamily:"'Cormorant Garamond', serif", background:C.cream, color:C.ink, overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <motion.nav
        animate={{ background:navScrolled ? "rgba(253,248,244,0.96)" : "transparent", boxShadow:navScrolled ? "0 1px 24px rgba(0,0,0,0.06)" : "none" }}
        transition={{ duration:0.4 }}
        style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.4rem 3rem", backdropFilter:navScrolled ? "blur(12px)" : "none" }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.2 }}
          onClick={() => setPage("collections")}
          style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.4rem", letterSpacing:"0.15em", color:C.plum, cursor:"pointer", userSelect:"none" }}>
          粧美<span style={{ display:"block", fontSize:"0.58rem", letterSpacing:"0.4em", color:C.gold, fontFamily:"'Cormorant Garamond', serif", fontWeight:300, textTransform:"uppercase", marginTop:1 }}>Shōbi Beauty</span>
        </motion.div>
        <motion.ul initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3 }}
          style={{ display:"flex", gap:"2.5rem", listStyle:"none", margin:0, padding:0 }}>
          {NAV_PAGES.map(p => (
            <li key={p}>
              <motion.a onClick={() => setPage(p)} whileHover={{ opacity:1, y:-1 }}
                style={{ textDecoration:"none", fontSize:"0.78rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.ink, opacity:page===p ? 1 : 0.5, cursor:"pointer", display:"block", borderBottom:page===p ? `1px solid ${C.rouge}` : "none", paddingBottom:2, transition:"opacity 0.2s" }}>
                {p}
              </motion.a>
            </li>
          ))}
        </motion.ul>
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.4 }}
          style={{ fontSize:"1.3rem", cursor:"pointer", color:C.plum }}>🛍</motion.div>
      </motion.nav>

      {/* ── PAGES ── */}
      <AnimatePresence mode="wait">
        {page !== "collections" ? (
          <motion.div key={page} style={{ paddingTop:"80px" }}>
            {page === "rituals" && <RitualsPage />}
            {page === "ingredients" && <IngredientsPage />}
            {page === "philosophy" && <PhilosophyPage />}
            {page === "privacy" && <PrivacyPage />}
            {page === "sustainability" && <SustainabilityPage />}
            {page === "press" && <PressPage />}
            {page === "stockists" && <StockistsPage />}
            <footer style={{ background:C.pale, padding:"2rem 3rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`0.5px solid ${C.mist}` }}>
              <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"0.9rem", color:C.plum, opacity:0.5, letterSpacing:"0.15em" }}>粧美 Shōbi Beauty — Kyoto © 2026</div>
              <div style={{ display:"flex", gap:"2rem" }}>
                {["Privacy","Sustainability","Press","Stockists"].map(l => (
                  <motion.a key={l} onClick={() => setPage(l.toLowerCase())} whileHover={{ opacity:0.8, y:-1 }} style={{ fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.plum, opacity:0.4, textDecoration:"none", cursor:"pointer" }}>{l}</motion.a>
                ))}
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div key="collections">
            {/* ── HERO ── */}
            <section ref={heroRef} style={{ position:"relative", height:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
                {PETALS.map(p => <Petal key={p.id} {...p} />)}
              </div>
              <motion.div style={{ position:"absolute", right:"-5%", top:"50%", translateY:"-50%", y:heroY }}
                initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:1.4, ease:[0.22,1,0.36,1] }}>
                <div style={{ width:600, height:600, borderRadius:"50%", background:"linear-gradient(135deg, #f5e0e6 0%, #f7f0eb 50%, #e8c4c9 100%)", opacity:0.5 }} />
              </motion.div>
              <motion.div style={{ position:"absolute", right:"5%", top:"50%", translateY:"-50%", y:heroY }}
                initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} transition={{ duration:1.2, delay:0.4, ease:[0.22,1,0.36,1] }}>
                <div style={{ width:380, height:480, overflow:"hidden", borderRadius:"2px", boxShadow:"0 40px 80px rgba(92,45,62,0.12)" }}>
                  <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80" alt="Hero" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                </div>
                <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
                  style={{ position:"absolute", bottom:"-1.5rem", left:"-3rem", background:C.cream, padding:"1rem 1.4rem", boxShadow:"0 12px 32px rgba(92,45,62,0.1)" }}>
                  <div style={{ fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", color:C.gold }}>Bestseller</div>
                  <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1.1rem", color:C.rouge, margin:"0.2rem 0" }}>Sakura Blush</div>
                  <div style={{ fontSize:"0.8rem", color:C.plum, opacity:0.6 }}>¥5,200</div>
                </motion.div>
              </motion.div>
              <div style={{ position:"relative", zIndex:1, padding:"0 3rem", maxWidth:580 }}>
                <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3 }}
                  style={{ fontSize:"0.7rem", letterSpacing:"0.5em", textTransform:"uppercase", color:C.rouge, marginBottom:"1.5rem" }}>— Spring Collection 2026</motion.p>
                <div style={{ overflow:"hidden", marginBottom:"0.4rem" }}>
                  <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }} transition={{ duration:1, delay:0.4, ease:[0.22,1,0.36,1] }}
                    style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"5rem", color:C.plum, lineHeight:1.05, margin:0 }}>美しさの</motion.h1>
                </div>
                <div style={{ overflow:"hidden", marginBottom:"1.5rem" }}>
                  <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }} transition={{ duration:1, delay:0.55, ease:[0.22,1,0.36,1] }}
                    style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:"4rem", color:C.rouge, lineHeight:1.05, margin:0 }}>Art of Beauty</motion.h1>
                </div>
                <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.7 }}
                  style={{ fontSize:"1.05rem", lineHeight:1.9, color:C.ink, opacity:0.6, maxWidth:400, fontWeight:300, marginBottom:"2.5rem" }}>
                  Rooted in ancient Kyoto rituals, every formula blends botanical wisdom with modern elegance.
                </motion.p>
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.85 }}
                  style={{ display:"flex", gap:"1rem" }}>
                  <motion.button whileHover={{ background:C.rouge, y:-2 }} whileTap={{ scale:0.97 }}
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior:"smooth" })}
                    style={{ background:C.plum, color:C.cream, padding:"0.9rem 2.4rem", border:"none", fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.3s" }}>
                    Explore Collection
                  </motion.button>
                  <motion.button whileHover={{ background:C.plum, color:C.cream, y:-2 }} whileTap={{ scale:0.97 }}
                    onClick={() => setPage("philosophy")}
                    style={{ background:"transparent", color:C.plum, padding:"0.9rem 2rem", border:`0.5px solid ${C.plum}`, fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s" }}>
                    Our Story
                  </motion.button>
                </motion.div>
              </div>
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
                style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem" }}>
                <span style={{ fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.plum, opacity:0.4 }}>Scroll</span>
                <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.5, repeat:Infinity }}
                  style={{ width:1, height:40, background:`linear-gradient(to bottom, ${C.plum}, transparent)`, opacity:0.3 }} />
              </motion.div>
            </section>

            <Marquee />

            {/* ── PHILOSOPHY INTRO ── */}
            <section style={{ padding:"6rem 3rem 3rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }}>
              <FadeUp>
                <span style={{ fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", color:C.gold, display:"block", marginBottom:"1rem" }}>— The philosophy</span>
                <h2 style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"3rem", color:C.plum, lineHeight:1.15, marginBottom:"1.5rem" }}>美は<br />儀式である</h2>
                <p style={{ fontSize:"1.1rem", lineHeight:1.9, color:C.ink, opacity:0.6, fontWeight:300, marginBottom:"1.5rem", maxWidth:420 }}>
                  We make products for people who understand the difference between a routine and a ritual. Beauty as daily meditation.
                </p>
                <motion.a onClick={() => setPage("philosophy")} whileHover={{ x:4 }} style={{ fontSize:"0.78rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.rouge, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"0.5rem" }}>
                  Read our story →
                </motion.a>
              </FadeUp>
              <FadeIn delay={0.2}>
                <div style={{ position:"relative", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", alignItems:"start" }}>
                  <div style={{ aspectRatio:"3/4", overflow:"hidden" }}>
                    <img src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80" alt="Makeup palette" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  </div>
                  <div style={{ aspectRatio:"3/4", overflow:"hidden", marginTop:"2rem" }}>
                    <img src="https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=600&q=80" alt="Woman with flower" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  </div>
                  <div style={{ position:"absolute", top:"1.5rem", left:"-1.5rem", right:"1.5rem", bottom:"-1.5rem", border:`0.5px solid ${C.mist}`, zIndex:-1 }} />
                  <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
                    style={{ position:"absolute", top:"-1.5rem", right:"-1rem", fontFamily:"'Shippori Mincho', serif", fontSize:"5rem", color:C.plum, opacity:0.08, lineHeight:1 }}>美</motion.div>
                </div>
              </FadeIn>
            </section>

            {/* ── PRODUCTS ── */}
            <section id="products" style={{ padding:"5rem 3rem" }}>
              <FadeUp>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2.5rem", borderBottom:`0.5px solid ${C.mist}`, paddingBottom:"1.5rem" }}>
                  <div>
                    <span style={{ display:"block", fontSize:"0.65rem", letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, marginBottom:"0.4rem", fontFamily:"'Cormorant Garamond', serif" }}>Curated for you</span>
                    <h2 style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2rem", color:C.plum, margin:0 }}>旬の品</h2>
                  </div>
                  <div style={{ display:"flex", gap:"0.5rem" }}>
                    {["all","skin","lips","eyes","cheeks"].map(cat => (
                      <motion.button key={cat} whileTap={{ scale:0.95 }} onClick={() => setActiveCategory(cat)}
                        animate={{ background:activeCategory===cat ? C.plum : "transparent", color:activeCategory===cat ? C.cream : C.plum }}
                        transition={{ duration:0.2 }}
                        style={{ border:`0.5px solid ${C.plum}`, padding:"0.35rem 1.1rem", fontFamily:"'Cormorant Garamond', serif", fontSize:"0.78rem", letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>
                        {cat === "all" ? "All" : cat}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </FadeUp>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"2rem" }}>
                {filtered.map((p,i) => <ProductCard key={p.id} product={p} index={i} onOpen={setSelectedProduct} />)}
              </div>
            </section>

            {/* ── RITUAL STRIP ── */}
            <FadeUp>
              <div style={{ margin:"2rem 3rem 5rem", background:C.plum, display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden", minHeight:320 }}>
                <div style={{ padding:"4rem" }}>
                  <span style={{ fontSize:"0.65rem", letterSpacing:"0.35em", textTransform:"uppercase", color:"#e8a0ae", display:"block", marginBottom:"1rem" }}>— Morning practice</span>
                  <h2 style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2.2rem", color:C.cream, lineHeight:1.2, marginBottom:"1rem" }}>
                    The Six-Step<br /><em style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", color:"#e8a0ae", fontSize:"1.8rem" }}>Shōbi Ritual</em>
                  </h2>
                  <p style={{ color:C.mist, fontSize:"0.95rem", lineHeight:1.8, fontWeight:300, marginBottom:"1.8rem", opacity:0.8 }}>
                    A meditative practice from Kyoto's maiko tradition, reimagined for contemporary life.
                  </p>
                  <motion.button whileHover={{ background:"#a83a4e", y:-2 }} whileTap={{ scale:0.97 }}
                    onClick={() => setPage("rituals")}
                    style={{ background:C.rouge, color:C.cream, padding:"0.85rem 2rem", border:"none", fontFamily:"'Cormorant Garamond', serif", fontSize:"0.85rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.3s" }}>
                    Discover the Ritual
                  </motion.button>
                </div>
                <div style={{ position:"relative", overflow:"hidden" }}>
                  <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" alt="Ritual" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity:0.45 }} />
                </div>
              </div>
            </FadeUp>

            {/* ── INGREDIENT TEASER ── */}
            <section style={{ padding:"4rem 3rem 6rem" }}>
              <FadeUp>
                <div style={{ textAlign:"center", marginBottom:"3rem" }}>
                  <span style={{ fontSize:"0.65rem", letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, display:"block", marginBottom:"0.8rem" }}>— What we put in</span>
                  <h2 style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"2.2rem", color:C.plum }}>六つの素材</h2>
                </div>
              </FadeUp>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }}>
                {[
                  { kanji:"椿", name:"Camellia Oil", origin:"Kyushu, Japan", color:"#c94a5e", img:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80" },
                  { kanji:"桜", name:"Cherry Blossom", origin:"Yoshino, Nara", color:"#e8a4b4", img:"https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80" },
                  { kanji:"米", name:"Fermented Rice Water", origin:"Niigata Prefecture", color:"#b8874a", img:"https://images.unsplash.com/photo-1704916029292-ec7b5976204c?w=500&q=80" },
                ].map((ing,i) => (
                  <motion.div key={ing.kanji} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.7 }} whileHover={{ y:-4 }}
                    onClick={() => setPage("ingredients")} style={{ cursor:"pointer" }}>
                    <div style={{ aspectRatio:"3/2", overflow:"hidden", marginBottom:"1rem", position:"relative" }}>
                      <motion.img whileHover={{ scale:1.05 }} transition={{ duration:0.5 }}
                        src={ing.img} alt={ing.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                      <div style={{ position:"absolute", bottom:"1rem", right:"1rem", fontFamily:"'Shippori Mincho', serif", fontSize:"2.5rem", color:"rgba(255,255,255,0.4)", lineHeight:1 }}>{ing.kanji}</div>
                    </div>
                    <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color:ing.color, marginBottom:"0.3rem" }}>{ing.origin}</div>
                    <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"1rem", color:C.plum }}>{ing.name}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            <footer style={{ background:C.pale, padding:"2rem 3rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`0.5px solid ${C.mist}` }}>
              <div style={{ fontFamily:"'Shippori Mincho', serif", fontSize:"0.9rem", color:C.plum, opacity:0.5, letterSpacing:"0.15em" }}>粧美 Shōbi Beauty — Kyoto © 2026</div>
              <div style={{ display:"flex", gap:"2rem" }}>
                {["Privacy","Sustainability","Press","Stockists"].map(l => (
                  <motion.a key={l} onClick={() => setPage(l.toLowerCase())} whileHover={{ opacity:0.8, y:-1 }} style={{ fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.plum, opacity:0.4, textDecoration:"none", cursor:"pointer" }}>{l}</motion.a>
                ))}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
