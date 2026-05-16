import { CVData } from '@/types/cv';
import frontendTemplates from '../data/templates/frontend.json';
import backendTemplates from '../data/templates/backend.json';
import uiuxTemplates from '../data/templates/uiux.json';
import digitalMarketingTemplates from '../data/templates/digital-marketing.json';
import financeTemplates from '../data/templates/finance.json';
import customerServiceTemplates from '../data/templates/customer-service.json';
import defaultTemplates from '../data/templates/default.json';

interface CVTemplate {
  role: { en: string; id: string };
  summaries: { en: string[]; id: string[] };
  experiences: { en: string[]; id: string[] };
  skills: string[];
  ats_keywords: string[];
}

const allTemplates: Record<string, CVTemplate> = {
  frontend: frontendTemplates as CVTemplate,
  backend: backendTemplates as CVTemplate,
  uiux: uiuxTemplates as CVTemplate,
  marketing: digitalMarketingTemplates as unknown as CVTemplate,
  finance: financeTemplates as CVTemplate,
  'customer-service': customerServiceTemplates as CVTemplate,
  default: defaultTemplates as CVTemplate,
};

/**
 * Generates a professional summary locally based on role, skills, and experience.
 */
export function generateSummary(cvData: Partial<CVData>): { id: string, en: string } {
  const jobTitle = cvData.target?.jobTitle?.toLowerCase() || '';
  const experiences = cvData.experiences || [];
  const skills = [...(cvData.skills?.technical || []), ...(cvData.skills?.tools || [])].slice(0, 4).join(', ');
  const keywords = (cvData.target?.keywords || []).slice(0, 3).join(', ');
  
  // Calculate total years of experience
  let totalYears = 0;
  if (experiences.length > 0) {
    const years = experiences.map(exp => {
      const start = parseInt(exp.startYear) || new Date().getFullYear();
      const end = exp.isCurrent ? new Date().getFullYear() : (parseInt(exp.endYear) || new Date().getFullYear());
      return end - start;
    });
    totalYears = Math.max(0, Math.round(years.reduce((a, b) => a + b, 0)));
  }

  const expString = totalYears > 0 ? `${totalYears}+` : 'beberapa';
  const expStringEn = totalYears > 0 ? `${totalYears}+` : 'several';
  
  let role = 'default';
  if (jobTitle.includes('frontend') || jobTitle.includes('react') || jobTitle.includes('web')) role = 'frontend';
  else if (jobTitle.includes('backend') || jobTitle.includes('node') || jobTitle.includes('java')) role = 'backend';
  else if (jobTitle.includes('ui') || jobTitle.includes('ux') || jobTitle.includes('design')) role = 'uiux';
  else if (jobTitle.includes('marketing') || jobTitle.includes('seo') || jobTitle.includes('social')) role = 'marketing';
  else if (jobTitle.includes('finance') || jobTitle.includes('accountant') || jobTitle.includes('audit')) role = 'finance';
  else if (jobTitle.includes('customer') || jobTitle.includes('service') || jobTitle.includes('support')) role = 'customer-service';

  const templates = allTemplates[role] || defaultTemplates;
  
  const summariesId = templates.summaries.id;
  const summariesEn = templates.summaries.en;
  
  const randomIndex = Math.floor(Math.random() * summariesId.length);
  
  const templateId = summariesId[randomIndex];
  const templateEn = summariesEn[randomIndex];

  const placeholders = {
    role: cvData.target?.jobTitle || (templates.role?.id || 'Profesional'),
    skills: skills || 'berbagai keahlian teknis',
    skillsEn: skills || 'various technical skills',
    keywords: keywords || 'praktik terbaik industri',
    keywordsEn: keywords || 'industry best practices',
    years: expString,
    yearsEn: expStringEn,
  };

  const replacePlaceholders = (text: string, isEn = false) => {
    return text
      .replace(/\[role\]/g, placeholders.role)
      .replace(/\{role\}/g, placeholders.role)
      .replace(/\[skills\]/g, isEn ? placeholders.skillsEn : placeholders.skills)
      .replace(/\{skills\}/g, isEn ? placeholders.skillsEn : placeholders.skills)
      .replace(/\[keywords\]/g, isEn ? placeholders.keywordsEn : placeholders.keywords)
      .replace(/\{keywords\}/g, isEn ? placeholders.keywordsEn : placeholders.keywords)
      .replace(/\[years\]/g, isEn ? placeholders.yearsEn : placeholders.years)
      .replace(/\{years\}/g, isEn ? placeholders.yearsEn : placeholders.years);
  };

  return {
    id: replacePlaceholders(templateId, false),
    en: replacePlaceholders(templateEn, true)
  };
}
