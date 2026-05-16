'use client';

import * as React from 'react';
import { useCVStore } from '@/store/cv-store';
import { formatDateRange } from '@/lib/utils';
import type { CVData } from '@/types/cv';
import translations from '@/data/translations.json';

interface ATSTemplateProps {
  data?: Partial<CVData>;
  className?: string;
}

export function ATSTemplate({ data, className }: ATSTemplateProps) {
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
    professionalSummary: store.professionalSummary,
  };

  const { personal, target, experiences, skills, education, certifications, professionalSummary } = cvData;
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
    <div className={`cv-preview-container ${className || ''}`}>
      {/* Header */}
      <div className="mb-4">
        {personal?.fullName && (
          <div className="cv-name">{personal.fullName}</div>
        )}
        {target?.jobTitle && (
          <div className="cv-title">{target.jobTitle}</div>
        )}
      </div>

      {/* Contact Bar */}
      <div className="cv-contact-bar">
        {personal?.email && (
          <span>{personal.email}</span>
        )}
        {personal?.phone && (
          <span>{personal.phone}</span>
        )}
        {personal?.location && (
          <span>{personal.location}</span>
        )}
        {personal?.linkedin && (
          <span>{personal.linkedin.replace(/^https?:\/\//i, '')}</span>
        )}
        {personal?.portfolio && (
          <span>{personal.portfolio.replace(/^https?:\/\//i, '')}</span>
        )}
      </div>

      {/* Professional Summary */}
      {professionalSummary && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5, textAlign: 'justify', whiteSpace: 'pre-line' }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && (
        <div>
          <div className="cv-section-title">{t.experience.toUpperCase()}</div>
          <hr className="cv-section-divider" />
          {experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '10px' }}>
              <div className="cv-exp-header">
                <span className="cv-exp-title">{exp.jobTitle}</span>
                <span className="cv-exp-date">
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
              <div className="cv-exp-company">
                {exp.company}
                {exp.location ? ` | ${exp.location}` : ''}
              </div>
              {exp.bullets && exp.bullets.filter((b) => b.text.trim()).length > 0 && (
                <ul className="cv-bullet-list">
                  {exp.bullets
                    .filter((b) => b.text.trim())
                    .map((bullet) => (
                      <li key={bullet.id}>{bullet.text}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        Object.values(skills).some((arr) => arr.length > 0) && (
          <div>
            <div className="cv-section-title">{t.skills.toUpperCase()}</div>
            <hr className="cv-section-divider" />
            {skills.technical.length > 0 && (
              <div className="cv-skills-row">
                <span className="cv-skills-label">Technical: </span>
                {skills.technical.join(', ')}
              </div>
            )}
            {skills.tools.length > 0 && (
              <div className="cv-skills-row">
                <span className="cv-skills-label">Tools: </span>
                {skills.tools.join(', ')}
              </div>
            )}
            {skills.soft.length > 0 && (
              <div className="cv-skills-row">
                <span className="cv-skills-label">Soft Skills: </span>
                {skills.soft.join(', ')}
              </div>
            )}
            {skills.languages.length > 0 && (
              <div className="cv-skills-row">
                <span className="cv-skills-label">{t.languages}: </span>
                {skills.languages.join(', ')}
              </div>
            )}
          </div>
        )
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <div className="cv-section-title">{t.education.toUpperCase()}</div>
          <hr className="cv-section-divider" />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <div className="cv-exp-header">
                <span className="cv-exp-title">
                  {edu.degree} — {edu.major}
                </span>
                <span className="cv-exp-date">{edu.graduationYear}</span>
              </div>
              <div className="cv-exp-company">
                {edu.institution}
                {edu.gpa ? ` | ${t.gpa}: ${edu.gpa}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <div className="cv-section-title">{t.certifications.toUpperCase()}</div>
          <hr className="cv-section-divider" />
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '4px' }}>
              <div className="cv-exp-header">
                <span style={{ fontSize: '10pt', color: '#222' }}>
                  {cert.name} — {cert.issuer}
                </span>
                {cert.year && (
                  <span className="cv-exp-date">{cert.year}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
