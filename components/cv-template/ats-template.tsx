import * as React from 'react';
import { useCVStore } from '@/store/cv-store';
import { formatDateRange } from '@/lib/utils';
import type { CVData } from '@/types/cv';
import translations from '@/data/translations.json';

interface ATSTemplateProps {
  data?: Partial<CVData>;
  className?: string;
}

export const ATSTemplate = React.forwardRef<HTMLDivElement, ATSTemplateProps>(
  ({ data, className }, ref) => {
    const store = useCVStore();
    const lang = store.language || 'id';
    const t = (translations as any)[lang];

    const cvData: Partial<CVData> = data || {
      personal: store.personal,
      target: store.target,
      experiences: store.experiences,
      skills: store.skills,
      education: store.education,
      certifications: store.certifications,
      professionalSummaryId: store.professionalSummaryId,
      professionalSummaryEn: store.professionalSummaryEn,
    };

    const { personal, target, experiences, skills, education, certifications } = cvData;
    const summary = lang === 'id' ? cvData.professionalSummaryId : cvData.professionalSummaryEn;
    const isEmpty = !personal?.fullName;

    if (isEmpty) {
      return (
        <div className={`cv-preview-container ${className || ''}`}>
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#1A2332]">{t.empty_preview}</p>
            <p className="text-xs text-[#64748B] mt-1">{t.empty_preview_desc}</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`cv-preview-container ${className || ''}`}
      >
        {/* Header */}
        <div className="text-center mb-5">
          {personal?.fullName && (
            <h1 className="cv-name uppercase mb-1">
              {personal.fullName}
            </h1>
          )}
          {target?.jobTitle && (
            <div className="cv-title uppercase text-center tracking-tight">
              {target.jobTitle}
            </div>
          )}
        </div>

        {/* Contact Bar - Centered and Responsive */}
        <div className="cv-contact-bar justify-center text-center flex-wrap gap-x-3 gap-y-1.5 px-2">
          {[
            personal?.email,
            personal?.phone,
            personal?.linkedin ? `LinkedIn: ${personal.linkedin.replace(/^https?:\/\/(www\.)?/i, '')}` : null,
            personal?.portfolio ? `Link: ${personal.portfolio.replace(/^https?:\/\/(www\.)?/i, '')}` : null,
            personal?.location,
          ]
            .filter(Boolean)
            .map((item, index, array) => (
              <React.Fragment key={index}>
                <span className="font-bold">{item}</span>
                {index < array.length - 1 && (
                  <span className="font-normal opacity-40">|</span>
                )}
              </React.Fragment>
            ))}
        </div>

        {/* Profile / Summary Section */}
        {summary && (
          <div className="break-inside-avoid mb-5">
            <h2 className="cv-section-title">
              {t.summary}
            </h2>
            <hr className="cv-section-divider" />
            <p className="text-sm md:text-[10.5pt] leading-relaxed text-justify break-words whitespace-pre-wrap font-medium">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <div className="break-inside-avoid mb-5">
            <h2 className="cv-section-title">
              {t.experience}
            </h2>
            <hr className="cv-section-divider" />
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-5 last:mb-0">
                <div className="cv-exp-header flex-wrap gap-x-4">
                  <span className="cv-exp-title flex-1 min-w-[60%]">
                    {lang === 'id' ? exp.jobTitleId : exp.jobTitleEn}
                  </span>
                  <span className="cv-exp-date whitespace-nowrap text-right">
                    {formatDateRange(
                      exp.startMonth,
                      exp.startYear,
                      exp.endMonth,
                      exp.endYear,
                      exp.isCurrent,
                      lang
                    )}
                  </span>
                </div>
                <div className="cv-exp-company italic">
                  {exp.company}
                  {exp.location ? ` | ${exp.location}` : ''}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="cv-bullet-list">
                    {exp.bullets.map((bullet) => {
                      const bulletText = lang === 'id' ? bullet.textId : bullet.textEn;
                      if (!bulletText.trim()) return null;
                      return (
                        <li key={bullet.id} className="text-justify leading-snug">
                          {bulletText}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills && (
          Object.values(skills).some((arr) => arr.length > 0) && (
            <div className="break-inside-avoid mb-5">
              <h2 className="cv-section-title">
                {t.skills}
              </h2>
              <hr className="cv-section-divider" />
              <div className="space-y-1">
                {skills.technical.length > 0 && (
                  <div className="cv-skills-row text-sm md:text-[10pt]">
                    <span className="cv-skills-label">{t.technical_skills}: </span>
                    {skills.technical.join(', ')}
                  </div>
                )}
                {skills.tools.length > 0 && (
                  <div className="cv-skills-row text-sm md:text-[10pt]">
                    <span className="cv-skills-label">Tools: </span>
                    {skills.tools.join(', ')}
                  </div>
                )}
                {skills.soft.length > 0 && (
                  <div className="cv-skills-row text-sm md:text-[10pt]">
                    <span className="cv-skills-label">{t.soft_skills}: </span>
                    {skills.soft.join(', ')}
                  </div>
                )}
                {skills.languages.length > 0 && (
                  <div className="cv-skills-row text-sm md:text-[10pt]">
                    <span className="cv-skills-label">{t.languages}: </span>
                    {skills.languages.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="break-inside-avoid mb-5">
            <h2 className="cv-section-title">
              {t.education}
            </h2>
            <hr className="cv-section-divider" />
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid mb-3 last:mb-0">
                <div className="cv-exp-header">
                  <span className="cv-exp-title">
                    {edu.institution}
                  </span>
                  <span className="cv-exp-date">{edu.graduationYear}</span>
                </div>
                <div className="cv-exp-company italic">
                  {lang === 'id' ? edu.degreeId : edu.degreeEn} — {lang === 'id' ? edu.majorId : edu.majorEn}
                  {edu.gpa ? ` | ${t.gpa}: ${edu.gpa}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="cv-section-title">
              {t.certifications}
            </h2>
            <hr className="cv-section-divider" />
            {certifications.map((cert) => (
              <div key={cert.id} className="break-inside-avoid mb-2 last:mb-0">
                <div className="cv-exp-header">
                  <span className="cv-exp-title">
                    {lang === 'id' ? cert.nameId : cert.nameEn}
                  </span>
                  {cert.year && (
                    <span className="cv-exp-date">{cert.year}</span>
                  )}
                </div>
                <div className="cv-exp-company italic">
                  {cert.issuer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ATSTemplate.displayName = 'ATSTemplate';
