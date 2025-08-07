# 🧪 การทดสอบ Step-by-Step

## 🎯 **ขั้นตอนที่ 1: ทดสอบ Google Apps Script**

### 1.1 อัปเดต Google Apps Script
1. เปิด: https://script.google.com/d/AKfycbzGNFHGy8WBSbxZpxC_QWAyzCTjlnCCQsGItBIJk-f40k0jtsMx7nlteNr7WOUhQeOU/edit
2. คัดลอกโค้ดทั้งหมดจาก `google-apps-script.js` 
3. วางทับโค้ดเดิม
4. กด **Ctrl+S** เพื่อบันทึก

### 1.2 ทดสอบฟังก์ชัน
1. เลือกฟังก์ชัน `testFormSubmission` จาก dropdown
2. กด **Run** (▶️)
3. ตรวจสอบ logs ว่ามี error หรือไม่
4. ถ้าขอสิทธิ์ให้กด **Review permissions** → **Allow**

### 1.3 Deploy ใหม่ (ถ้าจำเป็น)
1. กด **Deploy** → **Manage deployments**
2. กด **✏️ Edit**
3. เปลี่ยน **Version** เป็น **New**
4. กด **Deploy**

---

## 🎯 **ขั้นตอนที่ 2: ทดสอบด้วย Simple Form**

### 2.1 เปิด Simple Test
```bash
cd /Users/techit/Desktop/Code/Certificate_auto
python -m http.server 8000
```

### 2.2 ทดสอบฟอร์มง่าย
1. เปิด: **http://localhost:8000/simple_test.html**
2. กรอกข้อมูล:
   - First Name: `Test`
   - Last Name: `User`
   - Email: อีเมลจริงของคุณ
   - Grade: `M1`
   - ปล่อยค่า ratings เป็น default
3. กด **"Submit Test"**

### 2.3 ตรวจสอบผลลัพธ์
**ถ้าสำเร็จ:**
- ✅ Status แสดง "Submitted!"
- ✅ ใน Google Sheets จะมีข้อมูลใหม่
- ✅ โฟลเดอร์ M1 ถูกสร้างใน Google Drive
- ✅ ได้รับอีเมลภายใน 5-10 นาที

**ถ้าไม่สำเร็จ:**
- กด F12 ดู Console errors
- ตรวจสอบ Google Apps Script Executions

---

## 🎯 **ขั้นตอนที่ 3: แก้ไข Main Form (ถ้า Simple Test สำเร็จ)**

### 3.1 แก้ไข script.js
ปัญหาคือ 403 Error และ ReferenceError แล้วแก้ไขแล้ว

### 3.2 ทดสอบ Main Form
1. เปิด: **http://localhost:8000**
2. กรอกข้อมูลครบ
3. กด **"ส่งแบบประเมิน"**

---

## 🔍 **การ Debug**

### Google Apps Script Logs
1. เปิด: https://script.google.com/d/AKfycbzGNFHGy8WBSbxZpxC_QWAyzCTjlnCCQsGItBIJk-f40k0jtsMx7nlteNr7WOUhQeOU/edit
2. คลิก **"Executions"** tab
3. ดู execution ล่าสุด

### Browser Console
```javascript
// เปิด F12 และรันใน Console
console.log('Testing URL:', 'https://script.google.com/macros/s/AKfycbzGNFHGy8WBSbxZpxC_QWAyzCTjlnCCQsGItBIJk-f40k0jtsMx7nlteNr7WOUhQeOU/exec');

// ทดสอบ GET request
fetch('https://script.google.com/macros/s/AKfycbzGNFHGy8WBSbxZpxC_QWAyzCTjlnCCQsGItBIJk-f40k0jtsMx7nlteNr7WOUhQeOU/exec')
.then(r => r.text())
.then(data => console.log('Response:', data));
```

---

## 🎯 **Expected Results**

### ✅ Simple Test Success:
```
Google Sheets: ข้อมูลใหม่เพิ่มเข้าไป
Google Drive: โฟลเดอร์ M1/M2/M3 ถูกสร้าง
Email: ได้รับใบประกาศนียบัตร PDF
```

### ✅ Main Form Success:
```
Browser: แสดง "ส่งแบบประเมินเรียบร้อยแล้ว!"
No CORS errors
No JavaScript errors
```

---

## 🚨 **Common Issues & Solutions**

### Issue 1: 403 Error
**สาเหตุ**: Google Apps Script ไม่ได้รับสิทธิ์หรือ Deploy ไม่ถูกต้อง
**วิธีแก้**: 
- รันฟังก์ชัน `testFormSubmission` เพื่อให้สิทธิ์
- Deploy ใหม่เป็น Web App

### Issue 2: ไม่มีข้อมูลใน Google Sheets
**สาเหตุ**: Spreadsheet ID ไม่ถูกต้องหรือไม่มีสิทธิ์
**วิธีแก้**:
- ตรวจสอบ `SPREADSHEET_ID` ใน Google Apps Script
- ให้สิทธิ์ Google Sheets API

### Issue 3: ไม่ได้รับอีเมล
**สาเหตุ**: Gmail API ไม่มีสิทธิ์หรือ Template ไม่ถูกต้อง
**วิธีแก้**:
- ตรวจสอบ Spam folder
- ให้สิทธิ์ Gmail API
- ตรวจสอบ `CERTIFICATE_TEMPLATE_ID`

---

## 🏁 **เป้าหมาย**

**หลังจากทดสอบ Step-by-Step แล้ว:**
1. ✅ Simple Test ทำงานได้
2. ✅ Main Form ทำงานได้  
3. ✅ ไม่มี JavaScript errors
4. ✅ ข้อมูลเข้า Google Sheets
5. ✅ ใบประกาศนียบัตรส่งทางอีเมล

**🎉 ระบบพร้อมใช้งานจริง!**