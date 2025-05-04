export const backgroundStorage = 'backgroundColor';
export const accountRoles = ['admin', 'user'];
export const firestoreCollectionUsers = 'users';

export const sensorOfflineTimer = 15;

export const CO2_THRESHOLDS = {
  EXCELLENT: 400,
  GOOD: 1000,
  CONCERNING: 2000,
  POOR: 5000
};

export const userRoles = {
  admin: 'admin',
  user: 'user',
  superAdmin: 'super_admin',
}

export const tableHeaders = [
  { key: 'dev_eui', label: 'Device EUI' },
  { key: 'room_number', label: 'Room Number' },
  { key: 'blockName', label: 'Block Name' }
];

export const tableHeadersUsers = [
  { key: 'firstName', label: 'First' },
  { key: 'lastName', label: 'Last' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'lastSignInTime', label: 'Last Sign In'}
];

export const tableHeadersBlocks = [
  { key: 'blockName', label: 'Block Name' },
]

export const tableHeadersOverview = [
  { label: 'Room', key: 'room_number' },
  { label: 'CO2 Level', key: 'co2Level' },
  { label: 'Conditions', key: 'co2Level' },
  { label: 'Temperature', key: 'temperature' },
  { label: 'Last Updated', key: 'lastUpdated' },
];