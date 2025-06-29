
<?php
require_once 'config/database.php';

class LogController {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function createLoadingLog() {
        $user = getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->unit_id) || !isset($data->tanggal_mulai) || !isset($data->waktu_mulai) || !isset($data->lokasi)) {
            http_response_code(400);
            echo json_encode(['error' => 'Required fields missing']);
            return;
        }

        try {
            $id = uniqid();

            $query = "INSERT INTO loading_logs (id, unit_id, tanggal_mulai, waktu_mulai, tanggal_selesai, waktu_selesai, lokasi, created_by, created_at, updated_at) 
                      VALUES (:id, :unit_id, :tanggal_mulai, :waktu_mulai, :tanggal_selesai, :waktu_selesai, :lokasi, :created_by, NOW(), NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':unit_id', $data->unit_id);
            $stmt->bindParam(':tanggal_mulai', $data->tanggal_mulai);
            $stmt->bindParam(':waktu_mulai', $data->waktu_mulai);
            $stmt->bindParam(':tanggal_selesai', $data->tanggal_selesai ?? null);
            $stmt->bindParam(':waktu_selesai', $data->waktu_selesai ?? null);
            $stmt->bindParam(':lokasi', $data->lokasi);
            $stmt->bindParam(':created_by', $user['user_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create loading log']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createSegelLog() {
        $user = getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        // Handle file upload if present
        $fotoSegelUrl = null;
        if (isset($_FILES['foto_segel'])) {
            $fotoSegelUrl = $this->handleFileUpload($_FILES['foto_segel']);
        }

        $data = json_decode($_POST['data'] ?? file_get_contents("php://input"));

        try {
            $id = uniqid();

            $query = "INSERT INTO segel_logs (id, unit_id, foto_segel_url, nomor_segel_1, nomor_segel_2, lokasi, created_by, created_at) 
                      VALUES (:id, :unit_id, :foto_segel_url, :nomor_segel_1, :nomor_segel_2, :lokasi, :created_by, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':unit_id', $data->unit_id);
            $stmt->bindParam(':foto_segel_url', $fotoSegelUrl);
            $stmt->bindParam(':nomor_segel_1', $data->nomor_segel_1);
            $stmt->bindParam(':nomor_segel_2', $data->nomor_segel_2);
            $stmt->bindParam(':lokasi', $data->lokasi);
            $stmt->bindParam(':created_by', $user['user_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create segel log']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createFuelmanLog() {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'fuelman') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        try {
            $id = uniqid();

            $query = "INSERT INTO fuelman_logs (id, unit_id, waktu_mulai, waktu_selesai, foto_segel_url, lokasi, flowmeter_a, flowmeter_b, fm_awal, fm_akhir, status, created_by, created_at) 
                      VALUES (:id, :unit_id, :waktu_mulai, :waktu_selesai, :foto_segel_url, :lokasi, :flowmeter_a, :flowmeter_b, :fm_awal, :fm_akhir, :status, :created_by, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':unit_id', $data->unit_id);
            $stmt->bindParam(':waktu_mulai', $data->waktu_mulai ?? null);
            $stmt->bindParam(':waktu_selesai', $data->waktu_selesai ?? null);
            $stmt->bindParam(':foto_segel_url', $data->foto_segel_url ?? null);
            $stmt->bindParam(':lokasi', $data->lokasi);
            $stmt->bindParam(':flowmeter_a', $data->flowmeter_a ?? null);
            $stmt->bindParam(':flowmeter_b', $data->flowmeter_b ?? null);
            $stmt->bindParam(':fm_awal', $data->fm_awal ?? null);
            $stmt->bindParam(':fm_akhir', $data->fm_akhir ?? null);
            $stmt->bindParam(':status', $data->status);
            $stmt->bindParam(':created_by', $user['user_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create fuelman log']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getFuelmanLogs() {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'fuelman') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        try {
            $query = "SELECT * FROM fuelman_logs ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($logs);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createPengawasDepoLog() {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'pengawas_depo') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        try {
            $id = uniqid();

            $query = "INSERT INTO pengawas_depo_logs (id, unit_id, waktu_tiba, foto_segel_url, foto_sib_url, foto_ftw_url, foto_p2h_url, msf_completed, created_by, created_at) 
                      VALUES (:id, :unit_id, :waktu_tiba, :foto_segel_url, :foto_sib_url, :foto_ftw_url, :foto_p2h_url, :msf_completed, :created_by, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':unit_id', $data->unit_id);
            $stmt->bindParam(':waktu_tiba', $data->waktu_tiba);
            $stmt->bindParam(':foto_segel_url', $data->foto_segel_url ?? null);
            $stmt->bindParam(':foto_sib_url', $data->foto_sib_url ?? null);
            $stmt->bindParam(':foto_ftw_url', $data->foto_ftw_url ?? null);
            $stmt->bindParam(':foto_p2h_url', $data->foto_p2h_url ?? null);
            $stmt->bindParam(':msf_completed', $data->msf_completed ?? false, PDO::PARAM_BOOL);
            $stmt->bindParam(':created_by', $user['user_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create pengawas depo log']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createKeluarPertaminaLog() {
        $user = getCurrentUser();
        if (!$user || $user['role'] !== 'driver') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        try {
            $id = uniqid();

            $query = "INSERT INTO keluar_pertamina_logs (id, unit_id, tanggal_keluar, waktu_keluar, lokasi, created_by, created_at) 
                      VALUES (:id, :unit_id, :tanggal_keluar, :waktu_keluar, :lokasi, :created_by, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':unit_id', $data->unit_id);
            $stmt->bindParam(':tanggal_keluar', $data->tanggal_keluar);
            $stmt->bindParam(':waktu_keluar', $data->waktu_keluar);
            $stmt->bindParam(':lokasi', $data->lokasi);
            $stmt->bindParam(':created_by', $user['user_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create keluar pertamina log']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createDokumenLog() {
        $user = getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));

        try {
            $id = uniqid();

            $query = "INSERT INTO dokumen_logs (id, unit_id, foto_sampel_url, foto_do_url, foto_surat_jalan_url, lokasi, created_by, created_at) 
                      VALUES (:id, :unit_id, :foto_sampel_url, :foto_do_url, :foto_surat_jalan_url, :lokasi, :created_by, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':unit_id', $data->unit_id);
            $stmt->bindParam(':foto_sampel_url', $data->foto_sampel_url ?? null);
            $stmt->bindParam(':foto_do_url', $data->foto_do_url ?? null);
            $stmt->bindParam(':foto_surat_jalan_url', $data->foto_surat_jalan_url ?? null);
            $stmt->bindParam(':lokasi', $data->lokasi);
            $stmt->bindParam(':created_by', $user['user_id']);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create dokumen log']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function getLogsByUnit($unitId) {
        $user = getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        if (!$unitId) {
            http_response_code(400);
            echo json_encode(['error' => 'Unit ID is required']);
            return;
        }

        try {
            $logs = [];

            // Get loading logs
            $query = "SELECT * FROM loading_logs WHERE unit_id = :unit_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':unit_id', $unitId);
            $stmt->execute();
            $logs['loading_logs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get segel logs
            $query = "SELECT * FROM segel_logs WHERE unit_id = :unit_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':unit_id', $unitId);
            $stmt->execute();
            $logs['segel_logs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get fuelman logs
            $query = "SELECT * FROM fuelman_logs WHERE unit_id = :unit_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':unit_id', $unitId);
            $stmt->execute();
            $logs['fuelman_logs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get pengawas depo logs
            $query = "SELECT * FROM pengawas_depo_logs WHERE unit_id = :unit_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':unit_id', $unitId);
            $stmt->execute();
            $logs['pengawas_depo_logs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get keluar pertamina logs
            $query = "SELECT * FROM keluar_pertamina_logs WHERE unit_id = :unit_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':unit_id', $unitId);
            $stmt->execute();
            $logs['keluar_pertamina_logs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get dokumen logs
            $query = "SELECT * FROM dokumen_logs WHERE unit_id = :unit_id ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':unit_id', $unitId);
            $stmt->execute();
            $logs['dokumen_logs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($logs);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    private function handleFileUpload($file) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileName = time() . '_' . $file['name'];
        $uploadPath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            return 'uploads/' . $fileName;
        }

        return null;
    }
}
?>
