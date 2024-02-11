// NotificationToast.js
import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

const NotificationToast = ({ show, onClose, message, variant='success' }) => {
  return (
    <Toast
      show={show}
      onClose={onClose}
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 1,
      }}
      bg={variant}
      text="white"
    >
      <Toast.Header closeButton={true}>
        <strong className="mr-auto">Notification</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default NotificationToast;
