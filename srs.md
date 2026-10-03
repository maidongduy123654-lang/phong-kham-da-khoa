# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## HỆ THỐNG QUẢN LÝ PHÒNG KHÁM ĐA KHOA (CLINIC MANAGEMENT SYSTEM)

---

## I. DANH SÁCH CÁC ĐỐI TƯỢNG (ACTORS) TRONG HỆ THỐNG
HỆ thống phân quyền truy cập và phân chia chức năng dựa trên 4 nhóm đối tượng (Actors) cốt lõi:
1. **Bệnh nhân (Patient):** Đối tượng sử dụng hệ thống từ xa (Web/App Portal) để đặt lịch, nhận mã định danh (QR) và tra cứu thông tin y tế cá nhân sau khi khám kết thúc.
2. **Lễ tân (Receptionist):** Đối tượng sử dụng hệ thống tại quầy (Clinic Application). Thực hiện tiếp đón, số hóa hồ sơ người bệnh mới, thực hiện nghiệp vụ thu phí tập trung (đầu quy trình và cuối quy trình), in và cấp phát số thứ tự (STT).
3. **Bác sĩ (Doctor):** Đối tượng chuyên môn y khoa sử dụng phân hệ Clinical EMR. Thực hiện gọi số, chẩn đoán lâm sàng, ghi nhận chỉ số sinh tồn, ra lệnh cận lâm sàng (giả lập kết quả) và kê đơn thuốc điện tử.
4. **Quản trị viên (Admin):** Đối tượng có quyền hạn cao nhất (Admin Dashboard). Quản lý cấu hình danh mục cơ sở, thiết lập phân ca trực cho nhân sự và theo dõi báo cáo doanh thu phòng khám.

---

## II. ĐẶC TẢ CHỨC NĂNG CHI TIẾT (SYSTEM FEATURES)

### 1. Phân hệ Bệnh nhân (Patient Module)

#### [FR-PT-01] Đặt lịch khám trực tuyến
*   **Mô tả:** Cho phép khách hàng hoặc bệnh nhân chủ động đăng ký lịch hẹn trước trên giao diện Web hoặc ứng dụng di động Mobile App.
*   **Dữ liệu đầu vào (Input):** Chuyên khoa khám, Bác sĩ mong muốn, Ngày hẹn khám, Khung giờ mong muốn (Time-slot: mỗi ca cách nhau 15 phút, ví dụ: 08:00 - 08:15).
*   **Quy trình hệ thống xử lý:**
    1. Bệnh nhân chọn Chuyên khoa -> Hệ thống lọc và hiển thị danh sách các Bác sĩ đang hoạt động thuộc khoa đó.
    2. Bệnh nhân chọn Bác sĩ và Ngày khám -> Hệ thống đối chiếu dữ liệu lịch trực [FR-AD-03] và các lịch đã bị đặt để hiển thị các khung giờ còn trống (màu xanh) và ẩn các khung giờ đã kín (màu xám).
    3. Bệnh nhân bấm "Xác nhận đặt lịch" -> Hệ thống ghi nhận một bản ghi mới vào bảng Lịch hẹn với trạng thái Chờ xác nhận.
*   **Luồng ngoại lệ (Lỗi hoặc Chặn logic):**
    *   *Trường hợp trùng lịch:* Nếu tại thời điểm bấm nút, khung giờ đó vừa được một bệnh nhân khác đặt thành công, hệ thống sẽ hủy lệnh và trả về thông báo lỗi: "Khung giờ này vừa mới có người đăng ký, vui lòng chọn lại khung giờ khác".

#### [FR-PT-02] Nhận mã QR xác nhận lịch hẹn
*   **Mô tả:** Tự động gửi thông tin xác nhận số hóa đến thông tin liên lạc của bệnh nhân ngay khi hệ thống ghi nhận lịch đặt thành công.
*   **Dữ liệu xử lý:** Hệ thống chuyển trạng thái lịch hẹn sang Đã xác nhận. Đồng thời, một hàm mã hóa (hashing) sẽ tự động chạy để tạo ra một Mã QR Code định danh chứa chuỗi thông tin mã hóa: Mã lịch hẹn | Tên bệnh nhân | Bác sĩ | Khung giờ.
*   **Đầu ra (Output):** Hệ thống gửi một Email thông báo tự động (hoặc SMS) có định dạng chuẩn kèm theo file ảnh QR Code để bệnh nhân lưu về máy phục vụ check-in.

#### [FR-PT-03] Check-in xác nhận có mặt tại quầy
*   **Mô tả:** Xác thực hành động bệnh nhân đã đến phòng khám thực tế để đưa vào hàng đợi.
*   **Quy trình hệ thống xử lý:** Bệnh nhân mở ứng dụng đưa mã QR Code trước thiết bị camera quét (hoặc đưa cho Lễ tân quét). 
    *   *Trường hợp mã hợp lệ (đúng ngày, đúng khung giờ):* Hệ thống thay đổi trạng thái lịch hẹn thành Đã đến - Chờ tiếp đón. Đồng thời gửi tín hiệu đồng bộ danh sách sang màn hình của Lễ tân.
    *   *Trường hợp mã không hợp lệ (sai ngày hoặc quá giờ hẹn lớn hơn 30 phút):* Hệ thống hiển thị thông báo lỗi màu đỏ trên màn hình: "Mã không hợp lệ hoặc đã quá giờ hẹn, vui lòng liên hệ trực tiếp quầy lễ tân để xử lý vãng lai".

#### [FR-PT-04] Tra cứu hồ sơ bệnh án cá nhân
*   **Mô tả:** Cho phép bệnh nhân sở hữu tài khoản đăng nhập để xem lại lịch sử y khoa của bản thân.
*   **Giao diện và Dữ liệu hiển thị:** Danh sách các ngày đã từng đến khám (Sắp xếp theo thứ tự thời gian mới nhất lên đầu). 
*   **Chi tiết một bản ghi bao gồm:** Tên bác sĩ điều trị, Chẩn đoán bệnh (Mã ICD-10), Đơn thuốc y tế kèm theo (Tên thuốc, Số lượng, Cách dùng, Liều lượng), Kết quả xét nghiệm hoặc hình ảnh cận lâm sàng (nếu có) và Biên lai viện phí tổng hợp.

---

### 2. Phân hệ Lễ tân (Receptionist Module)

#### [FR-RC-01] Tiếp đón và Kiểm tra dữ liệu hồ sơ bệnh nhân
*   **Mô tả:** Lễ tân thực hiện kiểm tra tư cách bệnh nhân trên hệ thống phần mềm nội bộ phòng khám.
*   **Quy trình xử lý logic (Điểm quyết định):** Lễ tân nhập Số điện thoại hoặc Số CCCD của bệnh nhân vào thanh tìm kiếm toàn cục:
    *   **Kịch bản A (Bệnh nhân đã có dữ liệu trên hệ thống):** Phần mềm tự động điền các thông tin cá nhân cũ vào biểu mẫu. Lễ tân chỉ cần chọn Chuyên khoa cần khám hôm nay và gõ thêm trường Lý do đến khám (ví dụ: Đau đầu, sốt cao, tái khám...).
    *   **Kịch bản B (Bệnh nhân mới hoàn toàn):** Phần mềm hiển thị một biểu mẫu trống (Blank Form). Lễ tân bắt buộc phải nhập các trường dữ liệu có dấu hoa thị (*): Họ và tên (Bắt buộc viết hoa), Ngày sinh, Giới tính, Số điện thoại (Bắt buộc đúng 10 chữ số), Địa chỉ hiện tại. Nhấn "Lưu hồ sơ" -> Hệ thống tự động kích hoạt hàm sinh mã định danh duy nhất dạng BN-YYYYMMDD-XXXX (trong đó X là số thứ tự tăng dần trong ngày).

#### [FR-RC-02] Thu phí khám ban đầu và Điều phối xếp hàng đợi
*   **Mô tả:** Tính toán tiền khám lâm sàng và đẩy người bệnh vào đúng phòng chức năng của Bác sĩ.
*   **Quy trình hệ thống xử lý:**
    1. Hệ thống tự động quét bảng giá dịch vụ [FR-AD-02] của chuyên khoa được chọn để hiển thị số tiền cần nộp (Ví dụ: Phí khám Nội: 150.000 VNĐ).
    2. Lễ tân chọn hình thức thanh toán: Tiền mặt hoặc Chuyển khoản. Nếu chọn chuyển khoản, hệ thống hiển thị một mã VietQR động chứa chính xác số tiền cần trả lên màn hình phụ để khách quét.
    3. Sau khi xác nhận đã nhận đủ tiền, Lễ tân nhấn nút "Xác nhận thanh toán và In phiếu".
    4. Hệ thống thực hiện 2 hành động đồng thời:
        *   **Hành động 1:** Đẩy thông tin bệnh nhân vào danh sách hàng đợi (Queue) của phòng khám chuyên khoa đó dựa theo thuật toán FIFO (Ai nộp tiền trước khám trước).
        *   **Hành động 2:** Lệnh cho máy in nhiệt in ra Phiếu Khám Bệnh bao gồm: Mã số bệnh nhân, Số thứ tự khám (STT), Tên bệnh nhân, Chuyên khoa, Số phòng khám và Tên Bác sĩ trực.

---

### 3. Phân hệ Bác sĩ (Doctor Module)

#### [FR-DR-01] Quản lý hàng đợi phòng khám và Gọi bệnh nhân
*   **Mô tả:** Bác sĩ điều phối thứ tự khám của các bệnh nhân đang chờ bên ngoài cửa phòng thông qua màn hình phần mềm.
*   **Quy trình hệ thống xử lý:** Màn hình của Bác sĩ hiển thị danh sách tất cả các bệnh nhân có trạng thái Chờ khám thuộc phòng của mình.
    1. Bác sĩ nhấn vào nút "Tiếp nhận" (hoặc "Gọi người tiếp theo") trên giao diện.
    2. Hệ thống chuyển trạng thái của bệnh nhân đó từ Chờ khám sang Đang khám.
    3. Đồng thời, hệ thống kích hoạt tín hiệu đồng bộ hiển thị lên bảng LED ngoài cửa phòng, chuyển đổi số STT hiển thị sang số của bệnh nhân vừa được gọi.

#### [FR-DR-02] Ghi nhận hồ sơ khám bệnh lâm sàng
*   **Mô tả:** Số hóa quá trình thăm khám lâm sàng trực tiếp giữa Bác sĩ và Bệnh nhân.
*   **Quy trình xử lý:**
    1. Phần mềm cung cấp một tab phụ cho phép Bác sĩ click để mở xem lại toàn bộ lịch sử các đơn thuốc và bệnh án cũ của bệnh nhân này nhằm phục vụ chẩn đoán nền.
    2. Bác sĩ sử dụng các hộp nhập liệu (Text Area) để điền thông tin: Triệu chứng lâm sàng, Tiền sử bệnh.
    3. Nhập các thông số đo lường sức khỏe cơ bản vào hệ thống: Huyết áp (mmHg), Mạch (lần/phút), Nhiệt độ (độ C), Cân nặng (kg). Hệ thống tự động tính toán chỉ số BMI dựa trên cân nặng và chiều cao đã nhập.

#### [FR-DR-03] Xử lý chỉ định (Điểm quyết định logic)
*   **Mô tả:** Điểm rẽ nhánh luồng nghiệp vụ dựa trên kết luận chuyên môn của Bác sĩ. Giao diện cung cấp 2 nút chức năng lớn:
    *   **Nhánh 1 (Yêu cầu làm cận lâm sàng):** Bác sĩ bấm chọn danh mục Xét nghiệm (Máu, nước tiểu) hoặc Chẩn đoán hình ảnh (X-Quang, Siêu âm bụng). Do đây là hệ thống Demo, quy trình được đơn giản hóa tối đa: Bác sĩ tích chọn dịch vụ -> Hệ thống mở ra một ô trống để Bác sĩ tự nhập tay kết quả mô tả giả lập (hoặc đính kèm file ảnh demo) ngay trên màn hình hiện tại mà không cần đẩy qua phòng kỹ thuật thực tế. Sau khi nhập xong kết quả giả lập, hệ thống lưu thông tin cận lâm sàng vào hồ sơ hiện hành.
    *   **Nhánh 2 (Kê đơn ra về):** Nếu triệu chứng đã đủ rõ ràng, Bác sĩ bỏ qua phân hệ cận lâm sàng và click chọn trực tiếp vào tab chuyển sang màn hình Kê đơn thuốc.

#### [FR-DR-04] Kê đơn thuốc điện tử và Kết luận ca khám
*   **Mô tả:** Tạo đơn thuốc số hóa và đóng ca khám hiện tại.
*   **Quy trình hệ thống xử lý:**
    1. Bác sĩ gõ ký tự vào ô tìm kiếm thuốc -> Hệ thống kích hoạt tính năng Autocomplete gợi ý từ danh mục thuốc đang có sẵn trong kho dược thực tế [FR-AD-02], đồng thời hiển thị số lượng viên thuốc còn tồn cạnh tên thuốc.
    2. Bác sĩ nhập: Số lượng, Liều dùng (ví dụ: Sáng 1 viên, Tối 1 viên), Cách dùng (ví dụ: Uống sau ăn).
    3. **Tính năng kiểm tra an toàn (Business Rule):** Hệ thống tự động đối chiếu tên hoạt chất của thuốc với trường dữ liệu Tiền sử dị ứng của bệnh nhân trong hồ sơ. Nếu phát hiện trùng hoạt chất gây dị ứng, hệ thống sẽ chặn không cho lưu đơn và hiển thị Pop-up cảnh báo màu đỏ: "Cảnh báo: Bệnh nhân có tiền sử dị ứng với thành phần của thuốc này, vui lòng thay đổi thuốc khác!".
    4. Bác sĩ chọn Mã chẩn đoán bệnh theo danh mục chuẩn ICD-10 (bắt buộc), ghi nhận lời dặn, chọn ngày hẹn tái khám (nếu có) -> Nhấn nút "Hoàn thành ca khám".
    5. **Trạng thái thay đổi:** Ca khám chuyển sang trạng thái Chờ thanh toán cuối. Bệnh nhân được giải phóng khỏi phòng bác sĩ để di chuyển ngược lại quầy lễ tân.

---

### 4. Phân hệ Quản trị viên (Admin Module)

#### [FR-AD-01] Dashboard giám sát vận hành thời gian thực
*   **Mô tả:** Cung cấp báo cáo số liệu tổng quan trực quan phục vụ công tác quản lý phòng khám.
*   **Các chỉ số hiển thị:** 
    *   Tổng số lượng bệnh nhân đã tiếp tiếp đón trong ngày (Tổng số phiếu thu ban đầu).
    *   Số ca đang xử lý (Đang khám) tại mỗi phòng ban.
    *   Độ dài hàng đợi (Chờ khám) của từng phòng chuyên khoa.
    *  **Logic cảnh báo:** Nếu số lượng người bệnh chờ tại 1 phòng vượt quá con số 10 người, hệ thống tự động hiển thị hiệu ứng nhấp nháy đỏ tại phòng đó trên màn hình Admin để báo hiệu tình trạng quá tải cục bộ.

#### [FR-AD-02] Quản lý danh mục cốt lõi (Master Data Management)
*   **Mô tả:** Thực hiện các tác vụ CRUD (Thêm, Sửa, Xóa, Khóa trạng thái) đối với cơ sở dữ liệu dùng chung toàn hệ thống.
*   **Danh mục Thuốc:** Mã thuốc, Tên thương mại, Hoạt chất, Đơn vị tính (Viên/Gói/Chai), Giá bán lẻ, Trạng thái (Đang kinh doanh / Ngừng kinh doanh).
*   **Danh mục Dịch vụ và Chuyên khoa:** Mã dịch vụ, Tên dịch vụ (Khám nội, Khám nhi, Siêu âm, Chụp X-quang), Đơn giá dịch vụ.
*   **Lưu ý thiết kế:** Hệ thống không cho phép xóa vật lý (Hard Delete) các bản ghi danh mục thuốc hoặc dịch vụ đã từng có phát sinh giao dịch trong lịch sử để tránh lỗi toàn vẹn dữ liệu (Foreign Key Error). Chỉ cho phép chuyển đổi trạng thái sang Khóa/Ngừng hoạt động.

#### [FR-AD-03] Quản lý Lịch làm việc và Phân ca nhân sự
*   **Mô tả:** Admin thiết lập lịch trực cho đội ngũ Bác sĩ theo cấu trúc bảng Tuần/Tháng.
*   **Ràng buộc hệ thống (System Constraint):** Khi Admin lưu lịch trực của Bác sĩ A tại Phòng khám Nội vào các buổi sáng thứ Hai, thứ Tư, thứ Sáu -> Hệ thống tự động ghi nhận dữ liệu này để làm căn cứ mở các khung giờ trống hiển thị cho Bệnh nhân chọn lựa khi đặt lịch trực tuyến ở phân hệ [FR-PT-01].

#### [FR-AD-04] Quản lý Tài khoản và Phân quyền bảo mật (RBAC)
*   **Mô tả:** Khởi tạo thông tin định danh truy cập cho nhân viên phòng khám.
*   **Bảng phân quyền chi tiết (Role-Based Access Control):**
    *   **Quyền Lễ tân:** Được truy cập phân hệ [FR-RC], xem danh sách hóa đơn, in phiếu thu. Khóa toàn bộ tab bệnh án chuyên môn và danh mục hệ thống.
    *   **Quyền Bác sĩ:** Được truy cập phân hệ [FR-DR], xem hồ sơ y khoa EMR, kê đơn. Khóa tính năng sửa biểu giá dịch vụ, khóa tính năng thu tiền.

---

## III. QUY TẮC NGHIỆP VỤ & GIẢ ĐỊNH CHO BÀI DEMO (BUSINESS RULES)

1.  **Quy tắc Mã bệnh nhân duy nhất (Unique Patient ID):** Một bệnh nhân chỉ được cấp một mã Patient ID duy nhất trong suốt vòng đời hệ thống phần mềm. Mọi lượt khám sau này đều phải được ghi nhận nối tiếp dựa trên mã ID cũ này, tuyệt đối không tạo hồ sơ mới nếu thông tin SĐT hoặc CCCD đã tồn tại trong Database.
2.  **Giả định quy trình thanh toán tập trung (Gom luồng tài chính cho Demo):** Để tối ưu hóa khối lượng code giao diện và không cần phát triển thêm phân hệ Thu ngân hay Phòng dược riêng, hệ thống đưa ra giả định thiết kế: Toàn bộ tiền phát sinh phát sinh ở cuối ca khám (Tiền dịch vụ cận lâm sàng tích chọn thêm + Tiền tổng đơn thuốc do bác sĩ kê) sẽ được gom lại thành 1 hóa đơn tổng hợp duy nhất. Bệnh nhân cầm phiếu quay lại gặp Lễ tân ở quầy để thanh toán nốt 1 lần cuối và nhận thuốc trực tiếp tại đây để kết thúc quy trình ra về.
3.  **Giả định đồng bộ Kho dược tự động:** Hệ thống giả định số lượng tồn kho của các danh mục thuốc luôn ở trạng thái đầy đủ (In-stock). Hành động nhấn nút "Hoàn thành ca khám" của Bác sĩ hoặc nút "Xác nhận thanh toán cuối" của Lễ tân sẽ tự động trừ thẳng số lượng viên thuốc trong cơ sở dữ liệu kho mà không cần qua khâu xác nhận xuất kho thủ công của nhân viên kho dược.

