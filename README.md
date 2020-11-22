
# Web API Portum Project

## Servidor NodeJS para API REST da aplicação Web Portum


- ExpressJS
- Dados Porto Sem Papel
- Web Scraping Real Time para recuperar dados de Tabuas de Maré de todos os anos (usando Cheerio)
- OpenWeather API
- Scripts para conversao para JSON de dados do Porto Sem Papel


### Requisitos para executar em ambiente de desenvolvimento:

- NodeJS 14 instalado na maquina
- npm install
- npm run dev

OBS: O projeto em producao esta em um ambiente leve na Google Cloud (App Engine Mode Standard).
a primeira inicializacao da instancia do NodeJS no modo Stantard na Google Cloud é demorada após ele entrar entrar em modo de descanso
por nao ter acesso recorrente. Tente carregar algumas vezes o Front caso falha o carregamento das listas.



