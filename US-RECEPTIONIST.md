### PHÂN HỆ: LỄ TÂN (RECEPTIONIST MODULE)

#### **[US-RC-01] Tiếp đón và Kiểm tra dữ liệu hồ sơ bệnh nhân**
*   **User Story:** **Là một** Lễ tân, **tôi muốn** nhập Số điện thoại hoặc Số CCCD của khách hàng vào thanh tìm kiếm, **để** kiểm tra tư cách bệnh nhân cũ hoặc tạo mới hồ sơ bệnh án cho bệnh nhân mới.
*   **Tiêu chí nghiệm thu:**
    *   *Kịch bản A (Bệnh nhân cũ):* Hệ thống tự đổ dữ liệu cá nhân cũ ra biểu mẫu. Lễ tân chỉ chọn chuyên khoa khám hôm nay và nhập ô `Lý do đến khám`.
    *   *Kịch bản B (Bệnh nhân mới):* Hệ thống mở form trống. Bắt buộc nhập các trường: *Họ tên (Tự động viết hoa), Ngày sinh, Giới tính, SĐT (Đủ 10 chữ số), Địa chỉ*. Bấm lưu hệ thống tự sinh mã `Patient ID` định dạng: `BN-YYYYMMDD-XXXX`.
    *   *Quy tắc chặn:* Không được tạo hồ sơ mới nếu trùng SĐT hoặc CCCD đã có trong database.

#### **[US-RC-02] Thu phí khám ban đầu, Tính hóa đơn tổng hợp và Điều phối hàng đợi**
*   **Mô tả phạm vi Demo:** Áp dụng giả định thanh toán tập trung. Lễ tân thu tiền khám đầu khâu và kiêm luôn thu tiền thuốc/CLS cuối khâu.
*   **User Story:** **Là một** Lễ tân, **tôi muốn** thực hiện thu phí dịch vụ và xác nhận hóa đơn tổng hợp trên phần mềm, **để** hệ thống in phiếu và xếp bệnh nhân vào hàng đợi hoặc giải phóng kho thuốc khi họ ra về.
*   **Tiêu chí nghiệm thu:**
    *   *Đầu quy trình:* Hệ thống quét bảng giá dịch vụ để hiển thị phí khám ban đầu. Hỗ trợ in Phiếu Khám Bệnh gồm: *Mã bệnh nhân, Số thứ tự (STT), Tên bệnh nhân, Chuyên khoa, Số phòng, Tên bác sĩ*. Đẩy dữ liệu vào hàng đợi phòng khám theo thuật toán FIFO.
    *   *Cuối quy trình:* Hệ thống load mã bệnh nhân, gộp tiền đơn thuốc + tiền dịch vụ CLS (do bác sĩ chỉ định thêm) thành 1 hóa đơn tổng hợp duy nhất. Cho phép chọn `Tiền mặt` hoặc hiển thị mã `VietQR động`. Sau khi xác nhận thanh toán, hệ thống tự động trừ số lượng tồn kho dược theo đơn thuốc.
