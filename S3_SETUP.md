# Configuração do AWS S3 para Upload de Imagens

Este projeto foi configurado para fazer upload de imagens diretamente para o Amazon S3, oferecendo melhor performance e escalabilidade.

## Pré-requisitos

1. Conta AWS ativa
2. Bucket S3 criado
3. Usuário IAM com permissões para S3

## Configuração do Bucket S3

### 1. Criar um Bucket S3

1. Acesse o console AWS S3
2. Clique em "Create bucket"
3. Escolha um nome único para o bucket
4. Selecione a região desejada
5. Mantenha as configurações padrão de segurança
6. Clique em "Create bucket"

### 2. Configurar Permissões do Bucket

Para permitir acesso público às imagens (necessário para exibição no site):

1. Vá para as propriedades do bucket
2. Desative o "Block all public access" (se necessário)
3. Adicione a seguinte política de bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::SEU_BUCKET_NAME/*"
        }
    ]
}
```

Substitua `SEU_BUCKET_NAME` pelo nome do seu bucket.

## Configuração do Usuário IAM

### 1. Criar um Usuário IAM

1. Acesse o console IAM
2. Vá para "Users" e clique em "Add user"
3. Escolha um nome para o usuário
4. Selecione "Programmatic access"
5. Clique em "Next"

### 2. Anexar Política

Anexe a seguinte política ao usuário:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:DeleteObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::SEU_BUCKET_NAME/*"
        }
    ]
}
```

### 3. Obter Credenciais

1. Após criar o usuário, anote o Access Key ID e Secret Access Key
2. Essas credenciais serão usadas nas variáveis de ambiente

## Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=produtos_db
DB_PORT=3306

# Configurações da Aplicação
NODE_ENV=development
PORT=3000

# Configurações de Segurança
SESSION_SECRET=sua_chave_secreta_aqui

# Configurações do AWS S3
AWS_ACCESS_KEY_ID=sua_access_key_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_key_aqui
AWS_REGION=us-east-1
AWS_S3_BUCKET=nome_do_seu_bucket
AWS_S3_BUCKET_URL=https://nome_do_seu_bucket.s3.us-east-1.amazonaws.com
```

### Explicação das Variáveis S3:

- `AWS_ACCESS_KEY_ID`: Access Key do usuário IAM criado
- `AWS_SECRET_ACCESS_KEY`: Secret Key do usuário IAM criado
- `AWS_REGION`: Região onde o bucket foi criado (ex: us-east-1, sa-east-1)
- `AWS_S3_BUCKET`: Nome do bucket S3 criado
- `AWS_S3_BUCKET_URL`: URL base do bucket (substitua pelo nome correto do seu bucket)

## Instalação das Dependências

Execute o comando para instalar as novas dependências:

```bash
npm install
```

## Funcionalidades Implementadas

### 1. Upload Automático para S3
- As imagens são enviadas diretamente para o S3
- URLs públicas são geradas automaticamente
- Suporte a múltiplos formatos de imagem (JPEG, PNG, GIF, WebP)

### 2. Limitações de Arquivo
- Tamanho máximo: 5MB
- Tipos permitidos: apenas imagens

### 3. Organização de Arquivos
- As imagens são organizadas na pasta `produtos/` dentro do bucket
- Nomes únicos são gerados para evitar conflitos

### 4. Limpeza Automática
- Ao atualizar um produto, a imagem antiga é deletada do S3
- Ao deletar um produto, a imagem é removida do S3

## Testando a Configuração

1. Configure todas as variáveis de ambiente
2. Inicie a aplicação: `npm start`
3. Acesse a página de criação de produtos
4. Tente fazer upload de uma imagem
5. Verifique se a imagem aparece corretamente no produto criado

## Troubleshooting

### Erro: "Configuração do S3 não encontrada"
- Verifique se todas as variáveis de ambiente estão configuradas
- Certifique-se de que o arquivo `.env` está na raiz do projeto

### Erro: "Access Denied"
- Verifique se as credenciais AWS estão corretas
- Confirme se o usuário IAM tem as permissões necessárias
- Verifique se o nome do bucket está correto

### Erro: "Bucket não encontrado"
- Confirme se o bucket existe na região especificada
- Verifique se o nome do bucket está correto na variável `AWS_S3_BUCKET`

## Segurança

⚠️ **Importante**: Nunca commite o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

Para produção, considere:
- Usar AWS Secrets Manager para as credenciais
- Configurar CORS no bucket se necessário
- Implementar validação adicional de tipos de arquivo
- Configurar CloudFront para melhor performance 