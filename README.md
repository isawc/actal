# ACTAL
## Aegis Cognitive Transit & Auditable Ledger

> **Protótipo acadêmico para mobilidade vertical inteligente, auditável e preparada para interação entre pessoas, elevadores, sensores, sistemas de manutenção e robôs autônomos.**

[Abrir a demonstração no GitHub Pages](https://isawc.github.io/actal/) · [Repositório original do ACTAL](https://github.com/dansfisica85/actal)

## Glossário

[Acessar o glossário do projeto ACTAL no Google Sheets](https://docs.google.com/spreadsheets/d/1NxJeTh6UZ89C2rDOTAm28M-oyFSO0CX7xZA7zZhBrT0/edit?gid=1112006981#gid=1112006981)

## 1. Introdução

O **ACTAL (Aegis Cognitive Transit & Auditable Ledger)** é um framework/protótipo de software para demonstrar como um sistema de elevadores pode deixar de funcionar apenas como um equipamento eletromecânico isolado e passar a operar como parte de uma infraestrutura digital inteligente.

A proposta combina **telemetria IoT, Inteligência Artificial, processamento de eventos, Digital Twin 3D, blockchain permissionada conceitual, Smart Contracts, priorização de ocorrências, integração com o ecossistema OTIS e coordenação de robôs autônomos**.

O objetivo central é criar uma camada cognitiva acima dos dados operacionais. Em vez de simplesmente receber um sinal de sensor, o ACTAL procura representar o fluxo completo:

**sensor → telemetria → registro auditável → interpretação → cálculo de prioridade → decisão → ação operacional → acompanhamento → auditoria.**

O MVP presente neste repositório é uma **simulação visual e interativa** desse conceito. Portanto, elementos como blockchain, hashes, sensores, chamadas de APIs, IA/NLP, despacho técnico e integrações externas são demonstrados no navegador. Eles representam como a arquitetura proposta funcionaria em produção, mas não devem ser confundidos com uma blockchain pública real, mineração real de criptomoeda, sensores físicos reais ou conexão de produção com sistemas OTIS.

---

## 2. O problema que o ACTAL procura resolver

Edifícios inteligentes possuem elevadores, sensores, sistemas de manutenção, usuários e, cada vez mais, dispositivos e robôs autônomos. Esses componentes produzem informações, mas uma arquitetura tradicional pode tratá-los de maneira fragmentada.

O ACTAL propõe integrar esses eventos para responder a perguntas como:

- O que está acontecendo no elevador neste instante?
- Um evento é normal, preventivo, urgente ou crítico?
- Existem pessoas dentro da cabine?
- Há uma criança ou outro contexto que aumente a prioridade?
- Um robô deve utilizar o elevador ou ceder passagem a pessoas?
- Uma falha precisa gerar manutenção?
- Qual técnico deve ser despachado?
- Como registrar o evento de forma auditável?
- Como demonstrar posteriormente quais dados levaram a determinada decisão?

A arquitetura é dividida em três pilares: **DTL**, **CEO** e **STRAB**.

---

# 3. Visão geral da arquitetura

## 3.1 DTL — Distributed Telemetry Ledger

O DTL representa a camada de **registro distribuído e auditável da telemetria**.

Sua responsabilidade conceitual é receber informações produzidas por sensores e sistemas do elevador e registrá-las em blocos encadeados. Isso cria uma trilha histórica para eventos como vibração, desaceleração, operação das portas, tensão de cintas, continuidade do interfone, falhas e ocorrências críticas.

No MVP, o DTL é visualizado como uma blockchain animada.

## 3.2 CEO — Cognitive Event Orchestrator

O CEO representa o **cérebro de decisão do ACTAL**.

Ele recebe eventos, contexto e telemetria e transforma essas informações em uma prioridade operacional. O MVP demonstra isso através de um índice de prioridade calculado por:

```
Pᵢ = wU·U + wP·P + wC·C + wL·L
```

Na implementação atual:

- urgência U: peso 0,35;
- presença/condição de passageiros P: peso 0,30;
- contexto C: peso 0,20;
- histórico/criticidade L: peso 0,15.

O resultado classifica a ocorrência e também influencia o ETA simulado do atendimento.

## 3.3 STRAB — Spatial-Temporal Robotic Auction Broker

O STRAB coordena conceitualmente a utilização dos elevadores por **robôs autônomos**.

Cada robô possui estado, tarefa, bateria, andar e um valor de lance. O broker simula decisões de mobilidade, ocupação e prioridade. A regra fundamental é que a automação não pode se sobrepor à segurança humana.

O **Human-Yield Protocol** faz os robôs cederem prioridade quando a ocupação ou uma emergência humana exige isso.

---

# 4. Fluxo completo do ACTAL

Em uma implementação real, o processo idealizado pelo projeto é:

1. Sensores e sistemas do elevador produzem telemetria.
2. A camada de integração recebe os eventos.
3. Os dados relevantes são autenticados/assinados.
4. O DTL cria um registro auditável.
5. O CEO recebe o evento e seu contexto.
6. O CEO calcula a prioridade.
7. Eventos normais permanecem em monitoramento.
8. Eventos preventivos podem gerar manutenção programada.
9. Eventos críticos acionam procedimentos de emergência.
10. Se necessário, um Smart Contract representa a automatização de regras previamente definidas.
11. O STRAB verifica se existem robôs disputando acesso ao elevador.
12. O Human-Yield Protocol dá prioridade às pessoas.
13. O sistema representa o despacho de assistência técnica.
14. Todos os eventos importantes permanecem associados à trilha de auditoria.

---

# 5. Digital Twin 3D

O projeto possui um **Digital Twin tridimensional desenvolvido com Three.js**.

Ele representa visualmente um edifício com andares, poços de elevador, cabines, pessoas, robôs, sinais de telemetria e um beacon de estado.

A função `initDigitalTwin()` cria cena, câmera, renderizador WebGL, iluminação, pisos, poços, cabines, pessoas, robôs e pulsos de dados.

A função `animateTwin()` mantém a cena viva usando `requestAnimationFrame()`. As cabines se deslocam verticalmente, os robôs percorrem o ambiente, os pulsos representam fluxo de informação e elementos da cena mudam de acordo com o cenário selecionado.

### Modos do Digital Twin

**Operação premium / normal:** representa funcionamento regular, ocupação moderada, prioridade baixa e telemetria estável.

**Pico humano:** aumenta ocupação e índice de prioridade, reduzindo a velocidade operacional simulada.

**Robôs via OID:** torna os robôs visíveis e representa integração de mobilidade robótica.

**Emergência ACTAL:** altera cores, prioridade, quantidade de registros e sinalização para representar uma ocorrência crítica.

A função `setTwinMode()` troca o cenário; `updateTwinHud()` atualiza os indicadores; `updateTwinVisuals()` modifica os objetos 3D.

---

# 6. Telemetria

O MVP representa quatro canais principais:

### Vibração e desaceleração
Simula dados de acelerômetro utilizados para identificar comportamento mecânico anormal.

### Corrente de travamento / operação de porta
Representa informações associadas ao funcionamento das portas.

### Tensão das cintas planas
Representa acompanhamento de elementos mecânicos de tração.

### Continuidade do interfone
Representa o canal de comunicação de emergência e sua disponibilidade.

A função `animTele()` atualiza visualmente as barras de telemetria a cada dois segundos.

---

# 7. DTL e blockchain

O **Distributed Telemetry Ledger** é a parte do projeto que demonstra o conceito de blockchain aplicado à rastreabilidade operacional.

## 7.1 O que é registrado

Cada bloco visual pode apresentar:

- número sequencial;
- hash;
- sensor;
- canal;
- estado NORMAL, ATENÇÃO ou ALERTA;
- MTBF simulado.

A função `mintBlock()` seleciona um sensor, gera valores de demonstração, classifica o estado e cria visualmente um novo bloco.

A função `rHash()` produz uma sequência hexadecimal para representar um hash no MVP.

**Importante:** esse hash é uma simulação visual. Em produção seria necessário utilizar uma função criptográfica real, como SHA-256, além de identidade, assinatura, consenso e armazenamento adequados.

## 7.2 Smart Contract

A função `mintSmartContract()` cria um bloco especial que representa a execução de uma regra automatizada.

No cenário demonstrado, o contrato registra:

- tipo SMART CONTRACT;
- ação de INTERDIÇÃO;
- envio representativo ao RIA Online;
- estado jurídico/autenticação representado na interface.

No projeto conceitual, um Smart Contract não “decide sozinho” arbitrariamente. Ele executa regras previamente estabelecidas quando condições verificáveis são satisfeitas.

## 7.3 Auto-mineração do MVP

A função `autoMine()` liga ou desliga a criação automática de blocos. Quando ativada, o protótipo gera um evento aproximadamente a cada 1,8 segundo. A maior parte gera blocos comuns e uma parcela gera blocos que representam Smart Contracts.

Ao carregar a aplicação, três blocos iniciais também são criados automaticamente para tornar a cadeia imediatamente visível.

---

# 8. Mineração de criptomoedas: como funciona de verdade e como isso difere do ACTAL

Esta distinção é fundamental.

O ACTAL **não minera Bitcoin nem qualquer criptomoeda real**. A palavra “mineração” utilizada na interface representa visualmente a inclusão de registros na cadeia do DTL.

## 8.1 Mineração em uma blockchain Proof of Work

Em redes como Bitcoin, usuários realizam transações e elas são propagadas pela rede. Nós verificam regras básicas dessas transações. Os mineradores agrupam transações candidatas em um bloco e constroem um cabeçalho que referencia o bloco anterior.

O software de mineração varia valores, especialmente um **nonce**, e calcula repetidamente o hash do cabeçalho do bloco. Para que o bloco seja válido, o hash precisa satisfazer o alvo de dificuldade definido pelo protocolo.

Esse trabalho é realizado por **mineradores**, normalmente usando hardware especializado. No caso do Bitcoin moderno, são usados ASICs.

Quando um minerador encontra uma solução válida, transmite o bloco. Outros nós verificam independentemente o Proof of Work e todas as regras do bloco. Se estiver correto, o bloco pode ser aceito na cadeia.

O minerador vencedor recebe a recompensa prevista pelo protocolo e as taxas das transações incluídas. É daí que vem a associação entre “mineração” e geração/distribuição de unidades de criptomoeda.

O ponto essencial é que a segurança decorre do protocolo, da validação independente e do custo computacional do Proof of Work. Não existe uma pessoa central escolhendo manualmente qual minerador “ganha”.

## 8.2 O que o ACTAL utiliza conceitualmente

O ACTAL não precisa criar uma moeda.

Para telemetria de elevadores, o objetivo da blockchain é **integridade, rastreabilidade, identidade e auditoria**, e não competição para emissão de criptomoeda.

Por isso, a arquitetura proposta é mais compatível com um **ledger permissionado**, como Hyperledger Fabric, no qual participantes autorizados possuem identidades conhecidas.

Nesse modelo, o termo tecnicamente mais adequado é **criação, validação, ordenação e commit de transações/blocos**, e não mineração de criptomoeda por Proof of Work.

## 8.3 Como seria o fluxo DTL em produção

1. O sensor mede um estado físico.
2. Um gateway/edge device recebe a medição.
3. O dispositivo identifica a origem do dado.
4. O dado pode ser assinado digitalmente, idealmente protegendo chaves em hardware seguro/HSM.
5. Uma aplicação envia a transação à rede permissionada.
6. Participantes autorizados validam a transação segundo políticas da rede.
7. O serviço de ordenação estabelece a ordem das transações.
8. As transações são agrupadas e distribuídas para commit.
9. Os peers validam as políticas e gravam o bloco no ledger.
10. O hash/referência ao estado anterior ajuda a evidenciar alterações indevidas.
11. O ACTAL consulta esses registros para auditoria e para fornecer contexto ao CEO.

Portanto, **não há necessidade de gastar energia tentando resolver Proof of Work nem de remunerar mineradores com uma moeda**.

---

# 9. Simulação de emergência e pânico

A função `startPanicSim()` executa um dos fluxos mais completos do MVP.

### Etapa 1: operação normal
A cabine começa no primeiro andar com passageiros embarcando.

### Etapa 2: deslocamento
O elevador recebe um chamado e inicia a subida.

### Etapa 3: anomalia
O acelerômetro simula uma desaceleração anormal de 2,8 g diante de um limiar de 1,5 g. O DTL passa a representar o registro do evento.

### Etapa 4: parada de emergência
A cabine para e três passageiros são representados como presos, incluindo uma criança. A interface altera o estado para EMERGÊNCIA e a ocupação para 85%.

### Etapa 5: interpretação do chamado
O CEO representa processamento NLP da comunicação de socorro. A demonstração classifica o sentimento como pânico e a urgência como máxima.

### Etapa 6: cálculo de prioridade
O sistema preenche os parâmetros do CEO e calcula `Pᵢ = 0,94`, classificando o evento como crítico.

### Etapa 7: Smart Contract
O DTL representa a geração de um registro imutável e a aplicação de uma regra de interdição.

### Etapa 8: despacho
A aplicação representa o despacho de um técnico, incluindo ETA, identificação e disponibilidade de peça.

### Etapa 9: Human-Yield
O STRAB cancela ou posterga deslocamentos robóticos para entregar prioridade total ao resgate humano.

### Etapa 10: resolução
A simulação mostra o resgate dos passageiros e mantém o elevador representado como interditado até auditoria.

A função `movePanicCabin()` movimenta visualmente a cabine e `addPanicEvent()` constrói a linha do tempo dos acontecimentos.

---

# 10. CEO e cálculo de prioridade

A função `recalc()` lê quatro variáveis da interface, aplica seus pesos e calcula o índice.

As classificações atuais são:

- **Pᵢ ≥ 0,75:** crítica, despacho imediato;
- **Pᵢ ≥ 0,50:** alta, urgente;
- **Pᵢ ≥ 0,25:** média, agendamento;
- **Pᵢ < 0,25:** baixa, preventiva.

O ETA demonstrativo é reduzido à medida que a prioridade aumenta.

Essa área permite visualizar uma característica importante do ACTAL: decisões operacionais são justificadas por variáveis explícitas em vez de aparecerem apenas como uma “caixa preta”.

---

# 11. STRAB e robôs autônomos

O MVP possui quatro robôs iniciais:

- TOMI-A, entrega de medicamentos;
- Limpeza-01, coleta de lixo;
- Segurança-02, ronda;
- Entrega-03, entrega de encomendas.

Cada robô possui tarefa, bateria, posição e lance.

A função `renderRobots()` atualiza os cartões. `startRobotSim()` inicia eventos automáticos a cada dois segundos. `addFeed()` registra esses acontecimentos no feed.

Durante a simulação podem ocorrer:

- criação de um lance;
- consumo de bateria;
- alteração de andar;
- vitória de um leilão;
- alteração da ocupação humana;
- bloqueio ou liberação de embarque robótico;
- retorno para carregamento quando a bateria está crítica;
- cessão de prioridade a passageiros.

A função `addNewRobot()` inclui um novo robô simulado na frota.

A função `resetRobots()` interrompe a execução e restaura os quatro robôs iniciais e a ocupação padrão.

---

# 12. Human-Yield Protocol

A função `updateOccGauge()` demonstra a política de prioridade humana.

- ocupação até 50%: embarque robótico liberado;
- acima de 50%: embarque parcial;
- acima de 75%: embarque robótico bloqueado.

Em uma emergência, a lógica conceitual é ainda mais forte: robôs devem ceder recursos de mobilidade para pessoas e operações de resgate.

---

# 13. Integração com OTIS ONE e OID

A arquitetura do ACTAL foi concebida para trabalhar como uma camada complementar a plataformas e interfaces do ecossistema de elevadores.

Conceitualmente, **OTIS ONE** fornece dados e monitoramento conectados, enquanto uma interface de despacho como **OID** pode permitir que sistemas autorizados solicitem e acompanhem viagens.

No cenário de robótica, autenticação e comunicação segura podem ser feitas por mecanismos como **OAuth 2.0 e WebSockets**, conforme a interface disponível.

O ACTAL acrescenta sobre essa infraestrutura as camadas de decisão contextual, auditoria, priorização e coordenação entre agentes.

O MVP atual **simula essa integração**. Não há neste repositório credenciais ou conexão de produção com a infraestrutura OTIS.

---

# 14. HSM e assinatura dos dados

A arquitetura conceitual prevê a utilização de **HSM, Hardware Security Module**, ou outro elemento seguro para proteger chaves criptográficas.

A finalidade é permitir que uma medição possa ser vinculada criptograficamente à sua origem. Assim, o sistema não registra apenas “vibração = X”, mas pode demonstrar qual dispositivo produziu aquela informação e verificar a assinatura.

Isso fortalece a cadeia de custódia digital dos dados.

---

# 15. MTBF e manutenção

O MVP exibe valores de **MTBF, Mean Time Between Failures**, nos blocos simulados.

MTBF é uma métrica de confiabilidade usada para representar o tempo médio entre falhas de um equipamento reparável.

No protótipo os valores são gerados para demonstração visual. Em produção seriam calculados com dados históricos reais de operação e manutenção.

A proposta é permitir que queda de confiabilidade, recorrência de falhas ou parâmetros críticos alimentem o CEO e possam resultar em inspeção, manutenção ou interdição segundo regras previamente aprovadas.

---

# 16. Interface e animações

O projeto também possui recursos que fazem parte da experiência de demonstração:

- partículas animadas no fundo com tsParticles;
- fórmulas técnicas flutuantes;
- animações de entrada com AOS;
- Bootstrap 5 para estrutura responsiva;
- Bootstrap Icons;
- GSAP/ScrollTrigger preparado para animações;
- Three.js para o Digital Twin;
- gradientes e glassmorphism;
- indicadores animados;
- timeline de eventos;
- blockchain visual;
- cartões de robôs;
- medidor de ocupação;
- atualização automática da telemetria.

A função `spawnFormula()` gera fórmulas e expressões flutuantes periodicamente.

O sistema também modifica a barra de navegação durante a rolagem e anima sequencialmente elementos da arquitetura.

---

# 17. Funções implementadas no MVP

| Função | Responsabilidade |
|---|---|
| `spawnFormula()` | Gera fórmulas técnicas animadas no plano de fundo. |
| `setTwinMode()` | Troca o cenário do Digital Twin. |
| `updateTwinHud()` | Atualiza os indicadores do Twin. |
| `updateTwinVisuals()` | Altera cores, pessoas, robôs e alertas da cena 3D. |
| `initDigitalTwin()` | Constrói a cena Three.js. |
| `animateTwin()` | Executa continuamente a animação do Twin. |
| `rHash()` | Gera um hash hexadecimal demonstrativo. |
| `mintBlock()` | Cria um bloco visual de telemetria. |
| `mintSmartContract()` | Cria o bloco visual de Smart Contract. |
| `autoMine()` | Liga/desliga a criação automática de blocos. |
| `animTele()` | Anima os indicadores de telemetria. |
| `movePanicCabin()` | Move a cabine na simulação de emergência. |
| `addPanicEvent()` | Adiciona um evento à timeline da emergência. |
| `startPanicSim()` | Executa o cenário completo de emergência. |
| `recalc()` | Calcula o índice de prioridade do CEO. |
| `renderRobots()` | Renderiza o estado atual da frota robótica. |
| `addFeed()` | Adiciona eventos ao feed STRAB. |
| `updateOccGauge()` | Atualiza ocupação e Human-Yield. |
| `startRobotSim()` | Executa continuamente a simulação STRAB. |
| `addNewRobot()` | Adiciona um robô simulado. |
| `resetRobots()` | Reinicia a simulação robótica. |

---

# 18. Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- Three.js / WebGL
- AOS
- tsParticles
- GSAP
- conceitos de IoT
- conceitos de Digital Twin
- conceitos de IA/NLP
- conceitos de blockchain permissionada
- conceitos de Smart Contracts
- OAuth 2.0 e WebSockets como arquitetura de integração
- Hyperledger Fabric como referência conceitual para ledger permissionado

---

# 19. Como executar

O MVP é um site estático em HTML, CSS e JavaScript. Para rodar localmente com Python 3, execute o comando abaixo na raiz do repositório e abra [http://localhost:8000](http://localhost:8000).

```sh
python -m http.server 8000
```

O `index.html` contém a estrutura da página. Os estilos ficam em `assets/css/styles.css` e os scripts em `assets/js/`.

| Script | Responsabilidade |
| --- | --- |
| `interface.js` | Navegação e animações da página |
| `digital-twin.js` | Gêmeo digital 3D e seleção de cenários |
| `telemetria.js` | Indicadores e simulação de blocos do DTL |
| `emergencia.js` | Simulação de emergência |
| `prioridade.js` | Calculadora do índice de prioridade |
| `robos.js` | Simulação da frota de robôs |
| `laboratorio.js` | Cenários que ligam telemetria, prioridade e emergência |

Os scripts são carregados no fim do HTML. O laboratório é carregado por último porque usa funções das outras simulações.

O GitHub Pages publica o site a partir da raiz de `main`. Os caminhos de arquivos são relativos para funcionar tanto na hospedagem como no servidor local. Bootstrap e as demais bibliotecas externas são carregados por CDN e precisam de conexão com a internet quando ainda não estão no cache do navegador.

---

# 20. O que é simulação e o que seria produção

É importante separar o **MVP demonstrativo** da arquitetura final.

### Implementado visualmente no MVP
Digital Twin, movimentação de elevadores, robôs, telemetria, blockchain visual, hashes demonstrativos, Smart Contract demonstrativo, emergência, NLP representado, cálculo de prioridade, ETA, despacho, Human-Yield e feed de eventos.

### Necessário para produção
APIs oficiais e autorizadas dos equipamentos, sensores físicos, gateway IoT, backend, autenticação, banco de dados, ledger permissionado real, certificados digitais, HSM/gestão de chaves, políticas de acesso, observabilidade, infraestrutura resiliente, integrações regulatórias efetivas, testes de segurança e validação com os responsáveis pelos sistemas de elevadores.

O ACTAL **não deve comandar diretamente sistemas críticos de segurança de um elevador sem as interfaces, certificações, validações e controles exigidos pelo fabricante e pelas normas aplicáveis**.

---

# 21. Diferencial do projeto

O diferencial do ACTAL não está em uma tecnologia isolada.

A proposta é combinar:

**telemetria + identidade + auditoria + IA contextual + Digital Twin + manutenção + integração de elevadores + robótica autônoma.**

Assim, o mesmo evento pode ser observado fisicamente, registrado, interpretado, priorizado, transformado em ação e posteriormente auditado.

Em uma frase:

> **O ACTAL transforma telemetria de mobilidade vertical em decisões contextuais, coordenadas e auditáveis.**

---

# 22. Status

Este repositório contém um **MVP/protótipo acadêmico interativo**. Ele demonstra a experiência, os fluxos e os principais componentes arquiteturais da proposta ACTAL e serve como base para evolução futura para serviços reais, APIs, backend, persistência, IoT e ledger permissionado.

## ACTAL — Aegis Cognitive Transit & Auditable Ledger
**Challenge FIAP 2026**
