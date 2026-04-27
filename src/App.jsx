import { useState, useEffect, useRef, useCallback } from "react";

const FORMSPREE = "https://formspree.io/f/meevwrwk";

function useInView(t = 0.14) {
  const [v, setV] = useState(false);
  const r = useRef(null);
  useEffect(() => {
    const el = r.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(el); } }, { threshold: t });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [r, v];
}

function Fade({ children, delay = 0, y = 32, style = {} }) {
  const [r, v] = useInView();
  return (
    <div ref={r} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.9s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.9s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

/* Luminous floating orbs */
function Luminance() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const s = 3 + Math.random() * 4;
        const x = Math.random() * 100;
        const d = 25 + Math.random() * 35;
        const dl = Math.random() * 25;
        const op = 0.04 + Math.random() * 0.07;
        return (
          <div key={i} style={{
            position: "absolute", width: s, height: s, borderRadius: "50%",
            background: "#d4af6a", opacity: op, left: `${x}%`, bottom: "-10px",
            animation: `orbitUp ${d}s linear ${dl}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

function ServiceBlock({ num, title, desc, items, delay = 0 }) {
  const [r, v] = useInView();
  const [h, setH] = useState(false);
  return (
    <div ref={r} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      opacity: v ? 1 : 0,
      transform: v ? (h ? "translateY(-6px)" : "translateY(0)") : "translateY(44px)",
      transition: `all 0.8s cubic-bezier(.22,1,.36,1) ${delay}s`,
      padding: "44px 36px",
      borderRadius: "20px",
      background: h ? "rgba(212,175,106,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${h ? "rgba(212,175,106,0.15)" : "rgba(212,175,106,0.06)"}`,
      cursor: "default",
      flex: "1 1 300px",
      position: "relative",
      overflow: "hidden",
    }}>
      <span style={{
        position: "absolute", top: "14px", right: "22px",
        fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "68px", fontWeight: 400,
        color: "rgba(212,175,106,0.06)", lineHeight: 1, userSelect: "none",
      }}>{num}</span>
      <h3 style={{
        fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "24px", fontWeight: 400,
        color: "#f0ece4", marginBottom: "14px", lineHeight: 1.3, position: "relative",
      }}>{title}</h3>
      <p style={{
        fontFamily: "'Sora',sans-serif", fontSize: "14px", color: "rgba(240,236,228,0.55)",
        lineHeight: 1.85, marginBottom: "22px",
      }}>{desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
            color: "#d4af6a", background: "rgba(212,175,106,0.08)",
            padding: "5px 13px", borderRadius: "100px", letterSpacing: "0.4px",
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function Faq({ q, a, delay = 0 }) {
  const [open, setOpen] = useState(false);
  const [r, v] = useInView();
  return (
    <div ref={r} onClick={() => setOpen(!open)} style={{
      opacity: v ? 1 : 0,
      transition: `opacity 0.7s ease ${delay}s`,
      borderBottom: "1px solid rgba(212,175,106,0.08)",
      padding: "26px 0", cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{
          fontFamily: "'Sora',sans-serif", fontSize: "15.5px", fontWeight: 500,
          color: "#f0ece4", margin: 0, paddingRight: "24px",
        }}>{q}</h4>
        <div style={{
          width: "26px", height: "26px", borderRadius: "50%",
          border: "1px solid rgba(212,175,106,0.2)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
          transition: "all 0.35s", transform: open ? "rotate(180deg)" : "rotate(0)",
          background: open ? "rgba(212,175,106,0.08)" : "transparent",
        }}>
          <span style={{ fontSize: "12px", color: "#d4af6a", lineHeight: 1 }}>↓</span>
        </div>
      </div>
      <div style={{
        maxHeight: open ? "250px" : "0", overflow: "hidden",
        transition: "max-height 0.5s cubic-bezier(.22,1,.36,1)",
      }}>
        <p style={{
          fontFamily: "'Sora',sans-serif", fontSize: "14px", color: "rgba(240,236,228,0.5)",
          lineHeight: 1.85, paddingTop: "16px", margin: 0,
        }}>{a}</p>
      </div>
    </div>
  );
}


export default function Ascend() {
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", type: "individual" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const f = () => setNavSolid(window.scrollY > 50);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Sora:wght@300;400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);

  const go = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const submit = async () => {
    setStatus("sending");
    try {
      const r = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, inquiry_type: form.type }),
      });
      setStatus(r.ok ? "sent" : "error");
      if (r.ok) setForm({ name: "", phone: "", email: "", message: "", type: "individual" });
    } catch { setStatus("error"); }
  };

  const NAV = [
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
  ];

  const inputBase = {
    width: "100%", padding: "16px 0", borderRadius: 0,
    border: "none", borderBottom: "1px solid rgba(212,175,106,0.12)",
    fontFamily: "'Sora',sans-serif", fontSize: "14.5px", color: "#f0ece4",
    outline: "none", background: "transparent", transition: "border-color 0.3s",
  };

  return (
    <div style={{ background: "#0c1220", color: "#f0ece4", overflowX: "hidden", position: "relative" }}>
      <style>{`
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden;background:#0c1220}
        ::selection{background:#d4af6a;color:#0c1220}
        input::placeholder,textarea::placeholder{color:rgba(212,175,106,0.25)}
        @keyframes orbitUp{0%{transform:translateY(0) translateX(0);opacity:0}8%{opacity:1}92%{opacity:1}100%{transform:translateY(-115vh) translateX(20px);opacity:0}}
        @keyframes breatheLine{0%,100%{opacity:0.6;transform:scaleX(1)}50%{opacity:0.25;transform:scaleX(0.5)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 40px rgba(212,175,106,0.06)}50%{box-shadow:0 0 80px rgba(212,175,106,0.12)}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @media(max-width:800px){
          .nd{display:none!important}
          .mb{display:flex!important}
          .hg{flex-direction:column!important;gap:40px!important}
          .sg{flex-direction:column!important}
          .cg{flex-direction:column!important}
          .fg{flex-direction:column!important;gap:40px!important;text-align:center!important}
          .ag{flex-direction:column!important;gap:40px!important}
          .ag>div{width:100%!important}
          .aud{flex-direction:column!important}
          .hi{padding:140px 24px 80px!important}
          .hh{font-size:40px!important}
        }
        @media(min-width:801px){.mb{display:none!important}.mo{display:none!important}}
      `}</style>

      <Luminance />

      {/* Grain */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: navSolid ? "14px 48px" : "26px 48px",
        background: navSolid ? "rgba(12,18,32,0.92)" : "transparent",
        backdropFilter: navSolid ? "blur(30px)" : "none",
        borderBottom: navSolid ? "1px solid rgba(212,175,106,0.06)" : "none",
        transition: "all 0.5s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
          fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "21px", fontWeight: 400,
          color: "#f0ece4", cursor: "pointer", letterSpacing: "0.5px",
        }}>Ascend</div>

        <div className="nd" style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)} style={{
              background: "none", border: "none", fontFamily: "'Sora',sans-serif",
              fontSize: "12px", fontWeight: 400, color: "rgba(240,236,228,0.45)", cursor: "pointer",
              letterSpacing: "2px", textTransform: "uppercase", transition: "color 0.3s", padding: 0,
            }} onMouseEnter={e => e.target.style.color = "#d4af6a"}
               onMouseLeave={e => e.target.style.color = "rgba(240,236,228,0.45)"}>
              {n.label}
            </button>
          ))}
          <button onClick={() => go("contact")} style={{
            background: "transparent", color: "#d4af6a",
            border: "1px solid rgba(212,175,106,0.3)",
            fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
            padding: "11px 26px", borderRadius: "100px", cursor: "pointer",
            letterSpacing: "2px", textTransform: "uppercase", transition: "all 0.3s",
          }} onMouseEnter={e => { e.target.style.background = "#d4af6a"; e.target.style.color = "#0c1220"; e.target.style.borderColor = "#d4af6a"; }}
             onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#d4af6a"; e.target.style.borderColor = "rgba(212,175,106,0.3)"; }}>
            Get Started
          </button>
        </div>

        <button className="mb" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          flexDirection: "column", gap: "6px", padding: "8px",
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: "22px", height: "1.5px", background: "#d4af6a", transition: "all 0.3s",
              transform: menuOpen ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"scale(0)") : "none",
            }} />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div className="mo" style={{
          position: "fixed", inset: 0, background: "rgba(12,18,32,0.98)", zIndex: 99,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "32px",
        }}>
          {NAV.map((n,i) => (
            <button key={n.id} onClick={() => go(n.id)} style={{
              background: "none", border: "none",
              fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "30px", fontWeight: 400,
              color: "#f0ece4", cursor: "pointer",
              animation: `fadeIn 0.4s ease ${i*0.06}s both`,
            }}>{n.label}</button>
          ))}
        </div>
      )}

      {/* ═════════ HERO ═════════ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center",
        position: "relative", zIndex: 1,
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,106,0.06) 0%, transparent 65%)",
          top: "5%", right: "-15%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,130,200,0.04) 0%, transparent 65%)",
          bottom: "10%", left: "-10%", pointerEvents: "none",
        }} />

        <div className="hi" style={{ maxWidth: "800px", padding: "160px 40px 100px", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
            letterSpacing: "5px", textTransform: "uppercase", color: "#d4af6a",
            marginBottom: "44px", animation: "fadeIn 1s ease 0.2s both",
          }}>
            Social Services & Case Management
          </div>

          <h1 className="hh" style={{
            fontFamily: "'Libre Caslon Display',Georgia,serif",
            fontSize: "clamp(42px, 6.5vw, 74px)", fontWeight: 400,
            color: "#f0ece4", lineHeight: 1.1, marginBottom: "36px",
            letterSpacing: "-0.5px", animation: "fadeIn 1s ease 0.4s both",
          }}>
            We show up <em style={{ fontStyle: "italic", color: "#d4af6a" }}>where</em> you are
          </h1>

          <p className="hs" style={{
            fontFamily: "'Sora',sans-serif", fontSize: "17px", fontWeight: 300,
            color: "rgba(240,236,228,0.5)", lineHeight: 1.85, maxWidth: "540px",
            margin: "0 auto 52px", animation: "fadeIn 1s ease 0.6s both",
          }}>
            Walk-in. Field visit. Phone call. However you need us. We help people navigate case management, transition out of facilities, find work, and get enrolled in the coverage they deserve.
          </p>

          <div style={{ animation: "fadeIn 1s ease 0.8s both", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => go("contact")} style={{
              background: "#d4af6a", color: "#0c1220", border: "none",
              fontFamily: "'Sora',sans-serif", fontSize: "13px", fontWeight: 600,
              padding: "18px 44px", borderRadius: "100px", cursor: "pointer",
              letterSpacing: "0.5px", transition: "all 0.4s ease",
            }} onMouseEnter={e => { e.target.style.background = "#e8c97e"; e.target.style.transform = "scale(1.03)"; }}
               onMouseLeave={e => { e.target.style.background = "#d4af6a"; e.target.style.transform = "scale(1)"; }}>
              Work with us
            </button>
            <button onClick={() => go("services")} style={{
              background: "transparent", color: "rgba(240,236,228,0.5)",
              border: "1px solid rgba(240,236,228,0.12)",
              fontFamily: "'Sora',sans-serif", fontSize: "13px", fontWeight: 400,
              padding: "18px 36px", borderRadius: "100px", cursor: "pointer", transition: "all 0.3s",
            }} onMouseEnter={e => { e.target.style.borderColor = "#d4af6a"; e.target.style.color = "#d4af6a"; }}
               onMouseLeave={e => { e.target.style.borderColor = "rgba(240,236,228,0.12)"; e.target.style.color = "rgba(240,236,228,0.5)"; }}>
              Our services
            </button>
          </div>

          <div style={{
            marginTop: "72px", animation: "fadeIn 1s ease 1s both",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", flexWrap: "wrap",
          }}>
            {["DHS-Certified", "Medicaid Covered", "Walk-Ins Welcome"].map((t, i) => (
              <span key={i} style={{
                fontFamily: "'Sora',sans-serif", fontSize: "10px", fontWeight: 500,
                letterSpacing: "2.5px", textTransform: "uppercase", color: "#d4af6a",
                padding: "7px 16px", borderRadius: "100px",
                border: "1px solid rgba(212,175,106,0.15)",
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
          opacity: 0.3,
        }}>
          <div style={{
            width: "1px", height: "44px",
            background: "linear-gradient(to bottom, #d4af6a, transparent)",
            animation: "breatheLine 3s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ═════════ ABOUT ═════════ */}
      <section id="about" style={{ padding: "120px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <Fade>
            <div style={{ width: "60px", height: "1px", background: "rgba(212,175,106,0.2)", margin: "0 auto", animation: "breatheLine 4s ease-in-out infinite" }} />
          </Fade>

          <div className="ag" style={{ display: "flex", gap: "80px", alignItems: "flex-start", marginTop: "80px" }}>
            <div style={{ flex: "1 1 52%", width: "52%" }}>
              <Fade delay={0.1}>
                <h2 style={{
                  fontFamily: "'Libre Caslon Display',Georgia,serif",
                  fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 400,
                  color: "#f0ece4", lineHeight: 1.35, marginBottom: "32px",
                }}>
                  We don't work from behind a desk.
                </h2>
              </Fade>
              <Fade delay={0.2}>
                <p style={{
                  fontFamily: "'Sora',sans-serif", fontSize: "14.5px", color: "rgba(240,236,228,0.5)",
                  lineHeight: 1.9,
                }}>
                  Ascend Rehab Solutions is a social services and case management company built for people who need someone to actually show up. We go to the facilities. We sit in the county meetings. We walk into the housing office with you. Our clinical team — led by a Licensed Clinical Social Worker — oversees every case, because the people we serve can't afford shortcuts.
                </p>
              </Fade>
              <Fade delay={0.3}>
                <p style={{
                  fontFamily: "'Sora',sans-serif", fontSize: "14.5px", color: "rgba(240,236,228,0.5)",
                  lineHeight: 1.9, marginTop: "20px",
                }}>
                  We started with RSC-TCM — helping people transition out of nursing facilities and back into the community. Now we're building out vocational rehabilitation, MNsure navigation, and additional service lines because the people we work with don't just need one thing. They need someone who sees the whole picture and doesn't stop at the first problem.
                </p>
              </Fade>
            </div>

            <div style={{ flex: "1 1 38%", width: "38%", paddingTop: "8px" }}>
              {[
                { n: "100%", label: "Covered through Medicaid" },
                { n: "25", label: "Minnesota counties served" },
                { n: "$0", label: "Cost to you or your family" },
              ].map((s, i) => (
                <Fade key={i} delay={0.15 + i * 0.1}>
                  <div style={{
                    padding: "28px 0",
                    borderBottom: i < 2 ? "1px solid rgba(212,175,106,0.06)" : "none",
                  }}>
                    <div style={{
                      fontFamily: "'Libre Caslon Display',Georgia,serif",
                      fontSize: "34px", fontWeight: 400, color: "#d4af6a", marginBottom: "4px",
                    }}>{s.n}</div>
                    <div style={{
                      fontFamily: "'Sora',sans-serif", fontSize: "12px", fontWeight: 400,
                      color: "rgba(240,236,228,0.35)", letterSpacing: "1.5px", textTransform: "uppercase",
                    }}>{s.label}</div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>

          {/* Audience strip */}
          <div className="aud" style={{
            marginTop: "100px", display: "flex", gap: "0",
            border: "1px solid rgba(212,175,106,0.06)", borderRadius: "20px",
            overflow: "hidden", flexWrap: "wrap",
          }}>
            {[
              { to: "Individuals", line: "You need help getting out, getting covered, or getting back on your feet. We're here." },
              { to: "Families", line: "Your loved one needs more support than you can give alone. We step in." },
              { to: "Facilities", line: "You have residents ready for discharge with nowhere to go. We take it from there." },
              { to: "Referral Partners", line: "Counties, MCOs, and providers — we're a certified partner that delivers." },
            ].map((c, i) => (
              <Fade key={i} delay={i * 0.07} style={{
                flex: "1 1 240px", padding: "36px 30px",
                borderRight: i < 3 ? "1px solid rgba(212,175,106,0.04)" : "none",
              }}>
                <div style={{
                  fontFamily: "'Sora',sans-serif", fontSize: "10px", fontWeight: 600,
                  letterSpacing: "2.5px", textTransform: "uppercase", color: "#d4af6a", marginBottom: "12px",
                }}>For {c.to}</div>
                <p style={{
                  fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "17px",
                  fontWeight: 400, color: "rgba(240,236,228,0.7)", lineHeight: 1.55, fontStyle: "italic",
                }}>{c.line}</p>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ SERVICES ═════════ */}
      <section id="services" style={{ padding: "100px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Fade>
            <div style={{ textAlign: "center", marginBottom: "72px" }}>
              <div style={{
                fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
                letterSpacing: "5px", textTransform: "uppercase", color: "#d4af6a", marginBottom: "22px",
              }}>Services</div>
              <h2 style={{
                fontFamily: "'Libre Caslon Display',Georgia,serif",
                fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 400, color: "#f0ece4",
              }}>Case management that goes where you go</h2>
            </div>
          </Fade>

          <div className="sg" style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            <ServiceBlock num="01" title="Relocation Case Management"
              desc="DHS-certified RSC-TCM services for people transitioning out of nursing facilities, hospitals, and other institutional settings. We build the care plan, find housing, coordinate with the county, handle benefits, and stay with you through move-in and beyond."
              items={["Care planning", "Housing search", "Discharge coordination", "Benefits enrollment", "Post-move follow-up"]}
              delay={0} />
            <ServiceBlock num="02" title="Vocational Rehabilitation"
              desc="Job readiness, placement, and coaching through our Employment for All program. We help people build real independence through meaningful work — from resume building to employer introductions to on-the-job support."
              items={["Job readiness", "Resume building", "Employer connections", "Job coaching", "Career planning"]}
              delay={0.1} />
            <ServiceBlock num="03" title="MNsure Navigation"
              desc="Health insurance enrollment and navigation for individuals and families. We help you understand your options, complete applications, and get enrolled in the coverage you're entitled to — whether it's Medical Assistance, MinnesotaCare, or a qualified health plan."
              items={["Eligibility screening", "Application assistance", "Plan comparison", "Enrollment support", "Renewals"]}
              delay={0.2} />
          </div>

          {/* Expanding services note */}
          <Fade delay={0.3}>
            <div style={{
              marginTop: "48px", textAlign: "center",
              padding: "28px 36px", borderRadius: "16px",
              border: "1px dashed rgba(212,175,106,0.12)",
              background: "rgba(212,175,106,0.02)",
            }}>
              <p style={{
                fontFamily: "'Sora',sans-serif", fontSize: "13px", fontWeight: 400,
                color: "rgba(240,236,228,0.4)", lineHeight: 1.8,
              }}>
                <span style={{ color: "#d4af6a", fontWeight: 500 }}>Growing our reach.</span>{" "}
                We're actively expanding into additional Medicaid service lines including substance use disorder treatment coordination and community health integration. More ways to serve, same boots-on-the-ground approach.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section id="faq" style={{ padding: "100px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <Fade>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <div style={{
                fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
                letterSpacing: "5px", textTransform: "uppercase", color: "#d4af6a", marginBottom: "22px",
              }}>FAQ</div>
              <h2 style={{
                fontFamily: "'Libre Caslon Display',Georgia,serif",
                fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 400, color: "#f0ece4",
              }}>Common questions</h2>
            </div>
          </Fade>

          <Faq q="Does this cost anything?" a="No. Our case management services are billed through Minnesota Medicaid. There is zero out-of-pocket cost to you or your family. We're a DHS-certified provider." delay={0} />
          <Faq q="Who can you help?" a="Anyone on Medical Assistance who needs support transitioning out of a facility, finding work, or navigating health insurance enrollment. We also work with families, facilities, and referral partners." delay={0.05} />
          <Faq q="Can I just walk in?" a="Yes. Our office is at 912 E 24th St, Suite B203 in Minneapolis. You can also call us or have someone refer you — whatever works." delay={0.1} />
          <Faq q="What areas do you cover?" a="We're certified across 25 counties in Minnesota including the Twin Cities metro (Hennepin, Ramsey, Dakota, Anoka, Scott, Carver, Washington), central Minnesota, and western Minnesota." delay={0.15} />
          <Faq q="Can a family member reach out for someone?" a="Absolutely. Most of our referrals come from family members, facility social workers, and county care coordinators reaching out on behalf of someone who needs help." delay={0.2} />
          <Faq q="What happens after someone moves out of a facility?" a="We don't disappear. Post-transition follow-up is built into every case. We check in, troubleshoot issues, and make sure the new living situation is stable and sustainable." delay={0.25} />
        </div>
      </section>

      {/* ═════════ CONTACT ═════════ */}
      <section id="contact" style={{
        padding: "120px 48px",
        background: "linear-gradient(180deg, #0c1220 0%, #101828 100%)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: "940px", margin: "0 auto" }}>
          <Fade>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <div style={{
                fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
                letterSpacing: "5px", textTransform: "uppercase", color: "#d4af6a", marginBottom: "22px",
              }}>Contact</div>
              <h2 style={{
                fontFamily: "'Libre Caslon Display',Georgia,serif",
                fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 400, color: "#f0ece4",
                marginBottom: "16px",
              }}>Walk in, call, or send us a message</h2>
            </div>
          </Fade>

          <div className="cg" style={{ display: "flex", gap: "64px", alignItems: "flex-start" }}>
            <Fade delay={0.1} style={{ flex: "1 1 55%" }}>
              <div style={{
                background: "rgba(240,236,228,0.03)", borderRadius: "24px", padding: "48px 44px",
                border: "1px solid rgba(212,175,106,0.06)",
                animation: "glowPulse 6s ease-in-out infinite",
              }}>
                {status === "sent" ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "50%", margin: "0 auto 20px",
                      background: "rgba(212,175,106,0.08)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontFamily: "'Libre Caslon Display',serif", fontSize: "26px", color: "#d4af6a",
                    }}>✓</div>
                    <h3 style={{ fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "24px", fontWeight: 400, color: "#f0ece4", marginBottom: "8px" }}>Message received</h3>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: "13px", color: "rgba(240,236,228,0.45)" }}>We'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: "36px" }}>
                      <label style={{ fontFamily: "'Sora',sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#d4af6a", display: "block", marginBottom: "14px" }}>I am a</label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {[
                          { v: "individual", l: "Individual" },
                          { v: "family", l: "Family Member" },
                          { v: "social_worker", l: "Social Worker" },
                          { v: "facility", l: "Facility Staff" },
                          { v: "partner", l: "Referral Partner" },
                        ].map(o => (
                          <button key={o.v} onClick={() => setForm({...form, type: o.v})} style={{
                            background: form.type===o.v ? "#d4af6a" : "transparent",
                            color: form.type===o.v ? "#0c1220" : "rgba(240,236,228,0.4)",
                            border: `1px solid ${form.type===o.v ? "#d4af6a" : "rgba(212,175,106,0.12)"}`,
                            fontFamily: "'Sora',sans-serif", fontSize: "11px", fontWeight: 500,
                            padding: "9px 18px", borderRadius: "100px", cursor: "pointer",
                            transition: "all 0.25s", letterSpacing: "0.4px",
                          }}>{o.l}</button>
                        ))}
                      </div>
                    </div>

                    {[
                      { k: "name", l: "Name", t: "text", p: "Full name" },
                      { k: "phone", l: "Phone", t: "tel", p: "(612) 000-0000" },
                      { k: "email", l: "Email", t: "email", p: "Optional" },
                    ].map(f => (
                      <div key={f.k} style={{ marginBottom: "8px" }}>
                        <input type={f.t} placeholder={f.p} value={form[f.k]}
                          onChange={e => setForm({...form, [f.k]: e.target.value})}
                          style={inputBase}
                          onFocus={e => e.target.style.borderBottomColor = "#d4af6a"}
                          onBlur={e => e.target.style.borderBottomColor = "rgba(212,175,106,0.12)"}
                        />
                      </div>
                    ))}

                    <div style={{ marginBottom: "36px" }}>
                      <textarea placeholder="Tell us what you need help with..." value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})} rows={3}
                        style={{ ...inputBase, resize: "none" }}
                        onFocus={e => e.target.style.borderBottomColor = "#d4af6a"}
                        onBlur={e => e.target.style.borderBottomColor = "rgba(212,175,106,0.12)"}
                      />
                    </div>

                    <button onClick={submit} disabled={status==="sending"} style={{
                      width: "100%", background: "#d4af6a", color: "#0c1220", border: "none",
                      fontFamily: "'Sora',sans-serif", fontSize: "13px", fontWeight: 600,
                      padding: "18px", borderRadius: "100px", cursor: status==="sending" ? "wait" : "pointer",
                      transition: "all 0.3s", letterSpacing: "0.5px",
                      opacity: status==="sending" ? 0.6 : 1,
                    }} onMouseEnter={e => { if(status!=="sending") e.target.style.background="#e8c97e"; }}
                       onMouseLeave={e => { if(status!=="sending") e.target.style.background="#d4af6a"; }}>
                      {status === "sending" ? "Sending..." : "Send message"}
                    </button>

                    {status === "error" && (
                      <p style={{ fontFamily: "'Sora',sans-serif", fontSize: "12px", color: "#e07c7c", marginTop: "16px", textAlign: "center" }}>
                        Something went wrong — please call us at (701) 450-4583.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Fade>

            <Fade delay={0.2} style={{ flex: "1 1 35%" }}>
              <div style={{ paddingTop: "12px" }}>
                {[
                  { label: "Call", value: "(701) 450-4583", href: "tel:7014504583" },
                  { label: "Email", value: "info@ascendrehabsolutions.org", href: "mailto:info@ascendrehabsolutions.org" },
                  { label: "Walk In", value: "912 E 24th St, Suite B203\nMinneapolis, MN 55404" },
                ].map((c, i) => (
                  <div key={i} style={{
                    marginBottom: "36px", paddingBottom: "36px",
                    borderBottom: i < 2 ? "1px solid rgba(212,175,106,0.05)" : "none",
                  }}>
                    <div style={{
                      fontFamily: "'Sora',sans-serif", fontSize: "10px", fontWeight: 600,
                      letterSpacing: "2.5px", textTransform: "uppercase", color: "#d4af6a", marginBottom: "10px",
                    }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href} style={{
                        fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "19px",
                        color: "#f0ece4", textDecoration: "none", fontWeight: 400, transition: "color 0.2s",
                      }} onMouseEnter={e => e.target.style.color = "#d4af6a"}
                         onMouseLeave={e => e.target.style.color = "#f0ece4"}>
                        {c.value}
                      </a>
                    ) : (
                      <div style={{
                        fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "19px",
                        color: "#f0ece4", whiteSpace: "pre-line", fontWeight: 400, lineHeight: 1.4,
                      }}>{c.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#080d18", padding: "56px 48px 36px", position: "relative", zIndex: 1 }}>
        <div className="fg" style={{
          maxWidth: "1060px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "60px",
        }}>
          <div>
            <div style={{
              fontFamily: "'Libre Caslon Display',Georgia,serif", fontSize: "20px",
              fontWeight: 400, color: "#f0ece4", marginBottom: "12px",
            }}>Ascend Rehab Solutions</div>
            <p style={{
              fontFamily: "'Sora',sans-serif", fontSize: "12px",
              color: "rgba(240,236,228,0.25)", lineHeight: 1.8,
            }}>
              Social Services & Case Management<br />DHS-Certified · Minneapolis, MN
            </p>
          </div>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => go(n.id)} style={{
                background: "none", border: "none", fontFamily: "'Sora',sans-serif",
                fontSize: "12px", color: "rgba(240,236,228,0.25)", cursor: "pointer",
                transition: "color 0.2s", padding: 0,
              }} onMouseEnter={e => e.target.style.color = "#d4af6a"}
                 onMouseLeave={e => e.target.style.color = "rgba(240,236,228,0.25)"}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          maxWidth: "1060px", margin: "36px auto 0", paddingTop: "20px",
          borderTop: "1px solid rgba(212,175,106,0.04)",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "11px", color: "rgba(240,236,228,0.18)" }}>
            © {new Date().getFullYear()} Ascend Rehab Solutions LLC
          </span>
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "11px", color: "rgba(240,236,228,0.18)" }}>
            RSC-TCM · Vocational Rehabilitation · MNsure Navigation
          </span>
        </div>
      </footer>
    </div>
  );
}
