🐻🍯 Super Pooh Bear 64
<div align="center">
  <img src="./assets/logo_superpoohbear.png" alt="Super Pooh Bear Logo" width="400"/>
  <br/>
  <strong>Um jogo de plataforma 2D cooperativo feito com HTML, CSS e JavaScript Vanilla</strong>
</div>
---
📌 Sobre o Projeto
Super Pooh Bear 64 é um jogo de plataforma 2D baseado em navegador, inspirado no universo do Ursinho Pooh, com foco em:
🎮 Jogabilidade fluida
🤝 Cooperação local (2 jogadores)
⏱️ Desafio com tempo limite
🍯 Mecânica de coleta estratégica
O jogador deve coletar potes de mel para liberar a chave e resgatar o Leitão antes que o tempo acabe.
---
🎯 Objetivo do Jogo
Colete todos os potes de mel (🍯) do mapa
Libere a chave (🔑)
Encontre e salve o Leitão
Faça tudo isso antes dos 185 segundos acabarem
---
🎮 Modos de Jogo
🧍 Modo Solo (Aventura)
Controle apenas o Pooh
Foque em exploração e precisão
🤝 Modo Cooperativo Local
Dois jogadores na mesma tela:
Pooh (Player 1) → Coleta
Tigrão (Player 2) → Suporte
---
🎮 Controles
🐻 Player 1 — Pooh (Coletor)
`A / D` → Andar
`W` ou `ESPAÇO` → Pular
🐯 Player 2 — Tigrão (Suporte)
`⬅ / ➡` → Andar
`⬆` → Pular
⚡ Atalhos
`ENTER` → Avançar diálogos
`P` → Pular cutscenes
`R` → Reiniciar tentativa
`S` → Reiniciar jogo completo
`H` → Menu principal
---
⚠️ Mecânicas do Jogo
👾 Inimigos
🐝 Abelhas → causam -1 de vida
🗡️ Espinhos → morte instantânea
🍯 Coletáveis
Colete 5 potes de mel
Isso ativa a chave do nível
❤️ Vida
Sistema de corações
Invulnerabilidade temporária após dano
⏱️ Tempo
185 segundos globais
Zerou → 💀 Game Over
---
🧠 Arquitetura do Projeto
💡 Programação Orientada a Objetos
📦 Estrutura modular por arquivos
🎯 Separação de responsabilidades
Exemplos:
`Character.js`
`Pooh.js`
`Tigger.js`
`Platform.js`
---
🔊 Sistema de Áudio
🎵 Gerenciado por `AudioManager.js`
Evita sobreposição sonora
Controla:
Música
Efeitos
Eventos do jogo
---
📷 Sistema de Câmera
🎯 Modo Solo: segue o jogador
🤝 Modo Coop: centraliza entre Pooh e Tigrão
🔒 Limita distância entre jogadores
---
📋 Regras de Negócio
✔️ Só avança se coletar 100% do mel
🐻 Apenas Pooh coleta itens
🐯 Tigrão auxilia (plataformas, combate, pressão)
💀 Espinhos = morte direta
⏱️ Tempo acabou = derrota automática
---
⚙️ Requisitos Técnicos
✔️ Funcionais
Movimento 2D com input de teclado
Sistema de colisão AABB
HUD em tempo real
Sistema de fases sem reload
Cutscenes interativas
⚡ Não Funcionais
60 FPS com `requestAnimationFrame`
100% client-side
Sem dependência de frameworks
Arquitetura modular
---
🚀 Como Rodar o Projeto
1️⃣ Clonar repositório
```bash
git clone https://github.com/uesleisouza33/super_pooh_bear.git
```
---
2️⃣ Executar
🔹 Opção simples
Abra o arquivo:
```
index.html
```
🔹 Opção recomendada
```bash
npx serve .
```
ou use o Live Server no VSCode
---
🌐 Versão Online
👉 https://super-pooh-bear.vercel.app/
---
👨‍💻 Créditos
🎓 Desenvolvedor: Ueslei Carvalho  
https://github.com/uesleisouza33
🧠 Product Owner: Carlos Silva  
https://github.com/Prof-Carlos-Senai
---
💡 Possíveis Melhorias Futuras
🌍 Multiplayer online
💾 Sistema de save
🧩 Editor de fases
🎮 Suporte a controle (gamepad)
---
⭐ Contribuição
Sinta-se livre para:
Fazer fork 🍴
Abrir issues 🐛
Enviar PRs 🚀
---
<div align="center">
  Feito com ❤️ e muito 🍯
</div>
