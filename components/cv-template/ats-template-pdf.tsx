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
    lineHeight: 1.5,
    color: '#1a1a1a',
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 56,
    paddingRight: 56,
    backgroundColor: '#ffffff',
  },
  // Header
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2040',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 13,
    color: '#2D7DD2',
    marginBottom: 8,
  },
  // Contact bar
  contactBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#0F2040',
    paddingVertical: 4,
    marginBottom: 14,
  },
  contactItem: {
    fontSize: 9,
    color: '#444',
  },
  // Section
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#0F2040',
    marginBottom: 3,
    marginTop: 12,
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderColor: '#0F2040',
    marginBottom: 6,
  },
  // Experience
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  expTitle: {
    fontSize: 11,
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
    fontSize: 10,
    color: '#333',
    marginBottom: 3,
  },
  bulletContainer: {
    marginBottom: 6,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 2,
  },
  bulletDot: {
    width: 12,
    fontSize: 9.5,
    color: '#0F2040',
    flexShrink: 0,
    marginTop: 0.5,
  },
  bulletText: {
    fontSize: 9.5,
    color: '#222',
    flex: 1,
    lineHeight: 1.45,
  },
  // Skills
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
    fontSize: 9.5,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#0F2040',
    width: 70,
    flexShrink: 0,
  },
  skillValue: {
    color: '#222',
    flex: 1,
  },
  // Summary
  summaryText: {
    fontSize: 9.5,
    color: '#222',
    lineHeight: 1.55,
  },
  // Education
  gpaText: {
    fontSize: 9,
    color: '#555',
  },
});

interface ATSTemplatePDFProps {
  data: CVData;
}

export function ATSTemplatePDF({ data }: ATSTemplatePDFProps) {
  const { personal, target, experiences, skills, education, certifications, professionalSummary } = data;

  return (
    <Document
      title={`${personal.fullName} - CV ATS`}
      author={personal.fullName}
      creator="ATS CV Builder Pro"
      producer="ATS CV Builder Pro"
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

        {/* Professional Summary */}
        {professionalSummary && (
          <View>
            <Text style={styles.sectionTitle}>RINGKASAN PROFESIONAL</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.summaryText}>{professionalSummary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>PENGALAMAN KERJA</Text>
            <View style={styles.sectionDivider} />
            {experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
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
          <View>
            <Text style={styles.sectionTitle}>KEAHLIAN</Text>
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
                <Text style={styles.skillLabel}>Bahasa:</Text>
                <Text style={styles.skillValue}>{skills.languages.join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>PENDIDIKAN</Text>
            <View style={styles.sectionDivider} />
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={styles.expRow}>
                  <Text style={styles.expTitle}>{edu.degree} — {edu.major}</Text>
                  <Text style={styles.expDate}>{edu.graduationYear}</Text>
                </View>
                <Text style={styles.expCompany}>
                  {edu.institution}
                  {edu.gpa ? ` | IPK: ${edu.gpa}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>SERTIFIKASI</Text>
            <View style={styles.sectionDivider} />
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.expRow}>
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
