/* Public form schema/configuration. No credentials belong in this file. */
(function (root, factory) {
  var config = factory();
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.BGLeadsConfig = config;
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  'use strict';
  var yesNo = [['Sim', 'Yes'], ['Não', 'No']];
  function field(name, pt, en, type, required, extra) {
    return Object.assign({ name: name, label: [pt, en], type: type || 'text', required: required !== false }, extra || {});
  }
  var name = field('name', 'Nome completo', 'Full name', 'text', true, { autocomplete: 'name', max: 120 });
  var phone = field('phone', 'Telefone', 'Phone', 'tel', true, { autocomplete: 'tel', max: 40 });
  var email = field('email', 'E-mail', 'Email', 'email', true, { autocomplete: 'email', max: 160 });
  var locality = field('locality', 'Localidade', 'Town / city', 'text', true, { autocomplete: 'address-level2', max: 120 });
  return {
    endpoint: '/api/leads',
    privacyPath: '/privacidade',
    builtByBestRecipient: 'rhvalongo@bestgym.pt',
    personalTrainerRecipient: null,
    saoJoaoRecipient: null,
    franchisingRecipient: 'franchising@bestgym.pt',
    contactRecipients: { valongo: 'valongo@bestgym.pt', famalicao: 'famalicao@bestgym.pt' },
    forms: {
      builtByBest: {
        recipientKey: 'builtByBestRecipient', title: 'Built By Best',
        submit: ['Enviar candidatura', 'Submit application'],
        success: ['Candidatura recebida', 'Application received'],
        support: ['A equipa do BEST GYM irá analisar o teu perfil e entrará em contacto caso exista enquadramento no projeto.', 'The BEST GYM team will review your profile and contact you if it fits the project.'],
        steps: [['Dados', 'Details'], ['Perfil', 'Profile'], ['Confirmar', 'Review']],
        fields: [
          name, field('age', 'Idade', 'Age', 'number', true, { min: 1, maxValue: 120, step: 0 }), locality, phone, email,
          field('instagram', 'Instagram', 'Instagram', 'text', true, { max: 200, step: 0 }),
          field('category', 'Categoria', 'Category', 'text', true, { step: 1, max: 120 }),
          field('competed', 'Já competiste?', 'Have you competed before?', 'select', true, { options: yesNo, step: 1 }),
          field('goal', 'Próxima competição / objetivo', 'Next competition / goal', 'text', true, { max: 300, step: 1 }),
          field('goalDate', 'Data do objetivo (se aplicável)', 'Goal date (if applicable)', 'date', false, { step: 1 }),
          field('preparationPhase', 'Fase de preparação (se aplicável)', 'Preparation phase (if applicable)', 'text', false, { max: 200, step: 1 }),
          field('coach', 'Coach / equipa (opcional)', 'Coach / team (optional)', 'text', false, { max: 160, step: 1 })
        ]
      },
      personalTrainer: {
        recipientKey: 'personalTrainerRecipient', title: 'Personal Trainers',
        submit: ['Enviar candidatura', 'Submit application'], success: ['Candidatura recebida', 'Application received'],
        support: ['A equipa irá analisar o teu perfil e entrar em contacto caso exista enquadramento num dos modelos de colaboração.', 'Our team will review your profile and contact you if it fits one of our collaboration models.'],
        steps: [['Dados', 'Details'], ['Perfil', 'Profile'], ['Confirmar', 'Review']],
        fields: [
          Object.assign({}, name, { label: ['Nome e apelido', 'First and last name'] }), phone, email, locality,
          field('unit', 'Unidade', 'Gym', 'select', true, { options: [['Famalicão', 'Famalicão'], ['Valongo', 'Valongo'], ['Ambas', 'Both']], step: 0 }),
          field('practicing', 'Trabalhas atualmente como Personal Trainer?', 'Do you currently work as a Personal Trainer?', 'select', true, { options: yesNo, step: 1 }),
          field('certified', 'Tens certificação profissional válida?', 'Do you hold a valid professional certification?', 'select', true, { options: yesNo, step: 1 }),
          field('clients', 'Tens carteira própria de clientes?', 'Do you have your own client base?', 'select', true, { options: yesNo, step: 1 }),
          field('instagram', 'Instagram profissional', 'Professional Instagram', 'text', true, { max: 200, step: 1 }),
          field('tiktok', 'TikTok (opcional)', 'TikTok (optional)', 'text', false, { max: 200, step: 1 })
        ]
      },
      saoJoaoVip: {
        recipientKey: 'saoJoaoRecipient', title: 'Lista VIP São João da Madeira',
        submit: ['Entrar na lista VIP', 'Join the VIP list'], success: ['Já estás na lista VIP', 'You are on the VIP list'],
        support: ['Receberás as novidades de São João da Madeira em primeira mão.', 'You will receive São João da Madeira news first.'],
        fields: [name, phone, email]
      },
      franchising: {
        recipientKey: 'franchisingRecipient', title: 'Franchising',
        submit: ['Quero saber mais sobre o franchising', 'Find out more about franchising'],
        success: ['Pedido recebido', 'Enquiry received'], support: ['A equipa irá analisar o teu projeto e entrar em contacto.', 'Our team will review your project and contact you.'],
        fields: [name, email, phone,
          field('nif', 'NIF', 'Tax identification number', 'text', true, { max: 30, inputmode: 'numeric' }),
          field('capital', 'Capital disponível', 'Available capital', 'text', true, { max: 100 }),
          field('location', 'Local onde pretendes abrir o franchising', 'Preferred franchise location', 'text', true, { max: 200 }),
          field('projectType', 'Tipo de projeto', 'Project type', 'select', true, { options: [['Novo ginásio', 'New gym'], ['Remodelação de ginásio existente', 'Refurbishment of an existing gym']] }),
          field('message', 'Observações (opcional)', 'Notes (optional)', 'textarea', false, { max: 3000 })
        ]
      },
      contact: {
        title: 'Contacto BEST GYM', submit: ['Enviar mensagem', 'Send message'], success: ['Mensagem recebida', 'Message received'],
        support: ['A equipa da unidade irá responder ao teu contacto.', 'The gym team will reply to your enquiry.'],
        fields: [name, email, Object.assign({}, phone, { required: false }),
          field('unit', 'Unidade', 'Gym', 'select', true, { options: [['valongo', 'Valongo', 'Valongo'], ['famalicao', 'Vila Nova de Famalicão', 'Vila Nova de Famalicão']] }),
          field('subject', 'Assunto', 'Subject', 'select', true, { options: [['Inscrição', 'Membership'], ['Built By Best', 'Built By Best'], ['Produtos', 'Products'], ['Outro', 'Other']] }),
          field('message', 'Mensagem', 'Message', 'textarea', true, { max: 3000 })
        ]
      }
    }
  };
});
