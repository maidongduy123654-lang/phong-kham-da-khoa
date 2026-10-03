### PHÂN HỆ: BÁC SĨ (CLINICAL DOCTOR MODULE)

#### **[US-DR-01] Đăng nhập, Quản lý hàng đợi và Tiếp nhận bệnh nhân**
*   **User Story:** Là một Bác sĩ, tôi muốn đăng nhập tài khoản y tế, theo dõi danh sách bệnh nhân đang chờ ngoài phòng khám và bấm nút tiếp nhận, để hệ thống cập nhật trạng thái làm việc và gọi số gọi tên ca tiếp theo vào phòng.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Bác sĩ nhập tài khoản chuyên môn -> middleware kiểm tra quyền `Role = Doctor` -> Hệ thống mở giao diện Khám bệnh chuyên khoa, khóa toàn bộ các menu sửa đổi giá tiền hay thu tiền của Lễ tân/Admin.
    2. Hệ thống gọi API `GET /api/queue?room_id={id}` để hiển thị danh sách bệnh nhân đang chờ ở trạng thái `Chờ khám`.
    3. Bác sĩ nhấn nút "Tiếp nhận" -> Hệ thống gửi lệnh `PUT /api/queue/accept` để cập nhật trạng thái.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Khi bác sĩ nhấn nút "Tiếp nhận", trạng thái ca khám phải chuyển lập tức sang `Đang khám`. Bệnh nhân này sẽ tự động biến mất khỏi danh sách màn hình của Lễ tân quầy tiếp đón.
    *   **AC 2 (Đồng bộ thiết bị ngoài cửa):** Hệ thống đồng thời gửi một tín hiệu (bằng giao thức Websocket) phát tới màn hình hiển thị giả lập đặt trước cửa phòng để đổi số STT hiển thị và nhấp nháy chữ gọi tên bệnh nhân vào phòng khám.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1:* Bác sĩ bấm nút gọi số STT 015 -> Kiểm tra tab màn hình LED giả lập xem số hiển thị trên bảng ngoài phòng có tự động nhảy sang số 015 hay không.

#### **[US-DR-02] Ghi nhận hồ sơ bệnh án lâm sàng điện tử**
*   **User Story:** Là một Bác sĩ, tôi muốn ghi lại các thông tin triệu chứng y khoa và chỉ số sinh tồn của người bệnh vào phần mềm, để làm cơ sở dữ liệu bệnh án điện tử (EMR) phục vụ chẩn đoán bệnh.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Bác sĩ click chọn tab "Lịch sử y khoa" -> Hệ thống gọi API `GET /api/emr/past?patient_id={id}` hiển thị lịch sử khám cũ.
    2. Bác sĩ điền nội dung vào các trường text area: `Triệu chứng`, `Tiền sử bệnh`.
    3. Bác sĩ nhập các chỉ số vào các ô số (input type=number). Hệ thống kích hoạt bộ lắng nghe sự kiện (Event Listener) tại 2 ô Cân nặng và Chiều cao để tự động tính BMI.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1 (Ràng buộc nhập số):** Trường Nhiệt độ chỉ cho phép nhập số thập phân trong phạm vi hợp lý từ 34.0 đến 42.0 độ C. Nếu nhập ngoài khoảng này, hệ thống sẽ hiện cảnh báo và không cho lưu.
    *   **AC 2 (Công thức BMI):** Chỉ số BMI phải được tính toán tự động bằng mã code Front-end ngay khi bác sĩ vừa gõ xong 2 trường: Cân nặng (kg) và Chiều cao (cm) theo công thức chuẩn: `BMI = Cân nặng / ((Chiều cao / 100) ^ 2)`. Kết quả làm tròn đến 1 chữ số thập phân.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Kiểm tra công thức BMI):* Nhập Chiều cao = 160 cm, Cân nặng = 50 kg -> Kiểm tra xem ô chỉ số BMI hiển thị trên giao diện bác sĩ có tự động hiện ra con số kết quả là 19.5 hay không.

#### **[US-DR-03] Xử lý rẽ nhánh chỉ định Cận lâm sàng (Giả lập Demo)**
*   **User Story:** Là một Bác sĩ, tôi muốn đưa ra hướng xử lý bằng cách tích chọn dịch vụ chụp chiếu/xét nghiệm và tự điền kết quả mô tả giả lập, để rút ngắn quy trình demo mà vẫn đảm bảo tính logic của bệnh án.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Bác sĩ bấm chọn tab "Chỉ định cận lâm sàng" -> Hệ thống load danh sách dịch vụ kỹ thuật.
    2. Bác sĩ tích chọn hộp kiểm (Checkbox) mục "Siêu âm ổ bụng" -> Hệ thống mở ra một ô nhập liệu dạng Text Area có tên `Mô tả kết quả CLS` và một nút chọn file ảnh.
    3. Bác sĩ tự gõ kết quả chẩn đoán hình ảnh giả định và đính kèm file ảnh mẫu -> Nhấn "Lưu kết quả CLS" -> Gửi lệnh `POST /api/emr/cls-fake` để ghi nhận dữ liệu vào lượt khám.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1 (Quy trình đơn giản hóa cho Demo):** Bác sĩ được quyền nhập trực tiếp nội dung kết quả cận lâm sàng ngay tại chỗ mà không cần qua bước phê duyệt trung gian của phòng kỹ thuật viên hay bắt bệnh nhân đi đóng tiền trước (Gom hết tiền về cuối ca cho Lễ tân thu theo giả định bài demo).
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1:* Bác sĩ tích chọn "X-quang ngực thẳng" -> Nhập chuỗi văn bản: "Hình ảnh phổi bình thường" -> Upload file ảnh chụp phổi -> Nhấn Lưu -> Kiểm tra xem dữ liệu này đã được ghi đính kèm vào đúng ID ca khám hiện hành trong database chưa.

#### **[US-DR-04] Kê đơn thuốc điện tử và Kết luận ca khám**
*   **User Story:** Là một Bác sĩ, tôi muốn chẩn đoán mã bệnh chuẩn y tế và thực hiện kê đơn thuốc y khoa trên phần mềm, để hệ thống khóa giữ số lượng thuốc trong kho và đẩy thông tin quyết toán về cho quầy lễ tân.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Bác sĩ gõ ký tự vào ô tìm kiếm thuốc -> Hệ thống gọi API `GET /api/medicines/search?q={chuoi}` để tìm kiếm kết quả gợi ý.
    2. Bác sĩ nhập số lượng thuốc cần kê -> Hệ thống kiểm tra điều kiện tồn kho thực tế.
    3. Bác sĩ chọn mã bệnh ICD-10 và nhấn nút "Hoàn thành ca khám" -> Gọi API `POST /api/prescriptions` để đóng ca khám.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1 (Chặn dị ứng):** Hệ thống tự động chạy thuật toán đối chiếu chuỗi ký tự tên hoạt chất của thuốc vừa kê với dữ liệu ghi trong trường `Tiền sử dị ứng` ở hồ sơ bệnh nhân. Nếu phát hiện trùng khớp từ khóa nguy hiểm, hệ thống chặn lệnh lưu toa thuốc và hiển thị cửa sổ Pop-up cảnh báo lỗi màu đỏ: *"Cảnh báo: Bệnh nhân có tiền sử dị ứng với thành phần của thuốc này, vui lòng thay đổi thuốc khác!"*.
    *   **AC 2:** Khi bấm nút "Hoàn thành ca khám", ca khám phải chuyển trạng thái sang `Chờ thanh toán cuối`. Số lượng thuốc kê trong đơn sẽ chuyển sang trạng thái "Tạm khóa giữ kho" để các bác sĩ ở phòng khác không thể kê vượt quá số lượng thuốc thực tế còn lại.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Kiểm tra chặn dị ứng):* Hồ sơ bệnh nhân ghi nhận tiền sử dị ứng là từ khóa "Penicillin". Bác sĩ thao tác tìm kiếm và chọn kê loại thuốc có chứa hoạt chất tên "Penicillin V" -> Nhấn Lưu đơn -> Hệ thống bắt buộc phải hiển thị cửa sổ pop-up chặn lại không cho lưu.
