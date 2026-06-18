# SOMAR — Frontend

Frontend em HTML + CSS + JavaScript puro (vanilla) para o sistema SOMAR
(Sistema de Ocorrências e Monitoramento de Áreas do Recife), consumindo os
microsserviços via fetch.

## Estrutura

```
somar-frontend/
├── public/              # Páginas sem necessidade de login
│   ├── index.html        # Landing page
│   ├── login.html
│   ├── cadastro.html
│   ├── mapa.html          # Mapa público de ocorrências
│   └── ocorrencia.html    # Detalhe público de uma ocorrência
├── cidadao/              # Páginas exclusivas de ROLE_CIDADAO
│   ├── registrar.html
│   ├── minhas-ocorrencias.html
│   └── perfil.html
├── agente/               # Páginas exclusivas de ROLE_AGENTE_PREFEITURA
│   ├── dashboard.html
│   └── ocorrencias.html
└── shared/               # Código compartilhado entre todas as páginas
    ├── config.js          # URLs base dos 5 microsserviços
    ├── auth.js             # Gerenciamento do token JWT (localStorage)
    ├── api.js              # Cliente fetch centralizado
    ├── enums.js            # Espelha os enums dos back-ends
    ├── navbar.js            # Header dinâmico conforme perfil logado
    └── styles.css           # Identidade visual (tema "sinalização urbana")
```

## Como executar

**Não abra os arquivos `.html` direto clicando duas vezes** (URLs `file://`
quebram CORS e localStorage de forma imprevisível). Sirva a pasta com um
servidor HTTP simples:

```bash
cd somar-frontend
python3 -m http.server 5500
```

Ou, se usa VS Code, clique com o botão direito em `public/index.html` e
escolha "Open with Live Server" (extensão Live Server).

Depois acesse `http://localhost:5500/public/index.html`.

## IMPORTANTE: configurar CORS nos back-ends

Os back-ends Spring Boot, por padrão, **bloqueiam** requisições vindas de
`http://localhost:5500` (ou qualquer porta diferente da deles). Sem isso,
toda chamada vai falhar no console do navegador com um erro de CORS, mesmo
que o back-end esteja funcionando perfeitamente.

Adicione esta classe em **cada um dos 5 microsserviços**
(`report-service`, `user-service`, `workflow-status-service`, `ms-geo`,
`ms-priorizacao`), dentro do pacote `config`:

```java
package com.seupacote.config; // ajuste para o pacote real de cada serviço

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5500", "http://127.0.0.1:5500")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

Se você usa o **Spring Security** (é o caso do `report-service` e do
`user-service`), pode ser necessário também liberar CORS dentro da cadeia
de filtros de segurança, em `SecurityConfig`:

```java
http.cors(cors -> cors.configurationSource(request -> {
    var config = new org.springframework.web.cors.CorsConfiguration();
    config.setAllowedOrigins(java.util.List.of("http://localhost:5500", "http://127.0.0.1:5500"));
    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(java.util.List.of("*"));
    config.setAllowCredentials(true);
    return config;
}));
```

Ajuste a porta `5500` para a que você realmente usar ao servir o frontend.

## Decisões e pendências que você pediu para registrar

- A atualização de status de ocorrências no painel do agente chama o
  **workflow-status-service** (`POST /api/workflow/{id}/status?status=N`),
  não o endpoint equivalente do `report-service`. Caso isso mude, o ponto
  único de ajuste é a função que confirma o modal em `agente/ocorrencias.html`.
- O upload de fotos está **simulado**: o frontend gera uma URL fictícia de
  bucket para cada foto selecionada, sem enviar o arquivo de fato. Quando
  o endpoint real de upload (S3 ou outro) estiver pronto, o ponto de ajuste
  é a função de submit em `cidadao/registrar.html`, no array `fotoOcorrencia`.
- O frontend assume que os 5 serviços rodam nas portas dos READMEs
  (8081–8085) em `localhost`. Para outro ambiente, edite apenas
  `shared/config.js`.

## Observação sobre arquitetura

Os READMEs fornecidos têm duas inconsistências que vale revisar com seu
orientador antes da entrega final:

1. O `report-service` tem um endpoint próprio
   `PUT /api/ocorrencias/{id}/status`, que parece duplicar a
   responsabilidade do `workflow-status-service`. O frontend atual usa o
   `workflow-status-service` como fonte de verdade, conforme você indicou.
2. O nome do serviço de usuários varia entre os READMEs (`user-service` em
   alguns, `ms-usuarios` em outros). O frontend usa a porta 8082 e os
   endpoints documentados em `user-service`, que é o nome mais detalhado.