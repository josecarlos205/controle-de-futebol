# Guia para Configurar o Deploy no GitHub Pages para o Projeto Controle de Futebol

Este guia explica como configurar o deploy do seu projeto no GitHub Pages para garantir que os arquivos JSON sejam servidos corretamente e o aplicativo funcione online.

## Passo 1: Estrutura do Repositório

- Certifique-se de que todos os arquivos do projeto, incluindo os arquivos JSON (`campeonato.json`, etc.), estejam no repositório GitHub.
- Os arquivos devem estar na raiz do repositório ou em uma pasta que será publicada.

## Passo 2: Configurar GitHub Pages

1. Acesse o repositório no GitHub.
2. Vá para a aba **Settings** (Configurações).
3. No menu lateral, clique em **Pages**.
4. Em **Source** (Fonte), selecione o branch que deseja publicar:
   - Pode ser `main` ou `master` (dependendo do seu repositório).
   - Se os arquivos estiverem em uma pasta, selecione a pasta `/root` ou `/docs`.
5. Clique em **Save**.

## Passo 3: Ajustar Caminhos no Código

- No seu código, o `fetch` para os arquivos JSON deve usar caminhos relativos corretos.
- Exemplo: `fetch('./campeonato.json')` funciona se o JSON estiver na mesma pasta que o `index.html`.
- Se estiver em uma subpasta, ajuste o caminho, por exemplo: `fetch('./data/campeonato.json')`.

## Passo 4: Publicar e Acessar

- Após salvar as configurações, o GitHub Pages irá publicar seu site.
- O link para acesso será mostrado na página de configurações do GitHub Pages.
- Aguarde alguns minutos para a publicação estar ativa.

## Passo 5: Testar Online

- Acesse o link do GitHub Pages.
- Verifique se o aplicativo carrega corretamente e se os dados JSON são carregados sem erros.

## Passo 6 (Opcional): Deploy Automático com GitHub Actions

- Você pode configurar um workflow para automatizar o deploy.
- Consulte a documentação oficial do GitHub Pages para mais detalhes.

---

Se precisar de ajuda para configurar o workflow ou ajustar o projeto, estou à disposição para ajudar.
