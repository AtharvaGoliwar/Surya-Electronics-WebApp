import express from "express"
import mysql from "mysql"
// const session = require('express-session');
import session from "express-session";
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser';
// import Cookies from "cookies";
import cors from "cors"
// require("dotenv").config()
import 'dotenv/config'

// const secret = "Abhi$Ke$Liye$Ye$Secret$Key$Hai"
const app = express()
app.use(cookieParser(process.env.COOKIEKEY));
app.use(session({
    // user: {},
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly:true } // Set secure to true if using https
  }));

app.use(express.json({limit:"10mb"}))

// Define the allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://surya-electronics-web-app.vercel.app'
  ];
  
  // CORS middleware configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
    },
    credentials: true
  }));
  


// app.use(cors({origin:"http://localhost:5173",credentials:true}))
// app.use(cors({origin:"https://surya-electronics-web-app.vercel.app/",credentials:true}))
// Configure CORS options
// const corsOptions = {
//     origin: 'https://surya-electronics-web-app.vercel.app', // Your frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true
//   };
  
//   // Use the CORS middleware
//   app.use(cors(corsOptions));
  
// app.use(cors({origin:"https://tvbfxxwf-5173.inc1.devtunnels.ms/",credentials:true}))


const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    connectionLimit: 500
})

// Connect to the database
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
  });

app.post("/myroute",(req,res)=>{
    // res.json("hello world")
    // res.cookie("helo","world").send();
    // res.cookie("check","signed",{signed:true}).send()
    // console.log(req.signedCookies.check)
    // console.log(req.cookies)
    // const query = `INSERT INTO users values ("SuperAdmin","SuperAdmin@123","","","","")`
    // db.query(query,(err,data)=>{
    //     if(err) return res.json("error inserting")
    //         return res.json("added successfully")
    // })
    const query = "ALTER TABLE users MODIFY password varchar(255) COLLATE utf8_bin NOT NULL";
    db.query(query,(err,data)=>{
        if(err) return res.json({error: err})
            return res.json({message: "Alter password column successful"})
    })
})

function getUser(token){
    if(!token) return null;
    return jwt.verify(token,process.env.JWT)
}

function setUser(object){
    return jwt.sign(object,process.env.JWT)
}

 // Middleware for authentication
 const requireAuth = (req, res, next) => {
    // console.log(user1)
    const token = req.signedCookies?.cookie
    // console.log(token,"auth")
    if(!token) return res.status(403).json({error:"not logged in"})
    const user = getUser(token)
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized',admin:false, employee:false });
    }
    next();
};


// Middleware for admin role
const requireAdmin = (req, res, next) => {
    const token = req.signedCookies?.cookie
    // console.log(token,"admin cookie")
    const user = getUser(token)
    console.log(user,"user")
    // console.log(req.session.user,"middleware")
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access only',admin:false });
    }
    next();
};

const requireSuperAdmin = (req,res,next)=>{
    const token = req.signedCookies?.cookie
    const user = getUser(token)
    if(user.userId!=="SuperAdmin"){
        return res.status(403).json({message: "Forbidden: Super Admin Access only",SuperAdmin: true})
    }
    next()
}

// Middleware for employee role
const requireEmployee = (req, res, next) => {
    if (req.session.user.role !== 'employee') {
        return res.status(403).json({ message: 'Forbidden: Employee access only',employee:false });
    }
    next();
};

// Admin-only route
app.get('/admin', requireAuth, requireAdmin, (req, res) => {
    res.json({ message: 'This is an admin-only route', admin: true });
});

// Employee-only route
app.get('/employee', requireAuth, requireEmployee, (req, res) => {
    res.json({ message: 'This is an employee-only route',employee:true });
});

// Protected route for both admin and employees
app.get('/dashboard', requireAuth, (req, res) => {
    res.json({ message: 'This is a protected route for both admin and employees', user:true });
});

app.get("/superadmin",requireAuth,requireSuperAdmin,(req,res)=>{
    res.json({message: "This is an SuperAdmin only route", superadmin: true})
})

app.post('/changepassword',requireAuth,requireAdmin,(req,res)=>{
    // const {user,newpasswd} = req.body 
    const user = req.body.user
    const newpasswd = req.body.newpasswd
    const token = req.signedCookies.cookie
    const branch = getUser(token).branch
    const query = `UPDATE users SET password="${newpasswd}" where userId="${user}" AND Branch="${branch}"`
    db.query(query,(err,data)=>{
        if(err) return res.json({error:"Error in updating new password",err})
            return res.json("new password updated successfully")
    })
})


app.get("/usercheck",requireAuth,(req,res)=>{
    const user = req.query.user
    const passwd = req.query.passwd
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    const query = `SELECT * FROM users WHERE userId="${user}" AND password = "${passwd}" AND branch="${branch}"`
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.get("/allusers",requireAuth,requireSuperAdmin,(req,res)=>{
    const query = "SELECT * FROM users"
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.get("/getuserinfo",requireAuth,requireAdmin,(req,res)=>{
    const user = req.query.user
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    // console.log(branch)
    const query = `SELECT * FROM users WHERE userId="${user}" AND branch="${branch}"`
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.get("/users",requireAuth,(req,res)=>{
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    const query = "SELECT * FROM users WHERE branch=?"
    db.query(query,[branch],(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.post("/addUser",requireAuth,requireAdmin,(req,res)=>{
    const query = "INSERT INTO users VALUES (?)";
    const val = [req.body.userId, req.body.password, req.body.role, req.body.name, req.body.number,req.body.branch]
    db.query(query,[val],(err,data)=>{
        if (err) return res.json(err)
            return res.json("user added")
    })
})

app.delete("/deleteUser",requireAuth,requireAdmin,(req,res)=>{
    const token = req.signedCookies.cookie
    const branch = getUser(token).branch
    const {user,passwd,role} = req.body
    if(role!=="admin"){
        const q1 = "SELECT userId from deletedemp"
        db.query(q1,(err,data)=>{
            if(err) return res.json("error in getting deleted emp data")
                for(let i=0;i<data.length;i++){
                    if(data[i]["userId"]===user){
                        const q2 = `DELETE FROM deletedemp WHERE userId=\`${user}\``
                        db.query(q2,(err,data)=>{
                            if(err) return res.json("error deleteting data")
                                // return res.json("redundant data deleted")
                        })
                    }
                }
        })
        const query = "INSERT INTO deletedemp values(?,?,?)"
        db.query(query,[user,passwd,branch],(err,data)=>{
            if(err) return res.json(err)
                // return res.json("User added to deleted database successfully")
        })
        // const query1 = `DROP TABLE \`${user}\``
        // db.query(query1,(err,data)=>{
        //     if(err) return res.json(err)
        //         return res.json("User Deleted Successfully")
        // })
    }
    const query2 = `DELETE FROM users where userId="${user}"`
    db.query(query2,(err,data)=>{
        if(err) return res.json(err)
            return res.json("data deleted successfully")
    })

})

app.post('/createTable',requireAuth,requireAdmin, (req, res) => {
    const { user,role } = req.body;
    if(role!=="admin"){
        if (!user) {
            return res.status(400).json({ error: 'userId is required' });
        }
        
        const tableName = user; // Escape the userId to use it as a table name safely
        const q1 = `DROP TABLE IF EXISTS \`${tableName}\``
        db.query(q1,(err,data)=>{
            if(err) return res.json("error dropping table")

        })
        const query = `
        CREATE TABLE \`${tableName}\` (
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
    return res.json({ message: `Table ${user} created successfully` });
});
}else{
    return res.json({message: "No table needed for Admins"})
}
});
  
let user1=null;



app.post("/login",(req,res)=>{
    // const query="SELECT * FROM users WHERE userId=?;"
    const {user, passwd} = req?.body;
    // const cookies = new Cookies(req, res);
    // const query = `SELECT * FROM users WHERE userId = ${req?.body.userId}`
    // const q1 = 'INSERT INTO users values("admin", "admin123", "admin", "admin", "1234567890", "WKD")'
    // db.query(q1,(err,data)=>{
    //     if(err) return res.json({error:"error inserting users table",err})
    // })

    const query = 'SELECT * FROM users WHERE userId = ? AND password = ?';
    db.query(query,[user,passwd],(err,data)=>{
        if(err) return res.json(err)
            if(data.length===0){
                return res.status(401).json({ message: 'Invalid credentials', username: user, passwd: passwd });
            }
            req.session.user = {userId: data[0]["userId"], role: data[0]["role"]};
            // user1 = req.session.user;
            // const token = jwt.sign({userId: data[0]["userId"], role: data[0]["role"] },secret)
            const token = setUser({userId: data[0]["userId"], role: data[0]["role"], branch: data[0]["branch"]})
            res.cookie("cookie", token, {signed:true, sameSite:"none",secure:true,maxAge:"3600000" });
            // cookies.set("token",token)
            // console.log(token)
            return res.json({message: "Login Successful", username: user, passwd: passwd, role:req.session.user.role});
    })
})

app.get('/session',requireAuth,(req,res)=>{
    const token = req.signedCookies?.cookie
    const user = getUser(token)
    // console.log(req.signedCookies.cookie)
    if(!req.signedCookies.cookie){
        return res.status(401).json({error:"no user"})
    }
    // console.log(user1)
    return res.json({userId: user.userId})
})

app.post('/logout',requireAuth, (req, res) => {
    // console.log(req.session.user,"logout")
    res.clearCookie("cookie", {
        signed: true,
        sameSite: "none",
        secure: true
      });
      // Close the connection when done with it
    // db.end((err) => {
    //     if (err) {
    //       console.error('Error closing MySQL connection:', err);
    //     } else {
    //       console.log('MySQL connection closed');
    //     }
    //   });
    // cookies.set("token",null,{httpOnly:true})

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


app.post("/truncateTable",requireAuth,requireAdmin,(req,res)=>{
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


app.post('/send',requireAuth,requireAdmin, (req, res) => {
    const userId = req.body.userId;
    const date = req.body.date;
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    if (!userId || !date || date.length===0) {
        return res.status(400).json({ error: 'User ID and Date both are required' });
    }

    let q1 = 'SELECT * FROM customers_small WHERE salesEmp = ? AND `Invoice Date` in (?) AND Branch=?';
    // let q1 = 'SELECT * FROM customers WHERE salesEmp= ? AND `Invoice Date` in (?)';
    
    db.query(q1, [userId, date,branch], async (err, data) => {
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

app.get("/emp",requireAuth,(req,res)=>{
    const empid = req.query.empid;
    const query = `SELECT * FROM \`${empid}\` order by bpName`
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.get("/deletedemp",requireAuth,requireAdmin,(req,res)=>{
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    // const q1 = "CREATE TABLE deletedemp(userId varchar(255), password varchar(20), branch varchar(255))"
    // db.query(q1,(err,data)=>{
    //     if(err) return res.json({error:err})
    // })
    const query = "SELECT * FROM deletedemp WHERE branch=? order by userId"
    let users=[];
    let l=0;
    db.query(query,[branch],(err,data)=>{
        if(err) return res.json(err)
            // return res.json(data)
        // return res.json(data[0]["userId"])
        for(let i=0;i<data.length;i++){
            users[l] = data[i]["userId"]
            l++;
        }
        return res.json(users)
        // const placeholders = users.map(() => '?').join(',');
        // const sql = `SELECT * FROM customers_small WHERE salesEmp IN (${placeholders})`;
        // // const sql = `SELECT * FROM customers WHERE salesEmp IN (${placeholders})`;
        // db.query(sql,users,(err,data)=>{
        //     if(err) return res.json(err)
        //         return res.json(data)
        // })
        // return res.json(users)
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

app.post("/sendextradata",requireAuth,requireAdmin,async (req,res)=>{
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
                    // console.log(`Insertion Successful for salesEmp: ${users[i]}`)
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
            // console.log(`Insertion Successful for salesEmp: ${users[i % usersLength]}`);
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


// app.post("/setreview",requireAuth,async (req,res)=>{
//     const userId = req.body.empid;
//     const data = req.body.data;
//     const updatePromises = Object.keys(data).map(async (key)=>{
//         // if(key==="empid"){
//         //     return null;
//         // }

//         const updatequery = `UPDATE \`${userId}\` SET review = ?, description=? where ItemName=? AND bpcode=?`
//         return new Promise((resolve,reject)=>{
//             if(data[key].length<2){
//                 db.query(updatequery,[data[key][0]["review"],data[key][0]["description"],data[key][0]["ItemName"],key],(err,result)=>{
//                     if(err){
//                         console.log('Error Updating data:', err)
//                         return reject(err)
//                     }
//                     resolve(result)
//                 })
//             }        
//         })
//     })

//     try{
//         await Promise.all(updatePromises.filter(Boolean));
//         res.json({ message: 'All reviews updated successfully' });
//     }catch(err){
//         res.status(500).json({error: "Error in updation",details: err})
//     }

//     const updateNestedPromises = Object.keys(data).map(async (key)=>{
//         const updatequery = `UPDATE \`${userId}\` SET review = ?, description=? where ItemName=? AND bpcode=?`
//         return new Promise((resolve,reject)=>{
//             if(data[key].length>1){
//                 data[key].map(async (item)=>{

//                     db.query(updatequery,[data[key][0]["review"],data[key][0]["description"],data[key][0]["ItemName"],key],(err,result)=>{
//                         if(err){
//                             console.log('Error Updating data:', err)
//                             return reject(err)
//                         }
//                         resolve(result)
//                     })
//                 })
//             }        
//         })
//     })

//     try{
//         await Promise.all(updateNestedPromises);
//         // res.json({ message: 'All nested reviews updated successfully' });
//     }catch(err){
//         res.status(500).json({error: "Error in nested updation",details: err})
//     }
//     })

app.post("/setreview", requireAuth, async (req, res) => {
    const userId = req.body.empid;
    const data = req.body.data;

    const updatePromises = Object.keys(data).map(async (key) => {
        if (data[key].length < 2) {
            const updatequery = `UPDATE \`${userId}\` SET review = ?, description=? WHERE ItemName=? AND bpcode=?`;
            const item = data[key][0];
            return new Promise((resolve, reject) => {
                db.query(updatequery, [item.review, item.description, item.ItemName, key], (err, result) => {
                    if (err) {
                        console.log('Error Updating data:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        } else {
            // If there are nested items, handle them separately
            const nestedPromises = data[key].map(item => {
                const updatequery = `UPDATE \`${userId}\` SET review = ?, description=? WHERE ItemName=? AND bpcode=?`;
                return new Promise((resolve, reject) => {
                    db.query(updatequery, [item.review, item.description, item.ItemName, key], (err, result) => {
                        if (err) {
                            console.log('Error Updating data:', err);
                            return reject(err);
                        }
                        resolve(result);
                    });
                });
            });
            return Promise.all(nestedPromises);
        }
    });

    try {
        await Promise.all(updatePromises);
        res.json({ message: 'All reviews updated successfully' });
    } catch (err) {
        res.status(500).json({ error: "Error in updation", details: err });
    }
});



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
    
    

    app.post("/finalreview",requireAuth,requireAdmin, async (req, res) => {
        const data = req.body;
    
        try {
            for (const key of Object.keys(data)) {
                for (const rec of data[key]) {
                    if(rec.review!=='' && rec.description!==""){

                        // Log the current values
                        console.log(`Updating review for salesEmp: ${rec.salesEmp}, bpcode: ${rec.bpcode}, review: ${rec.review}, description: ${rec.description}`);
        
                        const updateQuery = 'UPDATE customers_small SET review = ?, description=? WHERE ItemName = ? AND salesEmp = ?';
                        // const updateQuery = 'UPDATE customers SET review = ?, description=? WHERE ItemName = ? AND salesEmp = ?';
                        const params = [rec.review,rec.description, rec.ItemName, rec.salesEmp];
        
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

app.get("/alldata",requireAuth,requireAdmin, (req, res) => {
    const date = req.query.date;
    let query = "";
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch;
    
    if (date && date.toString() !== "") {
        query = "SELECT * FROM customers_small WHERE `Invoice Date` IN (?) AND Branch=?";
        // query = "SELECT * FROM customers WHERE `Invoice Date` in (?) AND Branch=?";
        db.query(query, [date,branch], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    } else {
        query = "SELECT * FROM customers_small WHERE Branch=?";
        // query = "SELECT * FROM customers";
        db.query(query,[branch], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    }
});

app.post("/upload",requireAuth,requireSuperAdmin,(req,res)=>{
    const {headers, rows} = req.body
    const table = "customers_small";
    const columns = headers.map(header=> `\`${header}\` varchar(255)`).join(',')
    const query1 = `DROP TABLE IF EXISTS ${table}`
    db.query(query1,(err,data)=>{
        if(err) return res.json({error:err, message:"table did not drop"})
            console.log("table dropped")
    })
    
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${table} (${columns},review varchar(255) not null default "", description varchar(255) not null default "")`;
    db.query(createTableQuery, (err, result) => {
        if (err) {
        console.error('Error creating table:', err);
        res.status(500).send('Error creating table');
        return;
        }

        const placeholders = rows.map(row => `(${headers.map(() => '?').join(',')})`).join(',');
        const flatValues = rows.reduce((acc, row) => acc.concat(headers.map(header => row[header])), []);

        const insertQuery = `INSERT INTO ${table} (${headers.map(header => `\`${header}\``).join(',')}) VALUES ${placeholders}`;
        db.query(insertQuery, flatValues, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        res.send('Table created and data inserted successfully');
        });
    });
})

app.post("/uploadIncentive",(req,res)=>{
    const {headers, rows} = req.body
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    const table = `incentive_${branch}`;
    const columns = headers.map(header=> `\`${header}\` varchar(255)`).join(',')
    const query1 = `DROP TABLE IF EXISTS ${table}`
    db.query(query1,(err,data)=>{
        if(err) return res.json({error:err, message:"table did not drop"})
    })
    
    const createTableQuery = `CREATE TABLE IF NOT EXISTS \`${table}\` (${columns},SNLC varchar(255) not null default "", sellingPrice varchar(255) not null default "",typeSelling varchar(255) not null default "",incentiveType varchar(255) not null default "",SRPQty varchar(255) not null default "",incentiveTotal varchar(255) not null default "",remark varchar(255) not null default "")`;
    db.query(createTableQuery, (err, result) => {
        if (err) {
        console.error('Error creating table:', err);
        res.status(500).json({message:'Error creating table',err:err});
        return;
        }

        const placeholders = rows.map(row => `(${headers.map(() => '?').join(',')})`).join(',');
        const flatValues = rows.reduce((acc, row) => acc.concat(headers.map(header => row[header])), []);

        const insertQuery = `INSERT INTO ${table} (${headers.map(header => `\`${header}\``).join(',')}) VALUES ${placeholders}`;
        db.query(insertQuery, flatValues, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        res.send('Table created and data inserted successfully');
        });
    });
})

app.post("/sendIncentive",requireAuth, async (req,res)=>{
    const userId = req.body.empid;
    const data = req.body.data;
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    const table = `incentive_${branch}`;

    const updatePromises = data.map((rec)=>{
        const updateQuery = `UPDATE ${table} SET SNLC=?, sellingPrice=?, typeSelling=?, incentiveType=?, SRPQty=?, incentiveTotal=?, remark=? WHERE salesEmp=? and ItemName=?`
        return new Promise((resolve,reject)=>{
            db.query(updateQuery,[rec.SNLC, rec.sellingPrice, rec.typeSelling, rec.incentiveType, rec.SRPQty, rec.incentiveTotal, rec.remark, rec.salesEmp,rec.ItemName],(err,result)=>{
                if (err) {
                    console.log('Error Updating data:', err);
                    return reject(err);
                }
                resolve(result);
            })
        })
    })
    try {
        await Promise.all(updatePromises);
        res.json({ message: 'All reviews updated successfully' });
    } catch (err) {
        res.status(500).json({ error: "Error in updation", details: err });
    }
})

app.get("/incentiveAllData",(req,res)=>{
    const token = req.signedCookies?.cookie
    const branch = getUser(token).branch
    const table = `incentive_${branch}`;
    const query =`SELECT * FROM ${table}`
    db.query(query,(err,data)=>{
        if(err) return res.json({error: err})
            return res.json(data)
    })
})



const port = process.env.PORT || 8800;

app.listen(port,()=>{
    console.log("Connected to backend")
})