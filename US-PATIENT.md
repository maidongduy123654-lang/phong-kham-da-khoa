### PHÂN HỆ: BỆNH NHÂN (PATIENT PORTAL MODULE)

#### **[US-PT-01] Đặt lịch khám trực tuyến**
*   **User Story:** Là một Bệnh nhân, tôi muốn lựa chọn Chuyên khoa, Bác sĩ và các khung giờ còn trống trên Web/App, để hệ thống ghi nhận lịch hẹn trước, giúp tôi chủ động thời gian đến khám.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Người dùng truy cập trang đặt lịch -> Hệ thống gọi API `GET /api/specialties` để hiển thị danh sách chuyên khoa.
    2. Người dùng chọn Chuyên khoa -> Hệ thống gọi API `GET /api/doctors?specialty_id={id}` để lọc bác sĩ tương ứng.
    3. Người dùng chọn Bác sĩ -> Hệ thống kiểm tra bảng lịch trực `[US-AD-03]` qua API `GET /api/slots?doctor_id={id}&date={date}` để render các ô Time-slot (15 phút/ca).
    4. Người dùng nhấn "Xác nhận đặt lịch" -> Hệ thống gửi lệnh `POST /api/appointments` để khóa giữ khung giờ và lưu bản ghi trạng thái `Chờ xác nhận`.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Ẩn hoặc khóa click (disable) tất cả các khung giờ đã quá giờ hiện tại hoặc đã có bệnh nhân khác đặt chỗ.
    *   **AC 2 (Transaction Lock):** Sử dụng cơ chế khóa bi quan (Pessimistic Locking) trong database. Nếu 2 người dùng bấm "Đặt lịch" cho cùng 1 slot tại cùng 1 mili-giây, hệ thống chỉ chấp nhận yêu cầu xử lý trước. Yêu cầu thứ 2 bị rollback dữ liệu và báo lỗi: *"Khung giờ này vừa mới có người đăng ký, vui lòng chọn lại khung giờ khác"*.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Luồng đúng):* Khách chọn Khoa Nội -> Bác sĩ Minh -> Slot 09:00 ngày mai -> Bấm đặt -> Hệ thống báo "Thành công", database tạo mới bản ghi lịch hẹn.
    *   *Test Case 2 (Chặn lỗi):* Cố tình dùng 2 trình duyệt khác nhau bấm đặt cùng Slot 09:00 tại cùng một thời điểm -> Trình duyệt 1 báo thành công, trình duyệt 2 phải hiển thị pop-up báo lỗi trùng lịch.

#### **[US-PT-02] Tự động gửi thông tin và sinh Mã QR định danh**
*   **User Story:** Là một Bệnh nhân, tôi muốn nhận được thông báo xác nhận tự động kèm mã QR Code ngay sau khi đặt lịch thành công, để tôi có thể lưu trữ thông tin lịch hẹn và thực hiện check-in nhanh tại quầy.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Database xác nhận bản ghi lịch hẹn hợp lệ -> Trạng thái chuyển sang `Đã xác nhận`.
    2. Hệ thống gọi thư viện `qrcode-generator` mã hóa chuỗi data dạng JSON: `{"app_id": 102, "pt_name": "Nguyen Van A", "doc_id": 4, "time": "09:00 25/12/2023"}` thành file ảnh `Mã_QR.png`.
    3. Hệ thống kích hoạt hàng đợi tác vụ (Background Job) gọi dịch vụ SMTP Mailer gửi email tự động tới hòm thư bệnh nhân.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Thời gian xử lý từ lúc đặt lịch thành công đến lúc gửi Email/SMS chứa mã QR không được quá 30 giây.
    *   **AC 2:** Ảnh QR Code trả về phải rõ nét, định dạng chuẩn (PNG), kích thước tối thiểu 250x250px để các thiết bị camera thông thường quét được.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Luồng đúng):* Kiểm tra hòm thư Email đã đăng ký sau khi đặt lịch -> Nhận được mail tiêu đề "Xác nhận lịch hẹn thành công" kèm theo file ảnh QR Code quét ra đúng thông tin cá nhân.

#### **[US-PT-03] Tự check-in xác nhận diện hiện diện tại quầy**
*   **User Story:** Là một Bệnh nhân, tôi muốn quét mã QR định danh tại thiết bị quét của phòng khám, để hệ thống tự động xác nhận tôi đã đến nơi và xếp tôi vào hàng đợi khám một cách nhanh chóng.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Bệnh nhân đưa ảnh QR Code trước webcam của Kiosk -> Hệ thống đọc chuỗi ký tự được mã hóa.
    2. Gọi API `PUT /api/appointments/checkin` gửi chuỗi mã dữ liệu lên server.
    3. Server giải mã, đối chiếu với ngày hiện tại (`current_date`) và khung giờ làm việc của phòng khám.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Nếu mã QR hợp lệ, trạng thái lịch hẹn đổi sang `Đã đến - Chờ tiếp đón`. Đồng thời bắn một tín hiệu sự kiện (Event) sang cổng kết nối thời gian thực (Websocket) để tự động cập nhật danh sách chờ trên màn hình máy tính của Lễ tân.
    *   **AC 2:** Nếu mã QR có ngày hẹn lệch với ngày hiện hành, hoặc bệnh nhân đến muộn quá khung giờ đã đặt > 30 phút, hệ thống từ chối check-in và hiển thị dòng chữ cảnh báo màu đỏ: *"Mã không hợp lệ hoặc đã quá giờ hẹn, vui lòng liên hệ trực tiếp quầy lễ tân để xử lý vãng lai"*.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Quá giờ):* Đặt lịch 08:00 sáng. Đến 09:15 sáng mới mang mã QR đến quét tại Kiosk -> Màn hình phải chặn lại và hiển thị thông báo lỗi quá giờ.

#### **[US-PT-04] Tra cứu Hồ sơ bệnh án điện tử cá nhân (EMR Client)**
*   **User Story:** Là một Bệnh nhân, tôi muốn đăng nhập vào cổng thông tin cá nhân bằng số điện thoại, để xem lại toàn bộ lịch sử khám bệnh, các đơn thuốc đã kê và hóa đơn tài chính của mình.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Bệnh nhân nhập SĐT và mật khẩu truy cập -> Gọi API `POST /api/patient/login`.
    2. Đăng nhập thành công -> Gọi API `GET /api/emr/history?patient_id={id}`.
    3. Hệ thống truy vấn (SQL Select) gộp dữ liệu từ các bảng Lịch khám, Đơn thuốc, Hóa đơn và hiển thị giao diện danh sách.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Mặc định sắp xếp danh sách các lượt khám giảm dần theo thời gian (Lượt khám ngày gần nhất luôn nằm trên cùng).
    *   **AC 2:** Khi bấm "Xem chi tiết", hệ thống phải load đầy đủ data: Tên bác sĩ điều trị, Chẩn đoán mã ICD-10, bảng Đơn thuốc (Tên thuốc, Hàm lượng, Số lượng, Liều dùng), và hình ảnh kết quả cận lâm sàng giả lập.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1:* Bấm vào lượt khám ngày 10/11 -> Kiểm tra xem đơn thuốc hiển thị trên màn hình của Bệnh nhân có khớp chuẩn xác từng viên, từng tên thuốc với đơn thuốc mà Bác sĩ đã bấm lưu trong database ngày hôm đó không.
