# projectDOME

## Tecnologias
    Para estruturação do projeto foi usado o framework do SuiteScript, o SuiteCloud, no qual facilita e padroniza a criação de projetos na plataforma. Além de auxiliar na fase de deploy dos projetos, usando dos próprios comandos do CLI do framework.

    Para desenvolvimento dos scripts optei por utilizar o TypeScript como código base. Com o módulo de desenvolvimento @hitc/netsuite-types é possível criar arquiteturas e códigos mais limpos, muito por conta das interfaces e enumeradores que são disponibilizados pela ferramenta. Os códidos produzidos em TypeScript estão localizados na pasta TS, na raiz do projeto.

## Rodando o projeto
    Ferramentas necessárias na máquina:
        1. *npm* - necessário para instalar as depedências do projeto
        2. *Java JDK 11* - instalado e referênciado nas variáveis de sistema. Necessário para executar os comandos do framework suitecloud
    Para fazer o deploy do projeto e realizar os testes. Será necessário executar os seguintes comandos:
        1. npm install - instalando as dependências do projeto
        2. npm run build - construir o código JS a partir da pasta TS, usando o tsc
        3. suitecloud account:setup -i - nesse step será necessário realizar a autenticação na base em que será feito o deploy no Netsuite. Pode ser feito por meio de Browser-Based Authentication ou setando os tokens de integração SuiteCloud manualmente
        4. suitecloud project:deploy -i

    Configurações:
        1. Setar o valor do parâmetro do token de autenticação da API de clientes
        2. Alterar o status de "teste" dos scripts para liberado

## Observações
    Afim de determinar um nome para o projeto criei a pasta dos códigos como CLIN. O cliente em que é feita a requisição dos customers foi nomeada como EXTForm.

    Os campos tipo, bairro, numero e código IBGe do subrecord de endereço são customizados para cada conta Netsuite, então dependendo da base do deploy esses campos ficarão em branco.
