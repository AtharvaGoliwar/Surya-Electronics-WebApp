import React from 'react';
import './Logout.css';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';

const Logout = ({ showModal, setShowModal, handleLogout }) => {
  const navigate = useNavigate();
  return (

    <div>
      <Sidebar />
    
    
    showModal && (
      <div className="modal-overlay">
        <div className="modal-container">
          <span className="modal-close" onClick={() => navigate('/')}>
            &times;
          </span>

          <h3 style={{ color: 'black', textAlign: 'center' }}>Logout Confirmation</h3>
          <p style={{ color: 'black', textAlign: 'center' }}>Are you sure you want to logout?</p>

          <div className="button-container">
            <button variant="default" onClick={() => navigate('/')}>Cancel</button>
            <button variant="danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
      
    )
    </div>
    
  );
  
};

export default Logout;
