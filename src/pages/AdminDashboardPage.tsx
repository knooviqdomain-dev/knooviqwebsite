import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Inbox, 
  Mail,
  Eye,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Clock, 
  FileText, 
  ExternalLink,
  ChevronDown,
  Database,
  UserCheck,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  Globe,
  Briefcase,
  Users,
  LogOut,
  Send,
  MessageCircle,
  Activity
} from 'lucide-react';
import { 
  AdminProfile,
  ClientInquiry,
  InquiryFormType,
  InquiryStatus,
  JobApplicationSubmission, 
  AdminNotification, 
  ActivityLog, 
  DashboardStats,
  AdminRole
} from '../types';
import { 
  getAdminSession, 
  adminLogout, 
  fetchClientInquiries,
  fetchJobApplications, 
  fetchAdminNotifications, 
  markNotificationRead, 
  fetchActivityLogs, 
  updateClientInquiryStatus,
  deleteClientInquiry,
  updateJobApplicationStatus, 
  deleteRecord,
  getSignedResumeUrl, 
  getDashboardStats, 
  getSupabaseStatus,
  fetchAdminProfiles,
  updateAdminProfileRole
} from '../lib/supabase';
import { 
  downloadExactCandidateFile 
} from '../lib/resumeVault';

// Helper to resolve Country Name from country code or location
function resolveCountry(countryCode?: string, location?: string): string {
  if (countryCode) {
    const clean = countryCode.trim();
    if (clean === '+91') return 'India';
    if (clean === '+1') return 'United States';
    if (clean === '+44') return 'United Kingdom';
    if (clean === '+31') return 'Netherlands';
    if (clean === '+49') return 'Germany';
    if (clean === '+971') return 'UAE';
    if (clean === '+65') return 'Singapore';
    if (clean === '+61') return 'Australia';
    if (clean === '+33') return 'France';
    if (clean === '+81') return 'Japan';
  }
  if (location) {
    const locLower = location.toLowerCase();
    if (locLower.includes('india') || locLower.includes('mumbai') || locLower.includes('bengaluru') || locLower.includes('pune') || locLower.includes('delhi')) {
      return 'India';
    }
    if (locLower.includes('usa') || locLower.includes('united states') || locLower.includes('us')) return 'United States';
    if (locLower.includes('uk') || locLower.includes('london')) return 'United Kingdom';
    if (locLower.includes('netherlands') || locLower.includes('amsterdam')) return 'Netherlands';
    return location.split(',').pop()?.trim() || 'India';
  }
  return 'India';
}

// Normalized status type for filtering
type NormalizedStatus = 'ALL' | 'NEW' | 'REVIEWED' | 'CONTACTED' | 'RESOLVED' | 'REJECTED';

// Form Filter Pill Type
type FormCategoryPill = 'ALL' | 'CAREERS' | 'ENTERPRISE' | 'EXECUTIVE';

// Unified item structure for the table
interface UnifiedSubmissionItem {
  id: string;
  sourceForm: 'Enterprise Consultation' | 'Career Application' | 'Executive Inquiry';
  avatarInitial: string;
  applicantOrCompany: string;
  contactPerson: string;
  companyName?: string | null;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  typeOrPosition: string;
  requirementDetails?: string | null;
  experience?: string;
  education?: string;
  location?: string;
  resumeStoragePath?: string;
  linkedinUrl?: string;
  coverLetter?: string;
  status: 'New' | 'Reviewed' | 'Contacted' | 'Hired' | 'Rejected';
  normalizedStatus: NormalizedStatus;
  rawStatus: string;
  createdAt: string;
  internalNotes?: string | null;
  rawRecord: ClientInquiry | JobApplicationSubmission;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  // System view drawer / modal
  const [systemView, setSystemView] = useState<'submissions' | 'security' | 'audit' | 'team'>('submissions');

  // Table records from Supabase / store
  const [clientInquiries, setClientInquiries] = useState<ClientInquiry[]>([]);
  const [applications, setApplications] = useState<JobApplicationSubmission[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [adminTeam, setAdminTeam] = useState<AdminProfile[]>([]);

  // Filtering states
  const [activeFormPill, setActiveFormPill] = useState<FormCategoryPill>('ALL');
  const [activeStatusCard, setActiveStatusCard] = useState<NormalizedStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [statusDropdown, setStatusDropdown] = useState('ALL');

  // UI state
  const [loading, setLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Modals
  const [detailsModal, setDetailsModal] = useState<UnifiedSubmissionItem | null>(null);
  const [resumeModal, setResumeModal] = useState<{
    isOpen: boolean;
    candidateName: string;
    signedUrl: string | null;
    loading: boolean;
  }>({
    isOpen: false,
    candidateName: '',
    signedUrl: null,
    loading: false,
  });

  const [noteModal, setNoteModal] = useState<{
    isOpen: boolean;
    id: string;
    type: 'client_inquiry' | 'career';
    currentNote: string;
    targetName?: string;
  }>({
    isOpen: false,
    id: '',
    type: 'client_inquiry',
    currentNote: '',
    targetName: '',
  });

  // Verify auth session
  useEffect(() => {
    const currentSession = getAdminSession();
    if (!currentSession) {
      navigate('/admin/login');
    } else {
      setAdmin(currentSession);
    }
  }, [navigate]);

  // Load all telemetry
  const loadAllData = async () => {
    setLoading(true);
    const [
      clientInqData,
      appData,
      notifData,
      logsData,
      teamData
    ] = await Promise.all([
      fetchClientInquiries(),
      fetchJobApplications(),
      fetchAdminNotifications(),
      fetchActivityLogs(),
      fetchAdminProfiles()
    ]);

    setClientInquiries(clientInqData);
    setApplications(appData);
    setNotifications(notifData);
    setActivityLogs(logsData);
    setAdminTeam(teamData);
    setLoading(false);
  };

  useEffect(() => {
    if (admin) {
      loadAllData();
    }
  }, [admin]);

  const handleSignOut = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Copy Link Helper
  const handleCopyLink = () => {
    const link = `${window.location.origin}/connect`;
    navigator.clipboard.writeText(link);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Open WhatsApp Link
  const handleWhatsAppLink = () => {
    window.open('https://wa.me/918369225602?text=Hello%20Knooviq%20Industries%2C%20I%20would%20like%20to%20inquire%20about%20enterprise%20services.', '_blank');
  };

  // Convert raw records into unified table items
  const unifiedItems: UnifiedSubmissionItem[] = useMemo(() => {
    const items: UnifiedSubmissionItem[] = [];

    // Form 1: Enterprise Consultation & Form 3: Executive Inquiry
    clientInquiries.forEach((inq) => {
      const isExec = inq.form_type === 'Executive Inquiry';
      const rawSt = (inq.status || 'Pending').toLowerCase();
      let normalizedStatus: NormalizedStatus = 'NEW';
      let displayStatus: 'New' | 'Reviewed' | 'Contacted' | 'Hired' | 'Rejected' = 'New';

      if (rawSt === 'in review' || rawSt === 'reviewed') {
        normalizedStatus = 'REVIEWED';
        displayStatus = 'Reviewed';
      } else if (rawSt === 'contacted') {
        normalizedStatus = 'CONTACTED';
        displayStatus = 'Contacted';
      } else if (rawSt === 'resolved') {
        normalizedStatus = 'RESOLVED';
        displayStatus = 'Hired';
      } else if (rawSt === 'archived' || rawSt === 'rejected') {
        normalizedStatus = 'REJECTED';
        displayStatus = 'Rejected';
      } else {
        normalizedStatus = 'NEW';
        displayStatus = 'New';
      }

      const country = resolveCountry(inq.country_code);
      const name = inq.full_name || 'Anonymous User';
      const initial = (name.trim().charAt(0) || 'K').toUpperCase();

      items.push({
        id: inq.id,
        sourceForm: isExec ? 'Executive Inquiry' : 'Enterprise Consultation',
        avatarInitial: initial,
        applicantOrCompany: name,
        contactPerson: name,
        companyName: inq.company_name,
        email: inq.email,
        phone: `${inq.country_code || '+91'} ${inq.phone_number || ''}`,
        countryCode: inq.country_code || '+91',
        country,
        typeOrPosition: isExec ? (inq.enquiry_type || 'Executive Inquiry') : (inq.service_requirement || 'SAP Consulting'),
        requirementDetails: inq.requirement_details,
        status: displayStatus,
        normalizedStatus,
        rawStatus: inq.status,
        createdAt: inq.created_at || new Date().toISOString(),
        internalNotes: inq.internal_notes,
        rawRecord: inq,
      });
    });

    // Form 2: Career Applications
    applications.forEach((app) => {
      const rawSt = (app.status || 'PENDING').toUpperCase();
      let normalizedStatus: NormalizedStatus = 'NEW';
      let displayStatus: 'New' | 'Reviewed' | 'Contacted' | 'Hired' | 'Rejected' = 'New';

      if (rawSt === 'REVIEWED') {
        normalizedStatus = 'REVIEWED';
        displayStatus = 'Reviewed';
      } else if (rawSt === 'INTERVIEW_SCHEDULED') {
        normalizedStatus = 'CONTACTED';
        displayStatus = 'Contacted';
      } else if (rawSt === 'OFFERED') {
        normalizedStatus = 'RESOLVED';
        displayStatus = 'Hired';
      } else if (rawSt === 'REJECTED') {
        normalizedStatus = 'REJECTED';
        displayStatus = 'Rejected';
      } else {
        normalizedStatus = 'NEW';
        displayStatus = 'New';
      }

      const country = resolveCountry(undefined, app.location);
      const name = app.full_name || 'Candidate';
      const initial = (name.trim().charAt(0) || 'C').toUpperCase();

      items.push({
        id: app.id || `app-${Date.now()}`,
        sourceForm: 'Career Application',
        avatarInitial: initial,
        applicantOrCompany: name,
        contactPerson: name,
        companyName: null,
        email: app.email,
        phone: app.phone || 'N/A',
        countryCode: '+91',
        country,
        typeOrPosition: app.position || 'Enterprise Specialist',
        requirementDetails: null,
        experience: app.experience,
        education: app.education,
        location: app.location,
        resumeStoragePath: app.resume_storage_path,
        linkedinUrl: app.portfolio_linkedin,
        coverLetter: app.cover_letter || app.cover_note,
        status: displayStatus,
        normalizedStatus,
        rawStatus: app.status || 'PENDING',
        createdAt: app.created_at || new Date().toISOString(),
        internalNotes: app.internal_notes,
        rawRecord: app,
      });
    });

    // Sort descending by date
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }, [clientInquiries, applications]);

  // Aggregate KPI Counts for the 5 Top Cards
  const kpiCounts = useMemo(() => {
    const total = unifiedItems.length;
    const newCount = unifiedItems.filter(i => i.normalizedStatus === 'NEW').length;
    const reviewedCount = unifiedItems.filter(i => i.normalizedStatus === 'REVIEWED').length;
    const contactedCount = unifiedItems.filter(i => i.normalizedStatus === 'CONTACTED').length;
    const hiredCount = unifiedItems.filter(i => i.normalizedStatus === 'RESOLVED').length;
    return { total, newCount, reviewedCount, contactedCount, hiredCount };
  }, [unifiedItems]);

  // Form Category Counts
  const formCounts = useMemo(() => {
    const careers = unifiedItems.filter(i => i.sourceForm === 'Career Application').length;
    const enterprise = unifiedItems.filter(i => i.sourceForm === 'Enterprise Consultation').length;
    const executive = unifiedItems.filter(i => i.sourceForm === 'Executive Inquiry').length;
    return { careers, enterprise, executive };
  }, [unifiedItems]);

  // Unique Countries for Filter Dropdown
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    unifiedItems.forEach(i => {
      if (i.country) set.add(i.country);
    });
    return Array.from(set).sort();
  }, [unifiedItems]);

  // Unique Positions / Services for Filter Dropdown
  const uniquePositions = useMemo(() => {
    const set = new Set<string>();
    unifiedItems.forEach(i => {
      if (i.typeOrPosition) set.add(i.typeOrPosition);
    });
    return Array.from(set).sort();
  }, [unifiedItems]);

  // Filtered Submissions based on all active controls
  const filteredSubmissions = useMemo(() => {
    return unifiedItems.filter((item) => {
      // 1. Form Pill Filter
      if (activeFormPill === 'CAREERS' && item.sourceForm !== 'Career Application') return false;
      if (activeFormPill === 'ENTERPRISE' && item.sourceForm !== 'Enterprise Consultation') return false;
      if (activeFormPill === 'EXECUTIVE' && item.sourceForm !== 'Executive Inquiry') return false;

      // 2. Status Card / Status Filter
      if (activeStatusCard !== 'ALL' && item.normalizedStatus !== activeStatusCard) return false;
      if (statusDropdown !== 'ALL' && item.normalizedStatus !== statusDropdown) return false;

      // 3. Country Filter
      if (countryFilter !== 'ALL' && item.country !== countryFilter) return false;

      // 4. Position Filter
      if (positionFilter !== 'ALL' && item.typeOrPosition !== positionFilter) return false;

      // 5. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches = 
          item.applicantOrCompany.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          (item.companyName || '').toLowerCase().includes(q) ||
          item.typeOrPosition.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          (item.requirementDetails || '').toLowerCase().includes(q) ||
          (item.coverLetter || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    unifiedItems, 
    activeFormPill, 
    activeStatusCard, 
    statusDropdown, 
    countryFilter, 
    positionFilter, 
    searchTerm
  ]);

  // Status Change Handler with full normalization & database sync
  const handleUpdateStatus = async (item: UnifiedSubmissionItem, selectedStatus: string) => {
    let dbStatus = selectedStatus;
    let normalized: NormalizedStatus = 'NEW';
    let displayStatus: 'New' | 'Reviewed' | 'Contacted' | 'Hired' | 'Rejected' = 'New';

    if (selectedStatus === 'New' || selectedStatus === 'New / Unread' || selectedStatus === 'Pending') {
      dbStatus = item.sourceForm === 'Career Application' ? 'PENDING' : 'Pending';
      normalized = 'NEW';
      displayStatus = 'New';
    } else if (selectedStatus === 'Reviewed' || selectedStatus === 'In Review') {
      dbStatus = item.sourceForm === 'Career Application' ? 'REVIEWED' : 'In Review';
      normalized = 'REVIEWED';
      displayStatus = 'Reviewed';
    } else if (selectedStatus === 'Contacted') {
      dbStatus = item.sourceForm === 'Career Application' ? 'INTERVIEW_SCHEDULED' : 'Contacted';
      normalized = 'CONTACTED';
      displayStatus = 'Contacted';
    } else if (selectedStatus === 'Hired' || selectedStatus === 'Hired / Partnered' || selectedStatus === 'Resolved') {
      dbStatus = item.sourceForm === 'Career Application' ? 'OFFERED' : 'Resolved';
      normalized = 'RESOLVED';
      displayStatus = 'Hired';
    } else if (selectedStatus === 'Rejected' || selectedStatus === 'Archived') {
      dbStatus = item.sourceForm === 'Career Application' ? 'REJECTED' : 'Archived';
      normalized = 'REJECTED';
      displayStatus = 'Rejected';
    }

    if (item.sourceForm === 'Career Application') {
      await updateJobApplicationStatus(item.id, dbStatus as any);
      setApplications(prev => prev.map(a => a.id === item.id ? { ...a, status: dbStatus as any } : a));
    } else {
      await updateClientInquiryStatus(item.id, dbStatus as any);
      setClientInquiries(prev => prev.map(c => c.id === item.id ? { ...c, status: dbStatus as any } : c));
    }

    if (detailsModal?.id === item.id) {
      setDetailsModal(prev => prev ? { 
        ...prev, 
        status: displayStatus, 
        normalizedStatus: normalized, 
        rawStatus: dbStatus 
      } : null);
    }
    loadAllData();
  };

  // Delete Handler
  const handleDeleteItem = async (item: UnifiedSubmissionItem) => {
    if (admin?.role !== 'super_admin') {
      alert('Only Super Administrators have permissions to delete records.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete submission from ${item.applicantOrCompany}?`)) {
      if (item.sourceForm === 'Career Application') {
        await deleteRecord('career_applications', item.id);
      } else {
        await deleteClientInquiry(item.id);
      }
      if (detailsModal?.id === item.id) {
        setDetailsModal(null);
      }
      loadAllData();
    }
  };

  // Direct File Download to PC's Downloads Folder (Exclusively for Candidates / Job Seekers)
  const handleDownloadAction = async (item: UnifiedSubmissionItem) => {
    if (item.sourceForm !== 'Career Application') return;

    // Downloads the EXACT candidate resume file (PDF/DOCX) directly to PC Downloads folder
    await downloadExactCandidateFile({
      id: item.id,
      fullName: item.applicantOrCompany,
      email: item.email,
      phone: item.phone,
      location: item.location || item.country,
      position: item.typeOrPosition,
      experienceLevel: item.experience || 'Experienced',
      totalExperience: item.experience,
      education: item.education,
      portfolioLinkedin: item.linkedinUrl,
      coverLetter: item.coverLetter,
      resumeStoragePath: item.resumeStoragePath,
      submissionId: item.id,
      date: item.createdAt,
    });
  };

  // Save Note Handler
  const handleSaveNote = async () => {
    if (noteModal.type === 'client_inquiry') {
      const inq = clientInquiries.find(i => i.id === noteModal.id);
      if (inq) await updateClientInquiryStatus(noteModal.id, inq.status, noteModal.currentNote);
    } else if (noteModal.type === 'career') {
      const app = applications.find(a => a.id === noteModal.id);
      if (app) await updateJobApplicationStatus(noteModal.id, app.status, noteModal.currentNote);
    }
    setNoteModal({ isOpen: false, id: '', type: 'client_inquiry', currentNote: '', targetName: '' });
    loadAllData();
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 font-sans flex flex-col">
      
      {/* =========================================================================
          TOP NAV HEADER (MATCHING SCREENSHOT WITH KNOOVIQ INTEGRATION)
          ========================================================================= */}
      <header className="bg-[#0B1528] text-white px-4 sm:px-8 py-3.5 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
                  Admin Dashboard
                </h1>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  admin.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                }`}>
                  {admin.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Knooviq Industries — Candidate & Client Inquiries Portal
              </p>
            </div>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* View Form (/form) */}
            <button
              onClick={() => navigate('/connect')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
              title="Open public contact form"
            >
              <span>View Form (/connect)</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#132238] hover:bg-[#1a2f4c] text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="Copy portal link"
            >
              {copyFeedback ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-300" />}
              <span>{copyFeedback ? 'Copied!' : 'Copy Link'}</span>
            </button>

            {/* WhatsApp Link */}
            <button
              onClick={handleWhatsAppLink}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-colors shadow-xs"
              title="Open direct WhatsApp chat"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-white" />
              <span>WhatsApp Link</span>
            </button>

            {/* Refresh DB */}
            <button
              onClick={loadAllData}
              title="Refresh database records"
              className="p-1.5 rounded-xl bg-[#132238] hover:bg-[#1a2f4c] text-slate-300 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN BODY CONTAINER
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">

        {/* =========================================================================
            ROW 1: THE 5 STATUS KPI CARDS (MATCHING THE SCREENSHOT EXACTLY)
            ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* Card 1: TOTAL INQUIRIES */}
          <div
            onClick={() => { setActiveStatusCard('ALL'); setStatusDropdown('ALL'); }}
            className={`bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all relative select-none ${
              activeStatusCard === 'ALL'
                ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                : 'border border-slate-200/90 hover:border-blue-400 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Inbox className="h-5 w-5" />
              </div>
              {activeStatusCard === 'ALL' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {kpiCounts.total}
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL INQUIRIES
            </p>
          </div>

          {/* Card 2: NEW / UNREAD */}
          <div
            onClick={() => { setActiveStatusCard('NEW'); setStatusDropdown('NEW'); }}
            className={`bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all relative select-none ${
              activeStatusCard === 'NEW'
                ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                : 'border border-slate-200/90 hover:border-sky-400 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <Mail className="h-5 w-5" />
              </div>
              {activeStatusCard === 'NEW' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {kpiCounts.newCount}
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              NEW / UNREAD
            </p>
          </div>

          {/* Card 3: REVIEWED */}
          <div
            onClick={() => { setActiveStatusCard('REVIEWED'); setStatusDropdown('REVIEWED'); }}
            className={`bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all relative select-none ${
              activeStatusCard === 'REVIEWED'
                ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                : 'border border-slate-200/90 hover:border-amber-400 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Eye className="h-5 w-5" />
              </div>
              {activeStatusCard === 'REVIEWED' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {kpiCounts.reviewedCount}
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              REVIEWED
            </p>
          </div>

          {/* Card 4: CONTACTED */}
          <div
            onClick={() => { setActiveStatusCard('CONTACTED'); setStatusDropdown('CONTACTED'); }}
            className={`bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all relative select-none ${
              activeStatusCard === 'CONTACTED'
                ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                : 'border border-slate-200/90 hover:border-purple-400 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Phone className="h-5 w-5" />
              </div>
              {activeStatusCard === 'CONTACTED' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {kpiCounts.contactedCount}
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CONTACTED
            </p>
          </div>

          {/* Card 5: HIRED */}
          <div
            onClick={() => { setActiveStatusCard('RESOLVED'); setStatusDropdown('RESOLVED'); }}
            className={`bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all relative select-none col-span-2 sm:col-span-1 ${
              activeStatusCard === 'RESOLVED'
                ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                : 'border border-slate-200/90 hover:border-emerald-400 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              {activeStatusCard === 'RESOLVED' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {kpiCounts.hiredCount}
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              HIRED
            </p>
          </div>

        </div>

        {/* =========================================================================
            ROW 2: CATEGORY / FORM PILLS (EXACT MATCH FOR KNOOVIQ 3 FORMS)
            ========================================================================= */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pill 1: All Submissions */}
          <button
            onClick={() => setActiveFormPill('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              activeFormPill === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            All Submissions ({unifiedItems.length})
          </button>

          {/* Pill 2: Form 2 — Candidates / Job Seekers */}
          <button
            onClick={() => setActiveFormPill('CAREERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              activeFormPill === 'CAREERS'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>🧑‍💼</span>
            <span>Candidates / Job Seekers</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              activeFormPill === 'CAREERS' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {formCounts.careers}
            </span>
          </button>

          {/* Pill 3: Form 1 — Enterprise Consultations */}
          <button
            onClick={() => setActiveFormPill('ENTERPRISE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              activeFormPill === 'ENTERPRISE'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>🏢</span>
            <span>Enterprise Consultations</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              activeFormPill === 'ENTERPRISE' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {formCounts.enterprise}
            </span>
          </button>

          {/* Pill 4: Form 3 — Executive Inquiries */}
          <button
            onClick={() => setActiveFormPill('EXECUTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              activeFormPill === 'EXECUTIVE'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>💼</span>
            <span>Executive Inquiries</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              activeFormPill === 'EXECUTIVE' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {formCounts.executive}
            </span>
          </button>

          {/* System view toggle (Optional tool) */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSystemView(systemView === 'submissions' ? 'security' : 'submissions')}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
            >
              {systemView === 'submissions' ? 'View Database Health' : 'Back to Submissions'}
            </button>
          </div>
        </div>

        {/* =========================================================================
            ROW 3: SEARCH & FILTER CONTROLS BAR (EXACT MATCH FOR SCREENSHOT)
            ========================================================================= */}
        <div className="space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 shadow-xs flex flex-wrap items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, phone, details..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Country Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700">
              <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-transparent font-medium text-xs text-slate-800 outline-none cursor-pointer pr-1"
              >
                <option value="ALL">All Countries ({uniqueCountries.length})</option>
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Position / Service Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700">
              <Briefcase className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="bg-transparent font-medium text-xs text-slate-800 outline-none cursor-pointer pr-1 max-w-[180px] truncate"
              >
                <option value="ALL">All Positions ({uniquePositions.length})</option>
                {uniquePositions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700">
              <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={statusDropdown}
                onChange={(e) => {
                  setStatusDropdown(e.target.value as NormalizedStatus);
                  setActiveStatusCard(e.target.value as NormalizedStatus);
                }}
                className="bg-transparent font-medium text-xs text-slate-800 outline-none cursor-pointer pr-1"
              >
                <option value="ALL">All Status</option>
                <option value="NEW">New / Unread</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="CONTACTED">Contacted</option>
                <option value="RESOLVED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

          </div>

          {/* Showing Submissions Counter */}
          <div className="text-xs text-slate-500 font-medium px-1">
            Showing <strong className="text-slate-800">{filteredSubmissions.length}</strong> of {unifiedItems.length} submissions
          </div>
        </div>

        {/* =========================================================================
            ROW 4: SUBMISSIONS DATA TABLE (EXACT MATCH FOR SCREENSHOT)
            ========================================================================= */}
        {systemView === 'submissions' ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                {/* Table Header Row */}
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/90 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-bold">COMPANY / APPLICANT</th>
                    <th className="py-3.5 px-6 font-bold">TYPE / POSITION</th>
                    <th className="py-3.5 px-6 font-bold">COUNTRY</th>
                    <th className="py-3.5 px-6 font-bold">
                      <div className="flex items-center gap-2">
                        <span>STATUS</span>
                        <select
                          value={statusDropdown}
                          onChange={(e) => {
                            setStatusDropdown(e.target.value as NormalizedStatus);
                            setActiveStatusCard(e.target.value as NormalizedStatus);
                          }}
                          className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 outline-none cursor-pointer"
                          title="Filter status"
                        >
                          <option value="ALL">All</option>
                          <option value="NEW">New / Unread</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="RESOLVED">Hired</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </th>
                    <th className="py-3.5 px-6 font-bold">DATE</th>
                    <th className="py-3.5 px-6 font-bold text-right">ACTIONS</th>
                  </tr>
                </thead>

                {/* Table Body Rows */}
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Inbox className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-sm text-slate-600">No submissions found</p>
                        <p className="text-xs text-slate-400 mt-1">Try resetting filters or clearing your search term.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((item) => {
                      const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : '14 Nov 2026';

                      return (
                        <tr 
                          key={`${item.sourceForm}-${item.id}`}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Column 1: COMPANY / APPLICANT */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {/* Avatar initial square (matching screenshot e.g. blue square with white letter K) */}
                              <div className="h-9 w-9 rounded-xl bg-sky-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                                {item.avatarInitial}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900 text-sm">
                                    {item.applicantOrCompany}
                                  </span>
                                  {item.companyName && (
                                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {item.companyName}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  <span>{item.email}</span>
                                  <span className="mx-1">•</span>
                                  <span>{item.phone}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: TYPE / POSITION */}
                          <td className="py-4 px-6">
                            <div className="min-w-[140px]">
                              <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
                                {item.typeOrPosition}
                              </p>
                              <span className={`inline-block text-[10px] font-bold uppercase mt-1 tracking-wider ${
                                item.sourceForm === 'Career Application' 
                                  ? 'text-emerald-600' 
                                  : item.sourceForm === 'Executive Inquiry'
                                  ? 'text-purple-600'
                                  : 'text-blue-600'
                              }`}>
                                {item.sourceForm}
                              </span>
                            </div>
                          </td>

                          {/* Column 3: COUNTRY */}
                          <td className="py-4 px-6 text-slate-600 font-medium text-xs whitespace-nowrap">
                            {item.country}
                          </td>

                          {/* Column 4: STATUS (INTERACTIVE DROPDOWN WITH EXACT OPTIONS & ACCORDING DATA UPDATE) */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="relative inline-block">
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item, e.target.value)}
                                className={`appearance-none font-semibold text-xs rounded-full pl-3 pr-7 py-1 cursor-pointer outline-none transition-all shadow-2xs ${
                                  item.status === 'New'
                                    ? 'bg-blue-100/90 text-blue-700 border border-blue-300 hover:bg-blue-200'
                                    : item.status === 'Reviewed'
                                    ? 'bg-orange-100/90 text-orange-700 border border-orange-300 hover:bg-orange-200'
                                    : item.status === 'Contacted'
                                    ? 'bg-purple-100/90 text-purple-700 border border-purple-300 hover:bg-purple-200'
                                    : item.status === 'Hired'
                                    ? 'bg-emerald-100/90 text-emerald-700 border border-emerald-300 hover:bg-emerald-200'
                                    : 'bg-rose-100/90 text-rose-700 border border-rose-300 hover:bg-rose-200'
                                }`}
                              >
                                <option value="New">New / Unread</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Hired">Hired</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                              <ChevronDown className="h-3 w-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </td>

                          {/* Column 5: DATE */}
                          <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-medium text-xs">
                            {formattedDate}
                          </td>

                          {/* Column 6: ACTIONS (3 ROUNDED ACTION ICONS) */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Green Download icon - EXCLUSIVELY FOR CANDIDATES / JOB SEEKERS */}
                              {item.sourceForm === 'Career Application' && (
                                <button
                                  onClick={() => handleDownloadAction(item)}
                                  title="Download candidate dossier to your PC"
                                  className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}

                              {/* Blue Eye icon (View Details Modal) */}
                              <button
                                onClick={() => setDetailsModal(item)}
                                title="View full submission details"
                                className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {/* Red Trash icon (Delete Record for Super Admin) */}
                              <button
                                onClick={() => handleDeleteItem(item)}
                                title="Delete submission record"
                                className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* =========================================================================
              SYSTEM HEALTH & RLS AUDIT VIEW
              ========================================================================= */
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">System Health & Database Architecture</h3>
                <p className="text-xs text-slate-500">PostgreSQL RLS matrix verifying KNOOVIQ 3 forms data mapping.</p>
              </div>
              <button
                onClick={() => setSystemView('submissions')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Back to Submissions
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Form 1: Enterprise Consultation</span>
                <p className="font-bold text-slate-800">Table: client_inquiries</p>
                <p className="text-slate-500">Filtered by: form_type = &apos;Enterprise Consultation&apos;</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Form 2: Career Application</span>
                <p className="font-bold text-slate-800">Table: career_applications</p>
                <p className="text-slate-500">Storage: career-resumes (Private Signed URLs)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Form 3: Executive Inquiry</span>
                <p className="font-bold text-slate-800">Table: client_inquiries</p>
                <p className="text-slate-500">Filtered by: form_type = &apos;Executive Inquiry&apos;</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL: SUBMISSION DETAILS VIEW (ALL 3 FORMS ANALYZED & ADAPTED)
          ========================================================================= */}
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-900">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    detailsModal.sourceForm === 'Career Application'
                      ? 'bg-emerald-100 text-emerald-800'
                      : detailsModal.sourceForm === 'Executive Inquiry'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {detailsModal.sourceForm}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {detailsModal.id}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  {detailsModal.applicantOrCompany}
                </h3>
                <p className="text-xs text-blue-600 font-bold">
                  {detailsModal.typeOrPosition} {detailsModal.companyName ? `• ${detailsModal.companyName}` : ''}
                </p>
              </div>

              <button
                onClick={() => setDetailsModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Email Address</span>
                <a href={`mailto:${detailsModal.email}`} className="text-sm font-bold text-blue-600 hover:underline break-all">
                  {detailsModal.email}
                </a>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Phone Number</span>
                <a href={`tel:${detailsModal.phone}`} className="text-sm font-bold text-slate-900 hover:underline">
                  {detailsModal.phone}
                </a>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Country / Location</span>
                <span className="text-sm font-bold text-slate-800 block">
                  {detailsModal.country} {detailsModal.location ? `(${detailsModal.location})` : ''}
                </span>
              </div>

              {/* Status Selector Inside Modal */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Change Status</span>
                <select
                  value={detailsModal.rawStatus}
                  onChange={(e) => handleUpdateStatus(detailsModal, e.target.value)}
                  className="rounded-lg bg-white border border-slate-300 px-2.5 py-1 text-xs font-bold text-blue-700 focus:outline-none"
                >
                  <option value="Pending">Pending / New</option>
                  <option value="In Review">In Review / Reviewed</option>
                  <option value="Contacted">Contacted / Interview</option>
                  <option value="Resolved">Resolved / Offered</option>
                  <option value="Archived">Archived / Rejected</option>
                </select>
              </div>
            </div>

            {/* Form 2 Specific: Experience, Qualification, Resume & LinkedIn */}
            {detailsModal.sourceForm === 'Career Application' && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Experience Level</span>
                    <span className="font-bold text-slate-900 text-sm">{detailsModal.experience || 'Not specified'}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Highest Qualification</span>
                    <span className="font-bold text-slate-900 text-sm">{detailsModal.education || 'Graduate'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {detailsModal.resumeStoragePath && (
                    <button
                      onClick={() => handleDownloadAction(detailsModal)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Download Secure Candidate Resume</span>
                    </button>
                  )}

                  {detailsModal.linkedinUrl && (
                    <a
                      href={detailsModal.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-blue-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {detailsModal.coverLetter && (
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Cover Letter / Message</span>
                    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {detailsModal.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Form 1 & Form 3 Specific: Requirement Details */}
            {(detailsModal.sourceForm === 'Enterprise Consultation' || detailsModal.sourceForm === 'Executive Inquiry') && detailsModal.requirementDetails && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Requirement Details (Max 500 words)</span>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 max-h-48 overflow-y-auto">
                  <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {detailsModal.requirementDetails}
                  </p>
                </div>
              </div>
            )}

            {/* Internal Review Notes */}
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Internal Admin Review Note</span>
                <button
                  onClick={() => setNoteModal({
                    isOpen: true,
                    id: detailsModal.id,
                    type: detailsModal.sourceForm === 'Career Application' ? 'career' : 'client_inquiry',
                    currentNote: detailsModal.internalNotes || '',
                    targetName: detailsModal.applicantOrCompany,
                  })}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>{detailsModal.internalNotes ? 'Edit' : 'Add Note'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-700">
                {detailsModal.internalNotes || <span className="text-slate-400 italic">No internal notes added yet.</span>}
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>Submitted: {detailsModal.createdAt ? new Date(detailsModal.createdAt).toLocaleString() : 'Recent'}</span>
              <div className="flex items-center gap-2">
                {admin.role === 'super_admin' && (
                  <button
                    onClick={() => handleDeleteItem(detailsModal)}
                    className="px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors"
                  >
                    Delete Record
                  </button>
                )}
                <button
                  onClick={() => setDetailsModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RESUME SIGNED PREVIEW
          ========================================================================= */}
      {resumeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mx-auto">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">Candidate Resume Token</h3>
            <p className="text-xs text-slate-500">
              Generating 15-minute temporary authorized link for: <strong className="text-slate-800">{resumeModal.candidateName}</strong>
            </p>

            {resumeModal.loading ? (
              <div className="py-4 text-xs text-blue-600 font-bold animate-pulse">Generating cryptographic token...</div>
            ) : resumeModal.signedUrl ? (
              <div className="space-y-4 pt-2">
                <a
                  href={resumeModal.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Open Candidate Resume Document
                </a>
                <span className="text-[10px] text-slate-400 block">Token valid for 900 seconds.</span>
              </div>
            ) : (
              <p className="text-xs text-rose-500">File not found in storage bucket.</p>
            )}

            <button
              onClick={() => setResumeModal({ isOpen: false, candidateName: '', signedUrl: null, loading: false })}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT INTERNAL NOTE
          ========================================================================= */}
      {noteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Internal Administrator Note</h3>
                {noteModal.targetName && (
                  <p className="text-xs text-blue-600 mt-0.5">Regarding: {noteModal.targetName}</p>
                )}
              </div>
              <button 
                onClick={() => setNoteModal({ isOpen: false, id: '', type: 'client_inquiry', currentNote: '', targetName: '' })} 
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={noteModal.currentNote}
              onChange={(e) => setNoteModal(prev => ({ ...prev, currentNote: e.target.value }))}
              rows={4}
              placeholder="Add confidential review notes, assessment criteria, or follow-up action items..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNoteModal({ isOpen: false, id: '', type: 'client_inquiry', currentNote: '', targetName: '' })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
