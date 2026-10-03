### PHÂN HỆ: BỆNH NHÂN (PATIENT MODULE)

#### **[US-PT-01] Đặt lịch khám trực tuyến**
*   **User Story:** **Là một** Bệnh nhân, **tôi muốn** chủ động đặt lịch khám trên Website/App bằng cách chọn chuyên khoa, bác sĩ và khung giờ mong muốn, **để** tôi tiết kiệm thời gian chờ đợi khi đến phòng khám thực tế.
*   **Tiêu chí nghiệm thu (Acceptance Criteria):**
    *   Hệ thống hiển thị danh sách Chuyên khoa -> Bác sĩ thuộc khoa -> Khung giờ trống (Time-slot 15 phút/ca).
    *   Hệ thống phải tự ẩn hoặc đổi màu xám các khung giờ đã bị trùng lịch hoặc ngoài ca trực của bác sĩ.
    *   *Xử lý lỗi:* Nếu hai bệnh nhân cùng bấm đặt một khung giờ tại một thời điểm, hệ thống chỉ cho phép người đầu tiên lưu thành công và trả về thông báo lỗi cho người thứ hai: *"Khung giờ này vừa mới có người đăng ký, vui lòng chọn lại khung giờ khác"*.

#### **[US-PT-02] Nhận mã QR xác nhận lịch đặt**
*   **User Story:** **Là một** Bệnh nhân, **tôi muốn** nhận được thông báo xác nhận kèm mã QR Code ngay sau khi hệ thống xử lý lịch đặt thành công, **để** tôi lưu trữ thông tin lịch hẹn và dùng làm thẻ thông qua khi check-in tại quầy.
*   **Tiêu chí nghiệm thu:**
    *   Trạng thái lịch hẹn chuyển sang `Đã xác nhận`.
    *   Hệ thống tự động chạy hàm mã hóa để sinh một mã QR Code định danh duy nhất chứa chuỗi: `Mã lịch hẹn | Tên bệnh nhân | Bác sĩ | Khung giờ`.
    *   Đầu ra phải tự động bắn Email/SMS thông báo chuẩn hóa kèm file ảnh QR Code cho bệnh nhân.

#### **[US-PT-03] Check-in xác nhận có mặt tại quầy**
*   **User Story:** **Là một** Bệnh nhân, **tôi muốn** tự quét mã QR đã nhận trước camera của thiết bị tại quầy, **để** hệ thống xác nhận tôi đã đến và đưa tôi vào hàng đợi khám một cách nhanh chóng.
*   **Tiêu chí nghiệm thu:**
    *   *Luồng đúng:* Nếu mã QR hợp lệ (đúng ngày, đúng giờ), hệ thống chuyển trạng thái sang `Đã đến - Chờ tiếp đón` và đồng bộ tức thì sang màn hình Lễ tân.
    *   *Luồng lỗi:* Nếu quét sai ngày hoặc quá giờ hẹn > 30 phút, màn hình hiển thị thông báo lỗi màu đỏ: *"Mã không hợp lệ hoặc đã quá giờ hẹn, vui lòng liên hệ trực tiếp quầy lễ tân để xử lý vãng lai"*.

#### **[US-PT-04] Tra cứu hồ sơ bệnh án cá nhân**
*   **User Story:** **Là một** Bệnh nhân, **tôi muốn** đăng nhập vào tài khoản cá nhân, **để** tra cứu lại toàn bộ thông tin lịch sử y khoa, hóa đơn và đơn thuốc của mình.
*   **Tiêu chí nghiệm thu:**
    *   Hiển thị danh sách các ngày đã khám theo thứ tự thời gian mới nhất lên đầu.
    *   Khi click vào một lượt khám, hệ thống hiển thị chi tiết: Tên bác sĩ, Chẩn đoán bệnh (Mã ICD-10), Đơn thuốc (Tên thuốc, Số lượng, Liều lượng, Cách dùng), Kết quả cận lâm sàng giả lập (nếu có) và Biên lai viện phí tổng hợp.
