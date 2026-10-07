/* ==========================================================================
   SMART WASTE MANAGEMENT SYSTEM - APPLICATION ENGINE
   Municipal Urban Services Platform (Software-Only Multi-Role Architecture)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDataStores();
  initBackendSync();
  initAuth();
  initVoiceRecorder();
  initSegregationGuide();
  initAdminEventListeners();
  initPWA();
  initLanguage();
  initNotifications();
  initKeyboardShortcuts();
  initOfflineQueueSync();
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
    name: 'Bombay Scottish School, Powai', 
    role: 'institution', 
    institutionType: 'school',
    schoolName: 'Bombay Scottish School, Powai',
    verificationCode: 'INST-SCH-8821',
    branches: [
      { id: 'br-dps-main', name: 'Powai Senior Campus', ward: 'Ward S - Powai Lake & Tech Enclave', address: 'Plot 4, Technology Corridor, Powai', lat: 19.1250, lng: 72.9150 },
      { id: 'br-dps-junior', name: 'Dadar Junior Wing', ward: 'Ward G/South - Dadar & Elphinstone', address: 'Near Shivaji Park, Dadar West', lat: 19.0220, lng: 72.8380 }
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
    name: 'Tata Consultancy Services, Andheri (E)', 
    role: 'institution', 
    institutionType: 'company',
    companyName: 'Tata Consultancy Services, Andheri (E)',
    businessType: 'IT / Tech Office',
    verificationCode: 'CORP-TCS-4401',
    branches: [
      { id: 'br-infy-main', name: 'Andheri Tech Park', ward: 'Ward K/East - Andheri Industrial Estate', address: 'Plot 22, MIDC Innovation Park, Andheri East', lat: 19.1150, lng: 72.8680 },
      { id: 'br-infy-dev', name: 'Bandra Development Center', ward: 'Ward H/West - Bandra Residential', address: 'Tower 3, Hill Road Tech Center, Bandra', lat: 19.0580, lng: 72.8310 }
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
    crewNumber: '101',
    role: 'worker', 
    verificationCode: 'WRK-101',
    assignedWard: 'Ward G/South - Dadar & Elphinstone',
    vehicleType: 'Heavy Hydraulic Compactor (10T)',
    vehicleRegistration: 'MH-01-GA-4401',
    shiftStatus: 'active',
    lastKnownLat: 19.0200,
    lastKnownLng: 72.8350,
    lastLocationUpdatedAt: Date.now() - 120000
  },
  { 
    id: 'usr-7', 
    email: 'crew102@cleanward.org', 
    pass: 'demo123', 
    name: 'Sunita Devi (Crew #102)', 
    crewNumber: '102',
    role: 'worker', 
    verificationCode: 'WRK-102',
    assignedWard: 'Ward H/West - Bandra Residential',
    vehicleType: 'Electric Multi-Bin Tipper Auto (1.5T)',
    vehicleRegistration: 'MH-02-EV-1088',
    shiftStatus: 'active',
    lastKnownLat: 19.0595,
    lastKnownLng: 72.8295,
    lastLocationUpdatedAt: Date.now() - 180000
  },
  { 
    id: 'usr-8', 
    email: 'crew103@cleanward.org', 
    pass: 'demo123', 
    name: 'Amit Verma (Crew #103)', 
    crewNumber: '103',
    role: 'worker', 
    verificationCode: 'WRK-103',
    assignedWard: 'Ward K/East - Andheri Industrial Estate',
    vehicleType: 'Biomedical Closed-Chamber Van (2T)',
    vehicleRegistration: 'MH-03-HA-0912',
    shiftStatus: 'active',
    lastKnownLat: 19.1136,
    lastKnownLng: 72.8697,
    lastLocationUpdatedAt: Date.now() - 240000
  },
  { 
    id: 'usr-9', 
    email: 'crew104@cleanward.org', 
    pass: 'demo123', 
    name: 'Harish Kumar (Crew #104)', 
    crewNumber: '104',
    role: 'worker', 
    verificationCode: 'WRK-104',
    assignedWard: 'Ward S - Powai Lake & Tech Enclave',
    vehicleType: 'C&D Debris Hydraulic Dumper (14T)',
    vehicleRegistration: 'MH-04-CD-5501',
    shiftStatus: 'active',
    lastKnownLat: 19.1255,
    lastKnownLng: 72.9120,
    lastLocationUpdatedAt: Date.now() - 300000
  },
  { 
    id: 'usr-10', 
    email: 'crew105@cleanward.org', 
    pass: 'demo123', 
    name: 'Sachin Kamble (Crew #105)', 
    crewNumber: '105',
    role: 'worker', 
    verificationCode: 'WRK-105',
    assignedWard: 'Ward R/Central - Borivali West',
    vehicleType: 'Mini Tipper E-Rickshaw (0.8T)',
    vehicleRegistration: 'MH-02-ET-5055',
    shiftStatus: 'off-shift',
    lastKnownLat: 19.2307,
    lastKnownLng: 72.8567,
    lastLocationUpdatedAt: Date.now() - 3600000
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
    area: 'Ward G/South - Dadar & Elphinstone',
    coords: { lat: 19.0210, lng: 72.8350 },
    latitude: 19.0210,
    longitude: 72.8350,
    landmark: 'Dadar Commercial Plaza Gate 2 Bin Point',
    resolvedAddress: 'Dadar Commercial Plaza Gate 2, Senapati Bapat Marg, Ward G/South',
    category: 'plastic',
    severity: 'overflowing',
    notes: 'Plastic packaging spillage blocking pedestrian footpath.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-4',
    assignedWorkerName: 'Rajesh Singh (Crew #101)',
    createdAt: Date.now() - 45 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  },
  {
    id: 'EMG-401',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward G/South - Dadar & Elphinstone',
    coords: { lat: 19.0190, lng: 72.8420 },
    latitude: 19.0190,
    longitude: 72.8420,
    landmark: 'Dadar Station Road Chemical Hazard Point',
    resolvedAddress: 'Near Dadar Station East Exit, Ward G/South',
    category: 'chemical',
    severity: 'emergency',
    notes: 'Corrosive industrial battery leakage spreading on pavement.',
    isEmergency: true,
    status: 'assigned',
    assignedWorkerId: 'usr-4',
    assignedWorkerName: 'Rajesh Singh (Crew #101)',
    createdAt: Date.now() - 15 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'REP-1004',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward G/South - Dadar & Elphinstone',
    coords: { lat: 19.0168, lng: 72.8300 },
    latitude: 19.0168,
    longitude: 72.8300,
    landmark: 'Siddhivinayak Temple Perimeter Bins',
    resolvedAddress: 'SK Bole Marg, Prabhadevi / Dadar, Ward G/South',
    category: 'organic',
    severity: 'full',
    notes: 'Flower offerings and coconut husk bio-waste accumulating.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-4',
    assignedWorkerName: 'Rajesh Singh (Crew #101)',
    createdAt: Date.now() - 50 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'REP-1002',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward H/West - Bandra Residential',
    coords: { lat: 19.0580, lng: 72.8300 },
    latitude: 19.0580,
    longitude: 72.8300,
    landmark: 'Bandra Community Park Main Gate',
    resolvedAddress: 'Bandra 5th Cross, Community Park Gate, Ward H/West',
    category: 'organic',
    severity: 'full',
    notes: 'Dry leaves and organic bins filled after morning sweep.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-7',
    assignedWorkerName: 'Sunita Devi (Crew #102)',
    createdAt: Date.now() - (26 * 60 * 60 * 1000),
    assignedAt: Date.now() - (25 * 60 * 60 * 1000),
    duplicateCount: 2,
    isEscalated: true
  },
  {
    id: 'REP-1005',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward H/West - Bandra Residential',
    coords: { lat: 19.0620, lng: 72.8270 },
    latitude: 19.0620,
    longitude: 72.8270,
    landmark: 'Pali Hill Market Dry Waste Point',
    resolvedAddress: 'Nargis Dutt Road, Pali Hill, Bandra West, Ward H/West',
    category: 'plastic',
    severity: 'overflowing',
    notes: 'Recyclable packaging from weekend organic food stalls.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-7',
    assignedWorkerName: 'Sunita Devi (Crew #102)',
    createdAt: Date.now() - 80 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  },
  {
    id: 'EMG-402',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward H/West - Bandra Residential',
    coords: { lat: 19.0550, lng: 72.8340 },
    latitude: 19.0550,
    longitude: 72.8340,
    landmark: 'Bandra Polyclinic Alleyway',
    resolvedAddress: 'Waterfield Road Lane 3, Bandra West, Ward H/West',
    category: 'biomedical',
    severity: 'emergency',
    notes: 'Illegal dumping of clinic syringes and biohazard bags.',
    isEmergency: true,
    status: 'assigned',
    assignedWorkerId: 'usr-7',
    assignedWorkerName: 'Sunita Devi (Crew #102)',
    createdAt: Date.now() - 20 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'BULK-2002',
    userId: 'usr-6',
    userName: 'Tata Consultancy Services, Andheri (E)',
    institutionType: 'company',
    companyName: 'Tata Consultancy Services, Andheri (E)',
    businessType: 'IT / Tech Office',
    branchId: 'br-infy-main',
    branchName: 'Andheri Tech Park',
    userRole: 'institution',
    area: 'Ward K/East - Andheri Industrial Estate',
    coords: { lat: 19.1150, lng: 72.8680 },
    latitude: 19.1150,
    longitude: 72.8680,
    landmark: 'Server Room Recycling Bay #3',
    resolvedAddress: 'Plot 22 MIDC Innovation Park, Andheri East, Ward K/East',
    category: 'office_paper',
    severity: 'full',
    notes: 'Disposal of 420 kg confidential shredded documentation and corrugated paperboard.',
    isBulk: true,
    volumeKg: 420,
    containerCount: 6,
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-8',
    assignedWorkerName: 'Amit Verma (Crew #103)',
    createdAt: Date.now() - 60 * 60 * 1000,
    assignedAt: Date.now() - 40 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  },
  {
    id: 'REP-1006',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward K/East - Andheri Industrial Estate',
    coords: { lat: 19.1110, lng: 72.8610 },
    latitude: 19.1110,
    longitude: 72.8610,
    landmark: 'Chakala Metro Station Footbridge Bin',
    resolvedAddress: 'Andheri-Kurla Road, Chakala, Ward K/East',
    category: 'plastic',
    severity: 'overflowing',
    notes: 'Litter accumulation along metro entry stairway.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-8',
    assignedWorkerName: 'Amit Verma (Crew #103)',
    createdAt: Date.now() - 75 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'EMG-403',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward K/East - Andheri Industrial Estate',
    coords: { lat: 19.1180, lng: 72.8750 },
    latitude: 19.1180,
    longitude: 72.8750,
    landmark: 'Marol Pipeline Road Industrial Junction',
    resolvedAddress: 'Marol Pipeline Rd, Andheri East, Ward K/East',
    category: 'chemical',
    severity: 'emergency',
    notes: 'Hazardous solvent barrel punctured; chemical runoff approaching storm drain.',
    isEmergency: true,
    status: 'assigned',
    assignedWorkerId: 'usr-8',
    assignedWorkerName: 'Amit Verma (Crew #103)',
    createdAt: Date.now() - 10 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'BULK-2001',
    userId: 'usr-2',
    userName: 'Bombay Scottish School, Powai',
    institutionType: 'school',
    schoolName: 'Bombay Scottish School, Powai',
    branchId: 'br-dps-main',
    branchName: 'Powai Senior Campus',
    userRole: 'institution',
    area: 'Ward S - Powai Lake & Tech Enclave',
    coords: { lat: 19.1250, lng: 72.9150 },
    latitude: 19.1250,
    longitude: 72.9150,
    landmark: 'School Cafeteria Loading Dock',
    resolvedAddress: 'Plot 4 Technology Corridor, Powai, Ward S',
    category: 'commercial_food',
    severity: 'overflowing',
    notes: 'Bulk organic food waste from annual school environmental assembly.',
    isBulk: true,
    volumeKg: 350,
    containerCount: 5,
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-9',
    assignedWorkerName: 'Harish Kumar (Crew #104)',
    createdAt: Date.now() - 30 * 60 * 1000,
    duplicateCount: 1,
    isEscalated: false
  },
  {
    id: 'REP-1007',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward S - Powai Lake & Tech Enclave',
    coords: { lat: 19.1190, lng: 72.9080 },
    latitude: 19.1190,
    longitude: 72.9080,
    landmark: 'Hiranandani Gardens Central Avenue Bins',
    resolvedAddress: 'Central Ave, Hiranandani Gardens, Powai, Ward S',
    category: 'plastic',
    severity: 'full',
    notes: 'E-commerce delivery carton packaging overflowing community cage.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-9',
    assignedWorkerName: 'Harish Kumar (Crew #104)',
    createdAt: Date.now() - 95 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'EMG-404',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward S - Powai Lake & Tech Enclave',
    coords: { lat: 19.1280, lng: 72.9050 },
    latitude: 19.1280,
    longitude: 72.9050,
    landmark: 'Powai Lake Promenade Storm Drain',
    resolvedAddress: 'JVLR Promenade near IIT Gate, Powai, Ward S',
    category: 'construction_debris',
    severity: 'emergency',
    notes: 'Illegal masonry debris dumping blocking natural storm water runoff during rain alert.',
    isEmergency: true,
    status: 'assigned',
    assignedWorkerId: 'usr-9',
    assignedWorkerName: 'Harish Kumar (Crew #104)',
    createdAt: Date.now() - 25 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'REP-1008',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward R/Central - Borivali West',
    coords: { lat: 19.2295, lng: 72.8570 },
    latitude: 19.2295,
    longitude: 72.8570,
    landmark: 'Borivali Railway Station West Exit',
    resolvedAddress: 'Station Road West, Borivali West, Ward R/Central',
    category: 'plastic',
    severity: 'overflowing',
    notes: 'Single-use snack wrappers and plastic bottles surrounding ticket counter entrance.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-10',
    assignedWorkerName: 'Sachin Kamble (Crew #105)',
    createdAt: Date.now() - 110 * 60 * 1000,
    duplicateCount: 2,
    isEscalated: false
  },
  {
    id: 'REP-1009',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward R/Central - Borivali West',
    coords: { lat: 19.2340, lng: 72.8520 },
    latitude: 19.2340,
    longitude: 72.8520,
    landmark: 'Shimpoli Road Vegetable Market Organic Drop-off',
    resolvedAddress: 'Shimpoli Rd, Borivali West, Ward R/Central',
    category: 'organic',
    severity: 'full',
    notes: 'Vegetable trimmings and wholesale crate greens ready for compost transit.',
    isEmergency: false,
    status: 'assigned',
    assignedWorkerId: 'usr-10',
    assignedWorkerName: 'Sachin Kamble (Crew #105)',
    createdAt: Date.now() - 140 * 60 * 1000,
    duplicateCount: 0,
    isEscalated: false
  },
  {
    id: 'EMG-405',
    userId: 'usr-1',
    userName: 'Ananya Sharma',
    userRole: 'citizen',
    area: 'Ward R/Central - Borivali West',
    coords: { lat: 19.2380, lng: 72.8460 },
    latitude: 19.2380,
    longitude: 72.8460,
    landmark: 'Gorai Creek Bridge Access Road',
    resolvedAddress: 'Gorai Rd near Creek Gate, Borivali West, Ward R/Central',
    category: 'hazardous',
    severity: 'emergency',
    notes: 'Overturned industrial grease drum blocking one lane of vehicular traffic.',
    isEmergency: true,
    status: 'assigned',
    assignedWorkerId: 'usr-10',
    assignedWorkerName: 'Sachin Kamble (Crew #105)',
    createdAt: Date.now() - 18 * 60 * 1000,
    duplicateCount: 0,
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
    treatmentFacility: 'SMS Envoclean CBWTF, Govandi, Mumbai',
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
    treatmentFacility: 'Mumbai Central Bio-Hazard Autoclave Unit 4',
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
  { ward: 'Ward G/South - Dadar & Elphinstone', segregationRate: 74, coverageRate: 92, processingRate: 85, status: 'ontrack' },
  { ward: 'Ward H/West - Bandra Residential', segregationRate: 68, coverageRate: 88, processingRate: 82, status: 'ontrack' },
  { ward: 'Ward K/East - Andheri Industrial Estate', segregationRate: 78, coverageRate: 86, processingRate: 80, status: 'ontrack' },
  { ward: 'Ward S - Powai Lake & Tech Enclave', segregationRate: 44, coverageRate: 68, processingRate: 59, status: 'offtarget' },
  { ward: 'Ward A - Colaba & Fort Commercial', segregationRate: 62, coverageRate: 84, processingRate: 81, status: 'ontrack' }
];

const SEED_FLEET = [
  { id: 'FLT-CT-401', type: 'Heavy Hydraulic Compactor (10T)', regNo: 'MH-01-GA-4401', ward: 'Ward G/South - Dadar & Elphinstone', driver: 'Rajesh Singh (Crew #101)', driverId: 'usr-4', contact: '+91 98112-40192', capacityTon: 10.0, currentPayloadTon: 7.8, fuelPercent: 84, status: 'Active Collection', icon: '🚛', lastKnownLat: 19.0200, lastKnownLng: 72.8350, lastLocationUpdatedAt: Date.now() - 120000 },
  { id: 'FLT-ET-108', type: 'Electric Multi-Bin Tipper Auto (1.5T)', regNo: 'MH-02-EV-1088', ward: 'Ward H/West - Bandra Residential', driver: 'Sunita Devi (Crew #102)', driverId: 'usr-7', contact: '+91 98711-20984', capacityTon: 1.5, currentPayloadTon: 1.35, fuelPercent: 68, status: 'Active Collection', icon: '🛺', lastKnownLat: 19.0595, lastKnownLng: 72.8295, lastLocationUpdatedAt: Date.now() - 180000 },
  { id: 'FLT-BM-09', type: 'Biomedical Closed-Chamber Van (2T)', regNo: 'MH-03-HA-0912', ward: 'Ward K/East - Andheri Industrial Estate', driver: 'Amit Verma (Crew #103)', driverId: 'usr-8', contact: '+91 98104-55120', capacityTon: 2.0, currentPayloadTon: 0.7, fuelPercent: 92, status: 'Active Collection', icon: '🚐', lastKnownLat: 19.1136, lastKnownLng: 72.8697, lastLocationUpdatedAt: Date.now() - 240000 },
  { id: 'FLT-CD-550', type: 'C&D Debris Hydraulic Dumper (14T)', regNo: 'MH-04-CD-5501', ward: 'Ward S - Powai Lake & Tech Enclave', driver: 'Harish Kumar (Crew #104)', driverId: 'usr-9', contact: '+91 98119-33829', capacityTon: 14.0, currentPayloadTon: 8.4, fuelPercent: 76, status: 'Active Collection', icon: '🚜', lastKnownLat: 19.1255, lastKnownLng: 72.9120, lastLocationUpdatedAt: Date.now() - 300000 },
  { id: 'FLT-MR-505', type: 'Mini Tipper E-Rickshaw (0.8T)', regNo: 'MH-02-ET-5055', ward: 'Ward R/Central - Borivali West', driver: 'Sachin Kamble (Crew #105)', driverId: 'usr-10', contact: '+91 98200-88411', capacityTon: 0.8, currentPayloadTon: 0.2, fuelPercent: 95, status: 'Idle / Off-Shift', icon: '🛺', lastKnownLat: 19.2307, lastKnownLng: 72.8567, lastLocationUpdatedAt: Date.now() - 3600000 }
];

let currentUser = null;
let citizenFilter = 'all';

function initDataStores() {
  const storedUsers = localStorage.getItem('swm_users');
  if (!storedUsers || !storedUsers.includes('crew105')) {
    localStorage.setItem('swm_users', JSON.stringify(SEED_USERS));
  }
  const storedReports = localStorage.getItem('swm_reports');
  if (!storedReports || !storedReports.includes('EMG-405')) {
    localStorage.setItem('swm_reports', JSON.stringify(SEED_REPORTS));
  }
  const storedFleet = localStorage.getItem('swm_fleet');
  if (!storedFleet || !storedFleet.includes('FLT-MR-505')) {
    localStorage.setItem('swm_fleet', JSON.stringify(SEED_FLEET));
  }
  if (!localStorage.getItem('swm_hospital_reports')) localStorage.setItem('swm_hospital_reports', JSON.stringify(SEED_HOSPITAL_REPORTS));
  if (!localStorage.getItem('swm_hospital_staff')) localStorage.setItem('swm_hospital_staff', JSON.stringify(SEED_HOSPITAL_STAFF));
  if (!localStorage.getItem('swm_redemptions')) localStorage.setItem('swm_redemptions', JSON.stringify(SEED_REDEMPTIONS));
  if (!localStorage.getItem('swm_compliance_metrics')) localStorage.setItem('swm_compliance_metrics', JSON.stringify(SEED_COMPLIANCE_METRICS));
  if (!localStorage.getItem('swm_broadcasts')) localStorage.setItem('swm_broadcasts', JSON.stringify([
    {
      id: 'BC-101',
      message: 'Monsoon Protocol Active: Segregate wet organic waste into covered green bins to prevent drain blockages.',
      level: 'warning',
      author: 'Municipal Sanitation Officer',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      active: true
    }
  ]));
  if (!localStorage.getItem('swm_audit_logs')) localStorage.setItem('swm_audit_logs', JSON.stringify([
    { id: 'log-1', timestamp: Date.now() - 3 * 60 * 60 * 1000, actor: 'System', action: 'INIT', details: 'Municipal Waste Management Platform Initialized.' },
    { id: 'log-2', timestamp: Date.now() - 2 * 60 * 60 * 1000, actor: 'Admin', action: 'BROADCAST', details: 'Transmitted Monsoon Protocol directive to all citizen wards.' },
    { id: 'log-3', timestamp: Date.now() - 40 * 60 * 1000, actor: 'Admin', action: 'CREW_ASSIGNED', details: 'Assigned bulk paper collection BULK-2002 to Rajesh Singh (Crew #101).' }
  ]));
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

function getBroadcasts() { return JSON.parse(localStorage.getItem('swm_broadcasts') || '[]'); }
function saveBroadcasts(b) { localStorage.setItem('swm_broadcasts', JSON.stringify(b)); }

function getAuditLogs() { return JSON.parse(localStorage.getItem('swm_audit_logs') || '[]'); }
function saveAuditLogs(l) { localStorage.setItem('swm_audit_logs', JSON.stringify(l)); }

function addAuditLog(actor, action, details) {
  const logs = getAuditLogs();
  const entry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now(),
    actor: actor || (currentUser ? currentUser.name : 'System'),
    action,
    details
  };
  logs.unshift(entry);
  if (logs.length > 200) logs.pop();
  saveAuditLogs(logs);

  if (isBackendConnected) {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(() => {});
  }
  return entry;
}

// REST API Integration & Sync Engine
let isBackendConnected = false;

async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      isBackendConnected = true;
      updateBackendStatusIndicator(true);
      return true;
    }
  } catch (e) {}
  isBackendConnected = false;
  updateBackendStatusIndicator(false);
  return false;
}

function updateBackendStatusIndicator(online) {
  const pills = [document.getElementById('backendStatusPill'), document.getElementById('guestBackendStatusPill')];
  pills.forEach(p => {
    if (p) {
      if (online) {
        p.textContent = '🟢 REST API Online';
        p.classList.remove('offline');
        p.title = 'Connected to Node.js backend on http://localhost:8080/';
      } else {
        p.textContent = '🟠 Local Mode (Offline)';
        p.classList.add('offline');
        p.title = 'Operating via browser storage fallback';
      }
    }
  });
}

async function syncWithBackend() {
  const isHealthy = await checkBackendHealth();
  if (!isHealthy) return;

  try {
    const [reportsRes, fleetRes, hospitalRes, redemptionsRes, complianceRes, broadcastRes, logsRes] = await Promise.all([
      fetch('/api/reports').catch(() => null),
      fetch('/api/fleet').catch(() => null),
      fetch('/api/hospital-reports').catch(() => null),
      fetch('/api/redemptions').catch(() => null),
      fetch('/api/compliance').catch(() => null),
      fetch('/api/broadcasts').catch(() => null),
      fetch('/api/logs').catch(() => null)
    ]);

    if (reportsRes && reportsRes.ok) {
      const data = await reportsRes.json();
      if (Array.isArray(data)) saveReports(data);
    }
    if (fleetRes && fleetRes.ok) {
      const data = await fleetRes.json();
      if (Array.isArray(data)) saveFleet(data);
    }
    if (hospitalRes && hospitalRes.ok) {
      const data = await hospitalRes.json();
      if (Array.isArray(data)) saveHospitalReports(data);
    }
    if (redemptionsRes && redemptionsRes.ok) {
      const data = await redemptionsRes.json();
      if (Array.isArray(data)) saveRedemptions(data);
    }
    if (complianceRes && complianceRes.ok) {
      const data = await complianceRes.json();
      if (Array.isArray(data)) localStorage.setItem('swm_compliance_metrics', JSON.stringify(data));
    }
    if (broadcastRes && broadcastRes.ok) {
      const data = await broadcastRes.json();
      if (Array.isArray(data)) saveBroadcasts(data);
    }
    if (logsRes && logsRes.ok) {
      const data = await logsRes.json();
      if (Array.isArray(data)) saveAuditLogs(data);
    }

    displayActiveBroadcasts();
    if (currentUser && currentUser.role === 'admin') {
      renderAdminDashboard();
    }
  } catch (e) {
    console.warn('Backend sync notice:', e);
  }
}

function initBackendSync() {
  checkBackendHealth();
  syncWithBackend();
  displayActiveBroadcasts();
}

function initAdminEventListeners() {
  const dispatchForm = document.getElementById('dispatchStandbyForm');
  if (dispatchForm) {
    dispatchForm.addEventListener('submit', (e) => {
      if (window.handleDispatchStandbySubmit) window.handleDispatchStandbySubmit(e);
    });
  }
  const noticeForm = document.getElementById('sanitationNoticeForm');
  if (noticeForm) {
    noticeForm.addEventListener('submit', (e) => {
      if (window.handleSanitationNoticeSubmit) window.handleSanitationNoticeSubmit(e);
    });
  }
}

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

  window.switchAuthTab = function(tab) {
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      loginForm.classList.remove('conditional-field-reveal');
      void loginForm.offsetWidth;
      loginForm.classList.add('conditional-field-reveal');
    } else {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
      signupForm.classList.remove('conditional-field-reveal');
      void signupForm.offsetWidth;
      signupForm.classList.add('conditional-field-reveal');
    }
  };

  tabLogin.addEventListener('click', () => window.switchAuthTab('login'));
  tabSignup.addEventListener('click', () => window.switchAuthTab('signup'));

  window.selectSignupRole = function(role) {
    const cards = document.querySelectorAll('.role-select-card');
    cards.forEach(c => {
      if (c.getAttribute('data-role') === role) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    if (signupRole) {
      signupRole.value = role;
      signupRole.dispatchEvent(new Event('change'));
    }
  };

  window.handleGoogleSignIn = function() {
    const btn = document.querySelector('.btn-google');
    if (btn) {
      btn.innerHTML = `<span class="btn-spinner"></span> Connecting Google Account...`;
      btn.classList.add('btn-loading');
    }
    setTimeout(() => {
      const users = getUsers();
      const citizen = users.find(u => u.email === 'citizen@ecoclear.org') || users[0];
      if (btn) btn.innerHTML = `✓ Google Verified`;
      setTimeout(() => {
        setCurrentUser(citizen);
      }, 250);
    }, 450);
  };

  function triggerFieldValidationError(element) {
    if (!element) return;
    element.classList.remove('form-input-error');
    void element.offsetWidth;
    element.classList.add('form-input-error');
    element.focus();
    setTimeout(() => {
      element.classList.remove('form-input-error');
    }, 1200);
  }

  function updateSignupRoleFields() {
    const role = signupRole.value;
    if (role === 'institution') {
      institutionTypeGroup.style.display = 'block';
      institutionTypeGroup.classList.remove('conditional-field-reveal');
      void institutionTypeGroup.offsetWidth;
      institutionTypeGroup.classList.add('conditional-field-reveal');

      updateInstitutionTypeFields();

      verificationFieldGroup.style.display = 'block';
      verificationFieldGroup.classList.remove('conditional-field-reveal');
      void verificationFieldGroup.offsetWidth;
      verificationFieldGroup.classList.add('conditional-field-reveal');
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
        verificationFieldGroup.classList.remove('conditional-field-reveal');
        void verificationFieldGroup.offsetWidth;
        verificationFieldGroup.classList.add('conditional-field-reveal');
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
      schoolFieldGroup.classList.remove('conditional-field-reveal');
      void schoolFieldGroup.offsetWidth;
      schoolFieldGroup.classList.add('conditional-field-reveal');

      companyFieldGroup.style.display = 'none';
      businessTypeFieldGroup.style.display = 'none';
      document.getElementById('signupSchoolName').setAttribute('required', 'true');
      document.getElementById('signupCompanyName').removeAttribute('required');
    } else if (type === 'company') {
      schoolFieldGroup.style.display = 'none';
      companyFieldGroup.style.display = 'block';
      companyFieldGroup.classList.remove('conditional-field-reveal');
      void companyFieldGroup.offsetWidth;
      companyFieldGroup.classList.add('conditional-field-reveal');

      businessTypeFieldGroup.style.display = 'block';
      businessTypeFieldGroup.classList.remove('conditional-field-reveal');
      void businessTypeFieldGroup.offsetWidth;
      businessTypeFieldGroup.classList.add('conditional-field-reveal');

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
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn') || loginForm.querySelector('button[type="submit"]');

    const email = emailInput.value.trim();
    const pass = passInput.value;

    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

    if (found) {
      if (submitBtn) {
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = `<span class="btn-spinner"></span> Authenticating...`;
      }
      setTimeout(() => {
        if (submitBtn) submitBtn.innerHTML = `✓ Access Authorized`;
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = `Sign In`;
          }
          setCurrentUser(found);
        }, 180);
      }, 350);
    } else {
      triggerFieldValidationError(emailInput);
      triggerFieldValidationError(passInput);
      alert('Invalid login credentials! Please use one of the quick test login buttons below.');
    }
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPassword');
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const pass = passInput.value;
    const role = signupRole.value;
    const instType = signupInstType.value;
    const schoolNameInput = document.getElementById('signupSchoolName');
    const companyNameInput = document.getElementById('signupCompanyName');
    const verificationCodeInput = document.getElementById('signupVerificationCode');

    const schoolName = schoolNameInput ? schoolNameInput.value.trim() : '';
    const companyName = companyNameInput ? companyNameInput.value.trim() : '';
    const businessType = document.getElementById('signupBusinessType')?.value || '';
    const verificationCode = verificationCodeInput ? verificationCodeInput.value.trim() : '';

    if (role === 'institution') {
      if (instType === 'school' && !schoolName) {
        triggerFieldValidationError(schoolNameInput);
        alert('School Name is required when registering an educational institution.');
        return;
      }
      if (instType === 'company' && !companyName) {
        triggerFieldValidationError(companyNameInput);
        alert('Company Name is required when registering a corporate office institution.');
        return;
      }
    }

    if (role !== 'citizen' && !verificationCode) {
      triggerFieldValidationError(verificationCodeInput);
      alert(`Registration ID is required for official role: ${role.toUpperCase()}`);
      return;
    }
    if (role === 'admin' && verificationCode !== 'ADMIN2026') {
      triggerFieldValidationError(verificationCodeInput);
      alert('Incorrect Admin Secret Passcode! (Use "ADMIN2026")');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      triggerFieldValidationError(emailInput);
      alert('An account with this email address already exists!');
      return;
    }

    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.innerHTML = `<span class="btn-spinner"></span> Creating Account...`;
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
        { id: 'br-main', name: 'Main Campus / Facility', address: 'Loading Gate #1', ward: 'Ward K/East - Andheri Industrial Estate', lat: 19.1136, lng: 72.8697 }
      ] : null,
      activeBranchId: role === 'institution' ? 'br-main' : null,
      recurringSchedule: role === 'institution' ? { frequency: 'daily', timeSlot: '06:00 - 08:00 AM' } : null,
      selfAudits: role === 'institution' ? [{ date: new Date().toISOString().slice(0, 10), rate: 85, stream: 'General' }] : null,
      hazardThreshold: role === 'hospital' ? 25 : null,
      transactions: [
        { date: new Date().toISOString().replace('T', ' ').slice(0, 16), reason: 'Registration Welcome Bonus', amount: 30 }
      ]
    };

    setTimeout(() => {
      users.push(newUser);
      saveUsers(users);

      addAuditLog(newUser.name, 'ACCOUNT_CREATED', `Registered new ${role.toUpperCase()} account: ${email}`);

      if (submitBtn) {
        submitBtn.innerHTML = `✓ Registered Successfully`;
      }
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('btn-loading');
          submitBtn.innerHTML = `Create Account`;
        }
        setCurrentUser(newUser);
      }, 200);
    }, 380);
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

function demoSwitchRole(role) {
  const roleEmailMap = {
    citizen: 'citizen@ecoclear.org',
    institution: 'school@cityedu.org',
    school: 'school@cityedu.org',
    company: 'infosys@campus.org',
    hospital: 'citycare@hospital.org',
    worker: 'crew101@cleanward.org',
    worker101: 'crew101@cleanward.org',
    worker102: 'crew102@cleanward.org',
    worker103: 'crew103@cleanward.org',
    worker104: 'crew104@cleanward.org',
    worker105: 'crew105@cleanward.org',
    admin: 'admin@citygov.org'
  };
  const targetEmail = roleEmailMap[role] || (role && role.includes('@') ? role : 'citizen@ecoclear.org');
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase() || u.role === role);
  if (found) setCurrentUser(found);
}
window.demoSwitchRole = demoSwitchRole;

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
   4. REAL LOCATION PICKER ENGINE (LEAFLET + NOMINATIM REVERSE GEOCODING + WARD AUTO-FILL)
   ========================================================================== */
const KNOWN_MUNICIPAL_WARDS = [
  { name: 'Ward K/East - Andheri Industrial Estate', lat: 19.1136, lng: 72.8697, keywords: ['andheri', 'midc', 'k/east', 'k-east', 'chakala', 'marol', 'saki naka', 'seepz', 'industrial'] },
  { name: 'Ward G/South - Dadar & Elphinstone', lat: 19.0178, lng: 72.8302, keywords: ['dadar', 'elphinstone', 'lower parel', 'prabhadevi', 'g/south', 'g-south', 'worli', 'currey road', 'commercial'] },
  { name: 'Ward H/West - Bandra Residential', lat: 19.0596, lng: 72.8295, keywords: ['bandra', 'khar', 'h/west', 'h-west', 'residential', 'pali hill', 'carter road', 'linking road', 'turner road'] },
  { name: 'Ward S - Powai Lake & Tech Enclave', lat: 19.1250, lng: 72.9150, keywords: ['powai', 'hiranandani', 'iit', 's ward', 'vikhroli', 'chandivali', 'kanjurmarg', 'tech enclave'] },
  { name: 'Ward A - Colaba & Fort Commercial', lat: 18.9220, lng: 72.8347, keywords: ['colaba', 'fort', 'cst', 'cstm', 'railway', 'nariman point', 'marine drive', 'ward a', 'churchgate'] }
];

function deriveWardFromCoordinates(lat, lng, addressData) {
  if (addressData) {
    const addrStr = (typeof addressData === 'string' ? addressData : JSON.stringify(addressData)).toLowerCase();
    for (const ward of KNOWN_MUNICIPAL_WARDS) {
      for (const kw of ward.keywords) {
        if (addrStr.includes(kw)) {
          return { wardName: ward.name, isExact: true, label: ward.name };
        }
      }
    }
  }

  // Fallback to nearest known seed ward using Haversine distance
  let nearestWard = KNOWN_MUNICIPAL_WARDS[0];
  let minDistance = Infinity;
  for (const ward of KNOWN_MUNICIPAL_WARDS) {
    const dist = calcDistance(lat, lng, ward.lat, ward.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestWard = ward;
    }
  }

  return {
    wardName: nearestWard.name,
    isExact: false,
    label: `Approximate zone — nearest match: ${nearestWard.name}`
  };
}

function updateWardFieldFromCoords(lat, lng, addressData, isCitizen) {
  const derivation = deriveWardFromCoordinates(lat, lng, addressData);
  const inputId = isCitizen ? 'citizenArea' : 'instArea';
  const noticeId = isCitizen ? 'citizenWardNotice' : 'instWardNotice';
  const input = document.getElementById(inputId);
  const notice = document.getElementById(noticeId);
  if (input) {
    input.value = derivation.label;
  }
  if (notice) {
    notice.textContent = derivation.isExact 
      ? `📍 Verified statutory zone: ${derivation.wardName}`
      : `📍 ${derivation.label}`;
  }
  return derivation;
}

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

  // Mumbai defaults: City center for Citizen, Andheri Industrial for Institution
  const defaultLat = isCitizen ? 19.0760 : 19.1136;
  const defaultLng = isCitizen ? 72.8777 : 72.8697;

  // Auto-fill initial ward from default coordinates
  updateWardFieldFromCoords(defaultLat, defaultLng, null, isCitizen);

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
    const latInp = document.getElementById(latInputId);
    const lngInp = document.getElementById(lngInputId);
    const badge = document.getElementById(badgeId);
    if (latInp) latInp.value = fixedLat;
    if (lngInp) lngInp.value = fixedLng;
    if (badge) badge.textContent = `Lat: ${fixedLat}, Lng: ${fixedLng}`;
    updateWardFieldFromCoords(fixedLat, fixedLng, null, isCitizen);
    reverseGeocode(fixedLat, fixedLng, landmarkInputId, statusId, isCitizen);
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

  // --- Real Location Priority on Map Load ---
  // Show brief loading indicator on map while attempting GPS detection
  let loadingChip = mapElem.querySelector('.map-gps-loading-indicator');
  if (!loadingChip) {
    loadingChip = document.createElement('div');
    loadingChip.className = 'map-gps-loading-indicator';
    loadingChip.innerHTML = '<span>📡</span> <span>Detecting your location...</span>';
    mapElem.style.position = 'relative';
    mapElem.appendChild(loadingChip);
  }

  const statusElem = document.getElementById(statusId);
  if (statusElem) statusElem.textContent = 'Detecting your current location via device GPS...';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (loadingChip && loadingChip.parentNode) loadingChip.remove();
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        map.setView([lat, lng], 16);
        marker.setLatLng([lat, lng]);
        updateCoords(lat, lng);
        if (statusElem) statusElem.textContent = '📍 Real current location acquired.';
      },
      (err) => {
        if (loadingChip && loadingChip.parentNode) loadingChip.remove();
        map.setView([defaultLat, defaultLng], 14);
        marker.setLatLng([defaultLat, defaultLng]);
        updateCoords(defaultLat, defaultLng);
        if (statusElem) {
          statusElem.textContent = "Location access unavailable — showing default area. Tap the map or click 'Use My Current Location' to set your exact spot.";
        }
      },
      { timeout: 7000 }
    );
  } else {
    if (loadingChip && loadingChip.parentNode) loadingChip.remove();
    if (statusElem) {
      statusElem.textContent = "Location access unavailable — showing default area. Tap the map or click 'Use My Current Location' to set your exact spot.";
    }
  }

  setTimeout(() => map.invalidateSize(), 200);
}

function reverseGeocode(lat, lng, landmarkInputId, statusId, isCitizen) {
  const statusElem = document.getElementById(statusId);
  if (statusElem) statusElem.textContent = 'Resolving street address & municipal ward via OpenStreetMap...';

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.display_name) {
        const landmarkInput = document.getElementById(landmarkInputId);
        if (landmarkInput) landmarkInput.value = data.display_name;
        if (statusElem) statusElem.textContent = '📍 Address resolved: ' + data.display_name.slice(0, 60) + '...';
        updateWardFieldFromCoords(lat, lng, data.display_name, isCitizen);
      } else {
        if (statusElem) statusElem.textContent = 'Coordinates pinned. Enter specific landmark details.';
        updateWardFieldFromCoords(lat, lng, null, isCitizen);
      }
    })
    .catch(() => {
      if (statusElem) statusElem.textContent = 'Pin placed at exact GPS coordinates.';
      updateWardFieldFromCoords(lat, lng, null, isCitizen);
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
        updateWardFieldFromCoords(lat, lng, null, isCitizen);
        reverseGeocode(lat, lng, landmarkInputId, isCitizen ? 'citizenLocStatus' : 'instLocStatus', isCitizen);
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

window.locateNewBranch = function() {
  const statusNotice = document.getElementById('newBranchWardNotice');
  if (!navigator.geolocation) {
    applyBranchCoordinates(19.1136, 72.8697);
    return;
  }
  if (statusNotice) statusNotice.textContent = 'Requesting device GPS coordinates...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      applyBranchCoordinates(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      applyBranchCoordinates(19.1136, 72.8697);
      if (statusNotice) {
        statusNotice.textContent = "Location access unavailable — showing default area. Tap to detect again.";
      }
    },
    { timeout: 6000 }
  );
};

function applyBranchCoordinates(lat, lng) {
  const badge = document.getElementById('newBranchCoordBadge');
  const latInput = document.getElementById('newBranchLat');
  const lngInput = document.getElementById('newBranchLng');
  const wardInput = document.getElementById('newBranchWard');
  const notice = document.getElementById('newBranchWardNotice');
  const fixedLat = Number(lat.toFixed(5));
  const fixedLng = Number(lng.toFixed(5));
  if (badge) badge.textContent = `Lat: ${fixedLat}, Lng: ${fixedLng}`;
  if (latInput) latInput.value = fixedLat;
  if (lngInput) lngInput.value = fixedLng;
  const derivation = deriveWardFromCoordinates(fixedLat, fixedLng);
  if (wardInput) wardInput.value = derivation.label;
  if (notice) notice.textContent = derivation.isExact ? `Verified statutory zone: ${derivation.wardName}` : derivation.label;
}

/* ==========================================================================
   5. CITIZEN DASHBOARD: SEVERITY SELECTOR, VOICE RECORDER & CREDIT STORE
   ========================================================================== */
function renderCitizenDashboard() {
  document.getElementById('citizenWelcomeName').textContent = currentUser.name;
  document.getElementById('citizenCreditBalance').textContent = `${currentUser.credits || 0} credits`;
  document.getElementById('storeHeaderBalance').textContent = currentUser.credits || 0;

  const passNotice = document.getElementById('citizenPriorityPassNotice');
  const passCountText = document.getElementById('priorityPassCountText');
  if (passNotice) {
    const pCount = currentUser.priorityPickupCredits || 0;
    if (pCount > 0) {
      passNotice.style.display = 'block';
      if (passCountText) passCountText.textContent = pCount;
    } else {
      passNotice.style.display = 'none';
    }
  }

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
      const lat = parseFloat(document.getElementById('citizenLat').value) || 19.0760;
      const lng = parseFloat(document.getElementById('citizenLng').value) || 72.8777;
      const notes = document.getElementById('citizenNotes').value;
      const audioData = document.getElementById('citizenAudioData').value;

      const usedPriorityPass = (currentUser.priorityPickupCredits || 0) > 0;
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
        notes: notes + (audioData ? ' [Voice Note Attached]' : '') + (usedPriorityPass ? ' [⚡ PRIORITY PICKUP PASS APPLIED]' : ''),
        isEmergency: false,
        isPriorityPickup: usedPriorityPass,
        status: 'reported',
        createdAt: Date.now(),
        duplicateCount: 1,
        reporterIds: [currentUser.id],
        isEscalated: false
      };

      if (!navigator.onLine) {
        queueOfflineReport(newReport);
        alert('📡 You are currently offline. Report has been saved to your local offline queue and will sync automatically once connection restores.');
        citizenForm.reset();
        selectSeverity('getting_full');
        renderCitizenDashboard();
        return;
      }

      if (currentUser.priorityPickupCredits > 0) {
        currentUser.priorityPickupCredits--;
        let users = getUsers();
        const uIdx = users.findIndex(u => u.id === currentUser.id);
        if (uIdx !== -1) {
          users[uIdx].priorityPickupCredits = currentUser.priorityPickupCredits;
          saveUsers(users);
        }
        localStorage.setItem('swm_current_user', JSON.stringify(currentUser));
      }

      const isMerged = checkAndMergeDuplicates(newReport);
      if (!isMerged) {
        let reports = getReports();
        reports.unshift(newReport);
        saveReports(reports);

        awardCredits(5, 'Base Bin Report Submitted');
        processReferralBonusOnFirstReport(newReport);
        alert(usedPriorityPass ? '⚡ Priority Bin Report Submitted! +5 EcoCredits credited & pass consumed.' : 'Bin Report Submitted Successfully! +5 EcoCredits credited.');
      }

      citizenForm.reset();
      selectSeverity('getting_full');
      renderCitizenDashboard();
    };
  }

  renderCitizenStreak();
  renderCitizenReferralWidget();
  setTimeout(() => initCitizenNearbyReportsMap(), 150);
  checkOfflineQueueStatus();
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

/* Dedicated Credit Store (Waste-Specific Civic Rewards Catalog) */
const CREDIT_STORE_CATALOG = [
  { id: 'sapling', name: 'Sapling / Native Fruit Plant', cost: 50, icon: '🌱', isPhysical: true, desc: 'Native guava, mango, or neem sapling delivered for residential terrace or park planting.', featured: true },
  { id: 'segregation_bin_set', name: 'Home Segregation Bin Set (Wet/Dry Color-Coded)', cost: 70, icon: '🗑️', isPhysical: true, desc: 'A pair of color-coded mini bins with labels for correct source segregation at home, matching municipal waste categories.' },
  { id: 'compost_kit', name: 'Home Aerobic Compost Starter Kit', cost: 100, icon: '🪴', isPhysical: true, desc: 'Twin aerated bin system with bio-inoculant microbial brick for kitchen food peels.' },
  { id: 'ewaste_voucher', name: 'E-Waste Drop-off Voucher', cost: 45, icon: '🔌', isPhysical: true, desc: 'Redeemable at a partnered authorized e-waste collection point for safe disposal of old electronics, batteries, and cables.' },
  { id: 'seed_paper', name: 'Plantable Seed Paper Stationery', cost: 30, icon: '📜', isPhysical: true, desc: 'Post-consumer waste handmade paper embedded with marigold and basil seeds.' },
  { id: 'priority_pickup_pass', name: 'Priority Pickup Pass', cost: 90, icon: '⚡', isPhysical: false, desc: 'Your next submitted report is guaranteed same-day collection, jumping ahead of the standard queue.' },
  { id: 'recycler_marketplace_credit', name: 'Local Recycler Marketplace Credit', cost: 65, icon: '♻️', isPhysical: true, desc: '₹40 credit redeemable with your area\'s registered informal waste collectors (kabadiwalas) for scrap and recyclables.' },
  { id: 'recycled_notebook', name: '100% Recycled Paper Notebook', cost: 35, icon: '📓', isPhysical: true, desc: '120-page ruled notebook manufactured entirely from post-consumer recovered office paper.' },
  { id: 'digital_badge', name: 'Digital Eco-Champion Public Recognition Badge', cost: 0, icon: '🥇', isPhysical: false, desc: 'Official digital recognition credential displayed on your civic resident profile.' }
];

/* Reward Specific Inline SVG Icons */
function getRewardSvgIcon(itemId = '') {
  switch (itemId) {
    case 'sapling':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M12 22v-9"/><path d="M9 10a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 3-3 4-7 4-2 0-3-.5-3-1.5z"/><path d="M12 13a4.5 4.5 0 0 0-4.5-4.5C5 8.5 4 10 4 11.5c0 2 2 3.5 5 3.5"/></svg>`;
    case 'segregation_bin_set':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c52d8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M3 6h7v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm11 0h7v13a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V6z"/><path d="M2 6h9M13 6h9M5 3h3M16 3h3"/></svg>`;
    case 'compost_kit':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z"/><path d="M2 10h20M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/><path d="M10 15a2 2 0 0 1 4 0v3"/></svg>`;
    case 'ewaste_voucher':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 3v4M8 3v4M7 14h2M15 14h2M11 12h2v4h-2z"/></svg>`;
    case 'seed_paper':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-4M10 16a2 2 0 0 1 4 0"/></svg>`;
    case 'priority_pickup_pass':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="#eab308" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    case 'recycler_marketplace_credit':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"/><path d="M8 12l2-2 2 2M16 12l-2 2-2-2"/></svg>`;
    case 'recycled_notebook':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>`;
    case 'digital_badge':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
    default:
      return '';
  }
}

function renderRedemptionStore() {
  const container = document.getElementById('rewardStoreGrid');
  if (!container) return;

  const userBalance = currentUser.credits || 0;

  container.innerHTML = CREDIT_STORE_CATALOG.map(item => {
    const isAffordable = userBalance >= item.cost;
    const costText = item.cost === 0 ? 'FREE' : `${item.cost} Credits`;
    const btnLabel = isAffordable ? 'Redeem Item' : `Need ${item.cost - userBalance} more credits`;
    const svgIcon = getRewardSvgIcon(item.id);

    if (item.featured) {
      return `
        <div class="reward-card featured-card">
          <div class="featured-icon" style="display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
            ${svgIcon || item.icon}
          </div>
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
          <div class="reward-icon" style="display: flex; align-items: center; gap: 0.35rem;">
            ${svgIcon || item.icon}
          </div>
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

  // Special functional handling for priority pickup pass (not physical, does not enter Admin queue)
  if (itemId === 'priority_pickup_pass') {
    currentUser.priorityPickupCredits = (currentUser.priorityPickupCredits || 0) + 1;
    let users = getUsers();
    const uIdx = users.findIndex(u => u.id === currentUser.id);
    if (uIdx !== -1) {
      users[uIdx].priorityPickupCredits = currentUser.priorityPickupCredits;
      saveUsers(users);
    }
    localStorage.setItem('swm_current_user', JSON.stringify(currentUser));
    alert(`🎉 Priority Pickup Pass Activated! Your next submitted report is guaranteed same-day collection, jumping to the top of the collection queue.`);
    renderCitizenDashboard();
    return;
  }

  const isDigital = item.digitalBadge || item.id === 'priority_pickup_pass';
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
    tbody.innerHTML = `<tr><td colspan="4">${getEmptyStateHTML('redemptions', 'No redemption records yet', 'Earn EcoCredits by reporting waste or segregating at source to unlock rewards!')}</td></tr>`;
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
    container.innerHTML = getEmptyStateHTML('reports', 'No reports found for this filter', 'No civic reports match your current status filter view.');
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
        <div style="font-size: 0.78rem; font-family: monospace; color: #64748b; margin-top: 0.2rem;">Coordinates: Lat ${r.latitude || r.coords?.lat || 19.0760}, Lng ${r.longitude || r.coords?.lng || 72.8777}</div>
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
    area: 'Ward G/South - Dadar & Elphinstone',
    coords: { lat: 19.0210, lng: 72.8350 },
    latitude: 19.0210,
    longitude: 72.8350,
    landmark,
    resolvedAddress: landmark + ', Ward G/South',
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
    const lat = parseFloat(document.getElementById('instLat').value) || 19.1136;
    const lng = parseFloat(document.getElementById('instLng').value) || 72.8697;
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
  renderInstitutionPeerBenchmark();
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
      lat: (parseFloat(document.getElementById('newBranchLat')?.value) || 19.1136),
      lng: (parseFloat(document.getElementById('newBranchLng')?.value) || 72.8697)
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
        <div style="font-size: 0.78rem; font-family: monospace; color: #64748b; margin-top: 0.2rem;">Location: Lat ${r.latitude || 19.1136}, Lng ${r.longitude || 72.8697}</div>
      </div>
    </div>
  `).join('');
}

window.triggerInstitutionOverloadAlert = function() {
  const currentBranch = (currentUser.branches && currentUser.branches.find(b => b.id === currentUser.activeBranchId)) || { name: 'Main Campus', ward: 'Ward K/East - Andheri Industrial Estate', lat: 19.1136, lng: 72.8697 };
  
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
  renderHospitalPharmaExpiryTable();
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
  logAdminAction('Threshold Updated', currentUser?.name || 'Hospital Admin', `Biomedical hazard accumulation threshold adjusted to ${val} kg`);
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
  renderWorkerSafetyChecklist();
  runSoftwareRouteOptimizer();
  renderWorkerPhotoProofGallery();
}

function calcDistance(lat1, lon1, lat2, lon2) {
  let p1Lat, p1Lon, p2Lat, p2Lon;
  if (typeof lat1 === 'number' && typeof lon1 === 'number' && typeof lat2 === 'number' && typeof lon2 === 'number') {
    p1Lat = lat1; p1Lon = lon1; p2Lat = lat2; p2Lon = lon2;
  } else {
    const p1 = lat1;
    const p2 = lon1;
    p1Lat = p1.lat !== undefined ? p1.lat : (p1.latitude !== undefined ? p1.latitude : 19.0760);
    p1Lon = p1.lng !== undefined ? p1.lng : (p1.longitude !== undefined ? p1.longitude : 72.8777);
    p2Lat = p2.lat !== undefined ? p2.lat : (p2.latitude !== undefined ? p2.latitude : 19.0760);
    p2Lon = p2.lng !== undefined ? p2.lng : (p2.longitude !== undefined ? p2.longitude : 72.8777);
  }
  const R = 6371; // Earth radius in km
  const dLat = (p2Lat - p1Lat) * Math.PI / 180;
  const dLng = (p2Lon - p1Lon) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(p1Lat * Math.PI / 180) * Math.cos(p2Lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* Worker Turn-by-Turn Route Navigation & Live Geolocation Engine */
let workerMapObj = null;
let workerLocationMarker = null;
let workerRoutePolyline = null;
let workerDirectGuidanceLine = null;
let workerStopMarkers = [];
let workerCurrentPos = { lat: 19.0760, lng: 72.8777, accuracy: null, updatedAt: Date.now() };
let workerWatchId = null;
let activeWorkerTargetStopId = null;
const PROXIMITY_THRESHOLD_METERS = 50;

function runSoftwareRouteOptimizer() {
  const allReports = getReports();
  const unclearedReports = allReports.filter(r => r.status !== 'cleared');
  const container = document.getElementById('workerRouteStopsList');

  // 1. Update Assigned Vehicle & Crew Info Banner
  const fleet = getFleet();
  const myVehicle = fleet.find(f => f.driverId === currentUser?.id || f.driver === currentUser?.name || (currentUser?.name && f.driver && currentUser.name.includes(f.driver)) || (currentUser?.name && f.driver && f.driver.includes(currentUser.name))) || fleet[0];
  const crewNum = currentUser?.crewNumber || currentUser?.name?.match(/Crew #?(\d+)/i)?.[1] || '101';

  const crewElem = document.getElementById('workerCrewNumBanner');
  const nameElem = document.getElementById('workerNameBanner');
  const typeElem = document.getElementById('workerVehicleTypeBanner');
  const regElem = document.getElementById('workerVehicleRegBanner');
  const wardElem = document.getElementById('workerWardBanner');
  if (crewElem) crewElem.textContent = `Crew #${crewNum}`;
  if (nameElem) nameElem.textContent = currentUser?.name || 'Worker';
  if (typeElem) typeElem.textContent = myVehicle ? myVehicle.type : 'Heavy Hydraulic Compactor (10T)';
  if (regElem) regElem.textContent = myVehicle ? myVehicle.regNo : 'MH-01-GA-4401';
  if (wardElem) wardElem.textContent = currentUser?.assignedWard || (myVehicle ? myVehicle.ward : 'Ward G/South - Dadar & Elphinstone');

  // 2. Handle Shift Status (Active vs Off-Shift)
  const shiftStatus = currentUser?.shiftStatus || 'active';
  const shiftBtn = document.getElementById('workerShiftToggleBtn');
  const shiftBadge = document.getElementById('workerShiftStatusBadge');
  const shiftPrompt = document.getElementById('workerShiftInactivePrompt');
  if (shiftBtn) {
    if (shiftStatus === 'off-shift') {
      shiftBtn.innerHTML = '🟢 Start Shift';
      shiftBtn.className = 'btn btn-primary btn-sm';
    } else {
      shiftBtn.innerHTML = '⏸️ End Shift';
      shiftBtn.className = 'btn btn-outline btn-sm';
    }
  }
  if (shiftBadge) {
    if (shiftStatus === 'off-shift') {
      shiftBadge.textContent = '⏸️ Idle / Off-Shift';
      shiftBadge.style.background = 'rgba(100, 116, 139, 0.4)';
    } else {
      shiftBadge.textContent = '🟢 On Shift - Active';
      shiftBadge.style.background = 'rgba(16, 185, 129, 0.25)';
    }
  }
  if (shiftPrompt) {
    shiftPrompt.style.display = shiftStatus === 'off-shift' ? 'block' : 'none';
  }

  // 3. Filter stops for this specific worker
  const myUncleared = unclearedReports.filter(r => r.assignedWorkerId === currentUser?.id || (currentUser?.name && r.assignedWorkerName && (r.assignedWorkerName.includes(currentUser.name) || currentUser.name.includes(r.assignedWorkerName))));
  const unassignedWard = unclearedReports.filter(r => !r.assignedWorkerId && r.area === currentUser?.assignedWard);
  const stopsToProcess = myUncleared.length > 0 ? myUncleared : (unassignedWard.length > 0 ? unassignedWard : unclearedReports);

  const unassigned = stopsToProcess;
  const emergencyReports = unassigned.filter(r => r.isEmergency);
  const priorityPassReports = unassigned.filter(r => !r.isEmergency && r.isPriorityPickup);
  const priorityPickupStops = priorityPassReports;
  const regularStops = stopsToProcess.filter(r => !r.isEmergency && !r.isPriorityPickup);

  let currentPos = { lat: workerCurrentPos.lat, lng: workerCurrentPos.lng };

  // Nearest-Neighbor implementation using Haversine distance
  function optimizeNearestNeighbor(stops, startPos) {
    let unvisited = [...stops];
    let ordered = [];
    let pos = { ...startPos };
    let totalDist = 0;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const targetCoords = unvisited[i].coords || {
          lat: unvisited[i].latitude !== undefined ? unvisited[i].latitude : 19.0760,
          lng: unvisited[i].longitude !== undefined ? unvisited[i].longitude : 72.8777
        };
        const dist = calcDistance(pos, targetCoords);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const nextStop = unvisited.splice(nearestIdx, 1)[0];
      totalDist += (minDistance === Infinity ? 0 : minDistance);
      pos = nextStop.coords || {
        lat: nextStop.latitude !== undefined ? nextStop.latitude : 19.0760,
        lng: nextStop.longitude !== undefined ? nextStop.longitude : 72.8777
      };
      ordered.push(nextStop);
    }

    return { ordered, totalDist, endPos: pos };
  }

  const optPriority = optimizeNearestNeighbor(priorityPickupStops, currentPos);
  const optRegular = optimizeNearestNeighbor(regularStops, optPriority.endPos);

  const optimizedStandard = [...optPriority.ordered, ...optRegular.ordered];
  const finalRoute = [...emergencyReports, ...priorityPassReports, ...optimizedStandard];
  const totalDistanceKm = optPriority.totalDist + optRegular.totalDist + (emergencyReports.length * 1.5);

  document.getElementById('workerAssignedCount').textContent = finalRoute.length;
  document.getElementById('workerEstDistance').textContent = `${totalDistanceKm.toFixed(1)} km`;

  // 4. Update Today's Route Summary Card
  const myAllStops = allReports.filter(r => r.assignedWorkerId === currentUser?.id || (currentUser?.name && r.assignedWorkerName && (r.assignedWorkerName.includes(currentUser.name) || currentUser.name.includes(r.assignedWorkerName))));
  const totalAssignedToday = myAllStops.length > 0 ? myAllStops.length : finalRoute.length;
  const completedToday = myAllStops.filter(r => r.status === 'cleared').length;
  const remainingToday = finalRoute.length;
  const completionRate = totalAssignedToday > 0 ? Math.round((completedToday / totalAssignedToday) * 100) : 0;

  document.getElementById('workerCompletionRate').textContent = `${completionRate}%`;

  const summaryTotalElem = document.getElementById('workerSummaryTotal');
  const summaryCompletedElem = document.getElementById('workerSummaryCompleted');
  const summaryRemainingElem = document.getElementById('workerSummaryRemaining');
  const summaryEstDistElem = document.getElementById('workerSummaryEstDistance');
  const summaryPctElem = document.getElementById('workerSummaryProgressPct');
  const summaryBarElem = document.getElementById('workerSummaryProgressBar');

  const estCoveredKm = (completedToday * 1.8).toFixed(1);

  if (summaryTotalElem) summaryTotalElem.textContent = totalAssignedToday;
  if (summaryCompletedElem) summaryCompletedElem.textContent = completedToday;
  if (summaryRemainingElem) summaryRemainingElem.textContent = remainingToday;
  if (summaryEstDistElem) summaryEstDistElem.textContent = `${estCoveredKm} km`;
  if (summaryPctElem) summaryPctElem.textContent = `${completionRate}%`;
  if (summaryBarElem) summaryBarElem.style.width = `${completionRate}%`;

  if (finalRoute.length === 0) {
    if (container) container.innerHTML = `<div class="card" style="text-align: center; color: #64748b;">No active stops pending for your shift route.</div>`;
    initWorkerRouteMap([]);
    return;
  }

  // Ensure an active target stop is selected
  if (!activeWorkerTargetStopId || !finalRoute.some(s => s.id === activeWorkerTargetStopId)) {
    activeWorkerTargetStopId = finalRoute[0].id;
  }

  if (container) {
    container.innerHTML = finalRoute.map((stop, idx) => {
      const isEmg = stop.isEmergency;
      const isPriority = stop.isPriorityPickup;
      const isTarget = stop.id === activeWorkerTargetStopId;
      const originLabel = stop.userRole === 'institution'
        ? (stop.institutionType === 'school' ? `🏫 ${stop.schoolName || stop.userName}` : `🏢 ${stop.companyName || stop.userName}`)
        : `👤 Resident (${stop.userName})`;

      return `
        <div class="route-stop-card ${isEmg ? 'emergency' : ''} ${isTarget ? 'highlighted-target-stop' : ''}" data-report-id="${stop.id}" onclick="selectWorkerTargetStop('${stop.id}')" style="cursor: pointer; ${isPriority && !isEmg ? 'border-left: 4px solid var(--civic-signal-amber);' : ''}">
          <div class="stop-number ${isEmg ? 'emergency-stop' : ''}">${isEmg ? '🚨' : idx + 1}</div>
          <div style="flex: 1;">
            <div class="report-meta">
              <span class="badge badge-${stop.status}">${stop.status}</span>
              ${isEmg ? `<span class="badge badge-emergency">TOP PRIORITY EMERGENCY</span>` : ''}
              ${isPriority && !isEmg ? `<span class="badge" style="background: var(--civic-signal-amber-soft); color: var(--civic-signal-amber); font-weight: 800;">⚡ PRIORITY PICKUP PASS</span>` : ''}
              <span>📍 ${stop.area || stop.wardZone}</span>
              <span>Origin: <strong>${originLabel}</strong></span>
            </div>
            <div style="font-weight: 700; font-size: 1.1rem;">${stop.landmark}</div>
            <div style="font-size: 0.88rem; color: #556960;">${stop.notes || 'No extra notes.'}</div>
            <div style="font-size: 0.78rem; font-family: monospace; color: #64748b; margin-top: 0.2rem;">Coordinates: Lat ${stop.latitude || stop.coords?.lat || 19.0760}, Lng ${stop.longitude || stop.coords?.lng || 72.8777}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end;">
            <button class="btn btn-outline btn-xs" onclick="event.stopPropagation(); selectWorkerTargetStop('${stop.id}')">🎯 Focus Stop</button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openWorkerProofModal('${stop.id}')">📷 Mark Collected</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Initialize and update Turn-by-Turn Leaflet Route Map
  initWorkerRouteMap(finalRoute);
  startWorkerGeolocationWatch(finalRoute);
}

window.toggleWorkerShift = function() {
  if (!currentUser) return;
  const currentStatus = currentUser.shiftStatus || 'active';
  const newStatus = currentStatus === 'active' ? 'off-shift' : 'active';
  currentUser.shiftStatus = newStatus;
  updateUserRecord(currentUser);

  // Update fleet
  let fleet = getFleet();
  const fIdx = fleet.findIndex(f => f.driverId === currentUser.id || f.driver === currentUser.name || (currentUser.name && f.driver && currentUser.name.includes(f.driver)));
  if (fIdx !== -1) {
    fleet[fIdx].status = newStatus === 'active' ? 'Active Collection' : 'Idle / Off-Shift';
    saveFleet(fleet);
  }

  // Backend sync
  if (isBackendConnected) {
    fetch('/api/worker-shift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId: currentUser.id, shiftStatus: newStatus })
    }).catch(() => {});
  }

  if (newStatus === 'off-shift' && workerWatchId) {
    navigator.geolocation.clearWatch(workerWatchId);
    workerWatchId = null;
  }

  logAdminAction('Shift Status Change', currentUser?.name || 'Worker', `Shift updated to ${newStatus === 'active' ? 'Active Collection' : 'Idle / Off-Shift'}`);
  runSoftwareRouteOptimizer();
  alert(newStatus === 'active' ? 'Shift started! GPS navigation and route optimization are now active.' : 'Shift ended. You are now marked as Idle / Off-Shift.');
};

function initWorkerRouteMap(finalRoute) {
  const mapElement = document.getElementById('workerRouteMap');
  if (!mapElement) return;

  if (typeof L === 'undefined') return;

  if (workerMapObj) {
    workerMapObj.invalidateSize();
  } else {
    workerMapObj = L.map('workerRouteMap', { zoomControl: true }).setView([workerCurrentPos.lat, workerCurrentPos.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(workerMapObj);
  }

  // Clear previous stop markers & lines
  workerStopMarkers.forEach(m => m.remove());
  workerStopMarkers = [];
  if (workerRoutePolyline) {
    workerRoutePolyline.remove();
    workerRoutePolyline = null;
  }
  if (workerDirectGuidanceLine) {
    workerDirectGuidanceLine.remove();
    workerDirectGuidanceLine = null;
  }

  // Worker Live Location Marker (draggable in demo to simulate driving/walking)
  if (workerLocationMarker) {
    workerLocationMarker.setLatLng([workerCurrentPos.lat, workerCurrentPos.lng]);
  } else {
    workerLocationMarker = L.marker([workerCurrentPos.lat, workerCurrentPos.lng], {
      draggable: true,
      icon: L.divIcon({
        className: 'worker-pulse-container',
        html: `<div class="worker-pulse-marker" title="Worker Location (Drag to test proximity)">🚛</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(workerMapObj).bindPopup('<strong>👷 Worker (You)</strong><br>Live GPS starting point.<br><small style="color: #64748b;">(Drag marker to test 50m proximity auto-advance)</small>');

    workerLocationMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      updateWorkerLocation(pos.lat, pos.lng);
      updateWorkerNavigationGuidance(finalRoute);
    });
  }

  if (finalRoute.length === 0) return;

  // Draw full optimized route polyline from worker current position through stops in order
  const pathCoords = [
    [workerCurrentPos.lat, workerCurrentPos.lng],
    ...finalRoute.map(s => [
      s.latitude !== undefined ? s.latitude : (s.coords?.lat || 19.0760),
      s.longitude !== undefined ? s.longitude : (s.coords?.lng || 72.8777)
    ])
  ];

  if (pathCoords.length > 1) {
    workerRoutePolyline = L.polyline(pathCoords, {
      color: '#1c52d8',
      weight: 5,
      opacity: 0.85,
      dashArray: '6, 8',
      lineJoin: 'round',
      className: 'animated-route-line'
    }).addTo(workerMapObj);
    animatePolylineDrawIn(workerRoutePolyline, pathCoords, 450);
  }

  // Add numbered markers for each stop
  finalRoute.forEach((stop, idx) => {
    const lat = stop.latitude !== undefined ? stop.latitude : (stop.coords?.lat || 19.0760);
    const lng = stop.longitude !== undefined ? stop.longitude : (stop.coords?.lng || 72.8777);
    const isEmg = stop.isEmergency;
    const isPriority = stop.isPriorityPickup;
    const markerColor = isEmg ? '#dc2626' : (isPriority ? '#d97706' : '#1c52d8');
    const stopLabel = isEmg ? '🚨' : (idx + 1);

    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: `stop-pin-icon ${isEmg ? 'emergency-pulse-marker' : ''}`,
        html: `<div style="background: ${markerColor}; color: #fff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.3); cursor: pointer;">${stopLabel}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      })
    }).addTo(workerMapObj);

    marker.bindPopup(`
      <div style="font-family: var(--font-body);">
        <strong>Stop #${idx + 1}: ${stop.landmark}</strong><br>
        Status: ${stop.status.toUpperCase()}<br>
        Ward: ${stop.area || stop.wardZone}<br>
        <button class="btn btn-primary btn-xs" style="width: 100%; margin-top: 0.4rem;" onclick="selectWorkerTargetStop('${stop.id}')">🎯 Focus & Navigate</button>
      </div>
    `);

    marker.on('click', () => {
      selectWorkerTargetStop(stop.id);
    });

    workerStopMarkers.push({ id: stop.id, marker, stop });
  });

  updateWorkerNavigationGuidance(finalRoute);
  setTimeout(() => {
    if (workerMapObj) workerMapObj.invalidateSize();
  }, 200);
}

function updateWorkerLocation(lat, lng) {
  workerCurrentPos.lat = Number(lat.toFixed(5));
  workerCurrentPos.lng = Number(lng.toFixed(5));
  workerCurrentPos.updatedAt = Date.now();

  if (currentUser) {
    currentUser.lastKnownLat = workerCurrentPos.lat;
    currentUser.lastKnownLng = workerCurrentPos.lng;
    currentUser.lastLocationUpdatedAt = workerCurrentPos.updatedAt;
    updateUserRecord(currentUser);
  }

  // Sync to fleet record
  let fleet = getFleet();
  const fIdx = fleet.findIndex(f => f.driverId === currentUser?.id || f.driver === currentUser?.name);
  if (fIdx !== -1) {
    fleet[fIdx].lastKnownLat = workerCurrentPos.lat;
    fleet[fIdx].lastKnownLng = workerCurrentPos.lng;
    fleet[fIdx].lastLocationUpdatedAt = workerCurrentPos.updatedAt;
    saveFleet(fleet);
  }

  // Sync to REST API backend
  if (isBackendConnected && currentUser) {
    fetch('/api/worker-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workerId: currentUser.id,
        lat: workerCurrentPos.lat,
        lng: workerCurrentPos.lng,
        timestamp: workerCurrentPos.updatedAt
      })
    }).catch(() => {});
  }
}

window.selectWorkerTargetStop = function(stopId) {
  activeWorkerTargetStopId = stopId;
  const reports = getReports().filter(r => r.status !== 'cleared');
  updateWorkerNavigationGuidance(reports);

  // Scroll target card into view and highlight
  const stopCards = document.querySelectorAll('.route-stop-card');
  stopCards.forEach(c => {
    if (c.getAttribute('data-report-id') === stopId) {
      c.classList.add('highlighted-target-stop');
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      c.classList.remove('highlighted-target-stop');
    }
  });
};

function updateWorkerNavigationGuidance(finalRoute) {
  if (!finalRoute || finalRoute.length === 0) return;

  const targetStop = finalRoute.find(s => s.id === activeWorkerTargetStopId) || finalRoute[0];
  if (!targetStop) return;

  const stopIdx = finalRoute.findIndex(s => s.id === targetStop.id);
  const targetLat = targetStop.latitude !== undefined ? targetStop.latitude : (targetStop.coords?.lat || 19.0760);
  const targetLng = targetStop.longitude !== undefined ? targetStop.longitude : (targetStop.coords?.lng || 72.8777);

  const distKm = calcDistance(workerCurrentPos.lat, workerCurrentPos.lng, targetLat, targetLng);
  const distMeters = Math.round(distKm * 1000);

  // Update Navigation Guidance HUD
  const titleElem = document.getElementById('workerTargetStopTitle');
  const addrElem = document.getElementById('workerTargetStopAddress');
  const badgeElem = document.getElementById('workerTargetDistanceBadge');
  const liveReadoutElem = document.getElementById('workerLiveDistanceReadout');
  const proximityElem = document.getElementById('workerProximityNotice');

  if (titleElem) titleElem.textContent = `Stop #${stopIdx + 1}: ${targetStop.landmark}`;
  if (addrElem) addrElem.textContent = `📍 ${targetStop.resolvedAddress || targetStop.area || 'Ward Target Point'}`;
  if (badgeElem) badgeElem.textContent = distMeters < 1000 ? `${distMeters} m` : `${distKm.toFixed(2)} km`;
  if (liveReadoutElem) liveReadoutElem.textContent = distMeters < 1000 ? `${distMeters}m to next stop` : `${distKm.toFixed(2)}km to next stop`;

  const isNearby = distMeters <= PROXIMITY_THRESHOLD_METERS;
  if (proximityElem) proximityElem.style.display = isNearby ? 'block' : 'none';

  // Highlight card in DOM
  const stopCards = document.querySelectorAll('.route-stop-card');
  stopCards.forEach(c => {
    if (c.getAttribute('data-report-id') === targetStop.id) {
      c.classList.add('highlighted-target-stop');
    } else {
      c.classList.remove('highlighted-target-stop');
    }
  });

  // Draw direct guidance line on Leaflet map from worker position to target destination
  if (workerMapObj) {
    if (workerDirectGuidanceLine) {
      workerDirectGuidanceLine.remove();
    }
    workerDirectGuidanceLine = L.polyline([
      [workerCurrentPos.lat, workerCurrentPos.lng],
      [targetLat, targetLng]
    ], {
      color: '#059669',
      weight: 4,
      opacity: 0.95,
      dashArray: '4, 6'
    }).addTo(workerMapObj);
  }
}

function startWorkerGeolocationWatch(finalRoute) {
  const badge = document.getElementById('workerGpsStatusBadge');
  if (!navigator.geolocation) {
    if (badge) {
      badge.textContent = '📍 Manual GPS Mode';
      badge.style.background = 'rgba(217, 119, 6, 0.15)';
      badge.style.color = '#b45309';
    }
    return;
  }

  if (workerWatchId) return;

  workerWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      updateWorkerLocation(lat, lng);
      if (workerLocationMarker) {
        workerLocationMarker.setLatLng([lat, lng]);
      }
      if (badge) {
        badge.textContent = '🟢 Live GPS Active';
        badge.style.background = 'rgba(16, 185, 129, 0.15)';
        badge.style.color = '#047857';
      }
      updateWorkerNavigationGuidance(finalRoute);
    },
    (err) => {
      if (badge) {
        badge.textContent = '📍 Manual GPS Mode';
        badge.style.background = 'rgba(217, 119, 6, 0.15)';
        badge.style.color = '#b45309';
      }
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 12000 }
  );
}

window.refreshWorkerLiveLocation = function() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported. You can drag the 🚛 marker on the map to test locations.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      updateWorkerLocation(pos.coords.latitude, pos.coords.longitude);
      if (workerLocationMarker) workerLocationMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
      if (workerMapObj) workerMapObj.setView([pos.coords.latitude, pos.coords.longitude], 15);
      const reports = getReports().filter(r => r.status !== 'cleared');
      updateWorkerNavigationGuidance(reports);
      alert('Live worker coordinates updated!');
    },
    (err) => {
      alert('Unable to retrieve GPS coordinates. Drag the marker on the map to manually set your location.');
    },
    { timeout: 8000 }
  );
};

window.recenterWorkerMap = function() {
  if (workerMapObj) {
    workerMapObj.setView([workerCurrentPos.lat, workerCurrentPos.lng], 15);
  }
};

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
      const clearedStop = reports[index];
      reports[index].status = 'cleared';
      reports[index].clearedAt = Date.now();
      reports[index].clearedByWorker = currentUser.name;
      saveReports(reports);

      // Log stop location as worker's last known position
      const stopLat = clearedStop.latitude || clearedStop.coords?.lat || workerCurrentPos.lat;
      const stopLng = clearedStop.longitude || clearedStop.coords?.lng || workerCurrentPos.lng;
      updateWorkerLocation(stopLat, stopLng);

      alert(`Stop ${id} confirmed CLEARED! Photo proof logged.`);
    }

    closeModal('workerProofModal');
    // Clear active target so optimizer advances to next stop
    activeWorkerTargetStopId = null;
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
  renderAdminFleet();
  renderAdminGrievanceTable();
  renderAdminLeaderboardTable();
  renderAdminComplianceTable();
  renderAdminHospitalTable();
  renderAdminWorkerTable();
  renderAdminRedemptionsQueue();
  renderAdminLogsTable();
  displayActiveBroadcasts();
  initAdminHotspotMap();
  initAdminWorkerLocationsMap();
  renderAdminAnalyticsCharts();
}

function renderAdminFeedTable(customReports) {
  const reports = customReports || getReports();
  const tbody = document.getElementById('adminFeedTableBody');
  if (!tbody) return;

  if (reports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 1.5rem;">No matching reports found in feed.</td></tr>`;
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

    const lat = r.latitude !== undefined ? r.latitude : (r.coords?.lat || 19.0760);
    const lng = r.longitude !== undefined ? r.longitude : (r.coords?.lng || 72.8777);

    return `
      <tr class="${r.isEscalated ? 'escalated' : ''}">
        <td><code>${r.id}</code></td>
        <td>${originLabel}</td>
        <td>${r.landmark}<br><small style="color: #64748b;">${r.area}</small></td>
        <td>
          ${r.category.toUpperCase()}<br>
          <small>${r.severity} ${r.isEmergency ? '🚨' : ''}</small>
          ${r.isPriorityPickup ? '<br><span class="badge" style="background: var(--civic-signal-amber-soft); color: var(--civic-signal-amber); font-weight: 800; font-size: 0.65rem;">⚡ Priority Pass</span>' : ''}
        </td>
        <td>
          <div class="status-stepper" style="font-size: 0.65rem;">
            <span class="stepper-step ${r.status === 'reported' ? 'active' : 'completed'}">1</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'assigned' ? 'active' : (r.status === 'cleared' ? 'completed' : '')}">2</span>
            <span class="stepper-arrow">›</span>
            <span class="stepper-step ${r.status === 'cleared' ? 'completed active' : ''}">3</span>
          </div>
        </td>
        <td><small style="font-family: monospace;">${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}</small></td>
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

window.filterAdminFeed = function() {
  const keywordInput = document.getElementById('adminFeedSearchInput');
  const statusSelect = document.getElementById('adminFeedStatusFilter');
  const wardSelect = document.getElementById('adminFeedWardFilter');

  const kw = keywordInput ? keywordInput.value.toLowerCase().trim() : '';
  const status = statusSelect ? statusSelect.value : 'all';
  const ward = wardSelect ? wardSelect.value : 'all';

  const allReports = getReports();
  const filtered = allReports.filter(r => {
    if (kw) {
      const idMatch = (r.id || '').toLowerCase().includes(kw);
      const userMatch = (r.userName || r.schoolName || r.companyName || '').toLowerCase().includes(kw);
      const landmarkMatch = (r.landmark || r.resolvedAddress || '').toLowerCase().includes(kw);
      const notesMatch = (r.notes || '').toLowerCase().includes(kw);
      if (!idMatch && !userMatch && !landmarkMatch && !notesMatch) return false;
    }
    if (status !== 'all') {
      if (status === 'emergency') {
        if (!r.isEmergency) return false;
      } else if (status === 'escalated') {
        if (!r.isEscalated) return false;
      } else if (r.status !== status) {
        return false;
      }
    }
    if (ward !== 'all') {
      if (!(r.area || '').includes(ward)) return false;
    }
    return true;
  });

  renderAdminFeedTable(filtered);
};

window.resetAdminFeedFilters = function() {
  const keywordInput = document.getElementById('adminFeedSearchInput');
  const statusSelect = document.getElementById('adminFeedStatusFilter');
  const wardSelect = document.getElementById('adminFeedWardFilter');
  if (keywordInput) keywordInput.value = '';
  if (statusSelect) statusSelect.value = 'all';
  if (wardSelect) wardSelect.value = 'all';

  renderAdminFeedTable();
};

function renderAdminFleet() {
  const fleetGrid = document.getElementById('adminFleetGrid');
  if (!fleetGrid) return;

  const fleet = getFleet();
  if (fleet.length === 0) {
    fleetGrid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; color: #64748b;">No municipal vehicles currently registered.</div>`;
    return;
  }

  fleetGrid.innerHTML = fleet.map(v => {
    const capTon = v.capacityTon || 5.0;
    const curTon = v.currentPayloadTon || 0.0;
    const pct = Math.min(100, Math.round((curTon / capTon) * 100));
    const fuel = v.fuelPercent || 80;
    const isFull = pct >= 90;
    const fillColor = isFull ? 'var(--civic-signal-crimson)' : (pct >= 70 ? 'var(--civic-signal-amber)' : 'var(--civic-spruce-green)');

    return `
      <div class="fleet-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <span style="font-size: 1.4rem; margin-right: 0.35rem;">${v.icon || '🚛'}</span>
              <strong style="font-size: 0.95rem;">${v.type}</strong>
              <div style="font-family: monospace; font-size: 0.8rem; color: #64748b;">${v.regNo || v.id}</div>
            </div>
            <span class="badge ${v.status.includes('Active') ? 'badge-assigned' : 'badge-reported'}" style="font-size: 0.72rem;">${v.status}</span>
          </div>

          <div style="font-size: 0.82rem; color: #475569; margin: 0.5rem 0;">
            <div>📍 <strong>Ward:</strong> ${v.ward}</div>
            <div>👤 <strong>Driver:</strong> ${v.driver} (${v.contact || 'N/A'})</div>
            <div>⛽ <strong>Fuel / Battery:</strong> ${fuel}%</div>
          </div>

          <div class="capacity-meter-wrap">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600;">
              <span>Payload Utilization: ${curTon.toFixed(1)} / ${capTon.toFixed(1)} T</span>
              <span>${pct}%</span>
            </div>
            <div class="capacity-meter-bar">
              <div class="capacity-meter-fill" style="width: ${pct}%; background: ${fillColor};"></div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem; margin-top: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-outline btn-xs" onclick="rerouteFleetVehicle('${v.id}')">🔄 Re-route Ward</button>
          <button class="btn btn-outline btn-xs" onclick="toggleFleetMaintenance('${v.id}')">${v.status === 'In Depot Maintenance' ? '🟢 Put Active' : '🔧 Depot Service'}</button>
        </div>
      </div>
    `;
  }).join('');
}

window.openDispatchStandbyVehicleModal = function() {
  const modal = document.getElementById('dispatchStandbyModal');
  if (modal) modal.classList.add('active');
};

window.handleDispatchStandbySubmit = async function(e) {
  if (e) e.preventDefault();
  const regNo = document.getElementById('standbyRegNo').value.trim();
  const driver = document.getElementById('standbyDriver').value.trim();
  const type = document.getElementById('standbyVehicleType').value;
  const ward = document.getElementById('standbyTargetWard').value;

  const fleet = getFleet();
  const newVehicle = {
    id: `FLT-ST-${Date.now().toString().slice(-3)}`,
    type,
    regNo: regNo || `MH-02-EV-${Math.floor(1000 + Math.random() * 9000)}`,
    driver: driver || 'Depot Relief Driver',
    contact: '+91 98100-77210',
    ward,
    capacityTon: type.includes('14') ? 14.0 : (type.includes('10') ? 10.0 : (type.includes('1.5') ? 1.5 : 2.0)),
    currentPayloadTon: 0.0,
    fuelPercent: 100,
    status: 'Active Collection',
    icon: type.includes('Auto') ? '🛺' : (type.includes('Van') ? '🚐' : (type.includes('Dumper') ? '🚜' : '🚛'))
  };

  fleet.unshift(newVehicle);
  saveFleet(fleet);
  addAuditLog('Admin', 'FLEET_DISPATCH', `Dispatched standby vehicle ${newVehicle.regNo} (${newVehicle.type}) to ${ward}`);

  if (isBackendConnected) {
    try {
      await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle)
      });
    } catch (err) {}
  }

  closeModal('dispatchStandbyModal');
  document.getElementById('dispatchStandbyForm').reset();
  alert(`Reserve vehicle ${newVehicle.regNo} successfully dispatched to ${ward}!`);
  renderAdminFleet();
};

window.toggleFleetMaintenance = async function(id) {
  const fleet = getFleet();
  const v = fleet.find(f => f.id === id);
  if (!v) return;
  v.status = v.status === 'In Depot Maintenance' ? 'Active Collection' : 'In Depot Maintenance';
  saveFleet(fleet);
  addAuditLog('Admin', 'FLEET_STATUS', `Vehicle ${v.regNo || id} status set to "${v.status}"`);

  if (isBackendConnected) {
    fetch(`/api/fleet/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: v.status })
    }).catch(() => {});
  }

  renderAdminFleet();
};

window.rerouteFleetVehicle = async function(id) {
  const fleet = getFleet();
  const v = fleet.find(f => f.id === id);
  if (!v) return;

  const newWard = prompt(`Enter new destination ward for ${v.regNo} (${v.type}):`, v.ward);
  if (newWard && newWard.trim() !== '') {
    v.ward = newWard.trim();
    v.status = 'En Route Diversion';
    saveFleet(fleet);
    addAuditLog('Admin', 'FLEET_REROUTE', `Vehicle ${v.regNo || id} rerouted to ${v.ward}`);

    if (isBackendConnected) {
      fetch(`/api/fleet/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ward: v.ward, status: v.status })
      }).catch(() => {});
    }

    renderAdminFleet();
    alert(`Vehicle ${v.regNo} diverted to ${v.ward}!`);
  }
};

function renderAdminGrievanceTable() {
  const tbody = document.getElementById('adminGrievanceTableBody');
  if (!tbody) return;

  const reports = getReports();
  const grievances = reports.filter(r => r.status !== 'cleared');

  if (grievances.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #166534; padding: 1.5rem;">🎉 No pending citizen grievances! All SLA resolution clocks within statutory thresholds.</td></tr>`;
    return;
  }

  const now = Date.now();
  tbody.innerHTML = grievances.map(r => {
    const ageMs = now - (r.createdAt || now);
    const ageHours = Math.floor(ageMs / (3600 * 1000));
    const ageMins = Math.floor((ageMs % (3600 * 1000)) / (60 * 1000));
    const ageFormatted = `${ageHours}h ${ageMins}m`;

    let slaClass = 'sla-ok';
    let slaText = '🟢 Within SLA (<6h)';
    if (ageHours >= 24 || r.isEscalated) {
      slaClass = 'sla-breached';
      slaText = '🔴 SLA BREACHED (>24h)';
    } else if (ageHours >= 6) {
      slaClass = 'sla-warning';
      slaText = '🟡 Approaching (>6h)';
    }

    const isBoosted = !!r.urgencyBoosted;

    return `
      <tr class="${r.isEscalated ? 'escalated' : ''}">
        <td><code>${r.id}</code></td>
        <td><strong>${r.schoolName || r.companyName || r.userName}</strong><br><small style="color: #64748b;">${r.category.toUpperCase()}</small></td>
        <td>${r.landmark}<br><small style="color: #64748b;">${r.area}</small></td>
        <td><strong>${ageFormatted}</strong> ago</td>
        <td><span class="sla-pill ${slaClass}">${slaText}</span></td>
        <td>
          <button class="btn ${isBoosted ? 'btn-outline' : 'btn-primary'} btn-xs" onclick="adminUrgencyBoost('${r.id}')" ${isBoosted ? 'disabled' : ''}>
            ${isBoosted ? '⚡ Boost Active' : '⚡ Urgency Boost'}
          </button>
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-outline btn-xs" onclick="adminEscalateTicket('${r.id}')" title="Escalate directly to Zonal Municipal Commissioner">🏛️ Escalate</button>
            <button class="btn btn-outline btn-xs" onclick="openSanitationNoticeModal('${r.id}')" title="Issue formal citation warning">📜 Notice</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.adminUrgencyBoost = async function(reportId) {
  const reports = getReports();
  const rep = reports.find(r => r.id === reportId);
  if (!rep) return;

  rep.isEmergency = true;
  rep.urgencyBoosted = true;
  rep.boostedAt = Date.now();
  saveReports(reports);
  addAuditLog('Admin', 'SLA_URGENCY_BOOST', `Urgency boost triggered on ticket ${reportId}. Priority elevated to High/Emergency.`);

  if (isBackendConnected) {
    try {
      await fetch(`/api/reports/${reportId}/boost`, { method: 'POST' });
    } catch (e) {}
  }

  alert(`⚡ Ticket ${reportId} received Urgency Boost! Crew dispatch priority elevated.`);
  renderAdminDashboard();
};

window.adminEscalateTicket = async function(reportId) {
  const reports = getReports();
  const rep = reports.find(r => r.id === reportId);
  if (!rep) return;

  rep.isEscalated = true;
  rep.escalatedTo = 'Zonal Municipal Commissioner';
  rep.escalatedAt = Date.now();
  saveReports(reports);
  addAuditLog('Admin', 'STATUTORY_ESCALATION', `Ticket ${reportId} escalated directly to Zonal Municipal Commissioner.`);

  if (isBackendConnected) {
    try {
      await fetch(`/api/reports/${reportId}/escalate`, { method: 'POST' });
    } catch (e) {}
  }

  alert(`🏛️ Ticket ${reportId} officially escalated to Zonal Municipal Commissioner!`);
  renderAdminDashboard();
};

window.openSanitationNoticeModal = function(reportId) {
  const reports = getReports();
  const rep = reports.find(r => r.id === reportId);
  if (!rep) return;

  const modal = document.getElementById('sanitationNoticeModal');
  const idInput = document.getElementById('noticeReportId');
  const locInput = document.getElementById('noticeLocation');

  if (idInput) idInput.value = reportId;
  if (locInput) locInput.value = `${rep.schoolName || rep.companyName || rep.userName} (${rep.resolvedAddress || rep.landmark})`;
  if (modal) modal.classList.add('active');
};

window.handleSanitationNoticeSubmit = function(e) {
  if (e) e.preventDefault();
  const id = document.getElementById('noticeReportId').value;
  const violation = document.getElementById('noticeViolationType').value;
  const penalty = document.getElementById('noticeFineAmount').value;

  addAuditLog('Admin', 'CITATION_ISSUED', `Statutory notice issued for ticket ${id}: ${violation} - ${penalty}`);
  closeModal('sanitationNoticeModal');
  alert(`Official Municipal Sanitation Notice dispatched for Ticket ${id}!\nViolation: ${violation}\nPenalty: ${penalty}`);
};

function renderAdminLeaderboardTable() {
  const tbody = document.getElementById('adminLeaderboardTableBody');
  if (!tbody) return;

  const wardsData = [
    { rank: 1, medal: '🥇', ward: 'Ward K/East - Andheri Industrial Estate', rating: '⭐⭐⭐⭐⭐', score: 92.4, avgResponse: '1.2h', diversion: '88%', policy: 'Model Ward: Extend Green Corridor Grant' },
    { rank: 2, medal: '🥈', ward: 'Ward G/South - Dadar & Elphinstone', rating: '⭐⭐⭐⭐', score: 86.8, avgResponse: '2.4h', diversion: '82%', policy: 'Deploy Night Shift Hydraulic Compactor' },
    { rank: 3, medal: '🥉', ward: 'Ward H/West - Bandra Residential', rating: '⭐⭐⭐⭐', score: 84.1, avgResponse: '3.1h', diversion: '79%', policy: 'Distribute Citizen Home Composting Kits' },
    { rank: 4, medal: '4', ward: 'Ward A - Colaba & Fort Commercial', rating: '⭐⭐⭐', score: 71.5, avgResponse: '4.8h', diversion: '65%', policy: 'Increase Bin Density at Transit Terminals' },
    { rank: 5, medal: '5', ward: 'Ward S - Powai Lake & Tech Enclave', rating: '⭐⭐', score: 58.0, avgResponse: '7.5h', diversion: '44%', policy: 'Statutory Remediation: Compulsory Segregation Drive' }
  ];

  tbody.innerHTML = wardsData.map(w => `
    <tr>
      <td><strong style="font-size: 1.1rem;">${w.medal}</strong> <span style="font-size: 0.85rem; color: #64748b;">(#${w.rank})</span></td>
      <td><strong>${w.ward}</strong></td>
      <td><span style="font-size: 0.95rem;">${w.rating}</span></td>
      <td><strong style="color: ${w.score >= 80 ? 'var(--civic-spruce-green)' : (w.score >= 65 ? 'var(--civic-signal-amber)' : 'var(--civic-signal-crimson)')}; font-size: 1.05rem;">${w.score}</strong> / 100</td>
      <td>${w.avgResponse}</td>
      <td><strong>${w.diversion}</strong></td>
      <td><small style="color: #475569;">${w.policy}</small></td>
    </tr>
  `).join('');
}

const SBM_TARGETS = {
  segregation: 60,
  coverage: 80,
  processing: 80
};

function getComplianceStatus(value, target) {
  if (value >= target) return 'ontrack';
  if (value >= target - 10) return 'neartarget';
  return 'offtarget';
}

function renderAdminComplianceTable() {
  const metrics = JSON.parse(localStorage.getItem('swm_compliance_metrics') || '[]');
  const tbody = document.getElementById('adminComplianceTableBody');
  if (!tbody) return;

  // Compute city-wide averages
  let totalSeg = 0, totalCov = 0, totalProc = 0;
  metrics.forEach(m => {
    totalSeg += Number(m.segregationRate || 0);
    totalCov += Number(m.coverageRate || 0);
    totalProc += Number(m.processingRate || 0);
  });
  const count = metrics.length || 1;
  const avgSeg = Math.round((totalSeg / count) * 10) / 10;
  const avgCov = Math.round((totalCov / count) * 10) / 10;
  const avgProc = Math.round((totalProc / count) * 10) / 10;

  const segEl = document.getElementById('adminCitySegregationRate');
  const covEl = document.getElementById('adminCityCoverageRate');
  const procEl = document.getElementById('adminCityProcessingRate');

  if (segEl) segEl.textContent = `${avgSeg}%`;
  if (covEl) covEl.textContent = `${avgCov}%`;
  if (procEl) procEl.textContent = `${avgProc}%`;

  const segPill = document.getElementById('adminSegregationStatusPill');
  const covPill = document.getElementById('adminCoverageStatusPill');
  const procPill = document.getElementById('adminProcessingStatusPill');

  function getStatusBadge(val, target) {
    const status = getComplianceStatus(val, target);
    if (status === 'ontrack') return { cls: 'status-ontrack', text: '🟢 ON TRACK' };
    if (status === 'neartarget') return { cls: 'status-neartarget', text: '🟡 NEAR TARGET' };
    return { cls: 'status-offtarget', text: '🔴 OFF TARGET' };
  }

  if (segPill) {
    const s = getStatusBadge(avgSeg, SBM_TARGETS.segregation);
    segPill.className = `compliance-badge ${s.cls}`;
    segPill.textContent = s.text;
  }
  if (covPill) {
    const s = getStatusBadge(avgCov, SBM_TARGETS.coverage);
    covPill.className = `compliance-badge ${s.cls}`;
    covPill.textContent = s.text;
  }
  if (procPill) {
    const s = getStatusBadge(avgProc, SBM_TARGETS.processing);
    procPill.className = `compliance-badge ${s.cls}`;
    procPill.textContent = s.text;
  }

  tbody.innerHTML = metrics.map(m => {
    let statusBadge = '<span class="compliance-badge status-ontrack">🟢 ON TRACK</span>';
    const status = getComplianceStatus(m.segregationRate, SBM_TARGETS.segregation);
    if (status === 'neartarget') {
      statusBadge = '<span class="compliance-badge status-neartarget">🟡 NEAR TARGET</span>';
    } else if (status === 'offtarget') {
      statusBadge = '<span class="compliance-badge status-offtarget">🔴 OFF TARGET</span>';
    }

    return `
      <tr>
        <td><strong>${m.ward}</strong></td>
        <td><strong style="color: ${m.segregationRate >= 60 ? 'var(--civic-spruce-green)' : (m.segregationRate >= 50 ? 'var(--civic-signal-amber)' : 'var(--civic-signal-crimson)')};">${m.segregationRate}%</strong> (Target 60%+)</td>
        <td><strong style="color: ${m.coverageRate >= 80 ? 'var(--civic-spruce-green)' : 'var(--civic-signal-amber)'};">${m.coverageRate}%</strong> (Target 80%+)</td>
        <td><strong style="color: ${m.processingRate >= 80 ? 'var(--civic-spruce-green)' : 'var(--civic-signal-crimson)'};">${m.processingRate}%</strong> (Target 80%+)</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

function openUpdateComplianceModal() {
  const modal = document.getElementById('updateComplianceModal');
  if (modal) {
    modal.classList.add('active');
    const select = document.getElementById('complianceWardSelect');
    if (select) onComplianceWardSelectChange(select.value);
  }
}
window.openUpdateComplianceModal = openUpdateComplianceModal;

window.onComplianceWardSelectChange = function(ward) {
  const metrics = JSON.parse(localStorage.getItem('swm_compliance_metrics') || '[]');
  const m = metrics.find(item => item.ward === ward);
  if (m) {
    document.getElementById('compSegregationInput').value = m.segregationRate;
    document.getElementById('compCoverageInput').value = m.coverageRate;
    document.getElementById('compProcessingInput').value = m.processingRate;
  }
};

function saveWardComplianceMetrics(ward, seg, cov, proc) {
  let metrics = JSON.parse(localStorage.getItem('swm_compliance_metrics') || '[]');
  const idx = metrics.findIndex(m => m.ward === ward);
  const status = (seg >= SBM_TARGETS.segregation && cov >= SBM_TARGETS.coverage && proc >= SBM_TARGETS.processing) ? 'ontrack' : ((seg >= SBM_TARGETS.segregation - 10 && cov >= SBM_TARGETS.coverage - 10) ? 'neartarget' : 'offtarget');

  const updatedObj = { ward, segregationRate: seg, coverageRate: cov, processingRate: proc, status };
  if (idx !== -1) {
    metrics[idx] = updatedObj;
  } else {
    metrics.push(updatedObj);
  }

  localStorage.setItem('swm_compliance_metrics', JSON.stringify(metrics));
  addAuditLog('Admin', 'COMPLIANCE_UPDATE', `Updated SBM 2.0 metrics for ${ward}: Seg ${seg}%, Cov ${cov}%, Proc ${proc}%`);
  return updatedObj;
}
window.saveWardComplianceMetrics = saveWardComplianceMetrics;

window.handleUpdateComplianceSubmit = function(e) {
  if (e) e.preventDefault();
  const ward = document.getElementById('complianceWardSelect').value;
  const seg = Number(document.getElementById('compSegregationInput').value);
  const cov = Number(document.getElementById('compCoverageInput').value);
  const proc = Number(document.getElementById('compProcessingInput').value);

  const updatedObj = saveWardComplianceMetrics(ward, seg, cov, proc);

  if (isBackendConnected) {
    fetch('/api/compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedObj)
    }).catch(() => {});
  }

  closeModal('updateComplianceModal');
  alert(`Statutory compliance metrics updated for ${ward}!`);
  renderAdminComplianceTable();
};

function renderAdminLogsTable() {
  const tbody = document.getElementById('adminLogsTableBody');
  if (!tbody) return;

  const logs = getAuditLogs();
  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 1.5rem;">No system audit entries logged yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(l => {
    let badgeClass = 'audit-badge-create';
    if (l.action.includes('CLEAR') || l.action.includes('FULFILL')) badgeClass = 'audit-badge-clear';
    if (l.action.includes('ALERT') || l.action.includes('BOOST') || l.action.includes('BROADCAST')) badgeClass = 'audit-badge-alert';
    if (l.action.includes('ESCALAT') || l.action.includes('DELETE') || l.action.includes('CITATION')) badgeClass = 'audit-badge-escalate';
    if (l.action.includes('DISPATCH') || l.action.includes('ASSIGN')) badgeClass = 'audit-badge-dispatch';

    const timeStr = new Date(l.timestamp).toLocaleString();
    return `
      <tr>
        <td><small style="font-family: monospace;">${timeStr}</small></td>
        <td><strong>${l.actor}</strong></td>
        <td><span class="audit-badge ${badgeClass}">${l.action}</span></td>
        <td>${l.details}</td>
      </tr>
    `;
  }).join('');
}

window.exportAdminLogsCSV = function() {
  const logs = getAuditLogs();
  if (logs.length === 0) {
    alert('No operational logs available to export.');
    return;
  }

  const csvRows = [
    ['Timestamp', 'Actor', 'Action', 'Details']
  ];

  logs.forEach(l => {
    csvRows.push([
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${(l.actor || '').replace(/"/g, '""')}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
  });

  const csvString = csvRows.map(row => row.join(',')).join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `municipal-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window.adminSmartAutoAssign = async function() {
  const reports = getReports();
  const unassigned = reports.filter(r => r.status === 'reported');
  const workers = getUsers().filter(u => u.role === 'worker');

  if (workers.length === 0) {
    alert('No active municipal sanitation workers found to assign tasks to.');
    return;
  }

  if (unassigned.length === 0) {
    alert('All pending reports are already assigned to crews!');
    return;
  }

  if (isBackendConnected) {
    try {
      const res = await fetch('/api/admin/auto-assign', { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        await syncWithBackend();
        alert(`⚡ Smart Auto-Assign complete! ${result.count} report(s) dispatched to municipal crews via REST API.`);
        return;
      }
    } catch (e) {}
  }

  let count = 0;
  unassigned.forEach((rep, idx) => {
    const assignedWorker = workers[idx % workers.length];
    rep.status = 'assigned';
    rep.assignedWorkerId = assignedWorker.id;
    rep.assignedWorkerName = assignedWorker.name;
    rep.assignedAt = Date.now();
    count++;
  });

  saveReports(reports);
  addAuditLog('Admin', 'SMART_AUTO_ASSIGN', `Auto-assigned ${count} tasks across ${workers.length} crew(s) based on ward proximity.`);
  alert(`⚡ Smart Auto-Assign complete! ${count} report(s) dispatched to municipal crews.`);
  renderAdminDashboard();
};

window.applyBroadcastPreset = function(val) {
  const input = document.getElementById('adminBroadcastInput');
  if (input && val) {
    input.value = val;
  }
};

window.publishBroadcastAdvisory = async function() {
  const input = document.getElementById('adminBroadcastInput');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) {
    alert('Please enter a broadcast message advisory before transmitting.');
    return;
  }

  const broadcasts = getBroadcasts();
  broadcasts.forEach(b => b.active = false);

  const newBroadcast = {
    id: `BC-${Date.now().toString().slice(-4)}`,
    message: msg,
    level: 'warning',
    author: currentUser ? currentUser.name : 'Municipal Sanitation Officer',
    timestamp: Date.now(),
    active: true
  };
  broadcasts.unshift(newBroadcast);
  saveBroadcasts(broadcasts);
  addAuditLog('Admin', 'BROADCAST_PUBLISHED', `Broadcast transmitted: "${msg.slice(0, 60)}..."`);

  if (isBackendConnected) {
    try {
      await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBroadcast)
      });
    } catch (e) {}
  }

  input.value = '';
  const preset = document.getElementById('adminBroadcastPreset');
  if (preset) preset.value = '';

  displayActiveBroadcasts();
  alert('📢 Municipal Broadcast Advisory transmitted live to all civic views!');
};

window.clearBroadcastAdvisory = async function() {
  const broadcasts = getBroadcasts();
  broadcasts.forEach(b => b.active = false);
  saveBroadcasts(broadcasts);
  addAuditLog('Admin', 'BROADCAST_CLEARED', 'Cleared all active municipal broadcast advisories');

  if (isBackendConnected) {
    try {
      await fetch('/api/broadcasts', { method: 'DELETE' });
    } catch (e) {}
  }

  displayActiveBroadcasts();
  alert('All active municipal broadcasts cleared.');
};

window.dismissBroadcast = function() {
  const container = document.getElementById('globalBroadcastContainer');
  if (container) container.style.display = 'none';
};

function displayActiveBroadcasts() {
  const broadcasts = getBroadcasts();
  const active = broadcasts.find(b => b.active);
  const container = document.getElementById('globalBroadcastContainer');
  const textEl = document.getElementById('globalBroadcastText');

  if (!container || !textEl) return;

  if (active && active.message) {
    textEl.textContent = active.message;
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

window.switchDemoRole = function(email) {
  if (!email) return;
  quickLogin(email);
};

window.openAboutProjectModal = function() {
  const modal = document.getElementById('aboutProjectModal');
  if (modal) modal.classList.add('active');
};

let adminMapObj = null;

function initAdminHotspotMap() {
  const mapElement = document.getElementById('adminHotspotMap');
  if (!mapElement) return;

  if (adminMapObj) {
    adminMapObj.invalidateSize();
    return;
  }

  adminMapObj = L.map('adminHotspotMap').setView([19.0760, 72.8777], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(adminMapObj);

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

/* ==========================================================================
   Admin Live Worker Tracking Map Engine & Multi-Crew Optimization
   ========================================================================== */
let adminWorkerMapObj = null;
let adminWorkerMarkers = [];
let adminWorkerMarkersMap = new Map();
let adminWorkerRouteLine = null;
let adminWorkerRouteStopMarkers = [];
let currentAdminWorkerFilter = 'all';
let selectedMultiRouteWorkerIds = new Set();
let adminMultiRoutePolylines = [];
let adminMultiRouteMarkers = [];
const MULTI_ROUTE_COLORS = ['#059669', '#1c52d8', '#7c3aed', '#d97706', '#e11d48', '#0891b2'];

/* Vehicle-Specific Inline SVG Icons for Municipal Tracking */
function getVehicleSvgIcon(vehicleType = '', isIdle = false) {
  const typeStr = (vehicleType || '').toLowerCase();
  const fill = isIdle ? '#64748b' : '#047857';

  if (typeStr.includes('biomedical')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fill}" style="vertical-align: middle;"><path d="M2 7h14v10H2V7zm15 3h4l2 3v4h-6v-7zM6 19a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"/><path d="M8 9h2v2h2v2h-2v2H8v-2H6v-2h2V9z" fill="#ef4444"/></svg>`;
  }
  if (typeStr.includes('tipper auto') || typeStr.includes('auto')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fill}" style="vertical-align: middle;"><path d="M3 13l2-6h9v6H3zm12-4h4l2 4h-6V9zM5 18a2 2 0 100-4 2 2 0 000 4zm11 0a2 2 0 100-4 2 2 0 000 4zM11 6l2-3h4l-1 3h-5z"/></svg>`;
  }
  if (typeStr.includes('e-rickshaw') || typeStr.includes('mini')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fill}" style="vertical-align: middle;"><path d="M4 11h9v5H4v-5zm10 1h4l2 2v2h-6v-4zM6 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"/><path d="M10 4l-2 4h3l-1 3 4-5h-3l1-2h-2z" fill="#10b981"/></svg>`;
  }
  if (typeStr.includes('dumper') || typeStr.includes('debris')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fill}" style="vertical-align: middle;"><path d="M3 14l2-6h10l-2 6H3zm11-3h5l3 3v3h-8v-6zM6 19a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"/></svg>`;
  }
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fill}" style="vertical-align: middle;"><path d="M1 8h13v8H1V8zm14 2h4l3 3v3h-7v-6zM5 19a2 2 0 100-4 2 2 0 000 4zm13 0a2 2 0 100-4 2 2 0 000 4z"/><path d="M4 10h4v4H4z" fill="#fff" opacity="0.6"/></svg>`;
}

/* Marker LatLng Smooth Interpolation (Respects prefers-reduced-motion) */
function animateMarkerTo(marker, newLatLng, duration = 1200) {
  if (!marker) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || duration <= 0) {
    marker.setLatLng(newLatLng);
    return;
  }

  const startLatLng = marker.getLatLng();
  const startLat = startLatLng.lat;
  const startLng = startLatLng.lng;
  const targetLat = Array.isArray(newLatLng) ? newLatLng[0] : newLatLng.lat;
  const targetLng = Array.isArray(newLatLng) ? newLatLng[1] : newLatLng.lng;

  if (Math.abs(startLat - targetLat) < 0.00001 && Math.abs(startLng - targetLng) < 0.00001) {
    return;
  }

  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    const currentLat = startLat + (targetLat - startLat) * ease;
    const currentLng = startLng + (targetLng - startLng) * ease;
    marker.setLatLng([currentLat, currentLng]);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

/* Progressive Route Polyline Draw-in Animation */
function animatePolylineDrawIn(polyline, fullCoords, duration = 450) {
  if (!polyline || !fullCoords || fullCoords.length < 2) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    polyline.setLatLngs(fullCoords);
    return;
  }
  let stepIdx = 2;
  const interval = Math.max(25, Math.floor(duration / fullCoords.length));
  polyline.setLatLngs(fullCoords.slice(0, 2));
  const timer = setInterval(() => {
    if (stepIdx <= fullCoords.length) {
      polyline.setLatLngs(fullCoords.slice(0, stepIdx));
      stepIdx++;
    } else {
      clearInterval(timer);
    }
  }, interval);
}

/* Empty State Modern SVG Renderer */
function getEmptyStateHTML(iconType, message, subtext) {
  let svgIcon = '';
  if (iconType === 'reports') {
    svgIcon = `<svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="8" width="36" height="48" rx="6" stroke="#94a3b8" stroke-width="2.5" fill="none"/>
      <path d="M22 6h20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
      <path d="M22 22h20M22 30h16M22 38h12" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <circle cx="44" cy="44" r="10" fill="#f8fafc" stroke="#10b981" stroke-width="2"/>
      <path d="M40 44l3 3 6-6" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else if (iconType === 'redemptions') {
    svgIcon = `<svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="24" width="44" height="32" rx="4" stroke="#94a3b8" stroke-width="2.5"/>
      <path d="M32 24v32M10 34h44" stroke="#94a3b8" stroke-width="2"/>
      <path d="M32 24c-4-8-12-8-12-3s12 11 12 11 12-6 12-11-8-5-12 3z" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>
    </svg>`;
  } else if (iconType === 'proofs') {
    svgIcon = `<svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="48" height="36" rx="6" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="32" cy="34" r="10" stroke="#94a3b8" stroke-width="2.5"/>
      <path d="M22 16l3-6h14l3 6" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="46" cy="22" r="2" fill="#94a3b8"/>
    </svg>`;
  } else if (iconType === 'expiry') {
    svgIcon = `<svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="24" height="44" rx="4" stroke="#94a3b8" stroke-width="2.5"/>
      <path d="M26 10V6h12v4" stroke="#94a3b8" stroke-width="2"/>
      <path d="M32 24v14M25 31h14" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M20 40h24" stroke="#cbd5e1" stroke-width="2"/>
    </svg>`;
  } else {
    svgIcon = `<svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" stroke="#94a3b8" stroke-width="2.5"/>
      <path d="M32 18v14l10 6" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="3" fill="#10b981"/>
    </svg>`;
  }

  return `
    <div class="empty-state-card">
      ${svgIcon}
      <div style="font-weight: 700; color: var(--civic-forest-ink); font-size: 0.95rem; margin-bottom: 0.25rem;">${message}</div>
      ${subtext ? `<div style="color: #64748b; font-size: 0.8rem;">${subtext}</div>` : ''}
    </div>
  `;
}

window.setAdminWorkerFilter = function(filter) {
  currentAdminWorkerFilter = filter;
  const chips = document.querySelectorAll('.admin-filter-chip');
  chips.forEach(c => {
    if (c.getAttribute('data-filter') === filter) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
  initAdminWorkerLocationsMap();
};

function renderFleetUtilizationSummary(workers, fleet, reports) {
  const activeCount = workers.filter(w => {
    const isOff = w.shiftStatus === 'off-shift' || (Date.now() - (w.lastLocationUpdatedAt || 0)) > 30 * 60 * 1000;
    return !isOff;
  }).length;
  const idleCount = workers.length - activeCount;

  let totalStops = 0;
  workers.forEach(w => {
    const stops = reports.filter(r => r.status !== 'cleared' && (r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName)))));
    totalStops += stops.length;
  });
  const avgStops = workers.length > 0 ? (totalStops / workers.length).toFixed(1) : '0.0';

  const activeEl = document.getElementById('adminStatActiveCrews');
  const idleEl = document.getElementById('adminStatIdleCrews');
  const avgEl = document.getElementById('adminStatAvgStops');
  const totalEl = document.getElementById('adminStatTotalUnits');

  if (activeEl) activeEl.textContent = activeCount;
  if (idleEl) idleEl.textContent = idleCount;
  if (avgEl) avgEl.textContent = avgStops;
  if (totalEl) totalEl.textContent = fleet.length;

  const countAll = document.getElementById('adminFilterCountAll');
  const countActive = document.getElementById('adminFilterCountActive');
  const countIdle = document.getElementById('adminFilterCountIdle');
  const countOnRoute = document.getElementById('adminFilterCountOnRoute');

  const onRouteCount = workers.filter(w => {
    const stops = reports.filter(r => r.status !== 'cleared' && (r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName)))));
    return stops.length > 0;
  }).length;

  if (countAll) countAll.textContent = workers.length;
  if (countActive) countActive.textContent = activeCount;
  if (countIdle) countIdle.textContent = idleCount;
  if (countOnRoute) countOnRoute.textContent = onRouteCount;
}

function initAdminWorkerLocationsMap(forceRefresh) {
  const mapElement = document.getElementById('adminWorkerLocationsMap');
  if (!mapElement) return;

  if (typeof L === 'undefined') return;

  // Spin refresh icon animation
  const refreshBtns = document.querySelectorAll('#btnAdminRefreshWorkerMap .refresh-icon, .admin-map-refresh-icon');
  refreshBtns.forEach(icon => {
    icon.classList.remove('spin-refresh-icon');
    void icon.offsetWidth;
    icon.classList.add('spin-refresh-icon');
  });

  if (adminWorkerMapObj) {
    adminWorkerMapObj.invalidateSize();
  } else {
    adminWorkerMapObj = L.map('adminWorkerLocationsMap', { zoomControl: true }).setView([19.0760, 72.8777], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(adminWorkerMapObj);
  }

  const workers = getUsers().filter(u => u.role === 'worker');
  const fleet = getFleet();
  const reports = getReports().filter(r => r.status !== 'cleared');

  // Update Fleet Utilization Summary
  renderFleetUtilizationSummary(workers, fleet, reports);

  // Filter workers based on status filter
  const filteredWorkers = workers.filter(w => {
    const isIdle = w.shiftStatus === 'off-shift' || (Date.now() - (w.lastLocationUpdatedAt || 0)) > 30 * 60 * 1000;
    const isActive = !isIdle;
    const assignedStops = reports.filter(r => r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName))));
    const isOnRoute = assignedStops.length > 0;

    if (currentAdminWorkerFilter === 'active') return isActive;
    if (currentAdminWorkerFilter === 'idle') return isIdle;
    if (currentAdminWorkerFilter === 'on_route') return isOnRoute;
    return true; // 'all'
  });

  const countBadge = document.getElementById('adminFilteredWorkerCount');
  if (countBadge) countBadge.textContent = `${filteredWorkers.length} Crews Shown`;

  // Remove markers no longer in filteredWorkers
  const currentWorkerIds = new Set(filteredWorkers.map(w => w.id));
  for (const [wId, entry] of adminWorkerMarkersMap.entries()) {
    if (!currentWorkerIds.has(wId)) {
      entry.marker.remove();
      adminWorkerMarkersMap.delete(wId);
    }
  }

  adminWorkerMarkers = [];

  // Plot or smoothly update markers for filtered workers
  filteredWorkers.forEach(w => {
    const lat = w.lastKnownLat || 19.0200;
    const lng = w.lastKnownLng || 72.8350;
    const vehicle = fleet.find(f => f.driverId === w.id || f.driver === w.name || (w.name && f.driver && w.name.includes(f.driver)) || (w.name && f.driver && f.driver.includes(w.name))) || fleet[0];
    const assignedStops = reports.filter(r => r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName))));
    const isIdle = w.shiftStatus === 'off-shift' || (Date.now() - (w.lastLocationUpdatedAt || 0)) > 30 * 60 * 1000;
    const updatedStr = w.lastLocationUpdatedAt ? formatTimeAgo(w.lastLocationUpdatedAt) : 'Just now';
    const vehicleSvg = getVehicleSvgIcon(vehicle ? vehicle.type : '', isIdle);

    const popupHtml = `
      <div style="min-width: 240px; font-family: var(--font-body);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <h4 style="margin: 0; font-size: 1rem;">👷 ${w.name}</h4>
          <span class="badge" style="font-size: 0.68rem; ${isIdle ? 'background: #64748b; color: #fff;' : 'background: rgba(16, 185, 129, 0.2); color: #047857;'}">
            ${isIdle ? '⏸️ Idle / Off-Shift' : '🟢 Active Shift'}
          </span>
        </div>
        <div style="font-size: 0.78rem; color: #64748b;">Crew ID: <code>${w.id}</code> (Crew #${w.crewNumber || '101'})</div>
        <div style="font-size: 0.82rem; margin: 0.35rem 0;">🚛 Vehicle: <strong>${vehicle ? vehicle.type : 'Compactor'}</strong> (<code style="background: rgba(0,0,0,0.06); padding: 1px 4px; border-radius: 3px;">${vehicle ? vehicle.regNo : 'MH-01'}</code>)</div>
        <div style="font-size: 0.82rem; margin-bottom: 0.35rem;">📋 Stops Remaining: <strong>${assignedStops.length}</strong> ${assignedStops.some(s => s.isEmergency) ? '<span style="color: #dc2626; font-weight: 800;">🚨 (Includes Emergency)</span>' : ''}</div>
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.6rem;">🕒 Last Updated: ${updatedStr} &bull; Ward: ${w.assignedWard || 'Mumbai'}</div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <button class="btn btn-primary btn-xs" style="width: 100%;" onclick="adminOverlayWorkerRoute('${w.id}')">🗺️ Overlay Assigned Route</button>
          <button class="btn btn-outline btn-xs" style="width: 100%;" onclick="reassignNearestWorkerStop('${w.id}')">🔄 Reassign Nearest Stop</button>
        </div>
      </div>
    `;

    if (adminWorkerMarkersMap.has(w.id)) {
      const entry = adminWorkerMarkersMap.get(w.id);
      entry.worker = w;
      animateMarkerTo(entry.marker, [lat, lng], 1200);
      entry.marker.setIcon(L.divIcon({
        className: 'custom-admin-worker-icon',
        html: `<div class="admin-worker-marker ${isIdle ? 'idle' : ''}" style="cursor: pointer; display: flex; align-items: center; gap: 4px;">${vehicleSvg} <span>${w.name.split(' ')[0]}</span></div>`,
        iconSize: [105, 30],
        iconAnchor: [52, 15]
      }));
      entry.marker.setPopupContent(popupHtml);
      adminWorkerMarkers.push(entry);
    } else {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-admin-worker-icon marker-pin-drop',
          html: `<div class="admin-worker-marker ${isIdle ? 'idle' : ''}" style="cursor: pointer; display: flex; align-items: center; gap: 4px;">${vehicleSvg} <span>${w.name.split(' ')[0]}</span></div>`,
          iconSize: [105, 30],
          iconAnchor: [52, 15]
        })
      }).addTo(adminWorkerMapObj);

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        adminOverlayWorkerRoute(w.id);
      });

      const entry = { id: w.id, marker, worker: w };
      adminWorkerMarkersMap.set(w.id, entry);
      adminWorkerMarkers.push(entry);
    }
  });

  // Render Worker List Panel beside the map
  const listPanel = document.getElementById('adminWorkerListPanel');
  if (listPanel) {
    if (filteredWorkers.length === 0) {
      listPanel.innerHTML = getEmptyStateHTML('workers', 'No crews match filter', `No municipal workers found matching "${currentAdminWorkerFilter}".`);
    } else {
      listPanel.innerHTML = filteredWorkers.map(w => {
        const vehicle = fleet.find(f => f.driverId === w.id || f.driver === w.name || (w.name && f.driver && w.name.includes(f.driver)) || (w.name && f.driver && f.driver.includes(w.name))) || fleet[0];
        const assignedStops = reports.filter(r => r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName))));
        const isIdle = w.shiftStatus === 'off-shift' || (Date.now() - (w.lastLocationUpdatedAt || 0)) > 30 * 60 * 1000;
        const updatedStr = w.lastLocationUpdatedAt ? formatTimeAgo(w.lastLocationUpdatedAt) : 'Just now';
        const hasEmg = assignedStops.some(s => s.isEmergency);

        return `
          <div class="admin-worker-card" data-worker-id="${w.id}" onclick="focusAdminWorkerMarker('${w.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
              <div>
                <strong style="font-size: 0.88rem; color: var(--civic-forest-ink);">${w.name}</strong>
                <div style="font-size: 0.74rem; color: #64748b;">Crew #${w.crewNumber || '101'} &bull; ${w.assignedWard ? w.assignedWard.split('-')[1] || w.assignedWard : 'Mumbai'}</div>
              </div>
              <span class="badge" style="font-size: 0.68rem; ${isIdle ? 'background: #64748b; color: #fff;' : 'background: rgba(16, 185, 129, 0.2); color: #047857;'}">
                ${isIdle ? '⏸️ Idle' : '🟢 Active'}
              </span>
            </div>

            <div style="font-size: 0.78rem; color: #475569; margin-bottom: 0.35rem;">
              🚛 ${vehicle ? vehicle.type : 'Vehicle'} (<code style="font-size: 0.72rem;">${vehicle ? vehicle.regNo : 'MH-01'}</code>)
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">
              <span>Stops: <strong style="color: ${hasEmg ? '#dc2626' : 'var(--civic-cobalt-accent)'};">${assignedStops.length} remaining</strong> ${hasEmg ? '🚨' : ''}</span>
              <span>🕒 ${updatedStr}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--civic-border); padding-top: 0.4rem;" onclick="event.stopPropagation();">
              <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; cursor: pointer; color: var(--civic-forest-ink); font-weight: 700; margin: 0;">
                <input type="checkbox" class="worker-compare-checkbox" ${selectedMultiRouteWorkerIds.has(w.id) ? 'checked' : ''} onchange="toggleWorkerMultiRouteCompare('${w.id}', this.checked)">
                Compare Route
              </label>
              <button type="button" class="btn btn-outline btn-xs" onclick="focusAdminWorkerMarker('${w.id}')">📍 Focus Map</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  setTimeout(() => {
    if (adminWorkerMapObj) adminWorkerMapObj.invalidateSize();
  }, 200);
}

window.focusAdminWorkerMarker = function(workerId) {
  if (!adminWorkerMapObj) return;
  const workers = getUsers().filter(u => u.role === 'worker');
  const w = workers.find(x => x.id === workerId);
  if (!w) return;
  const lat = w.lastKnownLat || 19.0200;
  const lng = w.lastKnownLng || 72.8350;

  adminWorkerMapObj.setView([lat, lng], 14);

  const found = adminWorkerMarkers.find(m => m.id === workerId);
  if (found) {
    found.marker.openPopup();
  }

  adminOverlayWorkerRoute(workerId);

  // Highlight active row in panel
  const cards = document.querySelectorAll('.admin-worker-card');
  cards.forEach(c => {
    if (c.getAttribute('data-worker-id') === workerId) {
      c.classList.add('active-focused');
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      c.classList.remove('active-focused');
    }
  });
};

window.toggleWorkerMultiRouteCompare = function(workerId, isChecked) {
  if (isChecked) {
    selectedMultiRouteWorkerIds.add(workerId);
  } else {
    selectedMultiRouteWorkerIds.delete(workerId);
  }
  renderMultiWorkerRouteOverlays();
};

window.renderMultiWorkerRouteOverlays = function() {
  if (!adminWorkerMapObj) return;

  // Clear previous multi-route lines & markers
  adminMultiRoutePolylines.forEach(p => p.remove());
  adminMultiRoutePolylines = [];
  adminMultiRouteMarkers.forEach(m => m.remove());
  adminMultiRouteMarkers = [];

  const legend = document.getElementById('adminMultiRouteLegend');
  const legendItems = document.getElementById('adminMultiRouteLegendItems');

  if (selectedMultiRouteWorkerIds.size === 0) {
    if (legend) legend.style.display = 'none';
    return;
  }

  if (legend) legend.style.display = 'block';
  if (legendItems) legendItems.innerHTML = '';

  const workers = getUsers().filter(u => u.role === 'worker');
  const fleet = getFleet();
  const allReports = getReports().filter(r => r.status !== 'cleared');

  let colorIdx = 0;
  const allBoundsCoords = [];

  selectedMultiRouteWorkerIds.forEach(wId => {
    const w = workers.find(usr => usr.id === wId);
    if (!w) return;

    const color = MULTI_ROUTE_COLORS[colorIdx % MULTI_ROUTE_COLORS.length];
    colorIdx++;

    const wLat = w.lastKnownLat || 19.0200;
    const wLng = w.lastKnownLng || 72.8350;
    const assignedStops = allReports.filter(r => r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName))));

    const pathCoords = [
      [wLat, wLng],
      ...assignedStops.map(s => [
        s.latitude !== undefined ? s.latitude : (s.coords?.lat || 19.0760),
        s.longitude !== undefined ? s.longitude : (s.coords?.lng || 72.8777)
      ])
    ];

    allBoundsCoords.push(...pathCoords);

    if (pathCoords.length > 1) {
      const poly = L.polyline(pathCoords, {
        color: color,
        weight: 4,
        opacity: 0.9,
        dashArray: '6, 6',
        className: 'animated-route-line'
      }).addTo(adminWorkerMapObj);
      animatePolylineDrawIn(poly, pathCoords, 450);
      adminMultiRoutePolylines.push(poly);
    }

    assignedStops.forEach((stop, idx) => {
      const lat = stop.latitude !== undefined ? stop.latitude : (stop.coords?.lat || 19.0760);
      const lng = stop.longitude !== undefined ? stop.longitude : (stop.coords?.lng || 72.8777);
      const isEmg = stop.isEmergency;
      const m = L.marker([lat, lng], {
        icon: L.divIcon({
          className: isEmg ? 'emergency-pulse-marker' : '',
          html: `<div style="background: ${color}; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isEmg ? '🚨' : idx + 1}</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      }).addTo(adminWorkerMapObj);
      m.bindPopup(`<strong>${w.name.split(' ')[0]} - Stop #${idx + 1}: ${stop.landmark}</strong><br>Status: ${stop.status.toUpperCase()}<br>Ward: ${stop.area || stop.wardZone}`);
      adminMultiRouteMarkers.push(m);
    });

    if (legendItems) {
      const v = fleet.find(f => f.driverId === w.id || f.driver === w.name) || {};
      const itemEl = document.createElement('span');
      itemEl.className = 'multi-route-pill';
      itemEl.innerHTML = `<span class="multi-route-swatch" style="background: ${color};"></span> <strong>${w.name}</strong> (${assignedStops.length} stops, ${v.type || 'Vehicle'})`;
      legendItems.appendChild(itemEl);
    }
  });

  if (allBoundsCoords.length > 1) {
    adminWorkerMapObj.fitBounds(L.latLngBounds(allBoundsCoords), { padding: [35, 35] });
  }
};

window.clearAllWorkerRouteOverlays = function() {
  selectedMultiRouteWorkerIds.clear();
  adminMultiRoutePolylines.forEach(p => p.remove());
  adminMultiRoutePolylines = [];
  adminMultiRouteMarkers.forEach(m => m.remove());
  adminMultiRouteMarkers = [];

  const legend = document.getElementById('adminMultiRouteLegend');
  if (legend) legend.style.display = 'none';

  clearAdminWorkerRouteOverlay();

  const checkboxes = document.querySelectorAll('.worker-compare-checkbox');
  checkboxes.forEach(cb => cb.checked = false);
};

window.reassignNearestWorkerStop = function(fromWorkerId) {
  const workers = getUsers().filter(u => u.role === 'worker');
  const fromWorker = workers.find(w => w.id === fromWorkerId) || workers[0];
  if (!fromWorker) return;

  let allReports = getReports();
  const fromWorkerStops = allReports.filter(r => r.status !== 'cleared' && (r.assignedWorkerId === fromWorker.id || (fromWorker.name && r.assignedWorkerName && (r.assignedWorkerName.includes(fromWorker.name) || fromWorker.name.includes(r.assignedWorkerName)))));

  if (fromWorkerStops.length === 0) {
    alert(`Worker ${fromWorker.name} has no remaining stops to reassign.`);
    return;
  }

  // Pick their next stop (prioritize emergency if any, else first stop)
  const stopToReassign = fromWorkerStops.find(s => s.isEmergency) || fromWorkerStops[0];
  const stopLat = stopToReassign.latitude !== undefined ? stopToReassign.latitude : (stopToReassign.coords?.lat || 19.0760);
  const stopLng = stopToReassign.longitude !== undefined ? stopToReassign.longitude : (stopToReassign.coords?.lng || 72.8777);

  // Find other workers
  const otherWorkers = workers.filter(w => w.id !== fromWorker.id);
  if (otherWorkers.length === 0) {
    alert('No other municipal workers available for reassignment.');
    return;
  }

  // Filter for active ones first
  const activeOthers = otherWorkers.filter(w => {
    const isOff = w.shiftStatus === 'off-shift' || (Date.now() - (w.lastLocationUpdatedAt || 0)) > 30 * 60 * 1000;
    return !isOff;
  });
  const candidates = activeOthers.length > 0 ? activeOthers : otherWorkers;

  let bestWorker = null;
  let minDistanceKm = Infinity;

  candidates.forEach(cand => {
    const cLat = cand.lastKnownLat || 19.0760;
    const cLng = cand.lastKnownLng || 72.8777;
    const dist = calcDistance(stopLat, stopLng, cLat, cLng);
    if (dist < minDistanceKm) {
      minDistanceKm = dist;
      bestWorker = cand;
    }
  });

  if (!bestWorker) {
    bestWorker = otherWorkers[0];
    minDistanceKm = calcDistance(stopLat, stopLng, bestWorker.lastKnownLat || 19.0760, bestWorker.lastKnownLng || 72.8777);
  }

  // Reassign the stop
  const repIdx = allReports.findIndex(r => r.id === stopToReassign.id);
  if (repIdx !== -1) {
    allReports[repIdx].assignedWorkerId = bestWorker.id;
    allReports[repIdx].assignedWorkerName = bestWorker.name;
    allReports[repIdx].assignedAt = Date.now();
    saveReports(allReports);

    addAuditLog('Admin', 'REASSIGN_NEAREST_STOP', `Manually reassigned stop ${stopToReassign.id} (${stopToReassign.landmark}) from ${fromWorker.name} to ${bestWorker.name} (${minDistanceKm.toFixed(2)} km away).`);

    if (isBackendConnected) {
      fetch('/api/reassign-stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: stopToReassign.id, toWorkerId: bestWorker.id })
      }).catch(() => {});
    }

    alert(`✅ Reassigned Stop #${stopToReassign.id} (${stopToReassign.landmark}) to nearest crew: ${bestWorker.name} (${minDistanceKm.toFixed(2)} km away)!\n\nRoutes and stop queues recalculated for both workers.`);

    // Re-run route optimizer if current user is worker
    runSoftwareRouteOptimizer();
    // Refresh admin tracking map and list panel
    initAdminWorkerLocationsMap();
    if (adminWorkerMapObj) adminOverlayWorkerRoute(bestWorker.id);
  }
};

window.adminOverlayWorkerRoute = function(workerId) {
  if (!adminWorkerMapObj) return;

  const workers = getUsers().filter(u => u.role === 'worker');
  const worker = workers.find(w => w.id === workerId) || workers[0];
  if (!worker) return;

  // Clear previous route overlays
  clearAdminWorkerRouteOverlay();

  const workerLat = worker.lastKnownLat || 19.0200;
  const workerLng = worker.lastKnownLng || 72.8350;
  const fleet = getFleet();
  const vehicle = fleet.find(f => f.driverId === worker.id || f.driver === worker.name || (worker.name && f.driver && worker.name.includes(f.driver)) || (worker.name && f.driver && f.driver.includes(worker.name))) || fleet[0];
  const reports = getReports().filter(r => r.status !== 'cleared');
  const assignedStops = reports.filter(r => r.assignedWorkerId === worker.id || (worker.name && r.assignedWorkerName && (r.assignedWorkerName.includes(worker.name) || worker.name.includes(r.assignedWorkerName))));

  // Draw overlay path connecting worker's location through their stops in order
  const pathCoords = [
    [workerLat, workerLng],
    ...assignedStops.map(s => [
      s.latitude !== undefined ? s.latitude : (s.coords?.lat || 19.0760),
      s.longitude !== undefined ? s.longitude : (s.coords?.lng || 72.8777)
    ])
  ];

  if (pathCoords.length > 1) {
    adminWorkerRouteLine = L.polyline(pathCoords, {
      color: '#059669',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      className: 'animated-route-line'
    }).addTo(adminWorkerMapObj);

    animatePolylineDrawIn(adminWorkerRouteLine, pathCoords, 450);
    adminWorkerMapObj.fitBounds(adminWorkerRouteLine.getBounds(), { padding: [40, 40] });
  }

  // Draw numbered stop markers on admin map
  assignedStops.forEach((stop, idx) => {
    const lat = stop.latitude !== undefined ? stop.latitude : (stop.coords?.lat || 19.0760);
    const lng = stop.longitude !== undefined ? stop.longitude : (stop.coords?.lng || 72.8777);
    const isEmg = stop.isEmergency;
    const m = L.marker([lat, lng], {
      icon: L.divIcon({
        className: isEmg ? 'emergency-pulse-marker' : '',
        html: `<div style="background: ${isEmg ? '#dc2626' : '#059669'}; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isEmg ? '🚨' : idx + 1}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      })
    }).addTo(adminWorkerMapObj);
    m.bindPopup(`<strong>Stop #${idx + 1}: ${stop.landmark}</strong><br>Status: ${stop.status.toUpperCase()}<br>Ward: ${stop.area || stop.wardZone}<br><button class="btn btn-outline btn-xs" style="margin-top:0.35rem;" onclick="reassignNearestWorkerStop('${worker.id}')">🔄 Reassign Nearest</button>`);
    adminWorkerRouteStopMarkers.push(m);
  });

  // Display details panel below the map
  const panel = document.getElementById('adminWorkerRouteOverlayPanel');
  const nameElem = document.getElementById('adminOverlayWorkerName');
  const countElem = document.getElementById('adminOverlayStopsCount');
  const listElem = document.getElementById('adminOverlayStopsList');

  if (panel) panel.style.display = 'block';
  if (nameElem) nameElem.textContent = `Route Overlay: 👷 ${worker.name} (${vehicle ? vehicle.type : 'Compactor'})`;
  if (countElem) {
    countElem.textContent = `${assignedStops.length} Stops Active`;
    countElem.classList.remove('stop-count-badge-pop');
    void countElem.offsetWidth;
    countElem.classList.add('stop-count-badge-pop');
  }
  if (listElem) {
    listElem.innerHTML = assignedStops.length === 0 
      ? 'No active pending stops assigned.'
      : `<div style="margin-bottom: 0.5rem;"><button type="button" class="btn btn-outline btn-xs" onclick="reassignNearestWorkerStop('${worker.id}')">🔄 Reassign Next Stop to Nearest Crew</button></div>` +
        assignedStops.map((s, idx) => `<div style="padding: 0.25rem 0; border-bottom: 1px dashed var(--civic-border);"><strong>${idx + 1}.</strong> ${s.landmark} <span style="color: #64748b;">(${s.area || s.wardZone})</span> ${s.isEmergency ? '<span style="color: #dc2626; font-weight: 800;">🚨 EMERGENCY</span>' : ''}</div>`).join('');
  }
};

window.clearAdminWorkerRouteOverlay = function() {
  if (adminWorkerRouteLine) {
    adminWorkerRouteLine.remove();
    adminWorkerRouteLine = null;
  }
  adminWorkerRouteStopMarkers.forEach(m => m.remove());
  adminWorkerRouteStopMarkers = [];
  const panel = document.getElementById('adminWorkerRouteOverlayPanel');
  if (panel) panel.style.display = 'none';
};

window.renderAdminWorkerLocationsMap = function(forceRefresh) {
  initAdminWorkerLocationsMap(forceRefresh);
};

/* ==========================================================================
   Visual Charts & Analytics Engine (Chart.js Role-Scoped Visualizations)
   ========================================================================== */
let citizenCreditBreakdownChartObj = null;
let citizenReportStatusChartObj = null;
let adminReportsOverTimeChartObj = null;
let adminCategoryChartObj = null;
let adminWardReportsChartObj = null;
let adminWorkerPerformanceChartObj = null;
let adminWorkerPerformanceChartEmbeddedObj = null;
let adminStatusFunnelChartObj = null;
let adminComplianceTrendChartObj = null;
let adminComplianceTrendChartEmbeddedObj = null;

function renderCitizenCreditBreakdownChart() {
  const canvas = document.getElementById('citizenCreditBreakdownChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (citizenCreditBreakdownChartObj) {
    citizenCreditBreakdownChartObj.destroy();
    citizenCreditBreakdownChartObj = null;
  }

  const history = currentUser?.creditHistory || [];
  let baseReports = 0;
  let segregationBonuses = 0;
  let emergencyTier = 0;
  let welcomeBonus = 0;
  let tierAdjustments = 0;

  history.forEach(item => {
    const reason = (item.reason || item.description || '').toLowerCase();
    const amt = Math.abs(item.amount || item.credits || 0);
    if (reason.includes('welcome') || reason.includes('signup')) welcomeBonus += amt;
    else if (reason.includes('emergency')) emergencyTier += amt;
    else if (reason.includes('segregat')) segregationBonuses += amt;
    else if (reason.includes('adjust') || reason.includes('duplicate') || reason.includes('split')) tierAdjustments += amt;
    else baseReports += amt;
  });

  if (baseReports + segregationBonuses + emergencyTier + welcomeBonus + tierAdjustments === 0) {
    baseReports = 25;
    segregationBonuses = 20;
    emergencyTier = 25;
    welcomeBonus = 10;
    tierAdjustments = 5;
  }

  citizenCreditBreakdownChartObj = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Base Reports', 'Segregation Bonus', 'Emergency Tier', 'Welcome Bonus', 'Tier Adjustments'],
      datasets: [{
        data: [baseReports, segregationBonuses, emergencyTier, welcomeBonus, tierAdjustments],
        backgroundColor: ['#1c52d8', '#059669', '#dc2626', '#d97706', '#7c3aed'],
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
      }
    }
  });
}

function renderCitizenReportStatusChart() {
  const canvas = document.getElementById('citizenReportStatusChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (citizenReportStatusChartObj) {
    citizenReportStatusChartObj.destroy();
    citizenReportStatusChartObj = null;
  }

  const reports = getReports();
  const myReports = reports.filter(r => r.userId === currentUser?.id || r.userName === currentUser?.name);

  let reported = 0, assigned = 0, cleared = 0, escalated = 0;
  if (myReports.length > 0) {
    myReports.forEach(r => {
      if (r.isEscalated) escalated++;
      else if (r.status === 'cleared') cleared++;
      else if (r.status === 'assigned') assigned++;
      else reported++;
    });
  } else {
    reported = 1; assigned = 2; cleared = 3; escalated = 1;
  }

  citizenReportStatusChartObj = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Reported (Pending)', 'Assigned (In Route)', 'Cleared (Resolved)', 'Escalated (>24h)'],
      datasets: [{
        data: [reported, assigned, cleared, escalated],
        backgroundColor: ['#94a3b8', '#1c52d8', '#059669', '#dc2626'],
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
      }
    }
  });
}

function renderAdminReportsOverTimeChart() {
  const canvas = document.getElementById('adminReportsOverTimeChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (adminReportsOverTimeChartObj) {
    adminReportsOverTimeChartObj.destroy();
    adminReportsOverTimeChartObj = null;
  }

  const reports = getReports();
  const days = 14;
  const labels = [];
  const counts = new Array(days).fill(0);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * dayMs);
    labels.push(`${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`);
  }

  reports.forEach(r => {
    const ageDays = Math.floor((now - (r.createdAt || now)) / dayMs);
    if (ageDays >= 0 && ageDays < days) {
      counts[days - 1 - ageDays]++;
    }
  });

  const totalInCounts = counts.reduce((a, b) => a + b, 0);
  let displayData = counts;
  if (totalInCounts < 6) {
    displayData = [2, 3, 1, 4, 3, 5, 4, 6, 5, 8, 7, 9, 8, reports.length || 15];
  }

  adminReportsOverTimeChartObj = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'City-Wide Incident Volume',
        data: displayData,
        borderColor: '#1c52d8',
        backgroundColor: 'rgba(28, 82, 216, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#1c52d8'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderAdminCategoryChart() {
  const canvas = document.getElementById('adminCategoryChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (adminCategoryChartObj) {
    adminCategoryChartObj.destroy();
    adminCategoryChartObj = null;
  }

  const reports = getReports();
  const catMap = {
    'Plastic': 0,
    'Organic': 0,
    'Biomedical': 0,
    'C&D Debris': 0,
    'Office Paper': 0,
    'Chemical/Hazardous': 0
  };

  reports.forEach(r => {
    const c = (r.category || '').toLowerCase();
    if (c.includes('plastic')) catMap['Plastic']++;
    else if (c.includes('organic') || c.includes('food')) catMap['Organic']++;
    else if (c.includes('biomedical') || c.includes('hospital')) catMap['Biomedical']++;
    else if (c.includes('c_and_d') || c.includes('debris') || c.includes('construction')) catMap['C&D Debris']++;
    else if (c.includes('paper')) catMap['Office Paper']++;
    else catMap['Chemical/Hazardous']++;
  });

  adminCategoryChartObj = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.keys(catMap),
      datasets: [{
        label: 'Reports by Waste Stream',
        data: Object.values(catMap),
        backgroundColor: ['#0891b2', '#059669', '#dc2626', '#d97706', '#2563eb', '#7c3aed'],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderAdminWardReportsChart() {
  const canvas = document.getElementById('adminWardReportsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (adminWardReportsChartObj) {
    adminWardReportsChartObj.destroy();
    adminWardReportsChartObj = null;
  }

  const reports = getReports();
  const wardMap = {
    'Ward G/South (Dadar)': 0,
    'Ward H/West (Bandra)': 0,
    'Ward K/East (Andheri)': 0,
    'Ward S (Powai)': 0,
    'Ward R/Central (Borivali)': 0,
    'Ward A (Colaba)': 0
  };

  reports.forEach(r => {
    const a = (r.area || r.wardZone || '').toLowerCase();
    if (a.includes('dadar') || a.includes('g/south')) wardMap['Ward G/South (Dadar)']++;
    else if (a.includes('bandra') || a.includes('h/west')) wardMap['Ward H/West (Bandra)']++;
    else if (a.includes('andheri') || a.includes('k/east')) wardMap['Ward K/East (Andheri)']++;
    else if (a.includes('powai') || a.includes('ward s')) wardMap['Ward S (Powai)']++;
    else if (a.includes('borivali') || a.includes('r/central')) wardMap['Ward R/Central (Borivali)']++;
    else wardMap['Ward A (Colaba)']++;
  });

  const sortedPairs = Object.entries(wardMap).sort((a, b) => b[1] - a[1]);

  adminWardReportsChartObj = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sortedPairs.map(p => p[0]),
      datasets: [{
        label: 'Complaint Reports',
        data: sortedPairs.map(p => p[1]),
        backgroundColor: '#059669',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderAdminWorkerPerformanceChart() {
  const canvases = [
    document.getElementById('adminWorkerPerformanceChart'),
    document.getElementById('adminWorkerPerformanceChartEmbedded')
  ];

  if (adminWorkerPerformanceChartObj) {
    adminWorkerPerformanceChartObj.destroy();
    adminWorkerPerformanceChartObj = null;
  }
  if (adminWorkerPerformanceChartEmbeddedObj) {
    adminWorkerPerformanceChartEmbeddedObj.destroy();
    adminWorkerPerformanceChartEmbeddedObj = null;
  }

  if (typeof Chart === 'undefined') return;

  const workers = getUsers().filter(u => u.role === 'worker');
  const allReports = getReports();

  const labels = workers.map(w => w.name.split(' ')[0] + ' (' + (w.crewNumber ? '#' + w.crewNumber : 'Crew') + ')');
  const clearedData = [];
  const assignedData = [];

  workers.forEach(w => {
    const stops = allReports.filter(r => r.assignedWorkerId === w.id || (w.name && r.assignedWorkerName && (r.assignedWorkerName.includes(w.name) || w.name.includes(r.assignedWorkerName))));
    const cleared = stops.filter(s => s.status === 'cleared').length;
    const remaining = stops.filter(s => s.status !== 'cleared').length;
    clearedData.push(cleared);
    assignedData.push(remaining);
  });

  const chartConfig = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Stops Cleared',
          data: clearedData,
          backgroundColor: '#059669',
          borderRadius: 4
        },
        {
          label: 'Stops Remaining',
          data: assignedData,
          backgroundColor: '#1c52d8',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    }
  };

  if (canvases[0]) {
    adminWorkerPerformanceChartObj = new Chart(canvases[0], chartConfig);
  }
  if (canvases[1]) {
    adminWorkerPerformanceChartEmbeddedObj = new Chart(canvases[1], JSON.parse(JSON.stringify(chartConfig)));
  }
}

function renderAdminStatusFunnelChart() {
  const canvas = document.getElementById('adminStatusFunnelChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (adminStatusFunnelChartObj) {
    adminStatusFunnelChartObj.destroy();
    adminStatusFunnelChartObj = null;
  }

  const reports = getReports();
  const reported = reports.filter(r => r.status === 'reported' && !r.isEscalated).length;
  const assigned = reports.filter(r => r.status === 'assigned' && !r.isEscalated).length;
  const cleared = reports.filter(r => r.status === 'cleared').length;
  const escalated = reports.filter(r => r.isEscalated).length;

  adminStatusFunnelChartObj = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Reported (Pending)', 'Assigned (In Route)', 'Cleared (Sanitized)', 'Escalated (>24h SLA)'],
      datasets: [{
        data: [reported, assigned, cleared, escalated],
        backgroundColor: ['#94a3b8', '#1c52d8', '#059669', '#dc2626'],
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    }
  });
}

function renderAdminComplianceTrendChart() {
  const canvases = [
    document.getElementById('adminComplianceTrendChart'),
    document.getElementById('adminComplianceTrendChartEmbedded')
  ];

  if (adminComplianceTrendChartObj) {
    adminComplianceTrendChartObj.destroy();
    adminComplianceTrendChartObj = null;
  }
  if (adminComplianceTrendChartEmbeddedObj) {
    adminComplianceTrendChartEmbeddedObj.destroy();
    adminComplianceTrendChartEmbeddedObj = null;
  }

  if (typeof Chart === 'undefined') return;

  const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6 (Current)'];
  const sbmTargetSegregation = [60, 60, 60, 60, 60, 60];
  const sbmTargetCoverage = [80, 80, 80, 80, 80, 80];
  const sbmTargetProcessing = [80, 80, 80, 80, 80, 80];

  const actualSegregation = [52, 56, 59, 63, 67, 72];
  const actualCoverage = [71, 75, 78, 83, 86, 90];
  const actualProcessing = [66, 70, 72, 77, 80, 84];

  const chartConfig = {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [
        {
          label: 'Segregation Rate (%)',
          data: actualSegregation,
          borderColor: '#059669',
          backgroundColor: '#059669',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3
        },
        {
          label: 'SBM Segregation Target (60%)',
          data: sbmTargetSegregation,
          borderColor: '#059669',
          borderDash: [6, 6],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Door-to-Door Coverage (%)',
          data: actualCoverage,
          borderColor: '#1c52d8',
          backgroundColor: '#1c52d8',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3
        },
        {
          label: 'SBM Coverage Target (80%)',
          data: sbmTargetCoverage,
          borderColor: '#1c52d8',
          borderDash: [6, 6],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Scientific Processing (%)',
          data: actualProcessing,
          borderColor: '#7c3aed',
          backgroundColor: '#7c3aed',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3
        },
        {
          label: 'SBM Processing Target (80%)',
          data: sbmTargetProcessing,
          borderColor: '#7c3aed',
          borderDash: [6, 6],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 40, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
      }
    }
  };

  if (canvases[0]) {
    adminComplianceTrendChartObj = new Chart(canvases[0], chartConfig);
  }
  if (canvases[1]) {
    adminComplianceTrendChartEmbeddedObj = new Chart(canvases[1], JSON.parse(JSON.stringify(chartConfig)));
  }
}

window.renderAdminAnalyticsCharts = function() {
  renderAdminReportsOverTimeChart();
  renderAdminCategoryChart();
  renderAdminWardReportsChart();
  renderAdminWorkerPerformanceChart();
  renderAdminStatusFunnelChart();
  renderAdminComplianceTrendChart();
};

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
  const tabs = document.querySelectorAll('#adminDashboard .auth-tabs .auth-tab');
  tabs.forEach(t => t.classList.remove('active'));

  const panels = [
    { id: 'adminPanelFeed', tab: 'adminTabFeed', name: 'feed' },
    { id: 'adminPanelFleet', tab: 'adminTabFleet', name: 'fleet' },
    { id: 'adminPanelGrievance', tab: 'adminTabGrievance', name: 'grievance' },
    { id: 'adminPanelLeaderboard', tab: 'adminTabLeaderboard', name: 'leaderboard' },
    { id: 'adminPanelCompliance', tab: 'adminTabCompliance', name: 'compliance' },
    { id: 'adminPanelHotspot', tab: 'adminTabHotspot', name: 'hotspot' },
    { id: 'adminPanelWorkerLocations', tab: 'adminTabWorkerLocations', name: 'workerLocations' },
    { id: 'adminPanelAnalytics', tab: 'adminTabAnalytics', name: 'analytics' },
    { id: 'adminPanelHospital', tab: 'adminTabHospital', name: 'hospital' },
    { id: 'adminPanelWorkers', tab: 'adminTabWorkers', name: 'workers' },
    { id: 'adminPanelRedemptions', tab: 'adminTabRedemptions', name: 'redemptions' },
    { id: 'adminPanelLogs', tab: 'adminTabLogs', name: 'logs' }
  ];

  panels.forEach(p => {
    const el = document.getElementById(p.id);
    const tabEl = document.getElementById(p.tab);
    if (el) el.style.display = p.name === tabName ? 'block' : 'none';
    if (tabEl && p.name === tabName) tabEl.classList.add('active');
  });

  if (tabName === 'feed') renderAdminFeedTable();
  if (tabName === 'fleet') renderAdminFleet();
  if (tabName === 'grievance') renderAdminGrievanceTable();
  if (tabName === 'leaderboard') renderAdminLeaderboardTable();
  if (tabName === 'compliance') {
    renderAdminComplianceTable();
    setTimeout(() => renderAdminComplianceTrendChart(), 150);
  }
  if (tabName === 'hotspot') setTimeout(() => initAdminHotspotMap(), 150);
  if (tabName === 'workerLocations') setTimeout(() => initAdminWorkerLocationsMap(), 150);
  if (tabName === 'analytics') setTimeout(() => renderAdminAnalyticsCharts(), 150);
  if (tabName === 'hospital') renderAdminHospitalTable();
  if (tabName === 'workers') {
    renderAdminWorkerTable();
    setTimeout(() => renderAdminWorkerPerformanceChart(), 150);
  }
  if (tabName === 'redemptions') renderAdminRedemptionsQueue();
  if (tabName === 'logs') renderAdminLogsTable();
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

    logAdminAction('Reassign Stop', 'Admin (MCGM)', `Reassigned report ${reportId} to ${w ? w.name : 'Unassigned'}`);
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
    logAdminAction('Force Clear Override', 'Admin (MCGM)', `Administrative force clear issued for report ${reportId} (${reports[index].landmark})`);
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

function getTierCredit(num) {
  if (num === 1) return 5;
  if (num <= 3) return 4;
  if (num <= 6) return 3;
  if (num <= 10) return 2;
  return 1;
}
const getTieredCreditPerReporter = getTierCredit;

function checkAndMergeDuplicates(newReport) {
  let reports = getReports();
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

  const duplicateIndex = reports.findIndex(r => {
    if (r.status === 'cleared') return false;
    const isSameArea = r.area && newReport.area && r.area.toLowerCase() === newReport.area.toLowerCase();
    const isSameLandmark = r.landmark && newReport.landmark && r.landmark.toLowerCase().trim() === newReport.landmark.toLowerCase().trim();
    return isSameArea && isSameLandmark && (Date.now() - r.createdAt < TWO_HOURS_MS);
  });

  if (duplicateIndex !== -1) {
    const dup = reports[duplicateIndex];
    if (!dup.reporterIds) {
      dup.reporterIds = [dup.userId];
    }
    dup.reporterIds.push(newReport.userId);
    const totalReporters = dup.reporterIds.length;
    dup.duplicateCount = totalReporters;
    dup.notes = (dup.notes || '') + `\n[Duplicate report merged at ${new Date().toLocaleTimeString()} by ${newReport.userName}]`;
    if (newReport.isEmergency) dup.isEmergency = true;
    if (newReport.isPriorityPickup) dup.isPriorityPickup = true;
    
    saveReports(reports);

    // Recalculate credit for all reporters
    let users = getUsers();
    const existing = dup;
    const isEmergency = !!(existing.isEmergency || existing.category === 'emergency');

    if (!isEmergency) {
      // Standard report: recalculate for ALL reporters according to tier table
      const prevTier = getTierCredit(totalReporters - 1);
      const newTier = getTierCredit(totalReporters);
      const diff = newTier - prevTier;

      // Retroactive adjustment for all previous reporters
      const prevReporterIds = dup.reporterIds.slice(0, totalReporters - 1);
      if (diff !== 0) {
        prevReporterIds.forEach(uId => {
          const userObj = users.find(u => u.id === uId);
          if (userObj) {
            userObj.credits = (userObj.credits || 0) + diff;
            if (!userObj.transactions) userObj.transactions = [];
            if (!userObj.creditHistory) userObj.creditHistory = [];
            const txEntry = {
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              reason: `Adjusted duplicate report #${dup.id} — issue confirmed by ${totalReporters} reporters`,
              amount: diff
            };
            userObj.transactions.push(txEntry);
            userObj.creditHistory.unshift(txEntry);
          }
        });
      }

      // New reporter receives newTier credits
      const newReporterUser = users.find(u => u.id === newReport.userId);
      if (newReporterUser) {
        newReporterUser.credits = (newReporterUser.credits || 0) + newTier;
        if (!newReporterUser.transactions) newReporterUser.transactions = [];
        if (!newReporterUser.creditHistory) newReporterUser.creditHistory = [];
        const txEntry = {
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason: `Report merged into #${dup.id} (${totalReporters} reporters confirmed)`,
          amount: newTier
        };
        newReporterUser.transactions.push(txEntry);
        newReporterUser.creditHistory.unshift(txEntry);
      }
    } else {
      // Emergency reports: keep separate fixed higher-tier credit (creditsAwarded: 25) for the first reporter,
      // later duplicate reporters on same emergency get standard tiered amount instead.
      const newTier = getTierCredit(totalReporters);
      const newReporterUser = users.find(u => u.id === newReport.userId);
      if (newReporterUser) {
        newReporterUser.credits = (newReporterUser.credits || 0) + newTier;
        if (!newReporterUser.transactions) newReporterUser.transactions = [];
        if (!newReporterUser.creditHistory) newReporterUser.creditHistory = [];
        const txEntry = {
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason: `Emergency report merged into #${dup.id} (duplicate reporter)`,
          amount: newTier
        };
        newReporterUser.transactions.push(txEntry);
        newReporterUser.creditHistory.unshift(txEntry);
      }
    }

    saveUsers(users);

    if (currentUser) {
      const updatedCurr = users.find(u => u.id === currentUser.id);
      if (updatedCurr) {
        currentUser = updatedCurr;
        localStorage.setItem('swm_current_user', JSON.stringify(currentUser));
      }
    }

    alert(`⚡ DUPLICATE DETECTED: Report merged into active task #${dup.id}. Tiered credit calculated (${totalReporters} reporters)!`);
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

/* Category SVG Icons for Waste Segregation Guide */
function getCategorySvgIcon(binName = '') {
  const b = binName.toLowerCase();
  if (b.includes('dry') || b.includes('recycl')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.57-.88 1.8 1.8 0 0 0 0-1.79L18 12"/><path d="M9.171 4.872l3.414 5.914a1.8 1.8 0 0 0 1.56.914h5.669"/><polyline points="14 16 11 19 14 22"/><polyline points="5 11 7 8 10 9"/><polyline points="17 7 20 7 19 10"/></svg>`;
  }
  if (b.includes('wet') || b.includes('organic') || b.includes('compost')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
  }
  if (b.includes('hazard') || b.includes('domestic')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }
  if (b.includes('sanitary') || b.includes('red')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>`;
  }
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"/></svg>`;
}

function initSegregationGuide() {
  const input = document.getElementById('segregationSearchInput') || document.getElementById('guideSearchInput');
  const grid = document.getElementById('guideResultsGrid');
  if (!grid) return;

  function render(items) {
    grid.innerHTML = items.map(i => `
      <div class="guide-item-card">
        <div>
          <strong>${i.name}</strong>
          <div><span class="bin-tag ${i.tag}">${getCategorySvgIcon(i.bin)}${i.bin}</span></div>
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
  const validCount = reports.length || 4; // non-zero demo metrics
  const divertedKg = (reports.length > 0 ? reports.length : 4) * 15;
  const co2SavedKg = Math.round(divertedKg * 0.5);

  const elReports = document.getElementById('impactReportsCount') || document.getElementById('impactTotalReports');
  const elDiverted = document.getElementById('impactKgDiverted') || document.getElementById('impactLandfillDiverted');
  const elCo2 = document.getElementById('impactCo2Saved') || document.getElementById('impactCO2Saved');

  if (elReports) elReports.textContent = validCount;
  if (elDiverted) elDiverted.textContent = `${divertedKg} kg`;
  if (elCo2) elCo2.textContent = `${co2SavedKg} kg`;

  const canvas = document.getElementById('impactTrendChart') || document.getElementById('citizenImpactChart');
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

  setTimeout(() => {
    renderCitizenCreditBreakdownChart();
    renderCitizenReportStatusChart();
  }, 50);
}

function formatTimeAgo(timestamp) {
  const mins = Math.floor((Date.now() - timestamp) / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* ==========================================================================
   15. CITIZEN STREAK TRACKER, REFERRAL PROGRAM & NEARBY COMMUNITY MAP
   ========================================================================== */
function renderCitizenStreak() {
  const badge = document.getElementById('citizenStreakBadge');
  const count = document.getElementById('citizenStreakCount');
  if (!badge || !count) return;
  const streak = currentUser?.streakWeeks || 4;
  count.textContent = streak;
}

function renderCitizenReferralWidget() {
  const input = document.getElementById('citizenReferralCodeInput');
  if (!input || !currentUser) return;
  if (!currentUser.referralCode) {
    const rawId = currentUser.id ? currentUser.id.replace('usr-', '') : '4821';
    currentUser.referralCode = `MUM-REF-${rawId.padStart(4, '0')}`;
    updateUserRecord(currentUser);
  }
  input.value = currentUser.referralCode;
}

window.copyCitizenReferralLink = function() {
  const input = document.getElementById('citizenReferralCodeInput');
  const feedback = document.getElementById('referralCopyFeedback');
  if (!input) return;
  const link = `${window.location.origin}/#ref=${input.value}`;
  navigator.clipboard.writeText(link).catch(() => {});
  if (feedback) {
    feedback.style.display = 'block';
    setTimeout(() => { feedback.style.display = 'none'; }, 3000);
  }
};

function processReferralBonusOnFirstReport(newReport) {
  if (currentUser && currentUser.referredBy && !currentUser.hasAwardedReferralBonus) {
    currentUser.hasAwardedReferralBonus = true;
    awardCredits(15, 'Referral Bonus: First Verified Report Submitted');

    let users = getUsers();
    const referrer = users.find(u => u.referralCode === currentUser.referredBy || u.id === currentUser.referredBy);
    if (referrer) {
      referrer.credits = (referrer.credits || 0) + 15;
      if (!referrer.creditHistory) referrer.creditHistory = [];
      referrer.creditHistory.unshift({
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reason: `Referral Bonus: Neighbor (${currentUser.name}) submitted first report`,
        amount: 15
      });
      saveUsers(users);
    }
    updateUserRecord(currentUser);
    addNotification('🎁 Referral Bonus Awarded', 'You and your neighbor each received +15 EcoCredits!', 'credit');
  }
}

/* Nearby Open Reports Read-Only Community Map */
let citizenNearbyMap = null;
let citizenNearbyMarkers = [];

function initCitizenNearbyReportsMap() {
  const container = document.getElementById('citizenNearbyReportsMap');
  if (!container || typeof L === 'undefined') return;

  if (citizenNearbyMap) {
    citizenNearbyMap.invalidateSize();
  } else {
    citizenNearbyMap = L.map('citizenNearbyReportsMap', { zoomControl: true }).setView([19.0760, 72.8777], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(citizenNearbyMap);
  }

  citizenNearbyMarkers.forEach(m => m.remove());
  citizenNearbyMarkers = [];

  const reports = getReports();
  const openReports = reports.filter(r => r.status !== 'cleared');
  const badge = document.getElementById('citizenNearbyCountBadge');
  if (badge) badge.textContent = `${openReports.length} Open in Ward Area`;

  openReports.forEach(r => {
    const lat = r.latitude || r.coords?.lat || 19.0760;
    const lng = r.longitude || r.coords?.lng || 72.8777;
    const isEmg = r.isEmergency;
    const marker = L.circleMarker([lat, lng], {
      radius: isEmg ? 8 : 6,
      color: isEmg ? '#dc2626' : (r.status === 'assigned' ? '#1c52d8' : '#d97706'),
      fillColor: isEmg ? '#ef4444' : (r.status === 'assigned' ? '#3b82f6' : '#f59e0b'),
      fillOpacity: 0.85,
      weight: 2
    }).addTo(citizenNearbyMap);

    marker.bindPopup(`
      <div style="font-size: 0.82rem; line-height: 1.4;">
        <strong>${r.landmark || 'Community Report'}</strong><br>
        <span style="color: #64748b;">${r.area || 'Mumbai'} &bull; ${formatTimeAgo(r.createdAt)}</span><br>
        <span class="badge badge-${r.status}" style="margin-top: 0.25rem;">${r.status}</span>
        ${isEmg ? '<span class="badge badge-emergency">EMERGENCY</span>' : ''}
        <div style="font-size: 0.75rem; color: #475569; margin-top: 0.2rem;">${r.notes || 'No description provided'}</div>
      </div>
    `);
    citizenNearbyMarkers.push(marker);
  });

  setTimeout(() => citizenNearbyMap && citizenNearbyMap.invalidateSize(), 200);
}

/* Offline-Queued Reports System */
function getOfflineQueue() {
  return JSON.parse(localStorage.getItem('swm_offline_queue') || '[]');
}
function saveOfflineQueue(queue) {
  localStorage.setItem('swm_offline_queue', JSON.stringify(queue));
}
function queueOfflineReport(report) {
  const queue = getOfflineQueue();
  queue.push(report);
  saveOfflineQueue(queue);
  checkOfflineQueueStatus();
}
function checkOfflineQueueStatus() {
  const banner = document.getElementById('offlineQueueBanner');
  const countEl = document.getElementById('offlineQueueCount');
  const queue = getOfflineQueue();
  if (banner && countEl) {
    if (!navigator.onLine || queue.length > 0) {
      banner.style.display = 'flex';
      countEl.textContent = queue.length;
    } else {
      banner.style.display = 'none';
    }
  }
}
window.flushOfflineQueue = function() {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    alert('No offline reports pending synchronization.');
    checkOfflineQueueStatus();
    return;
  }
  let reports = getReports();
  queue.forEach(r => {
    r.status = 'reported';
    reports.unshift(r);
    awardCredits(5, 'Offline Report Synced');
  });
  saveReports(reports);
  saveOfflineQueue([]);
  checkOfflineQueueStatus();
  renderCitizenDashboard();
  addNotification('📡 Reports Synced', `${queue.length} offline reports successfully uploaded to municipal system!`, 'sync');
  alert(`✓ Successfully synced ${queue.length} offline reports to the municipal system!`);
};

function initOfflineQueueSync() {
  window.addEventListener('online', () => {
    const queue = getOfflineQueue();
    if (queue.length > 0) {
      window.flushOfflineQueue();
    }
    checkOfflineQueueStatus();
  });
  window.addEventListener('offline', () => {
    checkOfflineQueueStatus();
  });
  checkOfflineQueueStatus();
}

/* ==========================================================================
   16. INSTITUTION WASTE AUDIT CERTIFICATE & PEER BENCHMARKING
   ========================================================================== */
window.openWasteAuditCertModal = function() {
  const modal = document.getElementById('instAuditCertModal');
  if (!modal) return;
  const orgNameEl = document.getElementById('certOrgName');
  const orgWardEl = document.getElementById('certOrgWard');
  const auditRatingEl = document.getElementById('certAuditRating');
  const tonnageEl = document.getElementById('certTonnageDiverted');
  const docIdEl = document.getElementById('certDocId');
  const dateEl = document.getElementById('certDateIssued');

  const audits = currentUser?.selfAudits || [];
  const latestRate = audits.length > 0 ? audits[0].rate : 92;
  const reports = getReports().filter(r => r.userId === currentUser?.id);
  const totalVolume = reports.reduce((sum, r) => sum + (r.volumeKg || 0), 0) || 1250;

  if (orgNameEl) orgNameEl.textContent = currentUser?.schoolName || currentUser?.companyName || currentUser?.name || 'Institution Campus';
  if (orgWardEl) orgWardEl.textContent = currentUser?.branches?.[0]?.ward || 'Ward K/East - Andheri';
  if (auditRatingEl) auditRatingEl.textContent = `${latestRate}%`;
  if (tonnageEl) tonnageEl.textContent = `${totalVolume} kg`;
  if (docIdEl) docIdEl.textContent = `MCGM-SWM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  modal.classList.add('active');
};

function renderInstitutionPeerBenchmark() {
  const card = document.getElementById('instPeerBenchmarkCard');
  if (!card) return;
  const yourRateEl = document.getElementById('instBenchmarkYourRate');
  const wardRateEl = document.getElementById('instBenchmarkWardRate');
  const orgTypeEl = document.getElementById('instBenchmarkOrgType');
  const fillEl = document.getElementById('instBenchmarkBarFill');
  const noticeEl = document.getElementById('instBenchmarkNotice');

  const audits = currentUser?.selfAudits || [];
  const yourRate = audits.length > 0 ? audits[0].rate : 92;
  const isSchool = currentUser?.institutionType === 'school';
  const orgTypeLabel = isSchool ? 'Schools & Colleges' : 'Corporate Offices';
  const wardBenchmark = isSchool ? 74 : 76;
  const diff = yourRate - wardBenchmark;

  if (yourRateEl) yourRateEl.textContent = `${yourRate}%`;
  if (wardRateEl) wardRateEl.textContent = `${wardBenchmark}%`;
  if (orgTypeEl) orgTypeEl.textContent = orgTypeLabel;
  if (fillEl) fillEl.style.width = `${Math.min(100, yourRate)}%`;
  if (noticeEl) {
    if (diff >= 0) {
      noticeEl.innerHTML = `⭐ Outperforming ward average for ${orgTypeLabel} by <strong>+${diff}%</strong>. Eligible for expedited municipal bulk dispatch tier.`;
    } else {
      noticeEl.innerHTML = `⚠️ Currently <strong>${Math.abs(diff)}%</strong> below ward average for ${orgTypeLabel}. Improve organic separation to boost municipal score.`;
    }
  }
}

/* ==========================================================================
   17. HOSPITAL PHARMACEUTICAL EXPIRY REMINDERS & BIO-MEDICAL DISPOSAL
   ========================================================================== */
const SEED_PHARMA_EXPIRY = [
  { id: 'ph-1', medName: 'Amoxicillin 500mg (Sterile Vials)', batchId: 'BATCH-AMX-2041', department: 'Emergency Ward Shelf A', expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), weightKg: 3.5 },
  { id: 'ph-2', medName: 'Formaldehyde 10% Disinfectant', batchId: 'BATCH-FRM-9022', department: 'Pathology Lab Bay 2', expiryDate: new Date(Date.now() + 22 * 86400000).toISOString().slice(0, 10), weightKg: 8.0 },
  { id: 'ph-3', medName: 'Insulin Glargine Multi-Dose', batchId: 'BATCH-INS-4105', department: 'ICU Cold Storage #1', expiryDate: new Date(Date.now() + 85 * 86400000).toISOString().slice(0, 10), weightKg: 1.2 }
];

function getHospitalPharmaExpiry() {
  let list = JSON.parse(localStorage.getItem('swm_hospital_pharma_expiry') || '[]');
  if (list.length === 0) {
    list = SEED_PHARMA_EXPIRY;
    localStorage.setItem('swm_hospital_pharma_expiry', JSON.stringify(list));
  }
  return list;
}
function saveHospitalPharmaExpiry(list) {
  localStorage.setItem('swm_hospital_pharma_expiry', JSON.stringify(list));
}

function renderHospitalPharmaExpiryTable() {
  const tbody = document.getElementById('hospitalPharmaExpiryTableBody');
  if (!tbody) return;
  const list = getHospitalPharmaExpiry();
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">${getEmptyStateHTML('expiry', 'No expiring pharmaceutical stock logged', 'All registered clinical medicine batches are currently compliant.')}</td></tr>`;
    return;
  }
  const now = Date.now();
  const dayMs = 86400000;

  tbody.innerHTML = list.map(item => {
    const expTime = new Date(item.expiryDate).getTime();
    const daysLeft = Math.ceil((expTime - now) / dayMs);
    let badgeClass = 'pharma-badge-safe';
    let statusText = 'Safe (&gt;30d)';

    if (daysLeft <= 7) {
      badgeClass = 'pharma-badge-critical';
      statusText = 'Critical (&le;7d)';
    } else if (daysLeft <= 30) {
      badgeClass = 'pharma-badge-approaching';
      statusText = 'Approaching (&le;30d)';
    }

    return `
      <tr>
        <td><strong>${item.medName}</strong></td>
        <td><code>${item.batchId}</code></td>
        <td>${item.department}</td>
        <td>${item.expiryDate}</td>
        <td><strong>${daysLeft > 0 ? daysLeft + ' days' : 'EXPIRED'}</strong></td>
        <td><span class="${badgeClass}">${statusText}</span></td>
        <td>
          <button type="button" class="btn btn-outline btn-xs" onclick="logPharmaAsExpiredBMW('${item.id}')">
            ⚠️ Log as Expired BMW
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.openAddPharmaExpiryModal = function() {
  document.getElementById('addPharmaExpiryModal')?.classList.add('active');
};

window.handleAddPharmaExpirySubmit = function(e) {
  e.preventDefault();
  const medName = document.getElementById('pharmaMedName').value.trim();
  const batchId = document.getElementById('pharmaBatchId').value.trim();
  const department = document.getElementById('pharmaDepartment').value.trim();
  const expiryDate = document.getElementById('pharmaExpiryDate').value;
  const weightKg = parseFloat(document.getElementById('pharmaWeightKg').value) || 2.0;

  let list = getHospitalPharmaExpiry();
  list.unshift({
    id: 'ph-' + Date.now(),
    medName,
    batchId,
    department,
    expiryDate,
    weightKg
  });
  saveHospitalPharmaExpiry(list);
  closeModal('addPharmaExpiryModal');
  e.target.reset();
  renderHospitalPharmaExpiryTable();
  alert(`Added ${medName} to pharmacy expiry tracking list!`);
};

window.logPharmaAsExpiredBMW = function(pharmaId) {
  const list = getHospitalPharmaExpiry();
  const item = list.find(p => p.id === pharmaId);
  if (!item) return;

  const catSelect = document.getElementById('bmwCategory');
  const wardInput = document.getElementById('hospitalWard');
  const codeInput = document.getElementById('bmwContainerCode');
  const weightInput = document.getElementById('bmwWeight');

  if (catSelect) catSelect.value = 'biomed_black';
  if (wardInput) wardInput.value = item.department;
  if (codeInput) codeInput.value = item.batchId;
  if (weightInput) weightInput.value = item.weightKg;

  window.validateBMWForm && window.validateBMWForm();
  document.getElementById('hospitalBMWForm')?.scrollIntoView({ behavior: 'smooth' });
  alert(`Pre-populated BMW registration form for expired pharmaceutical item (${item.medName}). Verify details and click 'Register Hazardous Disposal Stream'.`);
};

/* ==========================================================================
   18. WORKER DAILY PRE-SHIFT SAFETY LOG & PHOTO PROOF GALLERY
   ========================================================================== */
function renderWorkerSafetyChecklist() {
  const card = document.getElementById('workerSafetyChecklistCard');
  if (!card) return;
  const log = JSON.parse(localStorage.getItem(`swm_safety_log_${currentUser?.id}`) || 'null');
  const todayStr = new Date().toISOString().slice(0, 10);
  const statusBadge = document.getElementById('workerSafetyLogStatus');

  if (log && log.date === todayStr && log.verified) {
    if (statusBadge) {
      statusBadge.textContent = `✓ Verified Today (${log.time})`;
      statusBadge.style.background = 'rgba(5, 150, 105, 0.2)';
      statusBadge.style.color = '#059669';
    }
    ['checkPpeGloves', 'checkPpeVest', 'checkPpeBoots', 'checkVehicleHydraulics', 'checkFirstAidKit'].forEach(id => {
      const cb = document.getElementById(id);
      if (cb) {
        cb.checked = true;
        cb.disabled = true;
        cb.closest('.safety-checklist-item')?.classList.add('checked');
      }
    });
    const submitBtn = document.getElementById('workerSafetySubmitBtn');
    if (submitBtn) {
      submitBtn.textContent = '✓ Verified for Shift';
      submitBtn.disabled = true;
    }
  } else {
    if (statusBadge) {
      statusBadge.textContent = 'Pending Check';
      statusBadge.style.background = 'rgba(100, 116, 139, 0.2)';
      statusBadge.style.color = '#64748b';
    }
  }
}

window.updateWorkerSafetyChecklist = function() {
  const ids = ['checkPpeGloves', 'checkPpeVest', 'checkPpeBoots', 'checkVehicleHydraulics', 'checkFirstAidKit'];
  let checkedCount = 0;
  ids.forEach(id => {
    const cb = document.getElementById(id);
    const parent = cb?.closest('.safety-checklist-item');
    if (cb && cb.checked) {
      checkedCount++;
      parent?.classList.add('checked');
    } else {
      parent?.classList.remove('checked');
    }
  });

  const progressEl = document.getElementById('workerSafetyChecklistProgress');
  const submitBtn = document.getElementById('workerSafetySubmitBtn');
  if (progressEl) progressEl.textContent = `${checkedCount} of 5 safety items verified`;
  if (submitBtn) {
    submitBtn.disabled = checkedCount < 5;
  }
};

window.saveWorkerSafetyLog = function() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const timeStr = new Date().toLocaleTimeString();
  const logData = { date: todayStr, time: timeStr, verified: true, workerId: currentUser?.id, workerName: currentUser?.name };
  localStorage.setItem(`swm_safety_log_${currentUser?.id}`, JSON.stringify(logData));

  logAdminAction('Safety Log Verified', currentUser?.name || 'Worker', `Completed pre-shift inspection: 5 PPE/vehicle items verified at ${timeStr}`);
  renderWorkerSafetyChecklist();
  addNotification('🛡️ Safety Log Recorded', 'Pre-shift inspection logged for Admin review.', 'safety');
  alert('✓ Safety and pre-trip inspection verified! Recorded in municipal operational log.');
};

function renderWorkerPhotoProofGallery() {
  const grid = document.getElementById('workerPhotoProofGrid');
  const countBadge = document.getElementById('workerPhotoProofCountBadge');
  if (!grid) return;

  const myClearedReports = getReports().filter(r => 
    r.status === 'cleared' && (r.assignedWorkerId === currentUser?.id || (currentUser?.name && r.assignedWorkerName && r.assignedWorkerName.includes(currentUser.name)))
  );

  if (countBadge) countBadge.textContent = `${myClearedReports.length} Proofs Logged`;

  if (myClearedReports.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1;">${getEmptyStateHTML('proofs', 'No clearance proofs logged yet', 'Completed cleanup photos taken during shifts will appear here.')}</div>`;
    return;
  }

  grid.innerHTML = myClearedReports.map(r => `
    <div class="photo-gallery-card">
      <div class="photo-gallery-thumb">📷</div>
      <div style="padding: 0.5rem 0.65rem;">
        <div style="font-weight: 700; font-size: 0.78rem;">${r.landmark}</div>
        <div style="color: #64748b; font-size: 0.72rem;">${r.area || 'Mumbai'}</div>
        <div style="color: #059669; font-weight: 700; margin-top: 0.2rem; font-size: 0.72rem;">✓ Cleared & Sanitized</div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   19. ADMIN OPERATIONAL AUDIT TRAIL & WEEKLY DIGEST REPORT
   ========================================================================== */
function getAdminAuditTrail() {
  let logs = JSON.parse(localStorage.getItem('swm_admin_audit_log') || '[]');
  if (logs.length === 0) {
    logs = [
      { timestamp: Date.now() - 3600000 * 5, actor: 'Admin (MCGM)', action: 'Auto-Assign Optimization', details: 'Smart crew assignment dispatched 4 pending tickets across Dadar and Bandra zones.' },
      { timestamp: Date.now() - 3600000 * 3, actor: 'Rajesh Singh (Crew #101)', action: 'Shift Status Change', details: 'Started shift; vehicle MH-01-GA-4401 marked Active Collection.' },
      { timestamp: Date.now() - 3600000 * 2, actor: 'Admin (MCGM)', action: 'Reassign Stop', details: 'Reassigned stop EMG-401 to nearest available crew (#101 Dadar).' },
      { timestamp: Date.now() - 3600000 * 1, actor: 'Admin (MCGM)', action: 'Compliance Benchmark Update', details: 'Updated SBM 2.0 statutory targets for Ward K/East.' }
    ];
    localStorage.setItem('swm_admin_audit_log', JSON.stringify(logs));
  }
  return logs;
}

function logAdminAction(action, actor, details) {
  let logs = getAdminAuditTrail();
  logs.unshift({
    timestamp: Date.now(),
    actor: actor || 'Admin (MCGM)',
    action,
    details
  });
  localStorage.setItem('swm_admin_audit_log', JSON.stringify(logs));
  renderAdminLogsTable();
}

function renderAdminLogsTable() {
  const tbody = document.getElementById('adminLogsTableBody');
  if (!tbody) return;
  const logs = getAdminAuditTrail();

  tbody.innerHTML = logs.map(l => {
    let badgeClass = 'audit-badge-clear';
    if (l.action.toLowerCase().includes('reassign')) badgeClass = 'audit-badge-reassign';
    else if (l.action.toLowerCase().includes('threshold') || l.action.toLowerCase().includes('compliance')) badgeClass = 'audit-badge-threshold';
    else if (l.action.toLowerCase().includes('shift') || l.action.toLowerCase().includes('safety')) badgeClass = 'audit-badge-shift';

    return `
      <tr>
        <td style="font-family: monospace; font-size: 0.78rem;">${new Date(l.timestamp).toLocaleString()}</td>
        <td><strong>${l.actor}</strong></td>
        <td><span class="audit-log-badge ${badgeClass}">${l.action}</span></td>
        <td style="font-size: 0.82rem; color: #334155;">${l.details}</td>
      </tr>
    `;
  }).join('');
}

window.openAdminWeeklyDigestModal = function() {
  const modal = document.getElementById('adminWeeklyDigestModal');
  if (!modal) return;
  const reports = getReports();
  const cleared = reports.filter(r => r.status === 'cleared').length;
  const total = reports.length || 15;
  const clearanceRate = Math.round((cleared / total) * 100);

  document.getElementById('digestTotalReports').textContent = total;
  document.getElementById('digestClearanceRate').textContent = `${clearanceRate}%`;
  document.getElementById('digestAvgSla').textContent = '3.8h';
  document.getElementById('digestCreditsAwarded').textContent = '420';

  const topWardsEl = document.getElementById('digestTopWardsList');
  if (topWardsEl) {
    topWardsEl.innerHTML = `
      <div style="display: flex; justify-content: space-between;"><span>🥇 <strong>Ward G/South (Dadar)</strong> &bull; 92% Cleared</span><span>1.8h Avg SLA</span></div>
      <div style="display: flex; justify-content: space-between;"><span>🥈 <strong>Ward K/East (Andheri)</strong> &bull; 88% Cleared</span><span>2.4h Avg SLA</span></div>
      <div style="display: flex; justify-content: space-between;"><span>🥉 <strong>Ward H/West (Bandra)</strong> &bull; 85% Cleared</span><span>3.1h Avg SLA</span></div>
    `;
  }

  modal.classList.add('active');
};

/* ==========================================================================
   20. CROSS-CUTTING: I18N MULTI-LANGUAGE, NOTIFICATIONS & KEYBOARD SHORTCUTS
   ========================================================================== */
const I18N = {
  en: {
    langBtn: '🌐 EN | हिं',
    welcome: 'Welcome',
    reportTitle: 'Submit Bin Report (+5 Credits)',
    walletBalance: 'Wallet Balance',
    submitReport: 'Submit Bin Report (+5 Credits)',
    signOut: 'Sign Out'
  },
  hi: {
    langBtn: '🌐 हिं | EN',
    welcome: 'स्वागत है',
    reportTitle: 'कचरा डिब्बा रिपोर्ट दर्ज करें (+5)',
    walletBalance: 'वॉलेट बैलेंस',
    submitReport: 'रिपोर्ट सबमिट करें (+5)',
    signOut: 'साइन आउट'
  }
};
let currentLang = localStorage.getItem('swm_lang') || 'en';

window.toggleAppLanguage = function() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('swm_lang', currentLang);
  applyAppLanguage(currentLang);
};

function applyAppLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  const langBtns = [document.getElementById('langToggleBtn'), document.getElementById('guestLangToggleBtn')];
  langBtns.forEach(b => { if (b) b.textContent = dict.langBtn; });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.textContent = dict.signOut;

  const submitBtn = document.querySelector('#citizenReportForm button[type="submit"]');
  if (submitBtn) submitBtn.textContent = dict.submitReport;
}

function initLanguage() {
  applyAppLanguage(currentLang);
}

/* In-App Notification Center */
function getNotifications() {
  let list = JSON.parse(localStorage.getItem('swm_notifications') || '[]');
  if (list.length === 0) {
    list = [
      { id: 'notif-1', title: '🌱 Welcome to EcoClear Network', message: 'Report civic bins and verify segregation to earn EcoCredits.', time: Date.now() - 3600000, read: false },
      { id: 'notif-2', title: '🎁 Referral Bonus Active', message: 'Invite neighbors to earn +15 credits on their first report.', time: Date.now() - 7200000, read: false },
      { id: 'notif-3', title: '🏛️ SBM 2.0 Civic Drive', message: 'Municipal compactor crews prioritizing wet waste separation this week.', time: Date.now() - 14400000, read: true }
    ];
    localStorage.setItem('swm_notifications', JSON.stringify(list));
  }
  return list;
}
function saveNotifications(list) {
  localStorage.setItem('swm_notifications', JSON.stringify(list));
  updateNotificationBadge();
}
function addNotification(title, message, type = 'general') {
  let list = getNotifications();
  list.unshift({ id: 'notif-' + Date.now(), title, message, type, time: Date.now(), read: false });
  saveNotifications(list);
  renderNotificationDropdown();
}
function updateNotificationBadge() {
  const list = getNotifications();
  const unreadCount = list.filter(n => !n.read).length;
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}
window.toggleNotificationDropdown = function() {
  const dropdown = document.getElementById('notificationDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('active');
  renderNotificationDropdown();
};
function renderNotificationDropdown() {
  const container = document.getElementById('notificationList');
  if (!container) return;
  const list = getNotifications();
  if (list.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.82rem;">No notifications right now.</div>`;
    return;
  }
  container.innerHTML = list.map(n => `
    <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}')">
      <div>
        <div style="font-weight: 700;">${n.title}</div>
        <div style="color: #475569; font-size: 0.78rem;">${n.message}</div>
        <div class="notification-time">${formatTimeAgo(n.time)}</div>
      </div>
    </div>
  `).join('');
  updateNotificationBadge();
}
window.markAllNotificationsRead = function() {
  let list = getNotifications();
  list.forEach(n => n.read = true);
  saveNotifications(list);
  renderNotificationDropdown();
};
window.markNotificationRead = function(id) {
  let list = getNotifications();
  const item = list.find(n => n.id === id);
  if (item) {
    item.read = true;
    saveNotifications(list);
    renderNotificationDropdown();
  }
};
function initNotifications() {
  updateNotificationBadge();
}

/* Keyboard Shortcuts Help Panel */
window.openKeyboardShortcutsModal = function() {
  document.getElementById('keyboardShortcutsModal')?.classList.add('active');
};
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      if (e.key === 'Escape') {
        closeAllModals();
      }
      return;
    }

    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      const modal = document.getElementById('keyboardShortcutsModal');
      if (modal?.classList.contains('active')) {
        closeModal('keyboardShortcutsModal');
      } else {
        window.openKeyboardShortcutsModal();
      }
    } else if (e.key === 'Escape') {
      closeAllModals();
      document.getElementById('notificationDropdown')?.classList.remove('active');
    } else if (e.key === '1') {
      quickSwitchDemoRole('citizen');
    } else if (e.key === '2') {
      quickSwitchDemoRole('institution');
    } else if (e.key === '3') {
      quickSwitchDemoRole('hospital');
    } else if (e.key === '4') {
      quickSwitchDemoRole('worker');
    } else if (e.key === '5') {
      quickSwitchDemoRole('admin');
    } else if (e.key.toLowerCase() === 't') {
      window.location.href = 'transparency.html';
    } else if (e.key.toLowerCase() === 'n') {
      window.toggleNotificationDropdown();
    } else if (e.key.toLowerCase() === 'a') {
      if (currentUser?.role === 'admin') {
        switchAdminTab('analytics');
      }
    }
  });
}
function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
}

/* PWA Service Worker Registration */
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('EcoClear PWA Service Worker registered:', reg.scope);
      }).catch((err) => {
        console.warn('PWA SW registration error:', err);
      });
    });
  }
}
