/* BEST GYM — single source of truth for public origin, localized routes and SEO. */
(function (root) {
  'use strict';

  var origin = 'https://site-best-gym-portugal.vercel.app';
  var pages = {
    '/': { en: '/en/', pt: ['BEST GYM | Ginásios 24H em Portugal', 'O BEST GYM: treino 24 horas, performance e comunidade em Portugal.'], english: ['BEST GYM | 24-hour gyms in Portugal', 'Train 24 hours a day with premium facilities, freedom and support at BEST GYM.'] },
    '/campanha': { en: '/en/campaign' },
    '/unidades': { en: '/en/gyms', pt: ['Ginásios | BEST GYM', 'Conhece os ginásios do BEST GYM e a estrutura disponível para treinar 24 horas.'], english: ['Gyms | BEST GYM', 'Explore BEST GYM locations in Vila Nova de Famalicão and Valongo, with São João da Madeira coming soon.'] },
    '/unidade-valongo': { en: '/en/gyms/valongo', pt: ['BEST GYM Valongo | Ginásio 24H', 'Treina 24 horas no BEST GYM Valongo, com uma estrutura preparada para diferentes objetivos.'], english: ['BEST GYM Valongo | 24-hour gym', 'Train 24 hours a day at BEST GYM Valongo, with facilities designed for different goals.'] },
    '/unidade-famalicao': { en: '/en/gyms/famalicao', pt: ['BEST GYM Famalicão | Ginásio 24H', 'Treina 24 horas no BEST GYM Vila Nova de Famalicão, com uma estrutura completa.'], english: ['BEST GYM Famalicão | 24-hour gym', 'Train 24 hours a day at BEST GYM Vila Nova de Famalicão, with complete training facilities.'] },
    '/built-by-best': { en: '/en/built-by-best', pt: ['Built By Best | Projeto para atletas do BEST GYM', 'Conhece o projeto para atletas que querem evoluir e representar o BEST GYM. Descobre o conceito e apresenta a tua candidatura.'], english: ['Built By Best | BEST GYM Athlete Project', 'Explore the project for athletes who want to develop and represent BEST GYM. Learn about the project and apply.'] },
    '/franchising': { en: '/en/franchising', pt: ['Franchising | BEST GYM', 'Conhece a oportunidade de franchising do BEST GYM e apresenta o teu projeto.'], english: ['Franchising | BEST GYM', 'Explore the opportunity to grow with the BEST GYM network in Portugal.'] },
    '/produtos': { en: '/en/products', pt: ['Produtos | BEST GYM', 'Consulta a coleção de produtos do BEST GYM disponível nos ginásios.'], english: ['Products | BEST GYM', 'Explore the BEST GYM product collection available at our gyms.'] },
    '/conteudos': { en: '/en/content', pt: ['Conteúdos | BEST GYM', 'Treino, performance, recuperação e comunidade no BEST GYM.'], english: ['Training content | BEST GYM', 'Training, performance, recovery and community content from BEST GYM.'] },
    '/conteudo-detalhe': { en: '/en/content/article', pt: ['Como estruturar a semana de treino | BEST GYM', 'Princípios simples para organizar treino, recuperação e progressão.'], english: ['How to structure your training week | BEST GYM', 'Simple principles for organising training, recovery and progress.'] },
    '/sobre': { en: '/en/about', pt: ['Sobre o BEST GYM', 'Conhece a cultura, a missão e a ambição nacional do BEST GYM.'], english: ['About BEST GYM', 'Discover the culture, mission and national ambition behind BEST GYM.'] },
    '/contactos': { en: '/en/contacts', pt: ['Contactos | BEST GYM', 'Contacta a equipa do BEST GYM de Vila Nova de Famalicão ou Valongo.'], english: ['Contact BEST GYM', 'Contact the BEST GYM team in Vila Nova de Famalicão or Valongo.'] },
    '/inscricao': { en: '/en/join', pt: ['Inscrição | BEST GYM', 'Escolhe o teu ginásio BEST GYM e continua para a plataforma oficial de inscrição.'], english: ['Join BEST GYM', 'Choose your BEST GYM location and continue to the official registration platform.'] },
    '/faq': { en: '/en/faq', pt: ['Perguntas frequentes | BEST GYM', 'Respostas sobre os ginásios, o acesso 24 horas, a inscrição e o apoio do BEST GYM.'], english: ['Frequently asked questions | BEST GYM', 'Answers about BEST GYM locations, 24-hour access, registration and support.'] },
    '/em-breve': { en: '/en/coming-soon', pt: ['São João da Madeira | BEST GYM', 'Acompanha a chegada do próximo ginásio BEST GYM a São João da Madeira.'], english: ['São João da Madeira | BEST GYM', 'Follow the arrival of the next BEST GYM location in São João da Madeira.'] },
    '/privacidade': { en: '/en/privacy', pt: ['Política de Privacidade | BEST GYM', 'Consulta a informação de privacidade do BEST GYM.'], english: ['Privacy Policy | BEST GYM', 'Read the BEST GYM privacy information.'] },
    '/termos': { en: '/en/terms', pt: ['Termos e Condições | BEST GYM', 'Consulta os termos e condições do site do BEST GYM.'], english: ['Terms and Conditions | BEST GYM', 'Read the BEST GYM website terms and conditions.'] },
    '/cookies': { en: '/en/cookies', pt: ['Política de Cookies | BEST GYM', 'Consulta como são utilizados cookies no site do BEST GYM.'], english: ['Cookie Policy | BEST GYM', 'Learn how cookies are used on the BEST GYM website.'] }
  };

  pages['/unidade-sao-joao-da-madeira'] = { en: '/en/gyms/sao-joao-da-madeira', pt: ['BEST GYM São João da Madeira | Em breve', 'O próximo ginásio 24H do BEST GYM fica na Rua Oliveira Júnior, n.º 630, 3700-008 São João da Madeira, Portugal. Entra na lista VIP.'], english: ['BEST GYM São João da Madeira | Coming soon', 'The upcoming 24-hour BEST GYM is at Rua Oliveira Júnior, n.º 630, 3700-008 São João da Madeira, Portugal. Join the VIP list.'] };
  pages['/lista-vip-sao-joao-da-madeira'] = { en: '/en/gyms/sao-joao-da-madeira/vip', pt: ['Lista VIP São João da Madeira | BEST GYM', 'Recebe as novidades da nova unidade BEST GYM de São João da Madeira e acede a condições exclusivas de pré-venda.'], english: ['São João da Madeira VIP List | BEST GYM', 'Get news about the upcoming BEST GYM São João da Madeira location and access exclusive pre-sale offers.'] };
  pages['/built-by-best/candidatura'] = { source: 'built-by-best-candidatura', en: '/en/built-by-best/apply', pt: ['Candidatura Built By Best | BEST GYM', 'Apresenta o teu percurso desportivo e os teus objetivos ao projeto para atletas Built By Best.'], english: ['Built By Best Application | BEST GYM', 'Share your athletic background and goals with the Built By Best athlete project.'] };
  pages['/personal-trainers/candidatura'] = { source: 'personal-trainers-candidatura', en: '/en/personal-trainers/apply', pt: ['Candidatura Personal Trainers | BEST GYM', 'Trabalha como Personal Trainer no BEST GYM de Famalicão e Valongo. Apresenta o teu perfil profissional.'], english: ['Personal Trainer Application | BEST GYM', 'Work as a Personal Trainer at BEST GYM Famalicão and Valongo. Tell us about your professional profile.'] };

  /* Monthly updates: change this object and artwork, then rebuild. */
  var campaign = {
    id: 'novembro-2026',
    artwork: null,
    mobileArtwork: null,
    pt: {
      label: 'Campanha de novembro', line1: 'Novembro é o mês', line2: 'de começar.', headline: 'Novembro é o mês de começar.',
      offer: '14,90€ por mês durante 4 meses + inscrição grátis',
      summary: 'Começa agora. Treina 24H.',
      price: '14,90€', priceLabel: 'Por mês', duration: '4 meses', durationLabel: 'Duração',
      registration: 'Grátis', registrationLabel: 'Inscrição', freeRegistration: 'Inscrição grátis',
      terms: 'Consulta todas as condições na receção do BEST GYM.',
      primaryLabel: 'Garante já o teu lugar', primaryHref: '/inscricao', secondaryLabel: 'Ver campanha', secondaryHref: '/campanha',
      activate: 'Confirma a campanha e os teus dados de adesão.'
    },
    en: {
      label: 'November campaign', line1: 'November is the month', line2: 'to start.', headline: 'November is the month to start.',
      offer: '€14.90 a month for 4 months + no joining fee',
      summary: 'Start now. Train 24/7.',
      price: '€14.90', priceLabel: 'Per month', duration: '4 months', durationLabel: 'Offer period',
      registration: 'Free', registrationLabel: 'Registration', freeRegistration: 'No joining fee',
      terms: 'Ask at BEST GYM reception for the full terms.',
      primaryLabel: 'Secure your place', primaryHref: '/en/join', secondaryLabel: 'View campaign', secondaryHref: '/en/campaign',
      activate: 'Confirm the campaign and your registration details.'
    }
  };
  function campaignSeo(copy) {
    return [copy.label + ' | BEST GYM', copy.headline + ' ' + copy.offer + '. ' + copy.terms];
  }
  pages['/campanha'].pt = campaignSeo(campaign.pt);
  pages['/campanha'].english = campaignSeo(campaign.en);
  root.BGSiteConfig = Object.freeze({ origin: origin, pages: pages, campaign: campaign, registrationUrl: 'https://subscribe.mvf.pt/signup/bestgym' });
})(typeof globalThis !== 'undefined' ? globalThis : window);
