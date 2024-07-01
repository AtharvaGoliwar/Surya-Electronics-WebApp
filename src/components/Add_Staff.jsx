import React from 'react';
import Sidebar from './sidebar';
import "./Add_Staff.css"


function StaffRegistrationForm() {
  return (
    <div style={{display:"flex" , marginLeft:200}}>
      <Sidebar />
      <div>

    <div className='user-management-container'>
      <main className="main-content">

        <header>
          
        </header>

        <section className="form-section">
        <h3 style={{ color: 'black' , textAlign: 'center' }}>Staff Registeration</h3>

          
          <form id="add-user-form">
            <input type="text" placeholder="Name" required/>
            {/* <input type="text" placeholder="Last Name" /> */}
            <input type="text" placeholder="Username" required/>
            <input type='number' placeholder="Phone Number" required/>
            <input type="text" placeholder="Enter Password" required/>
            
            <select>
              <option disabled selected>Select Role</option>
              <option>Sales Man</option>
              <option>Manager</option>
            </select>
             
             <button type="submit" className='btn'>Submit</button>
          </form>

          {/*<section className='popup-container'>
            <h3>Hello</h3>


          </section>*/}

        </section>

      </main>
    </div>
      </div>
    </div>
  );
}

export default StaffRegistrationForm;
