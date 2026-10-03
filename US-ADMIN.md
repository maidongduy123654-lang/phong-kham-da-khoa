### PHÂN HỆ: QUẢN TRỊ VIÊN (ADMIN MODULE)

#### **[US-AD-01] Đăng nhập và Giám sát số liệu vận hành thời gian thực (Dashboard)**
*   **User Story:** Là một Quản trị viên, tôi muốn đăng nhập tài khoản tối cao và theo dõi biểu đồ thống kê các chỉ số hoạt động của phòng khám, để nắm bắt tiến độ công việc và phát hiện sớm các điểm nghẽn quá tải cục bộ.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Admin đăng nhập -> Hệ thống cấp Token quyền hạn cao nhất (`Admin`), mở giao diện Dashboard tổng quan.
    2. Trang Dashboard thiết lập một hàm lặp thời gian (ví dụ: chạy hàm `setInterval` gọi API load lại dữ liệu sau mỗi 10 giây) hoặc kết nối qua kênh mạng Websocket để liên tục truy vấn số lượng ca khám từ cơ sở dữ liệu.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Dashboard quản trị phải hiển thị trực quan 3 chỉ số chính: Tổng số bệnh nhân đã tiếp đón trong ngày, Số ca đang có trạng thái `Đang khám` theo từng phòng, và Độ dài hàng đợi số ca đang ở trạng thái `Chờ khám` của từng chuyên khoa.
    *   **AC 2 (Cảnh báo quá tải):** Hệ thống liên tục đếm số lượng hàng đợi của từng phòng. Nếu phát hiện số lượng bản ghi trạng thái `Chờ khám` tại bất kỳ phòng khám chuyên khoa nào vượt quá con số 10 người, giao diện tại khu vực phòng đó trên màn hình Admin phải kích hoạt thuộc tính đổi màu hiển thị sang hiệu ứng nhấp nháy màu đỏ để báo hiệu.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Kiểm tra tính năng đếm ca):* Lễ tân thực hiện in phiếu thu tiền và đẩy thêm 1 bệnh nhân mới vào phòng khám Nội -> Kiểm tra xem số lượng hàng đợi của phòng khám Nội hiển thị trên màn hình Dashboard của Admin có tự động tăng số đếm lên +1 hay không.

#### **[US-AD-02] Quản lý danh mục cốt lõi hệ thống (Master Data Management)**
*   **User Story:** Là một Quản trị viên, tôi muốn thực hiện các tác vụ Thêm, Sửa, Khóa trạng thái hoạt động của danh mục thuốc và biểu giá dịch vụ, để đảm bảo dữ liệu chạy trên các phân hệ của Lễ tân và Bác sĩ luôn chính xác.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Admin vào menu "Quản lý kho thuốc" -> Hệ thống hiển thị bảng danh sách dạng Table dữ liệu.
    2. Admin bấm nút "Thêm mới" -> Hệ thống hiển thị form nhập dữ liệu -> Admin nhập thông tin -> Nhấn nút Lưu -> Hệ thống chạy câu lệnh SQL `INSERT INTO Medicines`.
    3. Admin bấm nút "Khóa" một loại thuốc -> Hệ thống chạy câu lệnh SQL `UPDATE Medicines SET status = 'Inactive' WHERE id = {id}`.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1 (Toàn vẹn dữ liệu):** Hệ thống chặn tuyệt đối tính năng xóa vật lý (Hard Delete - xóa mất bản ghi khỏi database) đối với các loại thuốc hoặc loại dịch vụ khám đã từng xuất hiện trong lịch sử hóa đơn hoặc đơn thuốc cũ. Hệ thống chỉ cho phép chuyển đổi thuộc tính trạng thái sang `Khóa / Ngừng hoạt động` để đảm bảo không bị lỗi khóa ngoại (Foreign Key Error).
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Thử xóa dữ liệu cũ):* Chọn một loại thuốc đã từng được kê đơn cho bệnh nhân trong tuần trước -> Bấm nút Xóa (Delete) -> Phần mềm bắt buộc phải hiển thị thông báo chặn lại: *"Không thể xóa danh mục này do có dữ liệu liên kết lịch sử, chỉ cho phép chuyển sang trạng thái khóa hoạt động"*.

#### **[US-AD-03] Quản lý Lịch làm việc và Phân ca nhân sự**
*   **User Story:** Là một Quản trị viên, tôi muốn thiết lập ma trận phân ca trực cho đội ngũ Bác sĩ chuyên khoa theo tuần hoặc tháng, để hệ thống tự động đồng bộ làm căn cứ mở các khung giờ đặt lịch tương ứng cho bệnh nhân ở xa.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Admin chọn menu "Phân ca trực" -> Hệ thống hiển thị bảng lưới (Grid) ma trận thời gian.
    2. Admin chọn tên Bác sĩ, gán số phòng khám, tích chọn các buổi trực (Sáng/Chiều) trong tuần -> Nhấn nút "Lưu lịch trực" -> Hệ thống thực hiện câu lệnh lưu dữ liệu vào bảng `Schedules`.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1 (Ràng buộc đồng bộ):** Ngay sau khi lịch trực được lưu thành công, dữ liệu phải lập tức được áp dụng làm điều kiện lọc (Filter). Khi Bệnh nhân truy cập ứng dụng đặt lịch hẹn từ xa `[US-PT-01]`, hệ thống sẽ đọc bảng `Schedules` này để tự động mở ra các ô khung giờ trống (Time-slots) tương ứng, tuyệt đối không hiển thị khung giờ của những ngày bác sĩ không có lịch trực.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1:* Admin cấu hình lịch trực cho Bác sĩ Tuấn chỉ làm việc vào ngày Thứ Ba tuần sau -> Mở ứng dụng của Bệnh nhân ra kiểm tra xem khi chọn Bác sĩ Tuấn, hệ thống có chặn khóa không cho bấm vào các ngày Thứ Hai, Thứ Tư, Thứ Năm hay không.

#### **[US-AD-04] Quản lý Tài khoản nhân sự và Phân quyền bảo mật (RBAC)**
*   **User Story:** Là một Quản trị viên, tôi muốn khởi tạo tài khoản đăng nhập cho nhân viên mới và gán quyền hạn truy cập nghiêm ngặt theo chức vụ, để bảo mật dữ liệu y tế nội bộ của phòng khám.
*   **Luồng xử lý chi tiết (System Flow):**
    1. Admin vào menu "Quản lý nhân sự" -> Điền form tạo tài khoản: Họ tên, Email, Mật khẩu, gán Role (Bác sĩ hoặc Lễ tân).
    2. Nhấn nút "Lưu" -> Gọi API `POST /api/users` -> Hệ thống chạy giải thuật băm mật khẩu và lưu vào bảng nhân viên.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   **AC 1:** Khi lưu tài khoản mới, hệ thống bắt buộc phải kiểm tra trùng lặp trường Email trong database. Nếu Email đã tồn tại, hệ thống chặn lại và báo lỗi: *"Email này đã được sử dụng cho tài khoản khác"*.
    *   **AC 2 (Phân quyền Middleware):** Hệ thống thiết lập bộ chặn quyền (Middleware) ở Backend kiểm tra Token đăng nhập. Nếu một tài khoản có `Role = Receptionist` cố tình gõ nhập thủ công đường dẫn URL dành cho Bác sĩ (ví dụ: `/doctor/clinical-emr`) hoặc đường dẫn của Admin trên trình duyệt, hệ thống phải chặn lại ngay lập tức và trả về trang lỗi hiển thị thông báo: *"403 Forbidden - Bạn không có quyền truy cập vào tính năng này"*.
*   **Kịch bản kiểm thử mẫu (QC Test Cases):**
    *   *Test Case 1 (Kiểm tra bảo mật URL):* Đăng nhập bằng tài khoản của một nhân viên Lễ tân -> Cố tình gõ thủ công đường dẫn trang quản trị của Admin `/admin/dashboard` vào thanh địa chỉ của trình duyệt rồi ấn Enter -> Hệ thống bắt buộc phải chặn lại và hiển thị thông báo lỗi từ chối quyền truy cập.
