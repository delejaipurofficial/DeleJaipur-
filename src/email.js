import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID_ADMIN = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN;
const TEMPLATE_ID_STUDENT = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_STUDENT;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

export const sendLeadEmail = async (formData, courseName) => {
  if (!SERVICE_ID || !TEMPLATE_ID_ADMIN || !TEMPLATE_ID_STUDENT || !PUBLIC_KEY) {
    console.warn('[EmailJS] Credentials not fully configured in .env. Skipping email sending.');
    return;
  }

  const commonParams = {
    student_name: formData.studentName || formData.name,
    student_email: formData.email,
    student_phone: formData.phone || formData.mobile,
    course_name: courseName || 'General Inquiry',
    message: formData.message || 'No additional message provided.',
  };

  try {
    // 1. Send ALERt Email to Delejaipur Admin
    await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID_ADMIN, 
      { ...commonParams, to_email: 'delejaipurofficial@gmail.com' }, 
      PUBLIC_KEY
    );

    // 2. Send ACKNOWLEDGEMENT Email to Student
    await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID_STUDENT, 
      { ...commonParams, to_email: formData.email }, 
      PUBLIC_KEY
    );

    console.log('Both Admin and Student emails successfully sent via EmailJS');
  } catch (err) {
    console.error('Failed to send emails via EmailJS:', err);
  }
};
