# Política de Privacidade do JobPing

**Data de Vigência:** 2025

Esta Política de Privacidade descreve como o JobPing ("nós" ou "nosso") coleta, usa e protege suas informações quando você utiliza nossa Extensão para o Chrome.

## 1. Coleta e Uso de Informações
O JobPing foi desenvolvido pensando na sua privacidade. Nós **não** coletamos, armazenamos ou transmitimos nenhuma informação pessoal ou dados de navegação para servidores externos.

Todas as operações, incluindo a verificação de novas vagas, são realizadas localmente no seu dispositivo.

## 2. Armazenamento Local (Local Storage)
A extensão utiliza a API de armazenamento local do Chrome (`chrome.storage.local`) para salvar suas preferências e dados operacionais. Estes dados nunca saem do seu navegador:
*   **Configurações:** A URL de busca de vagas do LinkedIn e o intervalo de verificação escolhidos.
*   **Estado Operacional:** Se o monitoramento está atualmente pausado ou ativo.
*   **Histórico de Vagas:** Uma lista temporária das últimas 5 vagas detectadas para evitar notificações duplicadas.
*   **Próxima Verificação:** O timestamp (horário) programado para a próxima verificação em segundo plano.

## 3. Permissões
Para funcionar corretamente, o JobPing requer as seguintes permissões:
*   **`storage` (Armazenamento)**: Usado exclusivamente para salvar suas configurações e histórico de vagas localmente no seu dispositivo.
*   **`notifications` (Notificações)**: Usado para alertá-lo quando uma nova vaga correspondente aos seus critérios é encontrada.
*   **`tabs` (Guias)**: Usado para abrir os links das vagas a partir das notificações e para verificar silenciosamente a URL do LinkedIn configurada em segundo plano.
*   **`scripting`**: Usado para extrair os detalhes da vaga (cargo, empresa, tempo, link) da guia em segundo plano durante a verificação.
*   **`alarms` (Alarmes)**: Usado para agendar e executar as verificações em segundo plano no intervalo que você selecionou.
*   **Permissão de Host (`https://www.linkedin.com/*`)**: Necessário para ler a página de resultados de vagas e extrair os dados relevantes. Nós não acessamos ou lemos dados de nenhum outro site.

## 4. Serviços de Terceiros
Nós não utilizamos nenhum serviço de terceiros para análise (analytics), rastreamento (tracking) ou coleta de dados.

## 5. Alterações nesta Política de Privacidade
Podemos atualizar esta Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações atualizando a "Data de Vigência" no topo desta política. Recomendamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações.

## 6. Contato
Se você tiver alguma dúvida ou sugestão sobre nossa Política de Privacidade, não hesite em entrar em contato com o desenvolvedor:

**Autor:** Ryan Gustavo
**Repositório:** [GitHub](https://github.com/ryangustav)
