'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { CVData } from '@/types/cv';
import { formatDateRange } from '@/lib/utils';
import translations from '@/data/translations.json';

// Register fonts
Font.register({
  family: 'Georgia',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notoserifgeorgian/v28/VEMXRpd8s4nv8hG_qOzL93_9uARBLqGp.ttf',
      fontWeight: 'normal',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#1a1a1a',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#ffffff',
  },
  // Header
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2040',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 12,
    color: '#2D7DD2',
    marginBottom: 6,
    textAlign: 'center',
  },
  // Contact bar
  contactBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#0F2040',
    paddingVertical: 4,
    marginBottom: 12,
  },
  contactItem: {
    fontSize: 8.5,
    color: '#444',
  },
  // Section
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#0F2040',
    marginBottom: 2,
    marginTop: 10,
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderColor: '#0F2040',
    marginBottom: 5,
  },
  // Experience
  expBlock: {
    marginBottom: 8,
  },
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  expTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2040',
    flex: 1,
  },
  expDate: {
    fontSize: 9,
    color: '#555',
    flexShrink: 0,
  },
  expCompany: {
    fontSize: 9.5,
    color: '#333',
    marginBottom: 2,
  },
  bulletContainer: {
    marginTop: 2,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 5,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: '#0F2040',
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 9,
    color: '#222',
    flex: 1,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  // Skills
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 9,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#0F2040',
    width: 80,
    flexShrink: 0,
  },
  skillValue: {
    color: '#222',
    flex: 1,
  },
  // Summary
  summaryText: {
    fontSize: 9,
    color: '#222',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  // Education
  eduBlock: {
    marginBottom: 6,
  },
});

interface ATSTemplatePDFProps {
  data: CVData;
  lang?: 'id' | 'en';
}

export function ATSTemplatePDF({ data, lang = 'id' }: ATSTemplatePDFProps) {
  const { personal, target, experiences, skills, education, certifications, professionalSummary } = data;
  const t = (translations as any)[lang];

  return (
    <Document
      title={`${personal.fullName} - CV ATS`}
      author={personal.fullName}
      subject="Professional Resume"
      keywords="ATS, Resume, CV, Professional"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {personal.fullName && (
          <View>
            <Text style={styles.name}>{personal.fullName}</Text>
            {target.jobTitle && (
              <Text style={styles.jobTitle}>{target.jobTitle}</Text>
            )}
          </View>
        )}

        {/* Contact Bar */}
        <View style={styles.contactBar}>
          {personal.email && <Text style={styles.contactItem}>{personal.email}</Text>}
          {personal.phone && <Text style={styles.contactItem}>{personal.phone}</Text>}
          {personal.location && <Text style={styles.contactItem}>{personal.location}</Text>}
          {personal.linkedin && (
            <Text style={styles.contactItem}>
              {personal.linkedin.replace(/^https?:\/\//i, '')}
            </Text>
          )}
          {personal.portfolio && (
            <Text style={styles.contactItem}>
              {personal.portfolio.replace(/^https?:\/\//i, '')}
            </Text>
          )}
        </View>

        {/* Professional Summary - Heading REMOVED per user request */}
        {professionalSummary && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.summaryText}>{professionalSummary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            <View style={styles.sectionDivider} />
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.expBlock} wrap={false}>
                <View style={styles.expRow}>
                  <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.expDate}>
                    {formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent)}
                  </Text>
                </View>
                <Text style={styles.expCompany}>
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </Text>
                <View style={styles.bulletContainer}>
                  {exp.bullets.filter((b) => b.text.trim()).map((bullet) => (
                    <View key={bullet.id} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0 || skills.languages.length > 0) && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <View style={styles.sectionDivider} />
            {skills.technical.length > 0 && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Technical:</Text>
                <Text style={styles.skillValue}>{skills.technical.join(', ')}</Text>
              </View>
            )}
            {skills.tools.length > 0 && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Tools:</Text>
                <Text style={styles.skillValue}>{skills.tools.join(', ')}</Text>
              </View>
            )}
            {skills.soft.length > 0 && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Soft Skills:</Text>
                <Text style={styles.skillValue}>{skills.soft.join(', ')}</Text>
              </View>
            )}
            {skills.languages.length > 0 && (
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>{lang === 'id' ? 'Bahasa' : 'Languages'}:</Text>
                <Text style={styles.skillValue}>{skills.languages.join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{t.education}</Text>
            <View style={styles.sectionDivider} />
            {education.map((edu) => (
              <View key={edu.id} style={styles.eduBlock} wrap={false}>
                <View style={styles.expRow}>
                  <Text style={styles.expTitle}>{edu.degree} — {edu.major}</Text>
                  <Text style={styles.expDate}>{edu.graduationYear}</Text>
                </View>
                <Text style={styles.expCompany}>
                  {edu.institution}
                  {edu.gpa ? ` | ${lang === 'id' ? 'IPK' : 'GPA'}: ${edu.gpa}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{t.certifications}</Text>
            <View style={styles.sectionDivider} />
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.expRow} wrap={false}>
                <Text style={{ ...styles.expCompany, flex: 1, marginBottom: 3 }}>
                  {cert.name} — {cert.issuer}
                </Text>
                {cert.year && <Text style={styles.expDate}>{cert.year}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
