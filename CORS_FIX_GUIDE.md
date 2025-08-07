# 🔧 การแก้ปัญหา CORS - Certificate Auto System

## ❌ **ปัญหาเดิม:**
```
[Error] Preflight response is not successful. Status code: 405
[Error] Fetch API cannot load due to access control checks.
```

## ✅ **วิธีแก้ไข:**

### 🔄 **1. เปลี่ยนวิธีการส่งข้อมูล**
ใช้ **JSONP** แทน **fetch()** เพื่อหลีกเลี่ยงปัญหา CORS:

```javascript
// เดิม: ใช้ fetch() - มีปัญหา CORS
fetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

// ใหม่: ใช้ JSONP - ไม่มีปัญหา CORS
const script = document.createElement('script');
script.src = GOOGLE_SCRIPT_URL + '?data=' + JSON.stringify(data) + '&callback=myCallback';
document.head.appendChild(script);
```

### 📡 **2. อัปเดต Google Apps Script**
เพิ่ม `doGet()` function เพื่อรับ JSONP requests:

```javascript
function doGet(e) {
  if (e.parameter && e.parameter.data && e.parameter.callback) {
    const data = JSON.parse(e.parameter.data);
    const callback = e.parameter.callback;
    
    // ประมวลผลข้อมูล
    const result = processData(data);
    
    // ส่งกลับแบบ JSONP
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(result)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}
```

### 🔄 **3. Fallback Method**
ถ้า JSONP ไม่ได้ จะใช้ Hidden iframe แทน:

```javascript
function tryFallbackMethod(data) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = GOOGLE_SCRIPT_URL;
  form.target = 'hidden_iframe';
  
  // ส่งข้อมูลผ่าน hidden form
  form.submit();
}
```

---

## 🚀 **ขั้นตอนการ Deploy ใหม่:**

### 1. **อัปเดต Google Apps Script**
- คัดลอกโค้ดใหม่จาก `google-apps-script.js`
- บันทึกและ Deploy ใหม่

### 2. **Deploy Web App ใหม่**
1. ใน Google Apps Script คลิก **"Deploy"** → **"New deployment"**
2. คลิก **⚙️** → เลือก **"Web app"**
3. กรอกรายละเอียด:
   - **Description**: `Certificate System v2.0 - CORS Fixed`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. คลิก **"Deploy"**
5. **คัดลอก URL ใหม่**

### 3. **อัปเดต script.js (ทำแล้ว)**
✅ URL ได้อัปเดตเป็น:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzGNFHGy8WBSbxZpxC_QWAyzCTjlnCCQsGItBIJk-f40k0jtsMx7nlteNr7WOUhQeOU/exec';
```

---

## 🧪 **การทดสอบ:**

### 1. **ทดสอบ Google Apps Script**
```javascript
// ใน Google Apps Script Console
function testFormSubmission() {
  // ข้อมูลทดสอบ
}
```

### 2. **ทดสอบเว็บไซต์**
```bash
cd /Users/techit/Desktop/Code/Certificate_auto
python -m http.server 8000
```
เปิด: http://localhost:8000

### 3. **ตรวจสอบ Developer Console**
- ไม่ควรมี CORS errors
- ควรเห็น "Received data via GET" ใน logs

---

## 🔍 **วิธี Debug:**

### 1. **ตรวจสอบ Network Tab**
- JSONP request จะแสดงเป็น script load
- Status ควรเป็น 200 OK

### 2. **ตรวจสอบ Google Apps Script Logs**
- ไปที่ **Executions** tab
- ดู console.log messages

### 3. **ตรวจสอบ JavaScript Console**
- ไม่ควรมี fetch errors
- ควรเห็น callback function execute

---

## ✅ **ผลลัพธ์ที่คาดหวัง:**

### 🟢 **Success Indicators:**
1. ✅ ไม่มี CORS errors ใน console
2. ✅ ฟอร์มส่งได้สำเร็จ
3. ✅ แสดงข้อความ "ส่งแบบประเมินเรียบร้อยแล้ว!"
4. ✅ ข้อมูลเข้า Google Sheets
5. ✅ ใบประกาศนียบัตรถูกส่งทางอีเมล

### 🟢 **จุดเปลี่ยนแปลงหลัก:**
- ❌ **เดิม**: ใช้ fetch() → CORS error
- ✅ **ใหม่**: ใช้ JSONP → ไม่มี CORS error
- ❌ **เดิม**: รับข้อมูลผ่าน POST เท่านั้น
- ✅ **ใหม่**: รับข้อมูลผ่าน GET (JSONP) และ POST

---

## 🎯 **ขั้นตอนสุดท้าย:**

1. **Deploy Google Apps Script ใหม่** (ถ้าจำเป็น)
2. **Refresh เว็บเพจ**
3. **ทดสอบส่งแบบประเมิน**
4. **ตรวจสอบผลลัพธ์ใน Google Sheets และ Email**

**🎉 CORS Problem Solved! 🎉**