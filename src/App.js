import React from 'react';
import Employee from './Employee';
import './App.css';

function App() {
    const employees = [
        {
            name: 'Samuel Williams',
            phone: '450966493325',
            category: 'AC',
            brand: 'Brown Ltd',
            note: 'Note: May Discuss FTKLSB1ULV16W (2.0T, 3*)'
        },
        {
            name: 'John Doe',
            phone: '1234567890',
            category: 'Electronics',
            brand: 'XYZ Ltd',
            note: 'Note: Discuss Model ABC123'
        },
        {
            name: 'Jane Smith',
            phone: '0987654321',
            category: 'Home Appliances',
            brand: 'Home Ltd',
            note: 'Note: Discuss Model DEF456'
        },
        {
            name: 'Alice Johnson',
            phone: '1122334455',
            category: 'Furniture',
            brand: 'FurniCo',
            note: 'Note: Discuss Model GHI789'
        },
        {
            name: 'Bob Brown',
            phone: '2233445566',
            category: 'Gardening',
            brand: 'GardenPro',
            note: 'Note: Discuss Model JKL012'
        }
    ];

    return (
        <div className="App">
            {employees.map((employee, index) => (
                <Employee
                    key={index}
                    name={employee.name}
                    phone={employee.phone}
                    category={employee.category}
                    brand={employee.brand}
                    note={employee.note}
                />
            ))}
        </div>
    );
}

export default App;
