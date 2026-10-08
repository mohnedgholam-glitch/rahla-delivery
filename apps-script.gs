// ==========================================
// Google Apps Script لإرسال رسائل WhatsApp
// ==========================================

// ضع هنا رقمك مع كود الدولة (بدون +)
const OWNER_PHONE = "201098021426";

// رابط API للإرسال عبر CallmeBot (مجاني)
// يمكنك استخدام API آخر مثل Twilio أو MessageBird
const API_URL = "https://api.callmebot.com/whatsapp.php";

/**
 * دالة الإرسال الرئيسية
 * استقبال بيانات الحجز وإرسالها عبر WhatsApp
 */
function doPost(e) {
  try {
    // استقبال البيانات من الموقع
    const data = JSON.parse(e.postData.contents);
    
    // التحقق من البيانات المطلوبة
    if (!data.name || !data.phone || !data.service) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          success: false, 
          message: "بيانات ناقصة" 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // بناء رسالة الحجز
    const message = buildBookingMessage(data);
    
    // إرسال الرسالة عبر WhatsApp
    const result = sendWhatsAppMessage(message);
    
    // حفظ البيانات في Google Sheet (اختياري)
    saveToSheet(data);
    
    // إرجاع الرد للموقع
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: result, 
        message: result ? "✅ تم إرسال الإشعار بنجاح" : "⚠️ حدث خطأ في الإرسال" 
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("❌ خطأ: " + error);
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        message: "خطأ في معالجة الطلب: " + error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * بناء رسالة الحجز
 */
function buildBookingMessage(data) {
  const serviceNames = {
    motorcycle: "🏍️ دراجة نارية",
    car: "🚗 سيارة عادية",
    quarter: "🚐 ربع نقل",
    half: "🚛 نص نقل",
    heavy: "🏗️ نقل ثقيل",
    bicycle: "🚴 دراجة عادية"
  };

  const date = new Date();
  const timeString = date.toLocaleString('ar-EG');

  const message = `
*🚀 طلب حجز جديد من رحلة*

👤 *الاسم:* ${data.name}
📞 *الهاتف:* ${data.phone}
${serviceNames[data.service] || '🚗 ' + data.service}
⏰ *الوقت المفضل:* ${data.time}
📍 *من:* ${data.from}
📍 *إلى:* ${data.to}
${data.notes ? '📝 *ملاحظات:* ' + data.notes : ''}
🕐 *التاريخ والوقت:* ${timeString}
`;

  return message.trim();
}

/**
 * إرسال الرسالة عبر CallmeBot API
 */
function sendWhatsAppMessage(message) {
  try {
    // إنشاء رابط الطلب
    const payload = {
      phone: OWNER_PHONE,
      text: message
    };

    const options = {
      method: "get",
      muteHttpExceptions: true
    };

    // بناء الرابط
    const url = API_URL + "?" + 
                "phone=" + payload.phone + 
                "&text=" + encodeURIComponent(payload.text) +
                "&apikey="; // ملاحظة: CallmeBot لا يحتاج API key للاستخدام المجاني

    Logger.log("📤 إرسال الرسالة إلى: " + payload.phone);
    
    const response = UrlFetchApp.fetch(url, options);
    const result = response.getResponseCode() === 200;
    
    if (result) {
      Logger.log("✅ تم الإرسال بنجاح");
    } else {
      Logger.log("⚠️ فشل الإرسال - الرمز: " + response.getResponseCode());
    }
    
    return result;
    
  } catch (error) {
    Logger.log("❌ خطأ في الإرسال: " + error);
    return false;
  }
}

/**
 * حفظ البيانات في Google Sheet (اختياري)
 * للاحتفاظ بسجل الطلبات
 */
function saveToSheet(data) {
  try {
    // احصل على معرّف الجدول من هنا
    const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // استبدلها بـ ID الجدول الفعلي
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    const row = [
      new Date().toLocaleString('ar-EG'),
      data.name,
      data.phone,
      data.service,
      data.time,
      data.from,
      data.to,
      data.notes || "لا توجد ملاحظات"
    ];
    
    sheet.appendRow(row);
    Logger.log("💾 تم حفظ البيانات في الجدول");
    
  } catch (error) {
    Logger.log("⚠️ خطأ في حفظ البيانات: " + error);
  }
}

/**
 * دالة اختبار الإرسال
 * اضغط Run من أجل الاختبار
 */
function testSendMessage() {
  const testData = {
    name: "محمد أحمد",
    phone: "201234567890",
    service: "car",
    time: "14:30",
    from: "القاهرة - المعادي",
    to: "القاهرة - الدقي",
    notes: "طلب تجريبي"
  };

  const message = buildBookingMessage(testData);
  Logger.log("📨 الرسالة المراد إرسالها:");
  Logger.log(message);
  
  const result = sendWhatsAppMessage(message);
  Logger.log(result ? "✅ نجح الاختبار" : "❌ فشل الاختبار");
}
