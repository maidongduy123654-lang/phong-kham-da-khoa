# BÀI TẬP LỚN: ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## HỆ THỐNG QUẢN LÝ PHÒNG KHÁM ĐA KHOA 

---

## I. DANH SÁCH CÁC ĐỐI TƯỢNG (ACTORS) TRONG HỆ THỐNG
Để phù hợp với phạm vi một bài demo công nghệ, hệ thống tập trung vào 4 đối tượng cốt lõi sau:
1. **Bệnh nhân (Patient):** Người đặt lịch hẹn, check-in và nhận kết quả.
2. **Lễ tân (Receptionist):** Người tiếp đón, tạo hồ sơ, thu tiền khám và điều phối số thứ tự.
3. **Bác sĩ (Doctor):** Người khám lâm sàng, chỉ định xét nghiệm/chụp chiếu, kê đơn thuốc và đưa ra kết luận.
4. **Quản trị viên (Admin):** Người quản lý danh mục thuốc/biểu giá, chia lịch làm việc cho nhân sự và xem báo cáo.

---

## II. ĐẶC TẢ CHỨC NĂNG CHI TIẾT 

### 1. Phân hệ Bệnh nhân (Patient Module)
*   **[FR-PT-01] Đặt lịch trực tuyến:** Bệnh nhân lên Web/App chọn Chuyên khoa -> Bác sĩ -> Ngày/Giờ còn trống.
*   **[FR-PT-02] Nhận mã QR xác nhận:** Hệ thống tự động gửi một Mã QR Code định danh qua Email/SMS sau khi đặt lịch thành công.
*   **[FR-PT-03] Check-in tại quầy:** Bệnh nhân đến phòng khám đưa mã QR cho Lễ tân quét, hoặc tự quét tại máy để xác nhận có mặt.
*   **[FR-PT-04] Tra cứu hồ sơ:** Đăng nhập vào tài khoản cá nhân để xem lại Đơn thuốc, kết quả khám và các hóa đơn đã thanh toán.

### 2. Phân hệ Lễ tân (Receptionist Module)
*   **[FR-RC-01] Tiếp đón & Kiểm tra hồ sơ:** Quét mã QR check-in hoặc tìm kiếm bệnh nhân bằng SĐT/CCCD.
    *   *Nếu là bệnh nhân cũ:* Hệ thống hiển thị thông tin cũ, Lễ tân nhập lý do khám hiện tại.
    *   *Nếu là bệnh nhân mới:* Lễ tân nhập thông tin bắt buộc (Họ tên, Ngày sinh, Giới tính, SĐT). Hệ thống tự sinh mã `Patient ID`.
*   **[FR-RC-02] Thu phí ban đầu & Xếp hàng đợi:** Lễ tân thu tiền khám lâm sàng (Tiền mặt/Chuyển khoản). Sau khi xác nhận thanh toán, hệ thống tự động in phiếu và đẩy bệnh nhân vào hàng đợi của phòng khám chuyên khoa (theo nguyên tắc FIFO - ai đến trước khám trước).

### 3. Phân hệ Bác sĩ (Doctor Module)
*   **[FR-DR-01] Gọi bệnh nhân vào phòng:** Bác sĩ xem danh sách hàng đợi hiển thị trên phần mềm và nhấn "Tiếp nhận". Hệ thống đổi trạng thái ca khám thành "Đang khám" và hiển thị số thứ tự lên bảng LED trước cửa phòng.
*   **[FR-DR-02] Khám bệnh & Tra cứu lịch sử:** Hệ thống hiển thị lịch sử bệnh án cũ. Bác sĩ ghi nhận triệu chứng và các chỉ số sức khỏe cơ bản (mạch, huyết áp).
*   **[FR-DR-03] Xử lý chỉ định (Điểm quyết định):**
    *   *Nhánh 1 (Cần kiểm tra thêm):* Bác sĩ chọn các dịch vụ Cận lâm sàng (Xét nghiệm/Siêu âm/X-quang) trên phần mềm. Hệ thống ghi nhận chỉ định này vào hồ sơ của bệnh nhân.
    *   *Nhánh 2 (Triệu chứng rõ ràng):* Bác sĩ bỏ qua bước cận lâm sàng và chuyển thẳng sang màn hình Kê đơn thuốc.
*   **[FR-DR-04] Kê đơn thuốc & Kết luận:** Bác sĩ chọn thuốc từ danh mục sẵn có, nhập liều dùng. Hệ thống tự động cảnh báo nếu thuốc trùng với tiền sử dị ứng đã nhập. Bác sĩ nhập chẩn đoán bệnh, lời dặn và bấm "Hoàn thành ca khám".

### 4. Phân hệ Quản trị viên (Admin Module)
*   **[FR-AD-01] Dashboard giám sát:** Biểu đồ hiển thị tổng số ca khám trong ngày, số ca đang đợi tại từng phòng để quản lý tình trạng quá tải.
*   **[FR-AD-02] Quản lý danh mục (Master Data):** Thêm, sửa, xóa danh mục Thuốc (tên thuốc, giá bán), bảng giá dịch vụ khám và thông tin các Chuyên khoa.
*   **[FR-AD-03] Quản lý Lịch làm việc:** Thiết lập ca trực cho Bác sĩ. Lịch này sẽ quyết định các khung giờ trống hiển thị trên giao diện Đặt lịch của Bệnh nhân `[FR-PT-01]`.
*   **[FR-AD-04] Phân quyền tài khoản:** Tạo tài khoản cho nhân viên mới và gán quyền truy cập (Ví dụ: Lễ tân chỉ được xem màn hình tiếp đón và thu tiền; Bác sĩ chỉ có quyền xem bệnh án và kê đơn).

---

## III. QUY TẮC NGHIỆP VỤ & GIẢ ĐỊNH  (BUSINESS RULES)
1. **Quy tắc Mã bệnh nhân:** Mỗi bệnh nhân chỉ có một mã `Patient ID` duy nhất để quản lý dữ liệu xuyên suốt các công đoạn.
2. **Giả định quy trình thanh toán:** Để tối ưu hóa lượng code và tập trung vào luồng dữ liệu bệnh án cốt lõi, hệ thống giả định bệnh nhân sẽ thanh toán tập trung toàn bộ chi phí phát sinh (tiền thuốc, tiền chụp chiếu xét nghiệm nếu có) một lần duy nhất tại quầy Lễ tân sau khi Bác sĩ hoàn thành ca khám.
3. **Giả định kho thuốc & kết quả cận lâm sàng:** Hệ thống giả định kết quả xét nghiệm/chụp chiếu và số lượng thuốc trong kho luôn ở trạng thái sẵn sàng. Bác sĩ sau khi ra chỉ định có thể ghi nhận kết quả và thực hiện kê đơn ngay trên cùng một phân hệ mà không cần qua các bước trung gian của phòng kỹ thuật hay phòng dược.
