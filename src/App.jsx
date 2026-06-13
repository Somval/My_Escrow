import { useState, useEffect, useRef } from "react";

/* ═══ TOKENS ═══════════════════════════════════════════════ */
const T = {
  // ── Team design-system colours (matches login/signup/dashboard HTML) ──
  primary:"#001637",   primaryDk:"#001637",   primaryLt:"#172b4d",
  accent:"#006c47",    green:"#006c47",        greenLt:"#e8f5ee",
  white:"#ffffff",     offWhite:"#f5f3f6",     gray100:"#c5c6cf",
  gray400:"#75777f",   gray500:"#75777f",      gray600:"#44474e",
  gray700:"#44474e",   gray900:"#1b1b1e",      red:"#ba1a1a",
  gold:"#82f9be",      teal:"#006c47",         tealLt:"#e8f5ee",
  purple:"#001637",    purpleLt:"#eef2ff",     indigo:"#001637",
  // extra tokens kept for compat
  secondary:"#006c47", secContainer:"#82f9be", outline:"#75777f",
  outlineVariant:"#c5c6cf", surface:"#fbf9fc", surfaceLow:"#f5f3f6",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:#fbf9fc;color:#1b1b1e;} .msym{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;display:inline-block;line-height:1;text-transform:none;letter-spacing:normal;white-space:nowrap;} @keyframes pulse-ring{0%{transform:scale(.95);opacity:.5}50%{transform:scale(1.15);opacity:.2}100%{transform:scale(.95);opacity:.5}} @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}} .pulse-ring{animation:pulse-ring 3s cubic-bezier(.4,0,.6,1) infinite;}
  input,select,textarea,button{font-family:'Inter',sans-serif;}
  ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#f1f4f9;}::-webkit-scrollbar-thumb{background:#a0aec0;border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
  .fu{animation:fadeUp .5s ease both;}.fu2{animation:fadeUp .5s .1s ease both;}
  .fu3{animation:fadeUp .5s .2s ease both;}.fu4{animation:fadeUp .5s .3s ease both;}
  .ch{transition:transform .2s,box-shadow .2s;}.ch:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(26,86,160,.13)!important;}
  .fc{transition:border-color .2s,transform .2s;}.fc:hover{border-color:#001637!important;transform:translateY(-2px);}
  .nl:hover{color:#006c47!important;}.nl{transition:color .15s;}
  .tr:hover{background:#f1f4f9!important;}.tr{transition:background .12s;}
  .btn-primary:hover{background:#172b4d!important;transform:translateY(-1px);}
  .btn-accent:hover{background:#005235!important;transform:translateY(-1px);}
  .btn-outline:hover{background:#001637!important;color:#fff!important;}
  .btn-green:hover{background:#178050!important;}
  .dm{animation:slideDown .18s ease;}
  @media(max-width:1100px){.g5{grid-template-columns:repeat(3,1fr)!important;}}
  @media(max-width:1024px){.g4{grid-template-columns:repeat(2,1fr)!important;}.g3{grid-template-columns:repeat(2,1fr)!important;}.g2{grid-template-columns:1fr!important;}.fg{grid-template-columns:1fr 1fr!important;}}
  @media(max-width:768px){.g4{grid-template-columns:1fr 1fr!important;}.g5{grid-template-columns:1fr 1fr!important;}.g3{grid-template-columns:1fr!important;}.g2{grid-template-columns:1fr!important;}.hg{grid-template-columns:1fr!important;}.fg{grid-template-columns:1fr!important;}.ndsk{display:none!important;}.mbb{display:flex!important;}.feeg{grid-template-columns:1fr!important;}.dg{grid-template-columns:1fr!important;}.hcta{flex-direction:column!important;}.ctar{flex-direction:column!important;text-align:center!important;}}
  @media(max-width:480px){.g4{grid-template-columns:1fr!important;}.g5{grid-template-columns:1fr!important;}.sg{grid-template-columns:1fr 1fr!important;}}
  /* dashboard responsive */
  .dash-kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  @media(max-width:860px){.dash-tabs{display:none!important;}.dash-kpi{grid-template-columns:1fr 1fr!important;}}
  @media(max-width:768px){.dg{grid-template-columns:1fr!important;}.tx-tbl{display:none!important;}.tx-mob{display:flex!important;}.g2-dash{grid-template-columns:1fr!important;}.g3-dash{grid-template-columns:1fr!important;}.hist-row{flex-direction:column!important;}}
  @media(max-width:480px){.dash-kpi{grid-template-columns:1fr 1fr!important;}.modal-grid{grid-template-columns:1fr!important;}}
  .dash-drawer{position:fixed;top:0;left:0;bottom:0;width:268px;background:#fbf9fc;border-right:1px solid #c5c6cf;z-index:149;display:flex;flex-direction:column;box-shadow:4px 0 24px rgba(0,0,0,.13);transform:translateX(-100%);transition:transform .24s ease;}
  .dash-drawer.open{transform:translateX(0);}
  .dash-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:148;}
  .dash-overlay.show{display:block;}
  @media(min-width:861px){.mob-menu-btn{display:none!important;}}
`;


/* ═══ PRIMITIVES ════════════════════════════════════════════ */
const Btn = ({children,variant="primary",onClick,style,className="",disabled,type="button"})=>{
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,border:"none",borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontWeight:700,fontSize:15,padding:"11px 24px",opacity:disabled?.55:1,whiteSpace:"nowrap",transition:"all .18s"};
  const v={primary:{background:T.primary,color:T.white},accent:{background:T.accent,color:T.white},outline:{background:"transparent",color:T.primary,border:`2px solid ${T.primary}`},outlineW:{background:"transparent",color:T.white,border:"2px solid rgba(255,255,255,.5)"},green:{background:T.green,color:T.white},ghost:{background:"transparent",color:T.gray600,padding:"9px 16px"},purple:{background:T.purple,color:T.white},red:{background:T.red,color:T.white},teal:{background:T.teal,color:T.white},dark:{background:T.primaryDk,color:T.white}};
  return <button type={type} disabled={disabled} className={`btn-${variant} ${className}`} style={{...base,...(v[variant]||v.primary),...style}} onClick={onClick}>{children}</button>;
};
const Badge=({children,color=T.primary,sz="sm"})=><span style={{display:"inline-block",background:color+"18",color,fontWeight:700,fontSize:sz==="sm"?11:13,padding:sz==="sm"?"3px 11px":"5px 14px",borderRadius:20,border:`1px solid ${color}25`,letterSpacing:".02em"}}>{children}</span>;
const Spin=({size=17,color="#fff"})=><span style={{display:"inline-block",width:size,height:size,border:`2.5px solid rgba(255,255,255,.25)`,borderTopColor:color,borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>;
const ST=({badge,title,sub,light=false})=>(
  <div style={{textAlign:"center",marginBottom:52}}>
    {badge&&<Badge color={light?T.gold:T.primary} sz="md">{badge}</Badge>}
    <h2 style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(26px,3.5vw,44px)",fontWeight:700,color:light?T.white:T.primary,marginTop:14,letterSpacing:"-.5px",lineHeight:1.2}}>{title}</h2>
    {sub&&<p style={{color:light?"rgba(255,255,255,.6)":T.gray500,fontSize:"clamp(14px,1.8vw,17px)",maxWidth:560,margin:"12px auto 0",lineHeight:1.75}}>{sub}</p>}
  </div>
);
const fs={width:"100%",padding:"11px 14px",border:`1.5px solid ${T.gray100}`,borderRadius:8,fontSize:14,color:T.gray900,outline:"none",background:T.white};
const F=({label,children,req})=><div><label style={{display:"block",fontSize:13,fontWeight:600,color:T.gray700,marginBottom:5}}>{label}{req&&" *"}</label>{children}</div>;

/* ═══ DATA ══════════════════════════════════════════════════ */
const CATS=[
  {id:"software",label:"Software Dev",   color:"#3b82f6"},
  {id:"mobile", label:"Mobile App",     color:"#8b5cf6"},
  {id:"web",    label:"Web Dev",         color:"#10b981"},
  {id:"uiux",   label:"UI/UX Design",   color:"#ec4899"},
  {id:"cyber",   label:"Cybersecurity",  color:"#ef4444"},
  {id:"cloud",    label:"Cloud/DevOps",  color:"#006c47"},
  {id:"ai",      label:"AI Dev",          color:"#6366f1"},
  {id:"it",      label:"IT Consulting",  color:"#0d9488"},
  {id:"data",    label:"Data Analytics", color:"#006c47"},
  {id:"docs",    label:"Tech Docs",       color:"#64748b"},
];
const CURR=["USD","GBP","EUR","AUD","CAD","NGN"];
const SCFG={
  pending:   {label:"Awaiting Funds",dot:"#8b5cf6",bg:"#f5f3ff"},
  funded:    {label:"Funded",        dot:"#3b82f6",bg:"#eff6ff"},
  inprogress:{label:"In Progress",   dot:"#006c47",bg:"#fffbeb"},
  inspection:{label:"In Review",     dot:"#006c47",bg:"#fffbeb"},
  audit:     {label:"AI Audit",      dot:"#0d9488",bg:"#e6faf8"},
  approved:  {label:"Approved",      dot:"#10b981",bg:"#f0fdf4"},
  revision:  {label:"Revision Req.", dot:"#006c47",bg:"#fff7ed"},
  completed: {label:"Completed",     dot:"#6b7280",bg:"#f9fafb"},
  disputed:  {label:"Disputed",      dot:"#ef4444",bg:"#fef2f2"},
};
const SB=({status})=>{const c=SCFG[status]||SCFG.pending;return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,color:c.dot}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,display:"inline-block"}}/>{c.label}</span>;};
const MTX=[
  {id:"TXN-88401",title:"E-commerce Backend + REST API",  type:"Software Dev",cat:"software",amount:18000,currency:"USD",role:"Buyer", other:"Devcraft Solutions",status:"inspection",date:"May 14, 2025",milestones:3},
  {id:"TXN-88256",title:"Mobile Banking App (iOS+Android)",type:"Mobile App",  cat:"mobile",  amount:35000,currency:"USD",role:"Buyer", other:"AppForge Ltd",      status:"funded",    date:"May 20, 2025",milestones:4},
  {id:"TXN-88103",title:"Company Website Redesign",        type:"Web Dev",     cat:"web",     amount:4800, currency:"USD",role:"Seller",other:"TechStar Agency",   status:"approved",  date:"May 22, 2025",milestones:1},
  {id:"TXN-87940",title:"Dashboard UI/UX & Design System", type:"UI/UX Design",cat:"uiux",    amount:6200, currency:"USD",role:"Buyer", other:"Studio Vela",       status:"completed", date:"Apr 30, 2025",milestones:2},
  {id:"TXN-87801",title:"AWS Cloud Infrastructure Migration",type:"Cloud/DevOps",cat:"cloud", amount:12500,currency:"USD",role:"Buyer", other:"CloudShift Inc",    status:"disputed",  date:"May 10, 2025",milestones:2},
];

/* ═══ NAVBAR ════════════════════════════════════════════════ */
const NAV=[
  {label:"Platform",    ch:[{l:"How It Works",d:"9-step AI workflow"},{l:"Tech Categories",d:"10 service types"},]},
  {label:"AI Features", ch:[{l:"Scope Generator",d:"AI writes your scope"},{l:"Contract Generator",d:"Smart legal contracts"},{l:"Deliverable Auditor",d:"Technical audit engine"},{l:"Dispute Assistant",d:"AI-powered resolution"}]},
  {label:"Business",    ch:[{l:"Enterprise",d:"Agency & multi-user"},{l:"Escrow API",d:"Full REST API"},{l:"White Label",d:"Your brand, our rails"},{l:"Become a Partner",d:"Revenue sharing"}]},
  {label:"Pricing",     ch:[{l:"Subscription Plans",d:"Starter, Pro, Enterprise"},{l:"Escrow Fees",d:"Transaction fee schedule"},{l:"AI Audit Fees",d:"Per-audit pricing"}]},
  {label:"Help",        ch:[{l:"Help Center",d:"Browse FAQs"},{l:"Contact Us",d:"Get in touch"},{l:"API Docs",d:"For developers"}]},
];
const Navbar=({onLogin,onSignup,navigate})=>{
  const [open,setOpen]=useState(null);
  const [sc,setSc]=useState(false);
  const [mob,setMob]=useState(false);
  const [me,setMe]=useState(null);
  const t=useRef(null);
  useEffect(()=>{const h=()=>setSc(window.scrollY>8);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  // mobile menu no longer auto-closes on scroll
  return(<>
    <nav style={{background:T.white,position:"sticky",top:0,zIndex:300,boxShadow:sc?"0 2px 20px rgba(0,0,0,.1)":"0 1px 0 #e2e8f0",transition:"box-shadow .2s"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 1.5rem",display:"flex",alignItems:"center",height:64}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}} onClick={()=>{navigate("home");setMob(false);}}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:T.white,fontWeight:800,fontSize:18,fontFamily:"'Inter',sans-serif"}}>V</span></div>
          <span style={{fontWeight:800,fontSize:20,color:T.primary,letterSpacing:"-.4px"}}>Vault<span style={{color:T.green}}>Pay</span></span>
        </div>
        <div className="ndsk" style={{display:"flex",alignItems:"center",gap:2,marginLeft:28,flex:1}}>
          {NAV.map(item=>(
            <div key={item.label} style={{position:"relative"}} onMouseEnter={()=>{clearTimeout(t.current);setOpen(item.label);}} onMouseLeave={()=>{t.current=setTimeout(()=>setOpen(null),140);}}>
              <button className="nl" style={{background:"none",border:"none",cursor:"pointer",padding:"8px 12px",fontWeight:600,fontSize:13.5,color:open===item.label?T.accent:T.gray700,display:"flex",alignItems:"center",gap:4}}>
                {item.label}<svg width="9" height="5" viewBox="0 0 10 6" fill="none" style={{transition:"transform .2s",transform:open===item.label?"rotate(180deg)":"none"}}><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {open===item.label&&(
                <div className="dm" style={{position:"absolute",top:"calc(100% + 6px)",left:0,background:T.white,border:`1px solid ${T.gray100}`,borderRadius:12,boxShadow:"0 10px 40px rgba(0,0,0,.13)",minWidth:240,zIndex:400,overflow:"hidden"}}>
                  <div style={{padding:"8px 0"}}>{item.ch.map(ch=><button key={ch.l} className="nl" style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"10px 18px",textAlign:"left"}}><div style={{fontWeight:600,fontSize:13.5,color:T.gray900}}>{ch.l}</div><div style={{fontSize:11.5,color:T.gray500,marginTop:2}}>{ch.d}</div></button>)}</div>
                  <div style={{background:T.offWhite,borderTop:`1px solid ${T.gray100}`,padding:"12px 18px"}}><Btn variant="accent" style={{fontSize:12,padding:"7px 16px"}} onClick={onSignup}>Get Started Free</Btn></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="ndsk" style={{display:"flex",alignItems:"center",gap:10,marginLeft:12,flexShrink:0}}>
          <Btn variant="ghost" onClick={onLogin} style={{fontSize:14}}>Login</Btn>
          <Btn variant="accent" onClick={onSignup} style={{fontSize:14,padding:"9px 20px"}}>Sign Up Free →</Btn>
        </div>
        <button className="mbb" onClick={()=>{setMob(o=>!o);setMe(null);}} style={{display:"none",marginLeft:"auto",background:"none",border:"none",cursor:"pointer",flexDirection:"column",gap:5,padding:8}} aria-label="Menu">
          {mob?<span className="msym" style={{fontSize:24,color:T.gray700}}>close</span>:[0,1,2].map(i=><span key={i} style={{display:"block",width:24,height:2,background:T.gray700,borderRadius:2}}/>)}
        </button>
      </div>
    </nav>
    {mob&&(
      <div style={{background:T.white,borderBottom:`1px solid ${T.gray100}`,boxShadow:"0 4px 20px rgba(0,0,0,.07)",zIndex:299,position:"fixed",top:64,left:0,right:0,maxHeight:"calc(100vh - 64px)",overflowY:"auto"}}>
        {NAV.map(item=>(
          <div key={item.label} style={{borderBottom:`1px solid ${T.gray100}`}}>
            <button onClick={()=>setMe(p=>p===item.label?null:item.label)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 1.5rem",fontWeight:700,fontSize:15,color:me===item.label?T.primary:T.gray900}}>
              {item.label}<svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{transition:"transform .2s",transform:me===item.label?"rotate(180deg)":"none"}}><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {me===item.label&&<div style={{background:T.offWhite,paddingBottom:8}}>{item.ch.map(ch=><button key={ch.l} onClick={()=>setMob(false)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:"10px 1.5rem 10px 2rem"}}><div style={{fontWeight:600,fontSize:14,color:T.gray900}}>{ch.l}</div><div style={{fontSize:12,color:T.gray500,marginTop:2}}>{ch.d}</div></button>)}</div>}
          </div>
        ))}
        <div style={{display:"flex",flexDirection:"column",gap:10,padding:"14px 1.5rem 22px"}}>
          <Btn variant="outline" onClick={()=>{onLogin();setMob(false);}} style={{width:"100%"}}>Login</Btn>
          <Btn variant="accent" onClick={()=>{onSignup();setMob(false);}} style={{width:"100%"}}>Sign Up Free →</Btn>
        </div>
      </div>
    )}
  </>);
};

/* ═══ HERO ══════════════════════════════════════════════════ */
const Hero=({onSignup})=>{
  const [role,setRole]=useState("client");
  const [cat,setCat]=useState("software");
  const [amt,setAmt]=useState("");
  const [cur,setCur]=useState("USD");
  return(
    <section style={{background:`linear-gradient(150deg,${T.primaryDk} 0%,${T.primary} 55%,#1a6bb5 100%)`,color:T.white,padding:"72px 1.5rem 0",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",right:"-5%",top:"-10%",width:550,height:550,background:"radial-gradient(circle,rgba(240,130,15,.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div className="hg" style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"center"}}>
        <div>
          <div style={{marginBottom:18}}><Badge color={T.secondary||T.green} sz="md">AI-Powered Tech Services Escrow</Badge></div>
          <h1 className="fu" style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(30px,4.5vw,54px)",fontWeight:700,lineHeight:1.15,marginBottom:20,letterSpacing:"-.5px"}}>Secure escrow for<br/>tech services — with<br/><span style={{color:T.gold}}>built-in AI auditing</span></h1>
          <p className="fu2" style={{fontSize:"clamp(14px,1.8vw,16px)",color:"rgba(255,255,255,.75)",lineHeight:1.85,marginBottom:36,maxWidth:480}}>VaultPay holds client payments for software, design, and cloud projects — releasing funds only after AI confirms deliverables meet the agreed scope. No chargebacks. No fraud. Full protection for both sides.</p>
          <div className="hcta fu3" style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:40}}>
            <Btn variant="accent" style={{fontSize:15,padding:"13px 28px"}} onClick={onSignup}>Start a Project →</Btn>
            <Btn variant="outlineW" style={{fontSize:15,padding:"13px 24px"}}>See How It Works</Btn>
          </div>
          <div className="fu4" style={{display:"flex",gap:22,flexWrap:"wrap"}}>
            {["AI Deliverable Auditing","KYC Verified Parties","Smart Dispute AI"].map(b=><div key={b} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(255,255,255,.6)"}}>{b}</div>)}
          </div>
        </div>
        <div className="fu2" style={{paddingBottom:48}}>
          <div style={{background:"rgba(255,255,255,.07)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.14)",borderRadius:20,padding:"26px 22px",boxShadow:"0 28px 60px rgba(0,0,0,.28)"}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:18}}>Start a Tech Escrow</div>
            <div style={{display:"flex",background:"rgba(0,0,0,.22)",borderRadius:9,padding:3,marginBottom:18}}>
              {[["client","Client"],["provider","Provider"]].map(([v,l])=><button key={v} onClick={()=>setRole(v)} style={{flex:1,padding:"8px 0",border:"none",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12.5,transition:"all .15s",background:role===v?T.white:"transparent",color:role===v?T.primary:"rgba(255,255,255,.6)",boxShadow:role===v?"0 2px 8px rgba(0,0,0,.15)":"none"}}>{l}</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:18}}>
              {CATS.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{border:`1.5px solid ${cat===c.id?c.color:"rgba(255,255,255,.12)"}`,borderRadius:8,padding:"8px 4px",cursor:"pointer",textAlign:"center",background:cat===c.id?"rgba(255,255,255,.13)":"rgba(255,255,255,.04)",transition:"all .15s"}}><span className="msym" style={{fontSize:16,color:"#fff"}}>{c.icon}</span><div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,.85)",marginTop:2,lineHeight:1.2}}>{c.label}</div></button>)}
            </div>
            <div style={{display:"flex",marginBottom:14}}>
              <div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,.4)",fontSize:14}}>$</span><input type="number" placeholder="Project value" value={amt} onChange={e=>setAmt(e.target.value)} style={{width:"100%",padding:"11px 11px 11px 26px",background:"rgba(0,0,0,.25)",border:"1.5px solid rgba(255,255,255,.14)",borderRight:"none",borderRadius:"8px 0 0 8px",color:T.white,fontSize:14,outline:"none"}}/></div>
              <select value={cur} onChange={e=>setCur(e.target.value)} style={{padding:"11px 9px",background:"rgba(0,0,0,.35)",border:"1.5px solid rgba(255,255,255,.14)",borderRadius:"0 8px 8px 0",color:T.white,fontSize:13,outline:"none",cursor:"pointer",minWidth:68}}>{CURR.map(c=><option key={c} style={{background:"#0f3d7a"}}>{c}</option>)}</select>
            </div>
            <Btn variant="accent" style={{width:"100%",fontSize:14,padding:"12px 0",borderRadius:9}} onClick={onSignup}>{role==="client"?"Protect My Payment →":"Get Paid on Delivery →"}</Btn>
            <p style={{textAlign:"center",fontSize:11.5,color:"rgba(255,255,255,.35)",marginTop:9}}>Free to register · AI audit included on every project</p>
          </div>
        </div>
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.08)",marginTop:40,padding:"16px 0"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",padding:"0 1.5rem"}}>
          <span style={{fontSize:11.5,color:"rgba(255,255,255,.35)",marginRight:16,whiteSpace:"nowrap"}}>Trusted for:</span>
          {["Software builds","Mobile apps","Website delivery","Cloud migrations","AI model dev","Security audits"].map(d=><span key={d} style={{fontSize:11.5,fontWeight:600,color:"rgba(255,255,255,.28)",padding:"4px 14px",borderRight:"1px solid rgba(255,255,255,.08)",whiteSpace:"nowrap"}}>{d}</span>)}
        </div>
      </div>
    </section>
  );
};

/* ═══ STATS ═════════════════════════════════════════════════ */
const Stats=()=>(
  <section style={{background:T.white,borderTop:`1px solid ${T.gray100}`,borderBottom:`1px solid ${T.gray100}`,padding:"28px 1.5rem"}}>
    <div className="sg" style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,textAlign:"center"}}>
      {[["$5B+","Total value protected"],["1.8M+","Customers worldwide"],["10","Tech service categories"],["98.7%","Dispute-free rate"]].map(([n,l])=>(
        <div key={l} style={{padding:"16px 12px",borderRadius:12,background:T.offWhite,border:`1px solid ${T.gray100}`}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"clamp(20px,3vw,30px)",letterSpacing:"-.4px",color:T.primary}}>{n}</div>
          <div style={{fontSize:12.5,color:T.gray500,marginTop:3}}>{l}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ═══ WORKFLOW (9 steps from document) ══════════════════════ */
const Workflow=({onSignup})=>{
  const steps=[
    {n:1,icon:"assignment",title:"Project Creation",      desc:"Client creates the project, describes requirements in plain English, and invites the service provider.",color:"#3b82f6",badge:"Initiation"},
    {n:2,icon:"description",title:"Contract Generation",   desc:"AI automatically drafts a binding escrow contract covering deliverables, timelines, revision rounds, and dispute terms.",color:"#8b5cf6",badge:"AI Contract"},
    {n:3,icon:"credit_card",title:"Escrow Funding",        desc:"Client deposits funds into a regulated trust account. The provider is notified to begin work.",color:"#10b981",badge:"Protected"},
    {n:4,icon:"settings", title:"Project Execution",    desc:"Provider works on the project. AI Project Health Monitor tracks progress and flags risks in real time.",color:"#006c47",badge:"AI Monitor"},
    {n:5,icon:"upload_file",title:"Deliverable Submission",desc:"Provider submits final work — code repo, designs, live URL, documents, or deployment link.",color:"#6366f1",badge:"Submission"},
    {n:6,icon:"smart_toy",title:"AI Audit",              desc:"AI Deliverable Auditor checks completeness, quality, and scope compliance automatically across all file types.",color:"#0d9488",badge:"AI Audit"},
    {n:7,icon:"check_circle",title:"Approval / Revision",   desc:"Client reviews the AI report and approves or raises a structured revision request with specific feedback.",color:"#006c47",badge:"Review"},
    {n:8,icon:"payments",title:"Payment Release",       desc:"On approval, funds release instantly to the provider's account. Transaction marked complete.",color:"#1e9e5e",badge:"Paid"},
    {n:9,icon:"gavel", title:"Dispute Resolution",   desc:"If unresolved, AI Dispute Assistant generates an objective case summary for admin arbitration.",color:"#e53e3e",badge:"AI Dispute"},
  ];
  return(
    <section style={{background:T.offWhite,padding:"90px 1.5rem"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <ST badge="Complete Escrow Workflow" title="9-Step AI-Powered Process" sub="Every stage of the tech services lifecycle — protected, verified, and AI-audited end to end."/>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {steps.map(s=>(
            <div key={s.n} className="ch" style={{background:T.white,border:`1.5px solid ${T.gray100}`,borderRadius:14,padding:"22px 20px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:14,right:14}}><Badge color={s.color}>{s.badge}</Badge></div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:42,height:42,background:s.color+"18",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}><span className="msym" style={{fontSize:20,color:s.color||T.primary}}>{s.icon}</span></div>
                <span style={{fontSize:11,fontWeight:700,color:T.gray400}}>Step {s.n} of 9</span>
              </div>
              <h3 style={{fontWeight:700,fontSize:14,color:T.primary,marginBottom:7}}>{s.title}</h3>
              <p style={{fontSize:13,color:T.gray500,lineHeight:1.75}}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:44}}><Btn variant="primary" onClick={onSignup} style={{fontSize:15,padding:"13px 30px"}}>Start a Project →</Btn></div>
      </div>
    </section>
  );
};

/* ═══ SERVICE CATEGORIES (all 10 from document) ════════════ */
const Categories=({onSignup})=>{
  const cats=[
    {icon:"terminal",title:"Software Development",   desc:"Backend, APIs, SaaS. AI checks code structure, test coverage, and feature completeness.",    color:"#3b82f6"},
    {icon:"smartphone",title:"Mobile App Development", desc:"iOS, Android, cross-platform. AI audits APK/IPA builds, screenshots, and feature parity.", color:"#8b5cf6"},
    {icon:"public",title:"Website Development",    desc:"Landing pages, e-commerce, CMS. Automated crawl verifies live URL and design spec.",        color:"#10b981"},
    {icon:"palette",title:"UI/UX & Product Design", desc:"Figma files, prototypes, style guides. AI reviews against signed-off design briefs.",        color:"#ec4899"},
    {icon:"security",title:"Cybersecurity Services", desc:"Pen testing, audits, compliance. AI validates report completeness and CVE findings.",         color:"#ef4444"},
    {icon:"☁️", title:"Cloud & DevOps",         desc:"Infrastructure, CI/CD, migrations. Verified against architecture and deployment specs.",    color:"#006c47"},
    {icon:"smart_toy",title:"AI Development",         desc:"Model training, fine-tuning, integrations. Benchmark results and accuracy verified.",         color:"#6366f1"},
    {icon:"computer",title:"IT Consulting",           desc:"Strategy docs, roadmaps, advisory. Reviewed for completeness and scope alignment.",          color:"#0d9488"},
    {icon:"bar_chart",title:"Data Analytics",         desc:"Dashboards, pipelines, reports. Verified for accuracy, coverage, and spec compliance.",       color:"#006c47"},
    {icon:"article",title:"Technical Documentation",desc:"API docs, SOPs, wikis. AI checks completeness, accuracy, and scope match.",                   color:"#64748b"},
  ];
  return(
    <section style={{padding:"90px 1.5rem",background:T.white}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <ST badge="10 Supported Service Categories" title="Every tech service, fully protected" sub="AI auditing is built-in for every category — so both parties always know what 'done' means."/>
        <div className="g5" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
          {cats.map(c=>(
            <div key={c.title} className="fc ch" style={{border:`1.5px solid ${T.gray100}`,borderRadius:14,padding:"22px 18px",background:T.white,cursor:"pointer"}}>
              <div style={{width:46,height:46,background:c.color+"16",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><span className="msym" style={{fontSize:22,color:c.color}}>{c.icon}</span></div>
              <h3 style={{fontWeight:700,fontSize:13,color:T.primary,marginBottom:7,lineHeight:1.35}}>{c.title}</h3>
              <p style={{fontSize:12,color:T.gray500,lineHeight:1.7}}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:44}}>
          <Btn variant="primary" onClick={onSignup} style={{marginRight:12}}>Get Protected Now</Btn>
          
        </div>
      </div>
    </section>
  );
};

/* ═══ AI FEATURES (7 from document) ════════════════════════ */
const AIFeatures=({onSignup})=>{
  const f=[
    {icon:"assignment",title:"AI Scope Generator",        desc:"Describe your project in plain English. AI generates a detailed technical scope, acceptance criteria, and milestones.",  color:T.teal,    badge:"Scope"},
    {icon:"description",title:"AI Contract Generator",     desc:"Automatically drafts legally-sound escrow contracts covering deliverables, timelines, revision rounds, and dispute terms.",color:"#8b5cf6",badge:"Contract"},
    {icon:"search",title:"AI Deliverable Auditor",    desc:"Checks submitted work against the agreed scope before any payment releases. Supports code, designs, websites, and docs.", color:T.primary, badge:"Audit"},
    {icon:"shield",title:"AI Fraud Detection",        desc:"Real-time risk scoring on every party and transaction. Flags anomalies and suspicious patterns before funds move.",         color:T.red,     badge:"Security"},
    {icon:"gavel", title:"AI Dispute Assistant",     desc:"Reconstructs the project timeline, analyses all messages and files, and generates an objective case brief for arbitration.",color:T.accent,  badge:"Dispute"},
    {icon:"trending_up",title:"AI Risk Scoring",           desc:"Continuously scores project risk based on communication patterns, timeline adherence, scope changes, and payment history.", color:"#6366f1", badge:"Risk"},
    {icon:"sensors",title:"AI Project Health Monitor", desc:"Tracks scope creep, deadline risk, and communication gaps throughout the project. Proactive alerts protect both parties.",   color:T.green,   badge:"Health"},
  ];
  return(
    <section style={{background:`linear-gradient(150deg,${T.primaryDk} 0%,${T.primary} 100%)`,padding:"90px 1.5rem"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <ST light badge="7 AI-Powered Features" title="Built-in AI, end to end" sub="Not just an escrow wallet — an intelligent platform that understands your project at every stage."/>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {f.map(x=>(
            <div key={x.title} style={{background:"rgba(255,255,255,.07)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:"24px 20px",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div style={{width:46,height:46,background:x.color+"28",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><span className="msym" style={{fontSize:22,color:x.color}}>{x.icon}</span></div>
                <Badge color={x.color}>{x.badge}</Badge>
              </div>
              <h3 style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:9}}>{x.title}</h3>
              <p style={{fontSize:12.5,color:"rgba(255,255,255,.58)",lineHeight:1.8}}>{x.desc}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:48}}><Btn variant="accent" onClick={onSignup} style={{fontSize:15,padding:"13px 32px"}}>Try AI Features Free →</Btn></div>
      </div>
    </section>
  );
};

/* ═══ TECHNICAL AUDITING (6 audit types from document) ═════ */
const TechAuditing=()=>{
  const a=[
    {icon:"public",title:"Website Audits",                 desc:"Automated crawl of live URL. Checks page load, broken links, mobile responsiveness, and feature completeness.",color:"#10b981"},
    {icon:"smartphone",title:"Mobile Application Audits",      desc:"Runs APK/IPA in a sandbox. Verifies features, screens, and performance benchmarks against the brief.",        color:"#8b5cf6"},
    {icon:"terminal",title:"Code Repository Analysis",       desc:"Clones the repo and analyses structure, test coverage, dependencies, code quality, and security.",            color:"#3b82f6"},
    {icon:"palette",title:"UI/UX Reviews",                  desc:"Compares submitted Figma files against the original brief. Checks completeness of screens and style guides.",  color:"#ec4899"},
    {icon:"security",title:"Cybersecurity Report Validation",desc:"Validates pentest reports for required sections, CVE references, severity ratings, and remediation coverage.", color:"#ef4444"},
    {icon:"article",title:"Documentation Completeness",     desc:"Checks docs against agreed table of contents. Flags missing sections, examples, or screenshots.",              color:"#64748b"},
  ];
  return(
    <section style={{padding:"90px 1.5rem",background:T.offWhite}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <ST badge="Technical Auditing Engine" title="How the AI Auditor works" sub="Purpose-built checks for every deliverable type — specialist audits for each service category."/>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {a.map(x=>(
            <div key={x.title} className="fc ch" style={{background:T.white,border:`1.5px solid ${T.gray100}`,borderRadius:14,padding:"26px 22px"}}>
              <div style={{width:50,height:50,background:x.color+"16",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}><span className="msym" style={{fontSize:24,color:x.color}}>{x.icon}</span></div>
              <h3 style={{fontWeight:700,fontSize:14,color:T.primary,marginBottom:9}}>{x.title}</h3>
              <p style={{fontSize:13,color:T.gray500,lineHeight:1.75}}>{x.desc}</p>
              <div style={{marginTop:14,fontSize:12.5,fontWeight:700,color:x.color}}>Learn more →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ VERIFICATION SYSTEM (5 levels from document) ═════════ */
const Verification=()=>{
  const v=[
    {icon:"mail",title:"Email Verification",        desc:"Required for all accounts before any transaction.",                         req:"All accounts",     color:"#10b981"},
    {icon:"smartphone",title:"Phone Verification",         desc:"SMS two-factor authentication for account security.",                       req:"Recommended",       color:"#3b82f6"},
    {icon:"badge",title:"Identity Verification",      desc:"Government-issued ID check (Passport, Driver's Licence, NIN).",            req:"$500+ transactions",color:"#8b5cf6"},
    {icon:"business",title:"Business Verification",      desc:"Company registration, VAT, and director identity checks.",                  req:"Business accounts",  color:"#006c47"},
    {icon:"workspace_premium",title:"Premium Manual Verification",desc:"Dedicated compliance officer review for high-value enterprise accounts.",   req:"$50k+ accounts",    color:"#ef4444"},
  ];
  return(
    <section style={{background:T.white,padding:"90px 1.5rem"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <ST badge="5-Level Verification System" title="KYC & Identity protection" sub="Graded verification ensures every counterparty is who they say they are — before a single dollar enters escrow."/>
        <div style={{display:"flex",gap:0,overflowX:"auto",paddingBottom:8}}>
          {v.map((x,i)=>(
            <div key={x.title} style={{flex:1,minWidth:200,padding:"0 14px",textAlign:"center",position:"relative"}}>
              <div style={{width:64,height:64,background:x.color+"16",border:`2px solid ${x.color}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}><span className="msym" style={{fontSize:26,color:x.color}}>{x.icon}</span></div>
              <h3 style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:7}}>{x.title}</h3>
              <p style={{fontSize:12.5,color:T.gray500,lineHeight:1.7,marginBottom:10}}>{x.desc}</p>
              <span style={{fontSize:11,fontWeight:700,color:x.color,background:x.color+"14",padding:"3px 10px",borderRadius:20}}>Required: {x.req}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


/* ═══ PRICING / MONETIZATION ════════════════════════════════ */
const Pricing=({onSignup})=>{
  const plans=[
    {name:"Starter",  price:0,   per:"Free",   badge:"Get going",  bc:T.primary, features:["Up to 3 active transactions","AI Scope Generator","AI Deliverable Auditor","Email + phone verification","Standard escrow fees apply","Email support"],cta:"Get Started Free",v:"outline"},
    {name:"Pro",      price:29,  per:"/mo",    badge:"Best Value",  bc:T.accent,  features:["Unlimited transactions","All 7 AI features","Priority AI audit queue","Identity + business KYC","0.5% off escrow fees","Priority support","Advanced reporting"],cta:"Start Pro Trial",v:"accent"},
    {name:"Enterprise",price:null,per:"Custom",badge:"White Label",bc:T.teal,    features:["Everything in Pro","White-label escrow","Custom escrow API","Agency multi-user dashboard","Approval workflows","Dedicated account manager","SLA guarantee","Custom integrations"],cta:"Contact Sales",v:"dark"},
  ];
  return(
    <section style={{padding:"90px 1.5rem",background:T.white}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <ST badge="Subscription Plans" title="Simple, transparent pricing" sub="Escrow fees apply on all plans. Subscription unlocks AI features and reduced rates."/>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22,maxWidth:1000,margin:"0 auto 48px"}}>
          {plans.map(p=>(
            <div key={p.name} style={{border:`2px solid ${p.v==="accent"?T.accent:T.gray100}`,borderRadius:20,padding:"30px 26px",background:p.v==="accent"?`linear-gradient(135deg,${T.primary}08,${T.accent}08)`:T.white,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:20,right:20}}><Badge color={p.bc}>{p.badge}</Badge></div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:22,color:T.primary,marginBottom:8}}>{p.name}</div>
              <div style={{marginBottom:22}}>
                {p.price===null?<span style={{fontFamily:"'Inter',sans-serif",fontSize:28,fontWeight:800,color:T.primary}}>Custom</span>:<><span style={{fontFamily:"'Inter',sans-serif",fontSize:40,fontWeight:800,color:T.primary}}>${p.price}</span><span style={{fontSize:16,color:T.gray500}}>{p.per}</span></>}
              </div>
              <div style={{borderTop:`1px solid ${T.gray100}`,paddingTop:18,marginBottom:24}}>
                {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"flex-start",gap:9,fontSize:13.5,color:T.gray700,marginBottom:10}}><span style={{color:T.green,fontWeight:700,flexShrink:0,marginTop:1}}>✓</span>{f}</div>)}
              </div>
              <Btn variant={p.v} onClick={onSignup} style={{width:"100%",fontSize:14}}>{p.cta}</Btn>
            </div>
          ))}
        </div>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,maxWidth:1000,margin:"0 auto"}}>
          {[{icon:"credit_card",title:"Escrow Fees",       desc:"From 1.25%–3.25% per transaction, tiered by value."},{icon:"smart_toy",title:"AI Audit Fees",     desc:"Per-use AI audits from $5/audit on Starter plan."},{icon:"local_offer",title:"White-Label Escrow", desc:"Full custom branding and domain for your platform."},{icon:"cable",title:"Escrow API Access", desc:"REST API with webhooks, sandbox, and SDKs."}].map(m=>(
            <div key={m.title} style={{background:T.offWhite,borderRadius:14,padding:"20px 18px",border:`1px solid ${T.gray100}`,textAlign:"center"}}>
              <span className="msym" style={{fontSize:28,color:T.primary,display:"block",marginBottom:10}}><span className="msym" style={{fontSize:22,color:T.primary}}>{m.icon}</span></span>
              <div style={{fontWeight:700,fontSize:14,color:T.primary,marginBottom:6}}>{m.title}</div>
              <p style={{fontSize:12.5,color:T.gray500,lineHeight:1.7}}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ ENTERPRISE ════════════════════════════════════════════ */
const Enterprise=({onSignup})=>(
  <section style={{background:T.offWhite,padding:"90px 1.5rem"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <ST badge="Enterprise & Agency" title="Built for teams and agencies" sub="Multi-user organizations, approval workflows, advanced reporting, and API integrations — all under your own brand."/>
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:36}}>
        {[{icon:"business",title:"Agency Dashboards",        desc:"Centralized view of all client projects, statuses, and outstanding payments across the whole organization."},
          {icon:"group",title:"Multi-User Organizations",  desc:"Role-based permissions — view-only, approver, or admin. Supports unlimited users on a single workspace."},
          {icon:"check_circle",title:"Approval Workflows",        desc:"Require internal sign-off before releasing escrow funds. Multi-stage approval chains with full audit trail."},
          {icon:"bar_chart",title:"Advanced Reporting",        desc:"Transaction volume, fee summaries, dispute rates, AI audit pass rates. Export to CSV or via the API."},
          {icon:"cable",title:"API Integrations",          desc:"Full REST API with webhooks, sandbox, and SDKs for Node.js, Python, PHP, and Go."},
          {icon:"local_offer",title:"White-Label Escrow",        desc:"Use your own domain, logo, and brand colours. Clients see your brand — not VaultPay."},
          {icon:"handshake",title:"Dedicated Account Manager", desc:"Assigned account manager for onboarding, support, and custom integration assistance."},
          {icon:"assignment",title:"Custom SLA",                desc:"Guaranteed 99.9% uptime, priority support queue, and custom dispute resolution timelines."},
        ].map(f=>(
          <div key={f.title} className="fc ch" style={{background:T.white,border:`1.5px solid ${T.gray100}`,borderRadius:14,padding:"22px 20px"}}>
            <span className="msym" style={{fontSize:26,color:T.primary,display:"block",marginBottom:12}}><span className="msym" style={{fontSize:24,color:T.primary}}>{f.icon}</span></span>
            <h3 style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:8}}>{f.title}</h3>
            <p style={{fontSize:12.5,color:T.gray500,lineHeight:1.7}}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center"}}>
        <Btn variant="dark" onClick={onSignup} style={{fontSize:15,padding:"13px 32px",marginRight:12}}>Contact Sales</Btn>
        <Btn variant="outline" style={{fontSize:14}}>View API Docs</Btn>
      </div>
    </div>
  </section>
);

/* ═══ SECURITY ══════════════════════════════════════════════ */
const Security=()=>(
  <section style={{background:T.white,padding:"90px 1.5rem"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <ST badge="Security & Compliance" title="Licensed, verified, and trusted"/>
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
        {[{icon:"account_balance️",title:"Fully Licensed",         desc:"Licensed and bonded under financial regulations. Regular government audits."},
          {icon:"emoji_events",title:"BBB A+ Rated",            desc:"Highest possible BBB rating for ethical business standards."},
          {icon:"security",title:"256-bit SSL",             desc:"All data and transactions protected with bank-grade encryption end to end."},
          {icon:"shield",title:"Government Audited",      desc:"Independent audits verify safety, soundness, and full regulatory compliance."},
          {icon:"payments",title:"Funds Held in Trust",     desc:"All escrow funds in regulated, segregated trust accounts — never mixed with company funds."},
          {icon:"block",title:"Zero Chargebacks",        desc:"Once payment enters escrow it cannot be reversed. Providers are completely protected."},
          {icon:"language",title:"30+ Countries",           desc:"Multi-currency support. Wire, ACH, card, and crypto accepted."},
          {icon:"phone",title:"24/7 Support",            desc:"Real humans via phone, email, and chat. Specialists personally handle complex disputes."},
        ].map(f=>(
          <div key={f.title} className="fc ch" style={{background:T.white,border:`1.5px solid ${T.gray100}`,borderRadius:14,padding:"24px 20px"}}>
            <span className="msym" style={{fontSize:26,color:T.primary,display:"block",marginBottom:12}}><span className="msym" style={{fontSize:24,color:T.primary}}>{f.icon}</span></span>
            <h3 style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:8}}>{f.title}</h3>
            <p style={{fontSize:12.5,color:T.gray500,lineHeight:1.7}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══ TESTIMONIALS ══════════════════════════════════════════ */
const Testimonials=()=>(
  <section style={{padding:"90px 1.5rem",background:T.offWhite}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <ST badge="Client Stories" title="1.8M+ customers trust VaultPay"/>
      <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
        {[{n:"Tunde A.", r:"Startup CTO",     t:"We used VaultPay for a $40k backend build. The AI audit caught a missing API endpoint before we released payment. Worth every cent.",stars:5},
          {n:"Sarah K.", r:"Product Manager", t:"The AI scope generator saved me two hours of back-and-forth. Incredible platform — exactly what tech services have always needed.",stars:5},
          {n:"David L.", r:"Freelance Dev",   t:"As a provider I love that clients can't withhold payment arbitrarily. The AI audit proves the work is complete. Total peace of mind.",stars:5},
          {n:"Aisha M.", r:"Agency Director", t:"We ran three simultaneous projects. The health monitor flagged one going off-track early. Dispute avoided entirely.",stars:5},
          {n:"James T.", r:"SaaS Founder",    t:"The AI contract generator produced something more thorough than what our lawyer drafted manually. Saved us $800 in legal fees.",stars:5},
          {n:"Priya N.", r:"IT Consultant",   t:"My client raised a dispute but the AI case summary was so clear the admin resolved it in 48 hours — entirely in my favour.",stars:5},
        ].map(x=>(
          <div key={x.n} className="ch" style={{border:`1.5px solid ${T.gray100}`,borderRadius:14,padding:"26px 22px",background:T.white}}>
            <div style={{display:"flex",gap:2,marginBottom:12}}>{Array(x.stars).fill(0).map((_,i)=><span key={i} style={{color:T.gold,fontSize:17}}>★</span>)}</div>
            <p style={{fontSize:13.5,color:T.gray700,lineHeight:1.8,fontStyle:"italic",marginBottom:18}}>"{x.t}"</p>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:38,height:38,background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:T.white,fontWeight:700,fontSize:14}}>{x.n[0]}</div>
              <div><div style={{fontWeight:700,fontSize:13.5,color:T.primary}}>{x.n}</div><div style={{fontSize:12,color:T.gray500}}>{x.r}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══ FAQ ════════════════════════════════════════════════════ */
const FAQ=()=>{
  const [op,setOp]=useState(null);
  const qs=[
    {q:"What makes VaultPay different from regular escrow?",a:"VaultPay is built specifically for tech services. Every transaction includes AI scope generation, contract drafting, deliverable auditing, fraud detection, and dispute assistance — so both parties always agree on what 'done' means before any money moves."},
    {q:"How does the AI Deliverable Auditor work?",a:"When a provider submits work, the Auditor checks it against the agreed scope. For code it analyses the repo structure, test coverage, and feature completeness. For websites it crawls the live URL. For designs it compares files against the brief. For documents it checks completeness against the agreed table of contents."},
    {q:"What are the 9 steps of the escrow workflow?",a:"Project Creation → Contract Generation → Escrow Funding → Project Execution → Deliverable Submission → AI Audit → Approval / Revision Request → Payment Release → Dispute Resolution (if needed). Every step is tracked and timestamped."},
    {q:"What happens during a dispute?",a:"The AI Dispute Assistant automatically reconstructs the project timeline, analyses all messages and files, and produces an objective case brief. A Dispute Resolution Officer reviews and issues a binding decision within 5 business days. Both parties can upload evidence."},
    {q:"Which verification level do I need?",a:"Email verification is required for all users. For transactions above $500, identity verification (government ID) is required. Business accounts require business verification. Premium manual KYC is available for enterprise accounts."},
    {q:"Can projects have multiple milestones?",a:"Yes. Projects can be split into up to 10 milestones, each with its own scope, deliverable, and escrowed payment. AI audits each milestone independently before that milestone's funds release."},
    {q:"Is there a subscription required?",a:"No. The Starter plan is free — you only pay escrow fees (1.25%–3.25%) on successful transactions. Pro ($29/mo) and Enterprise plans unlock unlimited transactions, all 7 AI features, reduced fees, and priority support."},
  ];
  return(
    <section style={{background:T.white,padding:"90px 1.5rem"}}>
      <div style={{maxWidth:840,margin:"0 auto"}}>
        <ST badge="FAQ" title="Common Questions"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {qs.map((f,i)=>(
            <div key={i} style={{background:T.white,border:`1.5px solid ${op===i?T.accent:T.gray100}`,borderRadius:12,overflow:"hidden",transition:"border-color .18s"}}>
              <div onClick={()=>setOp(op===i?null:i)} style={{padding:"18px 22px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",userSelect:"none"}}>
                <span style={{fontWeight:600,fontSize:14.5,color:T.primary,paddingRight:12}}>{f.q}</span>
                <span style={{fontSize:22,color:T.accent,flexShrink:0,transform:op===i?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
              </div>
              {op===i&&<div style={{padding:"0 22px 18px",fontSize:13.5,color:T.gray600,lineHeight:1.8,animation:"fadeIn .2s ease"}}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══ CTA BANNER ════════════════════════════════════════════ */
const CTA=({onSignup})=>(
  <section style={{padding:"0 1.5rem 90px"}}>
    <div className="ctar" style={{maxWidth:1240,margin:"0 auto",background:`linear-gradient(135deg,${T.primary},${T.primaryDk})`,borderRadius:20,padding:"clamp(36px,5vw,64px) clamp(28px,5vw,60px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:36,flexWrap:"wrap"}}>
      <div>
        <h2 style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(26px,3.5vw,40px)",color:T.white,fontWeight:700,letterSpacing:"-.5px",lineHeight:1.2,marginBottom:10}}>Ready to protect your next project?</h2>
        <p style={{fontSize:15,color:"rgba(255,255,255,.65)"}}>Free to join. AI audit included. Only charged on successful releases.</p>
      </div>
      <Btn onClick={onSignup} style={{background:T.white,color:T.primary,fontSize:16,padding:"14px 32px",flexShrink:0,fontWeight:800,borderRadius:10}}>Create Free Account →</Btn>
    </div>
  </section>
);

/* ═══ AUTH MODAL ════════════════════════════════════════════ */
/* ═══ AUTH PAGE SHELL ═══════════════════════════════════════ */
const AUTH_CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
  .msym{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;display:inline-block;line-height:1;text-transform:none;letter-spacing:normal;white-space:nowrap;}
  .auth-input{width:100%;height:52px;padding-left:48px;padding-right:16px;background:#f5f3f6;border:1.5px solid #c5c6cf;border-radius:10px;font-size:15px;color:#1b1b1e;outline:none;font-family:'Inter',sans-serif;transition:border-color .18s,box-shadow .18s;}
  .auth-input:focus{border-color:#001637;box-shadow:0 0 0 3px rgba(0,22,55,.08);}
  .auth-input-pr{padding-right:48px;}
  .auth-btn-primary{width:100%;height:52px;background:#001637;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Inter',sans-serif;transition:opacity .18s,transform .12s;}
  .auth-btn-primary:hover{opacity:.88;transform:translateY(-1px);}
  .auth-btn-primary:active{transform:scale(.98);}
  .auth-btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none;}
  .auth-btn-social{flex:1;height:48px;border:1.5px solid #c5c6cf;border-radius:10px;background:#fff;font-size:13.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Inter',sans-serif;color:#1b1b1e;transition:background .15s,border-color .15s;}
  .auth-btn-social:hover{background:#f5f3f6;border-color:#001637;}
  .auth-card{background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border:1px solid rgba(197,198,207,.5);border-radius:20px;padding:36px 32px;box-shadow:0 8px 40px rgba(0,22,55,.1);}
  .auth-role-btn{flex:1;padding:10px 0;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'Inter',sans-serif;}
  .auth-bg-blob{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0;}
  @media(max-width:480px){.auth-card{padding:24px 18px;border-radius:14px;}}
`;

const AuthShell=({children,navigate})=>(
  <div style={{minHeight:"100vh",background:"#fbf9fc",fontFamily:"'Inter',sans-serif",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
    <style>{AUTH_CSS}</style>
    {/* Background blobs */}
    <div className="auth-bg-blob" style={{width:420,height:420,background:"rgba(0,22,55,.06)",top:"-12%",right:"-8%"}}/>
    <div className="auth-bg-blob" style={{width:320,height:320,background:"rgba(130,249,190,.18)",bottom:"-10%",left:"-6%"}}/>
    {/* Header */}
    <header style={{background:"#fff",borderBottom:"1px solid #e4e2e5",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.5rem",position:"sticky",top:0,zIndex:10,boxShadow:"0 1px 0 #e4e2e5"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("home")}>
        <div style={{width:36,height:36,background:"linear-gradient(135deg,#1a56a0,#0f3d7a)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:17,fontFamily:"'Inter',sans-serif"}}>V</span>
        </div>
        <span style={{fontWeight:800,fontSize:19,color:"#001637",letterSpacing:"-.4px"}}>Vault<span style={{color:"#006c47"}}>Pay</span></span>
      </div>
    </header>
    {/* Content */}
    <main style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px",position:"relative",zIndex:1}}>
      {children}
    </main>
  </div>
);

/* ═══ LOGIN PAGE ═════════════════════════════════════════════ */
const LoginPage=({onSuccess,navigate})=>{
  const [fm,setFm]=useState({email:"",password:""});
  const [showPw,setShowPw]=useState(false);
  const [err,setErr]=useState("");const [ld,setLd]=useState(false);const [done,setDone]=useState(false);
  const h=k=>e=>setFm(p=>({...p,[k]:e.target.value}));
  const sub=e=>{
    e.preventDefault();setErr("");
    if(!fm.email||!fm.password)return setErr("Please fill in all fields.");
    setLd(true);
    setTimeout(()=>{setLd(false);setDone(true);setTimeout(()=>onSuccess({name:"User",role:"client",email:fm.email}),900);},1300);
  };
  return(
    <AuthShell navigate={navigate}>
      <div style={{width:"100%",maxWidth:440}}>
        {/* Brand hero */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,#001637,#172b4d)",marginBottom:14,boxShadow:"0 8px 24px rgba(0,22,55,.22)"}}>
            <span className="msym" style={{fontSize:28,color:"#fff"}}>shield_lock</span>
          </div>
          <h1 style={{fontFamily:"'Inter',sans-serif",fontSize:28,fontWeight:700,color:"#001637",letterSpacing:"-.4px",marginBottom:6}}>Welcome back</h1>
          <p style={{fontSize:14,color:"#44474e",lineHeight:1.6}}>Sign in to your VaultPay account</p>
        </div>
        <div className="auth-card">
          {done?(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{width:56,height:56,background:"#f0fdf4",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><span className="msym" style={{fontSize:30,color:"#1e9e5e"}}>check_circle</span></div>
              <div style={{fontWeight:700,fontSize:18,color:"#001637",marginBottom:5}}>Signed in!</div>
              <div style={{fontSize:13.5,color:"#75777f"}}>Redirecting you now…</div>
            </div>
          ):(
            <form onSubmit={sub} style={{display:"flex",flexDirection:"column",gap:18}}>
              {err&&<div style={{background:"#ffdad6",border:"1px solid #ba1a1a33",borderRadius:9,padding:"10px 14px",fontSize:13.5,color:"#93000a",display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:18}}>error</span>{err}</div>}
              {/* Email */}
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:6,letterSpacing:".02em"}}>EMAIL ADDRESS</label>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>mail</span>
                  <input className="auth-input" type="email" placeholder="name@company.com" value={fm.email} onChange={h("email")} required/>
                </div>
              </div>
              {/* Password */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <label style={{fontSize:12.5,fontWeight:700,color:"#44474e",letterSpacing:".02em"}}>PASSWORD</label>
                  <span style={{fontSize:12.5,color:"#1a56a0",cursor:"pointer",fontWeight:600}} onClick={()=>navigate("forgot")}>Forgot password?</span>
                </div>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>lock</span>
                  <input className="auth-input auth-input-pr" type={showPw?"text":"password"} placeholder="••••••••" value={fm.password} onChange={h("password")} required/>
                  <button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#75777f",display:"flex",alignItems:"center"}}>
                    <span className="msym" style={{fontSize:20}}>{showPw?"visibility_off":"visibility"}</span>
                  </button>
                </div>
              </div>
              {/* Remember */}
              <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13.5,color:"#44474e",userSelect:"none"}}>
                <input type="checkbox" style={{accentColor:"#001637",width:17,height:17}}/>
                Keep me signed in for 30 days
              </label>
              {/* Submit */}
              <button type="submit" className="auth-btn-primary" disabled={ld}>
                {ld?<><Spin/>Signing in…</>:<>Sign In <span className="msym" style={{fontSize:18}}>login</span></>}
              </button>
              {/* Divider */}
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1,height:1,background:"#c5c6cf"}}/>
                <span style={{fontSize:11,fontWeight:600,color:"#75777f",letterSpacing:".08em"}}>OR SIGN IN WITH</span>
                <div style={{flex:1,height:1,background:"#c5c6cf"}}/>
              </div>
              {/* Social */}
              <div style={{display:"flex",gap:10}}>
                <button type="button" className="auth-btn-social">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="auth-btn-social">
                  <span className="msym" style={{fontSize:20,color:"#001637"}}>fingerprint</span>
                  Biometric
                </button>
              </div>
              {/* Footer link */}
              <p style={{textAlign:"center",fontSize:13.5,color:"#44474e",borderTop:"1px solid #e4e2e5",paddingTop:16,margin:0}}>
                New to VaultPay?{" "}
                <span style={{color:"#001637",fontWeight:700,cursor:"pointer"}} onClick={()=>navigate("signup")}>Create a free account →</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
};

/* ═══ SIGN UP PAGE ═══════════════════════════════════════════ */
const SignupPage=({onSuccess,navigate})=>{
  const [fm,setFm]=useState({name:"",email:"",password:"",confirm:"",role:"client"});
  const [showPw,setShowPw]=useState(false);const [showCf,setShowCf]=useState(false);
  const [err,setErr]=useState("");const [ld,setLd]=useState(false);const [done,setDone]=useState(false);
  const h=k=>e=>setFm(p=>({...p,[k]:e.target.value}));
  const sub=e=>{
    e.preventDefault();setErr("");
    if(!fm.name)return setErr("Full name is required.");
    if(!fm.email||!fm.password)return setErr("Please fill in all fields.");
    if(fm.password.length<8)return setErr("Password must be at least 8 characters.");
    if(fm.password!==fm.confirm)return setErr("Passwords do not match.");
    setLd(true);
    setTimeout(()=>{setLd(false);setDone(true);setTimeout(()=>onSuccess({name:fm.name,role:fm.role,email:fm.email}),900);},1300);
  };
  return(
    <AuthShell navigate={navigate}>
      <div style={{width:"100%",maxWidth:480}}>
        {/* Brand hero */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <h1 style={{fontFamily:"'Inter',sans-serif",fontSize:28,fontWeight:700,color:"#001637",letterSpacing:"-.4px",marginBottom:6}}>Create your account</h1>
          <p style={{fontSize:14,color:"#44474e",lineHeight:1.6}}>Join the most reliable escrow network for tech services.</p>
        </div>
        <div className="auth-card">
          {done?(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{width:56,height:56,background:"#f0fdf4",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><span className="msym" style={{fontSize:30,color:"#1e9e5e"}}>check_circle</span></div>
              <div style={{fontWeight:700,fontSize:18,color:"#001637",marginBottom:5}}>Account created!</div>
              <div style={{fontSize:13.5,color:"#75777f"}}>Redirecting you to your dashboard…</div>
            </div>
          ):(
            <form onSubmit={sub} style={{display:"flex",flexDirection:"column",gap:16}}>
              {err&&<div style={{background:"#ffdad6",border:"1px solid #ba1a1a33",borderRadius:9,padding:"10px 14px",fontSize:13.5,color:"#93000a",display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:18}}>error</span>{err}</div>}
              {/* Full Name */}
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:6,letterSpacing:".02em"}}>FULL NAME</label>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>person</span>
                  <input className="auth-input" type="text" placeholder="Your full name" value={fm.name} onChange={h("name")} required/>
                </div>
              </div>
              {/* Email */}
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:6,letterSpacing:".02em"}}>EMAIL ADDRESS</label>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>mail</span>
                  <input className="auth-input" type="email" placeholder="name@company.com" value={fm.email} onChange={h("email")} required/>
                </div>
              </div>
              {/* Password */}
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:6,letterSpacing:".02em"}}>PASSWORD</label>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>lock</span>
                  <input className="auth-input auth-input-pr" type={showPw?"text":"password"} placeholder="Min. 8 characters" value={fm.password} onChange={h("password")} required/>
                  <button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#75777f",display:"flex",alignItems:"center"}}>
                    <span className="msym" style={{fontSize:20}}>{showPw?"visibility_off":"visibility"}</span>
                  </button>
                </div>
              </div>
              {/* Confirm */}
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:6,letterSpacing:".02em"}}>CONFIRM PASSWORD</label>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>lock_reset</span>
                  <input className="auth-input auth-input-pr" type={showCf?"text":"password"} placeholder="Repeat password" value={fm.confirm} onChange={h("confirm")} required/>
                  <button type="button" onClick={()=>setShowCf(v=>!v)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#75777f",display:"flex",alignItems:"center"}}>
                    <span className="msym" style={{fontSize:20}}>{showCf?"visibility_off":"visibility"}</span>
                  </button>
                </div>
              </div>
              {/* Role */}
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:8,letterSpacing:".02em"}}>I AM JOINING AS</label>
                <div style={{display:"flex",gap:8}}>
                  {[["client","Client"],["provider","Service Provider"]].map(([v,l])=>(
                    <button key={v} type="button" className="auth-role-btn"
                      onClick={()=>setFm(p=>({...p,role:v}))}
                      style={{border:`1.5px solid ${fm.role===v?"#001637":"#c5c6cf"}`,background:fm.role===v?"rgba(0,22,55,.07)":"#fff",color:fm.role===v?"#001637":"#44474e"}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* Terms */}
              <label style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer",fontSize:13,color:"#44474e",lineHeight:1.55,userSelect:"none"}}>
                <input type="checkbox" required style={{accentColor:"#001637",width:16,height:16,marginTop:2,flexShrink:0}}/>
                I agree to the{" "}<span style={{color:"#001637",fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>Terms of Service</span>{" "}and{" "}<span style={{color:"#001637",fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>Privacy Policy</span>{" "}regarding my escrow transactions.
              </label>
              {/* Submit */}
              <button type="submit" className="auth-btn-primary" disabled={ld}>
                {ld?<><Spin/>Creating account…</>:<>Create Secure Account <span className="msym" style={{fontSize:18}}>arrow_forward</span></>}
              </button>
              {/* Divider */}
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1,height:1,background:"#c5c6cf"}}/>
                <span style={{fontSize:11,fontWeight:600,color:"#75777f",letterSpacing:".08em"}}>OR REGISTER WITH</span>
                <div style={{flex:1,height:1,background:"#c5c6cf"}}/>
              </div>
              {/* Social */}
              <div style={{display:"flex",gap:10}}>
                <button type="button" className="auth-btn-social">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="auth-btn-social">
                  <span className="msym" style={{fontSize:20,color:"#001637"}}>account_balance</span>
                  Bank ID
                </button>
              </div>
              {/* Footer link */}
              <p style={{textAlign:"center",fontSize:13.5,color:"#44474e",borderTop:"1px solid #e4e2e5",paddingTop:16,margin:0}}>
                Already have an account?{" "}
                <span style={{color:"#001637",fontWeight:700,cursor:"pointer"}} onClick={()=>navigate("login")}>Log in →</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
};

/* ═══ FORGOT PASSWORD PAGE ══════════════════════════════════ */
const ForgotPasswordPage=({navigate})=>{
  const [email,setEmail]=useState("");
  const [ld,setLd]=useState(false);const [sent,setSent]=useState(false);
  const sub=e=>{
    e.preventDefault();if(!email)return;
    setLd(true);
    setTimeout(()=>{setLd(false);setSent(true);},1400);
  };
  return(
    <AuthShell navigate={navigate}>
      <div style={{width:"100%",maxWidth:400}}>
        <div className="auth-card">
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:64,height:64,background:"rgba(0,22,55,.1)",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
              <span className="msym" style={{fontSize:30,color:"#001637"}}>lock_reset</span>
            </div>
            <h1 style={{fontFamily:"'Inter',sans-serif",fontSize:22,fontWeight:700,color:"#1b1b1e",marginBottom:8}}>Forgot Password?</h1>
            <p style={{fontSize:13.5,color:"#44474e",lineHeight:1.65}}>Enter your registered email and we'll send you a link to reset your password.</p>
          </div>
          {sent?(
            <div style={{textAlign:"center",padding:"8px 0 16px"}}>
              <div style={{width:52,height:52,background:"#f0fdf4",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><span className="msym" style={{fontSize:28,color:"#1e9e5e"}}>check_circle</span></div>
              <div style={{fontWeight:700,fontSize:16,color:"#001637",marginBottom:6}}>Reset link sent!</div>
              <p style={{fontSize:13.5,color:"#44474e",marginBottom:20}}>Check your inbox at <strong>{email}</strong>. The link expires in 30 minutes.</p>
              <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13.5,color:"#001637",fontWeight:700,cursor:"pointer"}} onClick={()=>navigate("login")}>
                <span className="msym" style={{fontSize:18}}>arrow_back</span> Back to Login
              </span>
            </div>
          ):(
            <form onSubmit={sub} style={{display:"flex",flexDirection:"column",gap:18}}>
              <div>
                <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#44474e",marginBottom:6,letterSpacing:".02em"}}>EMAIL ADDRESS</label>
                <div style={{position:"relative"}}>
                  <span className="msym" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"#75777f",pointerEvents:"none"}}>mail</span>
                  <input className="auth-input" type="email" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                </div>
              </div>
              <button type="submit" className="auth-btn-primary" disabled={ld}>
                {ld?<><Spin/>Sending…</>:<>Send Reset Link <span className="msym" style={{fontSize:18}}>arrow_forward</span></>}
              </button>
              <div style={{textAlign:"center"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:13.5,color:"#001637",fontWeight:700,cursor:"pointer"}} onClick={()=>navigate("login")}>
                  <span className="msym" style={{fontSize:18}}>arrow_back</span> Back to Login
                </span>
              </div>
            </form>
          )}
        </div>
        <p style={{textAlign:"center",marginTop:16,fontSize:11.5,color:"#75777f",lineHeight:1.6}}>
          VaultPay uses bank-grade encryption to protect your account and financial transactions.
        </p>
      </div>
    </AuthShell>
  );
};

/* ═══ KYC MODAL (5 levels) ══════════════════════════════════ */
const KYC=({onClose,onComplete})=>{
  const [step,setStep]=useState(1);const [fm,setFm]=useState({phone:"",idType:"passport",idNum:"",biz:false,bizName:"",bizReg:""});
  const [ld,setLd]=useState(false);const [done,setDone]=useState(false);
  const h=k=>e=>setFm(p=>({...p,[k]:e.target.value}));const total=fm.biz?3:2;
  const sub=()=>{setLd(true);setTimeout(()=>{setLd(false);setDone(true);setTimeout(onComplete,1000);},1600);};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.white,borderRadius:20,width:"100%",maxWidth:480,boxShadow:"0 32px 80px rgba(0,0,0,.22)",animation:"fadeUp .3s ease",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#065f46,#047857)",padding:"22px 26px",color:T.white,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:800,fontSize:17,display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:20}}>badge</span>Identity Verification (KYC)</div><div style={{fontSize:12,opacity:.65,marginTop:3}}>Step {step} of {total} · Required for transactions above $500</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"26px"}}>
          {done?(
            <div style={{textAlign:"center",padding:"20px 0"}}><span className="msym" style={{fontSize:48,color:T.green,display:"block",marginBottom:14}}>celebration</span><div style={{fontWeight:700,fontSize:18,color:T.green,marginBottom:6}}>Verification submitted!</div><div style={{fontSize:13.5,color:T.gray500}}>We'll notify you within 24 hours.</div></div>
          ):(<>
            <div style={{display:"flex",gap:6,marginBottom:22}}>{Array(total).fill(0).map((_,n)=><div key={n} style={{flex:1,height:4,borderRadius:2,background:step>n?"#047857":T.gray100,transition:"background .2s"}}/>)}</div>
            {step===1&&(
              <div style={{display:"flex",flexDirection:"column",gap:15}}>
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"13px 15px",fontSize:13,color:"#065f46",lineHeight:1.7}}><span className="msym" style={{fontSize:16,verticalAlign:"middle",marginRight:6}}>lock</span>Your data is encrypted and used only for verification. We follow NDPR/GDPR data protection standards.</div>
                <F label="Phone Number" req><input style={fs} type="tel" placeholder="+234 800 000 0000" value={fm.phone} onChange={h("phone")}/></F>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.gray700,marginBottom:8}}>ID Type *</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[["passport","Passport"],["drivers","Driver's Licence"],["national","National ID"]].map(([v,l])=><button key={v} type="button" onClick={()=>setFm(p=>({...p,idType:v}))} style={{padding:"8px 13px",border:`1.5px solid ${fm.idType===v?"#047857":T.gray100}`,borderRadius:8,background:fm.idType===v?"rgba(4,120,87,.07)":T.white,color:fm.idType===v?"#047857":T.gray600,fontSize:13,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
                  </div>
                </div>
                <F label="ID Number" req><input style={fs} placeholder="Enter your ID number" value={fm.idNum} onChange={h("idNum")}/></F>
                <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13.5,color:T.gray700}}><input type="checkbox" checked={fm.biz} onChange={e=>setFm(p=>({...p,biz:e.target.checked}))} style={{accentColor:T.primary,width:16,height:16}}/>I'm also verifying a business entity</label>
              </div>
            )}
            {step===2&&!fm.biz&&(
              <div style={{display:"flex",flexDirection:"column",gap:15}}>
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"13px",fontSize:13,color:"#065f46"}}><span className="msym" style={{fontSize:16,verticalAlign:"middle",marginRight:6}}>check_circle</span>Personal details saved. Upload a selfie with your ID to complete verification.</div>
                <div style={{border:`2px dashed ${T.gray100}`,borderRadius:12,padding:"40px 24px",textAlign:"center",cursor:"pointer"}}><span className="msym" style={{fontSize:38,color:T.gray400,display:"block",marginBottom:10}}>photo_camera</span><div style={{fontWeight:600,fontSize:14,color:T.primary,marginBottom:5}}>Upload selfie with your ID</div><div style={{fontSize:12,color:T.gray400}}>JPG or PNG, max 5MB</div></div>
              </div>
            )}
            {step===2&&fm.biz&&(
              <div style={{display:"flex",flexDirection:"column",gap:15}}>
                <F label="Registered Business Name" req><input style={fs} placeholder="Company name as registered" value={fm.bizName} onChange={h("bizName")}/></F>
                <F label="Registration / CAC Number" req><input style={fs} placeholder="e.g. RC1234567" value={fm.bizReg} onChange={h("bizReg")}/></F>
              </div>
            )}
            {step===3&&fm.biz&&(
              <div style={{display:"flex",flexDirection:"column",gap:15}}>
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"13px",fontSize:13,color:"#065f46"}}><span className="msym" style={{fontSize:16,verticalAlign:"middle",marginRight:6}}>check_circle</span>Business details saved. Upload your Certificate of Incorporation.</div>
                <div style={{border:`2px dashed ${T.gray100}`,borderRadius:12,padding:"40px 24px",textAlign:"center",cursor:"pointer"}}><span className="msym" style={{fontSize:38,color:T.gray400,display:"block",marginBottom:10}}>upload_file</span><div style={{fontWeight:600,fontSize:14,color:T.primary,marginBottom:5}}>Upload incorporation certificate</div><div style={{fontSize:12,color:T.gray400}}>PDF, JPG or PNG, max 10MB</div></div>
              </div>
            )}
            <div style={{display:"flex",gap:10,marginTop:22,justifyContent:"space-between"}}>
              <Btn variant="outline" onClick={()=>step>1?setStep(p=>p-1):onClose()}>{step===1?"Cancel":"← Back"}</Btn>
              <Btn variant="green" onClick={()=>{if(step<total)setStep(p=>p+1);else sub();}} disabled={ld}>
                {ld?<><Spin color={T.white}/>Submitting…</>:step<total?"Continue →":"Submit Verification →"}
              </Btn>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
};

/* ═══ AI SCOPE GENERATOR ════════════════════════════════════ */
const ScopeModal=({catLabel,onClose,onApply})=>{
  const [desc,setDesc]=useState("");const [ld,setLd]=useState(false);const [res,setRes]=useState(null);
  const gen=async()=>{
    if(!desc.trim())return;setLd(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are VaultPay's AI Scope Generator for tech services escrow.\nCategory: ${catLabel}\nClient brief: ${desc}\nReturn ONLY valid JSON:\n{"title":"short project title","overview":"2-sentence overview","deliverables":["item1","item2","item3","item4","item5"],"milestones":[{"name":"name","description":"what's delivered","timeline":"e.g. Week 2"}],"acceptance":["criterion1","criterion2","criterion3"],"timeline":"total timeline","revisions":"revision policy"}`}]})});
      const d=await r.json();const txt=d.content?.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim();setRes(JSON.parse(txt));
    }catch{setRes({title:"Tech Services Project",overview:"Development project as described, completed per agreed milestones with AI verification.",deliverables:["Core application development","API integrations","Testing & QA","Deployment","Documentation"],milestones:[{name:"Foundation",description:"Core setup and architecture",timeline:"Week 1–2"},{name:"Core Development",description:"Main features",timeline:"Week 3–5"},{name:"Delivery",description:"Testing and deployment",timeline:"Week 6"}],acceptance:["All features work as specified","Code passes automated tests","Documentation complete","Delivered on time"],timeline:"6 weeks",revisions:"2 rounds of revisions per milestone"});}
    setLd(false);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.white,borderRadius:20,width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.28)",animation:"fadeUp .3s ease"}}>
        <div style={{background:"linear-gradient(135deg,#0f766e,#0d9488)",padding:"22px 26px",color:T.white,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:1}}>
          <div><div style={{fontWeight:800,fontSize:17,display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:20}}>assignment</span>AI Scope Generator</div><div style={{fontSize:12,opacity:.65,marginTop:3}}>Describe your project — AI drafts the full scope</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"26px"}}>
          {!res?(<>
            <div style={{background:T.tealLt,border:`1px solid #a7f3d0`,borderRadius:10,padding:"13px 15px",fontSize:13,color:"#005235",marginBottom:18,lineHeight:1.7}}>Describe what you need in plain English. AI will generate deliverables, milestones, and acceptance criteria — ready to attach to your escrow contract.</div>
            <F label="Project Description" req><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={6} placeholder={`e.g. "I need a ${catLabel} with user auth, a dashboard, CSV export, and an admin panel. Mobile-responsive, deployed to AWS."`} style={{...fs,resize:"vertical",lineHeight:1.7}}/></F>
            <Btn variant="teal" onClick={gen} disabled={!desc.trim()||ld} style={{width:"100%",marginTop:16,fontSize:15}}>
              {ld?<><Spin/>Generating scope…</>:"Generate Scope with AI →"}
            </Btn>
          </>):(<>
            <div style={{background:T.tealLt,border:`1px solid #99f6e4`,borderRadius:12,padding:"16px 18px",marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:15,color:"#0f766e",marginBottom:4}}>{res.title}</div>
              <p style={{fontSize:13,color:"#0f766e",lineHeight:1.65}}>{res.overview}</p>
            </div>
            {[["Deliverables",res.deliverables],["Acceptance Criteria",res.acceptance]].map(([t,items])=>(
              <div key={t} style={{marginBottom:18}}>
                <div style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:10}}>{t}</div>
                {items?.map((d,i)=><div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:7,fontSize:13,color:T.gray700}}><span style={{color:T.teal,fontWeight:700,flexShrink:0}}>✓</span>{d}</div>)}
              </div>
            ))}
            <div style={{marginBottom:18}}>
              <div style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:10}}>calendar_today Milestones</div>
              {res.milestones?.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:9,padding:"11px 13px",background:T.offWhite,borderRadius:9}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:T.teal,display:"flex",alignItems:"center",justifyContent:"center",color:T.white,fontWeight:700,fontSize:12,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:T.primary}}>{m.name}</div><div style={{fontSize:12,color:T.gray500,marginTop:2}}>{m.description}</div></div>
                  <span style={{fontSize:11.5,color:T.teal,fontWeight:600,whiteSpace:"nowrap"}}>{m.timeline}</span>
                </div>
              ))}
            </div>
            <div style={{background:T.offWhite,borderRadius:10,padding:"12px 14px",fontSize:12.5,color:T.gray600,lineHeight:1.65,marginBottom:20}}><span className="msym" style={{fontSize:14,verticalAlign:"middle",marginRight:6}}>schedule</span><strong>{res.timeline}</strong> · {res.revisions}</div>
            <div style={{display:"flex",gap:10}}><Btn variant="outline" onClick={()=>setRes(null)} style={{flex:1}}>← Regenerate</Btn><Btn variant="teal" onClick={()=>{onApply(res);onClose();}} style={{flex:1}}>Use This Scope →</Btn></div>
          </>)}
        </div>
      </div>
    </div>
  );
};

/* ═══ AI CONTRACT GENERATOR ═════════════════════════════════ */
const ContractModal=({tx,scope,onClose})=>{
  const [ld,setLd]=useState(true);const [contract,setContract]=useState("");
  useEffect(()=>{
    (async()=>{
      try{
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:`Generate a professional tech services escrow agreement.\nProject: ${tx?.title||"Tech Services Project"}\nCategory: ${tx?.type||"Software Development"}\nValue: $${tx?.amount?.toLocaleString()||"TBD"} ${tx?.currency||"USD"}\nProvider: ${tx?.other||"[Provider]"}\nScope: ${scope?JSON.stringify(scope):"As agreed"}\n\nWrite a concise, professional escrow agreement covering: parties, project, deliverables, payment terms, milestone structure, revision policy, escrow terms, dispute resolution, governing law. No markdown — use numbered sections.`}]})});
        const d=await r.json();setContract(d.content?.map(i=>i.text||"").join("")||"");
      }catch{setContract(`TECH SERVICES ESCROW AGREEMENT\n\n1. PARTIES\nThis Agreement is between the Client and Service Provider, facilitated by VaultPay Escrow Services ("Escrow Agent").\n\n2. PROJECT SCOPE\nThe Service Provider agrees to deliver "${tx?.title}" as described in the attached scope document within the agreed timeline.\n\n3. PAYMENT TERMS\nTotal project value: $${tx?.amount?.toLocaleString()||"TBD"} ${tx?.currency||"USD"}. Funds held in VaultPay's regulated trust account until deliverables are accepted.\n\n4. MILESTONE PAYMENTS\nPayments released per milestone upon Client approval following AI audit confirmation.\n\n5. REVISION POLICY\nClient is entitled to two (2) revision rounds per milestone. Additional revisions quoted separately.\n\n6. DISPUTE RESOLUTION\nUnresolved disputes submitted to VaultPay's Dispute Resolution Officer. Decision binding within 5 business days.\n\n7. ESCROW TERMS\nFunds held in segregated, regulated trust accounts. Released only on Client approval or binding dispute resolution.\n\n8. GOVERNING LAW\nThis Agreement is governed by applicable jurisdiction law.`);}
      setLd(false);
    })();
  },[]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.white,borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,.28)",animation:"fadeUp .3s ease"}}>
        <div style={{background:"linear-gradient(135deg,#3730a3,#4338ca)",padding:"22px 26px",color:T.white,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div><div style={{fontWeight:800,fontSize:17,display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:20}}>description</span>AI Contract Generator</div><div style={{fontSize:12,opacity:.65,marginTop:3}}>{tx?.title||"Tech Services Escrow Contract"}</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"26px"}}>
          {ld?(
            <div style={{textAlign:"center",padding:"48px 0"}}><span className="msym" style={{fontSize:42,color:T.primary,display:"block",marginBottom:14,animation:"pulse 1.5s ease infinite"}}>description</span><div style={{fontWeight:700,fontSize:16,color:T.primary,marginBottom:8}}>Generating contract…</div><p style={{fontSize:13,color:T.gray500}}>AI is drafting a legally-sound escrow agreement.</p></div>
          ):(
            <>
              <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:10,padding:"13px 15px",fontSize:13,color:"#3730a3",lineHeight:1.65,marginBottom:20}}><span className="msym" style={{fontSize:16,verticalAlign:"middle",marginRight:6}}>check_circle</span>Contract generated by VaultPay AI. Review before both parties sign.</div>
              <div style={{background:T.offWhite,borderRadius:12,padding:"20px 22px",fontSize:13,color:T.gray700,lineHeight:2,whiteSpace:"pre-wrap",fontFamily:"Georgia, serif"}}>{contract}</div>
            </>
          )}
        </div>
        {!ld&&(
          <div style={{padding:"16px 26px",borderTop:`1px solid ${T.gray100}`,display:"flex",gap:10,flexShrink:0}}>
            <Btn variant="outline" onClick={onClose} style={{flex:1}}>Close</Btn>
            <Btn variant="purple" style={{flex:1}}><span className="msym" style={{fontSize:17}}>download</span>Download PDF</Btn>
            <Btn variant="primary" onClick={onClose} style={{flex:1}}><span className="msym" style={{fontSize:17}}>check_circle</span>Accept Contract →</Btn>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══ AI AUDIT MODAL ════════════════════════════════════════ */
const AuditModal=({tx,onClose,onApprove,onRevision})=>{
  const [ld,setLd]=useState(true);const [res,setRes]=useState(null);
  useEffect(()=>{
    (async()=>{
      try{
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are VaultPay's AI Deliverable Auditor. Analyse this project.\nTransaction: ${tx.id}\nProject: ${tx.title}\nCategory: ${tx.type}\nValue: $${tx.amount?.toLocaleString()} ${tx.currency||"USD"}\nProvider: ${tx.other}\nReturn ONLY valid JSON:\n{"score":0-100,"status":"passed"|"passed_with_notes"|"revision_required","summary":"2-sentence executive summary","risk":"low"|"medium"|"high","riskScore":0-100,"checks":[{"name":"check name","status":"passed"|"warning"|"failed","note":"detail"}],"recommendation":"one clear sentence"}`}]})});
        const d=await r.json();const txt=d.content?.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim();setRes(JSON.parse(txt));
      }catch{setRes({score:84,status:"passed_with_notes",summary:"Core deliverables reviewed against scope. Requirements substantially met with minor observations.",risk:"low",riskScore:18,checks:[{name:"Scope Completion",status:"passed",note:"All primary deliverables submitted"},{name:"Code Quality",status:"passed",note:"No critical issues detected"},{name:"Test Coverage",status:"warning",note:"Coverage at 62% — below 70% target"},{name:"Documentation",status:"warning",note:"README missing deployment instructions"},{name:"Security Review",status:"passed",note:"No known vulnerabilities found"},{name:"Deadline Compliance",status:"passed",note:"Submitted within agreed timeline"}],recommendation:"Recommend approval with a note to improve test coverage and deployment docs."});}
      setLd(false);
    })();
  },[]);
  const sc=s=>s==="passed"?T.green:s==="warning"?T.accent:T.red;
  const si=s=>s==="passed"?"check_circle":s==="warning"?"warning":"cancel";
  const oc=r=>r?.status==="passed"?T.green:r?.status==="passed_with_notes"?T.accent:T.red;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.white,borderRadius:20,width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.28)",animation:"fadeUp .3s ease"}}>
        <div style={{background:"linear-gradient(135deg,#1e1b4b,#4338ca)",padding:"22px 26px",color:T.white,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:1}}>
          <div><div style={{fontWeight:800,fontSize:17,display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:20}}>smart_toy</span>AI Deliverable Audit</div><div style={{fontSize:12,opacity:.65,marginTop:3}}>{tx.title}</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"26px"}}>
          {ld?(
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <span className="msym" style={{fontSize:46,color:T.primary,display:"block",marginBottom:14,animation:"pulse 1.5s ease infinite"}}>smart_toy</span>
              <div style={{fontWeight:700,fontSize:16,color:T.primary,marginBottom:8}}>Auditing deliverable…</div>
              <p style={{fontSize:13,color:T.gray500,lineHeight:1.7,marginBottom:20}}>Running scope check, code analysis, documentation review, and security scan.</p>
              {["Scanning repository structure…","Checking scope compliance…","Running security analysis…","Calculating risk score…"].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:T.gray500,justifyContent:"center",marginBottom:8}}><Spin size={12} color={T.primary}/>{s}</div>)}
            </div>
          ):res&&(<>
            <div style={{display:"flex",alignItems:"center",gap:18,background:T.offWhite,borderRadius:14,padding:"18px 20px",marginBottom:22}}>
              <div style={{width:70,height:70,borderRadius:"50%",background:oc(res)+"16",border:`3px solid ${oc(res)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:22,color:oc(res)}}>{res.score}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:T.primary,marginBottom:4}}>{res.status==="passed"?"Audit Passed":res.status==="passed_with_notes"?"Passed with Notes":"Revision Required"}</div>
                <p style={{fontSize:12.5,color:T.gray600,lineHeight:1.65}}>{res.summary}</p>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:T.gray400,marginBottom:4}}>Risk Score</div>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:20,fontWeight:800,color:res.risk==="low"?T.green:res.risk==="medium"?T.accent:T.red}}>{res.riskScore}</div>
                <span style={{fontSize:10,fontWeight:700,color:res.risk==="low"?T.green:res.risk==="medium"?T.accent:T.red,textTransform:"uppercase"}}>{res.risk} risk</span>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:12}}>Technical Checks</div>
              {res.checks?.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 13px",background:T.offWhite,borderRadius:9,marginBottom:7,border:`1px solid ${sc(c.status)}20`}}>
                  <span className="msym" style={{fontSize:18,flexShrink:0,marginTop:1,color:sc(c.status)}}>{si(c.status)}</span>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:T.primary}}>{c.name}</div><div style={{fontSize:12,color:T.gray500,marginTop:2}}>{c.note}</div></div>
                  <span style={{fontSize:11,fontWeight:700,color:sc(c.status),background:sc(c.status)+"16",padding:"2px 8px",borderRadius:20,whiteSpace:"nowrap"}}>{c.status}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"13px 15px",marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:13,color:T.primary,marginBottom:5,display:"flex",alignItems:"center",gap:6}}><span className="msym" style={{fontSize:16}}>smart_toy</span>AI Recommendation</div>
              <p style={{fontSize:13,color:"#1e40af",lineHeight:1.65}}>{res.recommendation}</p>
            </div>
            <div style={{display:"flex",gap:9}}>
              <Btn variant="outline" onClick={onClose} style={{flex:1,fontSize:13}}>Close Report</Btn>
              {res.status!=="revision_required"&&<Btn variant="green" onClick={()=>{onApprove();onClose();}} style={{flex:1,fontSize:13}}><span className="msym" style={{fontSize:16}}>check_circle</span>Approve & Release →</Btn>}
              {res.status!=="passed"&&<Btn variant="accent" onClick={()=>{onRevision();onClose();}} style={{flex:1,fontSize:13}}><span className="msym" style={{fontSize:16}}>refresh</span>Request Revision</Btn>}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
};

/* ═══ DISPUTE MODAL (AI Dispute Assistant + evidence uploads) */
const DisputeModal=({tx,onClose,onSubmit})=>{
  const [reason,setReason]=useState("");const [desc,setDesc]=useState("");const [files,setFiles]=useState([]);
  const [ld,setLd]=useState(false);const [summ,setSumm]=useState("");const [done,setDone]=useState(false);
  const sub=async()=>{
    if(!reason||!desc)return;setLd(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`You are VaultPay's AI Dispute Assistant.\nTransaction: ${tx.title}\nCategory: ${tx.type}\nValue: $${tx.amount?.toLocaleString()}\nProvider: ${tx.other}\nReason: ${reason}\nDescription: ${desc}\nEvidence files: ${files.length>0?files.join(", "):"None"}\nGenerate a neutral 3-4 sentence dispute case summary covering: (1) nature of dispute, (2) key facts from both perspectives, (3) recommended resolution. Plain text only.`}]})});
      const d=await r.json();setSumm(d.content?.map(i=>i.text||"").join("")||"Dispute filed. Our team will contact both parties within 24 hours.");
    }catch{setSumm("A dispute has been filed. Our Dispute Resolution Officer will review all communications and deliverables and contact both parties with a resolution within 5 business days.");}
    setLd(false);setDone(true);onSubmit();
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.white,borderRadius:20,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.25)",animation:"fadeUp .3s ease",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#7f1d1d,#991b1b)",padding:"22px 26px",color:T.white,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:800,fontSize:17,display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:20}}>gavel</span>File a Dispute</div><div style={{fontSize:12,opacity:.65,marginTop:3}}>{tx.title}</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"26px",maxHeight:"calc(90vh - 80px)",overflowY:"auto"}}>
          {done?(<>
            <div style={{textAlign:"center",marginBottom:20}}><span className="msym" style={{fontSize:40,color:T.red,display:"block",marginBottom:10}}>gavel</span><div style={{fontWeight:700,fontSize:17,color:T.red,marginBottom:6}}>Dispute Filed</div><p style={{fontSize:13.5,color:T.gray500}}>Both parties notified. Our team reviews within 24 hours.</p></div>
            <div style={{background:"#fff5f5",border:"1px solid #fecaca",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><span className="msym" style={{fontSize:15}}>smart_toy</span>AI Case Summary</div>
              <p style={{fontSize:13,color:T.gray700,lineHeight:1.8}}>{summ}</p>
            </div>
            <div style={{background:T.offWhite,borderRadius:10,padding:"13px 15px",fontSize:12.5,color:T.gray500,lineHeight:1.65,marginBottom:16}}><span className="msym" style={{fontSize:14,verticalAlign:"middle",marginRight:6}}>assignment_ind</span>A Dispute Resolution Officer will contact both parties within 24 hours. Upload additional evidence via the transaction messages panel at any time.</div>
            <Btn variant="outline" onClick={onClose} style={{width:"100%"}}>Close</Btn>
          </>):(<>
            <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 14px",fontSize:13,color:"#991b1b",lineHeight:1.65,marginBottom:20}}><span className="msym" style={{fontSize:14,verticalAlign:"middle",marginRight:6}}>warning</span>Filing a dispute freezes escrow funds and notifies the other party. Try resolving via messages first.</div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.gray700,marginBottom:9}}>Dispute Reason *</div>
                {["Deliverable does not match agreed scope","Work is incomplete or non-functional","No delivery made after funding","Scope was changed without agreement","Other"].map(r=>(
                  <label key={r} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",padding:"9px 13px",borderRadius:8,border:`1.5px solid ${reason===r?T.red:T.gray100}`,background:reason===r?"#fff5f5":T.white,marginBottom:7,transition:"all .15s"}}>
                    <input type="radio" name="reason" value={r} checked={reason===r} onChange={()=>setReason(r)} style={{accentColor:T.red}}/>
                    <span style={{fontSize:13.5,color:T.gray900}}>{r}</span>
                  </label>
                ))}
              </div>
              <F label="Describe the issue" req><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="Explain what was promised, what was delivered, and what the problem is…" style={{...fs,resize:"vertical",lineHeight:1.65}}/></F>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.gray700,marginBottom:8}}>Upload Evidence (optional)</div>
                <div style={{border:`2px dashed ${T.gray100}`,borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer",background:T.offWhite}} onClick={()=>{const names=["screenshot.png","contract.pdf","chat_export.txt"];setFiles(p=>p.length<3?[...p,names[p.length]]:p);}}>
                  <div style={{fontSize:26,marginBottom:8}}>attach_file</div>
                  <div style={{fontSize:13,fontWeight:600,color:T.primary,marginBottom:3}}>Click to attach files</div>
                  <div style={{fontSize:12,color:T.gray400}}>Screenshots, contracts, code links, chat exports</div>
                </div>
                {files.length>0&&<div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:7}}>{files.map((f,i)=><span key={i} style={{fontSize:12,background:T.offWhite,border:`1px solid ${T.gray100}`,borderRadius:6,padding:"4px 10px",color:T.primary,fontWeight:500}}>attach_file {f}</span>)}</div>}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <Btn variant="outline" onClick={onClose} style={{flex:1}}>Cancel</Btn>
              <Btn variant="red" onClick={sub} disabled={!reason||!desc||ld} style={{flex:1}}>
                {ld?<><Spin/>Generating AI Summary…</>:"File Dispute →"}
              </Btn>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
};

/* ═══ ADMIN DASHBOARD (Platform Administrator role) ═════════ */
const AdminPanel=({onBack})=>{
  const [tab,setTab]=useState("overview");
  const rows=[
    {id:"TXN-88401",parties:"Tunde A. vs Devcraft",    type:"Software Dev", amount:18000,status:"inspection",flagged:false},
    {id:"TXN-87801",parties:"Aisha M. vs CloudShift",  type:"Cloud/DevOps", amount:12500,status:"disputed",  flagged:true},
    {id:"TXN-88256",parties:"James T. vs AppForge",    type:"Mobile App",   amount:35000,status:"funded",     flagged:false},
    {id:"TXN-88103",parties:"Sarah K. vs TechStar",    type:"Web Dev",      amount:4800, status:"approved",   flagged:false},
  ];
  return(
    <div style={{background:T.offWhite,minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#1e1b4b,#3730a3)",color:T.white,padding:"0 1.5rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",height:60,gap:16}}>
          <div style={{fontWeight:800,fontSize:18,cursor:"pointer"}} onClick={onBack}>Vault<span style={{color:T.green}}>Pay</span> <span style={{fontSize:12,opacity:.6,fontWeight:400}}>Admin</span></div>
          <div style={{display:"flex",gap:0,marginLeft:12,overflowX:"auto"}}>
            {[["overview","Overview"],["transactions","All Transactions"],["disputes","Disputes"],["users","Users"],["kyc","KYC Queue"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 13px",fontSize:13,fontWeight:600,color:tab===k?T.gold:"rgba(255,255,255,.55)",borderBottom:tab===k?`2px solid ${T.gold}`:"2px solid transparent",transition:"all .15s",whiteSpace:"nowrap"}}>{l}</button>)}
          </div>
          <div style={{marginLeft:"auto"}}><button onClick={onBack} style={{background:"none",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.6)",padding:"7px 13px",borderRadius:6,cursor:"pointer",fontSize:12}}>← Exit Admin</button></div>
        </div>
      </div>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"26px 1.5rem"}}>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:26}}>
          {[{l:"Total in Escrow",v:"$70,500",i:"lock",c:T.green},{l:"Active Transactions",v:"3",i:"bolt",c:"#3b82f6"},{l:"Open Disputes",v:"1",i:"gavel",c:T.red},{l:"Pending KYC",v:"5",i:"badge",c:T.accent}].map(c=>(
            <div key={c.l} style={{background:T.white,border:`1px solid ${T.gray100}`,borderRadius:14,padding:"17px 19px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:11,fontWeight:700,color:T.gray400,textTransform:"uppercase",letterSpacing:".06em",marginBottom:5}}>{c.l}</div><div style={{fontSize:24,fontWeight:800,color:T.primary,fontFamily:"'Inter',sans-serif"}}>{c.v}</div></div>
              <div style={{width:42,height:42,background:c.c+"18",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}><span className="msym" style={{fontSize:20,color:c.c}}>{c.i}</span></div>
            </div>
          ))}
        </div>
        {(tab==="overview"||tab==="transactions")&&(
          <div style={{background:T.white,border:`1px solid ${T.gray100}`,borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"16px 22px",borderBottom:`1px solid ${T.gray100}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:700,fontSize:15,color:T.primary}}>All Platform Transactions</div>
              <div style={{display:"flex",gap:8}}>{["All","Disputed","Flagged"].map(f=><button key={f} style={{fontSize:12,padding:"5px 12px",borderRadius:7,border:`1px solid ${T.gray100}`,background:f==="All"?T.primary:T.white,color:f==="All"?T.white:T.gray600,cursor:"pointer"}}>{f}</button>)}</div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                <thead><tr style={{background:T.offWhite}}>{["Transaction","Parties","Category","Value","Status","Flagged","Action"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10.5,fontWeight:700,color:T.gray500,textTransform:"uppercase",letterSpacing:".06em",borderBottom:`1px solid ${T.gray100}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r,i)=>(
                    <tr key={r.id} className="tr" style={{borderBottom:i<rows.length-1?`1px solid ${T.gray100}`:"none"}}>
                      <td style={{padding:"12px 14px",fontWeight:600,fontSize:13.5,color:T.primary}}>{r.id}</td>
                      <td style={{padding:"12px 14px",fontSize:13,color:T.gray700}}>{r.parties}</td>
                      <td style={{padding:"12px 14px"}}><span style={{fontSize:11,fontWeight:700,color:T.teal,background:T.tealLt,padding:"3px 8px",borderRadius:5}}>{r.type}</span></td>
                      <td style={{padding:"12px 14px",fontWeight:700,color:T.primary,fontFamily:"'Inter',sans-serif"}}>${r.amount.toLocaleString()}</td>
                      <td style={{padding:"12px 14px"}}><SB status={r.status}/></td>
                      <td style={{padding:"12px 14px"}}>{r.flagged?<span style={{fontSize:11,fontWeight:700,color:T.red,background:"#fff5f5",padding:"3px 8px",borderRadius:5}}>emergency Flagged</span>:<span style={{fontSize:11,color:T.gray400}}>—</span>}</td>
                      <td style={{padding:"12px 14px"}}><span style={{fontSize:13,fontWeight:700,color:T.accent,cursor:"pointer"}}>Review →</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab==="disputes"&&(
          <div style={{background:T.white,border:`1px solid ${T.gray100}`,borderRadius:16,padding:"26px"}}>
            <h2 style={{fontFamily:"'Inter',sans-serif",fontSize:20,color:T.primary,marginBottom:16}}>Dispute Resolution Queue</h2>
            <div style={{border:`1.5px solid #fecaca`,borderRadius:12,padding:"18px 20px",background:"#fff5f5",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div><div style={{fontWeight:700,fontSize:14,color:T.red,marginBottom:4}}>TXN-87801 — AWS Cloud Migration</div><div style={{fontSize:13,color:T.gray500}}>Aisha M. vs CloudShift Inc · $12,500 · Filed 2 days ago</div><div style={{fontSize:12.5,color:T.gray400,marginTop:6}}>Reason: Deliverable does not match agreed scope</div></div>
              <div style={{display:"flex",gap:8}}><Btn variant="outline" style={{fontSize:13}}>View AI Summary</Btn><Btn variant="green" style={{fontSize:13}}>Resolve →</Btn><Btn variant="red" style={{fontSize:13}}>Refund</Btn></div>
            </div>
            <div style={{marginTop:20,background:T.offWhite,borderRadius:12,padding:"18px",fontSize:13.5,color:T.gray600,lineHeight:1.75}}><strong>Dispute Workflow:</strong> AI case summary generated → Both parties notified → Evidence window (48h) → Officer review → Binding decision within 5 days → Refund or payment release executed.</div>
          </div>
        )}
        {tab==="users"&&(
          <div style={{background:T.white,border:`1px solid ${T.gray100}`,borderRadius:16,padding:"26px"}}>
            <h2 style={{fontFamily:"'Inter',sans-serif",fontSize:20,color:T.primary,marginBottom:16}}>User Management</h2>
            <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
              {[{l:"Total Users",v:"1,847,231",i:"group"},{l:"Clients",v:"1,204,512",i:"person"},{l:"Providers",v:"642,719",i:"build"},{l:"Suspended",v:"127",i:"block"}].map(u=>(
                <div key={u.l} style={{background:T.offWhite,borderRadius:12,padding:"16px",textAlign:"center"}}><div style={{fontSize:26,marginBottom:6}}><span className="msym" style={{fontSize:20,color:T.primary}}>{u.i}</span></div><div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:20,color:T.primary}}>{u.v}</div><div style={{fontSize:12,color:T.gray500,marginTop:2}}>{u.l}</div></div>
              ))}
            </div>
          </div>
        )}
        {tab==="kyc"&&(
          <div style={{background:T.white,border:`1px solid ${T.gray100}`,borderRadius:16,padding:"26px"}}>
            <h2 style={{fontFamily:"'Inter',sans-serif",fontSize:20,color:T.primary,marginBottom:6}}>KYC Verification Queue</h2>
            <p style={{color:T.gray500,fontSize:14,marginBottom:20}}>5 pending premium manual verifications.</p>
            {[{name:"Emeka O.",type:"Business Verification",time:"1 hour ago",tier:"Premium"},{name:"Funke A.",type:"Identity Verification",time:"3 hours ago",tier:"Standard"},{name:"Babatunde Ltd",type:"Business Verification",time:"5 hours ago",tier:"Premium"}].map((u,i)=>(
              <div key={i} style={{border:`1px solid ${T.gray100}`,borderRadius:10,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:10}}>
                <div><div style={{fontWeight:700,fontSize:14,color:T.primary}}>{u.name}</div><div style={{fontSize:12.5,color:T.gray500}}>{u.type} · Submitted {u.time}</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><Badge color={u.tier==="Premium"?T.accent:T.primary}>{u.tier}</Badge><Btn variant="green" style={{fontSize:12,padding:"7px 14px"}}>Approve</Btn><Btn variant="red" style={{fontSize:12,padding:"7px 14px"}}>Reject</Btn></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* DASHBOARD */
const Dashboard=({user,onLogout,navigate})=>{
  const [tab,setTab]=useState("transactions");
  const [detail,setDetail]=useState(null);
  const [txs,setTxs]=useState(MTX);
  const [showNew,setShowNew]=useState(false);
  const [ns,setNs]=useState(1);
  const [nf,setNf]=useState({title:"",type:"software",amount:"",currency:"USD",counterparty:"",role:"buyer",days:"3",milestones:"2"});
  const [scope,setScope]=useState(null);
  const [msg,setMsg]=useState("");
  const [msgs,setMsgs]=useState([
    {from:"System",text:"Transaction created. Funds confirmed in escrow.",time:"May 14, 9:00 AM"},
    {from:"Devcraft Solutions",text:"Development underway. Submitting first milestone Friday.",time:"May 16, 2:30 PM"},
    {from:"You",text:"Great, looking forward to it.",time:"May 16, 3:00 PM"},
  ]);
  const [kycDone,setKycDone]=useState(false);
  const [showKYC,setShowKYC]=useState(false);
  const [showAudit,setShowAudit]=useState(null);
  const [showDispute,setShowDispute]=useState(null);
  const [showContract,setShowContract]=useState(null);
  const [showScope,setShowScope]=useState(false);
  const [showAdmin,setShowAdmin]=useState(false);
  const [drawer,setDrawer]=useState(false);

  const hn=k=>e=>setNf(p=>({...p,[k]:e.target.value}));
  const active=txs.filter(t=>!["completed","disputed"].includes(t.status));
  const det=detail?txs.find(t=>t.id===detail.id)||detail:null;
  const switchTab=k=>{setTab(k);setDetail(null);setDrawer(false);};

  const createTx=()=>{
    const cat=CATS.find(c=>c.id===nf.type);
    setTxs(p=>[{id:`TXN-${Math.floor(80000+Math.random()*9000)}`,title:nf.title||scope?.title||"New Project",type:cat?.label||"Software Dev",cat:nf.type,amount:parseFloat(nf.amount)||0,currency:nf.currency,role:nf.role==="buyer"?"Buyer":"Seller",other:nf.counterparty||"Counterparty",status:"pending",date:new Date().toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"}),milestones:parseInt(nf.milestones)||1},...p]);
    setShowNew(false);setNs(1);setScope(null);setNf({title:"",type:"software",amount:"",currency:"USD",counterparty:"",role:"buyer",days:"3",milestones:"2"});
  };

  if(showAdmin) return <AdminPanel onBack={()=>setShowAdmin(false)}/>;

  const TABS=[["transactions","dashboard","Transactions"],["kyc","badge","KYC"],["disputes","gavel","Disputes"],["settings","manage_accounts","Account"],["history","history","History"]];

  return(
    <div style={{background:"#f5f3f6",minHeight:"100dvh",paddingBottom:80}}>

      {/* Overlay */}
      <div className={"dash-overlay"+(drawer?" show":"")} onClick={()=>setDrawer(false)}/>

      {/* Side Drawer */}
      <aside className={"dash-drawer"+(drawer?" open":"")}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:64,borderBottom:"1px solid #c5c6cf",flexShrink:0}}>
          <span style={{fontWeight:800,fontSize:20,color:"#001637"}}>Vault<span style={{color:"#006c47"}}>Pay</span></span>
          <button onClick={()=>setDrawer(false)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}>
            <span className="msym" style={{fontSize:24,color:"#44474e"}}>close</span>
          </button>
        </div>
        <div style={{padding:"14px 16px",borderBottom:"1px solid #e9e7eb",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"#001637",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"#fff",flexShrink:0}}>
            {user?.name?user.name[0].toUpperCase():"U"}
          </div>
          <div style={{overflow:"hidden"}}>
            <div style={{fontWeight:700,fontSize:14,color:"#001637",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"User"}</div>
            <div style={{fontSize:12,color:"#75777f",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email||""}</div>
          </div>
        </div>
        <nav style={{flex:1,overflowY:"auto",padding:"10px 8px"}}>
          {TABS.map(([k,icon,label])=>(
            <button key={k} onClick={()=>switchTab(k)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:"none",cursor:"pointer",background:tab===k?"#001637":"transparent",color:tab===k?"#fff":"#44474e",fontWeight:tab===k?700:500,fontSize:14,marginBottom:2,transition:"all .15s",textAlign:"left"}}>
              <span className="msym" style={{fontSize:20,color:tab===k?"#fff":"#75777f"}}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 8px",borderTop:"1px solid #e9e7eb",flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
          {user?.email==="admin@vaultpay.com"&&(
            <button onClick={()=>{setShowAdmin(true);setDrawer(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,border:"1px solid #c5c6cf",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:600,color:"#44474e"}}>
              <span className="msym" style={{fontSize:18}}>admin_panel_settings</span>Admin Panel
            </button>
          )}
          <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,border:"1px solid #fecaca",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:600,color:"#ba1a1a"}}>
            <span className="msym" style={{fontSize:18}}>logout</span>Sign Out
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header style={{background:"#fbf9fc",borderBottom:"1px solid #c5c6cf",position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",height:64,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
          <button className="mob-menu-btn" onClick={()=>setDrawer(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:38,height:38,borderRadius:10,background:"none",border:"none",cursor:"pointer",color:"#001637",flexShrink:0}}>
            <span className="msym" style={{fontSize:24}}>{drawer?"close":"menu"}</span>
          </button>
          <span style={{fontWeight:800,fontSize:20,color:"#001637",letterSpacing:"-.3px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}} onClick={()=>navigate("home")}>
            Vault<span style={{color:"#006c47"}}>Pay</span>
          </span>
          <div className="dash-tabs" style={{display:"flex",gap:0,marginLeft:6,overflow:"hidden"}}>
            {TABS.map(([k,_,l])=>(
              <button key={k} onClick={()=>switchTab(k)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 12px",fontSize:13,fontWeight:600,color:tab===k?"#001637":"#44474e",borderBottom:tab===k?"2px solid #001637":"2px solid transparent",transition:"all .15s",whiteSpace:"nowrap"}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          {user?.email==="admin@vaultpay.com"&&(
            <button onClick={()=>setShowAdmin(true)} style={{background:"none",border:"1px solid #c5c6cf",color:"#44474e",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap",display:"none"}} className="dash-admin-desk">Admin</button>
          )}
          <button onClick={()=>setShowNew(true)} style={{display:"inline-flex",alignItems:"center",gap:6,background:"#006c47",color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,padding:"9px 13px",whiteSpace:"nowrap"}}>
            <span className="msym" style={{fontSize:18}}>add</span>
            <span style={{display:"none"}} id="new-lbl">New Transaction</span>
            <style>{`@media(min-width:480px){#new-lbl{display:inline!important;}}`}</style>
          </button>
          <div style={{width:36,height:36,borderRadius:"50%",background:"#001637",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#fff",cursor:"pointer",flexShrink:0}} onClick={()=>setDrawer(v=>!v)}>
            {user?.name?user.name[0].toUpperCase():"U"}
          </div>
        </div>
      </header>

      {/* Page content */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"18px 14px 90px"}}>

        {/* KPI row */}
        <div className="dash-kpi" style={{marginBottom:18}}>
          {[
            {l:"Active",    v:active.length,                                               i:"bolt",         c:"#3b82f6"},
            {l:"In Escrow", v:"$"+active.reduce((a,b)=>a+b.amount,0).toLocaleString(),    i:"lock",         c:T.green},
            {l:"Completed", v:txs.filter(t=>t.status==="completed").length,                i:"check_circle", c:T.teal},
            {l:"Disputed",  v:txs.filter(t=>t.status==="disputed").length,                 i:"gavel",        c:T.red},
          ].map(c=>(
            <div key={c.l} style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10.5,fontWeight:700,color:T.gray400,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{c.l}</div>
                <div style={{fontSize:22,fontWeight:800,color:T.primary}}>{c.v}</div>
              </div>
              <div style={{width:40,height:40,background:c.c+"18",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span className="msym" style={{fontSize:20,color:c.c}}>{c.i}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TRANSACTIONS LIST */}
        {tab==="transactions"&&!det&&(
          <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+T.gray100,flexWrap:"wrap",gap:10}}>
              <div style={{fontWeight:700,fontSize:15,color:T.primary}}>All Transactions</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["All","Active","Completed","Disputed"].map(f=>(
                  <button key={f} style={{fontSize:12,padding:"5px 10px",borderRadius:7,border:"1px solid "+T.gray100,background:f==="All"?T.primary:T.white,color:f==="All"?T.white:T.gray600,cursor:"pointer"}}>{f}</button>
                ))}
              </div>
            </div>
            {/* Desktop table */}
            <div className="tx-tbl" style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
                <thead>
                  <tr style={{background:T.offWhite}}>
                    {["Project","Value","Role","Status","Date",""].map(h=>(
                      <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10.5,fontWeight:700,color:T.gray500,textTransform:"uppercase",letterSpacing:".06em",borderBottom:"1px solid "+T.gray100,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx,i)=>(
                    <tr key={tx.id} className="tr" style={{borderBottom:i<txs.length-1?"1px solid "+T.gray100:"none",cursor:"pointer"}} onClick={()=>setDetail(tx)}>
                      <td style={{padding:"12px 14px"}}>
                        <div style={{fontWeight:600,fontSize:13.5,color:T.primary,marginBottom:2}}>{tx.title}</div>
                        <div style={{fontSize:11,color:T.gray400}}>{tx.id} &bull; {tx.type}</div>
                      </td>
                      <td style={{padding:"12px 14px",fontWeight:700,color:T.primary,whiteSpace:"nowrap"}}>${tx.amount.toLocaleString()}</td>
                      <td style={{padding:"12px 14px"}}><span style={{fontSize:11,fontWeight:700,color:tx.role==="Buyer"?"#3b82f6":"#006c47",background:tx.role==="Buyer"?"#eff6ff":"#e8f5ee",padding:"3px 8px",borderRadius:5}}>{tx.role}</span></td>
                      <td style={{padding:"12px 14px"}}><SB status={tx.status}/></td>
                      <td style={{padding:"12px 14px",fontSize:12,color:T.gray400,whiteSpace:"nowrap"}}>{tx.date}</td>
                      <td style={{padding:"12px 14px"}}><span style={{color:T.accent,fontSize:13,fontWeight:700}}>View</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="tx-mob" style={{display:"none",flexDirection:"column"}}>
              {txs.map((tx,i)=>(
                <div key={tx.id} onClick={()=>setDetail(tx)} style={{padding:"14px 16px",cursor:"pointer",borderBottom:i<txs.length-1?"1px solid "+T.gray100:"none",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:T.primary,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.title}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                      <span style={{fontSize:13.5,fontWeight:700,color:T.primary}}>${tx.amount.toLocaleString()}</span>
                      <SB status={tx.status}/>
                    </div>
                    <div style={{fontSize:11.5,color:T.gray400}}>{tx.id} &bull; {tx.date}</div>
                  </div>
                  <span className="msym" style={{fontSize:22,color:T.gray400,flexShrink:0}}>chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTION DETAIL */}
        {tab==="transactions"&&det&&(
          <div>
            <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",color:T.gray500,cursor:"pointer",fontSize:14,marginBottom:14,display:"flex",alignItems:"center",gap:6,padding:0}}>
              <span className="msym" style={{fontSize:18}}>arrow_back</span>Back to transactions
            </button>
            <div className="dg" style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
              {/* Left */}
              <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,overflow:"hidden"}}>
                <div style={{background:"linear-gradient(135deg,"+T.primary+","+T.primaryDk+")",padding:"20px",color:T.white}}>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>{det.id} &bull; {det.type} &bull; {det.milestones} milestone{det.milestones>1?"s":""}</div>
                  <div style={{fontWeight:700,fontSize:"clamp(15px,3vw,19px)",lineHeight:1.3}}>{det.title}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginTop:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:"clamp(18px,4vw,24px)",fontWeight:800}}>${det.amount?.toLocaleString()} {det.currency}</span>
                    <SB status={det.status}/>
                  </div>
                </div>
                <div style={{padding:"18px 16px"}}>
                  <div style={{fontWeight:700,fontSize:12.5,color:T.primary,marginBottom:14,textTransform:"uppercase",letterSpacing:".06em"}}>Escrow Timeline</div>
                  {["Project created","Contract generated","Escrow funded","Provider working","Deliverable submitted","AI audit completed","Client review","Payment released"].map((s,i,a)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:i<a.length-1?12:0}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                        <div style={{width:22,height:22,borderRadius:"50%",background:i<3?T.primary:T.gray100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:i<3?T.white:T.gray400}}>
                          {i<3?<span className="msym" style={{fontSize:11}}>check</span>:i+1}
                        </div>
                        {i<a.length-1&&<div style={{width:2,flex:1,minHeight:10,background:i<2?T.primary+"30":T.gray100,marginTop:2}}/>}
                      </div>
                      <div style={{paddingTop:2,fontSize:13,color:i<3?T.primary:T.gray400,fontWeight:i<3?600:400}}>{s}</div>
                    </div>
                  ))}
                  <hr style={{border:"none",borderTop:"1px solid "+T.gray100,margin:"18px 0"}}/>
                  <div style={{fontWeight:700,fontSize:12.5,color:T.primary,marginBottom:12,textTransform:"uppercase",letterSpacing:".06em"}}>Messages</div>
                  <div style={{maxHeight:220,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
                    {msgs.map((m,i)=>(
                      <div key={i} style={{display:"flex",gap:8,flexDirection:m.from==="You"?"row-reverse":"row"}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:m.from==="You"?T.accent:T.primary,display:"flex",alignItems:"center",justifyContent:"center",color:T.white,fontSize:10,fontWeight:700,flexShrink:0}}>{m.from[0]}</div>
                        <div style={{maxWidth:"72%"}}>
                          <div style={{fontSize:10,color:T.gray400,marginBottom:2,textAlign:m.from==="You"?"right":"left"}}>{m.from} &bull; {m.time}</div>
                          <div style={{background:m.from==="You"?T.primary:T.offWhite,color:m.from==="You"?T.white:T.gray900,borderRadius:9,padding:"8px 12px",fontSize:13,lineHeight:1.5}}>{m.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <input style={{flex:1,padding:"9px 12px",border:"1.5px solid "+T.gray100,borderRadius:8,fontSize:13.5,outline:"none",minWidth:0}} placeholder="Type a message..." value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&msg.trim()){setMsgs(p=>[...p,{from:"You",text:msg,time:new Date().toLocaleTimeString("en",{hour:"numeric",minute:"2-digit"})}]);setMsg("");}}}/>
                    <Btn variant="primary" style={{padding:"9px 14px",flexShrink:0}} onClick={()=>{if(msg.trim()){setMsgs(p=>[...p,{from:"You",text:msg,time:new Date().toLocaleTimeString("en",{hour:"numeric",minute:"2-digit"})}]);setMsg("");}}}>
                      <span className="msym" style={{fontSize:18}}>send</span>
                    </Btn>
                  </div>
                </div>
              </div>
              {/* Right sidebar */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,padding:"16px"}}>
                  <div style={{fontWeight:700,fontSize:12.5,color:T.primary,marginBottom:12,textTransform:"uppercase",letterSpacing:".06em"}}>Actions</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <Btn variant="purple" style={{width:"100%",fontSize:13,justifyContent:"flex-start"}} onClick={()=>setShowContract(det)}>
                      <span className="msym" style={{fontSize:16}}>description</span>View AI Contract
                    </Btn>
                    <Btn variant="teal" style={{width:"100%",fontSize:13,justifyContent:"flex-start"}} onClick={()=>setShowAudit(det)}>
                      <span className="msym" style={{fontSize:16}}>smart_toy</span>Run AI Audit
                    </Btn>
                    {(det.status==="inspection"||det.status==="funded")&&det.role==="Buyer"&&(
                      <Btn variant="green" style={{width:"100%",fontSize:13,justifyContent:"flex-start"}} onClick={()=>setTxs(p=>p.map(t=>t.id===det.id?{...t,status:"approved"}:t))}>
                        <span className="msym" style={{fontSize:16}}>check_circle</span>Approve &amp; Release
                      </Btn>
                    )}
                    <Btn variant="red" style={{width:"100%",fontSize:13,justifyContent:"flex-start"}} onClick={()=>setShowDispute(det)}>
                      <span className="msym" style={{fontSize:16}}>gavel</span>Raise Dispute
                    </Btn>
                  </div>
                  {det.status==="approved"&&<div style={{background:T.greenLt,borderRadius:8,padding:"10px 12px",fontSize:12.5,color:"#065f46",marginTop:10,display:"flex",alignItems:"center",gap:6}}><span className="msym" style={{fontSize:14}}>check_circle</span>Payment releases within 1 business day.</div>}
                  {det.status==="disputed"&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 12px",fontSize:12.5,color:T.red,marginTop:10,display:"flex",alignItems:"center",gap:6}}><span className="msym" style={{fontSize:14}}>warning</span>Dispute in review.</div>}
                  {det.status==="revision"&&<div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 12px",fontSize:12.5,color:"#c2410c",marginTop:10,display:"flex",alignItems:"center",gap:6}}><span className="msym" style={{fontSize:14}}>refresh</span>Revision requested.</div>}
                </div>
                <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,padding:"16px"}}>
                  <div style={{fontWeight:700,fontSize:12.5,color:T.primary,marginBottom:12,textTransform:"uppercase",letterSpacing:".06em"}}>Financial Summary</div>
                  {[["Project Value",det.currency+" "+det.amount?.toLocaleString()],["Escrow Fee (3.25%)",det.currency+" "+Math.round(det.amount*.0325).toLocaleString()],["Provider Receives",det.currency+" "+Math.round(det.amount*.9675).toLocaleString()]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+T.gray100,fontSize:13}}>
                      <span style={{color:T.gray500}}>{k}</span><span style={{fontWeight:600,color:T.primary}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontSize:14,fontWeight:800,color:T.primary}}>
                    <span>Total Protected</span><span>{det.currency} {det.amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC TAB */}
        {tab==="kyc"&&(
          <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,padding:"clamp(16px,4vw,28px)"}}>
            <h2 style={{fontSize:"clamp(18px,3vw,22px)",fontWeight:700,color:T.primary,marginBottom:6}}>Identity &amp; Business Verification</h2>
            <p style={{color:T.gray500,fontSize:13.5,marginBottom:22}}>Complete verification to unlock higher transaction limits and build trust with counterparties.</p>
            <div className="g2-dash" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:22}}>
              {[
                {icon:"mail",             title:"Email Verification",           done:true,    desc:"Required for all accounts."},
                {icon:"smartphone",       title:"Phone Verification",           done:false,   desc:"Add and verify your phone number."},
                {icon:"badge",            title:"Identity Verification",        done:kycDone, desc:"Government ID (Passport, Licence, NIN)."},
                {icon:"business",         title:"Business Verification",        done:false,   desc:"Company registration documents."},
                {icon:"workspace_premium",title:"Premium Manual Verification",  done:false,   desc:"For enterprise and high-value accounts."},
              ].map(v=>(
                <div key={v.title} style={{border:"1.5px solid "+(v.done?T.green:T.gray100),borderRadius:12,padding:"15px",display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span className="msym" style={{fontSize:22,color:v.done?T.green:T.gray400,flexShrink:0,marginTop:1}}>{v.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13.5,color:T.primary,marginBottom:3}}>{v.title}</div>
                    <div style={{fontSize:12,color:T.gray500,marginBottom:9}}>{v.desc}</div>
                    {v.done
                      ?<span style={{fontSize:11.5,fontWeight:700,color:T.green,background:T.greenLt,padding:"3px 10px",borderRadius:20,display:"inline-flex",alignItems:"center",gap:4}}><span className="msym" style={{fontSize:13}}>check_circle</span>Verified</span>
                      :<Btn variant="outline" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setShowKYC(true)}>Verify Now</Btn>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:T.offWhite,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontWeight:700,fontSize:13,color:T.primary,marginBottom:10}}>Verification Limits</div>
              <div className="g3-dash" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["Basic (Email)","Up to $500"],["Verified (ID)","Up to $50,000"],["Full KYC","Unlimited"]].map(([l,v])=>(
                  <div key={l} style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:9,padding:"12px",textAlign:"center"}}>
                    <div style={{fontWeight:600,fontSize:12,color:T.gray700,marginBottom:4}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:800,color:T.accent}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DISPUTES TAB */}
        {tab==="disputes"&&(
          <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,padding:"clamp(16px,4vw,28px)"}}>
            <h2 style={{fontSize:"clamp(18px,3vw,22px)",fontWeight:700,color:T.primary,marginBottom:6}}>Dispute Center</h2>
            <p style={{color:T.gray500,fontSize:13.5,marginBottom:20}}>AI-assisted dispute resolution with human arbitration. Fair, fast, and binding.</p>
            <div className="g3-dash" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:22}}>
              {[
                {icon:"smart_toy",   title:"AI Case Analysis",  desc:"Timeline reconstruction and evidence analysis generated automatically on filing."},
                {icon:"attach_file", title:"Evidence Uploads",  desc:"Upload screenshots, contracts, code links, and chat exports to support your case."},
                {icon:"gavel",       title:"Admin Arbitration", desc:"A Dispute Resolution Officer issues a binding decision within 5 business days."},
              ].map(d=>(
                <div key={d.title} style={{background:T.offWhite,borderRadius:12,padding:"16px",textAlign:"center"}}>
                  <span className="msym" style={{fontSize:28,color:T.primary,display:"block",marginBottom:10}}>{d.icon}</span>
                  <div style={{fontWeight:700,fontSize:13,color:T.primary,marginBottom:6}}>{d.title}</div>
                  <p style={{fontSize:12.5,color:T.gray500,lineHeight:1.7}}>{d.desc}</p>
                </div>
              ))}
            </div>
            <div style={{fontWeight:700,fontSize:14,color:T.primary,marginBottom:12}}>Active Disputes</div>
            {txs.filter(t=>t.status==="disputed").length===0
              ?<div style={{textAlign:"center",padding:"32px",color:T.gray400,fontSize:14,background:T.offWhite,borderRadius:12}}><span className="msym" style={{fontSize:36,display:"block",marginBottom:10}}>check_circle</span>No active disputes.</div>
              :txs.filter(t=>t.status==="disputed").map(tx=>(
                <div key={tx.id} style={{border:"1.5px solid #fecaca",borderRadius:12,padding:"14px 16px",background:"#fff5f5",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:10}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:T.red,marginBottom:3}}>{tx.title}</div><div style={{fontSize:12.5,color:T.gray500}}>{tx.id} &bull; ${tx.amount.toLocaleString()} &bull; {tx.other}</div></div>
                  <Btn variant="red" style={{fontSize:13}} onClick={()=>setShowDispute(tx)}>View / Update</Btn>
                </div>
              ))
            }
            <div style={{marginTop:20,padding:"16px",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12}}>
              <div style={{fontWeight:700,fontSize:13,color:T.primary,marginBottom:10}}>How it works</div>
              <div className="g2-dash" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {["Escrow funds frozen on filing","AI generates case summary automatically","Both parties submit evidence within 48h","Binding officer decision within 5 days","Refund or release based on outcome"].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:8,fontSize:13,color:"#1e40af"}}><span style={{fontWeight:700,color:T.primary,flexShrink:0}}>{i+1}.</span>{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab==="settings"&&<SettingsTab user={user}/>}

        {/* HISTORY TAB */}
        {tab==="history"&&(
          <div style={{background:T.white,border:"1px solid "+T.gray100,borderRadius:14,padding:"clamp(16px,4vw,28px)"}}>
            <h2 style={{fontSize:"clamp(18px,3vw,22px)",fontWeight:700,color:T.primary,marginBottom:6}}>Transaction History</h2>
            <p style={{color:T.gray500,fontSize:14,marginBottom:16}}>Complete archive with AI audit reports attached to every completed project.</p>
            <div className="hist-row" style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
              <Btn variant="outline" style={{fontSize:13}}><span className="msym" style={{fontSize:16}}>download</span>Download Statement (PDF)</Btn>
              <Btn variant="ghost" style={{color:T.primary,fontSize:13}}>Export via API</Btn>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:380}}>
                <thead><tr style={{background:T.offWhite}}>
                  {["Transaction","Value","Status","Date"].map(h=>(
                    <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10.5,fontWeight:700,color:T.gray500,textTransform:"uppercase",letterSpacing:".06em",borderBottom:"1px solid "+T.gray100,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {txs.map((tx,i)=>(
                    <tr key={tx.id} className="tr" style={{borderBottom:i<txs.length-1?"1px solid "+T.gray100:"none"}}>
                      <td style={{padding:"12px"}}>
                        <div style={{fontWeight:600,fontSize:13,color:T.primary}}>{tx.title}</div>
                        <div style={{fontSize:11,color:T.gray400,marginTop:1}}>{tx.id}</div>
                      </td>
                      <td style={{padding:"12px",fontWeight:700,fontSize:13,color:T.primary,whiteSpace:"nowrap"}}>${tx.amount.toLocaleString()}</td>
                      <td style={{padding:"12px"}}><SB status={tx.status}/></td>
                      <td style={{padding:"12px",fontSize:12,color:T.gray400,whiteSpace:"nowrap"}}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* NEW TRANSACTION MODAL */}
      {showNew&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&setShowNew(false)}>
          <div style={{background:T.white,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:560,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,.18)",animation:"fadeUp .25s ease"}}>
            <div style={{background:"linear-gradient(135deg,"+T.primary+","+T.primaryDk+")",padding:"18px 20px",color:T.white,position:"sticky",top:0,zIndex:1,borderRadius:"20px 20px 0 0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16}}>New Escrow Transaction</div>
                  <div style={{fontSize:12,opacity:.6,marginTop:2}}>Step {ns} of 3 &mdash; {["Project Details","Parties & Terms","Review"][ns-1]}</div>
                </div>
                <button onClick={()=>{setShowNew(false);setNs(1);}} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span className="msym" style={{fontSize:18}}>close</span>
                </button>
              </div>
              <div style={{display:"flex",gap:5,marginTop:12}}>{[1,2,3].map(n=><div key={n} style={{flex:1,height:3,borderRadius:2,background:ns>=n?T.accent:"rgba(255,255,255,.18)",transition:"background .2s"}}/>)}</div>
            </div>
            <div style={{padding:"18px 16px"}}>
              {ns===1&&(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Btn variant="teal" style={{width:"100%",fontSize:13}} onClick={()=>setShowScope(true)}><span className="msym" style={{fontSize:16}}>smart_toy</span>Use AI Scope Generator</Btn>
                  {scope&&<div style={{background:T.tealLt,border:"1px solid #99f6e4",borderRadius:9,padding:"10px 12px",fontSize:13,color:"#005235",display:"flex",alignItems:"center",gap:8}}><span className="msym" style={{fontSize:15}}>check_circle</span>Scope applied: <strong>{scope.title}</strong></div>}
                  <F label="Project Title" req><input style={fs} placeholder="e.g. E-commerce Backend Development" value={nf.title||scope?.title||""} onChange={hn("title")}/></F>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.gray700,marginBottom:8}}>Service Category *</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
                      {CATS.map(c=>(
                        <button key={c.id} onClick={()=>setNf(p=>({...p,type:c.id}))} style={{border:"1.5px solid "+(nf.type===c.id?c.color:T.gray100),borderRadius:8,padding:"7px 3px",cursor:"pointer",textAlign:"center",background:nf.type===c.id?c.color+"12":T.white,transition:"all .15s"}}>
                          <span className="msym" style={{fontSize:18,color:nf.type===c.id?c.color:T.gray400,display:"block",marginBottom:2}}>{c.icon}</span>
                          <div style={{fontSize:8.5,fontWeight:600,color:nf.type===c.id?c.color:T.gray500,lineHeight:1.2}}>{c.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 90px",gap:10}}>
                    <F label="Project Value" req><input style={fs} type="number" placeholder="0.00" value={nf.amount} onChange={hn("amount")}/></F>
                    <F label="Currency"><select style={fs} value={nf.currency} onChange={hn("currency")}>{CURR.map(c=><option key={c}>{c}</option>)}</select></F>
                  </div>
                  <F label="Number of Milestones"><select style={fs} value={nf.milestones} onChange={hn("milestones")}>{[1,2,3,4,5,6,8,10].map(n=><option key={n} value={n}>{n} milestone{n>1?"s":""}</option>)}</select></F>
                </div>
              )}
              {ns===2&&(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.gray700,marginBottom:8}}>Your Role *</div>
                    <div style={{display:"flex",gap:8}}>
                      {[["buyer","Client"],["seller","Provider"],["broker","Broker"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setNf(p=>({...p,role:v}))} style={{flex:1,padding:"10px 0",border:"1.5px solid "+(nf.role===v?T.primary:T.gray100),borderRadius:8,background:nf.role===v?"rgba(0,22,55,.07)":T.white,cursor:"pointer",fontSize:12.5,fontWeight:700,color:nf.role===v?T.primary:T.gray500,transition:"all .15s"}}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <F label="Counterparty Email" req><input style={fs} type="email" placeholder="their@email.com" value={nf.counterparty} onChange={hn("counterparty")}/></F>
                  <F label="Review Period"><select style={fs} value={nf.days} onChange={hn("days")}>{[1,2,3,5,7,10,14].map(d=><option key={d} value={d}>{d} {d===1?"day":"days"}</option>)}</select></F>
                  <div style={{background:T.tealLt,border:"1px solid #99f6e4",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#005235",display:"flex",alignItems:"center",gap:8}}>
                    <span className="msym" style={{fontSize:14}}>mail</span>The counterparty will receive an invitation to review and join this transaction.
                  </div>
                </div>
              )}
              {ns===3&&(
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:T.primary,marginBottom:12}}>Review Transaction</div>
                  <div className="modal-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                    {[["Title",nf.title||scope?.title||""],["Category",CATS.find(c=>c.id===nf.type)?.label||""],["Value",nf.currency+" "+parseFloat(nf.amount||0).toLocaleString()],["Role",nf.role],["Milestones",""+nf.milestones],["Review",nf.days+" days"],["Counterparty",nf.counterparty||""],["AI Audit","Included"]].map(([k,v])=>(
                      <div key={k} style={{background:T.offWhite,borderRadius:8,padding:"9px 11px"}}>
                        <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:T.gray400,marginBottom:2}}>{k}</div>
                        <div style={{fontSize:13,fontWeight:600,color:T.primary}}>{v||""}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:T.offWhite,borderRadius:9,padding:"11px 13px",fontSize:13,color:T.gray600,lineHeight:1.7}}>By creating this transaction you agree to the Terms of Service. An AI contract will be generated automatically.</div>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:18,gap:10}}>
                <Btn variant="outline" onClick={()=>ns>1?setNs(p=>p-1):setShowNew(false)}>{ns===1?"Cancel":"Back"}</Btn>
                <Btn variant="accent" onClick={()=>ns<3?setNs(p=>p+1):createTx()} disabled={ns===1&&(!(nf.title||scope?.title)||!nf.amount)}>{ns<3?"Continue":"Create Transaction"}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showKYC&&<KYC onClose={()=>setShowKYC(false)} onComplete={()=>{setKycDone(true);setShowKYC(false);}}/>}
      {showAudit&&<AuditModal tx={showAudit} onClose={()=>setShowAudit(null)} onApprove={()=>setTxs(p=>p.map(t=>t.id===showAudit.id?{...t,status:"approved"}:t))} onRevision={()=>setTxs(p=>p.map(t=>t.id===showAudit.id?{...t,status:"revision"}:t))}/>}
      {showDispute&&<DisputeModal tx={showDispute} onClose={()=>setShowDispute(null)} onSubmit={()=>setTxs(p=>p.map(t=>t.id===showDispute.id?{...t,status:"disputed"}:t))}/>}
      {showContract&&<ContractModal tx={showContract} scope={scope} onClose={()=>setShowContract(null)}/>}
      {showScope&&<ScopeModal catLabel={CATS.find(c=>c.id===nf.type)?.label||"Software"} onClose={()=>setShowScope(false)} onApply={s=>{setScope(s);setNf(p=>({...p,title:s.title}));}}/>}

      {/* Mobile Bottom Nav */}
      <nav className="mbb" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"#fbf9fc",borderTop:"1px solid #c5c6cf",boxShadow:"0 -2px 12px rgba(0,0,0,.06)",justifyContent:"space-around",alignItems:"center",height:66,padding:"0 4px"}}>
        {TABS.map(([k,icon,label])=>(
          <button key={k} onClick={()=>switchTab(k)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px 6px",color:tab===k?"#001637":"#44474e",flex:1,minWidth:0,borderTop:tab===k?"2px solid #001637":"2px solid transparent"}}>
            <span className="msym" style={{fontSize:22,color:tab===k?"#001637":"#75777f"}}>{icon}</span>
            <span style={{fontSize:9.5,fontWeight:tab===k?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};


/* ═══ SPLASH SCREEN (team design — intro before home) ═══════ */
const SplashScreen=({onDone})=>{
  const [prog,setProg]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setProg(35),500);
    const t2=setTimeout(()=>setProg(65),1800);
    const t3=setTimeout(()=>setProg(100),3000);
    const t4=setTimeout(()=>onDone(),3800);
    return()=>{[t1,t2,t3,t4].forEach(clearTimeout);};
  },[]);
  return(
    <div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#fbf9fc 0%,#f5f3f6 100%)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:"-10%",left:0,width:"100%",height:"50%",background:"linear-gradient(135deg,rgba(215,226,255,.25) 0%,transparent 80%)",filter:"blur(60px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"-5%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"rgba(130,249,190,.12)",filter:"blur(60px)",pointerEvents:"none"}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:64,position:"relative",zIndex:1,padding:"0 24px",width:"100%",maxWidth:430}}>
        {/* Logo */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28,animation:"fadeUp .6s .2s ease both"}}>
          <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",width:128,height:128}}>
            <div style={{position:"absolute",inset:-10,borderRadius:"50%",border:"2px solid rgba(180,199,241,.25)",animation:"pulse-ring 3s cubic-bezier(.4,0,.6,1) infinite"}}/>
            <div style={{position:"absolute",inset:-20,borderRadius:"50%",border:"1px solid rgba(180,199,241,.12)",animation:"pulse-ring 3s cubic-bezier(.4,0,.6,1) .5s infinite"}}/>
            <div style={{position:"relative",zIndex:1,background:"#172b4d",borderRadius:28,padding:24,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 20px 60px rgba(0,22,55,.28)"}}>
              <span className="msym" style={{fontSize:64,color:"#fff",fontVariationSettings:"'FILL' 1"}}>shield_with_heart</span>
              <div style={{position:"absolute",bottom:-4,right:-4,width:40,height:40,borderRadius:"50%",background:"#006c47",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:"4px solid #fbf9fc",boxShadow:"0 2px 8px rgba(0,108,71,.28)"}}>
                <span className="msym" style={{fontSize:18,fontVariationSettings:"'FILL' 1"}}>lock</span>
              </div>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <h1 style={{fontSize:30,fontWeight:800,color:"#001637",letterSpacing:"-.4px",marginBottom:4}}>Vault<span style={{color:"#006c47"}}>Pay</span></h1>
            <p style={{fontSize:11.5,fontWeight:600,color:"#75777f",letterSpacing:".2em",textTransform:"uppercase"}}>Institutional Trust</p>
          </div>
        </div>
        {/* Status + bar */}
        <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:18,animation:"fadeUp .6s .6s ease both"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:999,background:"#e9e7eb",border:"1px solid rgba(197,198,207,.4)"}}>
            <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#006c47",flexShrink:0,boxShadow:"0 0 0 3px rgba(0,108,71,.2)",animation:"pulse-ring 2s ease infinite"}}/>
            <span style={{fontSize:11,fontWeight:600,color:"#44474e",letterSpacing:".06em",textTransform:"uppercase"}}>Secure Connection Established</span>
          </div>
          <div style={{width:192,height:3,background:"#e4e2e5",borderRadius:999,overflow:"hidden",position:"relative"}}>
            <div style={{height:"100%",background:"#006c47",borderRadius:999,width:`${prog}%`,transition:"width 1s ease-out"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:28,opacity:.3,filter:"grayscale(1)",marginTop:4}}>
            {["verified_user","account_balance","security"].map(ic=><span key={ic} className="msym" style={{fontSize:22}}>{ic}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ FOOTER ════════════════════════════════════════════════ */
const Footer=()=>(
  <footer style={{background:`linear-gradient(135deg,${T.primaryDk},#0a2d5a)`,color:T.white,padding:"56px 1.5rem 28px"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <div className="fg" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:36,marginBottom:48}}>
        <div>
          <div style={{fontWeight:800,fontSize:20,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:T.primary,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:T.white,fontWeight:800,fontSize:16}}>V</div>
            Vault<span style={{color:T.gold}}>Pay</span>
          </div>
          <p style={{fontSize:13.5,color:"rgba(255,255,255,.44)",lineHeight:1.85,maxWidth:280,marginBottom:18}}>The AI-powered escrow platform for tech services — protecting clients and providers worldwide.</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {["AI Auditing","KYC","Dispute AI","$5B+ Protected"].map(b=><span key={b} style={{fontSize:11,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:6,padding:"3px 9px",color:"rgba(255,255,255,.44)",whiteSpace:"nowrap"}}>{b}</span>)}
          </div>
        </div>
        {[
          {title:"Services",  links:["Software Dev Escrow","Mobile App Escrow","Website Escrow","UI/UX Escrow","Cybersecurity","Cloud & DevOps","AI Development","IT Consulting","Data Analytics","Tech Docs"]},
          {title:"AI Features",links:["Scope Generator","Contract Generator","Deliverable Auditor","Fraud Detection","Dispute Assistant","Risk Scoring","Health Monitor"]},
          {title:"Business",  links:["Enterprise Plans","Escrow API","White Label","Become a Partner","API Documentation","Webhooks","Sandbox"]},
          {title:"Company",   links:["About VaultPay","Careers","Blog","Press","Help Center","Contact Us","Terms of Service","Privacy Policy"]},
        ].map(col=>(
          <div key={col.title}>
            <div style={{fontWeight:700,fontSize:11.5,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(255,255,255,.35)",marginBottom:14}}>{col.title}</div>
            {col.links.map(l=><div key={l} className="nl" style={{fontSize:13,color:"rgba(255,255,255,.48)",marginBottom:9,cursor:"pointer"}}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <span style={{fontSize:12,color:"rgba(255,255,255,.28)"}}>© 2005–2025 VaultPay Inc. All rights reserved. Licensed financial services provider.</span>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {["Privacy","Terms","Licenses","Legal","Cookies","GDPR"].map(l=><span key={l} style={{fontSize:12,color:"rgba(255,255,255,.28)",cursor:"pointer"}}>{l}</span>)}
        </div>
      </div>
    </div>
  </footer>
);

/* ═══ ROOT ══════════════════════════════════════════════════ */
export default function App(){
  const [page,setPage]=useState("splash");
  const [user,setUser]=useState(null);
  const navigate=p=>{setPage(p);window.scrollTo(0,0);};
  const onSuccess=u=>{setUser(u);navigate("dashboard");};

  if(page==="splash"){
    return(<><style>{CSS}</style><SplashScreen onDone={()=>navigate("home")}/></>);
  }
  if(page==="login"){
    return(<><style>{CSS}</style><LoginPage onSuccess={onSuccess} navigate={navigate}/></>);
  }
  if(page==="signup"){
    return(<><style>{CSS}</style><SignupPage onSuccess={onSuccess} navigate={navigate}/></>);
  }
  if(page==="forgot"){
    return(<><style>{CSS}</style><ForgotPasswordPage navigate={navigate}/></>);
  }
  if(page==="dashboard"&&user){
    return(<><style>{CSS}</style><Dashboard user={user} onLogout={()=>{setUser(null);navigate("home");}} navigate={navigate}/></>);
  }
  return(<>
    <style>{CSS}</style>
    <Navbar onLogin={()=>navigate("login")} onSignup={()=>navigate("signup")} navigate={navigate}/>
    <Hero onSignup={()=>navigate("signup")}/>
    <Stats/>
    <Workflow onSignup={()=>navigate("signup")}/>
    <Categories onSignup={()=>navigate("signup")}/>
    <AIFeatures onSignup={()=>navigate("signup")}/>
    <TechAuditing/>
    <Verification/>
    <Pricing onSignup={()=>navigate("signup")}/>
    <Enterprise onSignup={()=>navigate("signup")}/>
    <Security/>
    <Testimonials/>
    <FAQ/>
    <CTA onSignup={()=>navigate("signup")}/>
    <Footer/>
  </>);
}
