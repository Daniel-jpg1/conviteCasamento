//DADOS DO CONVITE

const INVITATION = {
  names: 'Daniel & Mabelle',
  subtitle: 'Temos a alegria de convidar você para celebrar o nosso casamento.',
  dateText: '26 de Outubro de 2025 — 15:00',
  placeText: 'Inocoop — Rua L, 230 — Cruz das Almas, BA',
  attire: 'Esporte fino',
  notes: 'Confirme presença até 12/10.',
  shortMsg: 'Junte-se a nós para celebrar o amor, a amizade e uma nova etapa nas nossas vidas.'
};

document.getElementById('names').textContent = INVITATION.names;
document.getElementById('subtitle').textContent = INVITATION.subtitle;
document.getElementById('dateText').textContent = INVITATION.dateText;
document.getElementById('placeText').textContent = INVITATION.placeText;
document.getElementById('attire').textContent = INVITATION.attire;
document.getElementById('notes').textContent = INVITATION.notes;
document.getElementById('shortMsg').textContent = INVITATION.shortMsg;
//FIM DOS DADOS DO CONVITE


// FORMULÁRIO OPEN AND CLOSE
const modalBg = document.getElementById('modalBg');
document.getElementById('openRsvp').addEventListener('click', ()=>{ modalBg.style.display='flex'; });
document.getElementById('closeModal').addEventListener('click', ()=>{ 
  modalBg.style.display='none'; 
  document.getElementById('rsvpMsg').textContent=''; 
});

//FIM FORM

//DADOS DO FORMULÁRIO PARA SEREM ENVIADOS

document.getElementById('submitRsvp').addEventListener('click', () => {
  const name = document.getElementById('inputName').value.trim();
  const qty = document.getElementById('inputQty').value || '1';
  
  if (!name) { 
    document.getElementById('rsvpMsg').textContent = 'Por favor, digite seu nome.'; 
    return; 
  }

  // Mensagem personalizada que será enviada pro WhatsApp
  const mensagem = `Olá! Sou ${name} e confirmo presença no casamento. Levarei ${qty} pessoa(s).`;

  // Monta o link do WhatsApp com a mensagem codificada
  const url = `https://wa.me/5575981322374?text=${encodeURIComponent(mensagem)}`;

  // Abre o WhatsApp com a mensagem pronta
  window.open(url, '_blank');

  // Feedback visual no site
  document.getElementById('rsvpMsg').textContent = `Obrigado, ${name}! Confirmado: ${qty} pessoa(s).`;

  fireConfetti(); // dispara o confete
  setTimeout(() => { modalBg.style.display = 'none'; }, 1200);
});

//FIM DADOS DO FORMULÁRIO

// Referência ao modal
const giftBg = document.getElementById('giftBg');

// Abrir modal
document.getElementById('printBtn').addEventListener('click', () => {
  giftBg.style.display = 'flex';
});

// Fechar modal
document.getElementById('closeGift').addEventListener('click', () => {
  giftBg.style.display = 'none';
});

// Copiar chave PIX
document.getElementById('copyPix').addEventListener('click', async () => {
  const key = document.getElementById('pixKey').textContent;
  const msg = document.getElementById('copyMsg');

  try {
    await navigator.clipboard.writeText(key);
    msg.textContent = 'Chave copiada ✅';
  } catch (err) {

    const textarea = document.createElement('textarea');
    textarea.value = key;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      msg.textContent = 'Chave copiada ✅';
    } catch {
      msg.textContent = 'Não foi possível copiar 😅';
    }
    document.body.removeChild(textarea);
  }

  setTimeout(() => { msg.textContent = ''; }, 2000);
});

// Animação confetti (canvas)
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W=canvas.width = innerWidth; H=canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

const confettiParticles = [];
function spawnConfetti(){
  for(let i=0;i<80;i++){
    confettiParticles.push({
      x: Math.random()*W, y: -10 - Math.random()*200,
      vx: (Math.random()-0.5)*6, vy: 2+Math.random()*4, 
      r: 6+Math.random()*6, rot: Math.random()*360, vr: (Math.random()-0.5)*6
    });
  }
}
function update(){
  ctx.clearRect(0,0,W,H);
  for(let i=confettiParticles.length-1;i>=0;i--){
    const p = confettiParticles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.vr;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
    ctx.fillStyle = `hsl(${(i*47)%360} 80% 60%)`;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    ctx.restore();
    if(p.y > H+50) confettiParticles.splice(i,1);
  }
  requestAnimationFrame(update);
}
function fireConfetti(){ spawnConfetti(); }
update();

//FIM DO CONFETTI

// Accessibility: close modal with Esc
addEventListener('keydown', (e)=>{ if(e.key==='Escape') modalBg.style.display='none'; });

// Optional: save RSVP locally
document.getElementById('submitRsvp').addEventListener('click', ()=>{
  const name = document.getElementById('inputName').value.trim();
  const qty = document.getElementById('inputQty').value;
  if(name){
    const arr = JSON.parse(localStorage.getItem('inv_rsvp')||'[]');
    arr.push({name, qty, at:new Date().toISOString()});
    localStorage.setItem('inv_rsvp', JSON.stringify(arr));
  }
});
