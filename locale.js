/* BEST GYM — maintainable PT/EN locale layer for the static DC runtime. */
(function () {
  'use strict';

  var BASE = 'https://site-best-gym-portugal.vercel.app';
  var ROUTES = {
    '/': '/en/', '/campanha': '/en/campaign', '/unidades': '/en/gyms',
    '/unidade-valongo': '/en/gyms/valongo', '/unidade-famalicao': '/en/gyms/famalicao',
    '/built-by-best': '/en/built-by-best', '/franchising': '/en/franchising',
    '/produtos': '/en/products', '/conteudos': '/en/content',
    '/conteudo-detalhe': '/en/content/article', '/sobre': '/en/about',
    '/contactos': '/en/contacts', '/inscricao': '/en/join', '/faq': '/en/faq',
    '/em-breve': '/en/coming-soon', '/privacidade': '/en/privacy',
    '/termos': '/en/terms', '/cookies': '/en/cookies'
  };
  var REVERSE = {};
  Object.keys(ROUTES).forEach(function (pt) { REVERSE[ROUTES[pt]] = pt; });
  REVERSE['/en'] = '/';

  var path = location.pathname.replace(/\/$/, '') || '/';
  if (location.pathname === '/en/') path = '/en/';
  var english = path === '/en' || path === '/en/' || path.indexOf('/en/') === 0;
  var ptPath = english ? (REVERSE[path] || '/') : path;
  var enPath = ROUTES[ptPath] || '/en/';
  document.documentElement.lang = english ? 'en' : 'pt-PT';
  document.documentElement.setAttribute('data-locale', english ? 'en' : 'pt');

  var SEO = {
    '/': ['BEST GYM | 24-hour gyms in Portugal', 'Train 24 hours a day with premium facilities, freedom and support at BEST GYM.'],
    '/campanha': ['Campaign | BEST GYM', 'Discover the current BEST GYM campaign and choose your gym.'],
    '/unidades': ['Gyms | BEST GYM', 'Explore BEST GYM locations in Valongo and Vila Nova de Famalicão, with São João da Madeira coming soon.'],
    '/unidade-valongo': ['BEST GYM Valongo | 24-hour gym', 'Train 24 hours a day at BEST GYM Valongo.'],
    '/unidade-famalicao': ['BEST GYM Famalicão | 24-hour gym', 'Train 24 hours a day at BEST GYM Vila Nova de Famalicão.'],
    '/built-by-best': ['Built By Best | BEST GYM', 'Structured coaching, planning and monitoring to train with direction.'],
    '/franchising': ['Franchising | BEST GYM', 'Discover the opportunity to grow with the BEST GYM network in Portugal.'],
    '/produtos': ['Products | BEST GYM', 'Explore the BEST GYM product collection available at our gyms.'],
    '/conteudos': ['Content | BEST GYM', 'Training, performance and recovery content from BEST GYM.'],
    '/conteudo-detalhe': ['Article | BEST GYM', 'Training and performance insights from BEST GYM.'],
    '/sobre': ['About | BEST GYM', 'Discover the culture, ambition and 24-hour model behind BEST GYM.'],
    '/contactos': ['Contacts | BEST GYM', 'Contact the BEST GYM team in Valongo or Vila Nova de Famalicão.'],
    '/inscricao': ['Join | BEST GYM', 'Choose your BEST GYM location and continue to the official registration platform.'],
    '/faq': ['FAQ | BEST GYM', 'Answers about BEST GYM locations, access, registration and support.'],
    '/em-breve': ['São João da Madeira | BEST GYM', 'Follow the arrival of BEST GYM in São João da Madeira.'],
    '/privacidade': ['Privacy Policy | BEST GYM', 'Read the BEST GYM privacy information.'],
    '/termos': ['Terms and Conditions | BEST GYM', 'Read the BEST GYM website terms and conditions.'],
    '/cookies': ['Cookie Policy | BEST GYM', 'Learn how cookies are used on the BEST GYM website.']
  };

  var T = {
    'Início': 'Home', 'Unidades': 'Gyms', 'Produtos': 'Products', 'Conteúdos': 'Content',
    'Sobre': 'About', 'Contactos': 'Contacts', 'Inscrição': 'Join', 'Apoio': 'Support',
    'Navegação': 'Navigation', 'Perguntas frequentes': 'Frequently asked questions',
    'Campanha ativa': 'Current campaign', 'Privacidade': 'Privacy',
    'Termos e Condições': 'Terms and Conditions', 'Todos os direitos reservados.': 'All rights reserved.',
    'Nova unidade': 'New gym', 'Abertura a anunciar': 'Opening date to be announced',
    'Quero ser avisado →': 'Keep me updated →', 'Saber mais': 'Learn more',
    'São João da Madeira · em breve': 'São João da Madeira · coming soon',
    'Nova unidade · São João da Madeira abre em breve': 'New gym · São João da Madeira coming soon',
    'Abrir menu': 'Open menu', 'Fechar menu': 'Close menu', 'Menu completo': 'Full menu',
    'Navegação principal': 'Main navigation', 'Aspeto': 'Appearance', 'Claro': 'Light', 'Escuro': 'Dark',
    'Mudar para modo claro': 'Switch to light mode', 'Mudar para modo escuro': 'Switch to dark mode',
    'Inscreve-te': 'Join now', 'Inscreve-te agora': 'Join now', 'ADERIR AGORA →': 'JOIN NOW →',
    'Aderir agora →': 'Join now →', 'Escolhe a tua unidade': 'Choose your gym',
    'Fala connosco': 'Contact us', 'Falar connosco →': 'Contact us →',
    'Ver localização →': 'View location →', 'Abrir no mapa →': 'Open map →',
    'Ver todas as perguntas →': 'View all questions →', 'Ver FAQ →': 'View FAQ →',
    'Campanha do mês': 'Current campaign', 'Campanha de setembro': 'September campaign',
    '50% de desconto por mês até 2027 + inscrição grátis': '50% off each month until 2027 + free registration',
    '50% de desconto por mês até 2027': '50% off each month until 2027',
    'inscrição grátis': 'free registration', 'vagas limitadas': 'limited availability',
    'Desconto': 'Discount', 'Condição válida': 'Valid until', 'Grátis': 'Free',
    'Performance todos os dias. Uma rede 24 horas preparada para a tua evolução.': 'Performance every day. A 24-hour network built around your progress.',
    'Aberto': 'Open', 'dias': 'days', 'Em breve': 'Coming soon',
    'PERFORMANCE TODOS OS DIAS.': 'PERFORMANCE EVERY DAY.',
    'A TUA EVOLUÇÃO NÃO TEM HORÁRIO.': 'YOUR PROGRESS HAS NO SCHEDULE.',
    'NÃO VENDEMOS MUSCULAÇÃO.': 'WE DO NOT SELL WORKOUTS.',
    'VENDEMOS PERFORMANCE.': 'WE BUILD PERFORMANCE.',
    'Treina quando quiseres. Evolui todos os dias.': 'Train when it works for you. Progress every day.',
    'DOIS GINÁSIOS ABERTOS.': 'TWO GYMS OPEN.', 'UM TERCEIRO A CAMINHO.': 'A THIRD ON THE WAY.',
    'Dois ginásios. Um terceiro a caminho.': 'Two gyms. A third on the way.',
    'DOIS GINÁSIOS. UM TERCEIRO A CAMINHO.': 'TWO GYMS. A THIRD ON THE WAY.',
    'Acesso 24 horas, estrutura completa e uma comunidade focada em evolução.': '24-hour access, complete facilities and a community focused on progress.',
    'O ESSENCIAL PARA EVOLUÍRES': 'EVERYTHING YOU NEED TO PROGRESS',
    'TUDO O QUE PRECISAS PARA EVOLUIR.': 'EVERYTHING YOU NEED TO PROGRESS.',
    'MAIS FORTES JUNTOS.': 'STRONGER TOGETHER.',
    'LEVA O BEST GYM CONTIGO.': 'TAKE BEST GYM WITH YOU.',
    'TREINO, PERFORMANCE E COMUNIDADE': 'TRAINING, PERFORMANCE AND COMMUNITY',
    'PRONTO PARA COMEÇAR?': 'READY TO START?',
    'Escolhe a unidade, consulta a campanha ativa e começa a treinar com liberdade.': 'Choose your gym, check the current campaign and start training on your terms.',
    'Conhecer o BEST GYM →': 'Discover BEST GYM →',
    'São João da Madeira está a caminho': 'São João da Madeira is on the way',
    'Treino Funcional': 'Functional Training', 'Peso Livre': 'Free Weights',
    'Aulas': 'Classes', 'Acompanhamento': 'Coaching', 'Comunidade': 'Community',
    'Consistência': 'Consistency', 'Liberdade': 'Freedom', 'Método': 'Method',
    'FÉRIAS OFF. GYM ON.': 'HOLIDAY MODE OFF. GYM MODE ON.',
    'Este setembro, ativa o modo treino no BEST GYM.': 'This September, switch training mode on at BEST GYM.',
    'Este setembro, aproveita 50% de desconto por mês até 2027, inscrição grátis e vagas limitadas.': 'This September, get 50% off each month until 2027, free registration and limited availability.',
    'DO PRIMEIRO PASSO AO GYM ON.': 'FROM THE FIRST STEP TO GYM MODE ON.',
    'ESCOLHE O GINÁSIO': 'CHOOSE YOUR GYM', 'ATIVA A CAMPANHA': 'ACTIVATE THE CAMPAIGN',
    'COMEÇA A TREINAR': 'START TRAINING', 'PRONTO PARA APROVEITAR?': 'READY TO GET STARTED?',
    'BEST GYM VALONGO': 'BEST GYM VALONGO', 'BEST GYM FAMALICÃO': 'BEST GYM FAMALICÃO',
    'Treina 24 horas, com estrutura, liberdade e uma equipa próxima.': 'Train 24 hours a day with quality facilities, freedom and a team close by.',
    'Uma estrutura completa para transformar consistência em performance.': 'Complete facilities that turn consistency into performance.',
    'PERFORMANCE NO CENTRO DE VALONGO.': 'PERFORMANCE IN THE HEART OF VALONGO.',
    'PERFORMANCE EM VILA NOVA DE FAMALICÃO.': 'PERFORMANCE IN VILA NOVA DE FAMALICÃO.',
    'ÁREAS DE TREINO': 'TRAINING AREAS', 'ENTRA E TREINA QUANDO QUISERES.': 'COME IN AND TRAIN ON YOUR SCHEDULE.',
    'GALERIA': 'GALLERY', 'COMEÇA A TREINAR EM VALONGO HOJE.': 'START TRAINING IN VALONGO TODAY.',
    'COMEÇA A TREINAR EM FAMALICÃO HOJE.': 'START TRAINING IN FAMALICÃO TODAY.',
    'NÃO É APENAS UM PLANO DE TREINO.': 'MORE THAN A TRAINING PLAN.',
    'QUATRO FASES, UM OBJETIVO': 'FOUR STAGES. ONE GOAL.',
    'TUDO O QUE GANHAS COM MÉTODO.': 'WHAT STRUCTURE ADDS TO YOUR TRAINING.',
    'EXECUÇÃO COM DIREÇÃO': 'TRAIN WITH DIRECTION',
    'HISTÓRIAS REAIS, APROVADAS PRIMEIRO': 'REAL STORIES, APPROVED FIRST',
    'COMEÇA A CONSTRUIR A TUA MELHOR VERSÃO.': 'BUILD CONSISTENT PROGRESS.',
    'Treino com direção. Acompanhamento com método.': 'Train with direction. Progress with structure.',
    'Avaliação': 'Assessment', 'Planeamento': 'Planning', 'Execução': 'Training', 'Monitorização': 'Monitoring',
    'MAIS DO QUE UM GINÁSIO.': 'MORE THAN A GYM.', 'FEITA PARA CRESCER.': 'BUILT TO GROW.',
    'O QUE NOS MOVE': 'WHAT DRIVES US', 'UMA AMBIÇÃO NACIONAL.': 'A NATIONAL AMBITION.',
    'FAZ PARTE DESTA CULTURA.': 'BE PART OF THE CULTURE.',
    'O BEST GYM é uma rede 24 horas criada para tornar a performance acessível todos os dias.': 'BEST GYM is a 24-hour network built to make performance accessible every day.',
    'FALA COM O BEST GYM.': 'CONTACT BEST GYM.',
    'A nossa equipa está disponível para esclarecer dúvidas sobre unidades, inscrição e serviços.': 'Our team can help with questions about our gyms, registration and services.',
    'Nome': 'Name', 'Telefone': 'Phone', 'Unidade': 'Gym', 'Assunto': 'Subject', 'Mensagem': 'Message',
    'Escolhe a unidade': 'Choose a gym', 'Escolhe o assunto': 'Choose a subject', 'Outro': 'Other',
    'Enviar mensagem': 'Send message', 'Li e aceito a Política de Privacidade.': 'I have read and accept the Privacy Policy.',
    'COMEÇA HOJE.': 'START TODAY.', 'Escolhe a tua unidade e consulta as condições disponíveis.': 'Choose your gym and view the available options.',
    'A inscrição continua na plataforma oficial.': 'Registration continues on the official platform.',
    'TENS DÚVIDAS?': 'HAVE QUESTIONS?',
    'Respostas rápidas sobre inscrição, horários, unidades, Built By Best e funcionamento do BEST GYM.': 'Clear answers about registration, access, gyms, Built By Best and how BEST GYM works.',
    'POLÍTICA DE PRIVACIDADE': 'PRIVACY POLICY', 'TERMOS E CONDIÇÕES': 'TERMS AND CONDITIONS',
    'POLÍTICA DE COOKIES': 'COOKIE POLICY', 'Última atualização:': 'Last updated:',
    'RESPONSÁVEL PELO TRATAMENTO': 'DATA CONTROLLER', 'DADOS QUE RECOLHEMOS': 'DATA WE COLLECT',
    'FINALIDADES DO TRATAMENTO': 'PURPOSES OF PROCESSING', 'OS TEUS DIREITOS': 'YOUR RIGHTS',
    'COMO NOS CONTACTAR': 'HOW TO CONTACT US', 'OBJETO': 'SCOPE', 'INSCRIÇÕES': 'REGISTRATION',
    'ACESSO 24 HORAS': '24-HOUR ACCESS', 'CAMPANHAS E PROMOÇÕES': 'CAMPAIGNS AND PROMOTIONS',
    'LIMITAÇÃO DE RESPONSABILIDADE': 'LIMITATION OF LIABILITY', 'O QUE SÃO COOKIES': 'WHAT COOKIES ARE',
    'TIPOS DE COOKIES UTILIZADOS': 'TYPES OF COOKIES USED', 'GERIR AS TUAS PREFERÊNCIAS': 'MANAGE YOUR PREFERENCES',
    'Essenciais': 'Essential', 'Sempre ativos': 'Always active', 'Análise': 'Analytics',
    'Estatísticas de utilização': 'Usage statistics', 'Marketing': 'Marketing',
    'Comunicação e campanhas': 'Communications and campaigns', 'Guardar preferências': 'Save preferences'
  };

  Object.assign(T, {
    '© 2026 Best Gym. Todos os direitos reservados.': '© 2026 BEST GYM. All rights reserved.',
    'Programa de performance': 'Performance programme', 'Conhecer o programa': 'Discover the programme',
    'Treino com direção. Acompanhamento com método. Evolução com resultados.': 'Train with direction. Structured coaching. Measurable progress.',
    'A tua evolução': 'Your progress', 'não tem horário.': 'has no schedule.',
    'Aberto 24 horas por dia, 7 dias por semana, 365 dias por ano.': 'Open 24 hours a day, 7 days a week, 365 days a year.',
    'Descobrir as unidades': 'Explore our gyms', 'Não vendemos musculação.': 'We do not sell workouts.',
    'Evolução': 'Progress', 'Encontrar uma unidade': 'Find a gym', 'todos os dias.': 'every day.',
    'O BEST GYM foi criado para quem leva a evolução a sério. Liberdade para treinar 24 horas, equipamento preparado para diferentes objetivos e uma comunidade que transforma consistência em resultados.': 'BEST GYM was created for people who take progress seriously: 24-hour training, equipment for different goals and a community that turns consistency into results.',
    'Horas por dia': 'Hours a day', 'Dias por ano': 'Days a year',
    'Este setembro, ativa o modo treino: 50% de desconto por mês até 2027, inscrição grátis e vagas limitadas.': 'This September, switch training mode on: 50% off each month until 2027, free registration and limited availability.',
    'O essencial para': 'Everything you need to',
    'Treina no teu horário, todos os dias do ano. O acesso é autónomo, pessoal e seguro — a tua evolução não espera pelo horário de ninguém.': 'Train on your schedule, every day of the year. Access is independent, personal and secure — your progress does not wait for anyone.',
    'Peso livre, cardio, cross training e treino funcional — zonas preparadas para treino de força, intensidade e evolução.': 'Free weights, cardio, cross training and functional training — areas designed for strength, intensity and progress.',
    'Um ambiente próximo, motivador e focado. Treinar acompanhado transforma consistência em resultados.': 'A welcoming, motivating and focused environment. Training together turns consistency into results.',
    'Método e consistência orientados para resultados mensuráveis — dentro e fora do ginásio.': 'Structure and consistency focused on measurable results — inside and outside the gym.',
    'Um terceiro a caminho.': 'A third on the way.',
    'Escolhe o ginásio mais próximo e conhece a estrutura preparada para a tua evolução.': 'Choose your nearest gym and discover facilities designed for your progress.',
    'O BEST GYM continua a crescer —': 'BEST GYM continues to grow —',
    'Treino 24 horas, estrutura moderna e uma comunidade ativa no centro de Valongo.': '24-hour training, modern facilities and an active community in central Valongo.',
    'Conhecer unidade': 'Explore this gym',
    'Um espaço completo para treinar com liberdade, intensidade e acompanhamento.': 'Complete facilities for training with freedom, intensity and support.',
    'Tudo o que precisas': 'Everything you need', 'para': 'to', 'Preparação': 'Preparation',
    'Racks, barras e halteres para treino de força com liberdade total.': 'Racks, bars and dumbbells for strength training with complete freedom.',
    'Passadeiras, bicicletas, remos e elípticas para capacidade aeróbica.': 'Treadmills, bikes, rowing machines and ellipticals for cardiovascular fitness.',
    'Espaço funcional para alta intensidade e trabalho de corpo inteiro.': 'A functional area for high-intensity and full-body training.',
    'Circuitos orientados para condicionamento, intensidade e trabalho de corpo inteiro.': 'Circuits focused on conditioning, intensity and full-body training.',
    'Sala dedicada a posing e preparação de palco.': 'A dedicated posing and stage-preparation room.',
    'Acompanhamento individual com planeamento contínuo.': 'Individual coaching with ongoing planning.',
    'Um programa de acompanhamento para quem quer transformar objetivos em evolução mensurável. Planeamento, execução, acompanhamento e ajustes consistentes.': 'A coaching programme for turning goals into measurable progress, with planning, execution, monitoring and consistent adjustments.',
    'Avaliação e planeamento adaptado': 'Assessment and tailored planning', 'Execução com vídeos de apoio': 'Technique supported by video',
    'Monitorização e ajustes regulares': 'Regular monitoring and adjustments', 'Mais fortes': 'Stronger',
    'Leva o BEST GYM': 'Take BEST GYM with you', 'Treino, performance': 'Training, performance', 'e comunidade': 'and community',
    'Ver todos →': 'View all →', 'Treino': 'Training', 'Pronto para começar? · Pronto para começar? ·': 'Ready to start? · Ready to start? ·',
    'Falar com a equipa': 'Talk to the team', 'Conteúdos relacionados': 'Related content',
    '← Voltar aos conteúdos': '← Back to content', '10 Julho 2026 · 6 min de leitura': '10 July 2026 · 6 min read',
    'Como estruturar a tua': 'How to structure your', 'semana de treino': 'training week',
    'Princípios simples para organizar sessões, recuperação e progressão — sem planos impossíveis de cumprir.': 'Simple principles for organising sessions, recovery and progress — without impossible plans.',
    'A pergunta mais comum de quem começa — ou recomeça — é sempre a mesma: quantas vezes devo treinar por semana? A resposta certa é a que consegues cumprir de forma consistente durante meses, não a mais ambiciosa.': 'The most common question when starting — or starting again — is how often to train. The right answer is the schedule you can sustain for months, not the most ambitious one.',
    'Começa pela frequência realista': 'Start with a realistic frequency',
    'Três sessões bem executadas valem mais do que seis planeadas e duas cumpridas. Define primeiro os dias em que o treino cabe de facto na tua vida — com o acesso 24 horas, o horário deixa de ser desculpa.': 'Three well-executed sessions are worth more than six planned and only two completed. Choose the days that genuinely fit your life — with 24-hour access, scheduling is no longer a barrier.',
    'A consistência ganha sempre ao plano perfeito.': 'Consistency always beats the perfect plan.', 'Distribui o estímulo': 'Distribute the training stimulus',
    'Alterna grupos musculares e intensidades ao longo da semana. Junta uma sessão mais leve de cardio ou mobilidade entre os treinos de força — a recuperação faz parte do progresso, não é tempo perdido.': 'Alternate muscle groups and intensity throughout the week. Add a lighter cardio or mobility session between strength workouts — recovery is part of progress, not wasted time.',
    'Equipa do BEST GYM': 'BEST GYM team', 'Conteúdo de treino · revisto pela equipa técnica': 'Training content · reviewed by the technical team',
    'Mais do que': 'More than', 'um ginásio.': 'a gym.', 'Feita para': 'Built to', 'O que nos move': 'What drives us', 'Uma ambição': 'One ambition',
    'O BEST GYM é uma rede 24 horas criada para tornar a performance mais acessível, consistente e próxima.': 'BEST GYM is a 24-hour gym network created to make performance more accessible, consistent and personal.',
    'O BEST GYM nasceu com uma convicção simples: a evolução não tem horário. Começámos em Valongo e Vila Nova de Famalicão com um modelo de acesso 24 horas, estrutura completa e uma comunidade próxima — e estamos preparados para levar esta cultura a mais cidades em Portugal.': 'BEST GYM began with a simple belief: progress has no schedule. We started in Valongo and Vila Nova de Famalicão with 24-hour access, complete facilities and a close community — and we are ready to bring this culture to more Portuguese cities.',
    'Criar condições para que mais pessoas treinem com liberdade, consistência e propósito.': 'Create the conditions for more people to train with freedom, consistency and purpose.',
    'Tornar o BEST GYM uma referência nacional de performance, comunidade e experiência 24 horas.': 'Make BEST GYM a national benchmark for performance, community and the 24-hour experience.',
    'Dois ginásios ativos, um terceiro a caminho e uma cultura comum preparada para expansão, patrocínios e novas localizações. A comunidade do BEST GYM cresce todos os dias — dentro e fora do ginásio.': 'Two active gyms, a third on the way and a shared culture ready for expansion, partnerships and new locations. The BEST GYM community grows every day — inside and outside the gym.',
    'Ver as unidades': 'View our gyms', 'Fala com o': 'Talk to',
    'A nossa equipa está disponível para esclarecer dúvidas sobre unidades, inscrições, Built By Best e produtos.': 'Our team is available to answer questions about our gyms, registration, Built By Best and products.',
    'O acesso às unidades é autónomo. Para visitas guiadas, contacta a equipa da unidade.': 'Gym access is independent. For guided visits, contact the team at your chosen gym.',
    'Envia-nos uma mensagem': 'Send us a message', 'Unidade *': 'Gym *', 'Li e aceito a': 'I have read and accept the',
    'Política de Privacidade': 'Privacy Policy', 'Destino do formulário: Valongo → valongo@bestgym.pt · Famalicão → famalicao@bestgym.pt.': 'Form destination: Valongo → valongo@bestgym.pt · Famalicão → famalicao@bestgym.pt.',
    'Começa': 'Start', 'Escolhe a tua unidade e consulta as condições disponíveis. A inscrição é concluída na plataforma oficial.': 'Choose your gym and view the available options. Registration is completed on the official platform.',
    'Não fiques de fora. Condições e termos apresentados na plataforma oficial de inscrição.': 'Do not miss out. Conditions and terms are shown on the official registration platform.',
    'Estrutura completa de treino': 'Complete training facilities', 'Comunidade e acompanhamento': 'Community and support', 'Sem burocracia — inscrição online': 'No paperwork — register online',
    'Escolhe primeiro a tua unidade': 'Choose your gym first', 'Dúvidas antes de te inscreveres?': 'Questions before joining?'
  });
  Object.assign(T, {
    'Respostas rápidas sobre inscrição, horários, unidades, Built By Best e produtos. Não encontras o que procuras?': 'Clear answers about registration, access, gyms, Built By Best and products. Cannot find what you need?',
    'Como posso inscrever-me?': 'How can I join?', 'Posso escolher a unidade?': 'Can I choose my gym?',
    'A inscrição é feita online, na plataforma oficial. Escolhe a unidade, consulta as condições e conclui o processo em poucos minutos.': 'Registration is completed online on the official platform. Choose your gym, view the conditions and finish in a few minutes.',
    'Sim. Durante a inscrição escolhes Valongo ou Vila Nova de Famalicão.': 'Yes. During registration, choose Valongo or Vila Nova de Famalicão.',
    'Sim — a campanha atual oferece 50% de desconto por mês até 2027, inscrição grátis e vagas limitadas. Consulta as condições na página da campanha.': 'Yes — the current campaign offers 50% off each month until 2027, free registration and limited availability. View the conditions on the campaign page.',
    'O ginásio está aberto 24 horas?': 'Is the gym open 24 hours?', 'Como funciona o acesso?': 'How does access work?',
    'Sim. Os ginásios ativos do BEST GYM funcionam 24 horas por dia, 7 dias por semana, 365 dias por ano.': 'Yes. Active BEST GYM locations are open 24 hours a day, 7 days a week, 365 days a year.',
    'O acesso é autónomo e pessoal. Depois da inscrição recebes o teu meio de acesso e entras a qualquer hora.': 'Access is independent and personal. After registration, you receive your access credential and can enter at any time.',
    'Que áreas de treino existem?': 'What training areas are available?', 'Existem duches?': 'Are showers available?', 'Como posso visitar a unidade?': 'How can I visit a gym?',
    'Sim, ambas as unidades dispõem de balneários com duches.': 'Yes, both gyms have changing rooms with showers.',
    'Contacta a unidade por telefone ou email e agenda uma visita com a equipa.': 'Contact the gym by phone or email to arrange a visit with the team.',
    'O que inclui o programa?': 'What does the programme include?', 'Como posso pedir informações?': 'How can I request information?',
    'Avaliação, planeamento adaptado, vídeos de execução, monitorização de progresso e ajustes regulares com contacto próximo.': 'Assessment, tailored planning, technique videos, progress monitoring and regular adjustments with close contact.',
    'Os produtos do BEST GYM estão disponíveis diretamente nas unidades de Valongo e Famalicão.': 'BEST GYM products are available directly at the Valongo and Famalicão gyms.',
    'De momento não. O catálogo online serve para consulta — a compra é feita na unidade.': 'Not at present. The online catalogue is for reference — purchases are made at the gym.',
    'Ainda com dúvidas? A equipa responde-te rapidamente.': 'Still have questions? Our team will respond quickly.',
    'Política de': 'Policy', 'Termos e': 'Terms and', 'Última atualização: modelo inicial · a confirmar antes da publicação': 'Last updated: initial draft · to be confirmed before publication',
    'este texto é um modelo de trabalho para efeitos de design e estrutura. Deve ser revisto e aprovado por assessoria jurídica antes de qualquer publicação.': 'this is a working draft for design and structure purposes. It must be reviewed and approved by legal counsel before publication.',
    'este texto é um modelo de trabalho para efeitos de design e estrutura. A lista de cookies deve ser confirmada tecnicamente e revista juridicamente antes da publicação.': 'this is a working draft for design and structure purposes. The cookie list must be technically confirmed and legally reviewed before publication.',
    'Os teus direitos': 'Your rights', '2. Dados que recolhemos': '2. Data we collect', '3. Finalidades do tratamento': '3. Purposes of processing', '4. Os teus direitos': '4. Your rights', '5. Como nos contactar': '5. How to contact us',
    'O BEST GYM é responsável pelo tratamento dos dados pessoais recolhidos através deste site e dos processos de inscrição e contacto.': 'BEST GYM is responsible for processing personal data collected through this website and its registration and contact processes.',
    'Podemos recolher os dados que nos forneces diretamente, nomeadamente:': 'We may collect data you provide directly, including:',
    'Nome, email e telefone através dos formulários de contacto e de interesse.': 'Name, email and phone number through contact and interest forms.',
    'Unidade e assunto selecionados nos pedidos.': 'The gym and subject selected in requests.', 'Dados técnicos de navegação, quando aplicável, através de cookies.': 'Technical browsing data, where applicable, through cookies.',
    'Os dados são utilizados para responder aos teus pedidos, gerir inscrições, comunicar novidades e campanhas quando autorizado, e melhorar a experiência do site.': 'Data is used to answer requests, manage registrations, communicate news and campaigns where authorised, and improve the website experience.',
    'Tens direito a aceder, retificar, apagar e limitar o tratamento dos teus dados, bem como a opor-te ao seu tratamento e a solicitar a portabilidade, nos termos da legislação aplicável (RGPD).': 'You have the right to access, rectify, erase and restrict the processing of your data, object to processing and request portability under applicable law (GDPR).',
    'Para exercer os teus direitos ou esclarecer dúvidas sobre privacidade, contacta-nos através de': 'To exercise your rights or ask privacy questions, contact us via', 'ou da página de': 'or the',
    'Os presentes termos regulam a utilização do site do BEST GYM e o acesso aos serviços de inscrição, contacto e informação sobre as unidades e programas.': 'These terms govern use of the BEST GYM website and access to registration, contact and information about gyms and programmes.',
    'As inscrições são concluídas na plataforma oficial. As condições comerciais aplicáveis, incluindo mensalidades e campanhas, são apresentadas nesse processo e podem estar sujeitas a alterações.': 'Registrations are completed on the official platform. Applicable commercial conditions, including fees and campaigns, are presented there and may change.',
    'O acesso às unidades é pessoal e intransmissível, disponível 24 horas por dia, 365 dias por ano. O utilizador compromete-se a respeitar as regras de utilização e segurança das instalações.': 'Gym access is personal and non-transferable, available 24 hours a day, 365 days a year. Users must follow facility use and safety rules.',
    'O meio de acesso é individual e não deve ser partilhado.': 'Access credentials are individual and must not be shared.', 'O incumprimento das regras pode originar a suspensão do acesso.': 'Failure to follow the rules may result in access being suspended.',
    '4. Campanhas e promoções': '4. Campaigns and promotions', '5. Limitação de responsabilidade': '5. Limitation of liability',
    'As campanhas têm caráter temporário e regem-se por termos específicos apresentados na plataforma de inscrição. Nenhuma informação neste site constitui uma proposta contratual vinculativa de preço.': 'Campaigns are temporary and governed by specific terms shown on the registration platform. No information on this website constitutes a binding contractual price offer.',
    'O BEST GYM procura manter a informação atualizada, mas não garante a ausência de erros ou interrupções. Para dúvidas contacta-nos através da página de': 'BEST GYM aims to keep information current but cannot guarantee the absence of errors or interruptions. For questions, contact us through the',
    'O que são': 'What are', '1. O que são cookies': '1. What cookies are', '2. Tipos de cookies utilizados': '2. Types of cookies used', '3. Gerir as tuas preferências': '3. Manage your preferences',
    'Cookies são pequenos ficheiros guardados no teu dispositivo que permitem o funcionamento do site e ajudam a melhorar a experiência de navegação.': 'Cookies are small files stored on your device that enable the website to work and help improve the browsing experience.',
    'Necessários ao funcionamento do site. Estão sempre ativos.': 'Required for the website to function. They are always active.', 'Ajudam a perceber como o site é utilizado, de forma agregada.': 'Help us understand how the website is used in aggregate.', 'Utilizados para comunicação e campanhas, apenas com consentimento.': 'Used for communications and campaigns only with consent.',
    'Podes ativar ou desativar as categorias não essenciais em baixo. Este painel é uma demonstração de interface — a ligação a um gestor de consentimento real será feita antes da publicação.': 'You can enable or disable non-essential categories below. This panel demonstrates the interface — it must be connected to a real consent manager before publication.',
    'Termos e Condições →': 'Terms and Conditions →', 'Política de Cookies →': 'Cookie Policy →', 'Política de Privacidade →': 'Privacy Policy →'
  });
  Object.assign(T, {
    'Volta das férias com uma condição especial para começar. Escolhe o teu ginásio, faz a inscrição e aproveita a campanha enquanto houver vagas disponíveis.': 'Return from the holidays with a special offer to get started. Choose your gym, register and enjoy the campaign while places remain.',
    'Escolhe o ginásio': 'Choose your gym', 'Escolhe Valongo ou Vila Nova de Famalicão e segue para a inscrição.': 'Choose Valongo or Vila Nova de Famalicão and continue to registration.',
    'Entra e treina': 'Come in and train', 'Faz a tua inscrição e escolhe a unidade de Valongo.': 'Register and choose the Valongo gym.', 'Faz a tua inscrição e escolhe a unidade de Famalicão.': 'Register and choose the Famalicão gym.',
    'Treina a qualquer hora, todos os dias do ano — sem exceções.': 'Train at any time, every day of the year — without exceptions.',
    'A inscrição é feita online na plataforma oficial — escolhe a unidade de Valongo durante o processo.': 'Registration is completed online on the official platform — choose the Valongo gym during the process.',
    'A inscrição é feita online na plataforma oficial — escolhe a unidade de Famalicão durante o processo.': 'Registration is completed online on the official platform — choose the Famalicão gym during the process.'
  });

  function setMeta() {
    var data = SEO[ptPath] || SEO['/'];
    var title = english ? data[0] : document.title;
    if (english) document.title = title;
    var desc = document.querySelector('meta[name="description"]');
    if (!desc) { desc = document.createElement('meta'); desc.name = 'description'; document.head.appendChild(desc); }
    if (english) desc.content = data[1];
    var canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.rel = 'canonical'; canonical.href = BASE + (english ? enPath : ptPath); document.head.appendChild(canonical);
    document.querySelectorAll('link[hreflang]').forEach(function (el) { el.remove(); });
    [['pt-PT', ptPath], ['en', enPath], ['x-default', ptPath]].forEach(function (item) {
      var link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = item[0]; link.href = BASE + item[1]; document.head.appendChild(link);
    });
    var og = document.querySelector('meta[property="og:locale"]') || document.createElement('meta');
    og.setAttribute('property', 'og:locale'); og.content = english ? 'en_GB' : 'pt_PT'; document.head.appendChild(og);
  }

  function translateText(value) {
    var lead = value.match(/^\s*/)[0], tail = value.match(/\s*$/)[0], core = value.trim();
    if (!core) return value;
    var direct = T[core];
    if (direct) return lead + direct + tail;
    var numbered = core.match(/^(\d+\.\s*)(.+)$/);
    if (numbered && T[numbered[2]]) return lead + numbered[1] + T[numbered[2]] + tail;
    var translated = core;
    Object.keys(T).sort(function (a, b) { return b.length - a.length; }).forEach(function (source) {
      if (source.length >= 8 && translated.indexOf(source) !== -1) translated = translated.split(source).join(T[source]);
    });
    return translated === core ? value : lead + translated + tail;
  }

  function localizeLinks(root) {
    root.querySelectorAll('a[href^="/"]:not([data-bg-language-link])').forEach(function (a) {
      var href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
      if (english && ROUTES[href] && a.getAttribute('href') !== ROUTES[href]) a.setAttribute('href', ROUTES[href]);
    });
  }

  function translate(root) {
    if (!english || !root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement || /^(SCRIPT|STYLE|TEXTAREA)$/.test(node.parentElement.tagName)) continue;
      nodes.push(node);
    }
    nodes.forEach(function (n) { var next = translateText(n.nodeValue); if (next !== n.nodeValue) n.nodeValue = next; });
    root.querySelectorAll('[aria-label],[title],[placeholder],img[alt]').forEach(function (el) {
      ['aria-label', 'title', 'placeholder', 'alt'].forEach(function (attr) {
        if (el.hasAttribute(attr)) el.setAttribute(attr, translateText(el.getAttribute(attr)));
      });
    });
    localizeLinks(root);
  }

  function addSwitchers() {
    var headerButton = document.querySelector('button[data-theme-toggle]');
    if (headerButton && headerButton.parentElement && !headerButton.parentElement.querySelector('[data-bg-language-switcher]')) {
      var wrap = document.createElement('nav');
      wrap.className = 'bg-language-switcher'; wrap.setAttribute('data-bg-language-switcher', ''); wrap.setAttribute('aria-label', english ? 'Language' : 'Idioma');
      wrap.innerHTML = '<a data-bg-language-link href="' + ptPath + '" lang="pt-PT"' + (!english ? ' aria-current="page"' : '') + '>PT</a><span aria-hidden="true">/</span><a data-bg-language-link href="' + enPath + '" lang="en"' + (english ? ' aria-current="page"' : '') + '>EN</a>';
      headerButton.parentElement.insertBefore(wrap, headerButton);
    }
    var drawer = document.querySelector('aside[aria-label="Menu"], aside[aria-label="Menu completo"], aside[aria-label="Full menu"]');
    if (drawer && !drawer.querySelector('[data-bg-language-switcher]')) {
      var inner = drawer.children[1];
      if (inner) {
        var mobile = document.createElement('nav'); mobile.className = 'bg-language-switcher bg-language-switcher--drawer'; mobile.setAttribute('data-bg-language-switcher', ''); mobile.setAttribute('aria-label', english ? 'Language' : 'Idioma');
        mobile.innerHTML = '<span>' + (english ? 'Language' : 'Idioma') + '</span><div><a data-bg-language-link href="' + ptPath + '" lang="pt-PT"' + (!english ? ' aria-current="page"' : '') + '>PT</a><span aria-hidden="true">/</span><a data-bg-language-link href="' + enPath + '" lang="en"' + (english ? ' aria-current="page"' : '') + '>EN</a></div>';
        inner.insertBefore(mobile, inner.children[1] || null);
      }
    }
  }

  function run() { translate(document.body); addSwitchers(); }
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('[data-bg-language-switcher] a[lang]');
    if (link) localStorage.setItem('bestgym-language', link.getAttribute('lang') === 'en' ? 'en' : 'pt-PT');
  });
  setMeta();
  if (document.body) run(); else document.addEventListener('DOMContentLoaded', run, { once: true });
  [400, 1200, 2600].forEach(function (delay) { setTimeout(run, delay); });
  var queued = false;
  new MutationObserver(function () {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; run(); });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });

  window.BGLocale = { language: english ? 'en' : 'pt-PT', ptPath: ptPath, enPath: enPath, routes: ROUTES };
})();
