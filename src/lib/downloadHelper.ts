/**
 * KNOOVIQ INDUSTRIES — Client & Application Download Helper
 * Automatically triggers file downloads to the user's / admin's local PC Downloads folder
 */

export function downloadTextFile(filename: string, content: string): void {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (err) {
    console.error('Download error:', err);
  }
}

export function generateEnterpriseConsultationDownload(data: {
  fullName: string;
  company?: string | null;
  email: string;
  countryCode: string;
  phoneNumber: string;
  service: string;
  message?: string | null;
  submissionId?: string;
  date?: string;
}): void {
  const refId = data.submissionId || `CI-${Date.now()}`;
  const subDate = data.date || new Date().toLocaleString();
  const safeName = (data.fullName || 'Client').trim().replace(/[^a-zA-Z0-9]/g, '_');

  const content = `================================================================================
                    KNOOVIQ INDUSTRIES PVT LTD
             ENTERPRISE CONSULTATION SUBMISSION RECORD
================================================================================

Reference ID:      ${refId}
Submission Date:   ${subDate}
Form Source:       Enterprise Consultation (Modal & Chatbot)

--------------------------------------------------------------------------------
1. CLIENT & ORGANIZATION INFORMATION
--------------------------------------------------------------------------------
Full Name:         ${data.fullName}
Company Name:      ${data.company || 'Not Specified / Independent'}
Email Address:     ${data.email}
Phone Number:      ${data.countryCode} ${data.phoneNumber}

--------------------------------------------------------------------------------
2. SAP & ENTERPRISE SERVICE REQUIREMENTS
--------------------------------------------------------------------------------
Service Required:  ${data.service}

Requirement Details:
${data.message && data.message.trim() ? data.message.trim() : 'No additional requirement notes submitted.'}

--------------------------------------------------------------------------------
3. ENTERPRISE GOVERNANCE & CONFIDENTIALITY
--------------------------------------------------------------------------------
Status:            Pending Review
Governing Terms:   Standard Enterprise NDA & ISO 27001 Data Security Guidelines
Official Website:  https://knooviq.com
Head Office:       1210, One World by Sanjar, Near NL College, SV Road,
                   Malad West, Mumbai 400064, India
================================================================================
`;

  downloadTextFile(`KNOOVIQ_Enterprise_Consultation_${safeName}.txt`, content);
}

export function generateExecutiveInquiryDownload(data: {
  fullName: string;
  companyName?: string | null;
  workEmail: string;
  countryCode: string;
  phoneNumber: string;
  enquiryType: string;
  message?: string | null;
  submissionId?: string;
  date?: string;
}): void {
  const refId = data.submissionId || `EI-${Date.now()}`;
  const subDate = data.date || new Date().toLocaleString();
  const safeName = (data.fullName || 'Executive').trim().replace(/[^a-zA-Z0-9]/g, '_');

  const content = `================================================================================
                    KNOOVIQ INDUSTRIES PVT LTD
               EXECUTIVE INQUIRY SUBMISSION RECORD
================================================================================

Reference ID:      ${refId}
Submission Date:   ${subDate}
Form Source:       Knooviq Connect — Executive Inquiry Desk

--------------------------------------------------------------------------------
1. EXECUTIVE CONTACT INFORMATION
--------------------------------------------------------------------------------
Full Name:         ${data.fullName}
Company Name:      ${data.companyName || 'Not Specified / Confidential'}
Work Email:        ${data.workEmail}
Phone Number:      ${data.countryCode} ${data.phoneNumber}

--------------------------------------------------------------------------------
2. STRATEGIC INQUIRY DETAILS
--------------------------------------------------------------------------------
Enquiry Type:      ${data.enquiryType}

Requirement Scope / Objectives:
${data.message && data.message.trim() ? data.message.trim() : 'No additional scope details provided.'}

--------------------------------------------------------------------------------
3. EXECUTIVE SLA & COMPLIANCE
--------------------------------------------------------------------------------
Status:            Pending Executive Assessment
Response SLA:      Within 24 Business Hours
Confidentiality:   Pre-Signed Non-Disclosure Agreement (NDA)
Official Website:  https://knooviq.com
Head Office:       1210, One World by Sanjar, Near NL College, SV Road,
                   Malad West, Mumbai 400064, India
================================================================================
`;

  downloadTextFile(`KNOOVIQ_Executive_Inquiry_${safeName}.txt`, content);
}

export function generateCareerApplicationDownload(data: {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  experienceLevel: string;
  totalExperience?: string;
  education?: string;
  noticePeriod?: string;
  portfolioLinkedin?: string;
  coverLetter?: string;
  submissionId?: string;
  date?: string;
}): void {
  const refId = data.submissionId || `APP-${Date.now()}`;
  const subDate = data.date || new Date().toLocaleString();
  const safeName = (data.fullName || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');

  const content = `================================================================================
                    KNOOVIQ INDUSTRIES PVT LTD
         OFFICIAL CANDIDATE APPLICATION & TALENT RECRUITMENT DOSSIER
             Allocated to KNOOVIQ Original Website: https://knooviq.com
================================================================================

Application ID:    ${refId}
Submission Date:   ${subDate}
Portal Source:     KNOOVIQ Careers — Talent Acquisition Pipeline
Original Website:  https://knooviq.com
Allocation Status: Confirmed & Verified

--------------------------------------------------------------------------------
1. CANDIDATE PERSONAL INFORMATION
--------------------------------------------------------------------------------
Full Name:         ${data.fullName}
Email Address:     ${data.email}
Phone Number:      ${data.phone}
Current Location:  ${data.location}

--------------------------------------------------------------------------------
2. PROFESSIONAL CREDENTIALS & ROLE
--------------------------------------------------------------------------------
Position Applied:  ${data.position}
Experience Level:  ${data.experienceLevel}
Total Experience:  ${data.totalExperience || 'N/A'}
Qualification:     ${data.education || 'N/A'}
Notice Period:     ${data.noticePeriod || 'Not specified'}
LinkedIn Profile:  ${data.portfolioLinkedin || 'Not provided'}

--------------------------------------------------------------------------------
3. COVER LETTER & CANDIDATE STATEMENT
--------------------------------------------------------------------------------
${data.coverLetter && data.coverLetter.trim() ? data.coverLetter.trim() : 'No cover letter provided.'}

--------------------------------------------------------------------------------
4. ALLOCATION METRICS & DATA PRIVACY
--------------------------------------------------------------------------------
Initial Status:    PENDING REVIEW
Privacy Consent:   Granted (GDPR & IT Act Compliance)
Talent Desk:       careers@knooviq.com
Official Portal:   https://knooviq.com
Corporate Office:  1210, One World by Sanjar, Near NL College, SV Road,
                   Malad West, Mumbai 400064, India
================================================================================
`;

  downloadTextFile(`KNOOVIQ_Career_Application_${safeName}.txt`, content);
}

