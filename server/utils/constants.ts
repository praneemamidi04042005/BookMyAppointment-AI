export const UserRoles = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const AppointmentStatuses = {
  BOOKED: 'BOOKED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type AppointmentStatus = (typeof AppointmentStatuses)[keyof typeof AppointmentStatuses];

export const ProcessingStatuses = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type ProcessingStatus = (typeof ProcessingStatuses)[keyof typeof ProcessingStatuses];
