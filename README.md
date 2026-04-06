# Super Pooh Bear 64

<div align="center">
  <img src="./assets/logo_superpoohbear.png" alt="Super Pooh Bear Logo" width="400"/>
</div>

## 1. Identificação do Projeto
- **Título do Projeto:** Super Pooh Bear 64
- **Desenvolvedor:** Ueslei Carvalho: https://github.com/uesleisouza33
- **Product Owner:** Carlos Silva: https://github.com/Prof-Carlos-Senai

---

## 2. Visão Geral do Sistema

- **Descrição:** O software trata-se de um game interativo de plataforma 2D baseado em web (criado utilizando HTML, CSS e JavaScript Vanilla). Recentemente aprimorado com um novo sistema de áudio e a inclusão de um completo **Modo Cooperativo Local**.
- **Objetivo:** O objetivo principal é ser um game de plataforma, aventura e coleta onde o jogador deve resgatar o Leitão, que foi capturado e está perdido em algum lugar do mapa.
- **Tema:** Uma fantástica aventura na qual o urso Pooh precisa reunir seus potes de mel favoritos para revelar a chave que libertará o seu amigo antes que o relógio global zere (185 segundos).
- **Modos de Jogo:**
  - *Modo Solo (Aventura)*: Controle o Pooh navegando sozinho pelos perigos do bosque.
  - *Modo Cooperativo Local*: Dois jogadores na mesma tela! O Player 1 (Pooh) deve se focar na coleta fina de mel, ao passo em que o Player 2 (Tigrão) presta o suporte fundamental, auxiliando com pulos em plataformas superiores e atalhos.
- **Instruções de Jogabilidade:**
  - **Player 1 (Pooh - Coletor):**
    - `A` / `D` → Andar
    - `W` ou `ESPAÇO` → Pular
  - **Player 2 (Tigrão - Suporte):**
    - `⬅` / `➡` → Andar
    - `⬆` → Pular
  - **Atalhos Extras:**
    - `ENTER` → Avançar os diálogos
    - `P` → Pular as telas de história (cutscenes) direto para ação
    - `R` → Reniciar tentativa atual em tela de Game Over
    - `S` → Reiniciar todo o jogo desde a primeira fase
    - `H` → Retornar rapidamente ao Menu Principal
  - **Inimigos:** 🐝 *Abelhas* tiram 1 coração de vida ao encostar (deixando o jogador invulnerável por 1 segundo após o dano); 🗡️ *Espinhos* causam morte e Game Over instantâneo.
  - **Coletáveis:** 🍯 Colete obrigatóriamente os 5 potes de mel espalhados por instâncias do mapa para materializar no cenário a 🔑 Chave, que o ajudará a concluir a etapa vigente.
- **Especificações Técnicas (Arquitetura):**
  - *Separação Modular Orientada a Objetos:* Controle de entidades via classes apartadas do engine (Ex: `Character.js`, `Pooh.js`, `Tigger.js`, `Plataform.js`).
  - *Sistema de Áudio Central:* Presença do controlador local unificado `AudioManager.js` para instanciar trilhas e SFX sem sobreposição sonora.
  - *Câmera Compartilhada (Co-op):* No modo dublê de heróis, a *viewport* da câmera canvas equaliza de modo matemático as posições de Pooh e Tigrão, travando seus limites para impedir distanciamento fora de tela.
- **Requisitos do Sistema:**
  - **Requisitos Funcionais:**
    - Sistema de movimentação bidimensional independente para múltiplos personagens (Pulo, Andar) processado via fila de eventos do teclado.
    - Sistema dinâmico de câmera compartilhada que acompanha o ponto médio entre o Pooh e o Tigrão simultaneamente no modo cooperativo.
    - Mecanismo de colisão orientado a caixas (Bounding Boxes AABB) com detecção detalhada não somente do solo, mas aplicável a inimigos (Abelhas, Espinhos), e itens (Mel, Chaves).
    - Status e HUD em tempo real renderizado na tela (Contador de Mel, Corações de Vida e Timer Cronômetro).
    - Mapeamento e transição fluída entre as telas de Menu Principal, Manual de Instruções, Tela de Derrota e Gameplay baseada em interações de DOM.
    - Gerenciador global de áudio (`AudioManager`) encarregado de processar sons de ambiente e *feedback* sonoros durante colisões e cutscenes.
  - **Requisitos Não Funcionais:**
    - *Desempenho:* Processamento do loop contínuo do game de forma fluida através da API `requestAnimationFrame` que visa os 60 FPS constantes.
    - *Portabilidade e Setup:* Game rodando de forma estritamente *Client-Side* (Vanilla JS, HTML e CSS). Sem a exigência estrita de frameworks Node.js nem instalação executável (.exe).
    - *Arquitetura Modular:* Padrão de projeto orientado a objetos isolando visual de lógicas de colisão através do particionamento de Entidades exclusivas por arquivo (`Pooh.js`, `Tigger.js`, `Plataform.js`).
- **Regras de Negócio:**
  - *Condição de Progressão:* A condição básica de término de um desafio exige que as coletas parciais de pote de mel atinjam o total de 100% da cota da fase para materializar ou ativar a *Chave Mestra*. Só ela destrava a transição adiante.
  - *Função Assimétrica no Coop:* Apenas o Pooh (Player 1) ganha prioridade para coletar os potes com mel; portanto as limitações da fase determinam que o Tigrão (Player 2) será forçadamente um parceiro não para progresso direto, e sim para acessar passagens, segurar obstáculos ou criar degraus com sua colisão.
  - *Punições de Erros (Hit-Kill vs Dano):* Uma punição progressiva subtrai apenas de 1 em 1 vidas (Corações) limitadas do personagem por contatos curtos contra ataques de abelhas normais (garantindo também 1s contados de frames invulneráveis à sequência). Interações contra obstáculos ambientais mortais (Espinhos) causam *morte instantânea* independentemente da vida atual.
  - *Exploração sob Pressão:* Quando o limite de tolerância estabelecido pelo limite principal de tempo (185 segundos globais) se exaurir completamente instaura-se sempre uma tela automática e imperdoável de *Game Over*.
- **Créditos:**
  - **Aluno:** Ueslei Carvalho
  - **Product Owner (Professor Orientador):** Carlos Silva
- **Link de Produção:** https://super-pooh-bear.vercel.app/

---

## 3. Instruções de Instalação e Execução

Para iniciar o projeto na sua máquina e poder até testar as funções cooperativas offline, replique as etapas:

1. **Clonagem do Repositório:**
   Terminal na sua pasta alvo e digite o comando de clone:
   ```bash
   git clone https://github.com/uesleisouza33/super_pooh_bear.git
   ```

2. **Execução do Projeto:**
   Duas vias são indicadas para carregar o engine web:
   - **Execução Nativa:** Acesse a pasta no gerenciador de arquivos e abra o `index.html` em abas de navegadores novos.
   - **Execução Servidor HTTP (Recomendada!):** Use ativamente extensões de servidor para diretório, como a famosa *Live Server* dentro do VSCode. Ou via terminal root executando `npx serve .` — isso garantirá todo o funcionamento com música da versão mais rica.

---

## 4. Link do Vercel do Sistema em Produção

Jogue sem executar nada em seu sistema: 

🚀 **Link do Vercel: https://super-pooh-bear.vercel.app/**
