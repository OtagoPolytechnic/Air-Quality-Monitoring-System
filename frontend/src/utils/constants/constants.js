export const backgroundStorage = 'backgroundColor';
export const accountRoles = ['admin', 'user'];
export const firestoreCollectionUsers = 'users';

export const sensorOfflineTimer = 15;

export const userRoles = {
  admin: 'admin',
  user: 'user',
  superAdmin: 'super_admin',
}

export const tableHeaders = [
  { key: 'deviceId', label: 'Device' },
  { key: 'room_number', label: 'Room Number' },
  { key: 'blockName', label: 'Block Name' },
  { key: 'lastSeen', label: 'Last Seen' },
  { key: 'status', label: 'Status' }
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
