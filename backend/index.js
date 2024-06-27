import express from "express"
import mysql from "mysql"
// const session = require('express-session');
import session from "express-session";
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using https
  }));

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Admin@123",
    database:"surya"
})

// Connect to the database
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
  });

app.get("/",(req,res)=>{
    res.json("hello world")
})

app.get("/users",(req,res)=>{
    const query = "SELECT * FROM USERS"
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.post("/addUser",(req,res)=>{
    const query = "INSERT INTO users VALUES (?)";
    const val = [req.body.userId, req.body.password]
    db.query(query,[val],(err,data)=>{
        if (err) return res.json(err)
            return res.json("user added")
    })
})

app.post('/createTable', (req, res) => {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: 'userId is required' });
    }
  
    const tableName = mysql.escapeId(user); // Escape the userId to use it as a table name safely
  
    const query = `
      CREATE TABLE ${tableName} (
        Branch VARCHAR(255),
        docNum VARCHAR(255),
        \`Invoice Date\` DATE,
        bpcode VARCHAR(255),
        bpName VARCHAR(255),
        \`Mobile Phone\` VARCHAR(255),
        ItemName VARCHAR(255),
        Brand VARCHAR(255),
        Category VARCHAR(255),
        salesEmp VARCHAR(255),
        ItemTotal DECIMAL(10, 2),
        review VARCHAR(30),
        description VARCHAR(255)
      );
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).json({ error: 'Error creating table' });
      }
      res.json({ message: `Table ${user} created successfully` });
    });
  });
  
let user1 = "";

app.post("/login",(req,res)=>{
    // const query="SELECT * FROM users WHERE userId=?;"
    const {user, passwd} = req?.body;
    // const query = `SELECT * FROM users WHERE userId = ${req?.body.userId}`
    const query = 'SELECT * FROM users WHERE userId = ? AND password = ?';
    db.query(query,[user,passwd],(err,data)=>{
        if(err) return res.json(err)
            if(data.length===0){
                return res.status(401).json({ message: 'Invalid credentials', username: user, passwd: passwd });
            }
            req.session.user = data[0];
            user1 = req.session.user;
            return res.json({message: "Login Successful", username: user, passwd: passwd});
    })
})

app.get('/session',(req,res)=>{
    if(user1!==""){
        res.json(user1)
    }else{
        res.status(401).json({message:"not"})
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
  });

 /* app.post('/send',(req,res)=>{
    const userId = req?.body.userId
    //   const query = 'SELECT userId FROM users';
    //   let users=[];
    //   let l=0;
    //   db.query(query, (err,data)=>{
    //     if(err) return res.json(err)
    //     for(let i=0;i<data.length;i++){
    //         users[l]=data[i]
    //         l++;
    //     }
    //     })
        let q1 = 'select * from customers_small where salesEmp = ?';
        db.query(q1,[userId],(err,data)=>{
            if(err) return res.json(err)
                // res.send(data)
            // let d=0;
            // for(let i=0;i<data.length;i++){
                // d++;
                let tableName = "101"
                // res.json({message:"loop works"})
                //     res.json({message:"works here"})
                 //     let value1 = Object.values(data[i]);
                //     let placeholders = value1.map(()=>'?').join(', ');
                //     let q2 = `insert into \`${tableName}\` values (${placeholders})`;
                //     db.query(q2,value1,(err,data)=>{
                //         if(err) return res.json(err)
                //         return res.json({message:"data added"})
                //     }) 

            // res.json(data)
            for(let i=0;i<data.length;i++){
                const values = Object.values(data[i])
                const placeholders = values.map(()=>'?').join(', ')
                // const insQuery = `INSERT INTO \`${userId}\` VALUES (${values}) `
                const insQuery = `INSERT INTO \`101\` VALUES (${values})`
                console.log("working")
                db.query(insQuery,(err,data)=>{
                    if(err) res.json(err)
                        res.json({message:"sub data added"})
                })
            }
            res.json("data added")
                
        })
})*/


app.post("/truncateTable",(req,res)=>{
    const userId = req.body.userId
    if(!userId){
        return res.status(400).json({error:"userid needed"})
    }
    let query=`TRUNCATE TABLE \`${userId}\``
    db.query(query,(err,data)=>{
        if(err){
            return res.json({error:"query not working"})
        }
        return res.json("truncated successfully")
    }) 
    
    
})


app.post('/send', (req, res) => {
    const userId = req.body.userId;
    const date = req.body.date;
    
    if (!userId || !date || date.length===0) {
        return res.status(400).json({ error: 'User ID and Date both are required' });
    }

    // let q1 = 'SELECT * FROM customers_small WHERE salesEmp = ? AND `Invoice Date` in (?)';
    let q1 = 'SELECT * FROM customers WHERE salesEmp= ? AND `Invoice Date` in (?)';
    
    db.query(q1, [userId, date], async (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Error fetching data' });
        }
        
        if (data.length === 0) {
            return res.json({ message: `No data found for the provided userId ${userId} and date ${date}` });
        }

        let tableName = userId;
        const insertPromises = data.map(row => {
            const values = Object.values(row);
            const placeholders = values.map(() => '?').join(', ');
            const insQuery = `INSERT INTO \`${tableName}\` VALUES (${placeholders})` ;

            return new Promise((resolve, reject) => {
                db.query(insQuery, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });

        try {
            await Promise.all(insertPromises);
            res.json({ message: 'All data inserted successfully',date:date });
        } catch (insertError) {
            res.status(500).json({ error: 'Error inserting data', details: insertError });
        }
    });
});

app.get("/emp",(req,res)=>{
    const empid = req.query.empid;
    const query = `SELECT * FROM \`${empid}\` order by bpName`
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.get("/deletedemp",(req,res)=>{
    const query = "SELECT * FROM deletedemp order by userId"
    let users=[];
    let l=0;
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            // return res.json(data)
        // return res.json(data[0]["userId"])
        for(let i=0;i<data.length;i++){
            users[l] = data[i]["userId"]
            l++;
        }
        // return res.json(users)
        const placeholders = users.map(() => '?').join(',');
        const sql = `SELECT * FROM customers_small WHERE salesEmp IN (${placeholders})`;
        db.query(sql,users,(err,data)=>{
            if(err) return res.json(err)
                return res.json(data)
        })
    })

    
    // return res.json(users)

    
    
    })

    // Utility function to execute a query
    const queryDatabase = (query, params) => {
        return new Promise((resolve, reject) => {
            db.query(query, params, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    };

app.post("/sendextradata",async (req,res)=>{
    const users = req.body.users;
    const usersLength = users.length
    const data = req.body.data
    const dataLength = data.length;
    const perEmpRecs = Math.floor(dataLength/usersLength);
    const remainder = dataLength%usersLength;
    let cnt=0;

    if (!users || !data) {
        return res.status(400).json({ error: "Employees and data are required" });
    }
    try{
        for(let i=0;i<usersLength;i++){
            for(let j=0;j<perEmpRecs;j++){
                const row = data[(i*perEmpRecs)+j]
                const values = Object.values(row);
                const placeholders = values.map(() => '?').join(', ');
                const tableName = users[i]
                const insQuery = `INSERT INTO \`${tableName}\` VALUES (${placeholders})` ;

                try {
                    const result = await queryDatabase(insQuery, values);
                    // console.log(`Insertion successful for salesEmp: ${key}, bpcode: ${rec.bpcode}, result: ${result}`);
                    console.log(`Insertion Successful for salesEmp: ${users[i]}`)
                } catch (error) {
                    console.error(`Error updating data for salesEmp: ${users[i]}`, error);
                    throw error
                }

            }
        }

        // Handle any remaining data
    if (remainder > 0) {
        for (let i = 0; i < remainder; i++) {
          const row = data[(usersLength * perEmpRecs) + i];
          const values = Object.values(row);
          const placeholders = values.map(() => '?').join(', ');
          const tableName = users[i % usersLength];
          const insQuery = `INSERT INTO \`${tableName}\` VALUES (${placeholders})`;
  
          try {
            const result = await queryDatabase(insQuery, values);
            console.log(`Insertion Successful for salesEmp: ${users[i % usersLength]}`);
          } catch (error) {
            console.error(`Error updating data for salesEmp: ${users[i % usersLength]}`, error);
            throw error;
          }
        }
      }
      
        res.json({ message: 'All reviews added successfully' });
    }catch(err){
        console.log(err)
    }

})


app.post("/setreview",async (req,res)=>{
    const userId = req.body.empid;
    const data = req.body;
    const updatePromises = Object.keys(data).map(async (key)=>{
        if(key==="empid"){
            return null;
        }

        const updatequery = `UPDATE \`${userId}\` SET review = ?, description=? where bpcode=?`
        return new Promise((resolve,reject)=>{
            db.query(updatequery,[data[key]["review"],data[key]["description"],key],(err,result)=>{
                if(err){
                    console.log('Error Updating data:', err)
                    return reject(err)
                }
                resolve(result)
            })
        })
    })

    try{
        await Promise.all(updatePromises.filter(Boolean));
        res.json({ message: 'All reviews updated successfully' });
    }catch(err){
        res.status(500).json({error: "Error in updation",details: err})
    }


    })


    // app.post("/finalreview",async (req,res)=>{
    //     // const userId = req.body.empid;
    //     const data = req.body;
    //     // const keys = Object.keys(data)
    //     const updatePromises = Object.keys(data).map(async (key)=>{
    //         if(key==="admin"){
    //             return null;
    //         }
    //         data[key].map((rec)=>{
    //             const updatequery=`UPDATE customers_small SET review = ? where salesEmp=? and bpcode=? and ItemName=?`
    //         return new Promise((resolve,reject)=>{
    //             db.query(updatequery,[rec.review,key,rec.bpcode,rec.ItemName],(err,result)=>{
    //                 if(err){
    //                     console.log('Error Updating data:', err)
    //                     if(result.data.length===0){
    //                         return res.status(401).json("chutiya")
    //                     }
    //                 return reject(err)
    //             }
    //             resolve(result)
    //             })
    //         })
    //     })
    //     })
    
    //     try{
    //         await Promise.all(updatePromises.filter(Boolean));
    //         res.json({ message: 'All reviews updated successfully' });
    //     }catch(err){
    //         res.status(500).json({error: "Error in updation",details: err})
    //     }
    
    
    //     })
    
    

    app.post("/finalreview", async (req, res) => {
        const data = req.body;
    
        try {
            for (const key of Object.keys(data)) {
                for (const rec of data[key]) {
                    if(rec.review!=='' && rec.description!==""){

                        // Log the current values
                        console.log(`Updating review for salesEmp: ${rec.salesEmp}, bpcode: ${rec.bpcode}, review: ${rec.review}, description: ${rec.description}`);
        
                        // const updateQuery = 'UPDATE customers_small SET review = ?, description=? WHERE bpcode = ? AND salesEmp = ?';
                        const updateQuery = 'UPDATE customers SET review = ?, description=? WHERE bpcode = ? AND salesEmp = ?';
                        const params = [rec.review,rec.description, rec.bpcode, rec.salesEmp];
        
                        try {
                            const result = await queryDatabase(updateQuery, params);
                            console.log(`Update successful for salesEmp: ${rec.salesEmp}, bpcode: ${rec.bpcode}, result: ${JSON.stringify(result)}`);
                        } catch (error) {
                            console.error(`Error updating data for salesEmp: ${rec.salesEmp}, bpcode: ${rec.bpcode}`, error);
                        }
                    }
                }
            }
            res.json({ message: 'All reviews updated successfully' });
        } catch (err) {
            console.error('Error in update operation:', err);
            res.status(500).json({ error: 'Error in updation', details: err });
        }
    });
    
    
    

// app.get("/alldatafiltered",(req,res)=>{
//     const date = req.query.date;
//     console.log(date.toString())
//     const query = "SELECT * FROM customers_small where `Invoice Date` in (?)"
//     db.query(query,[date],(err,data)=>{
//         if(err) return res.json(err)
//             return res.json(data)
//     })
// })

// app.get("/alldata",(req,res)=>{
//     const query ="SELECT * FROM customers_small"
//     db.query(query,(err,data)=>{
//         if(err)return res.json(err)
//             return res.json(data)
//     })
// })

app.get("/alldata", (req, res) => {
    const date = req.query.date;
    let query = "";
    
    if (date && date.toString() !== "") {
        // query = "SELECT * FROM customers_small WHERE `Invoice Date` IN (?)";
        query = "SELECT * FROM customers WHERE `Invoice Date` in (?)";
        db.query(query, [date], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    } else {
        query = "SELECT * FROM customers";
        db.query(query, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    }
});




app.listen(8800,()=>{
    console.log("Connected to backend")
})