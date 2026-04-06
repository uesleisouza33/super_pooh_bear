# 🐻 Super Pooh Bear 64 — Modo Coop (Plano de Implementação)

## 🎯 Objetivo

Criar um modo cooperativo simples e divertido onde:

* 🍯 Um jogador foca em coletar mel
* 🐻 O outro ajuda abrindo caminhos
* 🔑 Ao coletar 5 potes de mel, uma chave aparece (já existente)

---

## 👥 Papéis dos Jogadores

### 🍯 Player 1 — Coletor (Pooh)

* Objetivo principal: coletar os potes de mel
* Habilidade padrão: movimento + pulo
* Interage diretamente com o progresso da fase

---

### 🐻 Player 2 — Suporte (Helper)

* Objetivo: ajudar o Player 1
* Pode ativar mecânicas do mapa:

  * botões
  * plataformas móveis
  * liberar caminhos
* Não precisa coletar mel

---

## 🔁 Loop Principal de Gameplay

1. Jogadores começam juntos
2. Player 2 ativa caminhos / facilita percurso
3. Player 1 coleta mel 🍯
4. Ao atingir **5 potes**:

   * 🔑 chave aparece no mapa
5. Jogadores precisam chegar até a chave
6. Fim da fase ou desbloqueio de área

---

## 🗺️ Level Design (Adaptado para Coop)

### 🧱 Elementos novos

* 🔘 **Botões de pressão**

  * Só Player 2 ativa
  * Libera plataformas temporárias

* 🪜 **Plataformas móveis**

  * Ativadas por botão
  * Permitem acesso ao mel

* 🚧 **Bloqueios simples**

  * Caminhos fechados que precisam de cooperação

---

### 🧠 Estrutura de fase ideal

* Parte 1: Tutorial (sem coop obrigatória)
* Parte 2: Introduz botão + plataforma
* Parte 3: Necessidade real de coop
* Parte 4: Coleta final + spawn da chave

---

## 🔑 Sistema da Chave (já existente, mas melhorar)

### Atual:

* Spawn após coletar 5 potes

### Melhorias:

* ✨ Animação de spawn (efeito visual)
* 📍 Aparecer em local visível/importante
* 🔊 Som de recompensa

---

## 🎥 Câmera

* 📌 Câmera compartilhada (já definido)
* Segue o centro dos jogadores
* Limite de distância ativo

---

## ⚖️ Regras de Cooperação

* Jogadores não podem se separar muito
* Se afastar demais:

  * leve “puxão” ou limite
* Se cair:

  * respawn próximo do outro

---

## 🎮 Controles

### Player 1

* A / D → andar
* W → pular

### Player 2

* ← / → → andar
* ↑ → pular

---

## 💡 Ideias Extras (Opcional)

* 🍯 “super mel” que precisa dos dois
* 🐝 inimigos que um distrai e outro passa
* ⏱️ tempo bônus se cooperarem bem
* 🧩 puzzles simples (ordem de ativação)

---

## 🚀 Roadmap de Implementação

### Fase 1 — Base

* [ ] Adicionar segundo player
* [ ] Sistema de câmera compartilhada
* [ ] Limite de distância

---

### Fase 2 — Coop básico

* [ ] Separar funções (coletor vs suporte)
* [ ] Sistema de botões
* [ ] Plataforma ativada

---

### Fase 3 — Integração com mel

* [ ] Garantir que só Player 1 coleta
* [ ] Contador funcionando
* [ ] Spawn da chave

---

### Fase 4 — Polimento

* [ ] Animações simples
* [ ] Feedback visual/sonoro
* [ ] Ajuste de dificuldade

---
