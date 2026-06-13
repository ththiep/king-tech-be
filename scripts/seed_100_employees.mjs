import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config({ path: '.env.development' });

async function seed() {
  // Generate a fake token for admin@kingtech.vn
  const token = jwt.sign(
    { id: '6168b0d3-ad68-410c-8051-cb977fa8465f', tenant: 'kingtech', email: 'admin@kingtech.vn', role: 'admin' },
    process.env.JWT_SECRET || "default_super_secret_key_change_me"
  );

  const departments = ['Kinh doanh', 'Kỹ thuật', 'Nhân sự', 'Kế toán', 'Marketing'];
  const titles = ['Nhân viên', 'Chuyên viên', 'Trưởng nhóm', 'Phó phòng', 'Trưởng phòng'];
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
  const middleNames = ['Văn', 'Thị', 'Hữu', 'Ngọc', 'Xuân', 'Thu', 'Thanh', 'Đức', 'Hải'];
  const lastNames = ['An', 'Bình', 'Châu', 'Dũng', 'Em', 'Phúc', 'Giang', 'Hương', 'Inh', 'Khang', 'Lâm', 'Minh', 'Nam', 'Oanh', 'Phương', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Vinh'];

  const employees = [];
  
  for (let i = 1; i <= 100; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const mn = middleNames[Math.floor(Math.random() * middleNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${mn} ${ln}`;
    
    employees.push({
      code: `NV${Math.floor(1000 + Math.random() * 9000)}`,
      name: name,
      title: titles[Math.floor(Math.random() * titles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      email: `nv100.${Math.random().toString(36).substring(7)}@kingtech.com`,
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      baseSalary: 5000000 + Math.floor(Math.random() * 15000000),
      status: 'active'
    });
  }

  console.log(`Bắt đầu tạo 100 nhân viên...`);
  
  try {
    const res = await fetch('http://localhost:3000/api/v1/employees/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ employees })
    });
    
    const data = await res.json();
    if (!data.success) {
      console.error('Lỗi API tạo nhân viên:', data);
      return;
    }
    
    console.log('Tạo thành công 100 nhân viên!');
    const createdEmployees = data.data;

    console.log('Bắt đầu tạo dữ liệu chấm công 30 ngày qua cho 100 nhân viên...');
    // Generate dates (last 30 days)
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Bỏ qua Thứ 7, Chủ Nhật
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }

    let attendanceCount = 0;
    
    // Process in chunks to not overwhelm the server
    const chunkSize = 10;
    for (let i = 0; i < createdEmployees.length; i += chunkSize) {
      const chunk = createdEmployees.slice(i, i + chunkSize);
      const promises = [];
      
      for (const emp of chunk) {
        for (const date of dates) {
           // 80% Có mặt, 5% Đi trễ, 5% Nghỉ phép, 5% Vắng, 5% Nửa ngày
           const rand = Math.random();
           let status = 'Có mặt';
           if (rand > 0.95) status = 'Nửa ngày';
           else if (rand > 0.90) status = 'Vắng';
           else if (rand > 0.85) status = 'Nghỉ phép';
           else if (rand > 0.80) status = 'Đi trễ';
           
           let checkIn, checkOut;
           if (status === 'Có mặt') {
             checkIn = '08:00';
             checkOut = '17:30';
           } else if (status === 'Đi trễ') {
             checkIn = '09:15';
             checkOut = '17:30';
           } else if (status === 'Nửa ngày') {
             checkIn = '08:00';
             checkOut = '12:00';
           }

           const record = {
             employeeId: emp.id,
             date,
             status,
             ...(checkIn && { checkIn }),
             ...(checkOut && { checkOut })
           };
           
           promises.push(
             fetch('http://localhost:3000/api/v1/attendance', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
               body: JSON.stringify(record)
             })
           );
        }
      }
      
      await Promise.all(promises);
      attendanceCount += promises.length;
      console.log(`Đã tạo ${attendanceCount} bản ghi chấm công...`);
    }
    
    console.log('Hoàn thành quá trình seed dữ liệu!');
  } catch (err) {
    console.error('Lỗi khi fetch:', err);
  }
}

seed();
