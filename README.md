<p align="center"><img src="https://seeklogo.com//images/U/uol-logo-68F369E089-seeklogo.com.png" height="80px"/></p>

# <p align = "center">BatePapoUOL</p>

## <p align = "center">API de um chat online</p>

<div align = "center">
   <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" height="30px"/>
   <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" heigth="30px"/>
   <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" heigth="30px"/>
   <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" heigth="30px">
   <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" heigth="30px">
   <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" heigth="30px"/>
</div>

$~$

### :clipboard: Descrição

O projeto consiste em uma API construída com Node.js, JavaScript, Express e MongoDB para criar um chat online inspirado no BatePapoUOL.

A API possui uma rota de post para registro simples de participantes, bem como uma rota de get para visualizar todos os participantes registrados. Além disso, o projeto inclui um CRUD completo para mensagens, que permite a visualização de todas as mensagens em uma rota com paginação. Também é possível postar uma nova mensagem, especificando os campos "de", "para" e "tipo". Os participantes podem editar e apagar suas próprias mensagens.

#### 💬 [Acesse aqui](https://batepapouolapi-production.up.railway.app)

---

### :bookmark_tabs: Características do projeto

- Usuários podem se registrar inserindo seu nome
- Usuários podem ver todas as mensagens públicas e de status
- Usuários podem mandar mensagens:
  - De maneira pública, sem especificar, todos os participantes possandendo visualizá-las
  - De maneira pública, para um usuário específico, todos os participantes possandendo visualizá-las
  - De maneira reservada, para um usário específico, apenas o remetente e destinatário podendo visualizá-las
- Usuário pode editar suas mensagens enviadas
- Usário pode deletar suas mensagens enviadas

---

### :world_map: Rotas

#### <span style="color:purple">[POST]</span> /participants

```yml
- Rota para login de um novo participante
- Inputs são obrigatórios

- name: string,

- body: { "name": "Beyoncé" }
```

**Retornos:**

| Status Code | Situação                        |
| ----------- | ------------------------------- |
| 201         | Participante logado com sucesso |
| 409         | Participante já logado          |
| 422         | Nenhum 'body' enviado           |
| 422         | Nome inválido                   |

$~$

#### **<span style="color:green">[GET]</span>** /participants

```yml
- Rota para buscar todos os participants logados

- response:
    [
        {
            "_id": "64053219ec7fc02be4680c75",
            "name": "Karine",
            "lastStatus": 1678062105010
        },
        {
            "_id": "64053224ec7fc02be4680c77",
            "name": "Naira",
            "lastStatus": 1678062116454
        },
        {
            "_id": "64053240ec7fc02be4680c7b",
            "name": "Gabriela",
            "lastStatus": 1678062144133
        }
        ...
    ]
```

**Retornos:**

| Status Code | Situação                              |
| ----------- | ------------------------------------- |
| 200         | Retorna todos os participantes ativos |

$~$

#### <span style="color:purple">[POST]</span> /messages

```yml
- Rota para criação de uma nova mensagem
- Inputs são obrigatórios

- to: string,
- text: string,
- type: "message" ou "private_message"

- headers: { user: "Pedro" }
- body:
        /* APENAS UM OBJETO */

        /* Publicamente para todos */
        {
            "to": "Todos",
            "text": "Olá mundo!",
            "type": "message"
        }

        /* Publicamente para um usuário */
        {
            "to": "Gabriela",
            "text": "Posso te contar um segredo?",
            "type": "message"
        }

        /* Reservadamente para um usuário */
        {
            "to": "Gabriela",
            "text": "Segredo que niguém vê...",
            "type": "private_message"
        }



- response: { name: "Pedro" }
```

**Retornos:**

| Status Code | Situação                    |
| ----------- | --------------------------- |
| 201         | Mensagem criada com sucesso |
| 404         | Usuário não encontrado      |
| 422         | Nenhum 'body' enviado       |
| 422         | Para inválido               |
| 422         | Texto inválido              |
| 422         | Tipo inválido               |

$~$

#### <span style="color:green">[GET]</span> /messages?page=50

```yml
- Rota para buscar todas as mensagens
- Possui paginação
- Apenas o remetente e o receptor da mensagem privada podem ver as mensagem do tipo "private_message"

- page: número maior que *zero*, opicional
- headers: { user: "Pedro" }

- response:
    [
        {
            "_id": "64053de6ec7fc02be4680c7e",
            "from": "Naira",
            "to": "Todos",
            "text": "entra na sala...",
            "type": "status",
            "time": "01:12:06"
        },
        {
            "_id": "64053dfdec7fc02be4680c80",
            "from": "Karine",
            "to": "Todos",
            "text": "entra na sala...",
            "type": "status",
            "time": "01:12:29"
        },
        {
            "_id": "64053e49ec7fc02be4680c87",
            "from": "Naira",
            "to": "Todos",
            "text": "Boa noite!!",
            "type": "message",
            "time": "01:13:45"
        },
        {
            "_id": "64053e69ec7fc02be4680c88",
            "from": "Karine",
            "to": "Todos",
            "text": "Oii boa noite =)",
            "type": "message",
            "time": "01:14:17"
        },
        {
            "_id": "64053f32ec7fc02be4680c8b",
            "from": "Gabriela",
            "to": "Todos",
            "text": "entra na sala...",
            "type": "status",
            "time": "01:17:38"
        },
        {
            "_id": "64053f40ec7fc02be4680c8d",
            "from": "Pedro",
            "to": "Todos",
            "text": "entra na sala...",
            "type": "status",
            "time": "01:17:52"
        },
        {
            "_id": "64053f68ec7fc02be4680c8e",
            "from": "Pedro",
            "to": "Gabriela",
            "text": "Posso te vontar um segredo?",
            "type": "message",
            "time": "01:18:32"
        },
        {
            "_id": "64053ff3ec7fc02be4680c8f",
            "from": "Pedro",
            "to": "Gabriela",
            "text": "Segredo que niguém vê...",
            "type": "private_message",
            "time": "01:20:51"
        }
        ...
    ]
```

**Retornos:**

| Status Code | Situação                     |
| ----------- | ---------------------------- |
| 200         | Retorna os tweets do usuário |

$~$

#### <span style="color:blue">[PUT]</span> /messages/:id

```yml
- Rota para edição de uma mensagem do participante
- Inputs são obrigatórios

- to: string,
- text: string,
- type: "message" ou "private_message"

- params: { id: 64053240ec7fc02be4680c7b }
- hearders: { user: "Tiago" }
- body:
        {
            "to": "Todos",
            "text": "Hello world!",
            "type": "message"
        }
```

**Retornos:**

| Status Code | Situação                        |
| ----------- | ------------------------------- |
| 200         | Mensagem atualizada com sucesso |
| 404         | Usuário não encontrado          |
| 404         | Mensagem não encontrada         |
| 422         | Nenhum 'body' enviado           |
| 422         | Para inválido                   |
| 422         | Texto inválido                  |
| 422         | Tipo inválido                   |

$~$

#### <span style="color:red">[DELETE]</span> /messages/:id

```yml
- Rota para deleção de uma mensagem do participante

- params: { id: 64053240ec7fc02be4680c7b }
- hearders: { user: "Tiago" }
```

**Retornos:**

| Status Code | Situação                      |
| ----------- | ----------------------------- |
| 200         | Mensagem deletada com sucesso |
| 401         | Não autorizada a deleção      |
| 404         | Usuário não encontrado        |

$~$

#### <span style="color:purple">[POST]</span> /status

```yml
- Rota para verificação da inatividade dos participantes

- hearders: { user: "Gabriela" }
```

**Retornos:**

| Status Code | Situação                        |
| ----------- | ------------------------------- |
| 200         | Atualização com o horário atual |
| 404         | Usuário não encontrado          |

$~$

---

### :rocket: Rodando esse projeto localmente

Para inicializar esse projeto é necessário que você possua a última versão estável do [Node.js](https://nodejs.org/en/download) e [npm](https://www.npmjs.com/) rodando localmente. Você também precisará instalar o [MongoDB](https://www.mongodb.com/try/download/bi-connector) para acessar o banco de dados.

Primeiro de tudo, clone este projeto ou faça o download do ZIP.

Para realizar o clone, no terminal de sua máquina, utilize o [git](https://git-scm.com/) e insira o seguinte comando:

```bash
    https://github.com/GabrielaTiago/BatePapoUOL.git
```

Entre na pasta do projeto

```bash
    cd BatePapoUOL
```

Execute o seguinte comando para instalar as dependências.

```bash
    npm install
```

Criar um arquivo **.env** na raíz do projeto com os seguintes dados:

#### env

```bash
    PORT=5000
    MONGO_URI="mongodb://127.0.0.1:27017"
    MONGO_DATABASE_NAME="BatePapoUOL"
```

Para iniciar o servidor, execute o comando:

```bash
    npm run start
```

A aplicação estará disponível em: <http://localhost:5000> no seu navegador.

---

### :bulb: Reconhecimentos

- [Badges para Github](https://github.com/alexandresanlim/Badges4-README.md-Profile#-database-)
- [Inspiração de README](https://gist.github.com/luanalessa/7f98467a5ed62d00dcbde67d4556a1e4#file-readme-md)
- [Driven Education](https://www.driven.com.br)

---

### 👩‍🦱 Autora

Gabriela Tiago de Araújo

- email: gabrielatiagodearaujo@outlook.com
- linkedin: <https://www.linkedin.com/in/gabrielatiago/>
- portfolio: <https://gabrielatiago.vercel.app>

---

[🔝 Back to top](#batepapouol)
