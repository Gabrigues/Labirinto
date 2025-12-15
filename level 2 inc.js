let canvas = document.getElementById("meuCanvas");
let ctx = canvas.getContext("2d");
let jogoPausado = false;
let faseAtual = 0;

//É usado switch ou um mapeamento de teclas para simplificar a quantidade de ifs e elses

let teclado = {
  cima: false,
  baixo: false,
  esquerda: false,
  direita: false,
};

const mapTeclas = {
  ArrowLeft: "esquerda",
  ArrowRight: "direita",
  ArrowUp: "cima",
  ArrowDown: "baixo",
};

window.addEventListener("keydown", (e) => {
  const dir = mapTeclas[e.key];
  if (dir) teclado[dir] = true;
});

window.addEventListener("keyup", (e) => {
  const dir = mapTeclas[e.key];
  if (dir) teclado[dir] = false;
});

const fases = [
  //Isso é apenas usado para delimitar o que está dentro de "fases"
  {
    //Isso é usado para separar o conteúdo das fases
    // ==============Fase 1 ==================
    paredes: [
      //Limites Canvas
      { x1: 1, y1: 1, x2: 699, y2: 1 },
      { x1: 699, y1: 1, x2: 699, y2: 499 },
      { x1: 699, y1: 499, x2: 1, y2: 499 },
      { x1: 1, y1: 499, x2: 1, y2: 1 },

      //inicio
      { x1: 180, y1: 250, x2: 180, y2: 100 },
      { x1: 180, y1: 100, x2: 300, y2: 100 },
      { x1: 0, y1: 100, x2: 80, y2: 100 },
      { x1: 80, y1: 100, x2: 80, y2: 250 },
      { x1: 180, y1: 250, x2: 80, y2: 250 },

      //área chave
      { x1: 400, y1: 100, x2: 400, y2: 200 },
      { x1: 550, y1: 100, x2: 400, y2: 100 },

      //puzzle 2
      { x1: 80, y1: 250, x2: 80, y2: 325 },
      { x1: 80, y1: 425, x2: 80, y2: 500 },
      { x1: 180, y1: 350, x2: 180, y2: 500 },

      //Limites puzzle 3
      { x1: 700, y1: 200, x2: 300, y2: 200 },
      { x1: 300, y1: 200, x2: 300, y2: 400 },

      //Puzzle 3
      { x1: 400, y1: 300, x2: 400, y2: 400 },
      { x1: 595, y1: 400, x2: 595, y2: 500 },
      { x1: 700, y1: 300, x2: 500, y2: 300 },
      { x1: 500, y1: 300, x2: 500, y2: 400 },
      { x1: 500, y1: 400, x2: 480, y2: 400 },
    ],
    portas: [
      { x1: 181, y1: 200, x2: 299, y2: 215, cor: "#87943eff" }, // Primeira porta
      { x1: 181, y1: 400, x2: 299, y2: 385, cor: "#ae2e2eff", id: "portaB" }, // segunda porta
      { x1: 595, y1: 390, x2: 500, y2: 400, cor: "#52134dff", id: "portaC" },
      { x1: 595, y1: 300, x2: 605, y2: 400, cor: "#235680ff", id: "portaD" },
    ],
    caixas: [
      { x: 100, y: 360, largura: 70, altura: 70 },
      { x: 5, y: 250, largura: 70, altura: 70 },
      { x: 415, y: 215, largura: 70, altura: 70 },
      { x: 415, y: 310, largura: 70, altura: 70 },
    ],
    chavePos: { x: 400, y: 100 },
    chegada: { x: 600, y: 401, largura: 99, altura: 98, cor: "#119b11ff" },
    inimigoPos: [{ x: 200, y: 20, limiteMax: 600, limiteMin: 20 }],
    agua: [],
    botoes: [
      //Precisa colocar dentro disso mesmo sendo apenas um único, pois for of lê arrays
      {
        x: 20,
        y: 125,
        largura: 40,
        altura: 40,
        cor: "#ae2e2eff",
        corLev: "#ae2e2eff",
        sombra: "#4d2626ff",
        portaAlvo: "portaB",
      },
      {
        x: 620,
        y: 230,
        largura: 40,
        altura: 40,
        cor: "#52134dff",
        corLev: "#52134dff",
        sombra: "#370e36ff",
        portaAlvo: "portaC",
      },
      {
        x: 520,
        y: 230,
        largura: 40,
        altura: 40,
        cor: "#235680ff",
        corLev: "#235680ff",
        sombra: "#122539ff",
        portaAlvo: "portaD",
      },
    ],
  },

  // ================Fase 2===================
  {
    paredes: [
      //Limites do canvas
      { x1: 1, y1: 1, x2: 699, y2: 1 },
      { x1: 699, y1: 1, x2: 699, y2: 499 },
      { x1: 699, y1: 499, x2: 1, y2: 499 },
      { x1: 1, y1: 499, x2: 1, y2: 1 },

      //puzzle 1
      { x1: 0, y1: 100, x2: 225, y2: 100 },
      { x1: 200, y1: 100, x2: 200, y2: 330 },
      { x1: 100, y1: 300, x2: 100, y2: 275 },

      //puzzle 2
      { x1: 0, y1: 400, x2: 20, y2: 400 },
      { x1: 300, y1: 500, x2: 300, y2: 400 },
      { x1: 300, y1: 300, x2: 200, y2: 300 },

      //Puzzle 3
      { x1: 700, y1: 100, x2: 325, y2: 100 },
      { x1: 300, y1: 300, x2: 500, y2: 300 },
      { x1: 350, y1: 100, x2: 350, y2: 200 },
      { x1: 500, y1: 100, x2: 500, y2: 200 },
    ],
    portas: [
      { x1: 200, y1: 0, x2: 210, y2: 100, cor: "#c4bc28ff", id: "portaA" },
      { x1: 100, y1: 300, x2: 200, y2: 310, cor: "#c4bc28ff", id: "portaA" },
      { x1: 0, y1: 300, x2: 100, y2: 310, cor: "#28b7c4ff", id: "portaB" },
      { x1: 300, y1: 300, x2: 310, y2: 400, cor: "#760994ff", id: "portaC" },
      { x1: 225, y1: 100, x2: 325, y2: 110, cor: "#cf1d1dff", id: "portaD" },
      { x1: 450, y1: 0, x2: 460, y2: 100, cor: "#221087ff", id: "portaE" },
      { x1: 600, y1: 0, x2: 590, y2: 100, cor: "#c61794ff", id: "portaF" },
    ],
    caixas: [{ x: 120, y: 320, largura: 70, altura: 70 }],
    chavePos: {},
    chegada: { x: 250, y: 15, largura: 70, altura: 70, cor: "#119b11ff" },
    inimigoPos: [
      { x: 300, y: 20, limiteMax: 620, limiteMin: 30 },
      { x: 300, y: 220, limiteMax: 600, limiteMin: 210 },
    ],
    agua: [
      { x: 350, y: 300, largura: 100, altura: 200, cor: "#0d3e83ff" },
      { x: 200, y: 200, largura: 500, altura: 99, cor: "#0d3e83ff" }
    ],
    botoes: [
      {
        x: 20,
        y: 120,
        largura: 40,
        altura: 40,
        cor: "#c4bc28ff",
        corLev: "#c4bc28ff",
        sombra: "#65611aff",
        portaAlvo: "portaA",
      },
      {
        x: 75,
        y: 30,
        largura: 40,
        altura: 40,
        cor: "#28b7c4ff",
        corLev: "#28b7c4ff",
        sombra: "#16656cff",
        portaAlvo: "portaB",
      },
      {
        x: 370,
        y: 30,
        largura: 40,
        altura: 40,
        cor: "#760994ff",
        corLev: "#760994ff",
        sombra: "#440655ff",
        portaAlvo: "portaC",
      },
      {
        x: 630,
        y: 30,
        largura: 40,
        altura: 40,
        cor: "#cf1d1dff",
        corLev: "#cf1d1dff",
        sombra: "#740f0fff",
        portaAlvo: "portaD",
      },
      {
        x: 380,
        y: 130,
        largura: 40,
        altura: 40,
        cor: "#221087ff",
        corLev: "#221087ff",
        sombra: "#130947ff",
        portaAlvo: "portaE",
      },
      {
        x: 570,
        y: 130,
        largura: 40,
        altura: 40,
        cor: "#c61794ff",
        corLev: "#c61794ff",
        sombra: "#7d115eff",
        portaAlvo: "portaF",
      },
    ],
  },
];

class Jogador {
  constructor(ctx, teclado, mapa, faseData) {
    this.ctx = ctx;
    this.teclado = teclado;
    this.mapa = mapa;

    this.chegada = faseData.chegada;

    this.x = 100;
    this.y = 102;
    this.vel = 3;

    this.sprite = new Image();
    this.sprite.src = "imagens/Jogador.png";

    this.largSprite = 66;
    this.altSprite = 100;
    this.skipAltSprite = 15;
    this.qntSprite = 0;
    this.numSprites = 4;
    this.frameDelay = 0;
    this.linhaSprite = 0;

    this.altHitbox = 80;
    this.largHitbox = 62;

    this.pressionadoDesde = {
      //Variável de controle de tempo que é declarada aqui, mas que é alterada em gerenciar()
      cima: null,
      baixo: null,
      esquerda: null,
      direita: null,
    };
  }
  //Método criado para simplificar as mesmas mensagens que aparecem em derrota() e vitória()
  mostrarTelaFinal(tipo) {
    document.getElementById("mensagem" + tipo).style.display = "block";
    document.getElementById("restart").style.display = "block";
    document.getElementById("next").style.display =
      tipo === "Vitoria" ? "flex" : "none";
    document.getElementById("restart").style.left =
      tipo === "Vitoria" ? "650px" : "725px";
    document.getElementById("nevoa").style.display = "block";
    jogoPausado = true;

    if (tipo === "Vitoria") {
      document.getElementById("next").onclick = () => {
        iniciarFase(faseAtual + 1);
      };
    }

    document.getElementById("restart").addEventListener("click", () => {
      iniciarFase(faseAtual);
    });
  }

  // Verifica se o jogador chegou ao destino
  verificarChegada() {
    ctx.fillStyle = this.chegada.cor; // Cor verde para a chegada
    ctx.fillRect(
      this.chegada.x,
      this.chegada.y,
      this.chegada.largura,
      this.chegada.altura
    );

    if (
      this.x < this.chegada.x + this.chegada.largura &&
      this.x + this.largHitbox > this.chegada.x &&
      this.y < this.chegada.y + this.chegada.altura &&
      this.y + this.altHitbox > this.chegada.y
    ) {
      this.mostrarTelaFinal("Vitoria");
    }
  }

  derrota(inimigo) {
    //retângulo do jogador
    const rect1 = {
      x: this.x,
      y: this.y,
      largura: this.largHitbox,
      altura: this.altHitbox,
    };

    //retângulo do inimigo
    const rect2 = {
      x: inimigo.inimigoData.x,
      y: inimigo.inimigoData.y,
      largura: inimigo.inimigoData.largura,
      altura: inimigo.inimigoData.altura,
    };

    if (
      rect1.x < rect2.x + rect2.largura &&
      rect1.x + rect1.largura > rect2.x &&
      rect1.y < rect2.y + rect2.altura &&
      rect1.y + rect1.altura > rect2.y
    ) {
      this.mostrarTelaFinal("Derrota"); //Aplicaçãpo de método para simplificar
    }
  }

  gerenciar() {
    this.dx = 0;
    this.dy = 0;

    if (this.teclado.cima && this.mapa.podeMover(0, -this.vel, this)) {
      this.dy -= 1;
      this.linhaSprite = 1;
    }
    if (this.teclado.baixo && this.mapa.podeMover(0, this.vel, this)) {
      this.dy += 1;
      this.linhaSprite = 0;
    }
    if (this.teclado.esquerda && this.mapa.podeMover(-this.vel, 0, this)) {
      this.dx -= 1;
      this.linhaSprite = 2;
    }
    if (this.teclado.direita && this.mapa.podeMover(this.vel, 0, this)) {
      this.dx += 1;
      this.linhaSprite = 3;
    }

    /*dx e dy representam direções única para onde o personagem quer ir, não quanto. vel, é em si a velocidade de movimento em pixels por frame.
	Assim, dx = 1 apenas diz que o personagem quer ir para a direita, não o quanto
	Para transformar isso em movimento real, é necessário realizar a multiplicação, como dx *= vel*/

    // Normalizar velocidade diagonal
    if (this.dx !== 0 && this.dy !== 0) {
      const diagonalVel = this.vel / Math.sqrt(2);
      this.dx *= diagonalVel;
      this.dy *= diagonalVel;
    } else {
      this.dx *= this.vel;
      this.dy *= this.vel;
    }

    if (this.mapa.podeMover(this.dx, this.dy, this)) {
      this.x += this.dx;
      this.y += this.dy;
    }

    // Gerenciar aumento de velociadade após 1s pressionada
    //Grande simplificação feita pelo mapeamento do teclado

    ["cima", "baixo", "esquerda", "direita"].forEach((dir) => {
      if (this.teclado[dir]) {
        if (this.pressionadoDesde[dir] === null) {
          this.pressionadoDesde[dir] = Date.now();
        }
      } else {
        this.pressionadoDesde[dir] = null;
      }
    });

    //Trecho também muito simplificado
    let tempoPressionado = 0;
    for (let dir of ["cima", "baixo", "esquerda", "direita"]) {
      if (this.teclado[dir] && this.pressionadoDesde[dir] !== null) {
        tempoPressionado = Date.now() - this.pressionadoDesde[dir];
        break;
      }
    }

    if (tempoPressionado > 1000) {
      this.vel = 4.5; // Aumenta vel
    } else {
      this.vel = 3; // Vel normal
    }
  }

  animar() {
    if (
      this.teclado.cima ||
      this.teclado.baixo ||
      this.teclado.esquerda ||
      this.teclado.direita
    ) {
      this.frameDelay++;
      if (this.frameDelay > 10) {
        this.qntSprite = (this.qntSprite + 1) % this.numSprites;
        this.frameDelay = 0;
      }
    } else {
      this.qntSprite = 0;
    }
  }

  desenhar() {
    this.gerenciar();
    this.animar();

    let posIniX = this.qntSprite * this.largSprite;
    let posIniY = this.linhaSprite * this.altSprite + this.skipAltSprite;
    this.ctx.drawImage(
      this.sprite,
      posIniX,
      posIniY,
      this.largSprite,
      this.altSprite,
      this.x,
      this.y,
      this.largSprite,
      this.altSprite
    );

    /*// DEBUG: desenha hitbox
ctx.strokeStyle = "red";
ctx.strokeRect(this.x, this.y, this.largHitbox, this.altHitbox);*/

    // Limites do canvas
    if (this.x < 0) this.x = 0;
    else if (this.x + this.largSprite > canvas.width)
      this.x = canvas.width - this.largSprite;
    if (this.y < 0) this.y = 0;
    else if (this.y + this.altSprite - this.skipAltSprite > canvas.height)
      this.y = canvas.height - this.altSprite + this.skipAltSprite;
  }
}

class Mapa {
  constructor(faseData) {
    this.ctx = ctx;
    this.faseData = faseData;
    this.paredes = faseData.paredes;
    this.portas = faseData.portas;
    this.chegada = faseData.chegada;
    this.keyX = faseData.chavePos.x;
    this.keyY = faseData.chavePos.y;
    this.caixas = faseData.caixas;
    this.botoes = faseData.botoes;
    this.agua = faseData.agua;
    this.inimigos = faseData.inimigoPos.map(
      (data) => new Inimigo(ctx, data, this.paredes, this.portas)
    );

    this.key = new Image();
    this.key.src = "imagens/Key.png";
    this.key.onload = () => {
      this.keyCarregada = true;
    };
    this.keyColetada = false;
  }

  chave() {
    if (this.keyCarregada && !this.keyColetada) {
      ctx.drawImage(this.key, this.keyX, this.keyY);
    }
  }

  pegarChave(player) {
    if (
      player.x >= this.keyX &&
      player.x <= this.keyX + 50 &&
      player.y >= this.keyY &&
      player.y <= this.keyY + 50
    ) {
      this.keyColetada = true;
      this.portas[0] = { x1: 0, y1: 0, x2: 0, y2: 0 }; // ou remova a porta
    }
  }

  parede() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let parede of this.paredes) {
      ctx.moveTo(parede.x1, parede.y1);
      ctx.lineTo(parede.x2, parede.y2);
    }
    ctx.stroke();
  }

  porta() {
    for (let porta of this.portas) {
      if (!porta.aberta) {
        ctx.fillStyle = porta.cor;
        ctx.fillRect(
          porta.x1,
          porta.y1,
          porta.x2 - porta.x1,
          porta.y2 - porta.y1
        );
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          porta.x1,
          porta.y1,
          porta.x2 - porta.x1,
          porta.y2 - porta.y1
        );
      }
    }
  }

  botao() {
    for (let botao of this.botoes) {
      ctx.fillStyle = "#445a2fff";
      ctx.fillRect(
        botao.x - 10,
        botao.y - 10,
        botao.largura + 20,
        botao.altura + 20
      );

      ctx.fillStyle = botao.cor;
      ctx.fillRect(botao.x, botao.y, botao.largura, botao.altura);
      ctx.lineWidth = 1;
      ctx.strokeRect(botao.x, botao.y, botao.largura, botao.altura);

      ctx.fillStyle = botao.sombra;
      ctx.fillRect(botao.x, botao.y + 37, botao.largura, botao.altura - 38);
      ctx.fillRect(botao.x, botao.y, botao.largura - 38, botao.altura);
    }
  }

  caixa() {
    ctx.fillStyle = "#8B4513"; // marrom
    for (let caixa of this.caixas) {
      ctx.fillRect(caixa.x, caixa.y, caixa.largura, caixa.altura);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(caixa.x, caixa.y, caixa.largura, caixa.altura);

      ctx.strokeStyle = "#61310fff";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        caixa.x + 3,
        caixa.y + 3,
        caixa.largura - 6,
        caixa.altura - 6
      );
      ctx.beginPath();
      ctx.moveTo(caixa.x + 3, caixa.y + 3);
      ctx.lineTo(caixa.x + 67, caixa.y + 67);
      ctx.moveTo(caixa.x + caixa.largura - 3, caixa.y + 3);
      ctx.lineTo(caixa.x + 3, caixa.y + caixa.altura - 3);
      ctx.stroke();
    }
  }

  caixaSobreBotao(botao, caixas) {
    for (let caixa of caixas) {
      if (
        caixa.x < botao.x + botao.largura &&
        caixa.x + caixa.largura > botao.x &&
        caixa.y < botao.y + botao.altura &&
        caixa.y + caixa.altura > botao.y
      ) {
        return true;
      }
    }
    return false;
  }

  desenharAgua(jogador) {
    for (let a of this.agua) {
      
      this.dentroDaAgua = false;
      ctx.fillStyle = a.cor;
      ctx.fillRect(
        a.x,
        a.y,
        a.largura,
        a.altura
      );

      if(
        jogador.x < a.x + a.largura &&
        jogador.x + jogador.largHitbox > a.x &&
        jogador.y < a.y + a.altura &&
        jogador.y + jogador.altHitbox > a.y
      ) {
        this.dentroDaAgua = true;
      }
    }
    jogador.vel = this.dentroDaAgua ? 1.5 : 3;
  }

  //Deve ser usado jogador ao invés de playerPos, pois jogador é o objeto real do player. playerPos contém apenas a posição inicial fixa
  //do player, além de não possuir métodos como desenhar e gerenciar
  persSobreBotao(botao, jogador) {
    return (
      jogador.x < botao.x + botao.largura &&
      jogador.x + jogador.largHitbox > botao.x &&
      jogador.y < botao.y + botao.altura &&
      jogador.y + jogador.altHitbox > botao.y
    );
  }

  inimSobreBotao(botao, inimigoPos) {
    for (let inimigo of inimigoPos) {
      if (
        inimigo.inimigoData.x < botao.x + botao.largura &&
        inimigo.inimigoData.x + inimigo.inimigoData.largura > botao.x &&
        inimigo.inimigoData.y < botao.y + botao.altura &&
        inimigo.inimigoData.y + inimigo.inimigoData.altura > botao.y
      ) {
        return true;
      }
    }
    return false;
  }

  atualizarPortas(jogador) {
    for (let porta of this.portas) {
      let botao = this.botoes.find((b) => b.portaAlvo === porta.id);
      if (!botao) continue;

      let ativadoPorCaixa = this.caixaSobreBotao(botao, this.caixas);
      let ativadoPorPlayer = this.persSobreBotao(botao, jogador);
      let ativadoPorInimigo = this.inimSobreBotao(botao, this.inimigos); //Aqui precisa passar o array inimigos, não o objeto inimigo

      if (ativadoPorCaixa || ativadoPorPlayer || ativadoPorInimigo) {
        botao.cor = botao.sombra;
        porta.aberta = true;
      } else {
        botao.cor = botao.corLev;
        porta.aberta = false;
      }
    }
  }

  IntersecPersonagem(linha, ret) {
    let lados = [
      { x1: ret.x, y1: ret.y, x2: ret.x + ret.largura, y2: ret.y }, // topo
      {
        x1: ret.x + ret.largura,
        y1: ret.y,
        x2: ret.x + ret.largura,
        y2: ret.y + ret.altura,
      }, // direita
      {
        x1: ret.x + ret.largura,
        y1: ret.y + ret.altura,
        x2: ret.x,
        y2: ret.y + ret.altura,
      }, // baixo
      { x1: ret.x, y1: ret.y + ret.altura, x2: ret.x, y2: ret.y }, // esquerda
    ];

    for (let lado of lados) {
      if (this.linhasSeCruzam(linha, lado)) return true;
    }
    return false;
  }

  linhasSeCruzam(a, b) {
    function ccw(p1, p2, p3) {
      return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    }

    let A = { x: a.x1, y: a.y1 };
    let B = { x: a.x2, y: a.y2 };
    let C = { x: b.x1, y: b.y1 };
    let D = { x: b.x2, y: b.y2 };

    return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
  }

  podeMover(dx, dy, jogador) {
    let futuro = {
      x: jogador.x + dx,
      y: jogador.y + dy,
      largura: jogador.largHitbox,
      altura: jogador.altHitbox,
    };

    for (let parede of this.paredes) {
      if (this.IntersecPersonagem(parede, futuro)) return false;
    }

    let portasFechadas = this.portas.filter((p) => !p.aberta);
    for (let porta of portasFechadas) {
      if (this.IntersecPersonagem(porta, futuro) && portasFechadas)
        return false;
    }

    for (let caixa of this.caixas) {
      const caixaRect = {
        x: caixa.x,
        y: caixa.y,
        largura: caixa.largura,
        altura: caixa.altura,
      };

      if (
        futuro.x < caixaRect.x + caixaRect.largura &&
        futuro.x + futuro.largura > caixaRect.x &&
        futuro.y < caixaRect.y + caixaRect.altura &&
        futuro.y + futuro.altura > caixaRect.y
      ) {
        // Colidiu com a caixa
        const podeMoverCaixa = this.podeMoverCaixa(caixa, dx, dy);
        if (podeMoverCaixa) {
          caixa.x += dx;
          caixa.y += dy;
          return true; // agora o jogador também pode se mover
        } else {
          return false;
        }
      }
    }

    return true; //É usado apenas um for of para ambas as paredes e portas, pois o retorno é o mesmo
  }

  podeMoverCaixa(caixa, dx, dy) {
    const futuro = {
      x: caixa.x + dx,
      y: caixa.y + dy,
      largura: caixa.largura,
      altura: caixa.altura,
    };

    // Verificar colisão com paredes
    for (let parede of this.paredes) {
      if (this.IntersecPersonagem(parede, futuro)) return false;
    }

    // Verificar colisão com portas
    for (let porta of this.portas) {
      if (this.IntersecPersonagem(porta, futuro) && porta.aberta) return true;
      if (this.IntersecPersonagem(porta, futuro)) return false;
    }

    // Verificar colisão com outras caixas
    for (let outra of this.caixas) {
      if (outra === caixa) continue;
      const outraRect = {
        x: outra.x,
        y: outra.y,
        largura: outra.largura,
        altura: outra.altura,
      };

      if (
        futuro.x < outraRect.x + outraRect.largura &&
        futuro.x + futuro.largura > outraRect.x &&
        futuro.y < outraRect.y + outraRect.altura &&
        futuro.y + futuro.altura > outraRect.y
      ) {
        return false;
      }
    }

    return true;
  }
}

class Inimigo {
  constructor(ctx, dadosInimigo, paredes, portas) {
    this.ctx = ctx;
    this.vel = 2;
    this.inimigoData = {
      x: dadosInimigo.x,
      y: dadosInimigo.y,
      limiteMax: dadosInimigo.limiteMax,
      limiteMin: dadosInimigo.limiteMin,
      largura: 50,
      altura: 67,
    };
    this.paredes = paredes;
    this.portas = portas;
    this.direcao = 1;

    this.inimigo = new Image();
    this.inimigo.src = "imagens/Inimigo.png";
  }

  desenhar() {
    this.mover(); // mover antes de desenhar

    this.ctx.save();

    if (this.direcao === -1) {
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        this.inimigo,
        -this.inimigoData.x - this.inimigoData.largura,
        this.inimigoData.y,
        this.inimigoData.largura,
        this.inimigoData.altura
      );
    } else {
      this.ctx.drawImage(
        this.inimigo,
        this.inimigoData.x,
        this.inimigoData.y,
        this.inimigoData.largura,
        this.inimigoData.altura
      );
    }

    this.ctx.restore();
  }

  mover() {
    const dx = this.vel * this.direcao;
    const dy = 0;

    // Verifica se pode mover (dentro dos limites e sem colisão)
    if (
      this.podeMover(dx, dy) &&
      this.inimigoData.x + dx >= this.inimigoData.limiteMin &&
      this.inimigoData.x + dx <= this.inimigoData.limiteMax
    ) {
      this.inimigoData.x += dx;
    } else {
      this.direcao *= -1;
    }
  }

  IntersecInimigo(linha, ret) {
    // Igual ao seu método, não precisa alterar
    let lados = [
      { x1: ret.x, y1: ret.y, x2: ret.x + ret.largura, y2: ret.y }, // topo
      {
        x1: ret.x + ret.largura,
        y1: ret.y,
        x2: ret.x + ret.largura,
        y2: ret.y + ret.altura,
      }, // direita
      {
        x1: ret.x + ret.largura,
        y1: ret.y + ret.altura,
        x2: ret.x,
        y2: ret.y + ret.altura,
      }, // baixo
      { x1: ret.x, y1: ret.y + ret.altura, x2: ret.x, y2: ret.y }, // esquerda
    ];

    for (let lado of lados) {
      if (this.linhasSeCruzam(linha, lado)) return true;
    }
    return false;
  }

  linhasSeCruzam(a, b) {
    function ccw(p1, p2, p3) {
      return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    }

    let A = { x: a.x1, y: a.y1 };
    let B = { x: a.x2, y: a.y2 };
    let C = { x: b.x1, y: b.y1 };
    let D = { x: b.x2, y: b.y2 };

    return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
  }

  podeMover(dx, dy) {
    let futuro = {
      x: this.inimigoData.x + dx,
      y: this.inimigoData.y + dy,
      largura: this.inimigoData.largura,
      altura: this.inimigoData.altura,
    };

    for (let parede of this.paredes) {
      if (this.IntersecInimigo(parede, futuro)) return false;
    }

    let portasFechadas = this.portas.filter((p) => !p.aberta);
    for (let porta of portasFechadas) {
      if (this.IntersecInimigo(porta, futuro)) return false;
    }

    return true;
  }
}

//Essa função já instancia objetos de forma adequada
function iniciarFase(n) {
  jogoPausado = false;
  faseAtual = n;
  let inimigos = fases[n].inimigoPos.map((data) => new Inimigo(ctx, data));

  mapa = new Mapa(fases[n]);
  player = new Jogador(ctx, teclado, mapa, fases[n]); //fases[n] corresponde a faseData, é preciso incluir ele aqui

  player.sprite.onload = () => requestAnimationFrame(game);

  document.getElementById("mensagemVitoria").style.display = "none";
  document.getElementById("mensagemDerrota").style.display = "none";
  document.getElementById("restart").style.display = "none";
  document.getElementById("next").style.display = "none";
  document.getElementById("nevoa").style.display = "none";
}

//Carrega a fase 0 antes de iniciar o jogo
iniciarFase(1);

// Iniciar loop do jogo após carregar sprite
function game() {
  if (jogoPausado) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === Atualizações ===
  player.verificarChegada();
  for (let inimigo of mapa.inimigos) {
    player.derrota(inimigo);
  }
  mapa.pegarChave(player);
  mapa.atualizarPortas(player);

  // === Desenhos ===
  mapa.desenharAgua(player);
  mapa.parede();
  mapa.porta();
  mapa.chave();
  mapa.botao();
  mapa.caixa();
  for (let inimigo of mapa.inimigos) {
    inimigo.desenhar();
  }
  player.desenhar();

  requestAnimationFrame(game);
}
