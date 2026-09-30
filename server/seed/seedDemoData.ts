import { connectDatabase } from '../config/database.js';
import { loadEnv } from '../config/env.js';
import { UserModel } from '../models/User.js';
import { HospitalModel } from '../models/Hospital.js';
import { DoctorModel } from '../models/Doctor.js';
import { AppointmentModel } from '../models/Appointment.js';
import { MedicalReportModel } from '../models/MedicalReport.js';
import { MedicalKnowledgeModel } from '../models/MedicalKnowledge.js';
import { indexKnowledgeDocuments } from '../ai/vectorStore/vectorStore.js';
import { UserRoles, AppointmentStatuses } from '../utils/constants.js';

const env = loadEnv();

const demoHospitals = [
  {
    name: 'Aarogyam Care Hospital',
    address: '12 Lake View Road, Ameerpet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500016',
    latitude: 17.4375,
    longitude: 78.4483,
    departments: ['Cardiology', 'Endocrinology', 'General Medicine', 'Dermatology'],
    specialties: ['Cardiology', 'Diabetology', 'General Medicine'],
    contactNumber: '040-40001001',
    description: 'Multispecialty hospital for cardiology and diabetes care.',
  },
  {
    name: 'Swasthya Multispeciality',
    address: '88 Banjara Hills Main Road',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    latitude: 17.4138,
    longitude: 78.4483,
    departments: ['Neurology', 'Orthopedics', 'Radiology', 'General Medicine'],
    specialties: ['Neurology', 'Orthopedics'],
    contactNumber: '040-40001002',
    description: 'Neuro and ortho focused tertiary care center.',
  },
  {
    name: 'Green Leaf Medical Center',
    address: '45 MG Road, Secunderabad',
    city: 'Secunderabad',
    state: 'Telangana',
    pincode: '500003',
    latitude: 17.4399,
    longitude: 78.4983,
    departments: ['Nephrology', 'Gastroenterology', 'General Medicine'],
    specialties: ['Nephrology', 'Gastroenterology'],
    contactNumber: '040-40001003',
    description: 'Specialized diagnostic and medical care center.',
  },
  {
    name: 'Pristine Women and Child Hospital',
    address: '23 Jubilee Hills Road',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    latitude: 17.4314,
    longitude: 78.4071,
    departments: ['Gynecology', 'Pediatrics', 'General Medicine'],
    specialties: ['Gynecology', 'Pediatrics'],
    contactNumber: '040-40001004',
    description: 'Women and child focused care with diagnostic support.',
  },
  {
    name: 'Harmony Heart & Kidney Institute',
    address: '7 Financial District Avenue',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    latitude: 17.4239,
    longitude: 78.3488,
    departments: ['Cardiology', 'Nephrology', 'Endocrinology'],
    specialties: ['Cardiology', 'Nephrology'],
    contactNumber: '040-40001005',
    description: 'Focused care for lifestyle diseases and organ health.',
  },
];

const demoDoctors = [
  { name: 'Dr. Ananya Rao', specialization: 'Cardiologist', hospitalIndex: 0, department: 'Cardiology', experienceYears: 11, consultationFee: 900, bio: 'Cardiology consultant focused on preventive heart care.' },
  { name: 'Dr. Rahul Mehta', specialization: 'Endocrinologist / Diabetologist', hospitalIndex: 0, department: 'Endocrinology', experienceYears: 9, consultationFee: 850, bio: 'Diabetes and metabolic disorder specialist.' },
  { name: 'Dr. Priya Nair', specialization: 'Neurologist', hospitalIndex: 1, department: 'Neurology', experienceYears: 13, consultationFee: 1000, bio: 'Neurology specialist for headaches and nerve disorders.' },
  { name: 'Dr. Karthik Shetty', specialization: 'Orthopedist', hospitalIndex: 1, department: 'Orthopedics', experienceYears: 12, consultationFee: 800, bio: 'Orthopedic surgeon with sports medicine experience.' },
  { name: 'Dr. Farah Khan', specialization: 'Nephrologist', hospitalIndex: 2, department: 'Nephrology', experienceYears: 10, consultationFee: 950, bio: 'Kidney specialist with chronic disease management focus.' },
  { name: 'Dr. Suresh Babu', specialization: 'Gastroenterologist / Hepatologist', hospitalIndex: 2, department: 'Gastroenterology', experienceYears: 14, consultationFee: 900, bio: 'Liver and digestive health consultant.' },
  { name: 'Dr. Meera Iyer', specialization: 'Dermatologist', hospitalIndex: 3, department: 'General Medicine', experienceYears: 8, consultationFee: 700, bio: 'Skin and allergy specialist.' },
  { name: 'Dr. Nitin Kapoor', specialization: 'Ophthalmologist', hospitalIndex: 3, department: 'General Medicine', experienceYears: 15, consultationFee: 850, bio: 'Eye care and vision specialist.' },
  { name: 'Dr. Lavanya Reddy', specialization: 'General Physician', hospitalIndex: 4, department: 'General Medicine', experienceYears: 7, consultationFee: 500, bio: 'Primary care and triage physician.' },
  { name: 'Dr. Arvind Joshi', specialization: 'Cardiologist', hospitalIndex: 4, department: 'Cardiology', experienceYears: 16, consultationFee: 1100, bio: 'Interventional cardiology and preventive care.' },
];

const demoKnowledge = [
  {
    title: 'Hemoglobin interpretation guidance',
    category: 'report-interpretation',
    content: 'Hemoglobin values are interpreted using lab-specific ranges. Lower values can be informationally noted as below the configured range and should be reviewed by a clinician.',
    tags: ['hemoglobin', 'cbc', 'anemia'],
  },
  {
    title: 'HbA1c educational note',
    category: 'report-interpretation',
    content: 'HbA1c reflects average glucose over time. Informational review should not claim diagnosis; it should highlight the lab value and suggest an endocrinology review when elevated.',
    tags: ['hba1c', 'glucose', 'diabetes'],
  },
  {
    title: 'Creatinine and kidney review',
    category: 'report-interpretation',
    content: 'Creatinine is a marker used in kidney assessment. Informational interpretation should mention the reference range and recommend nephrology follow-up if above range.',
    tags: ['creatinine', 'kidney'],
  },
  {
    title: 'Cardiology symptom mapping',
    category: 'specialist-recommendation',
    content: 'Chest pain, palpitations, and blood-pressure concerns are commonly routed to cardiology as an informational recommendation, not a diagnosis.',
    tags: ['cardiology', 'symptoms'],
  },
];

async function seed() {
  await connectDatabase(env.MONGODB_URI);

  await Promise.all([
    UserModel.deleteMany({}),
    HospitalModel.deleteMany({}),
    DoctorModel.deleteMany({}),
    AppointmentModel.deleteMany({}),
    MedicalReportModel.deleteMany({}),
    MedicalKnowledgeModel.deleteMany({}),
  ]);

  const patient = await UserModel.create({
    name: 'Demo Patient',
    email: 'patient@bookmyappointment.ai',
    password: 'Password@123',
    role: UserRoles.PATIENT,
    phone: '9999900001',
    location: { city: 'Hyderabad', state: 'Telangana', area: 'Ameerpet', pincode: '500016' },
    preferredLanguage: 'English',
  });

  const hospitalAdmin = await UserModel.create({
    name: 'Demo Hospital Admin',
    email: 'admin@bookmyappointment.ai',
    password: 'Password@123',
    role: UserRoles.HOSPITAL_ADMIN,
    phone: '9999900002',
    location: { city: 'Hyderabad', state: 'Telangana', area: 'Banjara Hills', pincode: '500034' },
    preferredLanguage: 'English',
  });

  const doctorUsers = await Promise.all(
    demoDoctors.map((doctor, index) =>
      UserModel.create({
        name: doctor.name,
        email: `doctor${index + 1}@bookmyappointment.ai`,
        password: 'Password@123',
        role: UserRoles.DOCTOR,
        phone: `99999000${10 + index}`,
        location: { city: 'Hyderabad', state: 'Telangana' },
        preferredLanguage: 'English',
      }),
    ),
  );

  const hospitals = await Promise.all(
    demoHospitals.map((hospital) =>
      HospitalModel.create({
        ...hospital,
        adminUserId: hospitalAdmin._id,
      }),
    ),
  );

  const doctors = await Promise.all(
    demoDoctors.map((doctor, index) => {
      const hospital = hospitals[doctor.hospitalIndex];
      return DoctorModel.create({
        userId: doctorUsers[index]._id,
        name: doctor.name,
        specialization: doctor.specialization,
        hospitalId: hospital._id,
        hospitalName: hospital.name,
        department: doctor.department,
        location: {
          city: hospital.city,
          state: hospital.state,
          area: hospital.address,
          pincode: hospital.pincode,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
        },
        experienceYears: doctor.experienceYears,
        consultationFee: doctor.consultationFee,
        bio: doctor.bio,
        languages: ['English', 'Telugu'],
        availability: [
          { date: '2026-10-01', slots: ['10:00 AM', '10:30 AM', '11:00 AM', '04:00 PM'] },
          { date: '2026-10-02', slots: ['09:30 AM', '10:00 AM', '05:00 PM'] },
        ],
      }).then(async (createdDoctor) => {
        await HospitalModel.updateOne({ _id: hospital._id }, { $addToSet: { doctorIds: createdDoctor._id } });
        return createdDoctor;
      });
    }),
  );

  await indexKnowledgeDocuments(demoKnowledge);

  await MedicalReportModel.create([
    {
      reportId: 'RPT-DEMO-1',
      patientId: patient._id,
      uploadedBy: patient._id,
      uploadedByRole: UserRoles.PATIENT,
      fileUrl: '/uploads/demo-cbc.pdf',
      fileName: 'demo-cbc.pdf',
      reportType: 'CBC',
      extractedText: 'Hemoglobin: 10.2 g/dL WBC: 7,500 /uL Platelets: 250,000 /uL',
      extractedParameters: [
        { key: 'hemoglobin', label: 'Hemoglobin', value: 10.2, unit: 'g/dL', referenceRange: '12 - 17.5 g/dL', isAbnormal: true },
        { key: 'wbc', label: 'WBC', value: 7500, unit: '/uL', referenceRange: '4000 - 11000 /uL', isAbnormal: false },
        { key: 'platelets', label: 'Platelets', value: 250000, unit: '/uL', referenceRange: '150000 - 450000 /uL', isAbnormal: false },
      ],
      abnormalParameters: [
        { key: 'hemoglobin', label: 'Hemoglobin', value: 10.2, unit: 'g/dL', reason: 'Below the configured informational range' },
      ],
      aiSummary: {
        summary: 'CBC report shows hemoglobin below the configured informational range.',
        explanation: 'This informational summary suggests that the report may merit a clinician review.',
        riskCategory: 'Needs Clinical Review',
        recommendedSpecialist: 'General Physician',
        disclaimer: 'This application is an AI-assisted informational tool.',
      },
      recommendedSpecialist: 'General Physician',
      processingStatus: 'COMPLETED',
    },
    {
      reportId: 'RPT-DEMO-2',
      patientId: patient._id,
      uploadedBy: doctorUsers[0]._id,
      uploadedByRole: UserRoles.DOCTOR,
      fileUrl: '/uploads/demo-hba1c.pdf',
      fileName: 'demo-hba1c.pdf',
      reportType: 'HbA1c',
      extractedText: 'HbA1c: 7.5%',
      extractedParameters: [
        { key: 'hba1c', label: 'HbA1c', value: 7.5, unit: '%', referenceRange: '0 - 5.6 %', isAbnormal: true },
      ],
      abnormalParameters: [
        { key: 'hba1c', label: 'HbA1c', value: 7.5, unit: '%', reason: 'Above the configured informational range' },
      ],
      aiSummary: {
        summary: 'HbA1c is above the configured informational threshold.',
        explanation: 'This indicates that the value should be reviewed by a clinician, ideally an endocrinologist or diabetologist.',
        riskCategory: 'Needs Clinical Review',
        recommendedSpecialist: 'Endocrinologist / Diabetologist',
        disclaimer: 'This application is an AI-assisted informational tool.',
      },
      recommendedSpecialist: 'Endocrinologist / Diabetologist',
      processingStatus: 'COMPLETED',
    },
  ]);

  await AppointmentModel.create({
    appointmentId: 'APT-DEMO-1',
    patientId: patient._id,
    doctorId: doctors[0]._id,
    hospitalId: hospitals[0]._id,
    date: '2026-10-01',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    status: AppointmentStatuses.CONFIRMED,
    reason: 'Chest pain and checkup',
  });

  console.log('Demo data seeded successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
