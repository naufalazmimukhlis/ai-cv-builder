import { CVData } from '@/types/cv';
import frontendTemplate from '@/data/templates/frontend.json';
import backendTemplate from '@/data/templates/backend.json';
import uiuxTemplate from '@/data/templates/uiux.json';
import hrTemplate from '@/data/templates/hr.json';
import financeTemplate from '@/data/templates/finance.json';
import customerServiceTemplate from '@/data/templates/customer-service.json';
import defaultTemplate from '@/data/templates/default.json';

const templates: Record<string, any> = {
  'frontend': frontendTemplate,
  'backend': backendTemplate,
  'uiux': uiuxTemplate,
  'hr': hrTemplate,
  'finance': financeTemplate,
  'customer-service': customerServiceTemplate,
  'default': defaultTemplate,
};

export function generateSummary(cvData: Partial<CVData>, lang: 'id' | 'en' = 'en'): string {
  const jobTitle = cvData.target?.jobTitle?.toLowerCase() || '';
  
  let templateKey = 'default';
  if (jobTitle.includes('frontend') || jobTitle.includes('react') || jobTitle.includes('web developer')) {
    templateKey = 'frontend';
  } else if (jobTitle.includes('backend') || jobTitle.includes('node') || jobTitle.includes('api')) {
    templateKey = 'backend';
  } else if (jobTitle.includes('ui') || jobTitle.includes('ux') || jobTitle.includes('designer')) {
    templateKey = 'uiux';
  } else if (jobTitle.includes('hr') || jobTitle.includes('human resource') || jobTitle.includes('recruitment')) {
    templateKey = 'hr';
  } else if (jobTitle.includes('finance') || jobTitle.includes('accounting') || jobTitle.includes('keuangan')) {
    templateKey = 'finance';
  } else if (jobTitle.includes('customer') || jobTitle.includes('service') || jobTitle.includes('support') || jobTitle.includes('layanan')) {
    templateKey = 'customer-service';
  }

  const template = templates[templateKey] || defaultTemplate;
  const summaries = template.summaries[lang] || template.summaries['en'];
  const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];

  const skills = (cvData.skills?.technical || []).length > 0 
    ? cvData.skills?.technical?.slice(0, 5).join(', ') 
    : template.skills.slice(0, 5).join(', ');
    
  const keywords = template.ats_keywords.slice(0, 3).join(', ');
  const role = typeof template.role === 'string' ? template.role : (template.role[lang] || template.role['en']);

  return randomSummary
    .replace(/{role}/g, cvData.target?.jobTitle || role)
    .replace(/{skills}/g, skills)
    .replace(/{keywords}/g, keywords);
}
