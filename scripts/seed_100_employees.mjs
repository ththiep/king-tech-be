import jwt from 'jsonwebtoken';

async function seed() {
  // Generate a fake token for admin@kingtech.vn
  // Use the secret from king-tech-be (since we run this locally)
  const token = jwt.sign(
    { id: '6168b0d3-ad68-410c-8051-cb977fa8465f', tenant: 'kingtech', email: 'admin@kingtech.vn', role: 'admin' },
    "default_super_secret_key_change_me" // Assuming default from .env or config
  );

  const departments = ['Sales', 'IT', 'Marketing', 'HR', 'Finance'];
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
    if (data.success) {
      console.log('Tạo thành công 100 nhân viên!');
    } else {
      console.error('Lỗi API:', data);
    }
  } catch (err) {
    console.error('Lỗi khi fetch:', err);
  }
}

seed();
