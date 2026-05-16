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

export function generateExperienceBullets(role: string, lang: 'id' | 'en' = 'en', skills: string[] = []): string[] {
  const roleLower = role.toLowerCase();
  
  let templateKey = 'default';
  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('web developer')) {
    templateKey = 'frontend';
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('api')) {
    templateKey = 'backend';
  } else if (roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('designer')) {
    templateKey = 'uiux';
  } else if (roleLower.includes('hr') || roleLower.includes('human resource') || roleLower.includes('recruitment')) {
    templateKey = 'hr';
  } else if (roleLower.includes('finance') || roleLower.includes('accounting') || roleLower.includes('keuangan')) {
    templateKey = 'finance';
  } else if (roleLower.includes('customer') || roleLower.includes('service') || roleLower.includes('support') || roleLower.includes('layanan')) {
    templateKey = 'customer-service';
  }

  const template = templates[templateKey] || defaultTemplate;
  const experiencePool = template.experiences[lang] || template.experiences['en'];
  
  // Shuffle and pick 3-4 bullets
  const shuffled = [...experiencePool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3);

  const skillsString = skills.length > 0 ? skills.slice(0, 3).join(', ') : template.skills.slice(0, 3).join(', ');
  const keywordsString = template.ats_keywords.slice(0, 2).join(', ');

  return selected.map(bullet => 
    bullet
      .replace(/{role}/g, role)
      .replace(/{skills}/g, skillsString)
      .replace(/{keywords}/g, keywordsString)
  );
}

export function optimizeBulletLocally(text: string, lang: 'id' | 'en' = 'en'): string {
  // Simple optimization: ensure it starts with an action verb if possible
  // In a real local engine, we'd do more complex parsing.
  return text; 
}
