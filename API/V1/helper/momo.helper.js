const crypto = require("crypto");
const axios = require("axios");

module.exports.momoPaymentApi = async (priceAmount, order_id, callBackUrl) => {
  const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const orderId = `${order_id}`;
  const requestId = `${Date.now()}`;
  const redirectUrl =
    "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  const ipnUrl = callBackUrl;
  const amount = priceAmount;
  const orderInfo = "Thanh toán hóa đơn";
  const requestType = "captureWallet";

  // Tạo chuỗi raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Ký mã hóa SHA256
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  // Dữ liệu gửi đến API Momo
  const requestData = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData: "",
    requestType,
    signature,
    lang: "vi",
  };
  console.log(requestData);
  try {
    // Gửi yêu cầu đến Momo
    const response = await axios.post(endpoint, requestData);
    return response.data; // Trả về kết quả từ Momo
  } catch (error) {
    console.error("Momo API Error:", error.response?.data || error.message);
    throw new Error("Lỗi kết nối tới Momo");
  }
};