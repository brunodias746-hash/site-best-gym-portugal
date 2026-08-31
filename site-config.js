/* BEST GYM — single source of truth for public origin, localized routes and SEO. */
(function (root) {
  'use strict';

  var origin = 'https://site-best-gym-portugal.vercel.app';
  var pages = {
    '/': { en: '/en/', pt: ['BEST GYM | Ginásios 24H em Portugal', 'O BEST GYM: treino 24 horas, performance e comunidade em Portugal.'], english: ['BEST GYM | 24-hour gyms in Portugal', 'Train 24 hours a day with premium facilities, freedom and support at BEST GYM.'] },
    '/campanha': { en: '/en/campaign', pt: ['Campanha | BEST GYM', 'Consulta a campanha ativa do BEST GYM e as condições apresentadas na plataforma oficial.'], english: ['Campaign | BEST GYM', 'Discover the current BEST GYM campaign and choose your gym.'] },
    '/unidades': { en: '/en/gyms', pt: ['Ginásios | BEST GYM', 'Conhece os ginásios do BEST GYM e a estrutura disponível para treinar 24 horas.'], english: ['Gyms | BEST GYM', 'Explore BEST GYM locations in Valongo and Vila Nova de Famalicão, with São João da Madeira coming soon.'] },
    '/unidade-valongo': { en: '/en/gyms/valongo', pt: ['BEST GYM Valongo | Ginásio 24H', 'Treina 24 horas no BEST GYM Valongo, com uma estrutura preparada para diferentes objetivos.'], english: ['BEST GYM Valongo | 24-hour gym', 'Train 24 hours a day at BEST GYM Valongo, with facilities designed for different goals.'] },
    '/unidade-famalicao': { en: '/en/gyms/famalicao', pt: ['BEST GYM Famalicão | Ginásio 24H', 'Treina 24 horas no BEST GYM Vila Nova de Famalicão, com uma estrutura completa.'], english: ['BEST GYM Famalicão | 24-hour gym', 'Train 24 hours a day at BEST GYM Vila Nova de Famalicão, with complete training facilities.'] },
    '/built-by-best': { en: '/en/built-by-best', pt: ['Built By Best | BEST GYM', 'Programa de acompanhamento do BEST GYM orientado para método, consistência e evolução.'], english: ['Built By Best | BEST GYM', 'Structured coaching, planning and monitoring to help you train with direction.'] },
    '/franchising': { en: '/en/franchising', pt: ['Franchising | BEST GYM', 'Conhece a oportunidade de franchising do BEST GYM e apresenta o teu projeto.'], english: ['Franchising | BEST GYM', 'Explore the opportunity to grow with the BEST GYM network in Portugal.'] },
    '/produtos': { en: '/en/products', pt: ['Produtos | BEST GYM', 'Consulta a coleção de produtos do BEST GYM disponível nos ginásios.'], english: ['Products | BEST GYM', 'Explore the BEST GYM product collection available at our gyms.'] },
    '/conteudos': { en: '/en/content', pt: ['Conteúdos | BEST GYM', 'Treino, performance, recuperação e comunidade no BEST GYM.'], english: ['Training content | BEST GYM', 'Training, performance, recovery and community content from BEST GYM.'] },
    '/conteudo-detalhe': { en: '/en/content/article', pt: ['Como estruturar a semana de treino | BEST GYM', 'Princípios simples para organizar treino, recuperação e progressão.'], english: ['How to structure your training week | BEST GYM', 'Simple principles for organising training, recovery and progress.'] },
    '/sobre': { en: '/en/about', pt: ['Sobre o BEST GYM', 'Conhece a cultura, a missão e a ambição nacional do BEST GYM.'], english: ['About BEST GYM', 'Discover the culture, mission and national ambition behind BEST GYM.'] },
    '/contactos': { en: '/en/contacts', pt: ['Contactos | BEST GYM', 'Contacta a equipa do BEST GYM de Valongo ou Vila Nova de Famalicão.'], english: ['Contact BEST GYM', 'Contact the BEST GYM team in Valongo or Vila Nova de Famalicão.'] },
    '/inscricao': { en: '/en/join', pt: ['Inscrição | BEST GYM', 'Escolhe o teu ginásio BEST GYM e continua para a plataforma oficial de inscrição.'], english: ['Join BEST GYM', 'Choose your BEST GYM location and continue to the official registration platform.'] },
    '/faq': { en: '/en/faq', pt: ['Perguntas frequentes | BEST GYM', 'Respostas sobre os ginásios, o acesso 24 horas, a inscrição e o apoio do BEST GYM.'], english: ['Frequently asked questions | BEST GYM', 'Answers about BEST GYM locations, 24-hour access, registration and support.'] },
    '/em-breve': { en: '/en/coming-soon', pt: ['São João da Madeira | BEST GYM', 'Acompanha a chegada do próximo ginásio BEST GYM a São João da Madeira.'], english: ['São João da Madeira | BEST GYM', 'Follow the arrival of the next BEST GYM location in São João da Madeira.'] },
    '/privacidade': { en: '/en/privacy', pt: ['Política de Privacidade | BEST GYM', 'Consulta a informação de privacidade do BEST GYM.'], english: ['Privacy Policy | BEST GYM', 'Read the BEST GYM privacy information.'] },
    '/termos': { en: '/en/terms', pt: ['Termos e Condições | BEST GYM', 'Consulta os termos e condições do site do BEST GYM.'], english: ['Terms and Conditions | BEST GYM', 'Read the BEST GYM website terms and conditions.'] },
    '/cookies': { en: '/en/cookies', pt: ['Política de Cookies | BEST GYM', 'Consulta como são utilizados cookies no site do BEST GYM.'], english: ['Cookie Policy | BEST GYM', 'Learn how cookies are used on the BEST GYM website.'] }
  };

  root.BGSiteConfig = Object.freeze({ origin: origin, pages: pages });
})(typeof globalThis !== 'undefined' ? globalThis : window);
