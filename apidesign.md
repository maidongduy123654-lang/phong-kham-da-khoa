#  Clinic Management System — API Design

![Version](https://img.shields.io/badge/version-1.0-blue)
![API](https://img.shields.io/badge/API-REST%20%7C%20JSON-green)
![Auth](https://img.shields.io/badge/auth-JWT%20%2B%20RBAC-orange)
![Status](https://img.shields.io/badge/status-draft-yellow)

Thiết kế API cho hệ thống quản lý phòng khám, phạm vi **4 phân hệ**: Bệnh nhân · Lễ tân · Bác sĩ · Quản trị viên.

- **Base URL:** `/api/v1`
- **Protocol:** REST + JSON
- **Ngày:** 14/11/2026

---

## 1. Quy ước chung

| Mục | Giá trị |
|---|---|
| Protocol | REST + JSON |
| Base URL | `/api/v1` |
| Auth | JWT (Bearer Token), RBAC theo role |
| Time format | ISO 8601 (`2026-11-14T09:30:00+07:00`) |
| ID format | ULID (sortable, không đoán được) |
| Pagination | `?page=1&limit=20` → response có `meta` |
| Error format | `{ "error": { "code": "...", "message": "...", "details": [...] } }` |
| Real-time | WebSocket `/ws` cho màn hình gọi số + dashboard admin |

**Roles & phạm vi quyền:**

| Role | Phạm vi |
|---|---|
| `PATIENT` | Chỉ thao tác trên dữ liệu của chính mình |
| `RECEPTIONIST` | Check-in, tạo bệnh nhân, thu phí, xếp hàng |
| `DOCTOR` | Khám, chỉ định CLS, kê đơn (chỉ bệnh nhân trong hàng đợi của mình) |
| `ADMIN` | Full quyền + master data + báo cáo |

---

## 2. Data Model

Các entity chính:

```text
Patient        (id, fullName, dob, gender, phone, cccd, allergies[], createdAt)
Doctor         (id, userId, fullName, specialtyId, roomNo)
Specialty      (id, name, price)
Schedule       (id, doctorId, date, slots[])         // slots = [{start, end, isBooked}]
Appointment    (id, patientId, doctorId, scheduleSlot, status, qrCode, createdAt)
Visit          (id, appointmentId, patientId, doctorId, status, queueNumber,
                checkedInAt, startedAt, completedAt)
QueueTicket    (id, visitId, type: RECEPTION|DOCTOR, number, status, calledAt)
ClinicalNote   (id, visitId, symptoms, vitals{mach, huyetAp, nhietDo}, diagnosisIcd10)
LabOrder       (id, visitId, items[{code, name}], status, result, approvedBy)
Prescription   (id, visitId, items[{drugId, name, dosage, qty}], createdAt)
Invoice        (id, visitId, type: CONSULT|LAB|MEDICINE, amount, status, paidAt)
Drug           (id, name, unit, price, stock, contraindications[])
User           (id, username, passwordHash, role, isActive)
AuditLog       (id, userId, action, entity, entityId, timestamp)

---

## 3. State Machine của Visit

```text
BOOKED → CHECKED_IN → WAITING_DOCTOR → IN_CONSULTATION
   → [PENDING_LAB] → IN_CONSULTATION (lần 2, khi có KQ)
   → COMPLETED
Nhánh phụ: BOOKED/CHECKED_IN → CANCELLED | NO_SHOW

┌──────────────────┬────────────────────────────────────────────────┐
│ Trạng thái       │ Ý nghĩa                                        │
├──────────────────┼────────────────────────────────────────────────┤
│ BOOKED           │ Bệnh nhân đã đặt lịch, chưa đến                │
│ CHECKED_IN       │ Đã quét QR / lễ tân xác nhận                   │
│ WAITING_DOCTOR   │ Đã thu phí, đang trong hàng đợi bác sĩ         │
│ IN_CONSULTATION  │ Bác sĩ đã nhấn "Tiếp nhận"                     │
│ PENDING_LAB      │ Bác sĩ chỉ định CLS, chờ kết quả               │
│ COMPLETED        │ Đã kê đơn + kết luận                           │
│ CANCELLED        │ Ca khám bị hủy                                 │
│ NO_SHOW          │ Bệnh nhân không đến                            │
└──────────────────┴────────────────────────────────────────────────┘

Module 1 — PATIENT (/api/v1/patient/*)

┌────┬────────┬──────────────────────────────────────────┬─────────────────────────────────────┬─────────────┐
│ #  │ Method │ Endpoint                                 │ Mô tả                               │ FR          │
├────┼────────┼──────────────────────────────────────────┼─────────────────────────────────────┼─────────────┤
│  1 │ GET    │ /specialties                             │ Danh sách chuyên khoa               │ FR-PT-01    │
│  2 │ GET    │ /specialties/{id}/doctors                │ Bác sĩ theo chuyên khoa             │ FR-PT-01    │
│  3 │ GET    │ /doctors/{id}/slots?date=YYYY-MM-DD      │ Khung giờ trống                     │ FR-PT-01    │
│  4 │ POST   │ /appointments                            │ Đặt lịch → trả về qrCode            │ FR-PT-01/02 │
│  5 │ GET    │ /appointments                            │ Lịch sử đặt lịch của tôi            │ FR-PT-04    │
│  6 │ GET    │ /appointments/{id}                       │ Chi tiết + QR                       │ FR-PT-02    │
│  7 │ DELETE │ /appointments/{id}                       │ Hủy lịch (trước 24h)                │ —           │
│  8 │ POST   │ /checkin                                 │ Quét QR tại Kiosk → trả STT         │ FR-PT-03    │
│  9 │ GET    │ /me/prescriptions                        │ Đơn thuốc của tôi                   │ FR-PT-04    │
│ 10 │ GET    │ /me/visits                               │ Lịch sử khám                        │ FR-PT-04    │
│ 11 │ GET    │ /me/invoices                             │ Lịch sử hóa đơn                     │ FR-PT-04    │
└────┴────────┴──────────────────────────────────────────┴─────────────────────────────────────┴─────────────┘

 Module 2 — RECEPTIONIST (/api/v1/reception/*)

┌────┬────────┬──────────────────────────────────────────┬─────────────────────────────────────┬─────────────┐
│ #  │ Method │ Endpoint                                 │ Mô tả                               │ FR          │
├────┼────────┼──────────────────────────────────────────┼─────────────────────────────────────┼─────────────┤
│  1 │ POST   │ /checkin/scan                            │ Body: {qrCode} → tìm appointment    │ FR-RC-01    │
│  2 │ GET    │ /patients/search?q=                      │ Tìm theo SĐT/CCCD                   │ FR-RC-01    │
│  3 │ POST   │ /patients                                │ Tạo bệnh nhân mới → sinh PatientID  │ FR-RC-01    │
│  4 │ PATCH  │ /patients/{id}                           │ Cập nhật thông tin                  │ FR-RC-01    │
│  5 │ POST   │ /visits                                  │ Tạo visit từ appointment/check-in   │ FR-RC-01    │
│  6 │ POST   │ /visits/{id}/payment                     │ Thu phí ban đầu                     │ FR-RC-02    │
│  7 │ POST   │ /visits/{id}/enqueue                     │ Đẩy vào hàng đợi bác sĩ (FIFO)      │ FR-RC-02    │
│  8 │ GET    │ /queues?doctorId=&status=                │ Xem hàng đợi                        │ FR-RC-02    │
│  9 │ POST   │ /visits/{id}/cancel                      │ Hủy ca                              │ —           │
└────┴────────┴──────────────────────────────────────────┴─────────────────────────────────────┴─────────────┘

 Module 3 — DOCTOR (/api/v1/doctor/*)

┌────┬────────┬──────────────────────────────────────────┬─────────────────────────────────────┬─────────────┐
│ #  │ Method │ Endpoint                                 │ Mô tả                               │ FR          │
├────┼────────┼──────────────────────────────────────────┼─────────────────────────────────────┼─────────────┤
│  1 │ GET    │ /queue                                   │ Danh sách bệnh nhân chờ của tôi     │ FR-DR-01    │
│  2 │ POST   │ /queue/{ticketId}/call                   │ Nhấn "Tiếp nhận" → trigger LED      │ FR-DR-01    │
│  3 │ GET    │ /patients/{id}/emr                       │ Xem EMR (lịch sử)                   │ FR-DR-02    │
│  4 │ POST   │ /visits/{id}/clinical-note               │ Nhập triệu chứng, sinh tồn          │ FR-DR-02    │
│  5 │ POST   │ /visits/{id}/lab-orders                  │ Chỉ định CLS → status PENDING_LAB   │ FR-DR-03    │
│  6 │ POST   │ /visits/{id}/prescription                │ Kê đơn (cảnh báo dị ứng)            │ FR-DR-04    │
│  7 │ POST   │ /visits/{id}/complete                    │ Kết luận + ICD-10 → COMPLETED       │ FR-DR-04    │
│  8 │ GET    │ /visits/{id}/lab-results                 │ Xem KQ CLS khi có                   │ FR-DR-03    │
└────┴────────┴──────────────────────────────────────────┴─────────────────────────────────────┴─────────────┘

 Module 4 — ADMIN (/api/v1/admin/*)

┌────┬────────┬──────────────────────────────────────────┬─────────────────────────────────────┬─────────────┐
│ #  │ Method │ Endpoint                                 │ Mô tả                               │ FR          │
├────┼────────┼──────────────────────────────────────────┼─────────────────────────────────────┼─────────────┤
│  1 │ GET    │ /dashboard/metrics                       │ Số ca, thời gian chờ TB             │ FR-AD-01    │
│  2 │ GET    │ /dashboard/alerts                        │ Cảnh báo quá tải                    │ FR-AD-01    │
│  3 │ CRUD   │ /drugs                                   │ Danh mục thuốc                      │ FR-AD-02    │
│  4 │ CRUD   │ /specialties                             │ Danh mục chuyên khoa + giá          │ FR-AD-02    │
│  5 │ CRUD   │ /services/prices                         │ Bảng giá dịch vụ                    │ FR-AD-02    │
│  6 │ CRUD   │ /schedules                               │ Lịch ca trực bác sĩ                 │ FR-AD-03    │
│  7 │ CRUD   │ /users                                   │ Tạo tài khoản nhân viên             │ FR-AD-04    │
│  8 │ PATCH  │ /users/{id}/role                         │ Phân quyền                          │ FR-AD-04    │
│  9 │ GET    │ /reports/revenue?from=&to=               │ Báo cáo doanh thu                   │ —           │
│ 10 │ GET    │ /reports/operations?from=&to=            │ Báo cáo vận hành                    │ —           │
└────┴────────┴──────────────────────────────────────────┴─────────────────────────────────────┴─────────────┘

---

## 5. Sample Request/Response

### 5.1 `POST /api/v1/patient/appointments` — FR-PT-01/02

**Request:**

```json
{
  "doctorId": "01HX7K2M9P",
  "slotId": "01HX7K3A1B",
  "date": "2026-11-20",
  "reason": "Đau đầu kéo dài"
}
Response 201:
{
  "data": {
    "id": "01HX7K5C2D",
    "status": "BOOKED",
    "qrCode": "APT-01HX7K5C2D-7F3A9B",
    "doctor": {
      "id": "01HX7K2M9P",
      "fullName": "BS. Nguyễn Văn A",
      "roomNo": "P201"
    },
    "slot": {
      "start": "2026-11-20T09:30:00+07:00",
      "end": "2026-11-20T09:45:00+07:00"
    },
    "patient": {
      "id": "01HX7A1B2C",
      "fullName": "Trần Thị B"
    },
    "createdAt": "2026-11-14T10:00:00+07:00"
  },
  "meta": {
    "notificationSent": {
      "email": true,
      "sms": false
    }
  }
}

5.2 POST /api/v1/reception/visits/{id}/payment + enqueue — FR-RC-02

Request payment:
{
  "amount": 150000,
  "method": "CASH",
  "note": "Phí khám chuyên khoa Nội"
}
Response:
{
  "data": {
    "invoiceId": "01HX7K6D3E",
    "status": "PAID",
    "paidAt": "2026-11-20T08:55:00+07:00"
  }
}
Request enqueue:
{
  "visitId": "01HX7K5C2D",
  "doctorId": "01HX7K2M9P"
}
Response:
{
  "data": {
    "queueTicket": {
      "id": "01HX7K7E4F", "type": "DOCTOR", "number": 12,
      "status": "WAITING", "position": 4, "estimatedWaitMinutes": 20
    }
  }
}

5.3 Chỉ định CLS — POST /doctor/visits/{id}/lab-orders

Request:
{
  "items": [
    { "code": "XN-MAU", "name": "Xét nghiệm máu tổng quát" },
    { "code": "SA-BUNG", "name": "Siêu âm ổ bụng" }
  ],
  "note": "Nghi ngờ thiếu máu"
}
Response:
{
  "data": {
    "labOrderId": "01HX7K8F5G", "status": "PENDING",
    "visitStatus": "PENDING_LAB", "createdAt": "2026-11-20T09:40:00+07:00"
  }
}

5.4 Kê đơn — POST /doctor/visits/{id}/prescription

Request:
{
  "items": [
    { "drugId": "01HX7D1A", "dosage": "500mg x 2 lần/ngày", "qty": 10, "days": 5 }
  ],
  "diagnosisIcd10": "R51",
  "advice": "Uống nhiều nước, tái khám sau 5 ngày"
}
Response 201:
{
  "data": {
    "prescriptionId": "01HX7K9G6H",
    "warnings": [
      {
        "type": "ALLERGY", "drugId": "01HX7D1A", "severity": "HIGH",
        "message": "Bệnh nhân dị ứng Penicillin — thuốc này chứa Amoxicillin"
      }
    ],
    "requiresConfirmation": true
  }
}

5.5 Dashboard — GET /admin/dashboard/metrics
Response:
{
  "data": {
    "date": "2026-11-14", "totalVisits": 87,
    "avgWaitMinutes": { "reception": 8, "doctor": 25 },
    "byDoctor": [
      { "doctorId": "01HX7K2M9P", "name": "BS. Nguyễn Văn A", "visits": 22, "avgConsultMinutes": 12 }
    ],
    "overloadAlerts": [
      { "roomNo": "P201", "waiting": 15, "threshold": 10, "level": "RED" }
    ]
  }
}
---

## 6. Traceability — FR → Endpoint

| FR | Endpoint(s) |
| :--- | :--- |
| FR-PT-01 | `POST /patient/appointments`, `GET /specialties`, `GET /doctors/{id}/slots` |
| FR-PT-02 | Tự động trong response `POST /appointments` (`qrCode` + `meta.notificationSent`) |
| FR-PT-03 | `POST /patient/checkin` |
| FR-PT-04 | `GET /patient/me/*` (prescriptions, visits, invoices) |
| FR-RC-01 | `POST /reception/checkin/scan`, `GET /reception/patients/search`, `POST/PATCH /reception/patients` |
| FR-RC-02 | `POST /reception/visits/{id}/payment`, `POST /reception/visits/{id}/enqueue` |
| FR-DR-01 | `GET /doctor/queue`, `POST /doctor/queue/{ticketId}/call` |
| FR-DR-02 | `GET /doctor/patients/{id}/emr`, `POST /doctor/visits/{id}/clinical-note` |
| FR-DR-03 | `POST /doctor/visits/{id}/lab-orders` |
| FR-DR-04 | `POST /doctor/visits/{id}/prescription`, `POST /doctor/visits/{id}/complete` |
| FR-AD-01 | `GET /admin/dashboard/metrics`, `/alerts` |
| FR-AD-02 | CRUD `/admin/drugs`, `/specialties`, `/services/prices` |
| FR-AD-03 | CRUD `/admin/schedules` |
| FR-AD-04 | CRUD `/admin/users`, `PATCH /users/{id}/role` |

---

**— HẾT —**



