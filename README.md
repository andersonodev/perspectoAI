# Mentor IA - Plataforma Educacional com IA

## 🚀 Novidades da Versão 2.0

### Épico 1: Onboarding Unificado
- ✅ **Página única de cadastro** com seleção de perfil (Educador/Estudante)
- ✅ **Fluxo otimizado** para educadores e estudantes
- ✅ **Sistema de convites** para turmas com códigos automáticos
- ✅ **Redirecionamento inteligente** baseado no tipo de usuário

### Épico 2: Super-Tutor para Estudantes (Freemium)
- ✅ **Super-Tutor IA**: Chat inteligente com guardrails anti-cola
- ✅ **Gerador de Flashcards**: Converte texto/imagens em flashcards (3/mês grátis)
- ✅ **Mapas Mentais IA**: Cria mapas visuais de conceitos (3/mês grátis)
- ✅ **Dashboard do Estudante**: Interface dedicada com gamificação

### Épico 3: Planos Premium (Em Desenvolvimento)
- 🔄 **Aluno Pro**: Assistentes personalizados ilimitados
- 🔄 **IA Aprendiz**: Método Feynman com IA que questiona
- 🔄 **Biblioteca Premium**: Tutores especializados pré-criados

### Épico 4: Melhorias Visuais
- ✅ **Contraste aprimorado**: Textos mais legíveis em todos os componentes
- ✅ **Cores otimizadas**: Fundos e destaques com melhor visibilidade
- ✅ **Interface responsiva**: Melhor experiência em mobile e desktop

## 🛠️ Como rodar a aplicação

### Opção 1: Setup Automático (Recomendado)
```bash
# Torna o script executável
chmod +x setup.sh

# Executa o setup automático
./setup.sh

# Inicia a aplicação
npm run dev
```

### Opção 2: Setup Manual
```bash
# Remove instalação anterior (se houver)
rm -rf node_modules package-lock.json

# Instala com flag legacy-peer-deps para resolver conflitos
npm install --legacy-peer-deps

# Inicia a aplicação
npm run dev
```

### 🔧 Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Limpeza completa e reinstalação
npm run clean-install
```

### 🌐 URLs da Aplicação
- **Desenvolvimento**: http://localhost:5173
- **Cadastro Unificado**: http://localhost:5173/auth
- **Dashboard Educador**: http://localhost:5173/dashboard
- **Dashboard Estudante**: http://localhost:5173/student-dashboard

## 🎯 Funcionalidades Principais

### Para Educadores
- Criar assistentes de IA personalizados
- Gerenciar turmas e estudantes
- Analytics avançadas de uso
- Sistema de convites para turmas
- Upload de materiais didáticos

### Para Estudantes
- **Super-Tutor IA** com explicações passo a passo
- **Gerador de Flashcards** inteligente
- **Mapas Mentais** visuais e interativos
- Sistema de XP e conquistas
- Participação em turmas

## 🔍 Solucionando Problemas

### Erro de Dependências React Three
Se encontrar erros relacionados ao `@react-three/drei`, use:
```bash
npm install --legacy-peer-deps
```

### Port já em uso
Se a porta 5173 estiver ocupada, o Vite automaticamente tentará a próxima disponível (5174, 5175, etc.).

### Cache do navegador
Para limpar cache durante desenvolvimento:
- **Chrome/Edge**: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
- **Firefox**: Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)

## 📋 Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Roteamento**: React Router
- **Backend**: Supabase
- **Autenticação**: Supabase Auth
- **3D/Visualização**: React Three Fiber (opcional)

## 🎨 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── SuperTutorChat/ # Chat do Super-Tutor
│   ├── FlashcardGenerator/ # Gerador de flashcards
│   └── MindMapGenerator/   # Gerador de mapas mentais
├── pages/              # Páginas principais
│   ├── UnifiedAuth/    # Cadastro unificado
│   ├── Dashboard/      # Dashboard do educador
│   ├── StudentDashboard/ # Dashboard do estudante
│   └── CreateAssistant/  # Criação de assistentes
├── contexts/           # Contextos React
├── hooks/              # Hooks customizados
└── types/              # Tipos TypeScript
```

## 🚀 Próximos Passos

1. **Integração de Pagamento**: Stripe para planos premium
2. **IA Aprendiz**: Implementar método Feynman
3. **Analytics**: Dashboard avançado para educadores
4. **Mobile App**: Versão nativa React Native
5. **Integrações**: Google Classroom, Canvas, Moodle
