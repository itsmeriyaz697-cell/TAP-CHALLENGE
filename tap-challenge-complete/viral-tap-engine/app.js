const $ = s => document.querySelector(s);
const scoreEl=$("#score"), bestEl=$("#best"), levelEl=$("#level"), nextEl=$("#next");
const setup=$("#setup"), game=$("#game"), nameInput=$("#nameInput");
const challengeCard=$("#challengeCard"), challengeTitle=$("#challengeTitle"), challengeText=$("#challengeText"), targetScore=$("#targetScore");
const milestone=$("#milestone"), challengeResult=$("#challengeResult"), toast=$("#toast");

const levels = [
  [100,"Tapper"],[500,"Tap Addict"],[1000,"Tap Machine"],[5000,"Master Guffadi"],
  [10000,"Local Don"],[25000,"Tap Legend"],[50000,"Touch Grass Pro"],[100000,"No-Life Champion"]
];

let playerName = localStorage.getItem("tap_name") || "";
let score = Number(localStorage.getItem("tap_score") || 0);
let best = Number(localStorage.getItem("tap_best") || 0);
let lastMilestone = Number(localStorage.getItem("tap_last_milestone") || 0);

const params = new URLSearchParams(location.search);
const challengedName = clean(params.get("name") || "");
const challengedScore = Math.max(0, Number(params.get("score") || 0));

function clean(v){ return String(v).replace(/[<>]/g,"").trim().slice(0,24); }
function currentLevel(s){ let n=1; for(const [t] of levels) if(s>=t)n++; return n; }
function nextTarget(s){ for(const [t] of levels) if(s<t)return t; return "MAX"; }
function titleFor(s){ let title="Beginner"; for(const [t,n] of levels) if(s>=t)title=n; return title; }

if(challengedName && challengedScore){
  challengeCard.classList.remove("hidden");
  challengeTitle.textContent = `${challengedName} challenged you!`;
  challengeText.textContent = `${challengedName} has tapped ${challengedScore.toLocaleString()} times. Can you beat them today?`;
  targetScore.textContent = challengedScore.toLocaleString();
}

function render(){
  scoreEl.textContent=score.toLocaleString();
  bestEl.textContent=best.toLocaleString();
  levelEl.textContent=currentLevel(score);
  nextEl.textContent=nextTarget(score).toLocaleString ? nextTarget(score).toLocaleString() : nextTarget(score);
  $("#hello").textContent=`Hey, ${playerName}!`;
  if(challengedScore){
    challengeResult.classList.remove("hidden");
    challengeResult.textContent = score > challengedScore
      ? `🏆 You beat ${challengedName || "your friend"} by ${(score-challengedScore).toLocaleString()} taps!`
      : `🎯 ${Math.max(0, challengedScore-score).toLocaleString()} more taps to beat ${challengedName || "your friend"}.`;
  }
}
function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}
function save(){
  localStorage.setItem("tap_name",playerName);
  localStorage.setItem("tap_score",score);
  localStorage.setItem("tap_best",best);
  localStorage.setItem("tap_last_milestone",lastMilestone);
}
function checkMilestone(){
  for(const [threshold,title] of levels){
    if(score>=threshold && threshold>lastMilestone){
      lastMilestone=threshold;
      milestone.classList.remove("hidden");
      milestone.innerHTML=`🏆 <strong>Level unlocked!</strong> ${title} — ${threshold.toLocaleString()} taps`;
      showToast(`Unlocked: ${title}!`);
      break;
    }
  }
}
function start(){
  const n=clean(nameInput.value);
  if(!n){nameInput.focus();showToast("Enter your name first.");return;}
  playerName=n; localStorage.setItem("tap_name",n);
  setup.classList.add("hidden"); game.classList.remove("hidden");
  render();
}
if(playerName){ nameInput.value=playerName; setup.classList.add("hidden"); game.classList.remove("hidden"); render(); }

$("#startBtn").addEventListener("click",start);
nameInput.addEventListener("keydown",e=>{if(e.key==="Enter")start();});
$("#tapBtn").addEventListener("click",()=>{
  score++;
  if(score>best) best=score;
  checkMilestone(); save(); render();
});
$("#resetBtn").addEventListener("click",()=>{
  if(confirm("Reset your current score?")){score=0;lastMilestone=0;save();render();milestone.classList.add("hidden");}
});

$("#shareBtn").addEventListener("click",async()=>{
  const url=new URL(location.href);
  url.search="";
  url.searchParams.set("name",playerName);
  url.searchParams.set("score",score);
  const text=`🔥 ${playerName} challenged you! They scored ${score.toLocaleString()} taps. Can you beat them?`;
  if(navigator.share){
    try{await navigator.share({title:"Tap Challenge",text,url:url.href});}catch(e){}
  }else{
    await navigator.clipboard.writeText(url.href);
    showToast("Challenge link copied!");
  }
});

$("#badgeBtn").addEventListener("click",()=>{
  const title=titleFor(score);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <rect width="100%" height="100%" rx="48" fill="#111"/>
  <text x="600" y="210" text-anchor="middle" fill="white" font-family="Arial" font-size="64" font-weight="700">TAP CHALLENGE</text>
  <text x="600" y="350" text-anchor="middle" fill="#ffd166" font-family="Arial" font-size="82" font-weight="900">${title}</text>
  <text x="600" y="470" text-anchor="middle" fill="white" font-family="Arial" font-size="48">${playerName.replace(/&/g,"&amp;")}</text>
  <text x="600" y="570" text-anchor="middle" fill="#aaa" font-family="Arial" font-size="42">${score.toLocaleString()} TAPS</text>
  <text x="600" y="690" text-anchor="middle" fill="#777" font-family="Arial" font-size="28">Built by Riyaz Chalise</text>
  </svg>`;
  const blob=new Blob([svg],{type:"image/svg+xml"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${title.replace(/\s+/g,"-").toLowerCase()}-badge.svg`;a.click();
  URL.revokeObjectURL(a.href);
});

document.addEventListener("keydown",e=>{
  if(e.code==="Space" && !game.classList.contains("hidden")){e.preventDefault();$("#tapBtn").click();}
});
