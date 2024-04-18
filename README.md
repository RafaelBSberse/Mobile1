## Como rodar o aplicativo

- Baixe o Expo Go no seu celular
- Instale o Node em sua maquina
- Clone o repositorio
- Na pasta do repositorio, rode no terminal o comando ```npm i```, isso ira instalar as dependencias do projeto
- Rode o comando ```npx expo start --clear```, isso ira buildar e iniciar a rota para o simular, além disso a flag ```clear``` limpa o cache do expo para evitar problemas
- Utilize o Expo Go no seu celular para ler o QR Code gerado no terminal

  OBS: De vez em quando estava tendo problemas de concorrencia com o banco. Caso você note que não está salvando dados nas tabelas ou está mostrando um erro de concorrencia no console, altere o nome do banco no topo do arquivo ```database.js```
