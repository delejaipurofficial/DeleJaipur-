import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Public pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Exams from './pages/Exams';
import EnrollmentForm from './pages/EnrollmentForm';
import FeedbackForm from './pages/FeedbackForm';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import CourseManager from './pages/admin/CourseManager';
import ExamTracker from './pages/admin/ExamTracker';
import LeadsDashboard from './pages/admin/LeadsDashboard';
import TestimonialsManager from './pages/admin/TestimonialsManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: '12px',
              fontSize: '14px',
              background: '#191c1d',
              color: '#F8F9FA',
            },
            success: {
              iconTheme: { primary: '#E31B23', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* Public routes — no authentication needed */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/enroll" element={<EnrollmentForm />} />
          <Route path="/feedback" element={<FeedbackForm />} />

          {/* Admin login — hidden route */}
          <Route path="/admin-portal" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route
            path="/admin-portal/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin-portal/courses"
            element={<ProtectedRoute><CourseManager /></ProtectedRoute>}
          />
          <Route
            path="/admin-portal/exams"
            element={<ProtectedRoute><ExamTracker /></ProtectedRoute>}
          />
          <Route
            path="/admin-portal/leads"
            element={<ProtectedRoute><LeadsDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin-portal/testimonials"
            element={<ProtectedRoute><TestimonialsManager /></ProtectedRoute>}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
