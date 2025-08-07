// Google Apps Script for handling form submissions and certificate generation
// Deploy this as a Web App with permissions for anyone to execute

// Configuration - Update these with your actual IDs
const SPREADSHEET_ID = '1GUrL1nOCPGo_M7rLFDud-ZRYWry15FFlSMMAEMT1MiU';
const CERTIFICATE_TEMPLATE_ID = '1a1EXoY3cx0MIDN2Z-KiAc39NI4AKCk6hyOpp8xinKeg';
const CERTIFICATE_FOLDER_ID = '1iNooK4frWpkrfhVD3D2UDyPrWA44ydg5'; // Main folder to save certificates

// Grade level folder mapping - these will be created automatically if they don't exist
const GRADE_FOLDERS = {
  'M1': null, // Will be populated with actual folder IDs
  'M2': null,
  'M3': null,
  'M4': null,
  'M5': null,
  'M6': null
};

// Main function to handle POST requests from the web form
function doPost(e) {
  try {
    console.log('doPost called with:', e);
    
    // Check if e exists
    if (!e) {
      throw new Error('No data received. Please check if this is being called as a web app.');
    }
    
    let data;
    
    // Try to get data from different sources
    if (e.parameter && Object.keys(e.parameter).length > 0 && e.parameter.firstName) {
      console.log('Processing form field data');
      // Data sent as individual form fields
      data = {
        firstName: e.parameter.firstName,
        lastName: e.parameter.lastName,
        email: e.parameter.email,
        gradeLevel: e.parameter.gradeLevel,
        contentRating: e.parameter.contentRating,
        instructorRating: e.parameter.instructorRating,
        durationRating: e.parameter.durationRating,
        recommendRating: e.parameter.recommendRating,
        practicalRating: e.parameter.practicalRating,
        toolsRating: e.parameter.toolsRating,
        practicalUseRating: e.parameter.practicalUseRating,
        groupSizeRating: e.parameter.groupSizeRating,
        improvements: e.parameter.improvements || '',
        additionalComments: e.parameter.additionalComments || '',
        submissionTime: e.parameter.submissionTime,
        course: e.parameter.course,
        fullName: e.parameter.fullName,
        averageRating: e.parameter.averageRating
      };
    } else if (e.parameter && e.parameter.data) {
      console.log('Processing JSON parameter data');
      // Data sent as JSON string parameter
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      console.log('Processing POST body data');
      // Data sent as POST body
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        console.log('POST data not JSON, trying form data parsing');
        // If not JSON, try to parse as form data
        const params = new URLSearchParams(e.postData.contents);
        data = Object.fromEntries(params);
      }
    } else {
      console.log('No valid data source found in request');
      console.log('e.parameter:', e.parameter);
      console.log('e.postData:', e.postData);
      throw new Error('No valid data found in request. Available data: ' + JSON.stringify({
        hasParameter: !!e.parameter,
        hasPostData: !!e.postData,
        parameterKeys: e.parameter ? Object.keys(e.parameter) : [],
        postDataType: e.postData ? typeof e.postData.contents : 'N/A'
      }));
    }
    
    console.log('Received data:', data);
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.gradeLevel) {
      throw new Error('Missing required fields: firstName, lastName, email, or gradeLevel');
    }
    
    console.log('Received data:', data);
    
    // Save evaluation data to Google Sheets
    const sheetResult = saveToGoogleSheets(data);
    console.log('Sheet result:', sheetResult);
    
    // Generate and send certificate
    const certificateResult = generateAndSendCertificate(data);
    console.log('Certificate result:', certificateResult);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully. Certificate will be sent shortly.',
        sheetResult: sheetResult,
        certificateResult: certificateResult
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        stack: error.stack || 'No stack trace available'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for CORS workaround and JSONP)
function doGet(e) {
  try {
    // Check if this is a form submission or JSONP request with data
    let data = null;
    let callback = null;
    
    if (e.parameter && e.parameter.firstName) {
      // Data sent as individual form fields
      data = {
        firstName: e.parameter.firstName,
        lastName: e.parameter.lastName,
        email: e.parameter.email,
        gradeLevel: e.parameter.gradeLevel,
        contentRating: e.parameter.contentRating,
        instructorRating: e.parameter.instructorRating,
        durationRating: e.parameter.durationRating,
        recommendRating: e.parameter.recommendRating,
        practicalRating: e.parameter.practicalRating,
        toolsRating: e.parameter.toolsRating,
        practicalUseRating: e.parameter.practicalUseRating,
        groupSizeRating: e.parameter.groupSizeRating,
        improvements: e.parameter.improvements || '',
        additionalComments: e.parameter.additionalComments || '',
        submissionTime: e.parameter.submissionTime,
        course: e.parameter.course,
        fullName: e.parameter.fullName,
        averageRating: e.parameter.averageRating
      };
      callback = e.parameter.callback;
    } else if (e.parameter && e.parameter.data && e.parameter.callback) {
      // Parse the JSON data
      data = JSON.parse(e.parameter.data);
      callback = e.parameter.callback;
    }
    
    if (data) {
      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email || !data.gradeLevel) {
        const errorResponse = {
          success: false,
          error: 'Missing required fields: firstName, lastName, email, or gradeLevel'
        };
        
        if (callback) {
          return ContentService
            .createTextOutput(`${callback}(${JSON.stringify(errorResponse)})`)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        } else {
          return ContentService
            .createTextOutput(JSON.stringify(errorResponse))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      console.log('Received data via GET:', data);
      
      // Save evaluation data to Google Sheets
      const sheetResult = saveToGoogleSheets(data);
      console.log('Sheet result:', sheetResult);
      
      // Generate and send certificate
      const certificateResult = generateAndSendCertificate(data);
      console.log('Certificate result:', certificateResult);
      
      const response = {
        success: true,
        message: 'Form submitted successfully. Certificate will be sent shortly.',
        sheetResult: sheetResult,
        certificateResult: certificateResult
      };
      
      // Return response (JSONP if callback provided)
      if (callback) {
        return ContentService
          .createTextOutput(`${callback}(${JSON.stringify(response)})`)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify(response))
          .setMimeType(ContentService.MimeType.JSON);
      }
        
    } else {
      // Regular GET request
      const output = ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'GET request received. Include data and callback parameters for JSONP submission.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
      return output;
    }
    
  } catch (error) {
    console.error('Error in doGet:', error);
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      stack: error.stack || 'No stack trace available'
    };
    
    // If callback is provided, return JSONP error
    if (e.parameter && e.parameter.callback) {
      return ContentService
        .createTextOutput(`${e.parameter.callback}(${JSON.stringify(errorResponse)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to save evaluation data to Google Sheets
function saveToGoogleSheets(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'First Name',
        'Last Name', 
        'Full Name',
        'Email',
        'Grade Level',
        'Course',
        'Content Rating',
        'Instructor Rating',
        'Duration Rating',
        'Recommend Rating',
        'Practical Rating',
        'Tools Rating',
        'Practical Use Rating',
        'Group Size Rating',
        'Overall Average Rating',
        'Core Average Rating',
        'Practical Average Rating',
        'Satisfaction Level',
        'Recommendation Type',
        'Strongest Aspect',
        'Improvement Areas',
        'Participant Type',
        'Improvements',
        'Additional Comments',
        'Certificate Generated',
        'Certificate Sent',
        'Certificate File Path'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4facfe');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Calculate different types of average ratings with detailed analytics
    const coreRatings = [
      parseInt(data.contentRating),
      parseInt(data.instructorRating),
      parseInt(data.durationRating),
      parseInt(data.recommendRating)
    ];
    
    const practicalRatings = [
      parseInt(data.practicalRating),
      parseInt(data.toolsRating),
      parseInt(data.practicalUseRating),
      parseInt(data.groupSizeRating)
    ];
    
    const allRatings = [...coreRatings, ...practicalRatings];
    
    const overallAverageRating = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2);
    const coreAverageRating = (coreRatings.reduce((a, b) => a + b, 0) / coreRatings.length).toFixed(2);
    const practicalAverageRating = (practicalRatings.reduce((a, b) => a + b, 0) / practicalRatings.length).toFixed(2);
    
    // Advanced analytics
    const satisfaction = overallAverageRating >= 4 ? 'High' : overallAverageRating >= 3 ? 'Medium' : 'Low';
    const recommendationLevel = parseInt(data.recommendRating) >= 4 ? 'Promoter' : parseInt(data.recommendRating) >= 3 ? 'Passive' : 'Detractor';
    const strongestAspect = getStrongestAspect(data);
    const improvementAreas = getImprovementAreas(data);
    const participantType = classifyParticipant(data);
    
    // Prepare row data
    const rowData = [
      data.submissionTime,
      data.firstName,
      data.lastName,
      data.fullName,
      data.email,
      data.gradeLevel,
      data.course,
      data.contentRating,
      data.instructorRating,
      data.durationRating,
      data.recommendRating,
      data.practicalRating,
      data.toolsRating,
      data.practicalUseRating,
      data.groupSizeRating,
      overallAverageRating,
      coreAverageRating,
      practicalAverageRating,
      satisfaction,
      recommendationLevel,
      strongestAspect,
      improvementAreas,
      participantType,
      data.improvements,
      data.additionalComments,
      'Pending',
      'Pending',
      ''
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Get the row number of the newly added data
    const lastRow = sheet.getLastRow();
    
    return {
      success: true,
      rowNumber: lastRow,
      overallAverageRating: overallAverageRating,
      coreAverageRating: coreAverageRating,
      practicalAverageRating: practicalAverageRating
    };
    
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw new Error('Failed to save data to spreadsheet: ' + error.toString());
  }
}

// Function to get or create grade-specific folder
function getOrCreateGradeFolder(gradeLevel) {
  try {
    const mainFolder = DriveApp.getFolderById(CERTIFICATE_FOLDER_ID);
    const gradeFolderName = `${gradeLevel} - มัธยมศึกษาปีที่ ${gradeLevel.substring(1)}`;
    
    // Check if grade folder already exists
    const existingFolders = mainFolder.getFoldersByName(gradeFolderName);
    if (existingFolders.hasNext()) {
      return existingFolders.next();
    }
    
    // Create new grade folder if it doesn't exist
    const newFolder = mainFolder.createFolder(gradeFolderName);
    console.log(`Created new grade folder: ${gradeFolderName}`);
    return newFolder;
    
  } catch (error) {
    console.error('Error creating grade folder:', error);
    // Fallback to main folder if there's an error
    return DriveApp.getFolderById(CERTIFICATE_FOLDER_ID);
  }
}

// Function to generate certificate and send via email
function generateAndSendCertificate(data) {
  try {
    console.log('Starting certificate generation...');
    console.log('Template ID:', CERTIFICATE_TEMPLATE_ID);
    console.log('Certificate Folder ID:', CERTIFICATE_FOLDER_ID);
    
    // Create a copy of the certificate template
    let templateFile;
    try {
      templateFile = DriveApp.getFileById(CERTIFICATE_TEMPLATE_ID);
      console.log('Template file found:', templateFile.getName());
    } catch (templateError) {
      console.error('Failed to access template file:', templateError);
      throw new Error('Cannot access certificate template. Please check CERTIFICATE_TEMPLATE_ID.');
    }
    
    const certificateName = `${data.gradeLevel}_${data.firstName}_${data.lastName}_Certificate_${new Date().getTime()}`;
    console.log('Certificate name:', certificateName);
    
    // Get or create grade-specific folder
    let folder;
    try {
      folder = getOrCreateGradeFolder(data.gradeLevel);
      console.log('Grade folder ready:', folder.getName());
    } catch (folderError) {
      console.error('Failed to create grade folder:', folderError);
      throw new Error('Cannot create or access grade folder: ' + folderError.toString());
    }
    
    let certificateFile;
    try {
      certificateFile = templateFile.makeCopy(certificateName, folder);
      console.log('Certificate copy created with ID:', certificateFile.getId());
    } catch (copyError) {
      console.error('Failed to copy template:', copyError);
      throw new Error('Cannot copy template file: ' + copyError.toString());
    }
    
    // Open the copied presentation
    let presentation;
    try {
      presentation = SlidesApp.openById(certificateFile.getId());
      console.log('Presentation opened successfully');
    } catch (openError) {
      console.error('Failed to open presentation:', openError);
      throw new Error('Cannot open copied presentation: ' + openError.toString());
    }
    
    let slides;
    try {
      slides = presentation.getSlides();
      console.log('Number of slides found:', slides.length);
    } catch (slidesError) {
      console.error('Failed to get slides:', slidesError);
      throw new Error('Cannot get slides from presentation: ' + slidesError.toString());
    }
    
    if (slides.length === 0) {
      throw new Error('Certificate template has no slides');
    }
    
    // Replace placeholders in the first slide
    const slide = slides[0];
    const elements = slide.getPageElements();
    
    // Define replacement mappings
    const replacements = {
      '<name>': data.fullName,
      '<Name>': data.fullName,
      '<NAME>': data.fullName.toUpperCase(),
      '<course>': data.course,
      '<Course>': data.course,
      '<COURSE>': data.course.toUpperCase(),
      '<date>': new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      '<Date>': new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    // Iterate through all elements and replace text
    elements.forEach(element => {
      if (element.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
        const shape = element.asShape();
        if (shape.getText) {
          const textRange = shape.getText();
          let text = textRange.asString();
          
          // Replace all placeholders
          Object.keys(replacements).forEach(placeholder => {
            text = text.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
          });
          
          textRange.setText(text);
        }
      }
    });
    
    // Save the presentation
    presentation.saveAndClose();
    
    // Export as PDF
    let certificateBlob;
    try {
      console.log('Exporting presentation as PDF...');
      
      // Create PDF directly
      certificateBlob = DriveApp.getFileById(certificateFile.getId()).getAs('application/pdf');
      certificateBlob.setName(`${certificateName}.pdf`);
      console.log('PDF created successfully');
      
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Cannot export presentation as PDF: ' + error.toString());
    }
    
    // Save certificate file to the grade folder
    console.log('Creating certificate file in folder:', folder.getName());
    
    let savedCertificateFile;
    try {
      savedCertificateFile = folder.createFile(certificateBlob);
      console.log('Certificate file created with ID:', savedCertificateFile.getId());
      console.log('Certificate file URL:', savedCertificateFile.getUrl());
    } catch (driveError) {
      console.error('Failed to create certificate file in Drive:', driveError);
      throw new Error('Failed to save certificate to Drive: ' + driveError.toString());
    }
    
    // Send email with certificate
    const emailResult = sendCertificateEmail(data, certificateBlob);
    
    // Update the spreadsheet to mark certificate as generated and sent
    updateCertificateStatus(data, true, emailResult.success);
    
    // Delete the Google Slides file (keep certificate only)
    try {
      DriveApp.getFileById(certificateFile.getId()).setTrashed(true);
      console.log('Google Slides file deleted');
    } catch (deleteError) {
      console.warn('Could not delete Slides file:', deleteError);
    }
    
    // Update spreadsheet with certificate file path
    const filePath = `/${folder.getName()}/${savedCertificateFile.getName()}`;
    updateCertificateFilePath(data, filePath);
    console.log('Updated certificate file path:', filePath);
    
    // Determine file extension from blob name
    const fileName = certificateBlob.getName() || `${certificateName}.jpg`;
    
    return {
      success: true,
      certificateId: savedCertificateFile.getId(),
      emailSent: emailResult.success,
      fileName: fileName,
      gradeFolder: folder.getName(),
      filePath: filePath,
      fileUrl: savedCertificateFile.getUrl()
    };
    
  } catch (error) {
    console.error('Error generating certificate:', error);
    
    // Update spreadsheet to mark certificate generation as failed
    updateCertificateStatus(data, false, false);
    
    throw new Error('Failed to generate certificate: ' + error.toString());
  }
}

// Function to send certificate via email with HTML formatting
function sendCertificateEmail(data, certificateBlob) {
  try {
    console.log('Starting email send process...');
    console.log('Recipient:', data.email);
    
    const subject = `ใบประกาศนียบัตรหลักสูตร ${data.course}`;
    
    // Create beautiful HTML email template
    const htmlBody = createEmailTemplate(data);
    
    // Plain text fallback
    const plainBody = `
ยินดีด้วย! คุณ ${data.fullName}

คุณได้รับใบประกาศนียบัตรหลักสูตร ${data.course} แล้ว

กรุณาดูใบประกาศนียบัตรในไฟล์แนบ

ขอบคุณสำหรับการประเมินและข้อเสนอแนะที่มีค่า

โดย Login Learning
Color Segmentation & Computer Vision
    `;
    
    // Send email with HTML formatting
    console.log('Attempting to send email...');
    
    GmailApp.sendEmail(
      data.email,
      subject,
      plainBody,
      {
        attachments: [certificateBlob],
        name: 'Login Learning',
        htmlBody: htmlBody
      }
    );
    
    console.log('Email sent successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

// Create beautiful HTML email template
function createEmailTemplate(data) {
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ใบประกาศนียบัตร</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
            );
            animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            position: relative;
            z-index: 1;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .name {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 20px;
        }
        .course-info {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .course-name {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .rating-summary {
            text-align: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .rating-score {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .attachment-note {
            background: #e8f4f8;
            border: 2px dashed #3498db;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background: #2c3e50;
            color: white;
            padding: 25px;
            text-align: center;
        }
        .footer-brand {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .footer-subtitle {
            font-size: 14px;
            opacity: 0.8;
        }
        .date {
            color: #7f8c8d;
            font-style: italic;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ยินดีด้วย!</h1>
            <p>คุณได้รับใบประกาศนียบัตรแล้ว</p>
        </div>
        
        <div class="content">
            <div class="greeting">เรียน คุณ</div>
            <div class="name">${data.fullName}</div>
            
            <p>ยินดีด้วย! คุณได้สำเร็จการศึกษาหลักสูตรของเราแล้ว</p>
            
            <div class="course-info">
                <div class="course-name">${data.course}</div>
                <p>หลักสูตรนี้ได้รับการออกแบบมาเพื่อพัฒนาทักษะและความรู้ในด้านการประมวลผลภาพ</p>
            </div>
            
            <div class="rating-summary">
                <div>คะแนนประเมินโดยรวม</div>
                <div class="rating-score">${data.averageRating}/5</div>
                <div>ขอบคุณสำหรับการประเมินที่มีค่า</div>
            </div>
            
            <div class="attachment-note">
                <strong>ไฟล์แนบ</strong><br>
                กรุณาดาวน์โหลดใบประกาศนียบัตรของคุณจากไฟล์แนบ
            </div>
            
            <div class="details">
                <strong>รายละเอียด:</strong><br>
                • ระดับชั้น: ${data.gradeLevel}<br>
                • วันที่ออกใบประกาศนียบัตร: ${currentDate}<br>
                • ประเภทไฟล์: PDF<br>
            </div>
            
            <p>ขอบคุณสำหรับการเข้าร่วมและการให้ข้อเสนอแนะที่มีค่า เราหวังว่าความรู้ที่ได้จากหลักสูตรนี้จะเป็นประโยชน์ต่อคุณ</p>
            
            <div class="date">ส่งเมื่อ: ${currentDate}</div>
        </div>
        
        <div class="footer">
            <div class="footer-brand">โดย Login Learning</div>
            <div class="footer-subtitle">Color Segmentation & Computer Vision</div>
        </div>
    </div>
</body>
</html>
  `;
}

// Function to update certificate status in spreadsheet
function updateCertificateStatus(data, certificateGenerated, emailSent) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Find the row with matching email (assuming it's the most recent entry)
    const emailCol = 5; // Column E (Email)
    const certGenCol = 21; // Column U (Certificate Generated) - adjusted for new columns
    const certSentCol = 22; // Column V (Certificate Sent) - adjusted for new columns
    
    for (let row = lastRow; row >= 2; row--) {
      const emailInSheet = sheet.getRange(row, emailCol).getValue();
      if (emailInSheet === data.email) {
        // Update certificate status
        sheet.getRange(row, certGenCol).setValue(certificateGenerated ? 'Yes' : 'Failed');
        sheet.getRange(row, certSentCol).setValue(emailSent ? 'Yes' : 'Failed');
        break;
      }
    }
    
  } catch (error) {
    console.error('Error updating certificate status:', error);
  }
}

// Function to update certificate file path in spreadsheet
function updateCertificateFilePath(data, filePath) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Find the row with matching email (assuming it's the most recent entry)
    const emailCol = 5; // Column E (Email)
    const filePathCol = 23; // Column W (Certificate File Path)
    
    for (let row = lastRow; row >= 2; row--) {
      const emailInSheet = sheet.getRange(row, emailCol).getValue();
      if (emailInSheet === data.email) {
        // Update file path
        sheet.getRange(row, filePathCol).setValue(filePath);
        break;
      }
    }
    
  } catch (error) {
    console.error('Error updating certificate file path:', error);
  }
}

// Test certificate generation (for debugging full process)
function testCertificateGeneration() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'test@example.com',
    gradeLevel: 'M1',
    course: 'Image Processing',
    contentRating: '5',
    instructorRating: '5',
    durationRating: '4',
    recommendRating: '5',
    practicalRating: '5',
    toolsRating: '4',
    practicalUseRating: '5',
    groupSizeRating: '4',
    averageRating: '4.6',
    improvements: 'Great course!',
    additionalComments: 'Thank you',
    submissionTime: new Date().toLocaleString()
  };
  
  try {
    console.log('Testing certificate generation only...');
    const result = generateAndSendCertificate(testData);
    console.log('Certificate generation result:', result);
    return result;
  } catch (error) {
    console.error('Certificate generation test failed:', error);
    return { success: false, error: error.toString() };
  }
}

// Test UrlFetch permission (run this first to authorize)
function testUrlFetchPermission() {
  try {
    // Simple URL fetch to authorize permission
    const response = UrlFetchApp.fetch('https://www.google.com');
    console.log('UrlFetch permission test successful');
    return { success: true, message: 'UrlFetch authorized' };
  } catch (error) {
    console.error('UrlFetch permission test failed:', error);
    return { success: false, error: error.toString() };
  }
}

// Test template access (for debugging template issues)
function testTemplateAccess() {
  try {
    console.log('Testing template access...');
    console.log('Template ID:', CERTIFICATE_TEMPLATE_ID);
    
    const templateFile = DriveApp.getFileById(CERTIFICATE_TEMPLATE_ID);
    console.log('Template file name:', templateFile.getName());
    console.log('Template file type:', templateFile.getMimeType());
    console.log('Template file owner:', templateFile.getOwner().getEmail());
    
    // Try to open as presentation
    const presentation = SlidesApp.openById(CERTIFICATE_TEMPLATE_ID);
    const slides = presentation.getSlides();
    console.log('Number of slides:', slides.length);
    
    if (slides.length > 0) {
      const elements = slides[0].getPageElements();
      console.log('Number of elements in first slide:', elements.length);
    }
    
    return { success: true, message: 'Template access successful' };
    
  } catch (error) {
    console.error('Template access failed:', error);
    return { success: false, error: error.toString() };
  }
}

// Test email function (for debugging email issues)
function testEmailOnly() {
  try {
    GmailApp.sendEmail(
      'test@example.com', // เปลี่ยนเป็นอีเมลจริงของคุณ
      'Test Email from Apps Script',
      'This is a test email without attachment.',
      {
        name: 'Login Learning'
      }
    );
    console.log('Simple email sent successfully');
    return { success: true, message: 'Email sent' };
  } catch (error) {
    console.error('Email test failed:', error);
    return { success: false, error: error.toString() };
  }
}


// Advanced Analytics Helper Functions
function getStrongestAspect(data) {
  const aspects = {
    'Content': parseInt(data.contentRating),
    'Instructor': parseInt(data.instructorRating),
    'Duration': parseInt(data.durationRating),
    'Practical': parseInt(data.practicalRating),
    'Tools': parseInt(data.toolsRating),
    'Practical Use': parseInt(data.practicalUseRating),
    'Group Size': parseInt(data.groupSizeRating)
  };
  
  let maxRating = 0;
  let strongestAspect = 'N/A';
  
  for (const [aspect, rating] of Object.entries(aspects)) {
    if (rating > maxRating) {
      maxRating = rating;
      strongestAspect = aspect;
    }
  }
  
  return `${strongestAspect} (${maxRating}/5)`;
}

function getImprovementAreas(data) {
  const aspects = {
    'Content': parseInt(data.contentRating),
    'Instructor': parseInt(data.instructorRating),
    'Duration': parseInt(data.durationRating),
    'Practical': parseInt(data.practicalRating),
    'Tools': parseInt(data.toolsRating),
    'Practical Use': parseInt(data.practicalUseRating),
    'Group Size': parseInt(data.groupSizeRating)
  };
  
  const lowRatedAspects = [];
  for (const [aspect, rating] of Object.entries(aspects)) {
    if (rating <= 3) {
      lowRatedAspects.push(`${aspect} (${rating}/5)`);
    }
  }
  
  return lowRatedAspects.length > 0 ? lowRatedAspects.join(', ') : 'None identified';
}

function classifyParticipant(data) {
  const overallRating = (
    parseInt(data.contentRating) + 
    parseInt(data.instructorRating) + 
    parseInt(data.durationRating) + 
    parseInt(data.recommendRating) +
    parseInt(data.practicalRating) + 
    parseInt(data.toolsRating) + 
    parseInt(data.practicalUseRating) + 
    parseInt(data.groupSizeRating)
  ) / 8;
  
  const hasImprovements = data.improvements && data.improvements.trim().length > 0;
  const hasComments = data.additionalComments && data.additionalComments.trim().length > 0;
  
  if (overallRating >= 4.5) {
    return 'Highly Satisfied';
  } else if (overallRating >= 4.0) {
    return hasComments ? 'Engaged Learner' : 'Satisfied';
  } else if (overallRating >= 3.0) {
    return hasImprovements ? 'Constructive Critic' : 'Neutral';
  } else {
    return hasImprovements ? 'Detailed Critic' : 'Dissatisfied';
  }
}

// Generate detailed analytics report
function generateAnalyticsReport() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { success: false, message: 'No data available for analysis' };
    }
    
    const headers = data[0];
    const responses = data.slice(1);
    
    // Calculate overall statistics
    const stats = {
      totalResponses: responses.length,
      averageOverallRating: 0,
      satisfactionDistribution: { High: 0, Medium: 0, Low: 0 },
      recommendationDistribution: { Promoter: 0, Passive: 0, Detractor: 0 },
      gradeDistribution: {},
      topStrengths: {},
      commonImprovements: {},
      participantTypes: {}
    };
    
    responses.forEach(row => {
      // Overall rating
      const overallRating = parseFloat(row[headers.indexOf('Overall Average Rating')]) || 0;
      stats.averageOverallRating += overallRating;
      
      // Satisfaction level
      const satisfaction = row[headers.indexOf('Satisfaction Level')] || 'Medium';
      stats.satisfactionDistribution[satisfaction] = (stats.satisfactionDistribution[satisfaction] || 0) + 1;
      
      // Recommendation type
      const recType = row[headers.indexOf('Recommendation Type')] || 'Passive';
      stats.recommendationDistribution[recType] = (stats.recommendationDistribution[recType] || 0) + 1;
      
      // Grade distribution
      const grade = row[headers.indexOf('Grade Level')] || 'Unknown';
      stats.gradeDistribution[grade] = (stats.gradeDistribution[grade] || 0) + 1;
      
      // Participant types
      const partType = row[headers.indexOf('Participant Type')] || 'Unknown';
      stats.participantTypes[partType] = (stats.participantTypes[partType] || 0) + 1;
    });
    
    stats.averageOverallRating = (stats.averageOverallRating / responses.length).toFixed(2);
    
    return { success: true, stats: stats };
    
  } catch (error) {
    console.error('Error generating analytics:', error);
    return { success: false, error: error.toString() };
  }
}

// Test function (for debugging)
function testFormSubmission() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'test@example.com',
    gradeLevel: 'M3',
    course: 'Image Processing',
    contentRating: '5',
    instructorRating: '5',
    durationRating: '4',
    recommendRating: '5',
    practicalRating: '5',
    toolsRating: '4',
    practicalUseRating: '5',
    groupSizeRating: '4',
    averageRating: '4.6',
    improvements: 'Great course!',
    additionalComments: 'Thank you',
    submissionTime: new Date().toLocaleString()
  };
  
  try {
    // Simulate form submission with parameter data (like real web form)
    const mockEvent = {
      parameter: testData,
      postData: null
    };
    
    const result = JSON.parse(doPost(mockEvent).getContent());
    
    console.log('Test result:', result);
    return result;
    
  } catch (error) {
    console.error('Test error:', error);
    return { success: false, error: error.toString() };
  }
}