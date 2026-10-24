const readline = require('readline');

const player1 = {
  NOME : 'Mario',
  VELOCIDADE : 4,
  MANOBRABILIDADE : 3,
  PODER : 3,
  PONTOS : 0,
};
const player2 = {
  NOME : 'Luigi',
  VELOCIDADE : 3,
  MANOBRABILIDADE : 4,
  PODER : 4,
  PONTOS : 0,
};
const player3 = {
  NOME : 'Bowser',
  VELOCIDADE : 5,
  MANOBRABILIDADE : 2,
  PODER : 5,
  PONTOS : 0,
};
const player4 = {
  NOME : 'Peach',
  VELOCIDADE : 3,
  MANOBRABILIDADE : 4,
  PODER : 2,
  PONTOS : 0,
};
const player5 = {
  NOME : 'Yoshi',
  VELOCIDADE : 2,
  MANOBRABILIDADE : 4,
  PODER : 3,
  PONTOS : 0,
};
const player6 = {
  NOME : 'Donkey Kong',
  VELOCIDADE : 2,
  MANOBRABILIDADE : 2,
  PODER : 5,
  PONTOS : 0,
};

const personagens = [player1, player2, player3, player4, player5, player6];

// ---------- MENU ----------
function perguntar(texto) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(texto, (resposta) => {
      rl.close();
      resolve(resposta);
    });
  });
}

function mostrarMenu(indiceBloqueado) {
  console.log("\n==============================");
  console.log("   ESCOLHA SEU PERSONAGEM");
  console.log("==============================");
  personagens.forEach((p, i) => {
    if (i === indiceBloqueado) {
      console.log(`${i + 1} - ${p.NOME} (já escolhido)`);
    } else {
      console.log(
        `${i + 1} - ${p.NOME} | Velocidade: ${p.VELOCIDADE} | Manobrabilidade: ${p.MANOBRABILIDADE} | Poder: ${p.PODER}`
      );
    }
  });
  console.log("==============================");
}

async function escolherPersonagem(titulo, indiceBloqueado = -1) {
  while (true) {
    mostrarMenu(indiceBloqueado);
    const resposta = await perguntar(`${titulo} (1-${personagens.length}): `);
    const indice = parseInt(resposta, 10) - 1;

    if (isNaN(indice) || indice < 0 || indice >= personagens.length) {
      console.log("❌ Opção inválida! Digite um número da lista.");
      continue;
    }
    if (indice === indiceBloqueado) {
      console.log("❌ Esse personagem já foi escolhido! Escolha outro.");
      continue;
    }
    return indice;
  }
}

// ---------- JOGO ----------
async function rolldice() {
  return Math.floor(Math.random() * 6) + 1;
};

async function getranblock(){
  let random = Math.random();
  let result 
  
  switch (true) {
    case random < 0.33:
        result = "RETA";
        break;

    case random < 0.66:
        result = "CURVA";
        break;    

     default:
        result = "CONFRONTO";
         
  };

return result;
};

async function logRollResult(charactername, block, diceResult, attribute) {
    console.log(`${charactername} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
     }` 
        
    );
};

async function playraceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`\n🏁🚨 Round ${round} Começando...\n`);
       // Sortear bloco
        let block = await getranblock();
        console.log(`Bloco sorteado: ${block}\n`);
     

     // rolar os dados
    let diceResult1 = await rolldice();
    let diceResult2 = await rolldice();
    console.log(`Dados rolados: ${diceResult1} e ${diceResult2}\n`);

    //teste de habilidade
    let TotalTestSkill1 = 0;
    let TotalTestSkill2 = 0;

    if (block === "RETA") {
        TotalTestSkill1 = diceResult1 + character1.VELOCIDADE;
        TotalTestSkill2 = diceResult2 + character2.VELOCIDADE;

        await logRollResult(
            character1.NOME,
            "velocidade",
            diceResult1,
            character1.VELOCIDADE
          );
        
        await logRollResult(
            character2.NOME,
            "velocidade",
            diceResult2,
            character2.VELOCIDADE
          );
    };
    if (block === "CURVA") {
        TotalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
        TotalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

        await logRollResult(
            character1.NOME,
            "manobrabilidade",
            diceResult1,
            character1.MANOBRABILIDADE
          );

        await logRollResult(
            character2.NOME,
            "manobrabilidade",
            diceResult2,
            character2.MANOBRABILIDADE
          );  

    };
    if (block === "CONFRONTO") {
        let powerResult1 = diceResult1 + character1.PODER;
        let powerResult2 = diceResult2 + character2.PODER;
        
        console.log(`${character1.NOME} confrontou com ${character2.NOME}!🥊`);

        await logRollResult(
            character1.NOME,
            "poder",
            diceResult1,
            character1.PODER
          );

        await logRollResult(
            character2.NOME,
            "poder",
            diceResult2,
            character2.PODER
          );  

        if (powerResult1 === powerResult2) {
          console.log("\nConfronto empatado! Nenhum ponto foi perdido");
        } else {
          const vencedor = powerResult1 > powerResult2 ? character1 : character2;
          const perdedor = powerResult1 > powerResult2 ? character2 : character1;

          // sorteia casco (-1) ou bomba (-2) para o perdedor
          const arma = Math.random() < 0.5
            ? { nome: "casco", dano: 1, emoji: "🐢" }
            : { nome: "bomba", dano: 2, emoji: "💣" };

          const pontosAntes = perdedor.PONTOS;
          perdedor.PONTOS = Math.max(0, perdedor.PONTOS - arma.dano);
          const perdidos = pontosAntes - perdedor.PONTOS;

          console.log(
            `\n${vencedor.NOME} venceu o confronto! ${perdedor.NOME} foi atingido por um ${arma.nome} ${arma.emoji} e perdeu ${perdidos} ponto(s)`
          );

          // sorteia se o vencedor ganha turbo (+1 ponto)
          if (Math.random() < 0.5) {
            vencedor.PONTOS++;
            console.log(`${vencedor.NOME} ganhou um TURBO 🚀 e marcou +1 ponto!`);
          } else {
            console.log(`${vencedor.NOME} não ganhou turbo desta vez.`);
          }
        }
    };
// verificando o vencedor 
    if(TotalTestSkill1 > TotalTestSkill2){
      console.log(`${character1.NOME} Marcou um ponto!`);
      character1.PONTOS++; 
    }
    else if(TotalTestSkill2 > TotalTestSkill1){
      console.log(`${character2.NOME} Marcou um ponto!`);
      character2.PONTOS++;
    };

  console.log("---------------------------------------------");

    };  // fecha o for
};      // fecha a função playraceEngine  

async function declareWinner(character1, character2) {
  console.log("resultado final da corrida:");
  console.log(`${character1.NOME} Pontos: ${character1.PONTOS}`);
  console.log(`${character2.NOME} Pontos: ${character2.PONTOS}`);

  if (character1.PONTOS > character2.PONTOS) {
    console.log(`🏆 ${character1.NOME} venceu a corrida! Parabéns! 🏆 `);
  } else if (character2.PONTOS > character1.PONTOS) {
    console.log(`🏆 ${character2.NOME} venceu a corrida! Parabéns! 🏆 `);
  } else {
    console.log("🤝 A corrida terminou empatada!");
  }
};

(async function main() {
  const indice1 = await escolherPersonagem("Jogador 1, escolha seu personagem");
  const indice2 = await escolherPersonagem("Jogador 2, escolha seu personagem", indice1);

  const jogador1 = personagens[indice1];
  const jogador2 = personagens[indice2];

  console.log(`\n🏁🚨 Corrida entre ${jogador1.NOME} e ${jogador2.NOME} Começando...\n`);

  await playraceEngine(jogador1, jogador2);
  await declareWinner(jogador1, jogador2);
})();