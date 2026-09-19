import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';

import Dashboard from './pages/staff/Dashboard';
import Eligibility from './pages/staff/Eligibility';
import Claims from './pages/staff/Claims';
import ClaimDetail from './pages/staff/ClaimDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import ContentEditor from './pages/admin/ContentEditor';
import Users from './pages/admin/Users';
import AuditLogs from './pages/admin/AuditLogs';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/eligibility" element={<ProtectedRoute><Eligibility /></ProtectedRoute>} />
      <Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
      <Route path="/claims/:id" element={<ProtectedRoute><ClaimDetail /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute roles={['admin']}><ContentEditor /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
      <Route path="/admin/audit-logs" element={<ProtectedRoute roles={['admin']}><AuditLogs /></ProtectedRoute>} />
    </Routes>
  );
}
