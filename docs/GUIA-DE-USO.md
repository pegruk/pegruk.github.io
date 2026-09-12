# Como usar e publicar seu blog

Este guia explica como cuidar do blog: abrir uma prévia no computador, escrever artigos, incluir imagens e equações, personalizar as páginas e publicar no GitHub Pages.

Os comandos abaixo partem da pasta do projeto. No seu computador atual, ela é `/home/pegruk/blog`. Em outro computador, use a pasta onde você salvou ou clonou o repositório.

## Índice

1. [Como o blog funciona](#1-como-o-blog-funciona)
2. [Preparar o computador](#2-preparar-o-computador)
3. [Abrir a prévia local](#3-abrir-a-prévia-local)
4. [Criar um artigo](#4-criar-um-artigo)
5. [Formatar o conteúdo](#5-formatar-o-conteúdo)
6. [Adicionar imagens](#6-adicionar-imagens)
7. [Usar categorias e busca](#7-usar-categorias-e-busca)
8. [Trabalhar com rascunhos e exemplos](#8-trabalhar-com-rascunhos-e-exemplos)
9. [Personalizar o blog](#9-personalizar-o-blog)
10. [Publicar no GitHub pela primeira vez](#10-publicar-no-github-pela-primeira-vez)
11. [Publicar novos artigos e correções](#11-publicar-novos-artigos-e-correções)
12. [Editar diretamente pelo GitHub](#12-editar-diretamente-pelo-github)
13. [Executar verificações técnicas](#13-executar-verificações-técnicas)
14. [Resolver problemas comuns](#14-resolver-problemas-comuns)
15. [Referência rápida](#15-referência-rápida)

## 1. Como o blog funciona

Você escreve arquivos Markdown, com extensão `.md`. O Eleventy transforma esses arquivos em páginas HTML. O GitHub Pages hospeda as páginas geradas.

O fluxo de publicação é:

```text
Escrever → visualizar → fazer commit → enviar ao GitHub → aguardar a publicação
```

- **Markdown:** texto simples com marcações para títulos, links, listas e outros elementos.
- **Prévia local:** uma versão do blog disponível no seu computador para revisar mudanças.
- **Build:** geração dos arquivos finais do site.
- **Commit:** um registro de uma alteração no histórico do Git.
- **Push:** envio dos commits locais para o GitHub.
- **Deploy:** publicação dos arquivos gerados na hospedagem.

O site publicado não precisa de um servidor de aplicação, banco de dados ou painel administrativo. O comando de prévia inicia apenas um servidor de desenvolvimento no seu computador.

O visual é inspirado no PaperMod, mas o projeto usa Eleventy, não Hugo. Instruções de instalação ou configuração de temas Hugo não se aplicam aqui.

### Arquivos que você vai usar

| Caminho | Para que serve |
| --- | --- |
| `src/posts/` | Artigos Markdown, diretamente dentro desta pasta |
| `src/assets/` | Imagens, CSS e JavaScript |
| `src/about.md` | Conteúdo da página “About me” |
| `src/_data/site.json` | Nome e descrição padrão do blog |
| `src/index.njk` | Lista de artigos e estrutura da página inicial |
| `src/_includes/base.njk` | Cabeçalho, navegação, rodapé e busca |
| `src/_includes/post.njk` | Estrutura compartilhada dos artigos |
| `src/assets/style.css` | Aparência, responsividade e temas |
| `_site/` | Resultado gerado automaticamente pelo build |
| `.github/workflows/pages.yml` | Automação de publicação no GitHub Pages |

Edite os arquivos em `src/`. O build de produção apaga e recria `_site/`, então mudanças feitas diretamente nessa pasta serão perdidas. Não é necessário enviar `_site/` ou `node_modules/` ao GitHub; ambas estão no `.gitignore`.

## 2. Preparar o computador

### Passo 1 — Conferir as ferramentas

Você precisa de Node.js 22 ou superior, npm e Git. Abra um terminal e execute:

```sh
node --version
npm --version
git --version
```

Se algum comando não existir, instale a ferramenta correspondente antes de continuar. O npm normalmente acompanha a instalação do Node.js.

### Passo 2 — Entrar na pasta

No ambiente atual:

```sh
cd /home/pegruk/blog
```

Se estiver começando em outro computador e o projeto já estiver no GitHub, substitua `SEU_USUARIO` e `SEU_REPOSITORIO`:

```sh
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

Use apenas o caminho adequado ao seu caso: não precisa clonar novamente o projeto que já está no computador.

### Passo 3 — Instalar as dependências

```sh
npm ci
```

Esse comando instala as versões registradas no `package-lock.json`. Execute na primeira preparação e quando esse arquivo mudar após atualizar o projeto. Não precisa repeti-lo para cada artigo.

## 3. Abrir a prévia local

### Passo 1 — Iniciar

```sh
npm run dev
```

### Passo 2 — Abrir no navegador

Acesse **http://localhost:8080**. Se o terminal informar outro endereço, use o endereço exibido.

### Passo 3 — Editar e revisar

Mantenha o terminal aberto. Ao salvar arquivos, o Eleventy refaz a prévia. O navegador normalmente recarrega automaticamente; se necessário, atualize a página.

Confira a página inicial, abra o artigo e experimente o modo claro e o modo escuro. Diminua a largura da janela para conferir a leitura no celular.

### Passo 4 — Encerrar

No terminal que está executando o servidor, pressione **Ctrl+C**.

Se a porta 8080 já estiver ocupada e você precisar de outra prévia:

```sh
npm run dev -- --port=8082
```

Acesse então **http://localhost:8082**. Não abra `src/index.njk` ou o HTML gerado com um duplo clique: use o servidor para que navegação e busca funcionem corretamente.

## 4. Criar um artigo

### Passo 1 — Escolher o nome do arquivo

Crie um arquivo diretamente em `src/posts/`, por exemplo:

```text
src/posts/entendendo-ativacoes.md
```

Use letras minúsculas, sem espaços ou acentos, com palavras separadas por hífens. Não coloque artigos em subpastas: a configuração atual coleta `src/posts/*.md`.

O nome determina o endereço:

```text
/posts/entendendo-ativacoes/
```

O título exibido pode ser diferente do nome do arquivo. Evite renomear o arquivo depois de publicar, pois isso altera a URL e quebra links antigos.

### Passo 2 — Copiar este modelo

```markdown
---
title: "Entendendo ativações: minhas primeiras anotações"
date: 2026-09-12
categories: ["Mechanistic interpretability", "AI safety"]
description: "Uma introdução às perguntas que podemos fazer sobre as ativações de uma rede neural."
draft: false
---

Neste artigo, vou organizar algumas ideias sobre ativações de redes neurais.

## O que quero entender

Escreva aqui o primeiro trecho do artigo.

## Um exemplo

Descreva um exemplo concreto.

## Referências

- [Uma referência](https://example.com)
```

O bloco entre as duas linhas `---` deve ficar no começo do arquivo. Ele é chamado de *front matter* e descreve o artigo.

### Passo 3 — Preencher os campos

| Campo | Como usar |
| --- | --- |
| `title` | Título que aparece na página inicial e no artigo |
| `date` | Data no formato `AAAA-MM-DD`; artigos mais recentes vêm primeiro |
| `categories` | Lista de categorias; use a mesma grafia nos artigos relacionados |
| `description` | Resumo mostrado no cartão da página inicial e na descrição HTML da página |
| `draft` | `true` para ocultar o artigo; `false` para permitir sua geração |
| `demo` | Reservado a exemplos locais; omita em artigos reais |

Use aspas em títulos e descrições, especialmente quando houver dois-pontos. Escreva `true` e `false` sem aspas. Para um artigo normal, preencha título, data, categorias e descrição.

Não repita o título com `#` no corpo: o modelo do artigo já gera o título principal. Comece as seções com `##`.

A data não agenda publicações. Um artigo com data futura e `draft: false` pode ser publicado assim que você fizer o push.

### Passo 4 — Ver o resultado

Com `npm run dev` em execução, abra:

```text
http://localhost:8080/posts/entendendo-ativacoes/
```

Confira também o cartão na página inicial. O artigo deve aparecer na categoria escolhida e na busca.

## 5. Formatar o conteúdo

### Parágrafos e subtítulos

Deixe uma linha vazia entre os parágrafos:

```markdown
Este é o primeiro parágrafo.

Este é o segundo parágrafo.

## Uma seção

Texto da seção.

### Uma subseção

Mais detalhes.
```

### Negrito, itálico e código no texto

```markdown
Um conceito **importante**, uma palavra em *itálico* e uma variável `activation`.
```

### Listas

```markdown
- Primeira ideia
- Segunda ideia
- Terceira ideia

1. Preparar o experimento.
2. Executar o código.
3. Analisar os resultados.
```

### Links

Link externo:

```markdown
[Nome do recurso](https://example.com)
```

Link para outro artigo do próprio blog:

```markdown
[Minhas anotações anteriores]({{ '/posts/entendendo-ativacoes/' | url }})
```

O filtro `url` inclui automaticamente o prefixo do repositório quando o blog é hospedado em um endereço como `usuario.github.io/blog/`.

### Citações

```markdown
> Uma citação curta ou uma ideia que merece destaque.
```

Inclua a referência correspondente quando citar outra pessoa.

### Blocos de código

Use três crases antes e depois do código e informe a linguagem:

````markdown
```python
import torch

x = torch.tensor([1.0, 2.0, 3.0])
print(x.mean())
```
````

Outras linguagens comuns incluem `javascript`, `typescript`, `json`, `bash` e `sql`. O blog destaca a sintaxe; ele não executa o código dos artigos.

### Equações

Para uma equação dentro do parágrafo:

```markdown
Uma transformação linear pode ser escrita como $y = Wx + b$.
```

Para uma equação em uma linha própria:

```markdown
$$
p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$
```

O KaTeX transforma as equações durante o build. Confira o resultado na prévia, porque comandos LaTeX não suportados ou fórmulas incorretas podem não renderizar como esperado.

### Tabelas

```markdown
| Experimento | Resultado |
| --- | --- |
| Sem intervenção | Resposta original |
| Com intervenção | Resposta modificada |
```

### Notas de rodapé

```markdown
Esta afirmação precisa de uma explicação adicional.[^explicacao]

[^explicacao]: Escreva aqui a explicação ou a referência.
```

## 6. Adicionar imagens

### Passo 1 — Salvar a imagem

Você pode criar uma pasta para organizar as imagens:

```text
src/assets/images/
```

Coloque nela o arquivo, por exemplo `ativacoes.png`.

### Passo 2 — Inserir no artigo

```markdown
![Mapa de ativações com as regiões de maior resposta destacadas]({{ '/assets/images/ativacoes.png' | url }})
```

O texto entre colchetes descreve a imagem para leitores de tela e aparece quando ela não pode ser carregada. O caminho público começa com `/assets/`, não com `/src/assets/`.

### Passo 3 — Conferir e enviar junto

Verifique a imagem na prévia. Ao publicar, inclua tanto o artigo quanto a imagem no commit:

```sh
git add src/posts/entendendo-ativacoes.md src/assets/images/ativacoes.png
```

Prefira arquivos com tamanho adequado para leitura na web. O projeto copia as imagens como estão; não faz compressão ou redimensionamento automático.

## 7. Usar categorias e busca

### Categorias

As categorias são extraídas dos artigos automaticamente. Para criar uma categoria, basta usá-la nos metadados:

```yaml
categories: ["Backend development"]
```

Para usar mais de uma:

```yaml
categories: ["AI safety", "Mechanistic interpretability"]
```

A primeira categoria aparece no cartão da página inicial. Todas participam do filtro de categorias e aparecem na página do artigo. Categorias com grafias diferentes, como `AI Safety` e `AI safety`, são consideradas distintas.

### Busca

Clique no ícone de lupa no cabeçalho e digite palavras do título ou do texto. A busca:

- Ignora diferenças entre maiúsculas e minúsculas e entre letras com ou sem acento.
- Procura todas as palavras digitadas, sem exigir que estejam juntas.
- Prioriza resultados com palavras no título.
- Mostra um trecho do conteúdo correspondente.

Não é necessário cadastrar os artigos em um serviço de busca. O índice é gerado junto com o site. Se a janela de busca já estava aberta antes de você editar um artigo localmente, recarregue a página para obter o índice atualizado.

## 8. Trabalhar com rascunhos e exemplos

### Rascunhos

```yaml
draft: true
```

Na implementação atual, um rascunho fica fora da página inicial, da busca e da geração da página individual **inclusive na prévia local**.

Para revisar um rascunho no navegador:

1. Altere temporariamente para `draft: false`.
2. Salve e revise com `npm run dev`.
3. Se ainda não quiser publicar, volte para `draft: true` antes de fazer commit e push.

`draft` impede a geração da página, mas não esconde o arquivo Markdown de quem consegue acessar o repositório. Além disso, arquivos em `src/assets/` são copiados para a publicação mesmo quando só são usados por um rascunho.

### Artigos de demonstração

Os três exemplos originais usam:

```yaml
demo: true
```

Eles aparecem na prévia local com identificação de exemplo, mas não entram no build de produção. Ao copiar um exemplo para criar seu artigo, remova `demo: true`.

Se quiser manter um texto de exemplo como artigo real, revise o conteúdo, remova os avisos de demonstração no corpo e retire `demo: true`. Os testes de interface atuais usam os exemplos originais como referências; veja a seção de verificações antes de removê-los.

## 9. Personalizar o blog

### Nome e descrição padrão

Edite `src/_data/site.json`:

```json
{
  "name": "Seu nome",
  "description": "Anotações sobre segurança de IA, interpretabilidade e desenvolvimento."
}
```

Mantenha as aspas, vírgulas e chaves válidas. Não coloque vírgula depois do último campo. A descrição padrão é usada quando a página não fornece uma descrição própria.

### Página “About me”

Edite `src/about.md`, mantendo o bloco inicial de metadados e a estrutura HTML existente. Você pode acrescentar seções em Markdown:

```markdown
## Projetos

- [Nome do projeto](https://github.com/SEU_USUARIO/SEU_PROJETO): uma breve explicação.

## Contato

- [GitHub](https://github.com/SEU_USUARIO)
- [E-mail](mailto:seu-email@example.com)
```

Substitua os endereços pelos seus links reais.

### Página inicial

A página inicial começa diretamente pela lista de artigos. A apresentação pessoal fica em `src/about.md`. Para ajustar o título da listagem ou a estrutura dos cartões, edite `src/index.njk`, preservando os identificadores usados pela busca e pelo filtro.

### Aparência

Edite `src/assets/style.css`. As variáveis no início do arquivo controlam fundo, texto, bordas e cores de destaque. Existem valores para tema claro, tema escuro escolhido manualmente e tema escuro seguindo o sistema.

O botão de tema lembra a escolha no navegador. Sem escolha explícita, o blog acompanha a preferência do sistema operacional.

### Idioma

Você pode escrever artigos em português imediatamente. A interface, o atributo `lang="en"` e a formatação das datas continuam em inglês na configuração atual.

Para uma tradução completa da interface, os textos estão principalmente em `src/index.njk`, `src/_includes/base.njk`, `src/_includes/post.njk`, `src/about.md` e `src/assets/app.js`. Ajuste também o atributo `lang` para `pt-BR` e a localidade `en` do filtro `dateLabel` em `eleventy.config.js`. Os testes que procuram textos em inglês precisam acompanhar essa alteração. Este guia não altera o idioma do site.

## 10. Publicar no GitHub pela primeira vez

### Passo 1 — Escolher o repositório

Crie um repositório **público** no GitHub para usar o GitHub Pages com o plano gratuito. A disponibilidade por plano é descrita na [documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Duas opções comuns:

| Nome do repositório | Endereço esperado |
| --- | --- |
| `SEU_USUARIO.github.io` | `https://SEU_USUARIO.github.io/` |
| `blog` | `https://SEU_USUARIO.github.io/blog/` |

O projeto aceita os dois formatos. A automação descobre o prefixo do endereço durante a publicação.

Ao criar um repositório vazio para receber este projeto, não inicialize outro README, `.gitignore` ou licença: esses arquivos podem criar um histórico separado do que você já tem localmente.

### Passo 2 — Conferir o Git local

```sh
git status
git branch --show-current
git remote -v
```

Este projeto já tem um repositório Git e commits. Não precisa executar `git init` novamente. A automação publica a branch `main`.

### Passo 3 — Conectar ao repositório

Se `git remote -v` não mostrar um remoto chamado `origin`, execute, substituindo os nomes:

```sh
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

Se `origin` já existir e apontar para o repositório correto, pule esse comando. Se apontar para outro destino, confira o endereço antes de alterá-lo:

```sh
git remote set-url origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### Passo 4 — Autenticar e enviar

Use uma credencial Git já configurada, GitHub CLI ou SSH. Se você usa GitHub CLI e ainda não se autenticou:

```sh
gh auth login
```

Siga as instruções de autenticação pelo navegador. Para Git por HTTPS, a senha comum da conta não substitui a credencial exigida pelo Git; veja as [opções oficiais de autenticação](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github).

Envie os commits existentes:

```sh
git push -u origin main
```

Arquivos novos ou alterados sem commit não são enviados. Para incluir um artigo novo, siga antes os passos da seção 11.

### Passo 5 — Ativar o Pages

No repositório do GitHub:

1. Abra **Settings**.
2. Na barra lateral, abra **Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions** em **Source**.

O projeto já contém um workflow; não precisa adicionar um dos modelos sugeridos pelo GitHub. Esse é o procedimento indicado na [configuração oficial de publicação por Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

### Passo 6 — Executar a publicação

1. Abra a aba **Actions**.
2. Selecione **Deploy blog to GitHub Pages**.
3. Clique em **Run workflow**, escolha `main` e confirme a execução.
4. Aguarde o resultado da execução.

O primeiro push pode ter iniciado uma execução antes de você ativar o Pages. Se ela falhar por esse motivo, execute novamente depois da configuração.

A automação instala dependências, verifica o build, gera o site e publica `_site/`. Nenhuma dessas etapas exige que você mantenha a prévia local aberta.

### Passo 7 — Conferir o site publicado

Abra o endereço informado em **Settings → Pages** ou no resultado da publicação. Verifique a página inicial, um artigo, uma imagem e a busca.

Os exemplos locais não aparecerão. Se você ainda não tiver nenhum artigo real com `draft: false`, a página inicial mostrará a mensagem de que ainda não há publicações.

## 11. Publicar novos artigos e correções

Depois da configuração inicial, repita este fluxo.

### Passo 1 — Sincronizar, quando necessário

Se você também editou pelo GitHub ou em outro computador, comece com a árvore de trabalho limpa e execute:

```sh
git pull --ff-only origin main
```

Se houver alterações locais, confira `git status` e conclua ou salve seu trabalho antes de sincronizar. Se o Git informar divergência de histórico, resolva a divergência antes de continuar; não use push forçado como rotina.

### Passo 2 — Escrever e visualizar

Crie ou edite o arquivo em `src/posts/` e revise com:

```sh
npm run dev
```

### Passo 3 — Conferir a versão de produção

Pare a prévia com **Ctrl+C** antes de executar:

```sh
npm run build
```

O comando deve terminar sem erros. Ele limpa `_site/` e gera a versão publicada, sem rascunhos ou exemplos. Isso também remove os exemplos da saída que o servidor de prévia usava; execute `npm run dev` novamente quando quiser voltar à revisão local.

### Passo 4 — Revisar as mudanças

```sh
git status
git diff
```

`git status` mostra também arquivos novos. `git diff` normalmente mostra alterações em arquivos já rastreados; abra os arquivos novos no editor para revisá-los.

### Passo 5 — Selecionar e registrar

Para o artigo do exemplo e sua imagem:

```sh
git add src/posts/entendendo-ativacoes.md src/assets/images/ativacoes.png
git diff --cached
git commit -m "content: publish notes on model activations"
```

Se não houver imagem, omita o caminho dela. Use os nomes dos arquivos que você realmente criou. O comando `git diff --cached` permite conferir exatamente o que entrará no commit.

### Passo 6 — Enviar

```sh
git push origin main
```

### Passo 7 — Acompanhar

Abra **Actions** no GitHub e confira a execução referente ao seu commit. Quando terminar com sucesso, abra o site público e verifique a mudança.

Salvar, fazer commit e fazer push são etapas diferentes. Só o push para `main` aciona a publicação remota neste projeto.

### Como nomear os commits

Use uma alteração coerente por commit. Um artigo com suas imagens costuma caber em um único commit; uma correção posterior pode ter outro.

| Mudança | Exemplo |
| --- | --- |
| Novo artigo | `content: publish notes on model activations` |
| Correção editorial | `content: clarify activation example` |
| Correção de funcionamento | `fix: correct article image paths` |
| Novo recurso | `feat: add a projects section` |
| Documentação | `docs: update publishing guide` |
| Manutenção | `chore: update dependencies` |

`content:` é um tipo descritivo adotado para este blog, compatível com a estrutura de Conventional Commits. Não é necessário criar um commit a cada salvamento.

### Corrigir ou retirar um artigo

Para corrigir, edite o mesmo arquivo, revise, faça commit e push. Mantenha o nome do arquivo para preservar o endereço. A data não é atualizada automaticamente; mantenha a data original se a mudança for apenas uma correção.

Para retirar uma página da próxima publicação, defina `draft: true`, faça commit e push. O endereço deixará de ter uma página gerada. Isso não apaga versões antigas do histórico Git nem cópias que já tenham sido obtidas por terceiros.

## 12. Editar diretamente pelo GitHub

Depois que o Pages estiver configurado, também é possível publicar sem abrir o terminal:

1. Abra o repositório no GitHub.
2. Entre em `src/posts/`.
3. Use **Add file → Create new file** para criar um `.md`, ou abra um arquivo existente e clique em editar.
4. Escreva os metadados e o conteúdo, seguindo o modelo deste guia.
5. Em **Commit changes**, escreva uma mensagem como `content: publish a new article`.
6. Selecione commit direto em `main`, quando essa opção estiver disponível. Se usar uma branch e pull request, a publicação ocorrerá após o merge em `main`.
7. Acompanhe a publicação na aba **Actions**.

A prévia Markdown do GitHub não reproduz o tema do blog nem necessariamente as equações e os filtros `{{ ... | url }}`. Para revisar o resultado exato antes de publicar, prefira o fluxo local.

Depois de editar pelo GitHub, sincronize sua cópia local antes de continuar trabalhando nela:

```sh
git pull --ff-only origin main
```

## 13. Executar verificações técnicas

Para alterações apenas no conteúdo, revise no navegador e execute `npm run build`. Para mudanças no código, estes comandos ajudam:

| Comando | O que faz |
| --- | --- |
| `npm run build` | Gera a versão de produção e limpa a saída anterior |
| `npm run test:build` | Verifica exclusão de rascunhos/exemplos e URLs na raiz e em subdiretórios, em uma cópia temporária |
| `npm test` | Abre testes automatizados no Chromium para busca, categorias, tema e leitura |
| `npm run format` | Reescreve a formatação dos arquivos JavaScript e CSS incluídos no script |

Os testes de navegador usam por padrão a porta **8081**. Eles aproveitam `/usr/bin/chromium` quando existe. Caso contrário, instale o navegador de teste:

```sh
npx playwright install chromium
```

Os testes atuais foram escritos com os três artigos de demonstração e contêm expectativas fixas de quantidade e resultados. Adicionar artigos reais ou remover exemplos pode exigir atualizar `tests/blog.spec.js`; uma falha nessa expectativa não significa necessariamente que o blog deixou de funcionar. O workflow de publicação executa `test:build`, não essa suíte de navegador.

O comando de formatação altera arquivos; depois de usá-lo, confira `git diff`.

## 14. Resolver problemas comuns

| Problema | O que conferir |
| --- | --- |
| `npm` ou `node` não encontrado | Instalação do Node.js e abertura de um novo terminal após instalar |
| Comando não encontra `package.json` | Execute dentro da pasta do projeto |
| Porta ocupada | Reutilize a prévia existente ou use `npm run dev -- --port=8082` |
| Artigo não aparece nem localmente | Extensão `.md`, pasta `src/posts/`, metadados válidos e `draft: false` |
| Artigo aparece localmente, mas não publicado | Remova `demo: true` do artigo real e confira commit, push e Actions |
| Artigo ainda aparece após virar rascunho | Reinicie a prévia após um build limpo; a geração incremental pode deixar uma página antiga em `_site/` |
| Build acusa erro de YAML | Confira os delimitadores `---`, aspas e estrutura de `categories` |
| Imagem funciona localmente, mas não no Pages | Confira maiúsculas/minúsculas, se o arquivo foi enviado e se o link usa o filtro `url` |
| Busca não mostra uma edição recente | Recarregue a página; o índice pode estar carregado na aba antiga |
| Site público não atualiza | Confira se o commit chegou a `main` e se o workflow terminou com sucesso |
| `origin already exists` | Confira `git remote -v`; não tente cadastrar o mesmo remoto novamente |
| Push pede autenticação ou é recusado | Confira conta, permissão de escrita e credencial Git; use o guia oficial de autenticação citado acima |
| Push informa que há mudanças remotas | Sincronize e resolva eventuais conflitos antes de enviar novamente |
| Pages mostra erro de configuração | Em **Settings → Pages**, confira **Source: GitHub Actions** e execute o workflow novamente |
| Exemplos sumiram da prévia depois de um build | Pare o servidor e execute `npm run dev` novamente |
| Equação não renderiza | Confira `$...$`, `$$...$$` e a sintaxe da fórmula |

## 15. Referência rápida

### Começar a escrever

```sh
cd /home/pegruk/blog
npm run dev
```

Crie um `.md` em `src/posts/`, preencha título, data, categorias e descrição, e revise no navegador.

### Publicar

Depois de parar a prévia, substitua o caminho abaixo pelo seu arquivo:

```sh
npm run build
git status
git add src/posts/SEU-ARTIGO.md
git diff --cached
git commit -m "content: publish a new article"
git push origin main
```

### Conferir antes de enviar

- O título, a data e o resumo estão corretos.
- O artigo real está com `draft: false` e sem `demo: true`.
- Links, imagens, código e equações funcionam na prévia.
- Os arquivos de imagem foram incluídos no commit.
- A leitura está confortável no celular e nos dois temas.
- O build terminou sem erros.

Depois do push, confirme o sucesso em **Actions** e abra a página publicada.
