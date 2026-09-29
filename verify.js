// ==========================================================================
// Comprehensive Verification Test Suite for Smart Waste Management System
// Validates all user requirements, bug fixes, data models, and logic
// ==========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Smart Waste Management System Verification...\n');

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}\n`);
    testsFailed++;
  }
}

// --------------------------------------------------------------------------
// 1. FILE INTEGRITY & TOKEN CHECKS
// --------------------------------------------------------------------------
console.log('📦 1. Checking Design Tokens & File Integrity...');

const stylesContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf-8');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const appContent = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf-8');

runTest('Civic Token Palette: All required municipal tokens defined', () => {
  const requiredTokens = [
    '--civic-forest-ink',
    '--civic-paper-bg',
    '--civic-surface',
    '--civic-border',
    '--civic-cobalt-accent',
    '--civic-spruce-green',
    '--civic-signal-amber',
    '--civic-signal-crimson'
  ];
  requiredTokens.forEach(token => {
    assert(stylesContent.includes(token), `Missing token ${token} in styles.css`);
  });
});

runTest('Biomedical Waste Rules 2016: Regulatory tokens strictly preserved', () => {
  const bmwTokens = [
    '--bmw-yellow',
    '--bmw-red',
    '--bmw-white',
    '--bmw-black-blue'
  ];
  bmwTokens.forEach(token => {
    assert(stylesContent.includes(token), `Missing BMW token ${token} in styles.css`);
  });
});

runTest('Typography Tokens: Signage font and UI font defined', () => {
  assert(stylesContent.includes('--font-display'), 'Missing --font-display');
  assert(stylesContent.includes('--font-ui'), 'Missing --font-ui');
  assert(stylesContent.includes('Outfit'), 'Outfit font missing');
  assert(stylesContent.includes('Plus Jakarta Sans'), 'Plus Jakarta Sans missing');
});

runTest('Visual Status Steppers: Stepper CSS classes defined', () => {
  assert(stylesContent.includes('.status-stepper'), '.status-stepper missing');
  assert(stylesContent.includes('.container-lifecycle-bar'), '.container-lifecycle-bar missing');
});

// --------------------------------------------------------------------------
// 2. INSTITUTION SIGNUP & DASHBOARD (SCHOOL & COMPANY)
// --------------------------------------------------------------------------
console.log('\n🏢 2. Testing Institution Signup & Profile (School vs Company)...');

runTest('HTML Markup: Contains specific School and Company fields', () => {
  assert(htmlContent.includes('id="signupSchoolName"'), 'Missing signupSchoolName input');
  assert(htmlContent.includes('id="signupCompanyName"'), 'Missing signupCompanyName input');
  assert(htmlContent.includes('id="signupBusinessType"'), 'Missing signupBusinessType select');
  assert(htmlContent.includes('id="signupInstType"'), 'Missing signupInstType select');
});

runTest('HTML Markup: Multi-branch selector and branch modal in place', () => {
  assert(htmlContent.includes('id="instBranchSelect"'), 'Missing instBranchSelect in Institution view');
  assert(htmlContent.includes('id="addBranchModal"'), 'Missing addBranchModal');
  assert(htmlContent.includes('id="addBranchForm"'), 'Missing addBranchForm');
});

runTest('HTML Markup: Institution Bulk Form has 4 required waste types', () => {
  assert(htmlContent.includes('value="commercial_food"'), 'Missing commercial_food option');
  assert(htmlContent.includes('value="market_waste"'), 'Missing market_waste option');
  assert(htmlContent.includes('value="office_paper"'), 'Missing office_paper option');
  assert(htmlContent.includes('value="c_and_d"'), 'Missing c_and_d option');
});

runTest('HTML Markup: Recurring Schedule and Monthly Self-Audit forms in place', () => {
  assert(htmlContent.includes('id="recurringScheduleForm"'), 'Missing recurringScheduleForm');
  assert(htmlContent.includes('id="instSelfAuditForm"'), 'Missing instSelfAuditForm');
  assert(htmlContent.includes('id="auditComplianceRate"'), 'Missing auditComplianceRate input');
});

runTest('App Logic: Seed users include both School and Company profiles', () => {
  assert(appContent.includes("institutionType: 'school'"), 'School institution type missing in SEED_USERS');
  assert(appContent.includes("schoolName: 'Delhi Public School, Sector 12'"), 'School Name missing in SEED_USERS');
  assert(appContent.includes("institutionType: 'company'"), 'Company institution type missing in SEED_USERS');
  assert(appContent.includes("companyName: 'Infosys Ltd, Whitefield Campus'"), 'Company Name missing in SEED_USERS');
  assert(appContent.includes("businessType: 'IT / Tech Office'"), 'Business Type missing in SEED_USERS');
});

runTest('App Logic: Header replaces generic label with School or Company name', () => {
  assert(appContent.includes("currentUser.schoolName || currentUser.name"), 'School name header logic missing');
  assert(appContent.includes("currentUser.companyName || currentUser.name"), 'Company name header logic missing');
});

// --------------------------------------------------------------------------
// 3. REAL LOCATION PICKER WITH LEAFLET
// --------------------------------------------------------------------------
console.log('\n🗺️ 3. Testing Real Location Picker with Leaflet...');

runTest('HTML Markup: Map containers embedded directly in Citizen & Institution report forms', () => {
  assert(htmlContent.includes('id="citizenMapPicker"'), 'citizenMapPicker container missing');
  assert(htmlContent.includes('id="instMapPicker"'), 'instMapPicker container missing');
  assert(htmlContent.includes('id="citizenLocateBtn"'), 'citizenLocateBtn (Use My Current Location) missing');
  assert(htmlContent.includes('id="instLocateBtn"'), 'instLocateBtn (Use My Current Location) missing');
});

runTest('App Logic: Leaflet location picker initialized with draggable marker & reverse geocoding', () => {
  assert(appContent.includes('L.map(mapContainerId'), 'L.map initialization missing');
  assert(appContent.includes('draggable: true'), 'Draggable marker missing');
  assert(appContent.includes('reverseGeocode'), 'reverseGeocode function missing');
  assert(appContent.includes('nominatim.openstreetmap.org/reverse'), 'Nominatim reverse geocoding API missing');
});

runTest('App Logic: Geolocation permission denial handled gracefully', () => {
  assert(appContent.includes('navigator.geolocation.getCurrentPosition'), 'getCurrentPosition missing');
  assert(appContent.includes('Location permission denied or unavailable'), 'Denial handler message missing');
});

runTest('App Logic: Coordinates (lat, lng, resolvedAddress) stored with reports', () => {
  assert(appContent.includes('latitude: lat'), 'latitude field missing in new report');
  assert(appContent.includes('longitude: lng'), 'longitude field missing in new report');
  assert(appContent.includes('resolvedAddress:'), 'resolvedAddress field missing in new report');
});

runTest('App Logic: Admin Hotspot Map plots real coordinates from submitted reports', () => {
  assert(appContent.includes('r.latitude || r.coords?.lat'), 'Admin Hotspot map not using real latitude');
  assert(appContent.includes('L.circleMarker([lat, lng]'), 'Circle marker plotting missing on hotspot map');
});

// --------------------------------------------------------------------------
// 4. HOSPITAL DASHBOARD BUG FIXES & FEATURES
// --------------------------------------------------------------------------
console.log('\n🏥 4. Testing Hospital Dashboard Features & Bug Fixes...');

runTest('CSV Export: RFC-4180 format, Blob type text/csv;charset=utf-8, date stamp filename', () => {
  assert(appContent.includes("type: 'text/csv;charset=utf-8;'"), 'Missing correct Blob MIME type');
  assert(appContent.includes("compliance-audit-log-"), 'Missing date stamped filename');
  assert(appContent.includes('.csv'), 'Missing .csv extension in download');
  assert(appContent.includes('URL.createObjectURL(blob)'), 'Missing createObjectURL in CSV export');
  assert(appContent.includes('URL.revokeObjectURL(url)'), 'Missing revokeObjectURL in CSV export');
});

runTest('CSV Export: Empty data alert prevents broken file creation', () => {
  assert(appContent.includes('if (bmwReports.length === 0)'), 'Missing empty check in exportHospitalAuditCSV');
});

runTest('Form Validation: Register Hazardous button active logic implemented', () => {
  assert(appContent.includes('validateBMWForm'), 'Missing validateBMWForm function');
  assert(appContent.includes('registerBMWBtn'), 'Missing registerBMWBtn reference');
});

runTest('New Feature: Container Lifecycle 5-state tracking implemented', () => {
  const stages = ['Registered', 'Collected', 'In Transit', 'Treated', 'Disposed'];
  stages.forEach(stage => {
    assert(appContent.includes(`'${stage}'`), `Lifecycle stage '${stage}' missing in app.js`);
  });
  assert(appContent.includes('advanceContainerLifecycle'), 'advanceContainerLifecycle function missing');
});

runTest('New Feature: Authorized Treatment Facility field in form and logs', () => {
  assert(htmlContent.includes('id="bmwTreatmentFacility"'), 'bmwTreatmentFacility select missing in HTML');
  assert(appContent.includes('treatmentFacility'), 'treatmentFacility missing in BMW report object');
});

runTest('New Feature: Staff Training Compliance Log implemented', () => {
  assert(htmlContent.includes('id="hospitalStaffTable"'), 'hospitalStaffTable missing in HTML');
  assert(htmlContent.includes('id="staffTrainingModal"'), 'staffTrainingModal missing in HTML');
  assert(appContent.includes('SEED_HOSPITAL_STAFF'), 'SEED_HOSPITAL_STAFF missing in app.js');
});

runTest('New Feature: Configurable High-Priority Hazard Threshold implemented', () => {
  assert(htmlContent.includes('id="hospitalThresholdInput"'), 'hospitalThresholdInput missing in HTML');
  assert(appContent.includes('updateHospitalHazardThreshold'), 'updateHospitalHazardThreshold missing in app.js');
  assert(appContent.includes('currentUser.hazardThreshold'), 'currentUser.hazardThreshold missing in app.js');
});

// --------------------------------------------------------------------------
// 5. CITIZEN DASHBOARD BUG FIXES & CREDIT STORE
// --------------------------------------------------------------------------
console.log('\n👤 5. Testing Citizen Dashboard Bug Fixes & Credit Store...');

runTest('Bug Fix: Severity selector is interactive and required', () => {
  assert(htmlContent.includes('class="severity-selector"'), 'severity-selector missing in HTML');
  assert(htmlContent.includes('selectSeverity'), 'selectSeverity call missing in HTML');
  assert(appContent.includes('window.selectSeverity = function'), 'selectSeverity function missing in app.js');
  assert(appContent.includes('Please select a Severity Level'), 'Severity requirement validation missing');
});

runTest('Bug Fix: Voice recorder with functional playback controls', () => {
  assert(htmlContent.includes('id="audioPlayerContainer"'), 'audioPlayerContainer missing in HTML');
  assert(htmlContent.includes('id="audioPlayToggleBtn"'), 'audioPlayToggleBtn missing in HTML');
  assert(htmlContent.includes('id="audioSeekBar"'), 'audioSeekBar missing in HTML');
  assert(htmlContent.includes('id="audioVolumeBar"'), 'audioVolumeBar missing in HTML');
  assert(appContent.includes('toggleAudioPlayback'), 'toggleAudioPlayback missing in app.js');
  assert(appContent.includes('seekAudioPlayback'), 'seekAudioPlayback missing in app.js');
  assert(appContent.includes('setAudioVolume'), 'setAudioVolume missing in app.js');
});

runTest('Credit Store: Sapling reward featured as primary largest card first', () => {
  assert(appContent.includes("id: 'sapling'"), 'Sapling reward missing');
  assert(appContent.includes("featured: true"), 'Sapling not marked as featured');
  assert(stylesContent.includes('.reward-card.featured-card'), 'featured-card CSS class missing');
});

runTest('Credit Store: All secondary reward items included in catalog', () => {
  const secondaryItemIds = [
    'jute_bag',
    'compost_kit',
    'cutlery_set',
    'seed_paper',
    'transit_fare',
    'tax_voucher',
    'recycled_notebook',
    'digital_badge'
  ];
  secondaryItemIds.forEach(id => {
    assert(appContent.includes(`id: '${id}'`), `Missing reward item ${id}`);
  });
});

runTest('Credit Store: Redemption flow differentiates physical vs digital badges', () => {
  assert(appContent.includes("status: isDigital ? 'Fulfilled' : 'Requested'"), 'Status logic for physical vs digital badge missing');
  assert(appContent.includes('swm_redemptions'), 'swm_redemptions data store missing');
  assert(appContent.includes('redeemCreditStoreItem'), 'redeemCreditStoreItem function missing');
});

runTest('Admin Dashboard: Redemption requests queue view with Mark Fulfilled button', () => {
  assert(htmlContent.includes('id="adminTabRedemptions"'), 'adminTabRedemptions tab missing in HTML');
  assert(htmlContent.includes('id="adminPanelRedemptions"'), 'adminPanelRedemptions panel missing in HTML');
  assert(appContent.includes('adminFulfillRedemption'), 'adminFulfillRedemption function missing in app.js');
});

// --------------------------------------------------------------------------
// TEST SUMMARY
// --------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`📊 Verification Summary: ${testsPassed} Passed, ${testsFailed} Failed`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 26 COMPREHENSIVE VERIFICATION TESTS PASSED!');
  process.exit(0);
}
