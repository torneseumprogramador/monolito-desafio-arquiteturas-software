# 🔧 Resolvendo "Access Denied" no S3

Se você está recebendo o erro "Access Denied" ao tentar acessar imagens no S3, siga este guia passo a passo.

## 🚨 Problema
```
<Error>
<Code>AccessDenied</Code>
<Message>Access Denied</Message>
</Error>
```

## ✅ Soluções

### 1. **Configuração Automática (Recomendado)**

Execute o script de configuração automática:

```bash
npm run configure-s3
```

Este script irá:
- Configurar ACL do bucket para acesso público
- Aplicar política de bucket para permitir leitura pública
- Verificar se as configurações foram aplicadas

### 2. **Configuração Manual no Console AWS**

Se o script automático não funcionar, configure manualmente:

#### Passo 1: Desativar "Block Public Access"

1. Acesse o [Console AWS S3](https://console.aws.amazon.com/s3/)
2. Selecione seu bucket
3. Vá para a aba **"Permissions"**
4. Clique em **"Block public access (bucket settings)"**
5. Clique em **"Edit"**
6. **Desmarque** todas as opções:
   - ✅ Block all public access
   - ✅ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ✅ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ✅ Block public access to buckets and objects granted through new public bucket or access point policies
   - ✅ Block public access to buckets and objects granted through any public bucket or access point policies
7. Clique em **"Save changes"**

#### Passo 2: Configurar Política do Bucket

1. Na aba **"Permissions"**, clique em **"Bucket policy"**
2. Clique em **"Edit"**
3. Cole a seguinte política:

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

**⚠️ IMPORTANTE**: Substitua `SEU_BUCKET_NAME` pelo nome real do seu bucket.

4. Clique em **"Save changes"**

#### Passo 3: Verificar ACL do Bucket

1. Na aba **"Permissions"**, clique em **"Access Control List"**
2. Clique em **"Edit"**
3. Em **"Bucket owner permissions"**, marque:
   - ✅ Read
   - ✅ Write
4. Em **"Everyone (public access)"**, marque:
   - ✅ Read
5. Clique em **"Save changes"**

### 3. **Verificar Permissões IAM**

Certifique-se de que seu usuário IAM tem as permissões necessárias:

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
                "s3:GetObject",
                "s3:PutBucketPolicy",
                "s3:PutBucketAcl"
            ],
            "Resource": [
                "arn:aws:s3:::SEU_BUCKET_NAME",
                "arn:aws:s3:::SEU_BUCKET_NAME/*"
            ]
        }
    ]
}
```

### 4. **Verificar Variáveis de Ambiente**

Certifique-se de que seu arquivo `.env` está configurado corretamente:

```env
AWS_ACCESS_KEY_ID=sua_access_key_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_key_aqui
AWS_REGION=us-east-1
AWS_S3_BUCKET=nome_do_seu_bucket
AWS_S3_BUCKET_URL=https://nome_do_seu_bucket.s3.us-east-1.amazonaws.com
```

## 🧪 Testando a Configuração

### 1. **Teste Manual**
Tente acessar uma URL de imagem diretamente no navegador:
```
https://seu-bucket.s3.sua-regiao.amazonaws.com/produtos/nome-da-imagem.jpg
```

### 2. **Teste na Aplicação**
1. Inicie a aplicação: `npm start`
2. Crie um novo produto com imagem
3. Verifique se a imagem aparece corretamente

### 3. **Verificar Logs**
Se ainda houver problemas, verifique os logs da aplicação para erros específicos.

## 🔍 Troubleshooting

### Erro: "Access Denied" no Upload
- Verifique se as credenciais AWS estão corretas
- Confirme se o usuário IAM tem permissões de escrita

### Erro: "Access Denied" no Acesso à Imagem
- Verifique se o "Block Public Access" está desativado
- Confirme se a política do bucket está aplicada
- Verifique se o ACL está configurado corretamente

### Erro: "Bucket Policy" não pode ser aplicada
- Verifique se o "Block Public Access" está completamente desativado
- Aguarde alguns minutos após desativar o "Block Public Access"

## 📞 Suporte

Se ainda tiver problemas após seguir todos os passos:

1. Verifique se o bucket está na região correta
2. Confirme se as variáveis de ambiente estão corretas
3. Teste com um bucket novo para isolar o problema
4. Verifique os logs do CloudTrail para erros específicos

## ⚠️ Segurança

**Importante**: Configurar acesso público ao S3 significa que qualquer pessoa pode acessar os arquivos. Para produção, considere:

- Usar CloudFront para controle de acesso
- Implementar autenticação para acesso às imagens
- Usar URLs pré-assinadas para acesso temporário
- Configurar CORS adequadamente 