import { useState } from 'react';
import { db } from '../../firebase';
import {
  collection, getDocs, deleteDoc, doc, setDoc, serverTimestamp
} from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import { Database, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Image Mappings ──────────────────────────────────────────────────────────
const IMAGES = {
  regular: {
    a1: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&auto=format&fit=crop&q=80',
    a2: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
    b1: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800&auto=format&fit=crop&q=80',
    b2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
    c1: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop&q=80',
    c2: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
  },
  intensive: {
    a1: 'https://images.unsplash.com/photo-1517286808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    a2: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    b1: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    b2: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    c1: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop&q=80',
  },
  examprep: {
    a1: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    a2: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    b1: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
    b2: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    c1: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    c2: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=80',
  },
  young: {
    regular: {
      a1: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
      a2: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      b1: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      b2: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      c1: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
    },
    intensive: {
      a1: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      a2: 'https://images.unsplash.com/photo-1516629081240-feb21e829a7e?w=800&auto=format&fit=crop&q=80',
      b1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      b2: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=800&auto=format&fit=crop&q=80',
      c1: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80',
    },
    examprep: {
      a1: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      a2: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
      b1: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      b2: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      c1: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=80',
    }
  }
};

// ── Data Set ────────────────────────────────────────────────────────────────
const SEED_TESTIMONIALS = [
  {
    id: 'nelson-mandela',
    studentName: 'Nelson Mandela',
    track: 'Inspirational Quote',
    country: 'South Africa',
    quote: 'If you talk to a man in a language he understands, that goes to his head. If you talk to him in his language, that goes to his heart.',
    status: 'approved',
    imageURL: '',
  },
  {
    id: 'charlemagne',
    studentName: 'Charlemagne',
    track: 'Inspirational Quote',
    country: 'Rome',
    quote: 'To have another language is to possess a second soul.',
    status: 'approved',
    imageURL: '',
  },
  {
    id: 'frank-smith',
    studentName: 'Frank Smith',
    track: 'Inspirational Quote',
    country: 'Canada',
    quote: 'One language sets you in a corridor for life. Two languages open every door along the way.',
    status: 'approved',
    imageURL: '',
  }
];

const SEED_COURSES = [
  // ── ADULT REGULAR COURSES (A1-C2) ──────────────────────────────────────────
  {
    id: 'adult-regular-a1',
    title: 'Spanish A1 (Breakthrough)',
    subtitle: 'A1.1 – A1.3 · Beginner · Adult (18+)',
    level: 'A1',
    format: 'Regular',
    group: 'adult',
    description: 'Step by step modules with integrated exam preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.regular.a1,
    duration: '3 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A1.1', hours: 35, price: 9950 },
      { name: 'A1.2', hours: 35, price: 9950 },
      { name: 'A1.3', hours: 35, price: 9950 },
    ]
  },
  {
    id: 'adult-regular-a2',
    title: 'Spanish A2 (Waystage)',
    subtitle: 'A2.1 – A2.3 · Elementary · Adult (18+)',
    level: 'A2',
    format: 'Regular',
    group: 'adult',
    description: 'Step by step modules with integrated exam preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.regular.a2,
    duration: '3 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A2.1', hours: 40, price: 11950 },
      { name: 'A2.2', hours: 40, price: 11950 },
      { name: 'A2.3', hours: 40, price: 11950 },
    ]
  },
  {
    id: 'adult-regular-b1',
    title: 'Spanish B1 (Threshold)',
    subtitle: 'B1.1 – B1.4 · Intermediate · Adult (18+)',
    level: 'B1',
    format: 'Regular',
    group: 'adult',
    description: 'Step by step modules with integrated exam preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.regular.b1,
    duration: '4 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B1.1', hours: 45, price: 13850 },
      { name: 'B1.2', hours: 45, price: 13850 },
      { name: 'B1.3', hours: 45, price: 13850 },
      { name: 'B1.4', hours: 45, price: 13850 },
    ]
  },
  {
    id: 'adult-regular-b2',
    title: 'Spanish B2 (Vantage)',
    subtitle: 'B2.1 – B2.4 · Upper-Intermediate · Adult (18+)',
    level: 'B2',
    format: 'Regular',
    group: 'adult',
    description: 'Step by step modules with integrated exam preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.regular.b2,
    duration: '4 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B2.1', hours: 50, price: 16150 },
      { name: 'B2.2', hours: 50, price: 16150 },
      { name: 'B2.3', hours: 50, price: 16150 },
      { name: 'B2.4', hours: 50, price: 16150 },
    ]
  },
  {
    id: 'adult-regular-c1',
    title: 'Spanish C1 (Proficiency)',
    subtitle: 'C1.1 – C1.4 · Advanced · Adult (18+)',
    level: 'C1',
    format: 'Regular',
    group: 'adult',
    description: 'Step by step modules with integrated exam preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.regular.c1,
    duration: '5 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C1.1', hours: 60, price: 19550 },
      { name: 'C1.2', hours: 60, price: 19550 },
      { name: 'C1.3', hours: 60, price: 19550 },
      { name: 'C1.4', hours: 60, price: 19550 },
    ]
  },
  {
    id: 'adult-regular-c2',
    title: 'Spanish C2 (Mastery)',
    subtitle: 'C2.1 – C2.4 · Mastery · Adult (18+)',
    level: 'C2',
    format: 'Regular',
    group: 'adult',
    description: 'Step by step modules with integrated exam preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.regular.c2,
    duration: '5 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C2.1', hours: 60, price: 21550 },
      { name: 'C2.2', hours: 60, price: 21550 },
      { name: 'C2.3', hours: 60, price: 21550 },
      { name: 'C2.4', hours: 60, price: 21550 },
    ]
  },

  // ── ADULT SUPER INTENSIVE (A1-C1) ──────────────────────────────────────────
  {
    id: 'adult-intensive-a1',
    title: 'Super Intensive Spanish A1',
    subtitle: 'A1 · Fast Track · Adult (18+)',
    level: 'A1',
    format: 'Super Intensive',
    group: 'adult',
    description: 'Condensed, high intensity training for faster progression. Best suited for learners who want results in a shorter time frame.',
    status: 'active',
    imageURL: IMAGES.intensive.a1,
    duration: '6-8 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A1', hours: 60, price: 20500 }
    ]
  },
  {
    id: 'adult-intensive-a2',
    title: 'Super Intensive Spanish A2',
    subtitle: 'A2 · Fast Track · Adult (18+)',
    level: 'A2',
    format: 'Super Intensive',
    group: 'adult',
    description: 'Condensed, high intensity training for faster progression. Best suited for learners who want results in a shorter time frame.',
    status: 'active',
    imageURL: IMAGES.intensive.a2,
    duration: '6-8 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A2', hours: 65, price: 22500 }
    ]
  },
  {
    id: 'adult-intensive-b1',
    title: 'Super Intensive Spanish B1',
    subtitle: 'B1 · Fast Track · Adult (18+)',
    level: 'B1',
    format: 'Super Intensive',
    group: 'adult',
    description: 'Condensed, high intensity training for faster progression. Best suited for learners who want results in a shorter time frame.',
    status: 'active',
    imageURL: IMAGES.intensive.b1,
    duration: '8-10 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B1', hours: 80, price: 32500 }
    ]
  },
  {
    id: 'adult-intensive-b2',
    title: 'Super Intensive Spanish B2',
    subtitle: 'B2 · Fast Track · Adult (18+)',
    level: 'B2',
    format: 'Super Intensive',
    group: 'adult',
    description: 'Condensed, high intensity training for faster progression. Best suited for learners who want results in a shorter time frame.',
    status: 'active',
    imageURL: IMAGES.intensive.b2,
    duration: '10-12 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B2', hours: 110, price: 46500 }
    ]
  },
  {
    id: 'adult-intensive-c1',
    title: 'Super Intensive Spanish C1',
    subtitle: 'C1 · Fast Track · Adult (18+)',
    level: 'C1',
    format: 'Super Intensive',
    group: 'adult',
    description: 'Condensed, high intensity training for faster progression. Best suited for learners who want results in a shorter time frame.',
    status: 'active',
    imageURL: IMAGES.intensive.c1,
    duration: '12 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C1', hours: 120, price: 61500 }
    ]
  },

  // ── ADULT EXAM PREPARATION (A1-C2) ──────────────────────────────────────────
  {
    id: 'adult-examprep-a1',
    title: 'DELE A1 Exam Preparation',
    subtitle: 'A1 Prep · Focused · Adult (18+)',
    level: 'A1',
    format: 'Exam Preparation',
    group: 'adult',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Tailored to sharpen skills and maximize exam success.',
    status: 'active',
    imageURL: IMAGES.examprep.a1,
    duration: '7 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A1', hours: 14, price: 5000 }
    ]
  },
  {
    id: 'adult-examprep-a2',
    title: 'DELE A2 Exam Preparation',
    subtitle: 'A2 Prep · Focused · Adult (18+)',
    level: 'A2',
    format: 'Exam Preparation',
    group: 'adult',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Tailored to sharpen skills and maximize exam success.',
    status: 'active',
    imageURL: IMAGES.examprep.a2,
    duration: '7 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A2', hours: 14, price: 5900 }
    ]
  },
  {
    id: 'adult-examprep-b1',
    title: 'DELE B1 Exam Preparation',
    subtitle: 'B1 Prep · Focused · Adult (18+)',
    level: 'B1',
    format: 'Exam Preparation',
    group: 'adult',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Tailored to sharpen skills and maximize exam success.',
    status: 'active',
    imageURL: IMAGES.examprep.b1,
    duration: '7 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B1', hours: 15, price: 8500 }
    ]
  },
  {
    id: 'adult-examprep-b2',
    title: 'DELE B2 Exam Preparation',
    subtitle: 'B2 Prep · Focused · Adult (18+)',
    level: 'B2',
    format: 'Exam Preparation',
    group: 'adult',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Tailored to sharpen skills and maximize exam success.',
    status: 'active',
    imageURL: IMAGES.examprep.b2,
    duration: '10 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B2', hours: 20, price: 9800 }
    ]
  },
  {
    id: 'adult-examprep-c1',
    title: 'DELE C1 Exam Preparation',
    subtitle: 'C1 Prep · Focused · Adult (18+)',
    level: 'C1',
    format: 'Exam Preparation',
    group: 'adult',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Tailored to sharpen skills and maximize exam success.',
    status: 'active',
    imageURL: IMAGES.examprep.c1,
    duration: '10 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C1', hours: 20, price: 14000 }
    ]
  },
  {
    id: 'adult-examprep-c2',
    title: 'DELE C2 Exam Preparation',
    subtitle: 'C2 Prep · Focused · Adult (18+)',
    level: 'C2',
    format: 'Exam Preparation',
    group: 'adult',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Tailored to sharpen skills and maximize exam success.',
    status: 'active',
    imageURL: IMAGES.examprep.c2,
    duration: '10 days',
    batchSize: 'Max 10 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C2', hours: 20, price: 16500 }
    ]
  },

  // ── YOUNG LEARNERS REGULAR (A1-C1) ──────────────────────────────────────────
  {
    id: 'young-regular-a1',
    title: 'Spanish A1 (Young Learners)',
    subtitle: 'A1.1 – A1.3 · Beginner · Youth (8-15)',
    level: 'A1',
    format: 'Regular',
    group: 'young',
    description: 'Step by step modules with integrated DELE preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.young.regular.a1,
    duration: '3 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A1.1', hours: 30, price: 8950 },
      { name: 'A1.2', hours: 30, price: 8950 },
      { name: 'A1.3', hours: 30, price: 8950 },
    ]
  },
  {
    id: 'young-regular-a2',
    title: 'Spanish A2 (Young Learners)',
    subtitle: 'A2.1 – A2.3 · Elementary · Youth (8-15)',
    level: 'A2',
    format: 'Regular',
    group: 'young',
    description: 'Step by step modules with integrated DELE preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.young.regular.a2,
    duration: '3 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A2.1', hours: 35, price: 10950 },
      { name: 'A2.2', hours: 35, price: 10950 },
      { name: 'A2.3', hours: 35, price: 10950 },
    ]
  },
  {
    id: 'young-regular-b1',
    title: 'Spanish B1 (Young Learners)',
    subtitle: 'B1.1 – B1.4 · Intermediate · Youth (8-15)',
    level: 'B1',
    format: 'Regular',
    group: 'young',
    description: 'Step by step modules with integrated DELE preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.young.regular.b1,
    duration: '4 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B1.1', hours: 40, price: 14500 },
      { name: 'B1.2', hours: 40, price: 14500 },
      { name: 'B1.3', hours: 40, price: 14500 },
      { name: 'B1.4', hours: 40, price: 14500 },
    ]
  },
  {
    id: 'young-regular-b2',
    title: 'Spanish B2 (Young Learners)',
    subtitle: 'B2.1 – B2.4 · Upper-Intermediate · Youth (8-15)',
    level: 'B2',
    format: 'Regular',
    group: 'young',
    description: 'Step by step modules with integrated DELE preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.young.regular.b2,
    duration: '4 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B2.1', hours: 45, price: 15550 },
      { name: 'B2.2', hours: 45, price: 15550 },
      { name: 'B2.3', hours: 45, price: 15550 },
      { name: 'B2.4', hours: 45, price: 15550 },
    ]
  },
  {
    id: 'young-regular-c1',
    title: 'Spanish C1 (Young Learners)',
    subtitle: 'C1.1 – C1.4 · Advanced · Youth (8-15)',
    level: 'C1',
    format: 'Regular',
    group: 'young',
    description: 'Step by step modules with integrated DELE preparation. Ideal for learners who prefer steady progress across all skills.',
    status: 'active',
    imageURL: IMAGES.young.regular.c1,
    duration: '4 months',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C1.1', hours: 55, price: 18500 },
      { name: 'C1.2', hours: 55, price: 18500 },
      { name: 'C1.3', hours: 55, price: 18500 },
      { name: 'C1.4', hours: 55, price: 18500 },
    ]
  },

  // ── YOUNG LEARNERS SUPER INTENSIVE (A1-C1) ──────────────────────────────────
  {
    id: 'young-intensive-a1',
    title: 'Super Intensive Spanish A1 (Young Learners)',
    subtitle: 'A1 · Fast Track · Youth (8-15)',
    level: 'A1',
    format: 'Super Intensive',
    group: 'young',
    description: 'Condensed, high energy sessions for faster progression. Best suited for motivated young learners.',
    status: 'active',
    imageURL: IMAGES.young.intensive.a1,
    duration: '6-8 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A1', hours: 50, price: 19000 }
    ]
  },
  {
    id: 'young-intensive-a2',
    title: 'Super Intensive Spanish A2 (Young Learners)',
    subtitle: 'A2 · Fast Track · Youth (8-15)',
    level: 'A2',
    format: 'Super Intensive',
    group: 'young',
    description: 'Condensed, high energy sessions for faster progression. Best suited for motivated young learners.',
    status: 'active',
    imageURL: IMAGES.young.intensive.a2,
    duration: '6-8 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A2', hours: 55, price: 21000 }
    ]
  },
  {
    id: 'young-intensive-b1',
    title: 'Super Intensive Spanish B1 (Young Learners)',
    subtitle: 'B1 · Fast Track · Youth (8-15)',
    level: 'B1',
    format: 'Super Intensive',
    group: 'young',
    description: 'Condensed, high energy sessions for faster progression. Best suited for motivated young learners.',
    status: 'active',
    imageURL: IMAGES.young.intensive.b1,
    duration: '8-10 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B1', hours: 70, price: 29500 }
    ]
  },
  {
    id: 'young-intensive-b2',
    title: 'Super Intensive Spanish B2 (Young Learners)',
    subtitle: 'B2 · Fast Track · Youth (8-15)',
    level: 'B2',
    format: 'Super Intensive',
    group: 'young',
    description: 'Condensed, high energy sessions for faster progression. Best suited for motivated young learners.',
    status: 'active',
    imageURL: IMAGES.young.intensive.b2,
    duration: '10 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B2', hours: 100, price: 45500 }
    ]
  },
  {
    id: 'young-intensive-c1',
    title: 'Super Intensive Spanish C1 (Young Learners)',
    subtitle: 'C1 · Fast Track · Youth (8-15)',
    level: 'C1',
    format: 'Super Intensive',
    group: 'young',
    description: 'Condensed, high energy sessions for faster progression. Best suited for motivated young learners.',
    status: 'active',
    imageURL: IMAGES.young.intensive.c1,
    duration: '12 weeks',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C1', hours: 120, price: 58000 }
    ]
  },

  // ── YOUNG LEARNERS DELE PREPARATION (A1-C1) ─────────────────────────────────
  {
    id: 'young-examprep-a1',
    title: 'DELE A1 Preparation (Young Learners)',
    subtitle: 'A1 Prep · Focused · Youth (8-15)',
    level: 'A1',
    format: 'Exam Preparation',
    group: 'young',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Engaging, age-appropriate activities designed to build skills and boost exam confidence effectively.',
    status: 'active',
    imageURL: IMAGES.young.examprep.a1,
    duration: '6 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A1', hours: 12, price: 4500 }
    ]
  },
  {
    id: 'young-examprep-a2',
    title: 'DELE A2 Preparation (Young Learners)',
    subtitle: 'A2 Prep · Focused · Youth (8-15)',
    level: 'A2',
    format: 'Exam Preparation',
    group: 'young',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Engaging, age-appropriate activities designed to build skills and boost exam confidence effectively.',
    status: 'active',
    imageURL: IMAGES.young.examprep.a2,
    duration: '6 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'A2', hours: 12, price: 5300 }
    ]
  },
  {
    id: 'young-examprep-b1',
    title: 'DELE B1 Preparation (Young Learners)',
    subtitle: 'B1 Prep · Focused · Youth (8-15)',
    level: 'B1',
    format: 'Exam Preparation',
    group: 'young',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Engaging, age-appropriate activities designed to build skills and boost exam confidence effectively.',
    status: 'active',
    imageURL: IMAGES.young.examprep.b1,
    duration: '7 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B1', hours: 14, price: 7800 }
    ]
  },
  {
    id: 'young-examprep-b2',
    title: 'DELE B2 Preparation (Young Learners)',
    subtitle: 'B2 Prep · Focused · Youth (8-15)',
    level: 'B2',
    format: 'Exam Preparation',
    group: 'young',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Engaging, age-appropriate activities designed to build skills and boost exam confidence effectively.',
    status: 'active',
    imageURL: IMAGES.young.examprep.b2,
    duration: '9 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'B2', hours: 18, price: 9000 }
    ]
  },
  {
    id: 'young-examprep-c1',
    title: 'DELE C1 Preparation (Young Learners)',
    subtitle: 'C1 Prep · Focused · Youth (8-15)',
    level: 'C1',
    format: 'Exam Preparation',
    group: 'young',
    description: 'Short, focused modules dedicated exclusively to DELE exam tasks. Engaging, age-appropriate activities designed to build skills and boost exam confidence effectively.',
    status: 'active',
    imageURL: IMAGES.young.examprep.c1,
    duration: '9 days',
    batchSize: 'Max 12 students',
    mode: 'Online & Offline',
    modules: [
      { name: 'C1', hours: 18, price: 12500 }
    ]
  }
];

export default function DatabaseSeeder() {
  const [seedingCourses, setSeedingCourses] = useState(false);
  const [seedingTestimonials, setSeedingTestimonials] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const resetAndSeedCourses = async () => {
    if (!window.confirm('WARNING: This will delete ALL existing courses and replace them. Continue?')) return;
    if (!db) {
      toast.error('Firebase not connected.');
      return;
    }
    setSeedingCourses(true);
    setLogs([]);
    addLog('Starting courses seed process...');
    
    try {
      // 1. Delete all existing courses
      addLog('Fetching existing courses...');
      const snap = await getDocs(collection(db, 'courses'));
      addLog(`Found ${snap.size} courses to delete.`);
      
      let deleted = 0;
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'courses', d.id));
        deleted++;
        if (deleted % 5 === 0 || deleted === snap.size) {
          addLog(`Deleted ${deleted}/${snap.size} courses...`);
        }
      }
      addLog('All existing courses deleted successfully.');

      // 2. Add new courses
      addLog(`Preparing to seed ${SEED_COURSES.length} new courses...`);
      let seeded = 0;
      for (const course of SEED_COURSES) {
        const { id, ...data } = course;
        await setDoc(doc(db, 'courses', id), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        seeded++;
        addLog(`[${seeded}/${SEED_COURSES.length}] Seeded: ${course.title} (${course.format} - ${course.group})`);
      }
      
      addLog('✓ Courses seeding complete!');
      toast.success('Courses seeded successfully!');
    } catch (err) {
      console.error(err);
      addLog(`❌ Error seeding courses: ${err.message}`);
      toast.error('Courses seeding failed: ' + err.message);
    }
    setSeedingCourses(false);
  };

  const resetAndSeedTestimonials = async () => {
    if (!window.confirm('WARNING: This will delete ALL existing testimonials and replace them. Continue?')) return;
    if (!db) {
      toast.error('Firebase not connected.');
      return;
    }
    setSeedingTestimonials(true);
    setLogs([]);
    addLog('Starting testimonials seed process...');

    try {
      // 1. Delete all existing testimonials
      addLog('Fetching existing testimonials...');
      const snap = await getDocs(collection(db, 'testimonials'));
      addLog(`Found ${snap.size} testimonials to delete.`);

      let deleted = 0;
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'testimonials', d.id));
        deleted++;
        if (deleted % 2 === 0 || deleted === snap.size) {
          addLog(`Deleted ${deleted}/${snap.size} testimonials...`);
        }
      }
      addLog('All existing testimonials deleted successfully.');

      // 2. Add new testimonials
      addLog(`Preparing to seed ${SEED_TESTIMONIALS.length} testimonials...`);
      for (const item of SEED_TESTIMONIALS) {
        const { id, ...data } = item;
        await setDoc(doc(db, 'testimonials', id), {
          ...data,
          createdAt: serverTimestamp(),
        });
        addLog(`Seeded testimonial by: ${data.studentName}`);
      }

      addLog('✓ Testimonials seeding complete!');
      toast.success('Testimonials seeded successfully!');
    } catch (err) {
      console.error(err);
      addLog(`❌ Error seeding testimonials: ${err.message}`);
      toast.error('Testimonials seeding failed: ' + err.message);
    }
    setSeedingTestimonials(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-container/10 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-primary-container" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Database Seeder</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">One-click utility to reset and seed the website database</p>
          </div>
        </div>

        {/* Warning card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex gap-4 items-start">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h3 className="font-bold text-red-800 text-sm">Destructive Actions</h3>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              Running these operations will permanently clear the selected collections in Cloud Firestore
              and populate them with the new Delejaipur official catalog data. This cannot be undone.
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Courses seed card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-high flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-onSurface mb-2">Reset & Seed Courses</h3>
              <p className="text-xs text-onSurfaceVariant leading-relaxed mb-6">
                Deletes all current database courses and uploads the new catalog of 33 Spanish courses
                (Regular, Super Intensive, and Exam Prep for both Adults and Young Learners).
              </p>
            </div>
            <button
              onClick={resetAndSeedCourses}
              disabled={seedingCourses || seedingTestimonials}
              className="btn-primary w-full justify-center gap-2 py-3 disabled:opacity-60"
            >
              {seedingCourses ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Seeding Catalog…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Reset & Seed Courses
                </>
              )}
            </button>
          </div>

          {/* Testimonials seed card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-high flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-onSurface mb-2">Reset & Seed Testimonials</h3>
              <p className="text-xs text-onSurfaceVariant leading-relaxed mb-6">
                Deletes existing testimonials and populates the database with the official quotes from
                Nelson Mandela, Charlemagne, and Frank Smith.
              </p>
            </div>
            <button
              onClick={resetAndSeedTestimonials}
              disabled={seedingCourses || seedingTestimonials}
              className="btn-primary w-full justify-center gap-2 py-3 disabled:opacity-60 bg-amber-600 hover:bg-amber-700"
            >
              {seedingTestimonials ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Seeding Testimonials…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Reset & Seed Testimonials
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Logs */}
        <div className="bg-surface-low border border-surface-high rounded-2xl p-6">
          <h4 className="font-bold text-sm text-onSurface mb-3 flex items-center gap-2">
            📊 Execution Logs
            {logs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            )}
          </h4>
          <div className="bg-surface-lowest border border-surface-high rounded-xl p-4 h-64 overflow-y-auto font-mono text-[11px] text-onSurfaceVariant space-y-1">
            {logs.length === 0 ? (
              <p className="text-surface-dim italic">System ready. Run an action to see logs...</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className={log.includes('❌') ? 'text-red-600 font-semibold' : log.includes('✓') ? 'text-green-600 font-semibold' : ''}>
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
