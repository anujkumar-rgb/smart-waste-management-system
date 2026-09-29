/* ==========================================================================
   SMART WASTE MANAGEMENT SYSTEM - APPLICATION ENGINE
   Municipal Urban Services Platform (Software-Only Multi-Role Architecture)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDataStores();
  initAuth();
  initVoiceRecorder();
  initSegregationGuide();
  checkSession();
});

/* ==========================================================================
   1. THEME ENGINE (LIGHT & DARK CIVIC TOKENS)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = [document.getElementById('themeToggleBtn'), document.getElementById('guestThemeToggleBtn')];
  const savedTheme = localStorage.getItem('swm_theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggleBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('swm_theme', newTheme);
        updateThemeIcons(newTheme);
      });
    }
  });
}

function updateThemeIcons(theme) {
  const btns = [document.getElementById('themeToggleBtn'), document.getElementById('guestThemeToggleBtn')];
  btns.forEach(btn => {
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

/* ==========================================================================
   2. DATA STORES & SEED ENTITIES
   ========================================================================== */
const SEED_USERS = [
  { 
    id: 'usr-1', 
    email: 'citizen@ecoclear.org', 
    pass: 'demo123', 
    name: 'Ananya Sharma', 
    role: 'citizen', 
    credits: 85,
    transactions: [
      { date: '2026-09-21 10:15', reason: 'Initial Registration Bonus', amount: 30 },
      { date: '2026-09-22 14:30', reason: 'Bin Report REP-1001 Filed', amount: 5 },
      { date: '2026-09-23 09:00', reason: 'Photo Segregation Verified Bonus', amount: 15 },
      { date: '2026-09-23 11:20', reason: 'Emergency Hazard Alert EMG-402', amount: 25 },
      { date: '2026-09-23 11:45', reason: 'Redeemed Digital Eco-Champion Badge', amount: 0 }
    ]
  },
  { 
    id: 'usr-2', 
    email: 'school@cityedu.org', 
    pass: 'demo123', 
    name: 'Delhi Public School, Sector 12', 
    role: 'institution', 
    institutionType: 'school',
    schoolName: 'Delhi Public School, Sector 12',
    verificationCode: 'INST-SCH-8821',
    branches: [
      { id: 'br-dps-main', name: 'Sector 12 Senior Campus', ward: 'Ward 18 - Sector 62 Tech Hub', address: 'Plot 4, Institutional Area, Sector 12', lat: 28.5920, lng: 77.2280 },
      { id: 'br-dps-junior', name: 'Sector 4 Junior Wing', ward: 'Ward 04 - MG Road & Commercial Center', address: 'Near City Square, Sector 4', lat: 28.6270, lng: 77.2180 }
    ],
    activeBranchId: 'br-dps-main',
    recurringSchedule: { frequency: 'daily', timeSlot: '06:00 - 08:00 AM' },
    selfAudits: [
      { date: '2026-09-15', rate: 92, stream: 'Wet Canteen & Food Waste' }
    ]
  },
  { 
    id: 'usr-6', 
    email: 'infosys@campus.org', 
    pass: 'demo123', 
    name: 'Infosys Ltd, Whitefield Campus', 
    role: 'institution', 
    institutionType: 'company',
    companyName: 'Infosys Ltd, Whitefield Campus',
    businessType: 'IT / Tech Office',
    verificationCode: 'CORP-INFY-4401',
    branches: [
      { id: 'br-infy-main', name: 'Whitefield Main Tech Park', ward: 'Ward 18 - Sector 62 Tech Hub', address: 'Plot 22, Software Innovation Corridor', lat: 28.5880, lng: 77.2210 },
      { id: 'br-infy-dev', name: 'Development Center Wing B', ward: 'Ward 04 - MG Road & Commercial Center', address: 'Tower 3, Central IT Plaza', lat: 28.6210, lng: 77.2130 }
    ],
    activeBranchId: 'br-infy-main',
    recurringSchedule: { frequency: 'daily', timeSlot: '20:00 - 22:00 PM' },
    selfAudits: [
      { date: '2026-09-18', rate: 95, stream: 'Paper & Packaging Cardboard' }
    ]
  },
  { 
    id: 'usr-3', 
    email: 'citycare@hospital.org', 
    pass: 'demo123', 
    name: 'CityCare Super Specialty Hospital', 
    role: 'hospital', 
    verificationCode: 'HOSP-NABH-4019',
    hazardThreshold: 25,
    credits: 60,
    transactions: [
      { date: '2026-09-20 08:00', reason: 'Biomedical Waste Registration', amount: 10 },
      { date: '2026-09-22 16:30', reason: 'Hazardous Stream Clearance Compliant', amount: 50 }
    ]
  },
  { 
    id: 'usr-4', 
    email: 'crew101@cleanward.org', 
    pass: 'demo123', 
    name: 'Rajesh Singh (Crew #101)', 
    role: 'worker', 
    verificationCode: 'WRK-101' 
  },
  { 
    id: 'usr-5', 
    email: 'admin@citygov.org', 
    pass: 'demo123', 
    name: 'Municipal Sanitation Officer', 
    role: 'admin', 
    verificationCode: 'ADMIN2026' 
  }
];

const SEED_REPORTS = [
  {
    id: 'REP-1001',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward 04 - MG Road & Commercial Center',
    coords: { lat: 28.6250, lng: 77.2150 },
    latitude: 28.6250,
    longitude: 77.2150,
    landmark: 'City Plaza Market Gate 2 Bin Point',
    resolvedAddress: 'City Plaza Market Gate 2, MG Road, Ward 04',
    category: 'plastic',
    severity: 'overflowing',
    notes: 'Plastic packaging spillage blocking pedestrian footpath.',
    isEmergency: false,
    status: 'reported',
    createdAt: Date.now() - 45 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  },
  {
    id: 'REP-1002',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward 12 - Indiranagar Residential',
    coords: { lat: 28.6050, lng: 77.1950 },
    latitude: 28.6050,
    longitude: 77.1950,
    landmark: 'Community Park Main Gate',
    resolvedAddress: 'Indiranagar 5th Cross, Community Park Gate, Ward 12',
    category: 'organic',
    severity: 'full',
    notes: 'Dry leaves and organic bins filled after morning sweep.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-4',
    assignedWorkerName: 'Rajesh Singh (Crew #101)',
    createdAt: Date.now() - (26 * 60 * 60 * 1000),
    assignedAt: Date.now() - (25 * 60 * 60 * 1000),
    duplicateCount: 2,
    isEscalated: true
  },
  {
    id: 'BULK-2001',
    userId: 'usr-2',
    userName: 'Delhi Public School, Sector 12',
    institutionType: 'school',
    schoolName: 'Delhi Public School, Sector 12',
    branchId: 'br-dps-main',
    branchName: 'Sector 12 Senior Campus',
    userRole: 'institution',
    area: 'Ward 18 - Sector 62 Tech Hub',
    coords: { lat: 28.5920, lng: 77.2280 },
    latitude: 28.5920,
    longitude: 77.2280,
    landmark: 'School Cafeteria Loading Dock',
    resolvedAddress: 'Plot 4 Institutional Area, Sector 12, Ward 18',
    category: 'commercial_food',
    severity: 'overflowing',
    notes: 'Bulk organic food waste from annual school environmental assembly.',
    isBulk: true,
    volumeKg: 350,
    containerCount: 5,
    isEmergency: false,
    status: 'reported',
    createdAt: Date.now() - 30 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  },
  {
    id: 'BULK-2002',
    userId: 'usr-6',
    userName: 'Infosys Ltd, Whitefield Campus',
    institutionType: 'company',
    companyName: 'Infosys Ltd, Whitefield Campus',
    businessType: 'IT / Tech Office',
    branchId: 'br-infy-main',
    branchName: 'Whitefield Main Tech Park',
    userRole: 'institution',
    area: 'Ward 18 - Sector 62 Tech Hub',
    coords: { lat: 28.5880, lng: 77.2210 },
    latitude: 28.5880,
    longitude: 77.2210,
    landmark: 'Server Room Recycling Bay #3',
    resolvedAddress: 'Plot 22 Software Innovation Corridor, Ward 18',
    category: 'office_paper',
    severity: 'full',
    notes: 'Disposal of 420 kg confidential shredded documentation and corrugated paperboard.',
    isBulk: true,
    volumeKg: 420,
    containerCount: 6,
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-4',
    assignedWorkerName: 'Rajesh Singh (Crew #101)',
    createdAt: Date.now() - 60 * 60 * 1000,
    assignedAt: Date.now() - 40 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  }
];

const SEED_HOSPITAL_REPORTS = [
  {
    id: 'BMW-3001',
    userId: 'usr-3',
    userName: 'CityCare Super Specialty Hospital',
    registrationNo: 'HOSP-NABH-4019',
    category: 'biomed_yellow',
    categoryName: '🟡 Yellow: Human Anatomical & Soiled Waste',
    hospitalWard: 'ICU Wing 3',
    containerCode: 'BMW-BAG-8841',
    volumeKg: 14.5,
    lifecycleStage: 'In Transit',
    treatmentFacility: 'CBWTF Sector 9 Central Treatment Plant',
    status: 'assigned',
    createdAt: Date.now() - 90 * 60 * 1000
  },
  {
    id: 'BMW-3002',
    userId: 'usr-3',
    userName: 'CityCare Super Specialty Hospital',
    registrationNo: 'HOSP-NABH-4019',
    category: 'biomed_red',
    categoryName: '🔴 Red: Contaminated Infectious Tubing & Gloves',
    hospitalWard: 'Operation Theatre #2',
    containerCode: 'BMW-BAG-9912',
    volumeKg: 12.0,
    lifecycleStage: 'Registered',
    treatmentFacility: 'Eco-Care Incinerator & Autoclave Unit 4',
    status: 'reported',
    createdAt: Date.now() - 180 * 60 * 1000
  }
];

const SEED_HOSPITAL_STAFF = [
  { id: 'st-1', name: 'Dr. Ramesh Kulkarni', department: 'Surgery & OT', date: '2026-08-14', certStatus: 'Certified (Valid until 2027)' },
  { id: 'st-2', name: 'Nurse Sunita Rao', department: 'ICU Critical Care', date: '2026-09-02', certStatus: 'Certified (Annual Refresher Complete)' },
  { id: 'st-3', name: 'Vikas Mehra (Sanitation Lead)', department: 'Hospital Bio-Waste Logistics', date: '2026-07-20', certStatus: 'Certified (Valid until 2027)' }
];

const SEED_REDEMPTIONS = [
  { 
    id: 'RED-501', 
    userId: 'usr-1', 
    userName: 'Ananya Sharma', 
    itemId: 'digital_badge', 
    itemName: 'Digital Eco-Champion Badge', 
    creditCost: 0, 
    status: 'Fulfilled', 
    requestedAt: Date.now() - (24 * 60 * 60 * 1000), 
    fulfilledAt: Date.now() - (24 * 60 * 60 * 1000) 
  },
  { 
    id: 'RED-502', 
    userId: 'usr-1', 
    userName: 'Ananya Sharma', 
    itemId: 'sapling', 
    itemName: 'Sapling / Native Fruit Plant', 
    creditCost: 50, 
    status: 'Requested', 
    requestedAt: Date.now() - (3 * 60 * 60 * 1000), 
    fulfilledAt: null 
  }
];

const SEED_COMPLIANCE_METRICS = [
  { ward: 'Ward 04 - MG Road & Commercial Center', segregationRate: 74, coverageRate: 92, processingRate: 85, status: 'ontrack' },
  { ward: 'Ward 12 - Indiranagar Residential', segregationRate: 68, coverageRate: 88, processingRate: 82, status: 'ontrack' },
  { ward: 'Ward 18 - Sector 62 Tech Hub', segregationRate: 78, coverageRate: 86, processingRate: 80, status: 'ontrack' },
  { ward: 'Ward 07 - Civil Lines Market', segregationRate: 44, coverageRate: 68, processingRate: 59, status: 'offtarget' },
  { ward: 'Ward 02 - Central Railway Station', segregationRate: 62, coverageRate: 84, processingRate: 81, status: 'ontrack' }
];

const SEED_FLEET = [
  { id: 'FLT-CT-401', type: 'Heavy Hydraulic Compactor (10T)', regNo: 'DL-01-GA-4401', ward: 'Ward 04 - MG Road & Commercial Center', driver: 'Rajesh Singh', contact: '+91 98112-40192', capacityTon: 10.0, currentPayloadTon: 7.8, fuelPercent: 84, status: 'Active Collection', icon: '🚛' },
  { id: 'FLT-ET-108', type: 'Electric Multi-Bin Tipper Auto (1.5T)', regNo: 'DL-04-EV-1088', ward: 'Ward 12 - Indiranagar Residential', driver: 'Sunita Devi', contact: '+91 98711-20984', capacityTon: 1.5, currentPayloadTon: 1.35, fuelPercent: 68, status: 'Transfer Station Transit', icon: '🛺' },
  { id: 'FLT-BM-09', type: 'Biomedical Closed-Chamber Van (2T)', regNo: 'DL-02-HA-0912', ward: 'Ward 18 - Sector 62 Tech Hub', driver: 'Amit Verma', contact: '+91 98104-55120', capacityTon: 2.0, currentPayloadTon: 0.7, fuelPercent: 92, status: 'En Route to CBWTF', icon: '🚐' },
  { id: 'FLT-CD-550', type: 'C&D Debris Hydraulic Dumper (14T)', regNo: 'DL-07-CD-5501', ward: 'Ward 07 - Civil Lines Market', driver: 'Harish Kumar', contact: '+91 98119-33829', capacityTon: 14.0, currentPayloadTon: 8.4, fuelPercent: 76, status: 'Active Route', icon: '🚜' }
];

let currentUser = null;
let citizenFilter = 'all';

function initDataStores() {
  if (!localStorage.getItem('swm_users')) localStorage.setItem('swm_users', JSON.stringify(SEED_USERS));
  if (!localStorage.getItem('swm_reports')) localStorage.setItem('swm_reports', JSON.stringify(SEED_REPORTS));
  if (!localStorage.getItem('swm_hospital_reports')) localStorage.setItem('swm_hospital_reports', JSON.stringify(SEED_HOSPITAL_REPORTS));
  if (!localStorage.getItem('swm_hospital_staff')) localStorage.setItem('swm_hospital_staff', JSON.stringify(SEED_HOSPITAL_STAFF));
  if (!localStorage.getItem('swm_redemptions')) localStorage.setItem('swm_redemptions', JSON.stringify(SEED_REDEMPTIONS));
  if (!localStorage.getItem('swm_compliance_metrics')) localStorage.setItem('swm_compliance_metrics', JSON.stringify(SEED_COMPLIANCE_METRICS));
  if (!localStorage.getItem('swm_fleet')) localStorage.setItem('swm_fleet', JSON.stringify(SEED_FLEET));
}

function getFleet() { return JSON.parse(localStorage.getItem('swm_fleet') || '[]'); }
function saveFleet(f) { localStorage.setItem('swm_fleet', JSON.stringify(f)); }

function getUsers() { return JSON.parse(localStorage.getItem('swm_users') || '[]'); }
function saveUsers(u) { localStorage.setItem('swm_users', JSON.stringify(u)); }

function getReports() { return JSON.parse(localStorage.getItem('swm_reports') || '[]'); }
function saveReports(r) { localStorage.setItem('swm_reports', JSON.stringify(r)); }

function getHospitalReports() { return JSON.parse(localStorage.getItem('swm_hospital_reports') || '[]'); }
function saveHospitalReports(r) { localStorage.setItem('swm_hospital_reports', JSON.stringify(r)); }

function getHospitalStaff() { return JSON.parse(localStorage.getItem('swm_hospital_staff') || '[]'); }
function saveHospitalStaff(s) { localStorage.setItem('swm_hospital_staff', JSON.stringify(s)); }

function getRedemptions() { return JSON.parse(localStorage.getItem('swm_redemptions') || '[]'); }
function saveRedemptions(r) { localStorage.setItem('swm_redemptions', JSON.stringify(r)); }

/* ==========================================================================
   3. AUTHENTICATION & EXTENDED INSTITUTION SIGNUP
   ========================================================================== */
function initAuth() {
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const signupRole = document.getElementById('signupRole');
  const signupInstType = document.getElementById('signupInstType');
  const institutionTypeGroup = document.getElementById('institutionTypeGroup');
  const schoolFieldGroup = document.getElementById('schoolFieldGroup');
  const companyFieldGroup = document.getElementById('companyFieldGroup');
  const businessTypeFieldGroup = document.getElementById('businessTypeFieldGroup');
  const verificationFieldGroup = document.getElementById('verificationFieldGroup');
  const verificationLabel = document.getElementById('verificationLabel');
  const logoutBtn = document.getElementById('logoutBtn');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  });

  function updateSignupRoleFields() {
    const role = signupRole.value;
    if (role === 'institution') {
      institutionTypeGroup.style.display = 'block';
      updateInstitutionTypeFields();
      verificationFieldGroup.style.display = 'block';
      verificationLabel.textContent = 'Institution Registration Code';
    } else {
      institutionTypeGroup.style.display = 'none';
      schoolFieldGroup.style.display = 'none';
      companyFieldGroup.style.display = 'none';
      businessTypeFieldGroup.style.display = 'none';

      if (role === 'citizen') {
        verificationFieldGroup.style.display = 'none';
      } else {
        verificationFieldGroup.style.display = 'block';
        if (role === 'hospital') verificationLabel.textContent = 'NABH License / Hospital Registration ID';
        if (role === 'worker') verificationLabel.textContent = 'Sanitation Crew Badge ID';
        if (role === 'admin') verificationLabel.textContent = 'Admin Secret Master Passcode';
      }
    }
  }

  function updateInstitutionTypeFields() {
    const type = signupInstType.value;
    if (type === 'school') {
      schoolFieldGroup.style.display = 'block';
      companyFieldGroup.style.display = 'none';
      businessTypeFieldGroup.style.display = 'none';
      document.getElementById('signupSchoolName').setAttribute('required', 'true');
      document.getElementById('signupCompanyName').removeAttribute('required');
    } else if (type === 'company') {
      schoolFieldGroup.style.display = 'none';
      companyFieldGroup.style.display = 'block';
      businessTypeFieldGroup.style.display = 'block';
      document.getElementById('signupCompanyName').setAttribute('required', 'true');
      document.getElementById('signupSchoolName').removeAttribute('required');
    } else {
      schoolFieldGroup.style.display = 'none';
      companyFieldGroup.style.display = 'none';
      businessTypeFieldGroup.style.display = 'none';
      document.getElementById('signupSchoolName').removeAttribute('required');
      document.getElementById('signupCompanyName').removeAttribute('required');
    }
  }

  signupRole.addEventListener('change', updateSignupRoleFields);
  signupInstType.addEventListener('change', updateInstitutionTypeFields);

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

    if (found) {
      setCurrentUser(found);
    } else {
      alert('Invalid login credentials! Please use one of the quick test login buttons below.');
    }
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = document.getElementById('signupPassword').value;
    const role = signupRole.value;
    const instType = signupInstType.value;
    const schoolName = document.getElementById('signupSchoolName').value.trim();
    const companyName = document.getElementById('signupCompanyName').value.trim();
    const businessType = document.getElementById('signupBusinessType').value;
    const verificationCode = document.getElementById('signupVerificationCode').value.trim();

    if (role === 'institution') {
      if (instType === 'school' && !schoolName) {
        alert('School Name is required when registering an educational institution.');
        return;
      }
      if (instType === 'company' && !companyName) {
        alert('Company Name is required when registering a corporate office institution.');
        return;
      }
    }

    if (role !== 'citizen' && !verificationCode) {
      alert(`Registration ID is required for official role: ${role.toUpperCase()}`);
      return;
    }
    if (role === 'admin' && verificationCode !== 'ADMIN2026') {
      alert('Incorrect Admin Secret Passcode! (Use "ADMIN2026")');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert('An account with this email address already exists!');
      return;
    }

    const primaryOrgName = (role === 'institution') 
      ? (instType === 'school' ? schoolName : (instType === 'company' ? companyName : name))
      : name;

    const newUser = {
      id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
      name: primaryOrgName,
      contactPerson: name,
      email,
      pass,
      role,
      institutionType: role === 'institution' ? instType : null,
      schoolName: role === 'institution' && instType === 'school' ? schoolName : null,
      companyName: role === 'institution' && instType === 'company' ? companyName : null,
      businessType: role === 'institution' && instType === 'company' ? businessType : null,
      verificationCode,
      credits: (role === 'citizen' || role === 'hospital') ? 30 : 0,
      branches: role === 'institution' ? [
        { id: 'br-main', name: 'Main Campus / Facility', address: 'Loading Gate #1', ward: 'Ward 18 - Sector 62 Tech Hub', lat: 28.59, lng: 77.225 }
      ] : null,
      activeBranchId: role === 'institution' ? 'br-main' : null,
      recurringSchedule: role === 'institution' ? { frequency: 'daily', timeSlot: '06:00 - 08:00 AM' } : null,
      selfAudits: role === 'institution' ? [{ date: new Date().toISOString().slice(0, 10), rate: 85, stream: 'General' }] : null,
      hazardThreshold: role === 'hospital' ? 25 : null,
      transactions: [
        { date: new Date().toISOString().replace('T', ' ').slice(0, 16), reason: 'Registration Welcome Bonus', amount: 30 }
      ]
    };

    users.push(newUser);
    saveUsers(users);
    alert(`Account created for ${primaryOrgName} (${role.toUpperCase()})!`);
    setCurrentUser(newUser);
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('swm_current_user');
    currentUser = null;
    checkSession();
  });
}

window.quickLogin = function(email) {
  const users = getUsers();
  const found = users.find(u => u.email === email);
  if (found) setCurrentUser(found);
};

function setCurrentUser(user) {
  currentUser = user;
  localStorage.setItem('swm_current_user', JSON.stringify(user));
  checkSession();
}

function checkSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam) {
    const roleEmailMap = {
      citizen: 'citizen@ecoclear.org',
      school: 'school@cityedu.org',
      company: 'infosys@campus.org',
      hospital: 'citycare@hospital.org',
      worker: 'crew101@cleanward.org',
      admin: 'admin@citygov.org'
    };
    const targetEmail = roleEmailMap[roleParam];
    if (targetEmail) {
      const users = getUsers();
      const found = users.find(u => u.email === targetEmail);
      if (found) {
        currentUser = found;
        localStorage.setItem('swm_current_user', JSON.stringify(found));
      }
    }
  }
  const authTabParam = urlParams.get('tab');
  if (authTabParam === 'signup') {
    const tabSignup = document.getElementById('tabSignup');
    if (tabSignup) tabSignup.click();
  }
  const themeParam = urlParams.get('theme');
  if (themeParam === 'dark' || themeParam === 'light') {
    document.documentElement.setAttribute('data-theme', themeParam);
  }

  const stored = localStorage.getItem('swm_current_user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
    } catch (e) {
      currentUser = null;
    }
  } else {
    currentUser = null;
  }

  const authView = document.getElementById('authView');
  const navUserBar = document.getElementById('navUserBar');
  const navGuestBar = document.getElementById('navGuestBar');
  const allViews = document.querySelectorAll('.dashboard-view');

  allViews.forEach(v => v.classList.remove('active'));

  if (!currentUser) {
    authView.style.display = 'grid';
    navUserBar.style.display = 'none';
    navGuestBar.style.display = 'flex';
  } else {
    authView.style.display = 'none';
    navGuestBar.style.display = 'none';
    navUserBar.style.display = 'flex';

    document.getElementById('navUserName').textContent = currentUser.name;
    const pill = document.getElementById('navUserRolePill');
    pill.textContent = currentUser.role.toUpperCase();
    pill.className = `role-pill role-${currentUser.role}`;

    if (currentUser.role === 'citizen') {
      document.getElementById('citizenDashboard').classList.add('active');
      renderCitizenDashboard();
    } else if (currentUser.role === 'institution') {
      document.getElementById('institutionDashboard').classList.add('active');
      renderInstitutionDashboard();
    } else if (currentUser.role === 'hospital') {
      document.getElementById('hospitalDashboard').classList.add('active');
      renderHospitalDashboard();
    } else if (currentUser.role === 'worker') {
      document.getElementById('workerDashboard').classList.add('active');
      renderWorkerDashboard();
    } else if (currentUser.role === 'admin') {
      document.getElementById('adminDashboard').classList.add('active');
      renderAdminDashboard();
    }
  }
}

/* ==========================================================================
   4. REAL LOCATION PICKER ENGINE (LEAFLET + NOMINATIM REVERSE GEOCODING)
   ========================================================================== */
let citizenPickerMap = null;
let citizenPickerMarker = null;
let instPickerMap = null;
let instPickerMarker = null;

function initLeafletLocationPicker(role) {
  const isCitizen = role === 'citizen';
  const mapContainerId = isCitizen ? 'citizenMapPicker' : 'instMapPicker';
  const latInputId = isCitizen ? 'citizenLat' : 'instLat';
  const lngInputId = isCitizen ? 'citizenLng' : 'instLng';
  const landmarkInputId = isCitizen ? 'citizenLandmark' : 'instLandmark';
  const badgeId = isCitizen ? 'citizenCoordBadge' : 'instCoordBadge';
  const statusId = isCitizen ? 'citizenLocStatus' : 'instLocStatus';

  const mapElem = document.getElementById(mapContainerId);
  if (!mapElem) return;

  const defaultLat = isCitizen ? 28.6139 : 28.5900;
  const defaultLng = isCitizen ? 77.2090 : 77.2250;

  if (isCitizen && citizenPickerMap) {
    citizenPickerMap.invalidateSize();
    return;
  }
  if (!isCitizen && instPickerMap) {
    instPickerMap.invalidateSize();
    return;
  }

  const map = L.map(mapContainerId, { zoomControl: true }).setView([defaultLat, defaultLng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

  function updateCoords(lat, lng) {
    const fixedLat = Number(lat.toFixed(5));
    const fixedLng = Number(lng.toFixed(5));
    document.getElementById(latInputId).value = fixedLat;
    document.getElementById(lngInputId).value = fixedLng;
    document.getElementById(badgeId).textContent = `Lat: ${fixedLat}, Lng: ${fixedLng}`;
    reverseGeocode(fixedLat, fixedLng, landmarkInputId, statusId);
  }

  marker.on('dragend', (e) => {
    const pos = e.target.getLatLng();
    updateCoords(pos.lat, pos.lng);
  });

  map.on('click', (e) => {
    marker.setLatLng(e.latlng);
    updateCoords(e.latlng.lat, e.latlng.lng);
  });

  if (isCitizen) {
    citizenPickerMap = map;
    citizenPickerMarker = marker;
  } else {
    instPickerMap = map;
    instPickerMarker = marker;
  }

  setTimeout(() => map.invalidateSize(), 200);
}

function reverseGeocode(lat, lng, landmarkInputId, statusId) {
  const statusElem = document.getElementById(statusId);
  if (statusElem) statusElem.textContent = 'Resolving street address via OpenStreetMap...';

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.display_name) {
        const landmarkInput = document.getElementById(landmarkInputId);
        if (landmarkInput) landmarkInput.value = data.display_name;
        if (statusElem) statusElem.textContent = '📍 Address resolved: ' + data.display_name.slice(0, 60) + '...';
      } else {
        if (statusElem) statusElem.textContent = 'Coordinates pinned. Enter specific landmark details.';
      }
    })
    .catch(() => {
      if (statusElem) statusElem.textContent = 'Pin placed at exact GPS coordinates.';
    });
}

window.locateUser = function(role) {
  const isCitizen = role === 'citizen';
  const statusElem = document.getElementById(isCitizen ? 'citizenLocStatus' : 'instLocStatus');

  if (!navigator.geolocation) {
    if (statusElem) statusElem.textContent = 'Geolocation is not supported by this browser. Pin manually on map.';
    return;
  }

  if (statusElem) statusElem.textContent = 'Requesting device GPS coordinates...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const map = isCitizen ? citizenPickerMap : instPickerMap;
      const marker = isCitizen ? citizenPickerMarker : instPickerMarker;
      const latInputId = isCitizen ? 'citizenLat' : 'instLat';
      const lngInputId = isCitizen ? 'citizenLng' : 'instLng';
      const badgeId = isCitizen ? 'citizenCoordBadge' : 'instCoordBadge';
      const landmarkInputId = isCitizen ? 'citizenLandmark' : 'instLandmark';

      if (map && marker) {
        map.setView([lat, lng], 16);
        marker.setLatLng([lat, lng]);
        document.getElementById(latInputId).value = Number(lat.toFixed(5));
        document.getElementById(lngInputId).value = Number(lng.toFixed(5));
        document.getElementById(badgeId).textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
        reverseGeocode(lat, lng, landmarkInputId, isCitizen ? 'citizenLocStatus' : 'instLocStatus');
      }
    },
    (error) => {
      if (statusElem) {
        statusElem.textContent = '⚠️ Location permission denied or unavailable. Tap or drag the pin on the map instead.';
      }
    },
    { timeout: 8000 }
  );
};

/* ==========================================================================
   5. CITIZEN DASHBOARD: SEVERITY SELECTOR, VOICE RECORDER & CREDIT STORE
   ========================================================================== */
function renderCitizenDashboard() {
  document.getElementById('citizenWelcomeName').textContent = currentUser.name;
  document.getElementById('citizenCreditBalance').textContent = `${currentUser.credits || 0} credits`;
  document.getElementById('storeHeaderBalance').textContent = currentUser.credits || 0;

  setTimeout(() => initLeafletLocationPicker('citizen'), 150);

  const segForm = document.getElementById('segregationCheckForm');
  if (segForm) {
    segForm.onsubmit = (e) => {
      e.preventDefault();
      awardCredits(15, 'Verified Source Segregation Photo Bonus');
      alert('Segregation Photo Uploaded & Verified! +15 EcoCredits credited to your wallet.');
      segForm.reset();
      renderCitizenDashboard();
    };
  }

  const citizenForm = document.getElementById('citizenReportForm');
  if (citizenForm) {
    citizenForm.onsubmit = (e) => {
      e.preventDefault();
      const severity = document.getElementById('citizenSeverity').value;
      if (!severity) {
        alert('Please select a Severity Level (Getting Full, 100% Full, or Overflowing) before submitting.');
        return;
      }

      const area = document.getElementById('citizenArea').value;
      const landmark = document.getElementById('citizenLandmark').value.trim();
      const lat = parseFloat(document.getElementById('citizenLat').value) || 28.6139;
      const lng = parseFloat(document.getElementById('citizenLng').value) || 77.2090;
      const notes = document.getElementById('citizenNotes').value;
      const audioData = document.getElementById('citizenAudioData').value;

      const newReport = {
        id: 'REP-' + Math.floor(1000 + Math.random() * 9000),
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: 'citizen',
        area,
        coords: { lat, lng },
        latitude: lat,
        longitude: lng,
        landmark,
        resolvedAddress: landmark,
        category: 'general',
        severity,
        notes: notes + (audioData ? ' [Voice Note Attached]' : ''),
        isEmergency: false,
        status: 'reported',
        createdAt: Date.now(),
        duplicateCount: 1,
        isEscalated: false
      };

      const isMerged = checkAndMergeDuplicates(newReport);
      if (!isMerged) {
        let reports = getReports();
        reports.unshift(newReport);
        saveReports(reports);

        awardCredits(5, 'Base Bin Report Submitted');
        alert('Bin Report Submitted Successfully! +5 EcoCredits credited.');
      }

      citizenForm.reset();
      selectSeverity('getting_full');
      renderCitizenDashboard();
    };
  }

  renderCitizenReportsFeed();
  renderRedemptionStore();
  renderMyRedemptionsList();
  renderPersonalImpactTracker();
}

window.selectSeverity = function(sev) {
  document.getElementById('citizenSeverity').value = sev;
  const btns = document.querySelectorAll('.severity-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-severity') === sev) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
};

/* Voice Message Recorder with Audio Playback Controls */
let mediaRecorderInstance = null;
let recordedAudioChunks = [];
let audioBlobUrl = null;

function initVoiceRecorder() {
  const micBtn = document.getElementById('micRecordBtn');
  const micStatus = document.getElementById('micStatusText');
  const playerContainer = document.getElementById('audioPlayerContainer');
  const audioElem = document.getElementById('audioPlayback');
  const audioInput = document.getElementById('citizenAudioData');
  const seekBar = document.getElementById('audioSeekBar');
  const timeDisplay = document.getElementById('audioTimeDisplay');

  let isRecording = false;

  if (micBtn) {
    micBtn.onclick = async () => {
      if (!isRecording) {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderInstance = new MediaRecorder(stream);
            recordedAudioChunks = [];

            mediaRecorderInstance.ondataavailable = (e) => {
              if (e.data.size > 0) recordedAudioChunks.push(e.data);
            };

            mediaRecorderInstance.onstop = () => {
              const audioBlob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
              if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
              audioBlobUrl = URL.createObjectURL(audioBlob);
              audioElem.src = audioBlobUrl;
              audioInput.value = 'data_audio_blob_recorded';
              playerContainer.style.display = 'flex';
              micStatus.textContent = 'Voice note recorded! Playback available below.';
            };

            mediaRecorderInstance.start();
          } else {
            generateMockAudioClip();
          }
        } catch (err) {
          generateMockAudioClip();
        }

        isRecording = true;
        micBtn.classList.add('recording');
        micStatus.textContent = 'Recording verbal note... (Click to stop)';
      } else {
        isRecording = false;
        micBtn.classList.remove('recording');
        if (mediaRecorderInstance && mediaRecorderInstance.state !== 'inactive') {
          mediaRecorderInstance.stop();
        } else {
          generateMockAudioClip();
        }
      }
    };
  }

  function generateMockAudioClip() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const sampleRate = audioCtx.sampleRate;
    const duration = 2.0;
    const numFrames = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, numFrames, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < numFrames; i++) {
      channelData[i] = Math.sin(2 * Math.PI * 440 * (i / sampleRate)) * Math.exp(-3 * (i / numFrames));
    }
    const wavBlob = audioBufferToWav(buffer);
    if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    audioBlobUrl = URL.createObjectURL(wavBlob);
    audioElem.src = audioBlobUrl;
    audioInput.value = 'mock_synthesized_wav';
    playerContainer.style.display = 'flex';
    micStatus.textContent = 'Voice observation captured! Playback ready below.';
  }

  if (audioElem) {
    audioElem.ontimeupdate = () => {
      if (audioElem.duration) {
        seekBar.value = (audioElem.currentTime / audioElem.duration) * 100;
        timeDisplay.textContent = `${formatAudioTime(audioElem.currentTime)} / ${formatAudioTime(audioElem.duration)}`;
      }
    };
    audioElem.onended = () => {
      document.getElementById('audioPlayToggleBtn').textContent = '▶ Play';
    };
  }
}

function formatAudioTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

window.toggleAudioPlayback = function() {
  const audio = document.getElementById('audioPlayback');
  const btn = document.getElementById('audioPlayToggleBtn');
  if (audio.paused) {
    audio.play();
    btn.textContent = '⏸ Pause';
  } else {
    audio.pause();
    btn.textContent = '▶ Play';
  }
};

window.seekAudioPlayback = function(val) {
  const audio = document.getElementById('audioPlayback');
  if (audio.duration) {
    audio.currentTime = (val / 100) * audio.duration;
  }
};

window.setAudioVolume = function(val) {
  const audio = document.getElementById('audioPlayback');
  audio.volume = parseFloat(val);
};

function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels = [];
  let sample = 0;
  let offset = 0;
  let pos = 0;

  function setUint16(data) { out.setUint16(pos, data, true); pos += 2; }
  function setUint32(data) { out.setUint32(pos, data, true); pos += 4; }

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt "
  setUint32(16);
  setUint16(1); // PCM
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));
  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }
  return new Blob([out.buffer], { type: 'audio/wav' });
}

/* Dedicated Credit Store (10 Items, Primary Sapling First) */
const CREDIT_STORE_CATALOG = [
  { id: 'sapling', name: 'Sapling / Native Fruit Plant', cost: 50, icon: '🌱', isPhysical: true, desc: 'Native guava, mango, or neem sapling delivered for residential terrace or park planting.', featured: true },
  { id: 'jute_bag', name: 'Heavy-Duty Cloth / Jute Bag', cost: 40, icon: '🛍️', isPhysical: true, desc: 'Reusable certified organic cotton tote bag eliminating single-use plastic grocery bags.' },
  { id: 'compost_kit', name: 'Home Aerobic Compost Starter Kit', cost: 100, icon: '🪴', isPhysical: true, desc: 'Twin aerated bin system with bio-inoculant microbial brick for kitchen food peels.' },
  { id: 'cutlery_set', name: 'Steel / Bamboo Reusable Cutlery Set', cost: 60, icon: '🥢', isPhysical: true, desc: 'Pocket travel pouch with stainless steel straw, bamboo fork, and spoon.' },
  { id: 'seed_paper', name: 'Plantable Seed Paper Stationery', cost: 30, icon: '📜', isPhysical: true, desc: 'Post-consumer waste handmade paper embedded with marigold and basil seeds.' },
  { id: 'transit_fare', name: 'Public Transit Metro / Bus Fare Credit', cost: 80, icon: '🚌', isPhysical: true, desc: '₹50 automated smart transit card recharge for municipal public transport.' },
  { id: 'tax_voucher', name: 'Municipal Property/Utility Tax Rebate Voucher', cost: 150, icon: '🎟️', isPhysical: true, desc: '₹100 official rebate certificate applicable to your annual municipal property or utility invoice.' },
  { id: 'recycled_notebook', name: '100% Recycled Paper Notebook', cost: 35, icon: '📓', isPhysical: true, desc: '120-page ruled notebook manufactured entirely from post-consumer recovered office paper.' },
  { id: 'digital_badge', name: 'Digital Eco-Champion Public Recognition Badge', cost: 0, icon: '🥇', isPhysical: false, desc: 'Official digital recognition credential displayed on your civic resident profile.' }
];

function renderRedemptionStore() {
  const container = document.getElementById('rewardStoreGrid');
  if (!container) return;

  const userBalance = currentUser.credits || 0;

  container.innerHTML = CREDIT_STORE_CATALOG.map(item => {
    const isAffordable = userBalance >= item.cost;
    const costText = item.cost === 0 ? 'FREE' : `${item.cost} Credits`;
    const btnLabel = isAffordable ? 'Redeem Item' : `Need ${item.cost - userBalance} more credits`;

    if (item.featured) {
      return `
        <div class="reward-card featured-card">
          <div class="featured-icon">${item.icon}</div>
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: var(--civic-spruce-green); text-transform: uppercase;">Featured Sustainability Reward</div>
            <h4 style="font-size: 1.25rem; margin: 0.25rem 0;">${item.name}</h4>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">${item.desc}</p>
            <div class="reward-cost">${costText}</div>
          </div>
          <div>
            <button class="btn btn-primary" ${!isAffordable ? 'disabled' : ''} onclick="redeemCreditStoreItem('${item.id}')">${btnLabel}</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="reward-card">
        <div>
          <div class="reward-icon">${item.icon}</div>
          <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">${item.name}</h4>
          <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">${item.desc}</p>
        </div>
        <div>
          <div class="reward-cost">${costText}</div>
          <button class="btn btn-primary btn-sm" style="width: 100%;" ${!isAffordable ? 'disabled' : ''} onclick="redeemCreditStoreItem('${item.id}')">${btnLabel}</button>
        </div>
      </div>
    `;
  }).join('');
}

window.redeemCreditStoreItem = function(itemId) {
  const item = CREDIT_STORE_CATALOG.find(i => i.id === itemId);
  if (!item) return;

  const userBalance = currentUser.credits || 0;
  if (userBalance < item.cost) {
    alert(`Insufficient EcoCredits! You need ${item.cost} credits. Balance: ${userBalance}`);
    return;
  }

  awardCredits(-item.cost, `Redeemed: ${item.name}`);

  const isDigital = !item.isPhysical;
  const newRedemption = {
    id: 'RED-' + Math.floor(1000 + Math.random() * 9000),
    userId: currentUser.id,
    userName: currentUser.name,
    itemId: item.id,
    itemName: item.name,
    creditCost: item.cost,
    status: isDigital ? 'Fulfilled' : 'Requested',
    requestedAt: Date.now(),
    fulfilledAt: isDigital ? Date.now() : null
  };

  let redemptions = getRedemptions();
  redemptions.unshift(newRedemption);
  saveRedemptions(redemptions);

  if (isDigital) {
    alert(`🎉 Digital Badge Awarded! Your Eco-Champion credential has been instantly fulfilled.`);
  } else {
    alert(`🎉 Redemption Requested! Ref Code: ${newRedemption.id}\nYour request for "${item.name}" will be fulfilled via the municipal depot.`);
  }

  renderCitizenDashboard();
};

function renderMyRedemptionsList() {
  const tbody = document.getElementById('myRedemptionsTableBody');
  if (!tbody) return;

  const redemptions = getRedemptions().filter(r => r.userId === currentUser.id);

  if (redemptions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">No redemption records yet. Earn credits to unlock rewards!</td></tr>`;
    return;
  }

  tbody.innerHTML = redemptions.map(r => `
    <tr>
      <td><strong>${r.itemName}</strong><br><small style="color: #64748b;">Ref: ${r.id}</small></td>
      <td>${new Date(r.requestedAt).toLocaleDateString()}</td>
      <td><strong>${r.creditCost}</strong></td>
      <td>
        <span class="badge ${r.status === 'Fulfilled' ? 'badge-cleared' : 'badge-reported'}">
          ${r.status === 'Fulfilled' ? '✅ Fulfilled' : '⏳ Requested (Pending Dispatch)'}
        </span>
      </td>
    </tr>
  `).join('');
}

function renderCitizenReportsFeed() {
  evaluateEscalations();
  const reports = getReports().filter(r => r.userId === currentUser.id);
  const container = document.getElementById('citizenReportsList');
  if (!container) return;

  const filtered = reports.filter(r => {
    if (citizenFilter === 'all') return true;
    return r.status === citizenFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: #64748b;">No reports found for this filter view.</div>`;
    return;
  }

  container.innerHTML = filtered.map(r => `
    <div class="report-item ${r.isEmergency ? 'emergency' : ''} ${r.isEscalated ? 'escalated' : ''}">
      <div>
        <div class="report-meta">
          <div class="status-stepper">
            <span class="stepper-step ${r.status === 'reported' ? 'active' : 'completed'}">1. Reported</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'assigned' ? 'active' : (r.status === 'cleared' ? 'completed' : '')}">2. Assigned</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'cleared' ? 'completed active' : ''}">3. Cleared</span>
          </div>
          ${r.isEmergency ? `<span class="badge badge-emergency">EMERGENCY</span>` : ''}
          ${r.isEscalated ? `<span class="badge badge-escalated">ESCALATED (>24h)</span>` : ''}
          <span>📍 ${r.area}</span>
          <span>⏱ ${formatTimeAgo(r.createdAt)}</span>
        </div>
        <div style="font-weight: 700; font-size: 1.05rem;">${r.landmark}</div>
        <div style="font-size: 0.85rem; color: #556960;">${r.notes || 'No extra notes.'}</div>
        <div style="font-size: 0.78rem; font-family: monospace; color: #64748b; margin-top: 0.2rem;">Coordinates: Lat ${r.latitude || r.coords?.lat || 28.6139}, Lng ${r.longitude || r.coords?.lng || 77.2090}</div>
        ${r.assignedWorkerName ? `<div style="font-size: 0.82rem; color: var(--civic-cobalt-accent); margin-top: 0.2rem;">🚛 Field Crew: <strong>${r.assignedWorkerName}</strong></div>` : ''}
      </div>
    </div>
  `).join('');
}

window.filterCitizenReports = function(filter) {
  citizenFilter = filter;
  renderCitizenReportsFeed();
};

window.triggerEmergencyModal = function() {
  const landmark = prompt('Enter Exact Landmark of Emergency Hazardous Spill / Severe Obstruction:', 'City Commercial Market Gate #1');
  if (!landmark) return;

  const newReport = {
    id: 'EMG-' + Math.floor(1000 + Math.random() * 9000),
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: 'citizen',
    area: 'Ward 04 - MG Road & Commercial Center',
    coords: { lat: 28.6250, lng: 77.2150 },
    latitude: 28.6250,
    longitude: 77.2150,
    landmark,
    resolvedAddress: landmark + ', Ward 04',
    category: 'hazard_spill',
    severity: 'overflowing',
    notes: 'EMERGENCY HAZARD SPILL: Immediate dispatch required.',
    isEmergency: true,
    status: 'reported',
    createdAt: Date.now(),
    duplicateCount: 1,
    isEscalated: false
  };

  let reports = getReports();
  reports.unshift(newReport);
  saveReports(reports);

  awardCredits(25, 'Emergency Hazard Alert Bonus');
  alert('EMERGENCY ALERT LOGGED! Highest dispatch priority triggered. +25 Credits credited.');
  renderCitizenDashboard();
};

/* ==========================================================================
   6. INSTITUTION DASHBOARD (SCHOOL & COMPANY/OFFICE + MULTI-BRANCH)
   ========================================================================== */
function renderInstitutionDashboard() {
  const isSchool = currentUser.institutionType === 'school';
  const isCompany = currentUser.institutionType === 'company';

  const headerTitle = document.getElementById('instHeaderTitle');
  const headerSubtitle = document.getElementById('instHeaderSubtitle');

  if (isSchool) {
    headerTitle.textContent = `🏫 ${currentUser.schoolName || currentUser.name}`;
    headerSubtitle.textContent = `Educational Institution Waste Management Portal`;
  } else if (isCompany) {
    headerTitle.textContent = `🏢 ${currentUser.companyName || currentUser.name}`;
    headerSubtitle.textContent = `Corporate Facility Management — ${currentUser.businessType || 'Commercial Entity'}`;
  } else {
    headerTitle.textContent = `🏢 ${currentUser.name}`;
    headerSubtitle.textContent = `Commercial & Bulk Waste Generator Management`;
  }

  // Populate Branches Selector
  const branchSelect = document.getElementById('instBranchSelect');
  const branches = currentUser.branches || [{ id: 'br-main', name: 'Main Facility Gate', ward: 'Ward 18 - Sector 62 Tech Hub' }];
  const activeBranchId = currentUser.activeBranchId || branches[0].id;

  branchSelect.innerHTML = branches.map(b => `
    <option value="${b.id}" ${b.id === activeBranchId ? 'selected' : ''}>${b.name} (${b.ward})</option>
  `).join('');

  // Active Schedule Badge
  const sched = currentUser.recurringSchedule || { frequency: 'daily', timeSlot: '06:00 - 08:00 AM' };
  document.getElementById('activeScheduleBadge').innerHTML = `
    Active Fixed Route: <strong>${sched.frequency.toUpperCase()} (${sched.timeSlot})</strong>
  `;

  // Compliance Rating
  const audits = currentUser.selfAudits || [];
  const latestRate = audits.length > 0 ? audits[0].rate : 92;
  document.getElementById('instAuditScoreDisplay').textContent = `${latestRate}%`;

  setTimeout(() => initLeafletLocationPicker('inst'), 150);

  // Forms
  const bulkForm = document.getElementById('institutionBulkForm');
  bulkForm.onsubmit = (e) => {
    e.preventDefault();
    const wasteType = document.getElementById('instWasteType').value;
    const area = document.getElementById('instArea').value;
    const landmark = document.getElementById('instLandmark').value.trim();
    const lat = parseFloat(document.getElementById('instLat').value) || 28.5900;
    const lng = parseFloat(document.getElementById('instLng').value) || 77.2250;
    const volumeKg = parseFloat(document.getElementById('instVolume').value) || 200;
    const containerCount = parseInt(document.getElementById('instContainerCount').value) || 3;

    const currentBranch = branches.find(b => b.id === currentUser.activeBranchId) || branches[0];

    const newReport = {
      id: 'BULK-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: currentUser.name,
      institutionType: currentUser.institutionType,
      schoolName: currentUser.schoolName,
      companyName: currentUser.companyName,
      businessType: currentUser.businessType,
      branchId: currentBranch.id,
      branchName: currentBranch.name,
      userRole: 'institution',
      area,
      coords: { lat, lng },
      latitude: lat,
      longitude: lng,
      landmark,
      resolvedAddress: `${landmark}, ${currentBranch.name}, ${area}`,
      category: wasteType,
      severity: 'overflowing',
      notes: `Bulk pickup for ${currentBranch.name} (${volumeKg} kg, ${containerCount} containers).`,
      isBulk: true,
      volumeKg,
      containerCount,
      isEmergency: false,
      status: 'reported',
      createdAt: Date.now(),
      duplicateCount: 1,
      isEscalated: false
    };

    let reports = getReports();
    reports.unshift(newReport);
    saveReports(reports);

    alert(`Commercial Bulk Pickup Scheduled for ${currentBranch.name}! Reference ID: ${newReport.id}`);
    bulkForm.reset();
    renderInstitutionDashboard();
  };

  const schedForm = document.getElementById('recurringScheduleForm');
  schedForm.onsubmit = (e) => {
    e.preventDefault();
    const frequency = document.getElementById('schedFrequency').value;
    const timeSlot = document.getElementById('schedTimeSlot').value;

    currentUser.recurringSchedule = { frequency, timeSlot };
    updateUserRecord(currentUser);
    alert('Recurring Pickup Schedule updated successfully!');
    renderInstitutionDashboard();
  };

  const auditForm = document.getElementById('instSelfAuditForm');
  auditForm.onsubmit = (e) => {
    e.preventDefault();
    const rate = parseInt(document.getElementById('auditComplianceRate').value);
    const stream = document.getElementById('auditWasteBreakdown').value;

    if (!currentUser.selfAudits) currentUser.selfAudits = [];
    currentUser.selfAudits.unshift({
      date: new Date().toISOString().slice(0, 10),
      rate,
      stream
    });
    updateUserRecord(currentUser);

    // Sync SBM 2.0 Compliance table
    syncInstitutionAuditToAdminCompliance(rate);

    alert(`Monthly Segregation Self-Audit of ${rate}% submitted! Integrated with Municipal SBM 2.0 database.`);
    renderInstitutionDashboard();
  };

  renderInstitutionList();
}

window.changeInstBranch = function(branchId) {
  currentUser.activeBranchId = branchId;
  updateUserRecord(currentUser);
  renderInstitutionDashboard();
};

window.openAddBranchModal = function() {
  document.getElementById('addBranchModal').classList.add('active');

  const form = document.getElementById('addBranchForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('newBranchName').value.trim();
    const ward = document.getElementById('newBranchWard').value;
    const address = document.getElementById('newBranchAddress').value.trim();

    if (!currentUser.branches) currentUser.branches = [];
    const newBranch = {
      id: 'br-' + Math.floor(100 + Math.random() * 900),
      name,
      ward,
      address,
      lat: 28.6000 + (Math.random() * 0.04),
      lng: 77.2000 + (Math.random() * 0.04)
    };

    currentUser.branches.push(newBranch);
    currentUser.activeBranchId = newBranch.id;
    updateUserRecord(currentUser);

    closeModal('addBranchModal');
    alert(`New facility branch "${name}" registered under this organization!`);
    renderInstitutionDashboard();
  };
};

function renderInstitutionList() {
  const activeBranchId = currentUser.activeBranchId || (currentUser.branches ? currentUser.branches[0].id : null);
  const reports = getReports().filter(r => r.userId === currentUser.id && (!activeBranchId || r.branchId === activeBranchId));
  const container = document.getElementById('institutionReportsList');

  const totalVolume = reports.reduce((sum, r) => sum + (r.volumeKg || 0), 0);
  const clearedCount = reports.filter(r => r.status === 'cleared').length;

  document.getElementById('instStatTonnage').textContent = `${totalVolume} kg`;
  document.getElementById('instStatCleared').textContent = clearedCount;

  if (reports.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: #64748b;">No bulk pickup requests logged for this branch.</div>`;
    return;
  }

  container.innerHTML = reports.map(r => `
    <div class="report-item">
      <div>
        <div class="report-meta">
          <div class="status-stepper">
            <span class="stepper-step ${r.status === 'reported' ? 'active' : 'completed'}">1. Reported</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'assigned' ? 'active' : (r.status === 'cleared' ? 'completed' : '')}">2. Assigned</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'cleared' ? 'completed active' : ''}">3. Cleared</span>
          </div>
          <span>🏢 ${r.branchName || 'Main'}</span>
          <span>📍 ${r.area}</span>
          <span>⏱ ${formatTimeAgo(r.createdAt)}</span>
        </div>
        <div style="font-weight: 700; font-size: 1.05rem;">${r.landmark}</div>
        <div style="font-size: 0.85rem; color: #556960;">Bulk Volume: <strong>${r.volumeKg} kg</strong> (${r.containerCount || 1} Containers) — Stream: ${r.category.toUpperCase()}</div>
        <div style="font-size: 0.78rem; font-family: monospace; color: #64748b; margin-top: 0.2rem;">Location: Lat ${r.latitude || 28.59}, Lng ${r.longitude || 77.225}</div>
      </div>
    </div>
  `).join('');
}

window.triggerInstitutionOverloadAlert = function() {
  const currentBranch = (currentUser.branches && currentUser.branches.find(b => b.id === currentUser.activeBranchId)) || { name: 'Main Campus', ward: 'Ward 18 - Sector 62 Tech Hub', lat: 28.59, lng: 77.225 };
  
  const newReport = {
    id: 'OVERLOAD-' + Math.floor(1000 + Math.random() * 9000),
    userId: currentUser.id,
    userName: currentUser.name,
    institutionType: currentUser.institutionType,
    schoolName: currentUser.schoolName,
    companyName: currentUser.companyName,
    branchId: currentBranch.id,
    branchName: currentBranch.name,
    userRole: 'institution',
    area: currentBranch.ward,
    coords: { lat: currentBranch.lat, lng: currentBranch.lng },
    latitude: currentBranch.lat,
    longitude: currentBranch.lng,
    landmark: `${currentBranch.name} Loading Dock`,
    resolvedAddress: `${currentBranch.name} Main Gate Bay, ${currentBranch.ward}`,
    category: 'institution_overload',
    severity: 'overflowing',
    notes: `INSTITUTION OVERLOAD ALERT: Immediate container clearance needed for ${currentBranch.name}.`,
    isEmergency: true,
    status: 'reported',
    createdAt: Date.now(),
    duplicateCount: 1,
    isEscalated: false
  };

  let reports = getReports();
  reports.unshift(newReport);
  saveReports(reports);

  alert(`🚨 OVERLOAD ALERT DISPATCHED for ${currentBranch.name}! Priority vehicle flagged.`);
  renderInstitutionDashboard();
};

function updateUserRecord(user) {
  let users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveUsers(users);
  }
  localStorage.setItem('swm_current_user', JSON.stringify(user));
}

function syncInstitutionAuditToAdminCompliance(rate) {
  let metrics = JSON.parse(localStorage.getItem('swm_compliance_metrics') || '[]');
  const idx = metrics.findIndex(m => m.ward.includes('Ward 18'));
  if (idx !== -1) {
    metrics[idx].segregationRate = Math.round((metrics[idx].segregationRate + rate) / 2);
    if (metrics[idx].segregationRate >= 60) metrics[idx].status = 'ontrack';
    localStorage.setItem('swm_compliance_metrics', JSON.stringify(metrics));
  }
}

/* ==========================================================================
   7. HOSPITAL DASHBOARD: CSV EXPORT, LIFECYCLE STEPPER & HAZARD THRESHOLD
   ========================================================================== */
function renderHospitalDashboard() {
  const threshold = currentUser.hazardThreshold || 25;
  document.getElementById('hospitalThresholdInput').value = threshold;
  document.getElementById('hazardThresholdDisplay').textContent = threshold;

  validateBMWForm();

  const form = document.getElementById('hospitalBMWForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const category = document.getElementById('bmwCategory').value;
    const hospitalWard = document.getElementById('hospitalWard').value.trim();
    const treatmentFacility = document.getElementById('bmwTreatmentFacility').value;
    const volumeKg = parseFloat(document.getElementById('bmwWeight').value) || 10;
    const containerCode = document.getElementById('bmwContainerCode').value.trim();

    let categoryName = '🟡 Yellow: Human Anatomical Waste';
    if (category === 'biomed_red') categoryName = '🔴 Red: Contaminated Infectious Waste';
    if (category === 'biomed_white') categoryName = '⚪ White: Waste Sharps';
    if (category === 'biomed_black') categoryName = '⚫ Black/Blue: Chemical & Expired Pharma';
    if (category === 'biomed_general') categoryName = '🟢 General Hospital Waste';

    const newBMW = {
      id: 'BMW-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: currentUser.name,
      registrationNo: currentUser.verificationCode || 'HOSP-NABH-4019',
      category,
      categoryName,
      hospitalWard,
      containerCode,
      volumeKg,
      lifecycleStage: 'Registered',
      treatmentFacility,
      status: 'reported',
      createdAt: Date.now()
    };

    let bmwReports = getHospitalReports();
    bmwReports.unshift(newBMW);
    saveHospitalReports(bmwReports);

    awardCredits(5, 'Biomedical Waste Stream Registered');
    alert(`Disposal Stream Registered under ${categoryName}! Container ID: ${containerCode}`);
    form.reset();
    validateBMWForm();
    renderHospitalDashboard();
  };

  renderHospitalLog();
  renderHospitalStaffTable();
}

window.validateBMWForm = function() {
  const cat = document.getElementById('bmwCategory')?.value;
  const ward = document.getElementById('hospitalWard')?.value?.trim();
  const facility = document.getElementById('bmwTreatmentFacility')?.value;
  const weight = parseFloat(document.getElementById('bmwWeight')?.value);
  const code = document.getElementById('bmwContainerCode')?.value?.trim();
  const btn = document.getElementById('registerBMWBtn');

  if (btn) {
    if (cat && ward && facility && weight > 0 && code) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'true');
    }
  }
};

window.updateHospitalHazardThreshold = function() {
  const val = parseFloat(document.getElementById('hospitalThresholdInput').value);
  if (!val || val < 1) {
    alert('Please enter a valid threshold in kg.');
    return;
  }
  currentUser.hazardThreshold = val;
  updateUserRecord(currentUser);
  alert(`Hazard accumulation threshold updated to ${val} kg.`);
  renderHospitalDashboard();
};

function renderHospitalLog() {
  const bmwReports = getHospitalReports().filter(r => r.userId === currentUser.id);
  const tbody = document.getElementById('hospitalComplianceTableBody');
  const alertBox = document.getElementById('hospitalHazardAlert');
  const threshold = currentUser.hazardThreshold || 25;

  const hazardousPendingKg = bmwReports.filter(r => r.category !== 'biomed_general' && r.lifecycleStage !== 'Disposed')
                                       .reduce((sum, r) => sum + r.volumeKg, 0);

  if (hazardousPendingKg > threshold) {
    alertBox.style.display = 'block';
  } else {
    alertBox.style.display = 'none';
  }

  if (bmwReports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">No biomedical compliance logs registered.</td></tr>`;
    return;
  }

  const STAGES = ['Registered', 'Collected', 'In Transit', 'Treated', 'Disposed'];

  tbody.innerHTML = bmwReports.map(r => {
    const stageIdx = STAGES.indexOf(r.lifecycleStage || 'Registered');

    const lifecycleHtml = `
      <div class="container-lifecycle-bar">
        ${STAGES.map((s, idx) => `
          <span class="cycle-step ${idx === stageIdx ? 'current' : (idx < stageIdx ? 'done' : '')}">${s}</span>
        `).join('')}
      </div>
    `;

    return `
      <tr>
        <td><span class="badge bmw-badge-${r.category.replace('biomed_', '')}">${r.categoryName}</span></td>
        <td>${r.hospitalWard}</td>
        <td><code>${r.containerCode}</code></td>
        <td><strong>${r.volumeKg} kg</strong></td>
        <td>${lifecycleHtml}</td>
        <td><small>${r.treatmentFacility || 'CBWTF Sector 9'}</small></td>
        <td>${new Date(r.createdAt).toLocaleTimeString()}</td>
        <td>
          ${stageIdx < 4 ? `<button class="btn btn-outline btn-xs" onclick="advanceContainerLifecycle('${r.id}')">Advance Stage</button>` : `<span class="badge badge-cleared">Finalized</span>`}
        </td>
      </tr>
    `;
  }).join('');
}

window.advanceContainerLifecycle = function(id) {
  const STAGES = ['Registered', 'Collected', 'In Transit', 'Treated', 'Disposed'];
  let bmwReports = getHospitalReports();
  const idx = bmwReports.findIndex(r => r.id === id);
  if (idx !== -1) {
    const currentStage = bmwReports[idx].lifecycleStage || 'Registered';
    const nextIdx = STAGES.indexOf(currentStage) + 1;
    if (nextIdx < STAGES.length) {
      bmwReports[idx].lifecycleStage = STAGES[nextIdx];
      if (STAGES[nextIdx] === 'Disposed') bmwReports[idx].status = 'cleared';
      saveHospitalReports(bmwReports);
      renderHospitalDashboard();
    }
  }
};

/* End-to-End Bug Fix: Hospital Compliance CSV Export (RFC-4180 Compliant) */
window.exportHospitalAuditCSV = function() {
  const bmwReports = getHospitalReports().filter(r => r.userId === currentUser.id);
  if (bmwReports.length === 0) {
    alert('No biomedical logs available to export!');
    return;
  }

  const headers = [
    'Stream Category',
    'Hospital Ward / Dept',
    'Container ID',
    'Weight (kg)',
    'Status',
    'Lifecycle Stage',
    'Authorized Treatment Facility',
    'Log Time'
  ];

  function escapeCsv(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  let csvRows = [headers.map(escapeCsv).join(',')];

  bmwReports.forEach(r => {
    csvRows.push([
      escapeCsv(r.categoryName),
      escapeCsv(r.hospitalWard),
      escapeCsv(r.containerCode),
      escapeCsv(r.volumeKg),
      escapeCsv(r.status),
      escapeCsv(r.lifecycleStage || 'Registered'),
      escapeCsv(r.treatmentFacility || 'CBWTF Central Plant'),
      escapeCsv(new Date(r.createdAt).toISOString())
    ].join(','));
  });

  const csvContent = csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);

  a.href = url;
  a.download = `compliance-audit-log-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window.printHospitalCertificate = function() {
  window.print();
};

function renderHospitalStaffTable() {
  const tbody = document.getElementById('hospitalStaffTableBody');
  if (!tbody) return;
  const staff = getHospitalStaff();

  tbody.innerHTML = staff.map(s => `
    <tr>
      <td><strong>${s.name}</strong><br><small style="color: #64748b;">${s.department}</small></td>
      <td>${s.date}</td>
      <td><span class="badge badge-cleared">${s.certStatus}</span></td>
    </tr>
  `).join('');
}

window.openStaffTrainingModal = function() {
  document.getElementById('staffTrainingModal').classList.add('active');

  const form = document.getElementById('staffTrainingForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('staffMemberName').value.trim();
    const department = document.getElementById('staffDepartment').value.trim();
    const date = document.getElementById('staffTrainingDate').value;
    const certStatus = document.getElementById('staffCertStatus').value;

    let staff = getHospitalStaff();
    staff.unshift({
      id: 'st-' + Math.floor(100 + Math.random() * 900),
      name,
      department,
      date,
      certStatus
    });
    saveHospitalStaff(staff);

    closeModal('staffTrainingModal');
    alert(`Biomedical handling certification logged for ${name}!`);
    renderHospitalStaffTable();
  };
};

/* ==========================================================================
   8. WORKER DASHBOARD: DAYLIGHT HIGH-CONTRAST ROUTE OPTIMIZATION
   ========================================================================== */
function renderWorkerDashboard() {
  evaluateEscalations();
  runSoftwareRouteOptimizer();
}

function runSoftwareRouteOptimizer() {
  const reports = getReports().filter(r => r.status !== 'cleared');
  const container = document.getElementById('workerRouteStopsList');

  const emergencyStops = reports.filter(r => r.isEmergency);
  const regularStops = reports.filter(r => !r.isEmergency);

  let currentPos = { lat: 28.6139, lng: 77.2090 };
  let unvisited = [...regularStops];
  let optimizedRegular = [];
  let totalDistanceKm = 0;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const targetCoords = unvisited[i].coords || { lat: unvisited[i].latitude || 28.6139, lng: unvisited[i].longitude || 77.2090 };
      const dist = calcDistance(currentPos, targetCoords);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nextStop = unvisited.splice(nearestIdx, 1)[0];
    totalDistanceKm += minDistance;
    currentPos = nextStop.coords || { lat: nextStop.latitude || 28.6139, lng: nextStop.longitude || 77.2090 };
    optimizedRegular.push(nextStop);
  }

  const finalRoute = [...emergencyStops, ...optimizedRegular];

  document.getElementById('workerAssignedCount').textContent = finalRoute.length;
  document.getElementById('workerEstDistance').textContent = `${(totalDistanceKm + (emergencyStops.length * 1.5)).toFixed(1)} km`;

  const totalAll = getReports().length;
  const clearedAll = getReports().filter(r => r.status === 'cleared').length;
  const rate = totalAll > 0 ? Math.round((clearedAll / totalAll) * 100) : 0;
  document.getElementById('workerCompletionRate').textContent = `${rate}%`;

  if (finalRoute.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: #64748b;">No active stops pending for your shift route.</div>`;
    return;
  }

  container.innerHTML = finalRoute.map((stop, idx) => {
    const isEmg = stop.isEmergency;
    const originLabel = stop.userRole === 'institution'
      ? (stop.institutionType === 'school' ? `🏫 ${stop.schoolName || stop.userName}` : `🏢 ${stop.companyName || stop.userName}`)
      : `👤 Resident (${stop.userName})`;

    return `
      <div class="route-stop-card ${isEmg ? 'emergency' : ''}">
        <div class="stop-number ${isEmg ? 'emergency-stop' : ''}">${isEmg ? '🚨' : idx + 1}</div>
        <div>
          <div class="report-meta">
            <span class="badge badge-${stop.status}">${stop.status}</span>
            ${isEmg ? `<span class="badge badge-emergency">TOP PRIORITY EMERGENCY</span>` : ''}
            <span>📍 ${stop.area}</span>
            <span>Origin: <strong>${originLabel}</strong></span>
          </div>
          <div style="font-weight: 700; font-size: 1.1rem;">${stop.landmark}</div>
          <div style="font-size: 0.88rem; color: #556960;">${stop.notes || 'No extra notes.'}</div>
          <div style="font-size: 0.78rem; font-family: monospace; color: #64748b; margin-top: 0.2rem;">Coordinates: Lat ${stop.latitude || stop.coords?.lat || 28.6139}, Lng ${stop.longitude || stop.coords?.lng || 77.2090}</div>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" onclick="openWorkerProofModal('${stop.id}')">📷 Mark Collected</button>
        </div>
      </div>
    `;
  }).join('');
}

function calcDistance(p1, p2) {
  const dx = (p1.lat - p2.lat) * 111;
  const dy = (p1.lng - p2.lng) * 111;
  return Math.sqrt(dx * dx + dy * dy);
}

window.openWorkerProofModal = function(reportId) {
  document.getElementById('proofReportId').value = reportId;
  document.getElementById('workerProofModal').classList.add('active');

  const form = document.getElementById('workerProofForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('proofReportId').value;
    
    let reports = getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index].status = 'cleared';
      reports[index].clearedAt = Date.now();
      reports[index].clearedByWorker = currentUser.name;
      saveReports(reports);

      alert(`Stop ${id} confirmed CLEARED! Photo proof logged.`);
    }

    closeModal('workerProofModal');
    renderWorkerDashboard();
  };
};

/* ==========================================================================
   9. ADMIN DASHBOARD: LIVE FEED, SBM 2.0, HOTSPOT MAP & REDEMPTIONS QUEUE
   ========================================================================== */
function renderAdminDashboard() {
  evaluateEscalations();
  const reports = getReports();

  document.getElementById('adminStatTotal').textContent = reports.length;
  document.getElementById('adminStatPending').textContent = reports.filter(r => r.status === 'reported').length;
  document.getElementById('adminStatEmergency').textContent = reports.filter(r => r.isEmergency).length;
  document.getElementById('adminStatEscalated').textContent = reports.filter(r => r.isEscalated).length;

  renderAdminFeedTable();
  renderAdminComplianceTable();
  renderAdminHospitalTable();
  renderAdminWorkerTable();
  renderAdminRedemptionsQueue();
  initAdminHotspotMap();
}

function renderAdminFeedTable() {
  const reports = getReports();
  const tbody = document.getElementById('adminFeedTableBody');

  if (reports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No active reports found.</td></tr>`;
    return;
  }

  const workers = getUsers().filter(u => u.role === 'worker');

  tbody.innerHTML = reports.map(r => {
    const workerOptions = workers.map(w => 
      `<option value="${w.id}" ${r.assignedWorkerId === w.id ? 'selected' : ''}>${w.name}</option>`
    ).join('');

    let originLabel = `👤 ${r.userName}`;
    if (r.userRole === 'institution') {
      if (r.institutionType === 'school') {
        originLabel = `🏫 <strong>${r.schoolName || r.userName}</strong>`;
      } else if (r.institutionType === 'company') {
        originLabel = `🏢 <strong>${r.companyName || r.userName}</strong><br><small style="color: #64748b;">${r.businessType || 'Office'}</small>`;
      } else {
        originLabel = `🏢 ${r.userName}`;
      }
    }

    const lat = r.latitude || r.coords?.lat || 28.6139;
    const lng = r.longitude || r.coords?.lng || 77.2090;

    return `
      <tr class="${r.isEscalated ? 'escalated' : ''}">
        <td><code>${r.id}</code></td>
        <td>${originLabel}</td>
        <td>${r.landmark}<br><small style="color: #64748b;">${r.area}</small></td>
        <td>${r.category.toUpperCase()}<br><small>${r.severity} ${r.isEmergency ? '🚨' : ''}</small></td>
        <td>
          <div class="status-stepper" style="font-size: 0.65rem;">
            <span class="stepper-step ${r.status === 'reported' ? 'active' : 'completed'}">1</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'assigned' ? 'active' : (r.status === 'cleared' ? 'completed' : '')}">2</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'cleared' ? 'completed active' : ''}">3</span>
          </div>
        </td>
        <td><small style="font-family: monospace;">${lat.toFixed(4)}, ${lng.toFixed(4)}</small></td>
        <td>
          <select class="form-control" style="font-size: 0.78rem; padding: 0.2rem 0.4rem;" onchange="reassignWorker('${r.id}', this.value)">
            <option value="">Unassigned</option>
            ${workerOptions}
          </select>
        </td>
        <td>
          <button class="btn btn-outline btn-xs" onclick="adminForceClear('${r.id}')">Force Clear</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminComplianceTable() {
  const metrics = JSON.parse(localStorage.getItem('swm_compliance_metrics') || '[]');
  const tbody = document.getElementById('adminComplianceTableBody');
  if (!tbody) return;

  tbody.innerHTML = metrics.map(m => {
    let statusBadge = '<span class="compliance-badge status-ontrack">🟢 ON TRACK</span>';
    if (m.status === 'neartarget') statusBadge = '<span class="compliance-badge status-neartarget">🟡 NEAR TARGET</span>';
    if (m.status === 'offtarget') statusBadge = '<span class="compliance-badge status-offtarget">🔴 OFF TARGET</span>';

    return `
      <tr>
        <td><strong>${m.ward}</strong></td>
        <td><strong style="color: ${m.segregationRate >= 60 ? 'var(--civic-spruce-green)' : 'var(--civic-signal-crimson)'};">${m.segregationRate}%</strong> (Target 60%+)</td>
        <td><strong style="color: ${m.coverageRate >= 80 ? 'var(--civic-spruce-green)' : 'var(--civic-signal-amber)'};">${m.coverageRate}%</strong> (Target 80%+)</td>
        <td><strong style="color: ${m.processingRate >= 80 ? 'var(--civic-spruce-green)' : 'var(--civic-signal-crimson)'};">${m.processingRate}%</strong> (Target 80%+)</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

let adminMapObj = null;

function initAdminHotspotMap() {
  const mapElement = document.getElementById('adminHotspotMap');
  if (!mapElement) return;

  if (adminMapObj) {
    adminMapObj.invalidateSize();
    return;
  }

  adminMapObj = L.map('adminHotspotMap').setView([28.6139, 77.2090], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(adminMapObj);

  // Plot real report markers from submitted dataset
  const reports = getReports();
  reports.forEach(r => {
    const lat = r.latitude || r.coords?.lat;
    const lng = r.longitude || r.coords?.lng;
    if (lat && lng) {
      const isEmg = r.isEmergency;
      const markerColor = isEmg ? '#dc2626' : (r.status === 'cleared' ? '#166534' : '#1c52d8');

      L.circleMarker([lat, lng], {
        radius: isEmg ? 10 : 7,
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.7
      }).addTo(adminMapObj).bindPopup(`
        <strong>${r.id} (${r.status.toUpperCase()})</strong><br>
        Source: ${r.schoolName || r.companyName || r.userName}<br>
        Address: ${r.resolvedAddress || r.landmark}<br>
        Category: ${r.category}<br>
        Severity: ${r.severity}
      `);
    }
  });
}

function renderAdminRedemptionsQueue() {
  const tbody = document.getElementById('adminRedemptionsTableBody');
  if (!tbody) return;

  const redemptions = getRedemptions();
  const pendingPhysical = redemptions.filter(r => r.status === 'Requested');

  if (pendingPhysical.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">No pending physical reward dispatches in queue.</td></tr>`;
    return;
  }

  tbody.innerHTML = pendingPhysical.map(r => `
    <tr>
      <td><code>${r.id}</code></td>
      <td><strong>${r.userName}</strong></td>
      <td>${r.itemName}</td>
      <td><strong>${r.creditCost} Credits</strong></td>
      <td>${new Date(r.requestedAt).toLocaleDateString()}</td>
      <td><span class="badge badge-reported">Pending Dispatch</span></td>
      <td>
        <button class="btn btn-primary btn-xs" onclick="adminFulfillRedemption('${r.id}')">Mark Fulfilled</button>
      </td>
    </tr>
  `).join('');
}

window.adminFulfillRedemption = function(id) {
  let redemptions = getRedemptions();
  const idx = redemptions.findIndex(r => r.id === id);
  if (idx !== -1) {
    redemptions[idx].status = 'Fulfilled';
    redemptions[idx].fulfilledAt = Date.now();
    saveRedemptions(redemptions);
    alert(`Redemption Request ${id} marked as FULFILLED! Citizen balance history updated.`);
    renderAdminRedemptionsQueue();
  }
};

window.switchAdminTab = function(tabName) {
  const tabs = document.querySelectorAll('.auth-tabs .auth-tab');
  tabs.forEach(t => t.classList.remove('active'));

  document.getElementById('adminPanelFeed').style.display = tabName === 'feed' ? 'block' : 'none';
  document.getElementById('adminPanelCompliance').style.display = tabName === 'compliance' ? 'block' : 'none';
  document.getElementById('adminPanelHotspot').style.display = tabName === 'hotspot' ? 'block' : 'none';
  document.getElementById('adminPanelHospital').style.display = tabName === 'hospital' ? 'block' : 'none';
  document.getElementById('adminPanelWorkers').style.display = tabName === 'workers' ? 'block' : 'none';
  document.getElementById('adminPanelRedemptions').style.display = tabName === 'redemptions' ? 'block' : 'none';

  if (tabName === 'feed') document.getElementById('adminTabFeed').classList.add('active');
  if (tabName === 'compliance') document.getElementById('adminTabCompliance').classList.add('active');
  if (tabName === 'hotspot') {
    document.getElementById('adminTabHotspot').classList.add('active');
    setTimeout(() => initAdminHotspotMap(), 150);
  }
  if (tabName === 'hospital') document.getElementById('adminTabHospital').classList.add('active');
  if (tabName === 'workers') document.getElementById('adminTabWorkers').classList.add('active');
  if (tabName === 'redemptions') {
    document.getElementById('adminTabRedemptions').classList.add('active');
    renderAdminRedemptionsQueue();
  }
};

window.reassignWorker = function(reportId, workerId) {
  let reports = getReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    const workers = getUsers();
    const w = workers.find(usr => usr.id === workerId);

    reports[index].assignedWorkerId = workerId;
    reports[index].assignedWorkerName = w ? w.name : '';
    reports[index].status = workerId ? 'assigned' : 'reported';
    reports[index].assignedAt = Date.now();
    saveReports(reports);

    alert(`Task ${reportId} assigned to ${w ? w.name : 'Unassigned'}!`);
    renderAdminDashboard();
  }
};

window.adminForceClear = function(reportId) {
  let reports = getReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index].status = 'cleared';
    reports[index].clearedAt = Date.now();
    saveReports(reports);
    renderAdminDashboard();
  }
};

function renderAdminHospitalTable() {
  const bmwReports = getHospitalReports();
  const tbody = document.getElementById('adminHospitalTableBody');

  const hospitalMap = {};
  bmwReports.forEach(r => {
    if (!hospitalMap[r.userName]) {
      hospitalMap[r.userName] = { reg: r.registrationNo, count: 0, weight: 0 };
    }
    hospitalMap[r.userName].count += 1;
    hospitalMap[r.userName].weight += r.volumeKg;
  });

  const keys = Object.keys(hospitalMap);
  if (keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hospital compliance records logged.</td></tr>`;
    return;
  }

  tbody.innerHTML = keys.map(name => {
    const h = hospitalMap[name];
    const isCompliant = h.weight <= 50;
    return `
      <tr>
        <td><strong>${name}</strong></td>
        <td><code>${h.reg}</code></td>
        <td>${h.count} streams</td>
        <td><strong>${h.weight} kg</strong></td>
        <td>
          <span class="badge ${isCompliant ? 'badge-cleared' : 'badge-emergency'}">
            ${isCompliant ? 'COMPLIANT' : '⚠️ HIGH DISPOSAL VOLUME'}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminWorkerTable() {
  const workers = getUsers().filter(u => u.role === 'worker');
  const reports = getReports();
  const tbody = document.getElementById('adminWorkerTableBody');

  tbody.innerHTML = workers.map(w => {
    const assigned = reports.filter(r => r.assignedWorkerId === w.id);
    const cleared = assigned.filter(r => r.status === 'cleared');
    const rate = assigned.length > 0 ? Math.round((cleared.length / assigned.length) * 100) : 100;

    return `
      <tr>
        <td><strong>${w.name}</strong></td>
        <td><code>${w.verificationCode || 'WRK-101'}</code></td>
        <td>${assigned.length} stops</td>
        <td>${cleared.length} stops</td>
        <td><strong style="color: var(--civic-spruce-green);">${rate}%</strong></td>
      </tr>
    `;
  }).join('');
}

window.exportAdminAnalyticsCSV = function() {
  const reports = getReports();
  let csvRows = ['"ID","Reporter","Role","Company/School","Resolved Address","Ward","Category","Severity","Emergency","Status","Latitude","Longitude","Timestamp"'];
  
  reports.forEach(r => {
    csvRows.push([
      `"${r.id}"`,
      `"${r.userName}"`,
      `"${r.userRole}"`,
      `"${r.schoolName || r.companyName || 'N/A'}"`,
      `"${(r.resolvedAddress || r.landmark).replace(/"/g, '""')}"`,
      `"${r.area}"`,
      `"${r.category}"`,
      `"${r.severity}"`,
      r.isEmergency || false,
      `"${r.status}"`,
      r.latitude || r.coords?.lat || 0,
      r.longitude || r.coords?.lng || 0,
      `"${new Date(r.createdAt).toISOString()}"`
    ].join(','));
  });

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Municipal_Operations_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ==========================================================================
   10. COMMON HELPERS & MODALS
   ========================================================================== */
function awardCredits(amount, reason) {
  if (currentUser.role === 'institution') return;

  let users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx].credits = (users[idx].credits || 0) + amount;
    if (!users[idx].transactions) users[idx].transactions = [];
    users[idx].transactions.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason,
      amount
    });
    saveUsers(users);
    currentUser = users[idx];
    localStorage.setItem('swm_current_user', JSON.stringify(currentUser));
  }
}

window.openCreditLedgerModal = function() {
  const modal = document.getElementById('creditLedgerModal');
  const tbody = document.getElementById('creditLedgerTableBody');

  const txs = currentUser.transactions || [];
  if (txs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No transactions recorded.</td></tr>`;
  } else {
    tbody.innerHTML = txs.map(t => `
      <tr>
        <td><code>${t.date}</code></td>
        <td>${t.reason}</td>
        <td><strong style="color: ${t.amount >= 0 ? 'var(--civic-spruce-green)' : 'var(--civic-signal-crimson)'};">${t.amount >= 0 ? '+' : ''}${t.amount} credits</strong></td>
      </tr>
    `).join('');
  }

  modal.classList.add('active');
};

window.closeModal = function(modalId) {
  document.getElementById(modalId).classList.remove('active');
};

function checkAndMergeDuplicates(newReport) {
  let reports = getReports();
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

  const duplicateIndex = reports.findIndex(r => {
    if (r.status === 'cleared') return false;
    const isSameArea = r.area.toLowerCase() === newReport.area.toLowerCase();
    const isSameLandmark = r.landmark.toLowerCase().trim() === newReport.landmark.toLowerCase().trim();
    return isSameArea && isSameLandmark && (Date.now() - r.createdAt < TWO_HOURS_MS);
  });

  if (duplicateIndex !== -1) {
    const dup = reports[duplicateIndex];
    dup.duplicateCount = (dup.duplicateCount || 1) + 1;
    dup.notes += `\n[Duplicate report merged at ${new Date().toLocaleTimeString()} by ${newReport.userName}]`;
    if (newReport.isEmergency) dup.isEmergency = true;
    
    saveReports(reports);
    alert(`⚡ DUPLICATE DETECTED: Report merged into active task #${dup.id}. Priority boosted!`);
    return true;
  }

  return false;
}

function evaluateEscalations() {
  let reports = getReports();
  let updated = false;
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  reports.forEach(r => {
    if (r.status === 'assigned' && r.assignedAt) {
      if ((Date.now() - r.assignedAt) > TWENTY_FOUR_HOURS_MS) {
        if (!r.isEscalated) {
          r.isEscalated = true;
          updated = true;
        }
      }
    }
  });

  if (updated) saveReports(reports);
}

const SEGREGATION_ITEMS = [
  { name: 'Vegetable & Fruit Peels', bin: 'Wet Organic Waste', tag: 'bin-tag-green', tip: 'Compostable at home or municipal biomethanation plants.' },
  { name: 'Milk Pouches & Wrappers', bin: 'Dry Recyclable', tag: 'bin-tag-blue', tip: 'Rinse with water and dry before bin placement.' },
  { name: 'AA/AAA Alkaline Batteries', bin: 'Domestic Hazardous', tag: 'bin-tag-yellow', tip: 'Contains heavy metals; deposit at authorized e-waste points.' },
  { name: 'Used CFL Bulbs & Tubelights', bin: 'Domestic Hazardous', tag: 'bin-tag-yellow', tip: 'Mercury hazard; wrap in paper before yellow bin disposal.' },
  { name: 'Corrugated Delivery Boxes', bin: 'Dry Recyclable', tag: 'bin-tag-blue', tip: 'Flatten cardboard boxes to optimize vehicle volume.' },
  { name: 'Sanitary Napkins & Diapers', bin: 'Sanitary Waste', tag: 'bin-tag-red', tip: 'Wrap securely in newspaper marked with a red cross.' },
  { name: 'Glass Beverage Bottles', bin: 'Dry Recyclable', tag: 'bin-tag-blue', tip: 'Infinitely recyclable; rinse clean of organic residues.' }
];

function initSegregationGuide() {
  const input = document.getElementById('guideSearchInput');
  const grid = document.getElementById('guideResultsGrid');
  if (!grid) return;

  function render(items) {
    grid.innerHTML = items.map(i => `
      <div class="guide-item-card">
        <div>
          <strong>${i.name}</strong>
          <div><span class="bin-tag ${i.tag}">${i.bin}</span></div>
        </div>
        <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.4rem;">${i.tip}</div>
      </div>
    `).join('');
  }

  render(SEGREGATION_ITEMS);

  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = SEGREGATION_ITEMS.filter(i => 
        i.name.toLowerCase().includes(q) || i.bin.toLowerCase().includes(q)
      );
      render(filtered);
    });
  }
}

let impactChartObj = null;

function renderPersonalImpactTracker() {
  const reports = getReports().filter(r => r.userId === currentUser.id && r.status !== 'rejected');
  const validCount = reports.length;
  const divertedKg = validCount * 15;
  const co2SavedKg = Math.round(divertedKg * 0.5);

  document.getElementById('impactTotalReports').textContent = validCount;
  document.getElementById('impactLandfillDiverted').textContent = `${divertedKg} kg`;
  document.getElementById('impactCO2Saved').textContent = `${co2SavedKg} kg`;

  const canvas = document.getElementById('citizenImpactChart');
  if (!canvas) return;

  if (impactChartObj) impactChartObj.destroy();

  impactChartObj = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6 (Current)'],
      datasets: [
        {
          label: 'Waste Diverted (kg)',
          data: [10, 15, 25, 20, 35, divertedKg || 15],
          backgroundColor: '#166534'
        },
        {
          label: 'CO₂ Offset (kg)',
          data: [5, 7.5, 12.5, 10, 17.5, co2SavedKg || 7.5],
          backgroundColor: '#1c52d8'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } }
    }
  });
}

function formatTimeAgo(timestamp) {
  const mins = Math.floor((Date.now() - timestamp) / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
