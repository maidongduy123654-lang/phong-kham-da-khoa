### PHÂN HỆ: LỄ TÂN (RECEPTIONIST MODULE)

#### **[US-RC-01] Đăng nhập và Số hóa thông tin hồ sơ bệnh nhân**
*   **User Story:** Là một Lễ tân, tôi muốn đăng nhập tài khoản và tra cứu bệnh nhân bằng Số điện thoại hoặc Số CCCD, để xác thực thông tin bệnh nhân cũ hoặc khởi tạo hồ sơ y tế điện tử cho bệnh nhân mới.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Lễ tân nhập Email/Password -> Hệ thống gọi API xác thực -> Trả về Token gán quyền `Receptionist`. Hệ thống ẩn toàn bộ các menu tính năng của Bác sĩ/Admin.
    2. Lễ tân nhập chuỗi tìm kiếm vào ô tìm kiếm -> Hệ thống gọi lệnh API `GET /api/patients/search?keyword={giatri}`.
    3. *Nếu có kết quả:* Trả về thông tin Object Patient đổ vào các ô Input. *Nếu không có kết quả (Null):* Hệ thống giữ nguyên form trống để Lễ tân nhập mới.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1 (Dữ liệu bắt buộc):** Form tạo mới bắt buộc điền: Họ tên, Ngày sinh, Giới tính, SĐT. Nếu bỏ trống trường nào, hệ thống sẽ đổi viền ô đó thành màu đỏ và hiển thị chữ: *"Trường này không được bỏ trống"*.
    *   **AC 2 (Format Validation):** Ô Họ tên tự động chạy hàm `.toUpperCase()` để chuyển thành chữ IN HOA. Ô SĐT chỉ cho phép nhập số, nếu gõ chữ sẽ bị chặn và giới hạn tối đa đúng 10 ký tự số.
    *   **AC 3 (Data Integrity):** Khi ấn "Lưu hồ sơ", hệ thống tự động sinh mã `Patient ID` tăng dần theo thuật toán khóa duy nhất: `BN-YYYYMMDD-XXXX`.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Bắt lỗi định dạng):* Nhập ô SĐT là "0987abc123" -> Hệ thống phải tự động cắt bỏ chữ "abc", chỉ giữ lại chuỗi số hợp lệ.
    *   *Test Case 2 (Trùng dữ liệu):* Nhập một số SĐT đã có sẵn của bệnh nhân khác trong database -> Bấm Lưu -> Hệ thống phải chặn lại báo lỗi: *"Số điện thoại này đã được đăng ký cho hồ sơ khác"*.

#### **[US-RC-02] Thu phí khám ban đầu và Cấp phát Số thứ tự (STT)**
*   **User Story:** Là một Lễ tân, tôi muốn ghi nhận giao dịch thu phí khám lâm sàng ban đầu của bệnh nhân, để hệ thống cấp số thứ tự và tự động phân luồng bệnh nhân vào hàng đợi của phòng khám chuyên khoa.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Lễ tân chọn chuyên khoa cần khám -> Hệ thống thực hiện câu lệnh SQL truy vấn đơn giá dịch vụ khám từ bảng `Services`.
    2. Lễ tân chọn hình thức đóng tiền. Nếu chọn Chuyển khoản -> Hệ thống gọi API bên ngân hàng để vẽ một ảnh mã QR động (VietQR) có gán sẵn số tiền nộp.
    3. Xác nhận thu tiền -> Gọi API `POST /api/billing/initial-charge` -> Hệ thống lưu trạng thái hóa đơn thành `Đã thanh toán`.
    4. Hệ thống thực hiện đếm số lượng bản ghi đang chờ của phòng khám đó trong ngày, chạy hàm tăng số thứ tự lên +1.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Số thứ tự (`STT`) cấp phát cho bệnh nhân phải chạy liên tục từ 001 đến 999 trong ngày, tự động reset về lại 001 khi chuyển sang ngày mới.
    *   **AC 2:** Khi lệnh in được thực thi, máy in nhiệt phải xuất ra phiếu khám bệnh chứa đầy đủ các trường thông tin: Mã bệnh nhân, STT khám, Tên chuyên khoa, Số phòng và Tên bác sĩ.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Kiểm tra FIFO):* Bệnh nhân A đóng tiền lúc 08:00 nhận STT 010. Bệnh nhân B đóng tiền lúc 08:01 nhận STT 011 -> Kiểm tra màn hình danh sách chờ của Bác sĩ xem tên bệnh nhân A có nằm xếp trên tên bệnh nhân B hay không.

#### **[US-RC-03] Tính toán hóa đơn tổng hợp, Thu phí cuối ca và Phát thuốc (Gom luồng Demo)**
*   **User Story:** Là một Lễ tân, tôi muốn xử lý danh sách bệnh nhân đã hoàn thành lượt khám từ phòng bác sĩ đẩy về, để thực hiện thu phí thanh toán tổng hợp một lần và bàn giao thuốc cho bệnh nhân ra về.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Lễ tân click vào menu "Thanh toán đơn thuốc" -> Hệ thống gọi API `GET /api/billing/pending-final` để lấy về danh sách bệnh nhân có trạng thái ca khám là `Chờ thanh toán cuối`.
    2. Lễ tân chọn 1 bệnh nhân -> Hệ thống thực hiện phép tính gộp: `Tổng tiền thuốc` (Số lượng x Đơn giá từng loại thuốc trong toa) + `Phí cận lâm sàng thực hiện thêm` (nếu có).
    3. Lễ tân xác nhận nộp tiền -> Gọi API `PUT /api/visits/{id}/complete`.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Khi hóa đơn được xác nhận hoàn thành, trạng thái ca khám của bệnh nhân bắt buộc phải chuyển sang trạng thái cuối cùng là `Hoàn thành - Đã ra về`.
    *   **AC 2 (Trừ kho tự động):** Hệ thống kích hoạt một hàm Trigger/Stored Procedure trong database để chạy lệnh giảm số lượng tồn kho khả dụng (`stock_quantity`) của từng loại thuốc trong bảng danh mục Thuốc đúng bằng số lượng viên đã kê trong đơn.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Kiểm tra trừ kho):* Thuốc Paracetamol hiện tại trong kho đang còn tồn 100 viên. Bác sĩ kê đơn cho bệnh nhân 10 viên. Lễ tân bấm nút "Xác nhận thanh toán cuối ca" cho bệnh nhân đó -> Kiểm tra lại bảng danh mục Thuốc trong database xem số lượng tồn kho của thuốc Paracetamol có tự động giảm xuống còn đúng 90 viên hay không.
