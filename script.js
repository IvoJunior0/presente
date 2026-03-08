/* ================================================
   STEPHANIE — DIA DAS MULHERES
   script.js
   ================================================ */

'use strict';

/* ── Aguarda o DOM carregar ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. ENVELOPE — ANIMAÇÃO DE ABERTURA
     ================================================ */

  const openBtn      = document.getElementById('openBtn');
  const envelope     = document.getElementById('envelope');
  const envelopePage = document.getElementById('envelope-page');
  const mainPage     = document.getElementById('main-page');

  /* Gera pétalas decorativas na tela do envelope */
  const petalContainer = document.getElementById('envPetals');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left     = Math.random() * 100 + '%';
    p.style.width    = (8 + Math.random() * 10) + 'px';
    p.style.height   = p.style.width;
    p.style.animationDuration  = (4 + Math.random() * 5) + 's';
    p.style.animationDelay     = (Math.random() * 6) + 's';
    p.style.opacity  = 0.3 + Math.random() * 0.5;
    petalContainer.appendChild(p);
  }

  /* Clique no botão */
  openBtn.addEventListener('click', () => {
    /* Desabilita o botão para evitar clique duplo */
    openBtn.disabled = true;

    /* Passo 1: abre o envelope */
    envelope.classList.add('opening');

    /* Passo 2: após 700ms mostra o flash de brilho */
    setTimeout(() => {
      const flash = document.createElement('div');
      flash.className = 'sparkle-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 800);
    }, 700);

    /* Passo 3: redireciona para o site principal */
    setTimeout(() => {
      envelopePage.classList.add('hidden');
      mainPage.classList.remove('hidden');

      /* Inicia o canvas de corações */
      initHeartsCanvas();

      /* Activa observador de fade-in */
      initScrollObserver();

      /* Faz scroll para o topo */
      window.scrollTo(0, 0);

      /* Primeira seção já visível */
      const firstSection = mainPage.querySelector('.fade-in-section');
      if (firstSection) firstSection.classList.add('visible');
    }, 1500);
  });


  /* ================================================
     2. CHUVA DE CORAÇÕES — CANVAS
     ================================================ */

  function initHeartsCanvas() {
    const canvas = document.getElementById('heartsCanvas');
    const ctx    = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    /* Redimensiona com a janela */
    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    });

    /* Classe Coração */
    class Heart {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x     = Math.random() * W;
        this.y     = initial ? (Math.random() * H * 2 - H) : -30;
        this.size  = 8 + Math.random() * 16;
        this.speed = 0.5 + Math.random() * 1.2;
        this.alpha = 0.15 + Math.random() * 0.4;
        this.drift = (Math.random() - 0.5) * 0.4;  /* desvio lateral suave */
        this.rot   = (Math.random() - 0.5) * 0.05; /* leve rotação */
        this.angle = 0;
      }

      /* Desenha o coração com path */
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.size / 20, this.size / 20);

        ctx.beginPath();
        /* Path de coração centrado em (0,0) com tamanho ~20px */
        ctx.moveTo(0, -5);
        ctx.bezierCurveTo(-10, -14, -20, -6, -20, 2);
        ctx.bezierCurveTo(-20, 10, -10, 16, 0, 22);
        ctx.bezierCurveTo(10, 16, 20, 10, 20, 2);
        ctx.bezierCurveTo(20, -6, 10, -14, 0, -5);
        ctx.closePath();

        ctx.fillStyle = `rgba(210, 80, 100, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.y      += this.speed;
        this.x      += this.drift;
        this.angle  += this.rot;

        /* Recicla quando sai da tela */
        if (this.y > H + 40) this.reset();
      }
    }

    /* Cria 35 corações — leve o suficiente para mobile */
    const hearts = Array.from({ length: 35 }, () => new Heart());

    /* Loop de animação */
    function loop() {
      ctx.clearRect(0, 0, W, H);
      hearts.forEach(h => { h.update(); h.draw(); });
      requestAnimationFrame(loop);
    }
    loop();
  }


  /* ================================================
     3. FADE-IN DAS SEÇÕES AO ROLAR
     ================================================ */

  function initScrollObserver() {
    const sections = mainPage.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(s => observer.observe(s));
  }


  /* ================================================
     4. MODAL — O QUE EU AMO EM VOCÊ
     ================================================ */

  const loveCards    = document.querySelectorAll('.love-card');
  const loveModal    = document.getElementById('loveModal');
  const loveModalTxt = document.getElementById('loveModalText');
  const loveModalClose = document.getElementById('loveModalClose');

  /* Abre modal com a mensagem do card clicado */
  loveCards.forEach(card => {
    card.addEventListener('click', () => {
      const msg = card.dataset.msg;
      loveModalTxt.textContent = msg;
      loveModal.classList.add('open');
    });
  });

  /* Fecha modal */
  function closeModal() { loveModal.classList.remove('open'); }
  loveModalClose.addEventListener('click', closeModal);
  loveModal.addEventListener('click', e => {
    if (e.target === loveModal) closeModal();
  });

  /* Fecha com ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });


  /* ================================================
     5. TERMO — JOGO ESTILO WORDLE
     ================================================ */

  const TERMO_WORD    = 'CABELO';   // palavra secreta (6 letras)
  const TERMO_ROWS    = 6;
  const TERMO_COLS    = 6;

  let termoCurRow  = 0;
  let termoCurCol  = 0;
  let termoOver    = false;
  let termoCurrent = Array(TERMO_COLS).fill(''); // letras da linha atual

  // Estado das teclas para colorir o teclado
  const keyState = {};

  // Layout do teclado (ABNT simplificado)
  const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
  ];

  const termoGrid     = document.getElementById('termoGrid');
  const termoKeyboard = document.getElementById('termoKeyboard');
  const gameWin       = document.getElementById('gameWin');
  const gameWinHearts = document.getElementById('gameWinHearts');
  const gameLose      = document.getElementById('gameLose');

  /* Monta grade vazia */
  function buildGrid() {
    termoGrid.innerHTML = '';
    for (let r = 0; r < TERMO_ROWS; r++) {
      const row = document.createElement('div');
      row.className = 'termo-row';
      row.id = `trow-${r}`;
      for (let c = 0; c < TERMO_COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'termo-cell';
        cell.id = `tcell-${r}-${c}`;
        row.appendChild(cell);
      }
      termoGrid.appendChild(row);
    }
  }

  /* Monta teclado visual */
  function buildKeyboard() {
    termoKeyboard.innerHTML = '';
    KB_ROWS.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'termo-kb-row';
      row.forEach(k => {
        const btn = document.createElement('button');
        btn.className = 'termo-key' + (k.length > 1 ? ' wide' : '');
        btn.textContent = k;
        btn.dataset.key = k;
        btn.addEventListener('click', () => handleKey(k));
        rowEl.appendChild(btn);
      });
      termoKeyboard.appendChild(rowEl);
    });
  }

  /* Atualiza célula atual */
  function updateCell(r, c, letter) {
    const cell = document.getElementById(`tcell-${r}-${c}`);
    cell.textContent = letter;
    cell.classList.toggle('filled', letter !== '');
  }

  /* Processa tecla */
  function handleKey(key) {
    if (termoOver) return;

    if (key === '⌫' || key === 'Backspace') {
      if (termoCurCol > 0) {
        termoCurCol--;
        termoCurrent[termoCurCol] = '';
        updateCell(termoCurRow, termoCurCol, '');
      }
      return;
    }

    if (key === 'ENTER' || key === 'Enter') {
      submitGuess();
      return;
    }

    // Letra normal (só aceita A-Z)
    if (/^[A-ZÇ]$/i.test(key) && termoCurCol < TERMO_COLS) {
      const letter = key.toUpperCase();
      termoCurrent[termoCurCol] = letter;
      updateCell(termoCurRow, termoCurCol, letter);
      termoCurCol++;
    }
  }

  /* Avalia a tentativa */
  function submitGuess() {
    if (termoCurCol < TERMO_COLS) {
      // linha incompleta — shake
      shakeRow(termoCurRow);
      return;
    }

    const guess = termoCurrent.join('');
    const result = evaluateGuess(guess, TERMO_WORD);

    revealRow(termoCurRow, result, guess, () => {
      // Após revelar, verifica resultado
      if (guess === TERMO_WORD) {
        termoOver = true;
        setTimeout(() => showWin(), 200);
      } else if (termoCurRow >= TERMO_ROWS - 1) {
        termoOver = true;
        setTimeout(() => gameLose.classList.remove('hidden'), 400);
      }
    });

    termoCurRow++;
    termoCurCol = 0;
    termoCurrent = Array(TERMO_COLS).fill('');
  }

  /* Avalia letras: correct / present / absent */
  function evaluateGuess(guess, word) {
    const result  = Array(TERMO_COLS).fill('absent');
    const wLeft   = word.split('');
    const gLeft   = guess.split('');

    // Primeira passagem: corretos
    for (let i = 0; i < TERMO_COLS; i++) {
      if (gLeft[i] === wLeft[i]) {
        result[i]  = 'correct';
        wLeft[i]   = null;
        gLeft[i]   = null;
      }
    }
    // Segunda passagem: presentes
    for (let i = 0; i < TERMO_COLS; i++) {
      if (gLeft[i] === null) continue;
      const idx = wLeft.indexOf(gLeft[i]);
      if (idx !== -1) {
        result[i]  = 'present';
        wLeft[idx] = null;
      }
    }
    return result;
  }

  /* Anima revelação das células */
  function revealRow(row, result, guess, cb) {
    for (let c = 0; c < TERMO_COLS; c++) {
      const cell = document.getElementById(`tcell-${row}-${c}`);
      const delay = c * 120;
      setTimeout(() => {
        cell.classList.add('flip');
        setTimeout(() => {
          cell.classList.add(result[c]);
          cell.classList.remove('filled');
          // Atualiza estado da tecla
          const letter = guess[c];
          const cur = keyState[letter];
          const priority = { correct: 3, present: 2, absent: 1 };
          if (!cur || priority[result[c]] > priority[cur]) {
            keyState[letter] = result[c];
            updateKeyColor(letter, result[c]);
          }
        }, 250);
      }, delay);
    }
    // Callback após última célula revelar
    setTimeout(cb, TERMO_COLS * 120 + 400);
  }

  /* Atualiza cor da tecla no teclado */
  function updateKeyColor(letter, state) {
    const btn = termoKeyboard.querySelector(`[data-key="${letter}"]`);
    if (btn) {
      btn.classList.remove('correct','present','absent');
      btn.classList.add(state);
    }
  }

  /* Animação shake na linha */
  function shakeRow(row) {
    const rowEl = document.getElementById(`trow-${row}`);
    rowEl.classList.add('shake');
    rowEl.addEventListener('animationend', () => rowEl.classList.remove('shake'), { once: true });
  }

  /* Exibe vitória */
  function showWin() {
    gameWinHearts.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 24 24');
      const p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z');
      svg.appendChild(p);
      gameWinHearts.appendChild(svg);
    }
    gameWin.classList.remove('hidden');
  }

  /* Teclado físico */
  document.addEventListener('keydown', e => {
    if (termoOver) return;
    // Só processa quando a seção de jogo está visível
    const gameSection = document.querySelector('.section-game');
    if (!gameSection || !gameSection.classList.contains('visible')) return;

    if (e.key === 'Backspace') { handleKey('Backspace'); return; }
    if (e.key === 'Enter')     { handleKey('Enter');     return; }
    if (/^[a-zA-ZçÇ]$/.test(e.key)) handleKey(e.key.toUpperCase());
  });

  buildGrid();
  buildKeyboard();


  /* ================================================
     6. CARTA INTERATIVA
     ================================================ */

  const letterOpenBtn = document.getElementById('letterOpenBtn');
  const letterEnv     = document.getElementById('letterEnv');
  const letterPaper   = document.getElementById('letterPaper');

  letterOpenBtn.addEventListener('click', () => {
    // 1. Abre o envelope
    letterEnv.classList.add('opening');

    // 2. Esconde envelope e botão, mostra a carta
    setTimeout(() => {
      letterEnv.classList.add('hide');
      letterOpenBtn.classList.add('hide');
      letterPaper.classList.remove('hidden');
    }, 700);
  });


  /* ================================================
     7. MENSAGEM SECRETA
     ================================================ */

  const SECRET_PASS   = 'arlequina';
  const secretInput   = document.getElementById('secretInput');
  const secretBtn     = document.getElementById('secretBtn');
  const secretError   = document.getElementById('secretError');
  const secretLock    = document.getElementById('secretLock');
  const secretUnlocked = document.getElementById('secretUnlocked');
  const secretHearts  = document.getElementById('secretHearts');

  function trySecret() {
    const val = secretInput.value.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'');

    if (val === SECRET_PASS) {
      // Esconde lock, mostra mensagem
      secretLock.classList.add('hidden');

      // Cria corações animados
      secretHearts.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 24 24');
        const p = document.createElementNS('http://www.w3.org/2000/svg','path');
        p.setAttribute('d','M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z');
        svg.appendChild(p);
        secretHearts.appendChild(svg);
      }

      secretUnlocked.classList.remove('hidden');
    } else {
      // Senha errada — shake + mensagem de erro
      secretError.classList.remove('hidden');
      secretInput.classList.add('shake-input');
      secretInput.addEventListener('animationend', () => {
        secretInput.classList.remove('shake-input');
      }, { once: true });
      secretInput.value = '';
    }
  }

  secretBtn.addEventListener('click', trySecret);
  secretInput.addEventListener('keydown', e => { if (e.key === 'Enter') trySecret(); });

}); // fim DOMContentLoaded
