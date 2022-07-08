const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const mysql = require("mysql");
const fs = require("fs"); //파일을 읽어 오도록
const dbinfo = fs.readFileSync('./database.json');
// 받아온 json데이처를 객체형태로 변경 JSON.parse
const conf = JSON.parse(dbinfo); 

// connection mysql연결 createConnection()
// connection.connect() 연결하기
// connection.end() 연결종료
// connection.query('쿼리문', callback함수)
// 위에서 콜백함수에는 callback(error, result, result의 field정보)  

//awa
const connection = mysql.createConnection({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database,
})
app.use(express.json());
app.use(cors());

// app.get('/customers', async (req,res)=>{
   // res.send("고객정보입니다.");  localhost:3001/customers하면 웹페이지에 고객정보입니다 나옴
// })
app.get('/customers', async (req,res)=>{
    // connection.connect(); // 연결하기
    connection.query(
        "select * from customers_table",
        (err, rows, fields)=>{  //connection.query('쿼리문', callback함수) callback(error, result, result의 field정보)  
            res.send(rows);
            // console.log(fields); //필드의 컴럼정보도 no,name,phone등등
        }
    );
    // connection.end(); // 연결종료
})

// 고객리스트에서 고객한명만 받아오는 데이터
app.get('/customers/:no', async (req,res)=> {  //DetailCustomer컴포넌트에서 axios.get(데이터 조회)할때 경로랑 같아야함
    const params = req.params;
    connection.query(
        `select * from customers_table where no=${params.no}`,
        (err, rows, fields)=>{
            res.send(rows[0]); // ** 서버에서 배열로 받아옴  
            // console.log(rows[0]); 
        }
    )
})
// connection.query('쿼리문', callback함수)
// 고객등록
// insert into members(name,tel,addr,license)
// values('김승용','051-456-5464','부산광역시 남구','y');
app.post('/customers', async (req,res)=> {
    const body = req.body;
    const { c_name,c_phone,c_birth,c_gender,c_add1,c_add2} = body;
    console.log(body);
    connection.query(`insert into customers_table(name,phone,birth,gender,add1,add2)values(
        '${c_name}',
        '${c_phone}',
        '${c_birth}',
        '${c_gender}',
        '${c_add1}',
        '${c_add2}')`,
        (err, rows, fields)=>{
            res.send(rows[0]);
            // console.log(rows[0]);
        }
    )
})

// createCustomer
// 서버실행
app.listen(port, ()=>{
    console.log("고객 서버가 돌아가고 있습니다.");
})