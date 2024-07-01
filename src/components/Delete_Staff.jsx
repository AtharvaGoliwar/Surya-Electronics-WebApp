import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';


import "./Delete_Staff.css"
import Sidebar from './sidebar';


function StaffDeletionForm() {

  const [showModal, setShowModal] = useState(false);
  const [staffId, setStaffId] = useState('');

  const handleDeleteClick = (e) => {
    // Perform deletion logic (e.g., call an API to delete staff record)
    // You can pass the staffId to your backend for deletion
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    // Perform actual deletion (e.g., call an API)
    
    setShowModal(false);
  };

  return (
    <>
    <div style={{display:"flex" , marginLeft:200}}>
      <Sidebar />
      <div>
        
    <div className='user-management-container'>
      <main className="main-content">

        <header>
          
        </header>

        <section className="form-section">
          <h3 style={{ color: 'black' , textAlign: 'center' }}>Staff Deletion</h3>
          
          <form id="add-user-form">
            <input type="text" placeholder="Name" />
            
            <input type="text" placeholder="Username" value={staffId} onChange={(e) => setStaffId(e.target.value)} required/>

            <input type="text" placeholder="Enter Password" required/>
             
            <button type="submit" className='btn' onClick={handleDeleteClick}>Delete</button>
          </form>

        </section>
          

</main>
{showModal && (

          <div className="modal-overlay">
            <div className="modal-container">

              <span className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </span>

              <h3 style={{ color: 'black' , textAlign: 'center' }}>Delete Confirmation</h3>
              <p style={{ color: 'black' , textAlign: 'center' }}>Are you sure you want to delete this staff member?</p>

              <div className='button-container'>
                <button variant="default" onClick={() => setShowModal(false)}>Cancel</button>

                <button variant="danger" onClick={handleConfirmDelete}>Delete</button>
              </div>

            </div>
          </div>

        )}

       
    </div>
    
      </div>
    </div>
    </>
  );
}

export default StaffDeletionForm;
