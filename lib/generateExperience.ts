import frontendTemplates from '../data/templates/frontend.json';
import backendTemplates from '../data/templates/backend.json';
import uiuxTemplates from '../data/templates/uiux.json';
import hrTemplates from '../data/templates/hr.json';
import financeTemplates from '../data/templates/finance.json';
import customerServiceTemplates from '../data/templates/customer-service.json';
import defaultTemplates from '../data/templates/default.json';

const allTemplates: Record<string, any> = {
  frontend: frontendTemplates,
  backend: backendTemplates,
  uiux: uiuxTemplates,
  hr: hrTemplates,
  finance: financeTemplates,
  'customer-service': customerServiceTemplates,
  default: defaultTemplates,
};

export function generateExperienceBullets(jobTitle: string): { id: string, en: string }[] {
  const title = jobTitle.toLowerCase();
  
  let role = 'default';
  if (title.includes('frontend') || title.includes('react') || title.includes('web')) role = 'frontend';
  else if (title.includes('backend') || title.includes('node') || title.includes('java')) role = 'backend';
  else if (title.includes('ui') || title.includes('ux') || title.includes('design')) role = 'uiux';
  else if (title.includes('hr') || title.includes('recruiter') || title.includes('human')) role = 'hr';
  else if (title.includes('finance') || title.includes('accountant') || title.includes('audit')) role = 'finance';
  else if (title.includes('customer') || title.includes('service') || title.includes('support')) role = 'customer-service';

  const templates = allTemplates[role] || defaultTemplates;
  const experiencesId = templates.experiences.id;
  const experiencesEn = templates.experiences.en;
  
  // Return at most 4 bullets
  const count = Math.min(4, experiencesId.length);
  const results = [];
  
  for (let i = 0; i < count; i++) {
    results.push({
      id: experiencesId[i],
      en: experiencesEn[i]
    });
  }
  
  return results;
}
